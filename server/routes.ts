import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { jsPDF } from "jspdf";
import { storage } from "./storage";
import { AuthService } from "./services/auth";
import { OCRService } from "./services/ocr";
import { authenticateAdmin, type AuthenticatedRequest } from "./middleware/auth";
import { loginSchema, studentSearchSchema, insertStudentRecordSchema, changePasswordSchema, insertSemesterSchema, updateProfileSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
const pdfsDir = path.join(process.cwd(), "pdfs");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true });
}

// Function to convert JPG to PDF
async function convertJPGToPDF(imagePath: string, outputPath: string): Promise<void> {
  try {
    // Read and process the image with Sharp
    const imageBuffer = await sharp(imagePath)
      .resize(794, 1123, { // A4 size in pixels at 96 DPI
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 794;
    const height = metadata.height || 1123;

    // Create PDF with jsPDF
    const pdf = new jsPDF({
      orientation: height > width ? 'portrait' : 'landscape',
      unit: 'px',
      format: [width, height]
    });

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;

    // Add image to PDF
    pdf.addImage(dataURI, 'JPEG', 0, 0, width, height);
    
    // Save PDF
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    fs.writeFileSync(outputPath, pdfBuffer);
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw new Error('Failed to convert image to PDF');
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/JPEG/PNG/PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 50, // Allow up to 50 files at once
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Check database connectivity
      await storage.getAllAdmins();
      res.status(200).json({ 
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        database: "connected"
      });
    } catch (error) {
      res.status(503).json({ 
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed"
      });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await AuthService.verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = AuthService.generateToken(admin);
      
      res.json({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Verify admin token
  app.get("/api/admin/verify", authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    const admin = await storage.getAdminById(req.admin!.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  });

  // Get all admin users
  app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      const sanitizedAdmins = admins.map(admin => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
      }));
      res.json(sanitizedAdmins);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch administrators" });
    }
  });

  // Create new admin user
  app.post("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const { name, email, password } = adminRegistrationSchema.parse(req.body);
      
      // Check if admin with this email already exists
      const existingAdmin = await storage.getAdminByEmail(email);
      if (existingAdmin) {
        return res.status(400).json({ message: "An administrator with this email already exists" });
      }
      
      const newAdmin = await storage.createAdmin({ name, email, password });
      
      res.json({
        message: "Administrator created successfully",
        admin: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          createdAt: newAdmin.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("validation")) {
        res.status(400).json({ message: "Invalid registration data" });
      } else {
        res.status(500).json({ message: "Failed to create administrator" });
      }
    }
  });

  // Change admin password
  app.post("/api/admin/change-password", authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      // Get current admin
      const admin = await storage.getAdminById(req.admin!.id);
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      
      // Verify current password
      const isValidPassword = await AuthService.verifyPassword(currentPassword, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Update password
      await storage.updateAdminPassword(admin.id, newPassword);
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("validation")) {
        res.status(400).json({ message: "Invalid password data" });
      } else {
        res.status(500).json({ message: "Failed to update password" });
      }
    }
  });

  // Update admin profile
  app.post("/api/admin/update-profile", authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, email, currentPassword } = req.body;
      
      // Get current admin
      const admin = await storage.getAdminById(req.admin!.id);
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      
      // Verify current password
      const isValidPassword = await AuthService.verifyPassword(currentPassword, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Update profile
      const updatedAdmin = await storage.updateAdminProfile(admin.id, name, email);
      
      res.json({
        message: "Profile updated successfully",
        admin: {
          id: updatedAdmin.id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Email already in use")) {
        res.status(400).json({ message: "Email already in use by another admin" });
      } else if (error instanceof Error && error.message.includes("validation")) {
        res.status(400).json({ message: "Invalid profile data" });
      } else {
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  });

  // Delete admin user
  app.delete("/api/admin/users/:id", authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const adminId = parseInt(req.params.id);
      
      // Prevent self-deletion
      if (adminId === req.admin!.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      
      await storage.deleteAdmin(adminId);
      res.json({ message: "Administrator deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Cannot delete the last admin")) {
        res.status(400).json({ message: "Cannot delete the last administrator account" });
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: "Administrator not found" });
      } else {
        res.status(500).json({ message: "Failed to delete administrator" });
      }
    }
  });

  // Semester management routes
  
  // Get all semesters
  app.get("/api/admin/semesters", authenticateAdmin, async (req, res) => {
    try {
      const semesters = await storage.getAllSemesters();
      res.json(semesters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch semesters" });
    }
  });

  // Create new semester
  app.post("/api/admin/semesters", authenticateAdmin, async (req, res) => {
    try {
      const semesterData = insertSemesterSchema.parse(req.body);
      const newSemester = await storage.createSemester(semesterData);
      res.json(newSemester);
    } catch (error) {
      if (error instanceof Error && error.message.includes("validation")) {
        res.status(400).json({ message: "Invalid semester data" });
      } else {
        res.status(500).json({ message: "Failed to create semester" });
      }
    }
  });

  // Update semester
  app.put("/api/admin/semesters/:id", authenticateAdmin, async (req, res) => {
    try {
      const semesterId = parseInt(req.params.id);
      const semesterData = req.body;
      const updatedSemester = await storage.updateSemester(semesterId, semesterData);
      res.json(updatedSemester);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: "Semester not found" });
      } else {
        res.status(500).json({ message: "Failed to update semester" });
      }
    }
  });

  // Delete semester
  app.delete("/api/admin/semesters/:id", authenticateAdmin, async (req, res) => {
    try {
      const semesterId = parseInt(req.params.id);
      await storage.deleteSemester(semesterId);
      res.json({ message: "Semester deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: "Semester not found" });
      } else if (error instanceof Error && error.message.includes("Cannot delete active semester")) {
        res.status(400).json({ message: "Cannot delete active semester" });
      } else {
        res.status(500).json({ message: "Failed to delete semester" });
      }
    }
  });

  // Set active semester
  app.post("/api/admin/semesters/:id/activate", authenticateAdmin, async (req, res) => {
    try {
      const semesterId = parseInt(req.params.id);
      await storage.setActiveSemester(semesterId);
      res.json({ message: "Active semester updated successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: "Semester not found" });
      } else {
        res.status(500).json({ message: "Failed to update active semester" });
      }
    }
  });

  // Get semester statistics
  app.get("/api/admin/semester-stats", authenticateAdmin, async (req, res) => {
    try {
      const semesters = await storage.getAllSemesters();
      const stats: Record<number, { studentCount: number; passCount: number; failCount: number }> = {};
      
      for (const semester of semesters) {
        const records = await storage.getStudentRecordsBySemester(semester.id);
        const passCount = records.filter(r => r.result === "Passed").length;
        const failCount = records.filter(r => r.result === "Failed").length;
        
        stats[semester.id] = {
          studentCount: records.length,
          passCount,
          failCount
        };
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch semester statistics" });
    }
  });

  // Upload and process student images
  app.post("/api/admin/upload", authenticateAdmin, upload.array("studentImages", 50), async (req: AuthenticatedRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { semesterId } = req.body;
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Get active semester if no semester specified
      let activeSemester = null;
      if (semesterId) {
        activeSemester = await storage.getSemesterById(parseInt(semesterId));
      } else {
        const semesters = await storage.getAllSemesters();
        activeSemester = semesters.find(s => s.isActive);
      }

      if (!activeSemester) {
        return res.status(400).json({ message: "No active semester found. Please create and activate a semester first." });
      }

      const results = [];

      for (const file of files) {
        try {
          // Read file buffer for OCR processing
          const fileBuffer = fs.readFileSync(file.path);
          
          // Extract data using enhanced OCR on JPG
          const ocrResult = await OCRService.extractDataFromJPG(fileBuffer, file.originalname);
          
          // Validate that we got meaningful data
          if (ocrResult.name === "Name not found" || ocrResult.tuRegd === "Registration not found") {
            throw new Error("Could not extract valid student information from JPG image");
          }
          
          // Convert JPG to PDF
          const pdfFileName = `${path.parse(file.filename).name}.pdf`;
          const pdfPath = path.join(pdfsDir, pdfFileName);
          await convertJPGToPDF(file.path, pdfPath);

          // Store in database with enhanced fields
          const studentRecord = await storage.createStudentRecord({
            name: ocrResult.name,
            tuRegd: ocrResult.tuRegd,
            result: ocrResult.result,
            grade: ocrResult.grade || null,
            marks: ocrResult.marks || null,
            totalMarks: ocrResult.totalMarks || null,
            subject: ocrResult.subject || null,
            program: ocrResult.program || null,
            faculty: ocrResult.faculty || null,
            semesterId: activeSemester.id,
            imagePath: file.path,
            pdfPath: pdfPath,
            originalFilename: file.originalname,
            fileSize: file.size,
            uploadedBy: req.admin!.id,
          });

          results.push({
            filename: file.originalname,
            success: true,
            extracted: ocrResult,
            recordId: studentRecord.id,
          });
        } catch (error) {
          // Clean up files on error
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          
          // Clean up PDF if it was created
          const pdfFileName = `${path.parse(file.filename).name}.pdf`;
          const pdfPath = path.join(pdfsDir, pdfFileName);
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
          
          const errorMessage = error instanceof Error ? error.message : "Failed to process JPG image";
          console.error(`OCR processing failed for ${file.originalname}:`, errorMessage);
          
          results.push({
            filename: file.originalname,
            success: false,
            error: errorMessage,
          });
        }
      }

      res.json({ results });
    } catch (error) {
      res.status(500).json({ message: "Upload processing failed" });
    }
  });

  // Get all student records (admin only)
  app.get("/api/admin/records", authenticateAdmin, async (req, res) => {
    try {
      const records = await storage.getAllStudentRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records" });
    }
  });

  // Delete student record (admin only)
  app.delete("/api/admin/records/:id", authenticateAdmin, async (req, res) => {
    try {
      const recordId = parseInt(req.params.id);
      
      // Get record to delete associated file
      const records = await storage.getAllStudentRecords();
      const record = records.find(r => r.id === recordId);
      
      if (record) {
        // Delete both image and PDF files
        if (record.imagePath && fs.existsSync(record.imagePath)) {
          fs.unlinkSync(record.imagePath);
        }
        if (fs.existsSync(record.pdfPath)) {
          fs.unlinkSync(record.pdfPath);
        }
        
        await storage.deleteStudentRecord(recordId);
      }
      
      res.json({ message: "Record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete record" });
    }
  });

  // Delete all student records (admin only)
  app.delete("/api/admin/records", authenticateAdmin, async (req, res) => {
    try {
      // Get all records to delete associated files
      const records = await storage.getAllStudentRecords();
      
      // Delete all associated files
      for (const record of records) {
        if (record.imagePath && fs.existsSync(record.imagePath)) {
          fs.unlinkSync(record.imagePath);
        }
        if (fs.existsSync(record.pdfPath)) {
          fs.unlinkSync(record.pdfPath);
        }
      }
      
      // Delete all records from storage
      await storage.deleteAllStudentRecords();
      
      res.json({ 
        message: "All student records deleted successfully", 
        deletedCount: records.length 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete all records" });
    }
  });

  // Student search endpoint
  app.post("/api/get-result", async (req, res) => {
    try {
      const { name, tuRegd } = studentSearchSchema.parse(req.body);
      
      const record = await storage.getStudentRecord(name, tuRegd);
      
      if (!record) {
        return res.status(404).json({ message: "No matching record found" });
      }

      res.json({
        id: record.id,
        name: record.name,
        tuRegd: record.tuRegd,
        result: record.result,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Preview image endpoint
  app.get("/api/preview/:id", async (req, res) => {
    try {
      const recordId = parseInt(req.params.id);
      const records = await storage.getAllStudentRecords();
      const record = records.find(r => r.id === recordId);
      
      if (!record || !record.imagePath || !fs.existsSync(record.imagePath)) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Set proper headers for image preview
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      // Stream the image file
      const imageStream = fs.createReadStream(record.imagePath);
      imageStream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: "Preview failed" });
    }
  });

  // Download PDF endpoint
  app.get("/api/download/:id", async (req, res) => {
    try {
      const recordId = parseInt(req.params.id);
      const records = await storage.getAllStudentRecords();
      const record = records.find(r => r.id === recordId);
      
      if (!record || !fs.existsSync(record.pdfPath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.download(record.pdfPath, `${record.name}_${record.tuRegd}.pdf`);
    } catch (error) {
      res.status(500).json({ message: "Download failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

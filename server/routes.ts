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
import { loginSchema, studentSearchSchema, insertStudentRecordSchema } from "@shared/schema";

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
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/JPEG files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Upload and process student images
  app.post("/api/admin/upload", authenticateAdmin, upload.array("studentImages", 10), async (req: AuthenticatedRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const results = [];

      for (const file of files) {
        try {
          // Read file buffer for OCR processing
          const fileBuffer = fs.readFileSync(file.path);
          
          // Extract data using OCR on JPG
          const ocrResult = await OCRService.extractDataFromJPG(fileBuffer, file.originalname);
          
          // Validate that we got meaningful data
          if (ocrResult.name === "Name not found" || ocrResult.tuRegd === "Registration not found") {
            throw new Error("Could not extract valid student information from JPG image");
          }
          
          // Convert JPG to PDF
          const pdfFileName = `${path.parse(file.filename).name}.pdf`;
          const pdfPath = path.join(pdfsDir, pdfFileName);
          await convertJPGToPDF(file.path, pdfPath);

          // Store in database
          const studentRecord = await storage.createStudentRecord({
            name: ocrResult.name,
            tuRegd: ocrResult.tuRegd,
            result: ocrResult.result,
            imagePath: file.path,
            pdfPath: pdfPath,
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
        marks: record.marks,
        uploadedAt: record.uploadedAt,
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

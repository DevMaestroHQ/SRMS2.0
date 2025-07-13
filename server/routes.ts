import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { AuthService } from "./services/auth";
import { OCRService } from "./services/ocr";
import { authenticateAdmin, type AuthenticatedRequest } from "./middleware/auth";
import { loginSchema, studentSearchSchema, insertStudentRecordSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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

  // Upload and process marksheets
  app.post("/api/admin/upload", authenticateAdmin, upload.array("marksheets", 10), async (req: AuthenticatedRequest, res) => {
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
          
          // Extract data using OCR
          const ocrResult = await OCRService.extractDataFromPDF(fileBuffer, file.originalname);
          
          // Store in database
          const studentRecord = await storage.createStudentRecord({
            name: ocrResult.name,
            tuRegd: ocrResult.tuRegd,
            marks: ocrResult.marks,
            pdfPath: file.path,
            uploadedBy: req.admin!.id,
          });

          results.push({
            filename: file.originalname,
            success: true,
            extracted: ocrResult,
            recordId: studentRecord.id,
          });
        } catch (error) {
          // Clean up file on error
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          
          results.push({
            filename: file.originalname,
            success: false,
            error: "Failed to process PDF",
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
        // Delete PDF file
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

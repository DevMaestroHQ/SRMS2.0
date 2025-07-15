import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import type { IStorage } from './storage';
import type { 
  Admin, 
  InsertAdmin, 
  Semester, 
  InsertSemester, 
  StudentRecord, 
  InsertStudentRecord, 
  FileUpload, 
  InsertFileUpload 
} from '@shared/schema';

interface DatabaseData {
  admins: Admin[];
  semesters: Semester[];
  studentRecords: StudentRecord[];
  fileUploads: FileUpload[];
  nextIds: {
    admin: number;
    semester: number;
    studentRecord: number;
    fileUpload: number;
  };
}

export class JsonStorage implements IStorage {
  private dataPath: string;
  private data: DatabaseData;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'database.json');
    this.ensureDataDirectory();
    this.loadData();
    this.initializeDefaultData();
  }

  private async initializeDefaultData(): Promise<void> {
    try {
      // Create default admin if doesn't exist
      const adminEmail = process.env.ADMIN_EMAIL || "admin@university.edu";
      const existingAdmin = await this.getAdminByEmail(adminEmail);
      
      if (!existingAdmin) {
        await this.createAdmin({
          name: process.env.ADMIN_NAME || "System Administrator",
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD || "admin123"
        });
        console.log("Default admin created");
      }
      
      // Create default semester if none exists
      if (this.data.semesters.length === 0) {
        await this.createSemester({
          name: "Spring 2025",
          year: 2025,
          isActive: true
        });
        console.log("Default semester created");
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private loadData(): void {
    try {
      if (fs.existsSync(this.dataPath)) {
        const rawData = fs.readFileSync(this.dataPath, 'utf8');
        this.data = JSON.parse(rawData);
      } else {
        this.data = {
          admins: [],
          semesters: [],
          studentRecords: [],
          fileUploads: [],
          nextIds: {
            admin: 1,
            semester: 1,
            studentRecord: 1,
            fileUpload: 1
          }
        };
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = {
        admins: [],
        semesters: [],
        studentRecords: [],
        fileUploads: [],
        nextIds: {
          admin: 1,
          semester: 1,
          studentRecord: 1,
          fileUpload: 1
        }
      };
      this.saveData();
    }
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  private generateId(type: keyof DatabaseData['nextIds']): number {
    const id = this.data.nextIds[type];
    this.data.nextIds[type] = id + 1;
    return id;
  }

  // Admin operations
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return this.data.admins.find(admin => admin.email === email);
  }

  async getAdminById(id: number): Promise<Admin | undefined> {
    return this.data.admins.find(admin => admin.id === id);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const newAdmin: Admin = {
      id: this.generateId('admin'),
      name: admin.name,
      email: admin.email,
      password: hashedPassword,
      createdAt: new Date()
    };
    this.data.admins.push(newAdmin);
    this.saveData();
    return newAdmin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return this.data.admins;
  }

  async updateAdminPassword(adminId: number, newPassword: string): Promise<void> {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    this.saveData();
  }

  async updateAdminProfile(adminId: number, name: string, email: string): Promise<Admin> {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    // Check if email is already in use by another admin
    const existingAdmin = this.data.admins.find(a => a.email === email && a.id !== adminId);
    if (existingAdmin) {
      throw new Error('Email already in use by another admin');
    }
    
    admin.name = name;
    admin.email = email;
    this.saveData();
    return admin;
  }

  async deleteAdmin(adminId: number): Promise<void> {
    if (this.data.admins.length <= 1) {
      throw new Error('Cannot delete the last admin');
    }
    
    const index = this.data.admins.findIndex(a => a.id === adminId);
    if (index === -1) {
      throw new Error('Admin not found');
    }
    
    this.data.admins.splice(index, 1);
    this.saveData();
  }

  // Semester operations
  async createSemester(semester: InsertSemester): Promise<Semester> {
    const newSemester: Semester = {
      id: this.generateId('semester'),
      name: semester.name,
      year: semester.year,
      isActive: semester.isActive || false,
      createdAt: new Date()
    };
    
    // If this is set as active, deactivate others
    if (newSemester.isActive) {
      this.data.semesters.forEach(s => s.isActive = false);
    }
    
    this.data.semesters.push(newSemester);
    this.saveData();
    return newSemester;
  }

  async getAllSemesters(): Promise<Semester[]> {
    return this.data.semesters.sort((a, b) => b.year - a.year);
  }

  async getSemesterById(id: number): Promise<Semester | undefined> {
    return this.data.semesters.find(s => s.id === id);
  }

  async updateSemester(id: number, data: Partial<InsertSemester>): Promise<Semester> {
    const semester = this.data.semesters.find(s => s.id === id);
    if (!semester) {
      throw new Error('Semester not found');
    }
    
    if (data.name) semester.name = data.name;
    if (data.year) semester.year = data.year;
    if (data.isActive !== undefined) {
      if (data.isActive) {
        // Deactivate all other semesters
        this.data.semesters.forEach(s => s.isActive = false);
      }
      semester.isActive = data.isActive;
    }
    
    this.saveData();
    return semester;
  }

  async deleteSemester(id: number): Promise<void> {
    const index = this.data.semesters.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Semester not found');
    }
    
    this.data.semesters.splice(index, 1);
    
    // Also remove related student records
    this.data.studentRecords = this.data.studentRecords.filter(r => r.semesterId !== id);
    
    this.saveData();
  }

  async setActiveSemester(id: number): Promise<void> {
    const semester = this.data.semesters.find(s => s.id === id);
    if (!semester) {
      throw new Error('Semester not found');
    }
    
    // Deactivate all semesters
    this.data.semesters.forEach(s => s.isActive = false);
    
    // Activate the selected semester
    semester.isActive = true;
    
    this.saveData();
  }

  // Student record operations
  async createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord> {
    const newRecord: StudentRecord = {
      id: this.generateId('studentRecord'),
      name: record.name,
      tuRegd: record.tuRegd,
      result: record.result,
      grade: record.grade || null,
      marks: record.marks || null,
      totalMarks: record.totalMarks || null,
      subject: record.subject || null,
      program: record.program || null,
      faculty: record.faculty || null,
      semesterId: record.semesterId,
      imagePath: record.imagePath || null,
      pdfPath: record.pdfPath,
      originalFilename: record.originalFilename,
      fileSize: record.fileSize,
      uploadedBy: record.uploadedBy,
      createdAt: new Date()
    };
    
    this.data.studentRecords.push(newRecord);
    this.saveData();
    return newRecord;
  }

  async getStudentRecord(name: string, tuRegd: string): Promise<StudentRecord | undefined> {
    return this.data.studentRecords.find(r => 
      r.name.toLowerCase().trim() === name.toLowerCase().trim() && 
      r.tuRegd.toLowerCase().trim() === tuRegd.toLowerCase().trim()
    );
  }

  async getAllStudentRecords(): Promise<StudentRecord[]> {
    return this.data.studentRecords.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getStudentRecordsBySemester(semesterId: number): Promise<StudentRecord[]> {
    return this.data.studentRecords.filter(r => r.semesterId === semesterId);
  }

  async deleteStudentRecord(id: number): Promise<void> {
    const index = this.data.studentRecords.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Student record not found');
    }
    
    this.data.studentRecords.splice(index, 1);
    this.saveData();
  }

  async deleteAllStudentRecords(): Promise<void> {
    this.data.studentRecords = [];
    this.saveData();
  }

  // File upload operations
  async createFileUpload(upload: InsertFileUpload): Promise<FileUpload> {
    const newUpload: FileUpload = {
      id: this.generateId('fileUpload'),
      filename: upload.filename,
      originalName: upload.originalName,
      mimeType: upload.mimeType,
      size: upload.size,
      path: upload.path,
      uploadedBy: upload.uploadedBy,
      createdAt: new Date()
    };
    
    this.data.fileUploads.push(newUpload);
    this.saveData();
    return newUpload;
  }

  async getFileUploadById(id: number): Promise<FileUpload | undefined> {
    return this.data.fileUploads.find(f => f.id === id);
  }

  async getAllFileUploads(): Promise<FileUpload[]> {
    return this.data.fileUploads.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteFileUpload(id: number): Promise<void> {
    const index = this.data.fileUploads.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('File upload not found');
    }
    
    this.data.fileUploads.splice(index, 1);
    this.saveData();
  }
}
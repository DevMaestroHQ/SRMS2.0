import { admins, studentRecords, type Admin, type InsertAdmin, type StudentRecord, type InsertStudentRecord } from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // Admin operations
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAdminById(id: number): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAllAdmins(): Promise<Admin[]>;
  updateAdminPassword(adminId: number, newPassword: string): Promise<void>;
  deleteAdmin(adminId: number): Promise<void>;
  
  // Student record operations
  createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord>;
  getStudentRecord(name: string, tuRegd: string): Promise<StudentRecord | undefined>;
  getAllStudentRecords(): Promise<StudentRecord[]>;
  deleteStudentRecord(id: number): Promise<void>;
  deleteAllStudentRecords(): Promise<void>;
}

export class MemStorage implements IStorage {
  private admins: Map<number, Admin>;
  private studentRecords: Map<number, StudentRecord>;
  private currentAdminId: number;
  private currentRecordId: number;

  constructor() {
    this.admins = new Map();
    this.studentRecords = new Map();
    this.currentAdminId = 1;
    this.currentRecordId = 1;
    
    // Create default admin
    this.initializeDefaultAdmin();
    
    // Add sample student records
    this.addSampleData();
  }

  private async initializeDefaultAdmin() {
    // Use environment variables for production security
    const adminEmail = process.env.ADMIN_EMAIL || "admin@university.edu";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "System Administrator";
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const defaultAdmin: Admin = {
      id: this.currentAdminId++,
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      createdAt: new Date(),
    };
    this.admins.set(defaultAdmin.id, defaultAdmin);
  }

  private addSampleData() {
    // Add sample student records for testing
    const sampleRecords = [
      {
        id: this.currentRecordId++,
        name: "John Doe",
        tuRegd: "12345678",
        result: "Passed",
        imagePath: "/sample/path1.jpg",
        pdfPath: "/sample/path1.pdf",
        uploadedAt: new Date(),
        uploadedBy: 1,
      },
      {
        id: this.currentRecordId++,
        name: "Jane Smith",
        tuRegd: "87654321",
        result: "Failed",
        imagePath: "/sample/path2.jpg",
        pdfPath: "/sample/path2.pdf",
        uploadedAt: new Date(),
        uploadedBy: 1,
      },
      {
        id: this.currentRecordId++,
        name: "Alice Johnson",
        tuRegd: "11111111",
        result: "Passed",
        imagePath: "/sample/path3.jpg",
        pdfPath: "/sample/path3.pdf",
        uploadedAt: new Date(),
        uploadedBy: 1,
      },
    ];

    sampleRecords.forEach(record => {
      this.studentRecords.set(record.id, record);
    });
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.email === email);
  }

  async getAdminById(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(insertAdmin.password, 10);
    const admin: Admin = {
      ...insertAdmin,
      id: this.currentAdminId++,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.admins.set(admin.id, admin);
    return admin;
  }

  async createStudentRecord(insertRecord: InsertStudentRecord): Promise<StudentRecord> {
    const record: StudentRecord = {
      ...insertRecord,
      id: this.currentRecordId++,
      uploadedAt: new Date(),
    };
    this.studentRecords.set(record.id, record);
    return record;
  }

  async getStudentRecord(name: string, tuRegd: string): Promise<StudentRecord | undefined> {
    return Array.from(this.studentRecords.values()).find(
      record => record.name.trim().toLowerCase() === name.trim().toLowerCase() && 
                record.tuRegd.trim() === tuRegd.trim()
    );
  }

  async getAllStudentRecords(): Promise<StudentRecord[]> {
    return Array.from(this.studentRecords.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async deleteStudentRecord(id: number): Promise<void> {
    this.studentRecords.delete(id);
  }

  async deleteAllStudentRecords(): Promise<void> {
    this.studentRecords.clear();
  }

  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateAdminPassword(adminId: number, newPassword: string): Promise<void> {
    const admin = this.admins.get(adminId);
    if (admin) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      this.admins.set(adminId, admin);
    } else {
      throw new Error("Admin not found");
    }
  }

  async deleteAdmin(adminId: number): Promise<void> {
    const totalAdmins = this.admins.size;
    if (totalAdmins <= 1) {
      throw new Error("Cannot delete the last admin account");
    }
    const deleted = this.admins.delete(adminId);
    if (!deleted) {
      throw new Error("Admin not found");
    }
  }
}

export const storage = new MemStorage();

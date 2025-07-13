import { admins, studentRecords, type Admin, type InsertAdmin, type StudentRecord, type InsertStudentRecord } from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // Admin operations
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAdminById(id: number): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Student record operations
  createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord>;
  getStudentRecord(name: string, tuRegd: string): Promise<StudentRecord | undefined>;
  getAllStudentRecords(): Promise<StudentRecord[]>;
  deleteStudentRecord(id: number): Promise<void>;
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
  }

  private async initializeDefaultAdmin() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const defaultAdmin: Admin = {
      id: this.currentAdminId++,
      email: "admin@university.edu",
      password: hashedPassword,
      name: "System Administrator",
      createdAt: new Date(),
    };
    this.admins.set(defaultAdmin.id, defaultAdmin);
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
}

export const storage = new MemStorage();

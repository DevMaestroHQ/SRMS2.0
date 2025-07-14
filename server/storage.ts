import { admins, studentRecords, semesters, fileUploads, type Admin, type InsertAdmin, type StudentRecord, type InsertStudentRecord, type Semester, type InsertSemester, type FileUpload, type InsertFileUpload } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Admin operations
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAdminById(id: number): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAllAdmins(): Promise<Admin[]>;
  updateAdminPassword(adminId: number, newPassword: string): Promise<void>;
  updateAdminProfile(adminId: number, name: string, email: string): Promise<Admin>;
  deleteAdmin(adminId: number): Promise<void>;
  
  // Semester operations
  createSemester(semester: InsertSemester): Promise<Semester>;
  getAllSemesters(): Promise<Semester[]>;
  getSemesterById(id: number): Promise<Semester | undefined>;
  updateSemester(id: number, data: Partial<InsertSemester>): Promise<Semester>;
  deleteSemester(id: number): Promise<void>;
  setActiveSemester(id: number): Promise<void>;
  
  // Student record operations
  createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord>;
  getStudentRecord(name: string, tuRegd: string): Promise<StudentRecord | undefined>;
  getAllStudentRecords(): Promise<StudentRecord[]>;
  getStudentRecordsBySemester(semesterId: number): Promise<StudentRecord[]>;
  deleteStudentRecord(id: number): Promise<void>;
  deleteAllStudentRecords(): Promise<void>;
  
  // File upload operations
  createFileUpload(upload: InsertFileUpload): Promise<FileUpload>;
  getFileUploadById(id: number): Promise<FileUpload | undefined>;
  getAllFileUploads(): Promise<FileUpload[]>;
  deleteFileUpload(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Create default admin if doesn't exist
      const existingAdmin = await this.getAdminByEmail(process.env.ADMIN_EMAIL || "admin@university.edu");
      if (!existingAdmin) {
        await this.createDefaultAdmin();
      }
      
      // Create default semester if none exists
      const existingSemesters = await this.getAllSemesters();
      if (existingSemesters.length === 0) {
        await this.createDefaultSemester();
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  private async createDefaultAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@university.edu";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "System Administrator";
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.createAdmin({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
    });
  }

  private async createDefaultSemester() {
    const currentYear = new Date().getFullYear();
    await this.createSemester({
      name: `Spring ${currentYear}`,
      year: currentYear,
      season: "Spring",
      isActive: true,
    });
  }

  // Admin operations
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || undefined;
  }

  async getAdminById(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return await db.select().from(admins).orderBy(desc(admins.createdAt));
  }

  async updateAdminPassword(adminId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(admins).set({ password: hashedPassword }).where(eq(admins.id, adminId));
  }

  async updateAdminProfile(adminId: number, name: string, email: string): Promise<Admin> {
    const [admin] = await db.update(admins).set({ name, email }).where(eq(admins.id, adminId)).returning();
    return admin;
  }

  async deleteAdmin(adminId: number): Promise<void> {
    await db.delete(admins).where(eq(admins.id, adminId));
  }

  // Semester operations
  async createSemester(insertSemester: InsertSemester): Promise<Semester> {
    // If this semester is being set as active, deactivate all others
    if (insertSemester.isActive) {
      await db.update(semesters).set({ isActive: false });
    }
    
    const [semester] = await db.insert(semesters).values(insertSemester).returning();
    return semester;
  }

  async getAllSemesters(): Promise<Semester[]> {
    return await db.select().from(semesters).orderBy(desc(semesters.year), desc(semesters.createdAt));
  }

  async getSemesterById(id: number): Promise<Semester | undefined> {
    const [semester] = await db.select().from(semesters).where(eq(semesters.id, id));
    return semester || undefined;
  }

  async updateSemester(id: number, data: Partial<InsertSemester>): Promise<Semester> {
    // If setting as active, deactivate all others first
    if (data.isActive) {
      await db.update(semesters).set({ isActive: false });
    }
    
    const [semester] = await db.update(semesters).set(data).where(eq(semesters.id, id)).returning();
    return semester;
  }

  async deleteSemester(id: number): Promise<void> {
    await db.delete(semesters).where(eq(semesters.id, id));
  }

  async setActiveSemester(id: number): Promise<void> {
    // Deactivate all semesters first
    await db.update(semesters).set({ isActive: false });
    // Then activate the selected one
    await db.update(semesters).set({ isActive: true }).where(eq(semesters.id, id));
  }

  // Student record operations
  async createStudentRecord(insertRecord: InsertStudentRecord): Promise<StudentRecord> {
    const [record] = await db.insert(studentRecords).values(insertRecord).returning();
    return record;
  }

  async getStudentRecord(name: string, tuRegd: string): Promise<StudentRecord | undefined> {
    const [record] = await db.select().from(studentRecords)
      .where(and(eq(studentRecords.name, name), eq(studentRecords.tuRegd, tuRegd)));
    return record || undefined;
  }

  async getAllStudentRecords(): Promise<StudentRecord[]> {
    return await db.select().from(studentRecords).orderBy(desc(studentRecords.uploadedAt));
  }

  async getStudentRecordsBySemester(semesterId: number): Promise<StudentRecord[]> {
    return await db.select().from(studentRecords)
      .where(eq(studentRecords.semesterId, semesterId))
      .orderBy(desc(studentRecords.uploadedAt));
  }

  async deleteStudentRecord(id: number): Promise<void> {
    await db.delete(studentRecords).where(eq(studentRecords.id, id));
  }

  async deleteAllStudentRecords(): Promise<void> {
    await db.delete(studentRecords);
  }

  // File upload operations
  async createFileUpload(insertUpload: InsertFileUpload): Promise<FileUpload> {
    const [upload] = await db.insert(fileUploads).values(insertUpload).returning();
    return upload;
  }

  async getFileUploadById(id: number): Promise<FileUpload | undefined> {
    const [upload] = await db.select().from(fileUploads).where(eq(fileUploads.id, id));
    return upload || undefined;
  }

  async getAllFileUploads(): Promise<FileUpload[]> {
    return await db.select().from(fileUploads).orderBy(desc(fileUploads.uploadedAt));
  }

  async deleteFileUpload(id: number): Promise<void> {
    await db.delete(fileUploads).where(eq(fileUploads.id, id));
  }
}

export const storage = new DatabaseStorage();
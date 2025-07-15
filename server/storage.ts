import { JsonStorage } from "./json-storage";
import type { 
  Admin, 
  InsertAdmin, 
  Semester, 
  InsertSemester, 
  StudentRecord, 
  InsertStudentRecord, 
  FileUpload, 
  InsertFileUpload 
} from "@shared/schema";

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

export const storage = new JsonStorage();
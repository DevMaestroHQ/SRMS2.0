import { pgTable, serial, text, timestamp, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Fall 2024", "Spring 2025"
  year: integer("year").notNull(),
  season: text("season").notNull(), // "Spring", "Fall", "Summer"
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentRecords = pgTable("student_records", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tuRegd: text("tu_regd").notNull(),
  result: text("result").notNull(), // "Passed" or "Failed"
  grade: text("grade"), // A+, A, B+, B, C+, C, D+, D, F
  marks: integer("marks"),
  totalMarks: integer("total_marks"),
  subject: text("subject"), // Subject name
  program: text("program"), // Degree program
  faculty: text("faculty"), // Faculty name
  semesterId: integer("semester_id").references(() => semesters.id),
  imagePath: text("image_path").notNull(),
  pdfPath: text("pdf_path").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  uploadedBy: integer("uploaded_by").references(() => admins.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const fileUploads = pgTable("file_uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedBy: integer("uploaded_by").references(() => admins.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Relations
export const adminsRelations = relations(admins, ({ many }) => ({
  studentRecords: many(studentRecords),
  fileUploads: many(fileUploads),
}));

export const semestersRelations = relations(semesters, ({ many }) => ({
  studentRecords: many(studentRecords),
}));

export const studentRecordsRelations = relations(studentRecords, ({ one }) => ({
  uploadedBy: one(admins, {
    fields: [studentRecords.uploadedBy],
    references: [admins.id],
  }),
  semester: one(semesters, {
    fields: [studentRecords.semesterId],
    references: [semesters.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  uploadedBy: one(admins, {
    fields: [fileUploads.uploadedBy],
    references: [admins.id],
  }),
}));

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const insertSemesterSchema = createInsertSchema(semesters).omit({
  id: true,
  createdAt: true,
});

export const insertStudentRecordSchema = createInsertSchema(studentRecords).omit({
  id: true,
  uploadedAt: true,
});

export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({
  id: true,
  uploadedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const studentSearchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tuRegd: z.string().min(1, "T.U. Registration Number is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required for profile changes"),
});

export const semesterSchema = z.object({
  name: z.string().min(1, "Semester name is required"),
  year: z.number().int().min(2000).max(2100),
  season: z.enum(["Spring", "Summer", "Fall"]),
  isActive: z.boolean().default(false),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Semester = typeof semesters.$inferSelect;
export type InsertSemester = z.infer<typeof insertSemesterSchema>;
export type StudentRecord = typeof studentRecords.$inferSelect;
export type InsertStudentRecord = z.infer<typeof insertStudentRecordSchema>;
export type FileUpload = typeof fileUploads.$inferSelect;
export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type StudentSearch = z.infer<typeof studentSearchSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type SemesterData = z.infer<typeof semesterSchema>;
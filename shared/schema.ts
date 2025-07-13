import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentRecords = pgTable("student_records", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tuRegd: text("tu_regd").notNull(),
  marks: text("marks").notNull(),
  imagePath: text("image_path").notNull(),
  pdfPath: text("pdf_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: integer("uploaded_by").references(() => admins.id).notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const insertStudentRecordSchema = createInsertSchema(studentRecords).omit({
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

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type StudentRecord = typeof studentRecords.$inferSelect;
export type InsertStudentRecord = z.infer<typeof insertStudentRecordSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type StudentSearch = z.infer<typeof studentSearchSchema>;

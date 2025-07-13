import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type Admin } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "24h";

export interface JWTPayload {
  adminId: number;
  email: string;
}

export class AuthService {
  static generateToken(admin: Admin): string {
    const payload: JWTPayload = {
      adminId: admin.id,
      email: admin.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

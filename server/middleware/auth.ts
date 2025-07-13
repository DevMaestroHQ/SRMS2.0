import { type Request, type Response, type NextFunction } from "express";
import { AuthService } from "../services/auth";
import { storage } from "../storage";

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: number;
    email: string;
  };
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.substring(7);
    const payload = AuthService.verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Verify admin still exists
    const admin = await storage.getAdminById(payload.adminId);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = {
      id: payload.adminId,
      email: payload.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

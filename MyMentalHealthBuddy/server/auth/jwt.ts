import * as bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
const JWT_SECRET =
  process.env.JWT_SECRET || "mymentalhealthbuddy-jwt-secret-2024";
const JWT_EXPIRY = "30d";
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email?: string;
    role: string
  }
}
export function generateToken(user: {
  id: string;
  username: string;
  email?: string;
  role: string
}): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  )
}
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt)
}
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return
  }
  const user = verifyToken(token);
  if (!user) {
    res.status(403).json({ error: "Invalid or expired token" });
    return
  }
  req.user = user;
  next()
}
export async function optionalAuthenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    const user = verifyToken(token);
    if (user) {
      req.user = user
    }
  }
  next()
}
// server/middleware/auth.mjs
import jwt from "jsonwebtoken";
import { db } from "../db/client.mjs";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-genuine-love-project-2024";

/**
 * Extract Bearer token
 */
function getToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(" ");
  return type === "Bearer" ? token : null;
}

/**
 * REQUIRED AUTH
 */
export async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const user =
      (await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, payload.id),
      })) ?? null;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * OPTIONAL AUTH
 */
export async function optionalAuth(req, _res, next) {
  try {
    const token = getToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, JWT_SECRET);
    const user =
      (await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, payload.id),
      })) ?? null;

    if (user) req.user = user;
    next();
  } catch {
    next();
  }
}

/**
 * ADMIN ONLY
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

// Aliases for backward compatibility
export const auth = requireAuth;
export const authGuard = requireAuth;
import jwt from "jsonwebtoken";
import { db } from "../db/client.mjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

function getToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, payload.id),
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = getToken(req);
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, payload.id),
      });
    }
  } catch { /* ignore */ }
  next();
}

// Aliases for backward compatibility
export { requireAuth as auth, requireAuth as authGuard };
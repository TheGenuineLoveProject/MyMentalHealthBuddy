import jwt from "jsonwebtoken";
import { db } from "../db/client.mjs";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.mjs";

// Secrets (dev fallback is OK for local tests; set real ones in prod)
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// Reads: Authorization: Bearer <token>
function getToken(req) {
  const auth = req.headers?.authorization;
  if (!auth || typeof auth !== "string") return null;
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice("Bearer ".length).trim() || null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.dbUserId = user.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  // Must be used AFTER requireAuth
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = getToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, JWT_SECRET);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });

    if (user) {
      req.user = user;
      req.dbUserId = user.id;
    }
  } catch (_) {
    // intentionally ignore optional auth failures
  }
  return next();
}

// Back-compat aliases (so old imports don’t break)
export { requireAuth as auth, requireAuth as authGuard };
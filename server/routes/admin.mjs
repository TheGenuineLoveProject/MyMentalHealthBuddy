// server/routes/admin.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const isProd = process.env.NODE_ENV === "production";
const ACCESS_SECRET =
  process.env.JWT_SECRET || (isProd ? null : "dev_secret_not_for_production");

function requireAuth(req, res, next) {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ ok: false, message: "Unauthorized." });

  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    return next();
  } catch (_e) {
    return res.status(401).json({ ok: false, message: "Unauthorized." });
  }
}

// Example admin stats endpoint used by tests
router.get("/stats", requireAuth, (_req, res) => {
  res.json({ ok: true, stats: { status: "healthy" } });
});

export default router;
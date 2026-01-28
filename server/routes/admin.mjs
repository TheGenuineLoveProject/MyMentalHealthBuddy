// server/routes/admin.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const isProd = process.env.NODE_ENV === "production";
const ACCESS_SECRET =
  process.env.JWT_SECRET || (isProd ? null : "dev_secret_not_for_production");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

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

// Admin token verification endpoint
router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  
  if (!ADMIN_TOKEN) {
    console.warn("[Admin] ADMIN_TOKEN not configured");
    return res.status(500).json({ success: false, message: "Admin access not configured" });
  }
  
  if (!token) {
    return res.status(400).json({ success: false, message: "Token required" });
  }
  
  // Timing-safe comparison to prevent timing attacks
  const tokenBuffer = Buffer.from(token);
  const adminBuffer = Buffer.from(ADMIN_TOKEN);
  
  if (tokenBuffer.length !== adminBuffer.length) {
    console.log(`[Admin] Invalid token attempt from IP: ${req.ip}`);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  
  const crypto = require("crypto");
  if (!crypto.timingSafeEqual(tokenBuffer, adminBuffer)) {
    console.log(`[Admin] Invalid token attempt from IP: ${req.ip}`);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  
  console.log(`[Admin] Successful admin authentication from IP: ${req.ip}`);
  
  // Generate a short-lived admin session token
  const sessionToken = jwt.sign(
    { role: "admin", timestamp: Date.now() },
    ACCESS_SECRET,
    { expiresIn: "4h" }
  );
  
  return res.json({ 
    success: true, 
    message: "Admin access granted",
    sessionToken 
  });
});

// Verify admin session endpoint
router.get("/verify-session", (req, res) => {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ valid: false, message: "Not an admin session" });
    }
    return res.json({ valid: true, role: "admin" });
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

// Example admin stats endpoint used by tests
router.get("/stats", requireAuth, (_req, res) => {
  res.json({ ok: true, stats: { status: "healthy" } });
});

export default router;
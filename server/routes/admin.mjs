// server/routes/admin.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.mjs";

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
    logger.warn("[Admin] ADMIN_TOKEN not configured");
    return res.status(500).json({ success: false, message: "Admin access not configured" });
  }
  
  if (!token) {
    return res.status(400).json({ success: false, message: "Token required" });
  }
  
  // Timing-safe comparison to prevent timing attacks
  const tokenBuffer = Buffer.from(token);
  const adminBuffer = Buffer.from(ADMIN_TOKEN);
  
  if (tokenBuffer.length !== adminBuffer.length) {
    logger.info("[Admin] Invalid token attempt", { ip: req.ip });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  
  const crypto = require("crypto");
  if (!crypto.timingSafeEqual(tokenBuffer, adminBuffer)) {
    logger.info("[Admin] Invalid token attempt", { ip: req.ip });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  
  logger.info("[Admin] Successful admin authentication", { ip: req.ip });
  
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

// Admin health endpoint for dashboard
const startTime = Date.now();
router.get("/health", async (_req, res) => {
  try {
    const db = (await import("../db/client.mjs")).default;
    const { sql } = await import("drizzle-orm");
    const { isConfigured } = await import("../utils/aiClient.mjs");
    
    let dbConnected = false;
    let dbLatency = null;
    
    if (process.env.DATABASE_URL) {
      try {
        const dbStart = Date.now();
        await db.execute(sql`SELECT 1`);
        dbConnected = true;
        dbLatency = Date.now() - dbStart;
      } catch {
        dbConnected = false;
      }
    }

    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const secs = uptimeSeconds % 60;
    const uptimeFormatted = [
      days > 0 && `${days}d`,
      hours > 0 && `${hours}h`,
      minutes > 0 && `${minutes}m`,
      `${secs}s`
    ].filter(Boolean).join(" ");

    res.json({
      status: dbConnected ? "healthy" : "degraded",
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "2.0.0",
      database: { 
        status: dbConnected ? "connected" : "disconnected",
        latencyMs: dbLatency 
      },
      ai: { 
        status: isConfigured() ? "healthy" : "unavailable",
        available: isConfigured() 
      },
      uptime: {
        seconds: uptimeSeconds,
        formatted: uptimeFormatted,
        startedAt: new Date(startTime).toISOString(),
      },
      memory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      services: {
        stripe: { configured: !!process.env.STRIPE_SECRET_KEY },
        openai: { configured: !!(process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY) },
        sentry: { configured: !!process.env.SENTRY_DSN },
        resend: { configured: !!process.env.RESEND_API_KEY },
      }
    });
  } catch (error) {
    logger.error("Admin health check error", { error: error?.message || error });
    res.status(500).json({ status: "unhealthy", error: "Health probe failed" });
  }
});

// Admin diagnostics endpoint
router.get("/diagnostics", async (_req, res) => {
  try {
    const db = (await import("../db/client.mjs")).default;
    const { sql } = await import("drizzle-orm");
    
    const dbStats = { users: 0, messages: 0, reflections: 0, moods: 0 };
    const envVars = {};

    // Check environment variables (presence only, not values)
    const envChecks = [
      'DATABASE_URL',
      'OPENAI_API_KEY',
      'AI_INTEGRATIONS_OPENAI_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'SENTRY_DSN',
      'RESEND_API_KEY',
      'ADMIN_TOKEN',
      'SESSION_SECRET'
    ];
    
    envChecks.forEach(key => {
      envVars[key] = !!process.env[key];
    });

    if (process.env.DATABASE_URL) {
      try {
        const [usersResult, messagesResult, reflectionsResult, moodsResult] = await Promise.all([
          db.execute(sql`SELECT COUNT(*)::int as count FROM users`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM ai_messages`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM reflections`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM moods`),
        ]);
        dbStats.users = usersResult.rows?.[0]?.count || 0;
        dbStats.messages = messagesResult.rows?.[0]?.count || 0;
        dbStats.reflections = reflectionsResult.rows?.[0]?.count || 0;
        dbStats.moods = moodsResult.rows?.[0]?.count || 0;
      } catch (e) {
        logger.error("DB stats query error", { error: e?.message || e });
      }
    }

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      node: {
        version: process.version,
        platform: process.platform,
      },
      database: dbStats,
      envVars,
      memory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
        externalMB: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
    });
  } catch (error) {
    logger.error("Diagnostics error", { error: error?.message || error });
    res.status(500).json({ error: "Failed to gather diagnostics" });
  }
});

export default router;
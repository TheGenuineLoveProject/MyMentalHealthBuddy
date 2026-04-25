// server/routes/admin.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { logger } from "../utils/logger.mjs";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";

const router = Router();
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
      } catch (dbErr) {
        logger.warn("Admin health DB probe failed", { error: dbErr?.message || dbErr });
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

// Admin deep-health endpoint — surfaces the heal-360 report + heal-watch streak
// for the Command Center health dashboard.  Read-only; never re-runs probes
// (probes are run by `scripts/heal-360.mjs` or `scripts/heal-watch.mjs`).
router.get("/health-deep", async (_req, res) => {
  try {
    const fs = await import("node:fs");
    const REPORT_PATH = "docs/health-check-result.json";
    const WATCH_PATH = "docs/health-watch-status.json";

    let report = null;
    let reportError = null;
    if (fs.existsSync(REPORT_PATH)) {
      try { report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8")); }
      catch (e) { reportError = e?.message || String(e); }
    } else {
      reportError = "No heal-360 report yet — run `node scripts/heal-360.mjs` or `bash scripts/heal-all.sh`.";
    }

    let watch = null;
    if (fs.existsSync(WATCH_PATH)) {
      try { watch = JSON.parse(fs.readFileSync(WATCH_PATH, "utf8")); } catch { /* ignore */ }
    }

    // Summarize for UI without sending the entire raw report
    const totals = report?.totals || { pass: 0, warn: 0, fail: 0, total: 0 };
    const categories = report?.categories || null;
    const checks = Array.isArray(report?.checks) ? report.checks : [];
    const verdict =
      totals.fail > 0 ? "NEEDS_REPAIR" :
      totals.warn > 0 ? "DEGRADED" :
      totals.total > 0 ? "HEALTHY" : "UNKNOWN";

    const nonPass = checks
      .filter(c => c.status !== "pass")
      .map(c => ({
        name: c.name,
        status: c.status,
        message: c.message || null,
        hint: c.hint || null,
      }));

    res.json({
      ok: true,
      verdict,
      totals,
      categories,
      reportTimestamp: report?.timestamp || null,
      reportPath: REPORT_PATH,
      reportError,
      nonPass,
      watch: watch ? {
        latest: watch.latest || null,
        streak: watch.streak || null,
        updatedAt: watch.updatedAt || null,
        sampleCount: Array.isArray(watch.samples) ? watch.samples.length : 0,
      } : null,
      probeHistory: _probeHistory.slice(0, PROBE_HISTORY_MAX),
      selfHealHistory: _selfHealHistory.slice(0, SELF_HEAL_HISTORY_MAX),
    });
  } catch (error) {
    logger.error("Admin health-deep error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Deep health probe failed" });
  }
});

// Admin-triggered re-probe.  Spawns `node scripts/heal-360.mjs` as a child
// process; heal-360 is read-only, so this is safe to expose to admins.
// Returns the verdict + totals after the probe completes (typically <2s).
// A simple 30s in-memory cooldown prevents accidental rapid re-probes.
//
// Each successful run is appended to a small in-memory ring buffer
// (`_probeHistory`, last 10 runs) so the admin dashboard can show recent
// re-probe activity without persisting to the database.  History is
// surfaced on the GET /api/admin/health-deep response under `probeHistory`.
let _lastProbeAt = 0;
const _probeHistory = []; // [{ at, verdict, exitCode, totals, durationMs, actorId }]
const PROBE_HISTORY_MAX = 10;

router.post("/health-deep/run", async (req, res) => {
  const now = Date.now();
  const COOLDOWN_MS = 30_000;
  const since = now - _lastProbeAt;
  if (since < COOLDOWN_MS) {
    return res.status(429).json({
      ok: false,
      error: "Probe cooldown active",
      retryAfterMs: COOLDOWN_MS - since,
    });
  }
  _lastProbeAt = now;

  try {
    const { spawn } = await import("node:child_process");
    const fs = await import("node:fs");
    const REPORT_PATH = "docs/health-check-result.json";

    const probeStartedAt = Date.now();
    const exitCode = await new Promise((resolve) => {
      const child = spawn("node", ["scripts/heal-360.mjs"], {
        stdio: ["ignore", "ignore", "ignore"],
      });
      const timer = setTimeout(() => {
        try { child.kill("SIGTERM"); } catch { /* ignore */ }
        resolve(124); // timeout
      }, 30_000);
      child.on("error", () => { clearTimeout(timer); resolve(3); });
      child.on("close", (code) => { clearTimeout(timer); resolve(code ?? 3); });
    });
    const durationMs = Date.now() - probeStartedAt;

    let totals = null;
    let timestamp = null;
    if (fs.existsSync(REPORT_PATH)) {
      try {
        const j = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
        totals = j.totals || null;
        timestamp = j.timestamp || null;
      } catch { /* report unreadable */ }
    }

    const verdict =
      exitCode === 0 ? "HEALTHY" :
      exitCode === 1 ? "DEGRADED" :
      exitCode === 2 ? "NEEDS_REPAIR" :
      exitCode === 124 ? "TIMEOUT" : "INTERNAL_ERROR";

    // Append to ring buffer (newest first)
    _probeHistory.unshift({
      at: new Date().toISOString(),
      verdict,
      exitCode,
      totals,
      durationMs,
      actorId: req.user?.id || null,
    });
    while (_probeHistory.length > PROBE_HISTORY_MAX) _probeHistory.pop();

    logger.info("Admin re-probe completed", { verdict, exitCode, totals, durationMs });
    res.json({ ok: true, verdict, exitCode, totals, durationMs, reportTimestamp: timestamp });
  } catch (error) {
    logger.error("Admin re-probe error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Re-probe failed" });
  }
});

// Admin-triggered self-heal.  Spawns `node scripts/heal-self.mjs --silent`
// (which itself runs heal-360 → safe-only heal-repair → re-probe and persists
// docs/health-self-status.json).  heal-self NEVER passes --apply-destructive,
// so this remains within the safe-only contract.
//
// Cooldown is longer (60s) because heal-self does more work than a probe and
// can trigger `npm run build`.  Timeout is 90s for the same reason.  Each run
// appends to `_selfHealHistory` (in-memory ring buffer, last 10).
let _lastSelfHealAt = 0;
const _selfHealHistory = [];
const SELF_HEAL_HISTORY_MAX = 10;

router.post("/health-deep/self-heal", async (req, res) => {
  const now = Date.now();
  const COOLDOWN_MS = 60_000;
  const since = now - _lastSelfHealAt;
  if (since < COOLDOWN_MS) {
    return res.status(429).json({
      ok: false,
      error: "Self-heal cooldown active",
      retryAfterMs: COOLDOWN_MS - since,
    });
  }
  _lastSelfHealAt = now;

  try {
    const { spawn } = await import("node:child_process");
    const fs = await import("node:fs");
    const STATUS_PATH = "docs/health-self-status.json";

    const startedAt = Date.now();
    const exitCode = await new Promise((resolve) => {
      const child = spawn("node", ["scripts/heal-self.mjs", "--silent"], {
        stdio: ["ignore", "ignore", "ignore"],
      });
      const timer = setTimeout(() => {
        try { child.kill("SIGTERM"); } catch { /* ignore */ }
        resolve(124);
      }, 90_000);
      child.on("error", () => { clearTimeout(timer); resolve(3); });
      child.on("close", (code) => { clearTimeout(timer); resolve(code ?? 3); });
    });
    const durationMs = Date.now() - startedAt;

    let status = null;
    if (fs.existsSync(STATUS_PATH)) {
      try { status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf8")); }
      catch { /* unreadable */ }
    }

    const outcome = status?.outcome || (exitCode === 124 ? "TIMEOUT" : "INTERNAL_ERROR");

    _selfHealHistory.unshift({
      at: new Date().toISOString(),
      outcome,
      exitCode,
      before: status?.before || null,
      after: status?.after || null,
      durationMs,
      actorId: req.user?.id || null,
    });
    while (_selfHealHistory.length > SELF_HEAL_HISTORY_MAX) _selfHealHistory.pop();

    logger.info("Admin self-heal completed", { outcome, exitCode, durationMs });
    res.json({
      ok: true,
      outcome,
      exitCode,
      durationMs,
      before: status?.before || null,
      after: status?.after || null,
    });
  } catch (error) {
    logger.error("Admin self-heal error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Self-heal failed" });
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


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "admin", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
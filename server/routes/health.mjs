import db from "../db/client.mjs";
import { sql } from "drizzle-orm";
import express from "express";
import { isConfigured } from "../utils/aiClient.mjs";

const router = express.Router();
const startTime = Date.now();
let _requestCount = 0;
let _errorCount = 0;

export function incrementRequestCount() {
  _requestCount++;
}

export function incrementErrorCount() {
  _errorCount++;
}

router.get("/", async (_req, res) => {
  try {
    let dbConnected = false;
    
    if (process.env.DATABASE_URL) {
      try {
        await db.execute(sql`SELECT 1`);
        dbConnected = true;
      } catch {
        dbConnected = false;
      }
    }

    res.json({
      status: "healthy",
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "2.0.0",
      database: { connected: dbConnected },
      ai: { available: isConfigured() },
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "unhealthy", error: "Health probe failed" });
  }
});

router.get("/ready", async (_req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      await db.execute(sql`SELECT 1`);
    }
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not ready" });
  }
});

router.get("/live", (_req, res) => {
  res.json({ status: "alive", uptime: Math.floor((Date.now() - startTime) / 1000) });
});

router.get("/detailed", async (_req, res) => {
  const start = Date.now();
  const checks = { 
    db: { ok: false, latencyMs: null },
    stripe: { ok: false, configured: false },
    openai: { ok: false, configured: false },
    sentry: { ok: false, configured: false }
  };

  if (process.env.DATABASE_URL) {
    try {
      const dbStart = Date.now();
      await db.execute(sql`SELECT 1`);
      checks.db.ok = true;
      checks.db.latencyMs = Date.now() - dbStart;
    } catch {
      checks.db.ok = false;
    }
  }

  checks.stripe.configured = !!process.env.STRIPE_SECRET_KEY;
  checks.stripe.ok = checks.stripe.configured;
  
  checks.openai.configured = !!(process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY);
  checks.openai.ok = isConfigured();
  
  checks.sentry.configured = !!process.env.SENTRY_DSN;
  checks.sentry.ok = checks.sentry.configured;

  const allCritical = checks.db.ok;
  res.status(allCritical ? 200 : 503).json({
    status: allCritical ? "ok" : "degraded",
    ready: allCritical,
    latencyMs: Date.now() - start,
    checks
  });
});

router.get("/metrics", async (_req, res) => {
  try {
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

    const dbStats = { users: 0, messages: 0 };

    if (process.env.DATABASE_URL) {
      try {
        const [usersResult, messagesResult] = await Promise.all([
          db.execute(sql`SELECT COUNT(*)::int as count FROM users`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM ai_messages`),
        ]);
        dbStats.users = usersResult.rows?.[0]?.count || 0;
        dbStats.messages = messagesResult.rows?.[0]?.count || 0;
      } catch {
        // DB query failed, use defaults
      }
    }

    res.json({
      status: "ok",
      version: process.env.npm_package_version || "2.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: {
        seconds: uptimeSeconds,
        formatted: uptimeFormatted,
        startedAt: new Date(startTime).toISOString(),
      },
      database: {
        users: dbStats.users,
        aiMessages: dbStats.messages,
      },
      memory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      node: {
        version: process.version,
        platform: process.platform,
      },
    });
  } catch (error) {
    console.error("Metrics error:", error);
    res.status(500).json({ error: "Failed to gather metrics" });
  }
});

export default router;

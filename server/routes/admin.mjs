import express from "express";
import os from "os";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";

const router = express.Router();
const startTime = Date.now();

router.get("/stats", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const allUsers = await db.query.users.findMany();
    res.json({ users: allUsers.length, auditLogs: 0 });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

router.get("/health", async (_req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const uptimeFormatted = formatUptime(uptime);
  
  let dbStatus = "unknown";
  let dbLatency = null;
  
  try {
    const start = Date.now();
    await db.execute({ sql: "SELECT 1" });
    dbLatency = Date.now() - start;
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: !!process.env.DATABASE_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
  };
  
  const memUsage = process.memoryUsage();
  const systemInfo = {
    platform: os.platform(),
    nodeVersion: process.version,
    cpuCount: os.cpus().length,
    freeMemory: formatBytes(os.freemem()),
    totalMemory: formatBytes(os.totalmem()),
    heapUsed: formatBytes(memUsage.heapUsed),
    heapTotal: formatBytes(memUsage.heapTotal),
  };

  res.json({
    ok: true,
    status: "healthy",
    buildVersion: process.env.BUILD_VERSION || "dev",
    uptime: uptimeFormatted,
    uptimeSeconds: uptime,
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
    },
    environment: envCheck,
    system: systemInfo,
    timestamp: new Date().toISOString(),
  });
});

router.get("/metrics", async (_req, res) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  res.json({
    ok: true,
    metrics: {
      uptime: process.uptime(),
      memory: {
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
    },
    timestamp: new Date().toISOString(),
  });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  
  return parts.join(" ");
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

router.get("/diagnostics", requireAuth, requireAdmin, async (_req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  let dbStatus = "unknown";
  let dbLatency = null;
  
  try {
    const start = Date.now();
    await db.execute({ sql: "SELECT 1" });
    dbLatency = Date.now() - start;
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  const diagnostics = {
    server: {
      uptime: formatUptime(uptime),
      uptimeSeconds: uptime,
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
    },
    memory: {
      heapUsed: formatBytes(memUsage.heapUsed),
      heapTotal: formatBytes(memUsage.heapTotal),
      rss: formatBytes(memUsage.rss),
      external: formatBytes(memUsage.external),
      systemFree: formatBytes(os.freemem()),
      systemTotal: formatBytes(os.totalmem()),
    },
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
    },
    env: {
      NODE_ENV: process.env.NODE_ENV || "development",
      hasDatabase: !!process.env.DATABASE_URL,
      hasOpenAI: !!process.env.OPENAI_API_KEY || !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      hasStripe: !!process.env.STRIPE_SECRET_KEY,
      hasSession: !!process.env.SESSION_SECRET || !!process.env.JWT_SECRET,
    },
    timestamp: new Date().toISOString(),
  };

  res.json({ ok: true, diagnostics });
});

router.get("/logs/recent", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT id, actor_user_id, action, resource_type, resource_id, ip_address, created_at 
            FROM audit_log 
            ORDER BY created_at DESC 
            LIMIT 50`
    });
    
    res.json({
      ok: true,
      logs: result.rows || [],
      count: result.rows?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Admin logs error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch logs" });
  }
});

export default router;
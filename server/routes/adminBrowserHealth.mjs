import packageInfo from "../../package.json" with { type: "json" };
import os from "node:os";
import { requireAuth } from "../middleware/auth.mjs";
import requireAdmin from "../middleware/requireAdmin.mjs";

const PROBE_TIMEOUT_MS = 1500;
const buildVersion = packageInfo.version;

async function queryDatabase(sql) {
  // Import lazily: merely registering the endpoint must not initialize a DB.
  const { pool } = await import("../db/connection.mjs");
  return pool.query({ text: sql, query_timeout: PROBE_TIMEOUT_MS });
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    `${secs}s`,
  ].filter(Boolean).join(" ");
}

export function registerBrowserHealth(router, {
  query = queryDatabase,
  uptime = () => process.uptime(),
  clock = () => performance.now(),
} = {}) {
  router.get("/browser-health",
    (_req, res, next) => { res.set("Cache-Control", "no-store"); next(); },
    requireAuth, requireAdmin, async (_req, res) => {
      let connected = false;
      let latencyMs = null;
      if (process.env.DATABASE_URL) {
        const started = clock();
        let timer;
        try {
          await Promise.race([
            Promise.resolve().then(() => query("SELECT 1")),
            new Promise((_, reject) => {
              timer = setTimeout(() => reject(new Error("Probe timeout")), PROBE_TIMEOUT_MS);
            }),
          ]);
          connected = true;
          latencyMs = Math.max(0, Math.round(clock() - started));
        } catch {
          // Do not return (or log) database errors, credentials, or query details.
        } finally {
          clearTimeout(timer);
        }
      }

      const uptimeSeconds = Math.max(0, Math.floor(uptime()));
      const memory = process.memoryUsage();
      return res.json({
        ok: connected,
        status: connected ? "healthy" : "degraded",
        buildVersion,
        timestamp: new Date().toISOString(),
        uptime: formatUptime(uptimeSeconds),
        uptimeSeconds,
        database: {
          status: connected ? "connected" : "disconnected",
          latencyMs,
        },
        environment: {
          NODE_ENV: !!process.env.NODE_ENV,
          DATABASE_URL: !!process.env.DATABASE_URL,
          JWT_SECRET: !!process.env.JWT_SECRET,
          OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
          STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          heapUsed: formatBytes(memory.heapUsed),
          heapTotal: formatBytes(memory.heapTotal),
          freeMemory: formatBytes(os.freemem()),
          totalMemory: formatBytes(os.totalmem()),
        },
      });
    });
}
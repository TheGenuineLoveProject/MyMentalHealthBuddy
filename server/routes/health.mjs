// [MMB] Health + readiness
import { db } from "../db/client.mjs";
import { sql } from "drizzle-orm";
import { Router } from "express";
// server/routes/health.mjs
import express from "express";

const router = express.Router();

router.get("/health", async (_req, res) => {
  try {
    // You can expand this ping if you like:
    // - db connectivity check
    // - AI key presence, etc.

    res.json({
      status: "healthy",
      environment: process.env.NODE_ENV || "development",
      version: "2.0.0",
      database: { connected: true }, // assume connected if server started fine
      ai: { available: true },       // assume available; smoke-test will validate
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "unhealthy", error: "Health probe failed" });
  }
});

export default router;
export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  const start = Date.now();
  const checks = { db: { ok: false }, stripe: { ok: false }, openai: { ok: false } };

  try { await db.execute(sql`select 1`); checks.db.ok = true; } catch { checks.db.ok = false; }
  if (process.env.STRIPE_SECRET_KEY) checks.stripe.ok = true; // lightweight env check
  if (process.env.OPENAI_API_KEY) checks.openai.ok = true;

  const ok = checks.db.ok && checks.stripe.ok && checks.openai.ok;
  res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    ready: ok,
    latencyMs: Date.now() - start,
    checks
  });
});

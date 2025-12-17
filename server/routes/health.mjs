import { db } from "../db/client.mjs";
import { sql } from "drizzle-orm";
import express from "express";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    res.json({
      status: "healthy",
      environment: process.env.NODE_ENV || "development",
      version: "2.0.0",
      database: { connected: true },
      ai: { available: true },
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "unhealthy", error: "Health probe failed" });
  }
});

router.get("/detailed", async (_req, res) => {
  const start = Date.now();
  const checks = { db: { ok: false }, stripe: { ok: false }, openai: { ok: false } };

  try { 
    await db.execute(sql`SELECT 1`); 
    checks.db.ok = true; 
  } catch { 
    checks.db.ok = false; 
  }
  
  if (process.env.STRIPE_SECRET_KEY) checks.stripe.ok = true;
  if (process.env.OPENAI_API_KEY) checks.openai.ok = true;

  const ok = checks.db.ok && checks.stripe.ok && checks.openai.ok;
  res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    ready: ok,
    latencyMs: Date.now() - start,
    checks
  });
});

export default router;

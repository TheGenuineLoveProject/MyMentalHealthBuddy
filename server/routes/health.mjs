// [MMB] Health + readiness
import { db } from "../db/client.mjs";
import { sql } from "drizzle-orm";
import { Router } from "express";

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

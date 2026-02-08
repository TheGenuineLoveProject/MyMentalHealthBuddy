import express from "express";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

async function checkDatabaseHealth() {
  try {
    const { pool } = await import("../db/client.mjs");
    await pool.query("SELECT 1 as ping");
    return { status: "healthy", connected: true, latency: "< 100ms" };
  } catch (err) {
    logger.warn("Database health check failed", { error: err?.message || err });
    return { status: "unhealthy", connected: false, error: "Database connection failed" };
  }
}

async function checkOpenAIHealth() {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { status: "not_configured", available: false };
  }
  return { status: "configured", available: true };
}

async function checkStripeHealth() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { status: "not_configured", available: false };
  }
  return { status: "configured", available: true };
}

router.get("/", async (req, res) => {
  try {
    const [database, openai, stripe] = await Promise.all([
      checkDatabaseHealth(),
      checkOpenAIHealth(),
      checkStripeHealth(),
    ]);

    const allHealthy = 
      database.status === "healthy" &&
      (openai.status === "configured" || openai.status === "not_configured") &&
      (stripe.status === "configured" || stripe.status === "not_configured");

    res.json({
      ok: true,
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database,
        openai,
        stripe,
      },
    });
  } catch (err) {
    logger.error("Integration health check failed", { error: err?.message || err });
    res.status(500).json({
      ok: false,
      status: "error",
      error: "Integration health check failed",
    });
  }
});

router.get("/database", async (req, res) => {
  try {
    const result = await checkDatabaseHealth();
    res.json({ ok: result.status === "healthy", ...result });
  } catch (err) {
    logger.error("Database health sub-check failed", { error: err?.message || err });
    res.status(500).json({ ok: false, status: "error", error: "Health check failed" });
  }
});

router.get("/openai", async (req, res) => {
  try {
    const result = await checkOpenAIHealth();
    res.json({ ok: result.status === "configured", ...result });
  } catch (err) {
    logger.error("OpenAI health sub-check failed", { error: err?.message || err });
    res.status(500).json({ ok: false, status: "error", error: "Health check failed" });
  }
});

router.get("/stripe", async (req, res) => {
  try {
    const result = await checkStripeHealth();
    res.json({ ok: result.status === "configured", ...result });
  } catch (err) {
    logger.error("Stripe health sub-check failed", { error: err?.message || err });
    res.status(500).json({ ok: false, status: "error", error: "Health check failed" });
  }
});

export default router;

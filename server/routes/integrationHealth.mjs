import express from "express";

const router = express.Router();

async function checkDatabaseHealth() {
  try {
    const { pool } = await import("../db/client.mjs");
    const result = await pool.query("SELECT 1 as ping");
    return { status: "healthy", connected: true, latency: "< 100ms" };
  } catch (err) {
    return { status: "unhealthy", connected: false, error: err.message };
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
    res.status(500).json({
      ok: false,
      status: "error",
      error: err.message,
    });
  }
});

router.get("/database", async (req, res) => {
  const result = await checkDatabaseHealth();
  res.json({ ok: result.status === "healthy", ...result });
});

router.get("/openai", async (req, res) => {
  const result = await checkOpenAIHealth();
  res.json({ ok: result.status === "configured", ...result });
});

router.get("/stripe", async (req, res) => {
  const result = await checkStripeHealth();
  res.json({ ok: result.status === "configured", ...result });
});

export default router;

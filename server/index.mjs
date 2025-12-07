// server/index.mjs

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";
import rateLimit from "./middleware/rateLimit.mjs";
import { sanitizeBody, securityHeaders } from "./middleware/security.mjs";
import { requestId } from "./middleware/requestId.mjs";
import { requestLogger } from "./utils/logger.mjs";
import { initSentry, sentryErrorHandler, captureException } from "./utils/sentry.mjs";

// ───────────────────────────────
// ENVIRONMENT + APP INITIALIZATION
// ───────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const isReplitDev = !!process.env.REPLIT_DEV_DOMAIN;
const isProduction = process.env.NODE_ENV === "production" || !isReplitDev;

// SESSION SECRET VALIDATION
if (!process.env.SESSION_SECRET) {
  console.warn("⚠️  Missing SESSION_SECRET. Using fallback for development.");
  process.env.SESSION_SECRET = "mmb-dev-session-secret-change-me";
}

// Initialize Sentry
initSentry(app);

// Express config
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(requestId);
app.use(requestLogger);
app.use(securityHeaders);
app.use(sanitizeBody);
app.use(rateLimit);

// ───────────────────────────────
// ROUTE IMPORTS
// ───────────────────────────────
import analyticsRoutes from "./routes/analytics.mjs";
import authRoutes from "./routes/auth.mjs";
import journalRoutes from "./routes/journal.mjs";
import moodRoutes from "./routes/mood.mjs";
import aiRoutes from "./routes/ai.mjs";
import billingRoutes from "./routes/billing.mjs";
import contentRoutes from "./routes/content.mjs";
import canvaAuthRoutes from "./routes/canva-oauth.mjs";
import stripeWebhookRoutes from "./routes/stripeWebhook.mjs";
import accountRoutes from "./routes/account.mjs";
import gamificationRoutes from "./routes/gamification.mjs";
import uiDashboardRoutes from "./routes/ui-dashboard.mjs";

// Mount API routes
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/canva", canvaAuthRoutes);
app.use("/api/webhooks/stripe", stripeWebhookRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/ui-dashboard", uiDashboardRoutes);

// ───────────────────────────────
// HEALTH + READY ENDPOINTS
// ───────────────────────────────
import db from "./db/client.mjs";

app.get("/api/health", async (req, res) => {
  const startTime = Date.now();
  let dbStatus = { connected: false, latencyMs: null };

  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbStatus = { connected: true, latencyMs: Date.now() - dbStart };
  } catch (err) {
    dbStatus = { connected: false, error: "Database connection failed" };
  }

  const healthData = {
    success: true,
    status: dbStatus.connected ? "healthy" : "degraded",
    message: "MyMentalHealthBuddy API is running.",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
    services: {
      database: dbStatus,
      ai: { available: !!process.env.OPENAI_API_KEY },
    },
  };

  res.status(200).json(healthData);
});

app.get("/api/ready", async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "not ready", error: "Database not responding" });
  }
});

// ───────────────────────────────
// STATIC FRONTEND SERVING (VITE BUILD)
// ───────────────────────────────
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ───────────────────────────────
// ERROR HANDLING
// ───────────────────────────────
app.use(sentryErrorHandler);

app.use((err, req, res, next) => {
  captureException(err, {
    requestId: req.requestId,
    user: req.user,
    path: req.path,
    method: req.method,
  });
  console.error("❌ Global error handler:", err);
  res.status(500).json({
    success: false,
    error: "Something went wrong. Please try again.",
    requestId: req.requestId,
  });
});

// ───────────────────────────────
// SERVER START + GRACEFUL SHUTDOWN
// ───────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ MyMentalHealthBuddy API started on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => process.exit(0));
});

export default app;
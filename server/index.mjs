// server/index.mjs
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import { apiRateLimit, authRateLimit } from "./middleware/rateLimit.mjs";
import { cspHeaders, sanitizeBody, securityHeaders } from "./middleware/security.mjs";
import { requestId, requestLogger } from "./middleware/requestId.mjs";
import { logger } from "./utils/logger.mjs";
import { initSentry, sentryErrorHandler, captureException } from "./utils/sentry.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isExplicitDev = process.env.NODE_ENV === "development";
const isReplitDeployment = !!process.env.REPLIT_DEPLOYMENT || !!process.env.REPLIT_DB_URL;
const isProduction = !isExplicitDev || isReplitDeployment;

if (isProduction && !isExplicitDev) {
  logger.info("Running in PRODUCTION mode (detected deployment environment)");
}

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  logger.error("FATAL: SESSION_SECRET environment variable is required but not set");
  if (isProduction) {
    process.exit(1);
  } else {
    logger.warn("Running without SESSION_SECRET in development mode. Auth will fail");
    process.env.SESSION_SECRET = "mmb-dev-session-secret-change-me";
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;

initSentry(app);

app.set("trust proxy", 1);

const corsOrigin = process.env.CORS_ORIGIN || process.env.REPLIT_DEV_DOMAIN 
  ? [`https://${process.env.REPLIT_DEV_DOMAIN}`, ...(process.env.REPLIT_DOMAINS?.split(",").map(d => `https://${d}`) || [])]
  : "*";

app.use(
  cors({
    origin: isProduction ? corsOrigin : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());

app.use(requestId);
app.use(requestLogger);
app.use(cspHeaders);
app.use(securityHeaders);
app.use(sanitizeBody);
app.use(apiRateLimit);

import analyticsRoutes from "./routes/analytics.mjs";
import authRoutes from "./routes/auth.mjs";
import journalRoutes from "./routes/journal.mjs";
import moodRoutes from "./routes/mood.mjs";
import contentRoutes from "./routes/content.mjs";
import billingRoutes from "./routes/billing.mjs";
import canvaOAuthRoutes from "./routes/canva-oauth.mjs";
import uiDashboardRoutes from "./routes/ui-dashboard.mjs";
import aiDashboardRoutes from "./routes/ai-dashboard.mjs";
import stripeWebhookRoutes from "./routes/stripeWebhook.mjs";
import aiRoutes from "./routes/ai.mjs";
import accountRoutes from "./routes/account.mjs";

app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/canva", canvaOAuthRoutes);
app.use("/api/ui-dashboard", uiDashboardRoutes);
app.use("/api/ai-dashboard", aiDashboardRoutes);
app.use("/api/webhooks/stripe", stripeWebhookRoutes);

app.use("/api/dashboard", uiDashboardRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/account", accountRoutes);

import { db } from "./db/client.mjs";
import { sql } from "drizzle-orm";

app.get("/api/health", async (req, res) => {
  const startTime = Date.now();
  
  // Check database connectivity
  let dbStatus = { connected: false, latencyMs: 0 };
  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbStatus = { connected: true, latencyMs: Date.now() - dbStart };
  } catch (err) {
    dbStatus = { connected: false, error: "Database connection failed" };
  }
  
  // Check AI service availability
  let aiStatus = { available: !!process.env.OPENAI_API_KEY };
  
  // Check required environment variables
  const envCheck = {
    SESSION_SECRET: !!process.env.SESSION_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  };
  
  const allServicesHealthy = dbStatus.connected && Object.values(envCheck).every(v => v);
  
  const healthData = {
    success: allServicesHealthy,
    status: allServicesHealthy ? "healthy" : "degraded",
    message: "MyMentalHealthBuddy API is running.",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "2.0.0",
    responseTimeMs: Date.now() - startTime,
    services: {
      database: dbStatus,
      ai: aiStatus,
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    env: envCheck,
  };
  
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(allServicesHealthy ? 200 : 503).json(healthData);
});

app.get("/api/ready", async (req, res) => {
  try {
    // Quick database ping for readiness
    await db.execute(sql`SELECT 1`);
    res.json({ ready: true, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ ready: false, error: "Database not ready", timestamp: new Date().toISOString() });
  }
});

const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientDistPath, "index.html"));
  } else {
    res.status(404).json({ success: false, error: "API endpoint not found" });
  }
});

app.use(sentryErrorHandler());

app.use((err, req, res, next) => {
  logger.error("Global error handler", { error: err.message, stack: err.stack, requestId: req.requestId });
  
  captureException(err, {
    requestId: req.requestId,
    user: req.user,
    extra: {
      path: req.path,
      method: req.method,
    },
  });
  
  res.status(500).json({
    ok: false,
    message: isProduction 
      ? "An unexpected error occurred. Please try again later."
      : err.message || "Internal Server Error",
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info("MyMentalHealthBuddy API started", { port: PORT, env: process.env.NODE_ENV || "development" });
});

function gracefulShutdown(signal) {
  logger.info("Shutdown signal received", { signal });
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Could not close connections in time, forcing shutdown");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

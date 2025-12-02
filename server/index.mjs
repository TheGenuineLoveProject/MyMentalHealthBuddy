// server/index.mjs
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { apiRateLimit, authRateLimit } from "./middleware/rateLimit.mjs";
import { cspHeaders, sanitizeBody, securityHeaders } from "./middleware/security.mjs";
import { requestId, requestLogger } from "./middleware/requestId.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------
// CRITICAL: Environment Detection
// -------------------------------------------
const isExplicitDev = process.env.NODE_ENV === "development";
const isReplitDeployment = !!process.env.REPLIT_DEPLOYMENT || !!process.env.REPLIT_DB_URL;
const isProduction = !isExplicitDev || isReplitDeployment;

if (isProduction && !isExplicitDev) {
  console.log("Running in PRODUCTION mode (detected deployment environment)");
}

// -------------------------------------------
// CRITICAL: Validate required environment variables
// -------------------------------------------
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error("FATAL: SESSION_SECRET environment variable is required but not set.");
  console.error("Please set SESSION_SECRET in your environment variables.");
  if (isProduction) {
    process.exit(1);
  } else {
    console.warn("WARNING: Running without SESSION_SECRET in development mode. Auth will fail.");
  }
}

// -------------------------------------------
// 0. APP BASE
// -------------------------------------------
const app = express();

// Replit / proxy safety - trust only first proxy hop
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

// -------------------------------------------
// 1. SECURITY & OBSERVABILITY MIDDLEWARE
// -------------------------------------------
app.use(requestId);
app.use(requestLogger);
app.use(cspHeaders);
app.use(securityHeaders);
app.use(sanitizeBody);
app.use(apiRateLimit);

// -------------------------------------------
// 2. ROUTES (EACH FILE HAS ITS OWN ROUTER)
// -------------------------------------------

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

// Attach route modules
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

// Dashboard endpoint alias (frontend expects /api/dashboard)
app.use("/api/dashboard", uiDashboardRoutes);

// AI chat routes
app.use("/api/ai", aiRoutes);

// -------------------------------------------
// 3. HEALTHCHECK (Enhanced)
// -------------------------------------------
app.get("/api/health", (req, res) => {
  const healthData = {
    success: true,
    message: "MyMentalHealthBuddy API is running.",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  };
  
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.json(healthData);
});

// Readiness check for deployment
app.get("/api/ready", async (req, res) => {
  try {
    res.json({ ready: true, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ ready: false, error: "Service unavailable" });
  }
});

// -------------------------------------------
// 4. SERVE STATIC FRONTEND
// -------------------------------------------
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientDistPath, "index.html"));
  } else {
    res.status(404).json({ success: false, error: "API endpoint not found" });
  }
});

// -------------------------------------------
// 5. GLOBAL ERROR HANDLER
// -------------------------------------------
app.use((err, req, res, next) => {
  console.error("[Global Error Handler]", err);
  res.status(500).json({
    ok: false,
    message: isProduction 
      ? "An unexpected error occurred. Please try again later."
      : err.message || "Internal Server Error",
  });
});

// -------------------------------------------
// 6. START SERVER WITH GRACEFUL SHUTDOWN
// -------------------------------------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `MyMentalHealthBuddy API listening on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || "development"})`
  );
});

// Graceful shutdown handler for production deployments
function gracefulShutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Could not close connections in time, forcing shutdown.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
// server/index.mjs
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";
import aiRoutes from "./routes/ai.mjs";
import billingRoutes from "./routes/billing.mjs";
import analyticsRoutes from "./routes/analytics.mjs";
import stripeWebhook from "./routes/stripeWebhook.mjs";

import { db } from "./db/connection.mjs";
import { generalLimiter, authLimiter, aiLimiter } from "./middleware/rateLimiter.mjs";
import { requestIdMiddleware, logger } from "./middleware/requestId.mjs";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "../client/dist");

app.use(requestIdMiddleware);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({ 
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/stripe/webhook", stripeWebhook);

app.use(express.json({ limit: '1mb' }));

app.use("/api", generalLimiter);

app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true,
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0"
  });
});

app.get("/api/health/ready", async (req, res) => {
  try {
    const start = Date.now();
    await db.execute("SELECT 1");
    const dbLatency = Date.now() - start;
    
    res.json({ 
      ok: true,
      status: "ready",
      database: "connected",
      latency: {
        database: dbLatency
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error("Health check failed", { 
      error: err.message,
      requestId: req.requestId 
    });
    res.status(503).json({ 
      ok: false,
      status: "not-ready",
      database: "disconnected",
      error: "Database connection failed"
    });
  }
});

app.get("/api/health/live", (req, res) => {
  res.json({ ok: true, status: "alive" });
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/ai", aiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use("/auth", authRoutes);
app.use("/mood", moodRoutes);
app.use("/ai", aiRoutes);
app.use("/billing", billingRoutes);

app.use(express.static(clientDist, {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ ok: false, error: "API endpoint not found" });
  }
  
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Server error");
    }
  });
});

app.use((err, req, res, next) => {
  const requestId = req.requestId || "unknown";
  
  logger.error("Request error", {
    requestId,
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      ok: false, 
      error: "Invalid JSON in request body",
      requestId
    });
  }
  
  res.status(err.status || 500).json({
    ok: false,
    error: process.env.NODE_ENV === 'production' 
      ? "An unexpected error occurred" 
      : err.message,
    requestId
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info("Server started", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version
  });
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, initiating graceful shutdown");
  server.close(() => {
    logger.info("Server closed gracefully");
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.warn("Forced shutdown after 30s timeout");
    process.exit(1);
  }, 30000);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down");
  server.close(() => process.exit(0));
});

export default app;

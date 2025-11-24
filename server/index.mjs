// server/index.mjs

import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { apiLimiter, aiLimiter, authLimiter, webhookLimiter } from "./middleware/rateLimiter.mjs";

// If you have a db connection + drizzle:
import { db } from "./db/connection.mjs";
import { sql } from "drizzle-orm";

// ✅ Your existing route imports (adjust paths as needed)
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";
import stripeRoutes from "./routes/stripe.mjs";
import billingRoutes from "./routes/billing.mjs";
import aiRoutes from "./routes/ai.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use PORT from env or default to 5000 (must match .replit port)
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------
// 1) BASIC MIDDLEWARE
// ---------------------------------------------------------------------

// Add a simple request ID for logs + error tracking
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  res.setHeader("X-Request-ID", req.id);
  next();
});

// HTTP logs (skip health checks to reduce noise)
app.use(
  morgan("combined", {
    skip: (req) => req.url.startsWith("/health"),
  }),
);

// Security headers
app.use(helmet());

// Compression for faster responses
app.use(compression());

// JSON body parsing
app.use(express.json({ limit: "1mb" })); // limit body size

// ---------------------------------------------------------------------
// 2) SECURE CORS CONFIG
// ---------------------------------------------------------------------

// List of allowed origins (you can add more domains later)
const allowedOrigins = [
  process.env.CORS_ORIGIN,                  // e.g. https://mymmentalhealthbuddy.com
  process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : null,
  process.env.REPLIT_PROD_DOMAIN
    ? `https://${process.env.REPLIT_PROD_DOMAIN}`
    : null,
].filter(Boolean); // remove null/undefined

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    maxAge: 24 * 60 * 60, // 24h
  }),
);

// ---------------------------------------------------------------------
// 3) RATE LIMITING
// ---------------------------------------------------------------------

// Everything under /api uses the general limiter
app.use("/api", apiLimiter);

// Specific high-risk/high-cost endpoints
// (You can change these paths to match your actual routes)
app.use("/ai", aiLimiter);
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);
app.use("/webhooks/stripe", webhookLimiter);

// ---------------------------------------------------------------------
// 4) HEALTH ENDPOINTS (BLOCKER #6)
// ---------------------------------------------------------------------

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/ready", async (req, res) => {
  try {
    // If db is configured, do a quick query
    if (db && sql) {
      await db.execute(sql`SELECT 1`);
    }
    res.status(200).json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "not_ready",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ---------------------------------------------------------------------
// 5) API ROUTES
// ---------------------------------------------------------------------

// You can choose to mount these under /api/* if you like,
// but I'll mirror your audit style here:

app.use("/auth", authRoutes);
app.use("/mood", moodRoutes);
app.use("/journal", journalRoutes);
app.use("/stripe", stripeRoutes);
app.use("/billing", billingRoutes);
app.use("/ai", aiRoutes);

// ---------------------------------------------------------------------
// 6) STATIC FRONTEND SERVING (BLOCKER #5)
// ---------------------------------------------------------------------

// Path to client build output: ../client/dist relative to this file
const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  console.log("🎨 Serving frontend from:", clientDist);

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(clientDist));

  // SPA fallback: any non-API route should serve index.html
  app.get("*", (req, res, next) => {
    // If the path starts with a known API prefix, skip to next (404 or route)
    if (
      req.path.startsWith("/auth") ||
      req.path.startsWith("/mood") ||
      req.path.startsWith("/journal") ||
      req.path.startsWith("/stripe") ||
      req.path.startsWith("/billing") ||
      req.path.startsWith("/ai") ||
      req.path.startsWith("/health")
    ) {
      return next();
    }

    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  console.warn(
    "⚠️ Frontend build not found. Run `npm run build` to generate client/dist.",
  );
}

// ---------------------------------------------------------------------
// 7) 404 HANDLER
// ---------------------------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.url,
    requestId: req.id,
  });
});

// ---------------------------------------------------------------------
// 8) GLOBAL ERROR HANDLER
// ---------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌ Error handler:", {
    requestId: req.id,
    message: err.message,
    stack: err.stack,
    path: req.url,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    error: isProd ? "Internal server error" : err.message,
    requestId: req.id,
    ...(isProd ? {} : { stack: err.stack }),
  });
});

// ---------------------------------------------------------------------
// 9) START SERVER (0.0.0.0 for Replit Autoscale)
// ---------------------------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
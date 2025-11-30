// server/index.mjs
// Main Express server for MyMentalHealthBuddy (ESM + Replit friendly)

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// Unified DB client (single connection point)
import { db } from "./db/connection.mjs";

// Response helpers
import {
  success,
  notFound,
  serverError,
} from "./utils/response.mjs";

// Middleware
import { rateLimit } from "./middleware/rateLimit.mjs";

// API routes
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";
import analyticsRoutes from "./routes/analytics.mjs";
import billingRoutes from "./routes/billing.mjs";
import aiRoutes from "./routes/ai.mjs";

const app = express();

// -----------------------------------------------------------------------------
// 1) BASIC SECURITY + BODY LIMITS
// -----------------------------------------------------------------------------

// Limit JSON body to 10kb to avoid abuse
app.use(
  express.json({
    limit: "10kb",
  })
);

// Allow URL-encoded bodies too (small)
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// CORS (can be tightened later)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Basic security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Gzip responses
app.use(compression());

// -----------------------------------------------------------------------------
// 2) SIMPLE REQUEST ID MIDDLEWARE (for debugging)
// -----------------------------------------------------------------------------

app.use((req, _res, next) => {
  // Short pseudo-ID – good enough for correlating logs
  req.requestId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  next();
});

// -----------------------------------------------------------------------------
// 3) ENVIRONMENT VALIDATION (critical keys)
// -----------------------------------------------------------------------------

function requireEnv(name, options = {}) {
  const value = process.env[name];
  if (!value) {
    const msg = `Missing required environment variable: ${name}`;
    if (options.optional) {
      console.warn("⚠️", msg);
      return null;
    }
    console.error("❌", msg);
    throw new Error(msg);
  }
  return value;
}

// Validate essential env vars on startup
const DATABASE_URL = requireEnv("DATABASE_URL");
const SESSION_SECRET = requireEnv("SESSION_SECRET");
const OPENAI_API_KEY = requireEnv("OPENAI_API_KEY", { optional: true });
const STRIPE_SECRET_KEY = requireEnv("STRIPE_SECRET_KEY", { optional: true });

if (!OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set – AI chat routes may be disabled.");
}
if (!STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY is not set – billing routes may be disabled.");
}

// -----------------------------------------------------------------------------
// 4) ATTACH DB + RATE LIMITER
// -----------------------------------------------------------------------------

// Attach db to req for downstream handlers if needed
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// Apply rate limiter to all API routes
app.use("/api", rateLimit);

// -----------------------------------------------------------------------------
// 5) ROUTE MOUNTING
// -----------------------------------------------------------------------------

// Health first (used by Replit / monitors)
app.get("/api/health", (req, res) => {
  return success(
    res,
    {
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
    "MyMentalHealthBuddy API is healthy.",
    req
  );
});

// Auth + core feature routes
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);

// Newly mounted routes from your analysis report
app.use("/api/journal", journalRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/ai", aiRoutes);

// -----------------------------------------------------------------------------
// 6) 404 HANDLER (API ONLY)
// -----------------------------------------------------------------------------

// Any /api/* route not handled above becomes a JSON 404
app.use("/api", (req, res) => {
  return notFound(res, `API route not found: ${req.method} ${req.originalUrl}`, req);
});

// -----------------------------------------------------------------------------
// 7) ERROR HANDLER
// -----------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error("🚨 Unhandled error:", err);
  return serverError(res, err, "Internal server error.", req);
});

// -----------------------------------------------------------------------------
// 8) SERVER START + GRACEFUL SHUTDOWN
// -----------------------------------------------------------------------------

const PORT = Number(process.env.PORT || 5000); // Replit injects PORT
const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(
    `🚀 MyMentalHealthBuddy API listening on http://${HOST}:${PORT} (env: ${process.env.NODE_ENV || "development"})`
  );
});

// Graceful shutdown for Replit / production
function shutdown(signal) {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log("✅ HTTP server closed.");
    // If db has a .end or .close method, call it here:
    if (db && typeof db.end === "function") {
      db.end().then(
        () => {
          console.log("✅ Database connection closed.");
          process.exit(0);
        },
        (err) => {
          console.error("❌ Error closing database connection:", err);
          process.exit(1);
        }
      );
    } else {
      process.exit(0);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Optional export for tests
export default app;
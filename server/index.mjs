// server/index.mjs (top of file)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { apiLimiter, aiLimiter, authLimiter, webhookLimiter } from "./middleware/rateLimiter.mjs";
// import db from your db/connection file, adjust the path:
import { db } from "./db/connection.mjs"; // <-- adjust path if different
import { sql } from "drizzle-orm";        // if you use drizzle sql tagged template 

// ====== ROUTES ======
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";

// Stripe routes (corrected)
import stripeRoutes from "./routes/stripe.mjs";            // <-- correct
import billingRoutes from "./routes/billing.mjs";          // <-- correct
import stripeWebhookHandler from "./routes/stripeWebhook.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ====== STRIPE WEBHOOK — MUST BE FIRST ======
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

// Basic middleware
app.use(express.json());
app.use(helmet());
app.use(compression());

// 🔐 Secure CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN || null,
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  // Add your known production domains here:
  "https://yourapp.replit.app",
  "https://mymmentalhealthbuddy.com", // <-- replace/adjust as needed
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl/Postman) with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    maxAge: 60 * 60 * 24, // 24h
  })
);

// 🔐 Rate limiting
app.use("/api", apiLimiter);
app.use("/ai", aiLimiter);
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);
app.use("/webhooks/stripe", webhookLimiter);

// Health endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
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
    await db.execute(sql`SELECT 1`);
    res.status(200).json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ====== ROUTES ======
app.use("/auth", authRoutes);
app.use("/mood", moodRoutes);
app.use("/journal", journalRoutes);

// Static frontend serving (Vite build)
const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  console.log("🎨 Serving frontend from:", clientDist);

  // SPA fallback: any non-API route returns index.html
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/auth") || req.path.startsWith("/mood") || req.path.startsWith("/journal") || req.path.startsWith("/stripe") || req.path.startsWith("/billing") || req.path.startsWith("/ai")) {
      return res.status(404).json({ error: "Not found" });
    }

    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  console.warn("⚠️ Frontend build not found. Run: npm run build");
}
// 404 handler (for unmatched routes)
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.url,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", {
    message: err.message,
    stack: err.stack,
    path: req.url,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(statusCode).json({
    error: message,
  });
});

// Stripe product price endpoints
app.use("/stripe", stripeRoutes);

// Billing (checkout session)
app.use("/billing", billingRoutes);

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
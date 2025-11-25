// server/index.mjs
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";
import aiRoutes from "./routes/ai.mjs";
import stripeWebhook from "./routes/stripeWebhook.mjs";

import { db } from "./db/connection.mjs";

// Create express app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Stripe raw body only for webhook route
app.use("/stripe/webhook", stripeWebhook);

// Backend API routes
app.use("/auth", authRoutes);
app.use("/mood", moodRoutes);
app.use("/journal", journalRoutes);
app.use("/ai", aiRoutes);

// ===== FRONTEND SERVING (MUST COME AFTER ROUTES) =====
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDistPath = path.join(__dirname, "../client/dist");

// Serve static React build
app.use(express.static(clientDistPath));

// React Router fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ===== HEALTH CHECKS =====
app.get("/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

app.get("/health/ready", async (req, res) => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not ready" });
  }
});

// ===== START SERVER =====
const server = app.listen(PORT, "0.0.0.0", () =>
  console.log("Backend running on:", PORT)
);

// ===== GRACEFUL SHUTDOWN =====
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  server.close(() => process.exit(0));
});

export default app;
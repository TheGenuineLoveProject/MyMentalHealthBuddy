// server/index.mjs
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { router as apiRouter } from "./routes/index.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Replit / proxy for correct IPs + HTTPS
app.set("trust proxy", 1);

// Basic security + JSON parsing
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());

// Global rate limit (stateless-friendly)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

// Mount API routes (mood, journal, analytics, ai, auth...)
app.use("/api", apiRouter);

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`MyMentalHealthBuddy API listening on http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
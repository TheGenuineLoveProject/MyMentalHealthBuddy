// server/index.mjs
// CLEAN • SAFE • PRODUCTION READY • Replit Autoscale-Compatible

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import apiRateLimit from "./middleware/rateLimit.mjs";
import { fileURLToPath } from "url";
import path from "path";

// ROUTES
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";
import analyticsRoutes from "./routes/analytics.mjs";
import aiRoutes from "./routes/ai.mjs";
import billingRoutes from "./routes/billing.mjs";

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EXPRESS APP
const app = express();

// REQUIRED FOR REPLIT AUTOSCALE + EXPRESS-RATE-LIMIT v7
// Fixes: ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set("trust proxy", 1);

// GLOBAL MIDDLEWARES
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// RATE LIMITER (works now!)
app.use(apiRateLimit);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/billing", billingRoutes);

// STATIC FRONTEND
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
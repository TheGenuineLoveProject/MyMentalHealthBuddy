// server/index.mjs
// FINAL CLEAN VERSION — no duplicates, Replit-safe, perfect routing.

import express from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from './middleware/rateLimit.mjs';
import { json } from "express";

import authRoutes from "./routes/auth.mjs";
import journalRoutes from "./routes/journal.mjs";
import moodRoutes from "./routes/mood.mjs";
import analyticsRoutes from "./routes/analytics.mjs";
import billingRoutes from "./routes/billing.mjs";
import aiRoutes from "./routes/ai.mjs";

const app = express();

// ----------------------------------------------------
// CORE MIDDLEWARE
// ----------------------------------------------------
app.use(cors());
app.use(compression());
app.use(json());
app.use(rateLimit); // ✅ correct, single usage

// ----------------------------------------------------
// HEALTH CHECK (Required by Replit Autoscale)
// ----------------------------------------------------
app.get("/api/health", (req, res) => {
  return res.json({ status: "ok", uptime: process.uptime() });
});

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/ai", aiRoutes);

// ----------------------------------------------------
// SERVER STARTUP — Replit requires 0.0.0.0
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MyMentalHealthBuddy API listening on http://0.0.0.0:${PORT}`);
});

// ----------------------------------------------------
// CLEAN EXIT SIGNALS FOR REPLIT
// ----------------------------------------------------
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
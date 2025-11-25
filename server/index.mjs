import express from "express";
import cors from "cors";
import helmet from "helmet";

// === ROUTES ===
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";
import aiRoutes from "./routes/ai.mjs";          // <— ADD THIS
import billingRoutes from "./routes/billing.mjs";
import stripeWebhook from "./routes/stripeWebhook.mjs";

import { db } from "./db/connection.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// === STRIPE RAW ROUTE ===
app.use("/stripe/webhook", stripeWebhook);

// === BACKEND ROUTES ===
app.use("/auth", authRoutes);
app.use("/mood", moodRoutes);
app.use("/journal", journalRoutes);
app.use("/ai", aiRoutes);                       // <— ACTIVATE AI API
app.use("/billing", billingRoutes);

// === STATIC FRONTEND (REPLIT AUTOSCALE SAFE) ===
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "../client/dist");

app.use(express.static(clientDist));

// === REACT FALLBACK ===
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// === HEALTH CHECKS ===
app.get("/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

app.get("/health/ready", async (req, res) => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not-ready" });
  }
});

const server = app.listen(PORT, "0.0.0.0", () =>
  console.log("Backend running on", PORT)
);

process.on("SIGTERM", () => {
  console.log("Shutting down...");
  server.close(() => process.exit(0));
});

export default app;
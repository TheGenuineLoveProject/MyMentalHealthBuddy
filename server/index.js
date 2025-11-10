// ✅ server/index.js — Canva OAuth + AI unified to 8888888888888888888888888^

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRouter from "./routes/ai-routes/ai.js";
import canvaOAuth from "./routes/canva-oauth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🌿 Health route
app.get("/healthz", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 🌸 Routes
app.use("/api/ai", aiRouter);
app.use("/api/canva", canvaOAuth);

// 🌍 Dynamic Replit port
const PORT = process.env.PORT || 5173;

// 👉 Canva Policy Routes
import express from "express";
app.use("/policies", express.static("public/policies"));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running perfectly on port ${PORT}`)
);
// server/index.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

// Import routes
import { getAIResponse } from "./ai";
import aiEmployeeRouter from "./ai/employee";
import authRouter from "./routes/auth";
import apiRouter from "./routes"; // adjust if your main routes are elsewhere
import healingRoute from "./routes/healing";
app.use("/api", healingRoute);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup (do this ONCE only)
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.send("✅ Server is working perfectly!");
});

// Built-in test endpoint (optional, can delete if not needed)
app.get("/", (req, res) => {
  res.send("🧠 Backend is working!");
});

// Route mounting
app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/api/ai", aiEmployeeRouter); // AI Employee Route

// Optional: Direct POST route for raw AI prompt
app.post("/api/ai", async (req, res) => {
  const userMessage = req.body.message;
  const reply = await getAIResponse(userMessage);
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

// AI Bot route (already added by you)
import aiEmployeeRouter from "./ai/employee";
app.use("/api/ai", aiEmployeeRouter);
import aiRoutes from "./routes/ai";
app.use("/api/ai", aiRoutes);

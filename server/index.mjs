import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

// ROUTES
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";

import path from "path";
import { fileURLToPath } from "url";

// Setup path utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();

// --------------------
// Middleware
// --------------------
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet());

// --------------------
// Database
// --------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool);

// --------------------
// Health Check
// --------------------
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);

// --------------------
// Serve frontend (Vite build)
// --------------------
app.use(express.static("client/dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// --------------------
// Server
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
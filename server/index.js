// server/index.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// ✅ Middleware
app.use(
  cors({
    origin: isDev
      ? true
      : process.env.FRONTEND_URL || "https://mymentalhealthbuddy.replit.app",
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Example route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server running perfectly 💖" });
});

// ✅ Static frontend
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ✅ Start server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 MyMentalHealthBuddy running on http://localhost:${PORT}`);
});
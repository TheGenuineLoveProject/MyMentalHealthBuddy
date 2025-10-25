import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { loadEnv } from "./server/helpers/env.js";
import { db } from "./db.js";
import { setupRoutes } from "./routes.js";
import { setupVite, log } from "./vite.js";

loadEnv();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mhb-secret-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" },
  })
);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "MyMentalHealthBuddy backend is alive!" })
});

setupRoutes(app, db);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer(app);

if (isDev) {
  await setupVite(app, server);
  log("✅ Environment variables loaded");
} else {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  })
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" })
});

server.listen(PORT, () => {
  console.log(`✅ Server healed and running perfectly on port ${PORT}`)
});

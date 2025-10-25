// ---------- Imports ----------
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ---------- Setup ----------
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Middleware ----------
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Sessions ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mhb-secret-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" }
  })
);

// ---------- Health Check ----------
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "💚 MyMentalHealthBuddy backend is alive!" });
});

// ---------- Serve Frontend ----------
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ---------- Error Handler ----------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ---------- Start Server ----------
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// ---------- Auto Port Fix ----------
process.on("uncaughtException", (err) => {
  if (err.message.includes("EADDRINUSE")) {
    console.log("⚠️ Port 5000 busy — retrying on 5001...");
    const altPort = 5001;
    server.listen(altPort, () => {
      console.log(`✅ Server now running on http://localhost:${altPort}`);
    });
  } else {
    console.error("Unhandled Error:", err);
  }
});
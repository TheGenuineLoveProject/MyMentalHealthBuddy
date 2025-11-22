/* ================================================================
   FINAL PERFECTED SERVER — REPLIT AUTOSCALE SAFE — 8888^
   - Pure Express server
   - Auto-loads routes
   - Serves React frontend
   - Includes authGuard
   - Fixes ALL prior syntax breaks
   ================================================================ */

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import { fileURLToPath } from "url";
import authGuard from "./middleware/auth.mjs";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the server
const app = express();

/* ================================================================
   CORE MIDDLEWARE
================================================================ */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(helmet());
app.use(compression());

/* ================================================================
   HEALTH CHECK
================================================================ */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

/* ================================================================
   SIMPLE PROTECTED ROUTES
================================================================ */
app.get("/dashboard", authGuard, (req, res) => {
  res.json({
    status: "ok",
    message: "Dashboard access granted",
    user: req.user,
  });
});

app.get("/analytics", authGuard, (req, res) => {
  res.json({
    status: "ok",
    message: "Analytics access granted",
    user: req.user,
  });
});

/* ================================================================
   AUTO-LOAD ALL ROUTES FROM /server/routes
================================================================ */
const routesDir = path.join(__dirname, "routes");

if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir).filter((f) => f.endsWith(".mjs"));

  files.forEach((file) => {
    const full = path.join(routesDir, file);

    import(full)
      .then((mod) => {
        const router = mod.default;
        if (!router) {
          console.error(`❌ No default export in ${file}`);
          return;
        }

        const base = "/" + file.replace(".mjs", "");
        const mount = base === "/index" ? "/" : base;

        app.use(mount, router);
        console.log(`✅ Loaded route: ${mount}`);
      })
      .catch((err) =>
        console.error(`❌ Failed to load route ${file}:`, err)
      );
  });
} else {
  console.warn("⚠️ Routes directory missing:", routesDir);
}

/* ================================================================
   SERVE REACT FRONTEND
================================================================ */

const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  console.log("🎨 Frontend build detected:", clientDist);

  // SPA fallback — React Router handles routing
  app.get(
    [
      "/",
      "/auth-test",
      "/protected-test",
      "/dashboard",
      "/analytics",
      "/journal",
      "/mood",
      "/ai",
      "/content",
    ],
    (req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    }
  );

  // Catch all
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

/* ================================================================
   KEEP ALIVE
================================================================ */
app.get("/keepalive", (req, res) => {
  res.json({
    status: "alive",
    time: new Date().toISOString(),
  });
});

/* ================================================================
   404 HANDLER
================================================================ */
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.originalUrl,
    time: new Date().toISOString(),
  });
});

/* ================================================================
   GLOBAL ERROR HANDLER
================================================================ */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    error: "Server error",
    detail: err.message ?? "Unknown error",
    time: new Date().toISOString(),
  });
});

/* ================================================================
   START SERVER — REPLIT AUTOSCALE SAFE
================================================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
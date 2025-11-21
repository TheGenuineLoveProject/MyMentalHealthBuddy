// =======================================================
// FINAL-PERFECTED INDEX.MJS — BACKEND + FRONTEND SERVE
// Replit Autoscale Safe • Vite Compatible • ESM Safe
// =======================================================

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------
// Resolve ESM __dirname / __filename
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------
// Create Express App FIRST
// ------------------------------
const app = express();

// ------------------------------
// Core Middleware
// ------------------------------
app.use(cors());
app.use(express.json());

// =======================================================
// FRONTEND STATIC SERVE (client/dist)
// =======================================================

const clientDist = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientDist)) {
  console.log("✅ Frontend build folder detected:", clientDist);
  app.use(express.static(clientDist));

  // React SPA fallback
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();

    const indexFile = path.join(clientDist, "index.html");
    if (!fs.existsSync(indexFile)) {
      return res
        .status(404)
        .send("❌ index.html missing — run Vite build before deployment.");
    }

    return res.sendFile(indexFile);
  });
} else {
  console.log("⚠️ No built frontend found. (client/dist missing)");
}

// =======================================================
// HEALTH CHECK
// =======================================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// =======================================================
// ROUTES AUTO-LOADER
// =======================================================

const routesDir = path.join(__dirname, "routes");

if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir);

  for (const file of files) {
    if (!file.endsWith(".mjs")) {
      console.log(`⚠️ Skipped non-MJS route file: ${file}`);
      continue;
    }

    try {
      const full = path.join(routesDir, file);
      const module = await import(full);

      if (typeof module.default !== "function") {
        console.error(`❌ ERROR: ${file} does NOT export a default router`);
        continue;
      }

      const routePath = "/" + file.replace(".mjs", "");
      app.use(routePath, module.default);
      console.log(`✅ Loaded route: ${routePath}`);
    } catch (err) {
      console.error(`❌ Route load FAILED for ${file}`, err);
    }
  }
} else {
  console.log("⚠️ No routes directory found at:", routesDir);
}

// =======================================================
// PORT + SERVER START (Replit Autoscale Safe)
// =======================================================
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
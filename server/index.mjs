// ======================================================
// FINAL-PERFECTED INDEX.MJS — REPLIT AUTOSCALE SAFE 8888^
// Pure Express server (no shell commands)
// - Serves Vite frontend from client/dist
// - Auto-loads .mjs route files from /server/routes
// - Works with Replit Autoscale (PORT + 0.0.0.0)
// ======================================================

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------- Resolve __dirname in ESM ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Create app FIRST ----------
const app = express();

// ---------- Core middleware ----------
app.use(cors());
app.use(express.json());

// ======================================================
// HEALTH CHECK
// ======================================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// ======================================================
// FRONTEND STATIC SERVE (Vite build in client/dist)
// ======================================================
const clientDistPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientDistPath)) {
  console.log("✅ Frontend build folder detected:", clientDistPath);

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(clientDistPath));
} else {
  console.warn("⚠️ Frontend build folder NOT found:", clientDistPath);
  console.warn("   Run `cd client && npm install && npm run build` to create it.");
}

// ======================================================
// ROUTE AUTO-LOADER — loads all .mjs files in /server/routes
// Each file should `export default router` (Express Router or handler)
// ======================================================
const routesDir = path.join(__dirname, "routes");

if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir);

  for (const file of files) {
    if (!file.endsWith(".mjs")) {
      console.log(`⚪ Skipped non-MJS route file: ${file}`);
      continue;
    }

    const fullPath = path.join(routesDir, file);

    try {
      const module = await import(fullPath);
      const router = module.default;

      if (typeof router !== "function") {
        console.error(
          `❌ Route file ${file} does NOT export a default router function`
        );
        continue;
      }

      // e.g. ai.mjs -> /ai, content.mjs -> /content, ai-dashboard.mjs -> /ai-dashboard
      const routePath = "/" + file.replace(".mjs", "");
      app.use(routePath, router);

      console.log(`✅ Loaded route: ${routePath}`);
    } catch (err) {
      console.error(`❌ Route load FAILED for ${file}`, err);
    }
  }
} else {
  console.warn("⚠️ No routes directory found at:", routesDir);
}

// ======================================================
// SPA FALLBACK — send index.html for ANY non-API route
// Must be AFTER routes and static middleware
// ======================================================
app.get("*", (req, res, next) => {
  // Keep API paths for future use (if you add /api/… endpoints later)
  if (req.path.startsWith("/api")) {
    return next();
  }

  const indexFile = path.join(clientDistPath, "index.html");

  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }

  console.error("❌ Frontend build missing index.html at:", indexFile);
  return res.status(404).send("Frontend build missing (index.html not found)");
});

// ======================================================
// START SERVER — Replit Autoscale-safe
// ======================================================
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
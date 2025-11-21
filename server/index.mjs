// === FINAL-PERFECTED INDEX.MJS — REPLIT AUTOSCALE SAFE 8888^ ===
// Pure Express server (no shell commands)
// Serves Vite frontend from client/dist
// Auto-loads .mjs route files from /server/routes
// Works with Replit Autoscale (PORT + 0.0.0.0)

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authGuard from "./middleware/auth.mjs"; // ✅ NOTE: ./middleware (inside /server)

// -------- Resolve __dirname in ESM --------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------- Create app FIRST --------
const app = express();

// -------- Core middleware --------
app.use(cors());
app.use(express.json());

// -------- HEALTH CHECK --------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// -------- PROTECTED DEMO ROUTES --------
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
    message: "Analytics unlocked",
    user: req.user,
  });
});

// -------- AUTO-LOAD .mjs ROUTE FILES --------
const routesDir = path.join(__dirname, "routes");

if (fs.existsSync(routesDir)) {
  fs
    .readdirSync(routesDir)
    .filter((file) => file.endsWith(".mjs"))
    .forEach((file) => {
      const fullPath = path.join(routesDir, file);
      import(fullPath)
        .then((routeModule) => {
          const router = routeModule.default;
          const basePath = "/" + file.replace(".mjs", "");
          const routePath = basePath === "/index" ? "/" : basePath;
          app.use(routePath, router);
          console.log(`✅ Loaded route: ${routePath}`);
        })
        .catch((err) => {
          console.error(`❌ Failed to load route ${file}:`, err);
        });
    });
} else {
  console.log("⚠️ routes directory not found:", routesDir);
}

// -------- SERVE REACT FRONTEND --------
const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  console.log("✅ Frontend build folder detected:", clientDist);
  app.use(express.static(clientDist));

  // any unknown path -> React index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  console.log(
    "⚠️ No frontend build found. Run: cd client && npm install && npm run build"
  );
}

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
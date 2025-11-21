// ==========================================
// FINAL PERFECTED INDEX.MJS (88888888^ SAFE)
// ESM-SAFE • REPLIT-SAFE • AUTOSCALE-SAFE
// ==========================================

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------- ESM __dirname FIX ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- INIT APP ----------
const app = express();
app.use(cors());
app.use(express.json());

// ---------- HEALTH ROUTE ----------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString()
  });
});
console.log("✔ Core middleware loaded, Health route ready");

// ---------- ROUTE LOADER (NO ERRORS) ----------
const routesDir = path.join(__dirname, "routes");

fs.readdirSync(routesDir).forEach((file) => {
  try {
    // Skip non-MJS files
    if (!file.endsWith(".mjs")) {
      console.log(`⚪ Skipped non-MJS file: ${file}`);
      return;
    }

    const fullPath = path.join(routesDir, file);
    console.log(`📥 Loading route: ${file}`);

    import(fullPath)
      .then((routeModule) => {
        const router = routeModule.default;

        if (typeof router !== "function") {
          console.error(
            `❌ ERROR: ${file} does NOT export a valid router (default export missing)`
          );
          return;
        }

        // route file "ai-dashboard.mjs" → "/ai-dashboard"
        const routePath = "/" + file.replace(".mjs", "");

        app.use(routePath, router);
        console.log(`✔ Loaded route: ${routePath}`);
      })
      .catch((err) => {
        console.error(`❌ Failed to load route: ${file}`, err);
      });
  } catch (err) {
    console.error(`❌ Route-loader error for: ${file}`, err);
  }
});

// ---------- PORT (REPLIT + AUTOSCALE SAFE) ----------
const PORT = Number(process.env.PORT) || 5000;

// ---------- START SERVER ----------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
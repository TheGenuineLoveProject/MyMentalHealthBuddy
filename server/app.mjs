import adminPublishingRoutes from "./routes/admin-publishing.mjs";
import adminSecurityRoutes from "./routes/admin-security.mjs";
import authRoutes from "./routes/auth.mjs";
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT ERROR:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE:', err);
});
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ROUTES (FIXES aiRoutes error)
import aiRoutes from "./routes/ai.mjs";
import aiHealingRoutes from "./routes/ai.healing.mjs";
import aiBusinessRoutes from "./routes/ai.business.mjs";
import healthRoutes from "./routes/health.mjs";
import streaksRoutes from "./routes/streaks.mjs";
import telemetryRoutes from "./routes/telemetry.mjs";
import buddyRoutes from "./routes/buddy.mjs";

// ✅ OPTIONAL AUTH (FIXES authMiddleware error)
import { optionalAuth, requireAuth, requireAdmin } from "./middleware/auth.mjs";
import { requireAdult } from "./middleware/requireAdult.mjs";
import adminRoutes from "./routes/admin.mjs";
import adminBillingRoutes from "./routes/adminBilling.mjs";
import sessionBoundaryRoutes from "./routes/session-boundary.mjs";
import { csrfProtection, issueCsrfToken } from "./security/csrf.mjs";
import db from "./db/client.mjs";

// Expose to session-boundary helpers without touching working modules.
globalThis.issueCsrfToken = issueCsrfToken;
if (db) globalThis.db = db;

// ----------------------------
// APP INIT
// ----------------------------
const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: (origin, cb) => {
    const allowed = (process.env.CORS_ORIGIN || "")
      .split(",").map(s => s.trim()).filter(Boolean);
    if (!origin) return cb(null, true);
    if (allowed.length === 0) return cb(null, true);
    if (allowed.includes("*")) return cb(null, true);
    return allowed.includes(origin) ? cb(null, true) : cb(new Error("CORS: origin not allowed"));
  },
  credentials: true,
}));
app.use(express.json());

// ===== SECURITY LAYER =====
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const IS_DEV = process.env.NODE_ENV !== "production";
console.log(`[boot] mode=${IS_DEV ? "development" : "production"} (NODE_ENV=${process.env.NODE_ENV || "<unset>"})`);
app.use(helmet({
  contentSecurityPolicy: IS_DEV
    ? {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          "connect-src": ["'self'", "ws:", "wss:", "http:", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
        },
      }
    : undefined,
}));
app.use(cookieParser()); // ✅ MUST COME BEFORE CSRF

// ===== SESSION BOUNDARY FIRST (NO CSRF) =====
app.use('/api/session-boundary', sessionBoundaryRoutes);

// ===== THEN APPLY CSRF GLOBALLY =====
app.use(csrfProtection);

// ===== AI RATE LIMIT (single source of truth) =====
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/ai", aiLimiter);

// ===== ADMIN RATE LIMIT (stricter) =====
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve built React app in prod; in dev, attach Vite middleware for HMR/transform.
const CLIENT_ROOT = path.join(__dirname, "..", "client");
const CLIENT_DIST = path.join(CLIENT_ROOT, "dist");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

let viteDevServer = null;
if (IS_DEV) {
  const { createServer: createViteServer } = await import("vite");
  viteDevServer = await createViteServer({
    root: CLIENT_ROOT,
    configFile: path.join(__dirname, "..", "vite.config.js"),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  app.use(viteDevServer.middlewares);
} else {
  app.use(express.static(CLIENT_DIST, { index: "index.html" }));
}
app.use(express.static(PUBLIC_DIR, { index: false }));

// ----------------------------
// ROUTES
// ----------------------------

// Health check (must work first)
app.use("/api/health", healthRoutes);
app.use("/api/streaks", optionalAuth, streaksRoutes);
app.use("/api/telemetry", telemetryRoutes);

// Healing engine (gated by age verification; admin sub-routes self-gate)
app.use("/api/ai/healing", requireAdult, aiHealingRoutes);

// Business engine (staff/admin only; admin sub-routes self-gate)
app.use("/api/ai/business", aiBusinessRoutes);

// Auth routes (mount before AI routes so /api/auth/* works)
app.use("/api/auth", authRoutes);

// Admin routes (strict: limiter -> requireAuth -> requireAdmin). Only admin.mjs is mounted.
app.use("/api/admin", adminLimiter, requireAuth, requireAdmin, adminRoutes);

/* ===== ADMIN BILLING (SAFE MOUNT) ===== */
app.use(
  "/api/admin/billing",
  adminLimiter,
  requireAuth,
  requireAdmin,
  adminBillingRoutes
);

/* ===== ADMIN PUBLISHING (SAFE MOUNT) ===== */
app.use(
  "/api/admin/publishing",
  adminLimiter,
  requireAuth,
  requireAdmin,
  adminPublishingRoutes
);

// AI routes (aiLimiter already mounted above on /api/ai before this handler)
app.use("/api/ai", optionalAuth, aiRoutes);

// MMHB Buddy Engine — healing-domain visual+text endpoint (POST /api/buddy)
app.use("/api", buddyRoutes);

// ----------------------------
// ROOT
// ----------------------------
app.get("/api/_meta", (_req, res) => {
  res.json({
    service: "MyMentalHealthBuddy",
    brand: "TheGenuineLoveProject",
    status: "running",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "mymmentalhealthbuddy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/ready", (_req, res) => {
  res.status(200).json({ ok: true });
});

// SPA fallback: any non-API, non-asset GET serves the React index.
app.get("*", async (req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api/")) return next();
  if (req.path === "/health" || req.path === "/ready") return next();
  if (req.path.includes(".")) return next();
  if (IS_DEV && viteDevServer) {
    try {
      const fs = await import("node:fs/promises");
      const indexPath = path.join(CLIENT_ROOT, "index.html");
      let html = await fs.readFile(indexPath, "utf-8");
      html = await viteDevServer.transformIndexHtml(req.originalUrl, html);
      return res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      viteDevServer.ssrFixStacktrace(e);
      return next(e);
    }
  }
  return res.sendFile(path.join(CLIENT_DIST, "index.html"));
});
// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
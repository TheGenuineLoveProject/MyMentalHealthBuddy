import adminPublishingRoutes from "./routes/admin-publishing.mjs";
import adminSecurityRoutes from "./routes/admin-security.mjs";
import authRoutes from "./routes/auth.mjs";
import { registerAuthRoutes } from "./replit_integrations/auth/index.mjs";
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
          "font-src": ["'self'", "data:", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
        },
      }
    : {
        useDefaults: true,
        directives: {
          // 'unsafe-inline' required for the inline theme-bootstrap IIFE in client/index.html
          // (prevents FOUC / dark-mode flicker on a mental-wellness surface). External JS
          // is still locked to 'self' + Stripe.
          "script-src": ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
          "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          "connect-src": ["'self'", "https://api.stripe.com", "https://api.openai.com", "https://r.stripe.com"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "font-src": ["'self'", "data:", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
          "frame-src": ["'self'", "https://js.stripe.com", "https://hooks.stripe.com", "https://m.stripe.network"],
        },
      },
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

// Replit-integrations auth (registers GET /api/auth/user — consumed by
// client/src/context/AuthContext.jsx::fetchReplitUser to hydrate user/role
// on page load. Without this, AuthContext gets a 404 and falls back to
// localStorage-only state, which broke session persistence and admin
// role-based routing on cold reloads.)
registerAuthRoutes(app);

// Admin login token verification — must be PUBLIC (chicken-and-egg: you can't
// require admin auth on the very endpoint that grants it). Mounted BEFORE the
// protected /api/admin chain so Express resolves it first. Rate-limited only.
app.post("/api/admin/verify-token", adminLimiter, (req, res, next) => {
  // Re-dispatch into adminRoutes so the original handler logic stays in admin.mjs
  req.url = "/verify-token";
  return adminRoutes(req, res, next);
});

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

/* ===== ADMIN SUB-ROUTERS (SAFE-MOUNT) =====
 * These admin sub-trees existed as router files in server/routes/ but were
 * never mounted in app.mjs (the production entrypoint). The frontend admin
 * pages (SecurityDashboard, SocialDashboard, AdminSocial, the audit-log
 * explorer, the soft-launch metrics panel) were therefore reaching admin.mjs's
 * generic /api/admin mount, finding no handler for /security/*, /social/*,
 * /audit-logs, or /soft-launch-metrics, and 404'ing — which surfaced in the
 * UI as "Unable to load…" / "Loading…" states that never resolved.
 *
 * Each mount is wrapped in a single try/catch so one broken router file can
 * never crash boot (matching the EXTENDED_ROUTES safe-mount pattern below).
 * /api/admin/social/enterprise MUST be mounted BEFORE /api/admin/social so
 * Express's first-match-wins routing resolves the more-specific path first.
 * The locked AI / auth / crisis / orchestrator / responsePolicy modules are
 * not touched.
 */
const ADMIN_SUB_ROUTERS = [
  { mount: "/api/admin/social/enterprise",   file: "./routes/social-enterprise.mjs" },
  { mount: "/api/admin/social",              file: "./routes/admin-social-studio.mjs" },
  { mount: "/api/admin/security",            file: "./routes/admin-security.mjs" },
  { mount: "/api/admin/audit-logs",          file: "./routes/audit-logs.mjs" },
  { mount: "/api/admin/soft-launch-metrics", file: "./routes/soft-launch-metrics.mjs" },
];

const mountedAdminSub = [];
const failedAdminSub = [];
for (const r of ADMIN_SUB_ROUTERS) {
  try {
    const mod = await import(r.file);
    const handler = mod.default || mod.router || mod;
    if (typeof handler !== "function" && (typeof handler !== "object" || !handler.use)) {
      failedAdminSub.push(`${r.mount} (no default export)`);
      continue;
    }
    app.use(r.mount, adminLimiter, requireAuth, requireAdmin, handler);
    mountedAdminSub.push(r.mount);
  } catch (e) {
    failedAdminSub.push(`${r.mount} (${e?.message || e})`);
  }
}
console.log(`[boot] admin sub-routers mounted: ${mountedAdminSub.length}/${ADMIN_SUB_ROUTERS.length}`);
if (failedAdminSub.length) {
  console.warn(`[boot] admin sub-routers skipped: ${failedAdminSub.join(", ")}`);
}

// AI routes (aiLimiter already mounted above on /api/ai before this handler)
app.use("/api/ai", optionalAuth, aiRoutes);

// MMHB Buddy Engine — healing-domain visual+text endpoint (POST /api/buddy)
app.use("/api", buddyRoutes);

// ============================================================================
// EXTENDED ROUTE SURFACE — safe-mount of feature routers
// ============================================================================
// app.mjs historically mounted only the locked AI/admin/buddy contracts. The
// platform's user-facing features (blog, newsletter, leads/contact/feedback,
// user/account, journal/mood/gratitude, billing/revenue, gamification,
// onboarding/dashboard/insights, social-posts, uploads, progress) have their
// router files in server/routes/ but were never mounted here, so they 404'd
// at runtime — leaving the user unable to test those features end-to-end.
//
// This block dynamically imports and mounts each missing router behind a
// try/catch so a single broken router file never crashes boot. Each entry
// declares its [path, file, options] — options can include `auth: 'optional'
// | 'required' | 'admin' | 'adult'` and `limiter: aiLimiter | adminLimiter`.
// Locked contract routes above are NOT touched.
// ============================================================================
const EXTENDED_ROUTES = [
  // Public-facing content
  { mount: "/api/blog",          file: "./routes/blog.mjs" },
  { mount: "/api/newsletter",    file: "./routes/newsletter.mjs" },
  { mount: "/api/leads",         file: "./routes/leads.mjs" },
  { mount: "/api/contact",       file: "./routes/contact.mjs" },
  { mount: "/api/feedback",      file: "./routes/feedback.mjs" },
  // User profile / account
  { mount: "/api/user",          file: "./routes/user.mjs",          auth: "optional" },
  { mount: "/api/account",       file: "./routes/account.mjs",       auth: "optional" },
  // Core wellness features (adult-gated)
  { mount: "/api/journal",       file: "./routes/journal.mjs",       auth: "adult" },
  { mount: "/api/mood",          file: "./routes/mood.mjs",          auth: "optional" },
  { mount: "/api/gratitude",     file: "./routes/gratitude.mjs",     auth: "optional" },
  { mount: "/api/favorites",     file: "./routes/favorites.mjs",     auth: "optional" },
  { mount: "/api/progress",      file: "./routes/progress.mjs",      auth: "optional" },
  // Engagement
  { mount: "/api/gamification",  file: "./routes/gamification.mjs",  auth: "optional" },
  { mount: "/api/badges",        file: "./routes/badges.mjs",        auth: "optional" },
  { mount: "/api/onboarding",    file: "./routes/onboarding.mjs",    auth: "optional" },
  { mount: "/api/insights",      file: "./routes/insights.mjs",      auth: "optional" },
  // Billing
  { mount: "/api/billing",       file: "./routes/billing.mjs",       auth: "optional" },
  { mount: "/api/revenue",       file: "./routes/revenue.mjs",       auth: "required" },
  { mount: "/api/pro-features",  file: "./routes/pro-features.mjs",  auth: "optional" },
  // Social
  { mount: "/api/social/posts",  file: "./routes/social-posts.mjs" },
  { mount: "/api/uploads",       file: "./routes/object-storage.mjs",auth: "required" },
  // Telemetry / analytics (already have telemetry mounted; these are extra)
  { mount: "/api/metrics",       file: "./routes/metrics.mjs" },
  { mount: "/api/analytics",     file: "./routes/analytics.mjs" },
  // ─── Round 2 (extended-routes): user-facing wellness + content surfaces ───
  { mount: "/api/dashboard",     file: "./routes/dashboard.mjs",     auth: "optional" },
  { mount: "/api/community",     file: "./routes/community.mjs",     auth: "optional" },
  { mount: "/api/email",         file: "./routes/email.mjs" },
  { mount: "/api/practices",     file: "./routes/practices.mjs" },
  { mount: "/api/wisdom",        file: "./routes/wisdom.mjs" },
  { mount: "/api/knowledge",     file: "./routes/knowledge.mjs" },
  { mount: "/api/content",       file: "./routes/content.mjs" },
  { mount: "/api/content-studio",file: "./routes/content-studio.mjs",auth: "optional" },
  { mount: "/api/social-posting",file: "./routes/social-posting.mjs",auth: "optional" },
  { mount: "/api/therapy",       file: "./routes/therapy.mjs",       auth: "adult" },
  { mount: "/api/reflection",    file: "./routes/reflection.mjs",    auth: "adult" },
  { mount: "/api/states",        file: "./routes/states.mjs" },
  { mount: "/api/prompts",       file: "./routes/prompts.mjs",       auth: "optional" },
  // Forever-companion metacognition mirror — read-only aggregator
  { mount: "/api/growth",        file: "./routes/growth-journey.mjs",auth: "optional" },
  // Peace Scape — Layer 2 foundation (read-only sanctuary state)
  { mount: "/api/peacescape",    file: "./routes/peacescape.mjs",    auth: "optional" },
];

const mountedExtended = [];
const failedExtended = [];
for (const r of EXTENDED_ROUTES) {
  try {
    const mod = await import(r.file);
    const handler = mod.default || mod.router || mod;
    if (typeof handler !== "function" && (typeof handler !== "object" || !handler.use)) {
      failedExtended.push(`${r.mount} (no default export)`);
      continue;
    }
    const middleware = [];
    if (r.auth === "optional") middleware.push(optionalAuth);
    if (r.auth === "required") middleware.push(requireAuth);
    if (r.auth === "admin")    middleware.push(requireAuth, requireAdmin);
    if (r.auth === "adult")    middleware.push(requireAdult);
    if (middleware.length) {
      app.use(r.mount, ...middleware, handler);
    } else {
      app.use(r.mount, handler);
    }
    mountedExtended.push(r.mount);
  } catch (e) {
    failedExtended.push(`${r.mount} (${e?.message || e})`);
  }
}
console.log(`[boot] extended routes mounted: ${mountedExtended.length}/${EXTENDED_ROUTES.length}`);
if (failedExtended.length) {
  console.warn(`[boot] extended routes skipped: ${failedExtended.join(", ")}`);
}

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

try {
  const { ensureSchema } = await import("./db/ensureSchema.mjs");
  await ensureSchema();
} catch (err) {
  console.warn("[boot] ensureSchema skipped:", err?.message || err);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Opt-in background self-heal scheduler.  Off by default.  Enable with
  // HEAL_AUTO_ENABLED=true (and optionally HEAL_AUTO_INTERVAL_MS=<ms>).
  // Always safe-only (heal-self enforces no --apply-destructive).
  import("./lib/healScheduler.mjs")
    .then(({ startScheduler }) => {
      const started = startScheduler();
      if (started) {
        console.log("[heal-scheduler] enabled");
      }
    })
    .catch((err) => {
      console.warn("[heal-scheduler] failed to load:", err?.message || err);
    });
});
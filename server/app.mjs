import adminPublishingRoutes from "./routes/admin-publishing.mjs";
import adminSecurityRoutes from "./routes/admin-security.mjs";
import authRoutes from "./routes/auth.mjs";
import { registerAuthRoutes } from "./replit_integrations/auth/index.mjs";
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT ERROR:', err);
  // Fire-and-forget PagerDuty alert. Dynamic import avoids circular boot
  // ordering and keeps the handler safe even if the alerter fails to load.
  import('./observability/safetyAlerts.mjs')
    .then(({ alertUncaught }) => alertUncaught({ kind: 'uncaughtException', error: err }))
    .catch(() => {});
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE:', err);
  import('./observability/safetyAlerts.mjs')
    .then(({ alertUncaught }) => alertUncaught({ kind: 'unhandledRejection', error: err }))
    .catch(() => {});
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

// Trust the immediate proxy (Replit autoscale / load balancer) so that
// req.ip and X-Forwarded-For are honoured by express-rate-limit. Without
// this, rate limiters can either silently misfire (counting all traffic
// against the proxy IP) or trigger ValidationError in production logs.
// Value `1` means trust ONE proxy hop — narrowest correct setting for
// Replit autoscale; do NOT set to `true` (would trust spoofed headers).
app.set("trust proxy", 1);

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
app.use(express.json({
  // v2.0 Prompt 3.4 — capture raw bytes for HMAC-signed webhooks
  // (HealthKit). Other handlers continue using req.body unchanged.
  verify: (req, _res, buf) => { if (buf?.length) req.rawBody = buf; },
}));

// ===== SECURITY LAYER =====
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
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

// ===== OBSERVABILITY: requestId + OTel baggage =====
// requestId stamps req.requestId (uuid) on every request. observabilityContext
// then mirrors that into the active OpenTelemetry span as baggage so child
// spans (custom orchestrator/awareness/protocol/crisis spans) inherit the
// same correlation context. Both are no-op safe when OTel is disabled.
{
  const { requestId } = await import("./middleware/requestId.mjs");
  const { observabilityContext } = await import("./middleware/observabilityContext.mjs");
  app.use(requestId);
  app.use(observabilityContext);
}

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

// ===== ADMIN RATE LIMITS =====
// Two limiters, intentionally split:
//
//   adminLoginLimiter — STRICT, IP-keyed, applied ONLY to /api/admin/verify-token
//     (the one PUBLIC admin entrypoint where credentials are submitted).
//     Keeps brute-force surface tight: 10 attempts / minute / IP.
//
//   adminLimiter      — RELAXED, identity-keyed, applied to the AUTHENTICATED
//     admin dashboard mounts (which fan out to 8–12 panel queries on first
//     paint and would otherwise trip 429s during a normal load). Identity
//     keying (user.id → user.email) means two admins behind the same NAT
//     do not share a single bucket. The auth middleware runs BEFORE this
//     limiter on every protected mount, so req.user is reliably populated.
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({
      ok: false,
      error: "Too many admin login attempts. Please wait a moment and try again.",
    }),
});

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) return `admin:id:${req.user.id}`;
    if (req.user?.email) return `admin:email:${req.user.email}`;
    try {
      return `admin:ip:${ipKeyGenerator(req.ip)}`;
    } catch {
      return `admin:ip:${req.ip || "unknown"}`;
    }
  },
  handler: (_req, res) =>
    res.status(429).json({
      ok: false,
      error: "Admin rate limit reached. Try again in a moment.",
    }),
});

// Serve built React app in prod; in dev, attach Vite middleware for HMR/transform.
const CLIENT_ROOT = path.join(__dirname, "..", "client");
const CLIENT_DIST = path.join(CLIENT_ROOT, "dist");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// ---------------------------------------------------------------------------
// PWA cache-busting: per-deploy BUILD_ID injected into service-worker.js so
// the SW's cache name (glp-cache-${BUILD_ID}) is unique on every deploy. The
// activate handler then auto-purges all prior glp-cache-* entries.
// Prefer Replit's deployment id when present; otherwise fall back to a per-
// boot timestamp so dev sessions also get a fresh SW.
// ---------------------------------------------------------------------------
const BUILD_ID =
  process.env.BUILD_ID ||
  process.env.REPLIT_DEPLOYMENT_ID ||
  process.env.REPL_ID ||
  `boot-${Date.now()}`;
globalThis.__MMHB_BUILD_ID__ = BUILD_ID;
// Operator visibility: in production an unstable per-boot BUILD_ID would cause
// SW cache thrash across autoscale containers. Warn loudly so the issue is
// caught before it degrades UX, but keep the fallback so dev never breaks.
if (!IS_DEV && BUILD_ID.startsWith("boot-")) {
  console.warn(
    "[boot] BUILD_ID falling back to boot timestamp in production — " +
    "set REPLIT_DEPLOYMENT_ID/REPL_ID/BUILD_ID for stable PWA cache versioning"
  );
}

const NO_STORE_HEADERS = "no-cache, no-store, must-revalidate";

// Serve service-worker.js dynamically (BEFORE static middleware so we win).
// Injects BUILD_ID and forces no-store so browsers always pick up new SW code.
app.get(["/service-worker.js", "/serviceWorker.js"], async (_req, res, next) => {
  try {
    const fs = await import("node:fs/promises");
    const swCandidates = [
      path.join(CLIENT_ROOT, "public", "service-worker.js"), // dev (source)
      path.join(CLIENT_DIST, "service-worker.js"),           // prod (built)
    ];
    let body = null;
    for (const candidate of swCandidates) {
      try {
        body = await fs.readFile(candidate, "utf8");
        break;
      } catch (_) { /* try next */ }
    }
    if (!body) return next();
    const hydrated = body.replace(/__BUILD_ID__/g, BUILD_ID);
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", NO_STORE_HEADERS);
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("X-MMHB-Build-Id", BUILD_ID);
    return res.send(hydrated);
  } catch (err) {
    return next(err);
  }
});

// Cache-Control policy for SPA static files:
//   • index.html       -> no-cache (always check for new build)
//   • Vite-hashed asset -> immutable, 1 year (filename includes content hash)
//   • everything else  -> default (express handles)
const spaCacheHeaders = (res, filePath) => {
  if (filePath.endsWith(`${path.sep}index.html`) || filePath.endsWith("/index.html")) {
    res.setHeader("Cache-Control", NO_STORE_HEADERS);
    return;
  }
  // Vite hashes look like /assets/Foo-AbCdEfGh.js (>=6 hash chars)
  if (/[\\/]assets[\\/].+[-.][A-Za-z0-9_-]{6,}\.(js|css|png|jpg|jpeg|webp|svg|woff2?|ttf|ico)$/.test(filePath)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
};

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
  app.use(express.static(CLIENT_DIST, { index: "index.html", setHeaders: spaCacheHeaders }));
}
app.use(express.static(PUBLIC_DIR, { index: false, setHeaders: spaCacheHeaders }));

// ----------------------------
// ROUTES
// ----------------------------

// Health check (must work first)
app.use("/api/health", healthRoutes);
app.use("/api/streaks", optionalAuth, streaksRoutes);
app.use("/api/telemetry", telemetryRoutes);

// Healing engine (gated by age verification; admin sub-routes self-gate)
app.use("/api/ai/healing", requireAdult, aiHealingRoutes);

// v2.0 Prompt 3.2 — Awareness detection pipeline (per-route auth inside)
const { default: awarenessRoutes } = await import("./routes/awareness.mjs");
app.use("/api/awareness", awarenessRoutes);

// v2.0 Prompt 3.3 — Protocol execution engine (per-route auth inside).
// Registry is seeded after ensureSchema() runs (later in this file) so the
// table is guaranteed to exist before the seeder tries to read from it.
const { default: protocolsRoutes } = await import("./routes/protocols.mjs");
app.use("/api/protocols", protocolsRoutes);

// v2.0 Prompt 3.4 — Biometric Ingestion Pipeline (per-route auth inside).
const { default: biometricsRoutes } = await import("./routes/biometrics.mjs");
app.use("/api/biometrics", biometricsRoutes);
const { default: discernmentRoutes } = await import("./routes/discernment.mjs");
app.use("/api/discernment", discernmentRoutes);

// Business engine (staff/admin only; admin sub-routes self-gate)
app.use("/api/ai/business", aiBusinessRoutes);

// Auth routes (mount before AI routes so /api/auth/* works)
app.use("/api/auth", authRoutes);

// GitHub OAuth: file is complete, GITHUB_CLIENT_ID/_SECRET are configured.
// Was previously orphaned (built but never mounted) → frontend's GitHub login
// button silently 404'd. Mounted at /api/auth so /api/auth/github and
// /api/auth/github/callback resolve correctly without colliding with the
// /register, /login, /me routes already on authRoutes.
try {
  const { default: githubAuthRoutes } = await import("./routes/github-auth.mjs");
  app.use("/api/auth", githubAuthRoutes);
  console.log("[boot] github oauth routes mounted at /api/auth/github");
} catch (err) {
  console.warn("[boot] github oauth routes skipped:", err?.message || err);
}

// Replit-integrations auth (registers GET /api/auth/user — consumed by
// client/src/context/AuthContext.jsx::fetchReplitUser to hydrate user/role
// on page load. Without this, AuthContext gets a 404 and falls back to
// localStorage-only state, which broke session persistence and admin
// role-based routing on cold reloads.)
registerAuthRoutes(app);

// Admin login token verification — must be PUBLIC (chicken-and-egg: you can't
// require admin auth on the very endpoint that grants it). Mounted BEFORE the
// protected /api/admin chain so Express resolves it first. Rate-limited only.
app.post("/api/admin/verify-token", adminLoginLimiter, (req, res, next) => {
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
  { mount: "/api/admin/sop",                 file: "./routes/sop.mjs" },
  { mount: "/api/admin/consciousness",       file: "./routes/consciousness.mjs" },
  // Week 2 Foundation Sprint — OTel + PagerDuty diagnostic surface.
  // Read-only status endpoints + a synthetic test-alert POST. Admin-gated by
  // the parent app.mjs mount (adminLimiter + requireAuth + requireAdmin).
  { mount: "/api/admin/observability",       file: "./routes/observability.mjs" },
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
  // Note: /api/dashboard uses auth:"optional" at the mount but ui-dashboard.mjs
  // applies router.use(requireAuth) internally — net effect is strict auth (401
  // when unauthenticated). Do NOT change to auth:"required" without first
  // removing the inner requireAuth, or you'll double-run the middleware.
  { mount: "/api/dashboard",     file: "./routes/ui-dashboard.mjs",  auth: "optional" },
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

  // ─── Round 3 (Apr-26 gap-fix): orphan routers the frontend depends on ───
  // These files existed in server/routes/ but were never mounted, causing
  // 100+ silent 404s in the client. Each was dry-run-imported successfully
  // before being added here. The try/catch loop below means any single
  // mount failure is logged and skipped — boot is never crashed.
  // The 4 conflict-suspect orphans (login, mfa, accountActions, system)
  // are deliberately NOT in this list — they need separate review.
  { mount: "/api/ai-dashboard",              file: "./routes/ai-dashboard.mjs",              auth: "required" },
  { mount: "/api/analytics-events",          file: "./routes/analytics-events.mjs",          auth: "optional" },
  // SECURITY (Apr-26 Round 3 architect review): canva-oauth /verify-token decodes Canva JWTs
  // without verifying signatures — forged tokens could be accepted as valid. Intentionally
  // NOT mounted until a proper JWKS-based verifier is added. Tracked in SOP as a static check.
  // { mount: "/api/canva-oauth",               file: "./routes/canva-oauth.mjs",               auth: "optional" },
  { mount: "/api/cognitive-enhancement",     file: "./routes/cognitive-enhancement.mjs",     auth: "optional" },
  { mount: "/api/cognitive-lab",             file: "./routes/cognitive-lab.mjs",             auth: "optional" },
  { mount: "/api/cognitive-mastery",         file: "./routes/cognitive-mastery.mjs",         auth: "optional" },
  { mount: "/api/collective-intelligence",   file: "./routes/collective-intelligence.mjs",   auth: "optional" },
  { mount: "/api/contemplative",             file: "./routes/contemplative.mjs",             auth: "optional" },
  { mount: "/api/content-generator",         file: "./routes/content-generator.mjs",         auth: "optional" },
  { mount: "/api/content-intelligence",      file: "./routes/content-intelligence.mjs",      auth: "optional" },
  { mount: "/api/creativity",                file: "./routes/creativity.mjs",                auth: "optional" },
  { mount: "/api/deep-learning",             file: "./routes/deep-learning.mjs",             auth: "optional" },
  { mount: "/api/deployment-readiness",      file: "./routes/deploymentReadiness.mjs",       auth: "admin" },
  { mount: "/api/dialectics",                file: "./routes/dialectics.mjs",                auth: "optional" },
  { mount: "/api/embodiment",                file: "./routes/embodiment.mjs",                auth: "optional" },
  { mount: "/api/emotional-mastery",         file: "./routes/emotional-mastery.mjs",         auth: "optional" },
  { mount: "/api/emotional-resilience",      file: "./routes/emotional-resilience.mjs",      auth: "optional" },
  { mount: "/api/ethical-reasoning",         file: "./routes/ethical-reasoning.mjs",         auth: "optional" },
  { mount: "/api/existential",               file: "./routes/existential.mjs",               auth: "optional" },
  { mount: "/api/feed",                      file: "./routes/feed.mjs",                      auth: "optional" },
  { mount: "/api/figma",                     file: "./routes/figma.mjs",                     auth: "admin" },
  { mount: "/api/foresight",                 file: "./routes/foresight.mjs",                 auth: "optional" },
  { mount: "/api/healing-intelligence",      file: "./routes/healing-intelligence.mjs",      auth: "optional" },
  { mount: "/api/healing-modalities",        file: "./routes/healing-modalities.mjs",        auth: "optional" },
  { mount: "/api/holistic-healing",          file: "./routes/holistic-healing.mjs",          auth: "optional" },
  { mount: "/api/human-potential",           file: "./routes/human-potential.mjs",           auth: "optional" },
  { mount: "/api/invites",                   file: "./routes/invites.mjs",                   auth: "required" },
  { mount: "/api/kernel",                    file: "./routes/kernel.mjs",                    auth: "admin" },
  { mount: "/api/life-design",               file: "./routes/life-design.mjs",               auth: "optional" },
  { mount: "/api/life-purpose",              file: "./routes/life-purpose.mjs",              auth: "optional" },
  { mount: "/api/mastery-excellence",        file: "./routes/mastery-excellence.mjs",        auth: "optional" },
  { mount: "/api/meaning",                   file: "./routes/meaning.mjs",                   auth: "optional" },
  { mount: "/api/metacognition",             file: "./routes/metacognition.mjs",             auth: "optional" },
  { mount: "/api/mirror",                    file: "./routes/mirror.mjs",                    auth: "optional" },
  { mount: "/api/narrative",                 file: "./routes/narrative.mjs",                 auth: "optional" },
  { mount: "/api/narrative-drafts",          file: "./routes/narrative-drafts.mjs",          auth: "required" },
  { mount: "/api/neuro-integration",         file: "./routes/neuro-integration.mjs",         auth: "optional" },
  { mount: "/api/peak-performance",          file: "./routes/peak-performance.mjs",          auth: "optional" },
  // SECURITY (Apr-26 Round 3 architect review): perplexity proxies a paid external API.
  // Public access is an abuse/cost vector even with rate limits. Gate to authenticated users only.
  { mount: "/api/perplexity",                file: "./routes/perplexity.mjs",                auth: "required" },
  { mount: "/api/personal-growth",           file: "./routes/personal-growth.mjs",           auth: "optional" },
  { mount: "/api/philosophy",                file: "./routes/philosophy.mjs",                auth: "optional" },
  { mount: "/api/post-trauma",               file: "./routes/post-trauma.mjs",               auth: "optional" },
  { mount: "/api/praxis",                    file: "./routes/praxis.mjs",                    auth: "optional" },
  { mount: "/api/products",                  file: "./routes/products.mjs",                  auth: "optional" },
  { mount: "/api/psychological-safety",      file: "./routes/psychological-safety.mjs",      auth: "optional" },
  { mount: "/api/purpose-compass",           file: "./routes/purpose-compass.mjs",           auth: "optional" },
  { mount: "/api/relational",                file: "./routes/relational.mjs",                auth: "optional" },
  { mount: "/api/relationship-dynamics",     file: "./routes/relationship-dynamics.mjs",     auth: "optional" },
  { mount: "/api/resilience",                file: "./routes/resilience.mjs",                auth: "optional" },
  { mount: "/api/self-mastery",              file: "./routes/self-mastery.mjs",              auth: "optional" },
  { mount: "/api/self-mastery-intelligence", file: "./routes/self-mastery-intelligence.mjs", auth: "optional" },
  { mount: "/api/social-intelligence",       file: "./routes/social-intelligence.mjs",       auth: "optional" },
  { mount: "/api/socio-ecology",             file: "./routes/socio-ecology.mjs",             auth: "optional" },
  { mount: "/api/spiritual-intelligence",    file: "./routes/spiritual-intelligence.mjs",    auth: "optional" },
  { mount: "/api/systems-compassion",        file: "./routes/systems-compassion.mjs",        auth: "optional" },
  { mount: "/api/universal-content",         file: "./routes/universal-content.mjs",         auth: "optional" },
  { mount: "/api/user-settings",             file: "./routes/userSettings.mjs",              auth: "required" },
  { mount: "/api/values",                    file: "./routes/values.mjs",                    auth: "optional" },
  { mount: "/api/webhook",                   file: "./routes/webhook.mjs" },
  { mount: "/api/wellness-tools",            file: "./routes/wellness-tools.mjs",            auth: "optional" },
  { mount: "/api/wisdom-engine",             file: "./routes/wisdom-engine.mjs",             auth: "optional" },
  { mount: "/api/wisdom-synthesis",          file: "./routes/wisdom-synthesis.mjs",          auth: "optional" },
  { mount: "/api/wisdom-traditions",         file: "./routes/wisdom-traditions.mjs",         auth: "optional" },

  // ─── Round 4.4 (Apr-27): final orphan-router mount pass ───────────────────
  // These four routers existed in server/routes/ with valid GET handlers but
  // were never wired in EXTENDED_ROUTES, so the SOP monitor flagged them as
  // 404. Each was dry-run-imported and probed before adding here. None overlap
  // with any locked AI/admin contract above.
  { mount: "/api/consciousness",     file: "./routes/consciousness-expansion.mjs",   auth: "optional" },
  { mount: "/api/mind-body",         file: "./routes/mind-body-integration.mjs",     auth: "optional" },
  { mount: "/api/transformation",    file: "./routes/transformation-engine.mjs",     auth: "optional" },
  { mount: "/api/trauma-healing",    file: "./routes/trauma-healing-protocols.mjs",  auth: "optional" },
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
      return res
        .status(200)
        .set({ "Content-Type": "text/html", "Cache-Control": NO_STORE_HEADERS })
        .end(html);
    } catch (e) {
      viteDevServer.ssrFixStacktrace(e);
      return next(e);
    }
  }
  res.setHeader("Cache-Control", NO_STORE_HEADERS);
  return res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

// ===== OBSERVABILITY: error handler (must be last middleware) =====
// Stamps the active OTel span as ERROR, fires a fire-and-forget PagerDuty
// alert for http-500 class, and returns the canonical 500 response.
{
  const { errorHandler } = await import("./middleware/errorHandler.mjs");
  app.use(errorHandler);
}

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;

try {
  const { ensureSchema } = await import("./db/ensureSchema.mjs");
  await ensureSchema();
} catch (err) {
  console.warn("[boot] ensureSchema skipped:", err?.message || err);
  // Schema/boot failure is critical — the app may run degraded. Fire-and-
  // forget so we never block server startup on the alerter network call.
  import("./observability/safetyAlerts.mjs")
    .then(({ alertSchemaFailure }) => alertSchemaFailure({ stage: "ensureSchema", error: err }))
    .catch(() => {});
}

// v2.0 Prompt 3.2 gap closure — seed awareness_rules from the in-code
// library and refresh the pipeline's RuleMatcher to honor active flags
// from the DB. Best-effort; pipeline falls back to in-code rules on failure.
try {
  const { seedAwarenessRules } = await import("./awareness/seedRules.mjs");
  const seedRes = await seedAwarenessRules();
  if (seedRes.upserted > 0) {
    console.log(`[boot] seeded ${seedRes.upserted}/${seedRes.total} awareness rules`);
  }
  const { getPipeline } = await import("./awareness/detection/pipeline.mjs");
  const refresh = await getPipeline().ruleMatcher.refreshFromDb();
  console.log(`[boot] awareness ruleMatcher refreshed: ${refresh.count} rules from ${refresh.source}`);
} catch (err) {
  console.warn("[boot] awareness rules seed/refresh skipped:", err?.message || err);
}

// v2.0 Prompt 3.3 — seed the protocol registry once tables exist.
try {
  const { seedProtocolsIfEmpty } = await import("./protocols/seed/protocols.mjs");
  const { db: _db, schema: _schema } = await import("./db.mjs");
  const seedResult = await seedProtocolsIfEmpty(_db, _schema);
  if (seedResult.seeded > 0) {
    console.log(`[boot] seeded ${seedResult.seeded} protocols into protocol_registry`);
  }
} catch (err) {
  console.warn("[boot] protocol seeding skipped:", err?.message || err);
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

  // v2.0 Prompt 3.4 — Opt-in 6-hour biometric polling. Off unless
  // BIOMETRICS_SCHEDULER_ENABLED=true. Skips HealthKit + manual sources.
  import("./biometrics/scheduler.mjs")
    .then(({ startBiometricScheduler }) => startBiometricScheduler({}))
    .catch((err) => {
      console.warn("[biometrics-scheduler] failed to load:", err?.message || err);
    });
});
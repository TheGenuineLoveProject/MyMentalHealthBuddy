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

// ===== FAST-PATH HEALTH CHECK =====
// Mounted BEFORE any heavy middleware (CORS, helmet, body parser, session,
// rate-limit, DB) so the deployment platform's port-open / liveness probe
// receives a 200 within microseconds even if the rest of the boot chain is
// still warming up. Belt-and-suspenders for cold-start health-check timeouts
// on Autoscale; no-op overhead on Reserved VM. Do NOT add logic here — it
// must stay synchronous and dependency-free to keep its purpose intact.
app.get("/healthz", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).type("text/plain").send("ok");
});
app.head("/healthz", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).end();
});

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
  { mount: "/api/admin/social/enterprise",   load: () => import("./routes/social-enterprise.mjs") },
  { mount: "/api/admin/social",              load: () => import("./routes/admin-social-studio.mjs") },
  { mount: "/api/admin/security",            load: () => import("./routes/admin-security.mjs") },
  { mount: "/api/admin/audit-logs",          load: () => import("./routes/audit-logs.mjs") },
  { mount: "/api/admin/soft-launch-metrics", load: () => import("./routes/soft-launch-metrics.mjs") },
  { mount: "/api/admin/sop",                 load: () => import("./routes/sop.mjs") },
  { mount: "/api/admin/consciousness",       load: () => import("./routes/consciousness.mjs") },
  // Week 2 Foundation Sprint — OTel + PagerDuty diagnostic surface.
  // Read-only status endpoints + a synthetic test-alert POST. Admin-gated by
  // the parent app.mjs mount (adminLimiter + requireAuth + requireAdmin).
  { mount: "/api/admin/observability",       load: () => import("./routes/observability.mjs") },
];

const mountedAdminSub = [];
const failedAdminSub = [];
for (const r of ADMIN_SUB_ROUTERS) {
  try {
    const mod = await r.load();
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
  { mount: "/api/blog",          load: () => import("./routes/blog.mjs") },
  { mount: "/api/newsletter",    load: () => import("./routes/newsletter.mjs") },
  { mount: "/api/leads",         load: () => import("./routes/leads.mjs") },
  { mount: "/api/contact",       load: () => import("./routes/contact.mjs") },
  { mount: "/api/feedback",      load: () => import("./routes/feedback.mjs") },
  // User profile / account
  { mount: "/api/user",          load: () => import("./routes/user.mjs"),          auth: "optional" },
  { mount: "/api/account",       load: () => import("./routes/account.mjs"),       auth: "optional" },
  // Core wellness features (adult-gated)
  { mount: "/api/journal",       load: () => import("./routes/journal.mjs"),       auth: "adult" },
  { mount: "/api/mood",          load: () => import("./routes/mood.mjs"),          auth: "optional" },
  { mount: "/api/gratitude",     load: () => import("./routes/gratitude.mjs"),     auth: "optional" },
  { mount: "/api/favorites",     load: () => import("./routes/favorites.mjs"),     auth: "optional" },
  { mount: "/api/progress",      load: () => import("./routes/progress.mjs"),      auth: "optional" },
  // Engagement
  { mount: "/api/gamification",  load: () => import("./routes/gamification.mjs"),  auth: "optional" },
  { mount: "/api/badges",        load: () => import("./routes/badges.mjs"),        auth: "optional" },
  { mount: "/api/onboarding",    load: () => import("./routes/onboarding.mjs"),    auth: "optional" },
  { mount: "/api/insights",      load: () => import("./routes/insights.mjs"),      auth: "optional" },
  // Billing
  { mount: "/api/billing",       load: () => import("./routes/billing.mjs"),       auth: "optional" },
  { mount: "/api/revenue",       load: () => import("./routes/revenue.mjs"),       auth: "required" },
  { mount: "/api/pro-features",  load: () => import("./routes/pro-features.mjs"),  auth: "optional" },
  // Social
  { mount: "/api/social/posts",  load: () => import("./routes/social-posts.mjs") },
  { mount: "/api/uploads",       load: () => import("./routes/object-storage.mjs"),auth: "required" },
  // Telemetry / analytics (already have telemetry mounted; these are extra)
  { mount: "/api/metrics",       load: () => import("./routes/metrics.mjs") },
  { mount: "/api/analytics",     load: () => import("./routes/analytics.mjs") },
  // ─── Round 2 (extended-routes): user-facing wellness + content surfaces ───
  // Note: /api/dashboard uses auth:"optional" at the mount but ui-dashboard.mjs
  // applies router.use(requireAuth) internally — net effect is strict auth (401
  // when unauthenticated). Do NOT change to auth:"required" without first
  // removing the inner requireAuth, or you'll double-run the middleware.
  { mount: "/api/dashboard",     load: () => import("./routes/ui-dashboard.mjs"),  auth: "optional" },
  { mount: "/api/community",     load: () => import("./routes/community.mjs"),     auth: "optional" },
  { mount: "/api/email",         load: () => import("./routes/email.mjs") },
  { mount: "/api/practices",     load: () => import("./routes/practices.mjs") },
  { mount: "/api/wisdom",        load: () => import("./routes/wisdom.mjs") },
  { mount: "/api/knowledge",     load: () => import("./routes/knowledge.mjs") },
  { mount: "/api/content",       load: () => import("./routes/content.mjs") },
  { mount: "/api/content-studio",load: () => import("./routes/content-studio.mjs"),auth: "optional" },
  { mount: "/api/social-posting",load: () => import("./routes/social-posting.mjs"),auth: "optional" },
  { mount: "/api/therapy",       load: () => import("./routes/therapy.mjs"),       auth: "adult" },
  { mount: "/api/reflection",    load: () => import("./routes/reflection.mjs"),    auth: "adult" },
  { mount: "/api/states",        load: () => import("./routes/states.mjs") },
  { mount: "/api/prompts",       load: () => import("./routes/prompts.mjs"),       auth: "optional" },
  // Forever-companion metacognition mirror — read-only aggregator
  { mount: "/api/growth",        load: () => import("./routes/growth-journey.mjs"),auth: "optional" },
  // Peace Scape — Layer 2 foundation (read-only sanctuary state)
  { mount: "/api/peacescape",    load: () => import("./routes/peacescape.mjs"),    auth: "optional" },

  // ─── Round 3 (Apr-26 gap-fix): orphan routers the frontend depends on ───
  // These files existed in server/routes/ but were never mounted, causing
  // 100+ silent 404s in the client. Each was dry-run-imported successfully
  // before being added here. The try/catch loop below means any single
  // mount failure is logged and skipped — boot is never crashed.
  // The 4 conflict-suspect orphans (login, mfa, accountActions, system)
  // are deliberately NOT in this list — they need separate review.
  { mount: "/api/ai-dashboard",              load: () => import("./routes/ai-dashboard.mjs"),              auth: "required" },
  { mount: "/api/analytics-events",          load: () => import("./routes/analytics-events.mjs"),          auth: "optional" },
  // SECURITY (Apr-26 Round 3 architect review): canva-oauth /verify-token decodes Canva JWTs
  // without verifying signatures — forged tokens could be accepted as valid. Intentionally
  // NOT mounted until a proper JWKS-based verifier is added. Tracked in SOP as a static check.
  // { mount: "/api/canva-oauth",               load: () => import("./routes/canva-oauth.mjs"),               auth: "optional" },
  { mount: "/api/cognitive-enhancement",     load: () => import("./routes/cognitive-enhancement.mjs"),     auth: "optional" },
  { mount: "/api/cognitive-lab",             load: () => import("./routes/cognitive-lab.mjs"),             auth: "optional" },
  { mount: "/api/cognitive-mastery",         load: () => import("./routes/cognitive-mastery.mjs"),         auth: "optional" },
  { mount: "/api/collective-intelligence",   load: () => import("./routes/collective-intelligence.mjs"),   auth: "optional" },
  { mount: "/api/contemplative",             load: () => import("./routes/contemplative.mjs"),             auth: "optional" },
  { mount: "/api/content-generator",         load: () => import("./routes/content-generator.mjs"),         auth: "optional" },
  { mount: "/api/content-intelligence",      load: () => import("./routes/content-intelligence.mjs"),      auth: "optional" },
  { mount: "/api/creativity",                load: () => import("./routes/creativity.mjs"),                auth: "optional" },
  { mount: "/api/deep-learning",             load: () => import("./routes/deep-learning.mjs"),             auth: "optional" },
  { mount: "/api/deployment-readiness",      load: () => import("./routes/deploymentReadiness.mjs"),       auth: "admin" },
  { mount: "/api/dialectics",                load: () => import("./routes/dialectics.mjs"),                auth: "optional" },
  { mount: "/api/embodiment",                load: () => import("./routes/embodiment.mjs"),                auth: "optional" },
  { mount: "/api/emotional-mastery",         load: () => import("./routes/emotional-mastery.mjs"),         auth: "optional" },
  { mount: "/api/emotional-resilience",      load: () => import("./routes/emotional-resilience.mjs"),      auth: "optional" },
  { mount: "/api/ethical-reasoning",         load: () => import("./routes/ethical-reasoning.mjs"),         auth: "optional" },
  { mount: "/api/existential",               load: () => import("./routes/existential.mjs"),               auth: "optional" },
  { mount: "/api/feed",                      load: () => import("./routes/feed.mjs"),                      auth: "optional" },
  { mount: "/api/figma",                     load: () => import("./routes/figma.mjs"),                     auth: "admin" },
  { mount: "/api/foresight",                 load: () => import("./routes/foresight.mjs"),                 auth: "optional" },
  { mount: "/api/healing-intelligence",      load: () => import("./routes/healing-intelligence.mjs"),      auth: "optional" },
  { mount: "/api/healing-modalities",        load: () => import("./routes/healing-modalities.mjs"),        auth: "optional" },
  { mount: "/api/holistic-healing",          load: () => import("./routes/holistic-healing.mjs"),          auth: "optional" },
  { mount: "/api/human-potential",           load: () => import("./routes/human-potential.mjs"),           auth: "optional" },
  { mount: "/api/invites",                   load: () => import("./routes/invites.mjs"),                   auth: "required" },
  { mount: "/api/kernel",                    load: () => import("./routes/kernel.mjs"),                    auth: "admin" },
  { mount: "/api/life-design",               load: () => import("./routes/life-design.mjs"),               auth: "optional" },
  { mount: "/api/life-purpose",              load: () => import("./routes/life-purpose.mjs"),              auth: "optional" },
  { mount: "/api/mastery-excellence",        load: () => import("./routes/mastery-excellence.mjs"),        auth: "optional" },
  { mount: "/api/meaning",                   load: () => import("./routes/meaning.mjs"),                   auth: "optional" },
  { mount: "/api/metacognition",             load: () => import("./routes/metacognition.mjs"),             auth: "optional" },
  { mount: "/api/mirror",                    load: () => import("./routes/mirror.mjs"),                    auth: "optional" },
  { mount: "/api/narrative",                 load: () => import("./routes/narrative.mjs"),                 auth: "optional" },
  { mount: "/api/narrative-drafts",          load: () => import("./routes/narrative-drafts.mjs"),          auth: "required" },
  { mount: "/api/neuro-integration",         load: () => import("./routes/neuro-integration.mjs"),         auth: "optional" },
  { mount: "/api/peak-performance",          load: () => import("./routes/peak-performance.mjs"),          auth: "optional" },
  // SECURITY (Apr-26 Round 3 architect review): perplexity proxies a paid external API.
  // Public access is an abuse/cost vector even with rate limits. Gate to authenticated users only.
  { mount: "/api/perplexity",                load: () => import("./routes/perplexity.mjs"),                auth: "required" },
  { mount: "/api/personal-growth",           load: () => import("./routes/personal-growth.mjs"),           auth: "optional" },
  { mount: "/api/philosophy",                load: () => import("./routes/philosophy.mjs"),                auth: "optional" },
  { mount: "/api/post-trauma",               load: () => import("./routes/post-trauma.mjs"),               auth: "optional" },
  { mount: "/api/praxis",                    load: () => import("./routes/praxis.mjs"),                    auth: "optional" },
  { mount: "/api/products",                  load: () => import("./routes/products.mjs"),                  auth: "optional" },
  { mount: "/api/psychological-safety",      load: () => import("./routes/psychological-safety.mjs"),      auth: "optional" },
  { mount: "/api/purpose-compass",           load: () => import("./routes/purpose-compass.mjs"),           auth: "optional" },
  { mount: "/api/relational",                load: () => import("./routes/relational.mjs"),                auth: "optional" },
  { mount: "/api/relationship-dynamics",     load: () => import("./routes/relationship-dynamics.mjs"),     auth: "optional" },
  { mount: "/api/resilience",                load: () => import("./routes/resilience.mjs"),                auth: "optional" },
  { mount: "/api/self-mastery",              load: () => import("./routes/self-mastery.mjs"),              auth: "optional" },
  { mount: "/api/self-mastery-intelligence", load: () => import("./routes/self-mastery-intelligence.mjs"), auth: "optional" },
  { mount: "/api/social-intelligence",       load: () => import("./routes/social-intelligence.mjs"),       auth: "optional" },
  { mount: "/api/socio-ecology",             load: () => import("./routes/socio-ecology.mjs"),             auth: "optional" },
  { mount: "/api/spiritual-intelligence",    load: () => import("./routes/spiritual-intelligence.mjs"),    auth: "optional" },
  { mount: "/api/systems-compassion",        load: () => import("./routes/systems-compassion.mjs"),        auth: "optional" },
  { mount: "/api/universal-content",         load: () => import("./routes/universal-content.mjs"),         auth: "optional" },
  { mount: "/api/user-settings",             load: () => import("./routes/userSettings.mjs"),              auth: "required" },
  { mount: "/api/values",                    load: () => import("./routes/values.mjs"),                    auth: "optional" },
  { mount: "/api/webhook",                   load: () => import("./routes/webhook.mjs") },
  { mount: "/api/wellness-tools",            load: () => import("./routes/wellness-tools.mjs"),            auth: "optional" },
  { mount: "/api/wisdom-engine",             load: () => import("./routes/wisdom-engine.mjs"),             auth: "optional" },
  { mount: "/api/wisdom-synthesis",          load: () => import("./routes/wisdom-synthesis.mjs"),          auth: "optional" },
  { mount: "/api/wisdom-traditions",         load: () => import("./routes/wisdom-traditions.mjs"),         auth: "optional" },

  // ─── Round 4.4 (Apr-27): final orphan-router mount pass ───────────────────
  // These four routers existed in server/routes/ with valid GET handlers but
  // were never wired in EXTENDED_ROUTES, so the SOP monitor flagged them as
  // 404. Each was dry-run-imported and probed before adding here. None overlap
  // with any locked AI/admin contract above.
  { mount: "/api/consciousness",     load: () => import("./routes/consciousness-expansion.mjs"),   auth: "optional" },
  { mount: "/api/mind-body",         load: () => import("./routes/mind-body-integration.mjs"),     auth: "optional" },
  { mount: "/api/transformation",    load: () => import("./routes/transformation-engine.mjs"),     auth: "optional" },
  { mount: "/api/trauma-healing",    load: () => import("./routes/trauma-healing-protocols.mjs"),  auth: "optional" },
];

const mountedExtended = [];
const failedExtended = [];
for (const r of EXTENDED_ROUTES) {
  try {
    const mod = await r.load();
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

// Race a promise against a timeout so a hung DB call (e.g. unreachable
// production Neon) can never block server startup. Returns the resolved
// value on success, or throws "boot-timeout" after `ms` milliseconds.
function withBootTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label}: boot-timeout after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Background boot sequence — runs AFTER app.listen() so a slow or hung
// Neon connection can never prevent the platform health-check from
// passing. Each step is independently best-effort with a 10s ceiling;
// failures are logged but never crash or stall startup.
async function runDeferredBoot() {
  // ensureSchema — bootstraps tables that aren't covered by drizzle push.
  try {
    const { ensureSchema } = await import("./db/ensureSchema.mjs");
    await withBootTimeout(ensureSchema(), 10000, "ensureSchema");
  } catch (err) {
    console.warn("[boot] ensureSchema skipped:", err?.message || err);
    import("./observability/safetyAlerts.mjs")
      .then(({ alertSchemaFailure }) => alertSchemaFailure({ stage: "ensureSchema", error: err }))
      .catch(() => {});
  }

  // v2.0 Prompt 3.2 — seed awareness_rules and refresh the in-memory matcher.
  try {
    const { seedAwarenessRules } = await import("./awareness/seedRules.mjs");
    const seedRes = await withBootTimeout(seedAwarenessRules(), 10000, "seedAwarenessRules");
    if (seedRes.upserted > 0) {
      console.log(`[boot] seeded ${seedRes.upserted}/${seedRes.total} awareness rules`);
    }
    const { getPipeline } = await import("./awareness/detection/pipeline.mjs");
    const refresh = await withBootTimeout(getPipeline().ruleMatcher.refreshFromDb(), 10000, "ruleMatcher.refreshFromDb");
    console.log(`[boot] awareness ruleMatcher refreshed: ${refresh.count} rules from ${refresh.source}`);
  } catch (err) {
    console.warn("[boot] awareness rules seed/refresh skipped:", err?.message || err);
  }

  // v2.0 Prompt 3.3 — seed the protocol registry once tables exist.
  try {
    const { seedProtocolsIfEmpty } = await import("./protocols/seed/protocols.mjs");
    const { db: _db, schema: _schema } = await import("./db.mjs");
    const seedResult = await withBootTimeout(seedProtocolsIfEmpty(_db, _schema), 10000, "seedProtocolsIfEmpty");
    if (seedResult.seeded > 0) {
      console.log(`[boot] seeded ${seedResult.seeded} protocols into protocol_registry`);
    }
  } catch (err) {
    console.warn("[boot] protocol seeding skipped:", err?.message || err);
  }
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Kick deferred boot AFTER listen so the platform sees an open port
  // immediately. /healthz is already mounted before all middleware so
  // the health-check passes even while DB seeding is in flight.
  runDeferredBoot().catch((err) => {
    console.warn("[boot] deferred boot encountered an error:", err?.message || err);
  });

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
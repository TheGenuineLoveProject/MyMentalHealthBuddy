import adminPublishingRoutes from "./routes/admin-publishing.mjs";
import adminSecurityRoutes from "./routes/admin-security.mjs";
import authRoutes from "./routes/auth.mjs";
import { registerAuthRoutes } from "./replit_integrations/auth/index.mjs";
import billingRoutes from "./routes/billing.mjs";
import webhookRoutes from "./routes/webhook.mjs";
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT ERROR:', err);
  // Fire-and-forget PagerDuty alert. Dynamic import avoids circular boot
  // ordering and keeps the handler safe even if the alerter fails to load.
  import('./observability/safetyAlerts.mjs')
    .then(({ alertUncaught }) => alertUncaught({ kind: 'uncaughtException', error: err }))
    .catch(() => { });
  // Observability O3: after alert dispatch, force exit so the Replit supervisor
  // can restart cleanly rather than leaving Node in a corrupted state. Timer is
  // .unref()'d so it never holds the loop open on its own.
  setTimeout(() => {
    process.exit(1);
  }, 1000).unref();
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE:', err);
  import('./observability/safetyAlerts.mjs')
    .then(({ alertUncaught }) => alertUncaught({ kind: 'unhandledRejection', error: err }))
    .catch(() => { });
  // Observability O3: after alert dispatch, force exit so the Replit supervisor
  // can restart cleanly rather than leaving Node in a corrupted state. Timer is
  // .unref()'d so it never holds the loop open on its own.
  setTimeout(() => {
    process.exit(1);
  }, 1000).unref();
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
import userRoutes from "./routes/user.mjs";

// ✅ OPTIONAL AUTH (FIXES authMiddleware error)
import { optionalAuth, requireAuth, requireAdmin } from "./middleware/auth.mjs";
import { requireAdult } from "./middleware/requireAdult.mjs";
import adminRoutes from "./routes/admin.mjs";
import adminBillingRoutes from "./routes/adminBilling.mjs";
import sessionBoundaryRoutes from "./routes/session-boundary.mjs";
import { csrfProtection, issueCsrfToken } from "./security/csrf.mjs";
import db from "./db/client.mjs";
import { ensureSchema } from "./db/ensureSchema.mjs";

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
// ===== STRIPE WEBHOOK — MUST mount BEFORE express.json so the router's
// route-level express.raw() can read the raw byte stream for HMAC
// signature verification. Server-to-server only; no cookies/CSRF needed.
app.use("/api/webhooks", webhookRoutes);
app.use(express.json({
  // v2.0 Prompt 3.4 — capture raw bytes for HMAC-signed webhooks
  // (HealthKit). Other handlers continue using req.body unchanged.
  verify: (req, _res, buf) => { if (buf?.length) req.rawBody = buf; },
}));

// ===== SECURITY LAYER =====
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import cookieParser from "cookie-parser";
import gamificationRoutes from "./routes/gamification.mjs";
import analyticsEventsRoutes from "./routes/analytics-events.mjs";
import blogRoutes from "./routes/blog.mjs";
import reflectionRoutes from "./routes/reflection.mjs";
import communityRoutes from "./routes/community.mjs";
import progressRoutes from "./routes/progress.mjs";
import biometricsRoutes from "./routes/biometrics.mjs";
import protocolsRoutes from "./routes/protocols.mjs";
import statesRoutes from "./routes/states.mjs";
import badgesRoutes from "./routes/badges.mjs";
import invitesRoutes from "./routes/invites.mjs";
import leadsRoutes from "./routes/leads.mjs";
import contactRoutes from "./routes/contact.mjs";
import mirrorRoutes from "./routes/mirror.mjs";
import onboardingRoutes from "./routes/onboarding.mjs";
import contentRoutes from "./routes/content.mjs";
import moodRoutes from "./routes/mood.mjs";
import wellnessToolsRoutes from "./routes/wellness-tools.mjs";
import journalRoutes from "./routes/journal.mjs";
import accountRoutes from "./routes/account.mjs";
import gratitudeRoutes from "./routes/gratitude.mjs";
import discernmentRoutes from "./routes/discernment.mjs";
import favoritesRoutes from "./routes/favorites.mjs";
import narrativeDraftsRoutes from "./routes/narrative-drafts.mjs";
import canvaOauthRoutes from "./routes/canva-oauth.mjs";
import productsRoutes from "./routes/products.mjs";
import perplexityRoutes from "./routes/perplexity.mjs";
import insightsRoutes from "./routes/insights.mjs";
import emailRoutes from "./routes/email.mjs";
import peacescapeRoutes from "./routes/peacescape.mjs";
import metricsRoutes from "./routes/metrics.mjs";
import feedbackRoutes from "./routes/feedback.mjs";
import feedRoutes from "./routes/feed.mjs";
import wisdomRoutes from "./routes/wisdom.mjs";
import socialPostingRoutes from "./routes/social-posting.mjs";
import newsletterRoutes from "./routes/newsletter.mjs";
import meaningRoutes from "./routes/meaning.mjs";
import healingModalitiesRoutes from "./routes/healing-modalities.mjs";
import wisdomTraditionsRoutes from "./routes/wisdom-traditions.mjs";
import wisdomSynthesisRoutes from "./routes/wisdom-synthesis.mjs";
import valuesRoutes from "./routes/values.mjs";
import wisdomEngineRoutes from "./routes/wisdom-engine.mjs";
import healingIntelligenceRoutes from "./routes/healing-intelligence.mjs";
import cognitiveMasteryRoutes from "./routes/cognitive-mastery.mjs";
import objectStorageRoutes from "./routes/object-storage.mjs";
import userSettingsRoutes from "./routes/user-settings.mjs";
import dashboardRoutes from "./routes/dashboard.mjs";
import socialRoutes from "./routes/social.mjs";

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
  const { requestId, requestLogger } = await import("./middleware/requestId.mjs");
  const { observabilityContext } = await import("./middleware/observabilityContext.mjs");
  app.use(requestId);
  app.use(observabilityContext);
  app.use(requestLogger);
}

// ===== SESSION BOUNDARY FIRST (NO CSRF) =====
app.use('/api/session-boundary', sessionBoundaryRoutes);
app.use("/api/health", healthRoutes);

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

// ===== ROUTE MOUNTS (P1-B3.1 restoration cycle) =====
// Mounts 7 verified-safe route modules that were imported at file top
// but never registered with app.use. Each module has been audited for
// internal auth gating, CSRF compatibility (CSRF middleware is already
// global above), and mount-path uniqueness against the existing
// /api/session-boundary and /api/health mounts.
//
// DEFERRED (not mounted in this cycle, pending separate audit):
//   - adminSecurityRoutes  (mounted P2.1.1 with external requireAuth+requireAdmin wrap)
//   - aiBusinessRoutes     (mounted P2.2.1 — internally gated BUSINESS-domain sibling of aiHealingRoutes)
//   - buddyRoutes          (mounted P2.3.1 at /api prefix; canonical POST /api/buddy; anonymous-by-design BHCE flow)
//   - streaksRoutes        (mounted P2.4.2 at /api/streaks with optionalAuth wrap; PLATFORM-domain engagement counter; GET /me anon-safe, POST /checkin internal 401)
//
// Limiter scoping for admin:
//   adminLoginLimiter → ONLY /api/admin/verify-token (strict brute-force)
//   adminLimiter      → all other authenticated admin surfaces
app.use("/api/admin/verify-token", adminLoginLimiter);
app.use("/api/admin", adminLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai/healing", aiHealingRoutes);
app.use("/api/ai/business", aiBusinessRoutes);
app.use("/api/admin/billing", adminBillingRoutes);
app.use("/api/admin/publishing", adminPublishingRoutes);
app.use("/api/admin/security", requireAuth, requireAdmin, adminSecurityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/telemetry", telemetryRoutes);

// Buddy anonymous healing flow limiter
const buddyLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
});

app.use("/api/buddy", buddyLimiter);
app.use("/api", buddyRoutes);

// Streaks engagement counter — optionalAuth populates req.user for the
// router's hand-rolled identity read; POST /checkin self-gates with 401.
const streaksLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
});

app.use("/api/streaks", streaksLimiter, optionalAuth, streaksRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/user", userRoutes);
// Serve built React app in prod; in dev, attach Vite middleware for HMR/transform.
const CLIENT_ROOT = path.join(__dirname, "..", "client");

/* =========================================================
   FINAL VERIFIED SPA FALLBACK
========================================================= */

const CLIENT_DIST = path.join(process.cwd(), "client/dist");

console.log("[SPA] CLIENT_DIST =", CLIENT_DIST);

// ===== OBSERVABILITY O5: BARE HEALTH-PATH GUARD =====
// Prevents the SPA fallback below from returning 200 + index.html for the
// bare /health, /ready, /live, /metrics paths. Canonical endpoints are
// /healthz and /api/health/* — these guards return 404 + JSON pointing to
// the correct canonical path. Additive only; does not affect SPA routing
// for any other path, does not touch express.static, does not touch the
// canonical health endpoints.
// /health and /live remain 404 canonical-guards (point clients at /api/health/*).
// /ready and /metrics are exposed as bare 200 aliases per Phase 9A spec, while
// the canonical /api/health/ready and /api/health/metrics continue to serve
// their richer payloads unchanged.
const BARE_HEALTH_CANONICALS = {
  "/health": "/api/health",
  "/live": "/api/health/live",
};
for (const [barePath, canonical] of Object.entries(BARE_HEALTH_CANONICALS)) {
  app.get(barePath, (_req, res) => {
    res.status(404).json({ error: "Not Found", canonical });
  });
}



// PHASE152_BARE_HEALTH_ALIAS

  app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'MyMentalHealthBuddy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.get("/api/ready", (_req, res) => {
  res.status(200).json({
    status: "ready",
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString()
  });
});


app.get("/ready", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});

app.get("/readyz", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});

app.get("/metrics", (_req, res) => {
  const mem = process.memoryUsage();
  res.set("Cache-Control", "no-store");
  res.status(200).json({
    uptime: Math.floor(process.uptime()),
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
    node_version: process.version,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});
// Phase 87C: mounted previously orphaned API route modules.
app.use("/api/gamification", gamificationRoutes);
app.use("/api/analytics", analyticsEventsRoutes);
app.use("/api/blog", blogRoutes);
// Mount route modules the frontend already calls but that were never wired
// (verified live 404s: route file exists + exports a router, but no app.use).
app.use("/api/reflection", reflectionRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/biometrics", biometricsRoutes);
app.use("/api/protocols", protocolsRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/badges", badgesRoutes);
app.use("/api/invites", invitesRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/mirror", mirrorRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/content", contentRoutes);
// Batch 2: additional frontend-called routers (verified import-safe + auth-audited).
app.use("/api/mood", moodRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/wellness-tools", wellnessToolsRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/gratitude", gratitudeRoutes);
app.use("/api/discernment", discernmentRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/narrative-drafts", narrativeDraftsRoutes);
app.use("/api/canva-oauth", canvaOauthRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/perplexity", perplexityRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/peacescape", peacescapeRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/wisdom", wisdomRoutes);
app.use("/api/social-posting", socialPostingRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/meaning", meaningRoutes);
app.use("/api/healing-modalities", healingModalitiesRoutes);
app.use("/api/wisdom-traditions", wisdomTraditionsRoutes);
app.use("/api/wisdom-synthesis", wisdomSynthesisRoutes);
app.use("/api/values", valuesRoutes);
app.use("/api/wisdom-engine", wisdomEngineRoutes);
app.use("/api/healing-intelligence", healingIntelligenceRoutes);
app.use("/api/cognitive-mastery", cognitiveMasteryRoutes);
// Batch 3: previously file-less prefixes — object storage (existing module), plus new user-settings/dashboard/social backends.
app.use("/api/uploads", objectStorageRoutes);
app.use("/api/user-settings", userSettingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/social", socialRoutes);


app.use(express.static(CLIENT_DIST, {
  index: "index.html"
}));


app.get("*", (req, res, next) => {

  if (req.path.startsWith("/api/")) {
    return next();
  }

  if (req.path.startsWith("/assets/")) {
    return next();
  }

  const indexFile = path.join(CLIENT_DIST, "index.html");

  console.log("[SPA ROUTE]", req.path);
  console.log("[SPA INDEX]", indexFile);

  return res.sendFile(path.resolve(indexFile));
});

/* =========================================================
   FINAL CANONICAL SERVER BOOT
========================================================= */

const PORT = process.env.PORT || 5000;

// ===== PHASE 9A: CENTRALIZED ERROR HANDLER =====
// Mounted last so any throw from earlier middleware/routes funnels through
// the central logger (req.requestId-stamped) and returns a safe 500 JSON
// envelope without leaking stacks to the client. Existing route responses
// are preserved — this only catches unhandled throws.
{
  const { errorHandler } = await import("./middleware/errorHandler.mjs");
  app.use(errorHandler);
}

// ===== PHASE 9A: ROUTE REGISTRATION SUMMARY =====
// Counts top-level routers/middlewares registered on the app stack for the
// startup diagnostic line. Read-only inspection of express internals; safe
// fallback to 0 if the shape ever changes.
function countRegisteredRoutes() {
  try {
    const stack = app?._router?.stack || [];
    return {
      total: stack.length,
      routes: stack.filter((l) => l.route).length,
      routers: stack.filter((l) => l.name === "router").length,
    };
  } catch {
    return { total: 0, routes: 0, routers: 0 };
  }
}
function shutdown(signal) {
  console.log(`[SERVER] ${signal} received — shutting down`);
  shuttingDown = true;
  if (relistenTimer) clearTimeout(relistenTimer);

  server?.close(() => {
    console.log("[SERVER] shutdown complete");
    process.exit(0);
  });

  // Immediately drop keep-alive/idle sockets (the Replit proxy holds persistent
  // connections) so server.close() resolves at once and port 5000 is released
  // without waiting for the force timeout. This is what prevents the recurring
  // EADDRINUSE when the next process starts during a restart/redeploy.
  server?.closeAllConnections?.();

  setTimeout(() => {
    console.error("[SERVER] forced shutdown");
    process.exit(1);
  }, 5000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
const SERVER_START_ISO = new Date().toISOString();

// Restart handoff is a race: the Replit supervisor spawns this new process and
// signals the previous one almost simultaneously, so for a brief window the old
// instance is still releasing port 5000. Rather than crash the workflow on that
// transient EADDRINUSE, retry the bind a bounded number of times. The previous
// instance releases the port immediately on shutdown (closeAllConnections), so
// a retry typically succeeds within a few hundred ms. If the port is held by a
// truly stuck process, retries are exhausted and we exit so it surfaces.
const MAX_LISTEN_RETRIES = 15;
const RELISTEN_DELAY_MS = 400;
let listenRetries = 0;
let relistenTimer = null;
let shuttingDown = false;

const server = app.listen(PORT, "0.0.0.0");

server.on("listening", () => {
  const r = countRegisteredRoutes();
  console.log(`[SERVER] Listening on port ${PORT}`);
  console.log(`[SERVER] http://0.0.0.0:${PORT}`);
  console.log(`[SERVER] NODE_ENV=${process.env.NODE_ENV || "development"}`);
  console.log(`[SERVER] started_at=${SERVER_START_ISO} uptime=${process.uptime().toFixed(3)}s`);
  console.log(`[SERVER] routes registered: ${r.total} (direct=${r.routes}, routers=${r.routers})`);

  // Self-heal schema AFTER the port is open, non-blocking. A fresh database or a
  // disaster-recovery restore gets the full canonical schema (IF NOT EXISTS, so a
  // healthy DB is all no-ops). Fully isolated: it can never block port-open or
  // crash boot — any failure is logged and swallowed inside ensureSchema().
  setImmediate(() => {
    ensureSchema().catch((err) => {
      console.warn("[SERVER] ensureSchema bootstrap skipped:", err?.message || err);
    });
  });
});

server.on("error", (err) => {
  if (!shuttingDown && err && err.code === "EADDRINUSE" && listenRetries < MAX_LISTEN_RETRIES) {
    listenRetries++;
    console.warn(
      `[SERVER] port ${PORT} busy (EADDRINUSE) — previous instance still releasing it; retry ${listenRetries}/${MAX_LISTEN_RETRIES} in ${RELISTEN_DELAY_MS}ms`,
    );
    relistenTimer = setTimeout(() => server.listen(PORT, "0.0.0.0"), RELISTEN_DELAY_MS);
    return;
  }
  console.error("[SERVER] fatal listen error:", err);
  process.exit(1);
});

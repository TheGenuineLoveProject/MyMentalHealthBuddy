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
const BARE_HEALTH_CANONICALS = {
  "/health": "/api/health",
  "/ready": "/api/health/ready",
  "/live": "/api/health/live",
  "/metrics": "/api/health/metrics",
};
for (const [barePath, canonical] of Object.entries(BARE_HEALTH_CANONICALS)) {
  app.get(barePath, (_req, res) => {
    res.status(404).json({ error: "Not Found", canonical });
  });
}

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


/* =========================================================
   FINAL CANONICAL SERVER BOOT
========================================================= */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SERVER] Listening on port ${PORT}`);
  console.log(`[SERVER] http://0.0.0.0:${PORT}`);
});

// ===== GRACEFUL SHUTDOWN (Observability O1) =====
// SIGTERM (deploy/redeploy/orchestrator) and SIGINT (Ctrl-C) → drain in-flight
// requests via server.close, then exit 0. If close hangs past 10s (stuck
// keep-alive sockets, runaway handler), force exit 1 so the supervisor can
// restart cleanly. .unref() on the force timer prevents it from itself
// holding the event loop open during a clean shutdown.
function gracefulShutdown(signal) {
  console.log(`[SERVER] ${signal} received — initiating graceful shutdown`);
  server.close((err) => {
    if (err) {
      console.error(`[SERVER] server.close error during ${signal}:`, err);
      process.exit(1);
    }
    console.log(`[SERVER] graceful shutdown complete (${signal})`);
    process.exit(0);
  });
  setTimeout(() => {
    console.error(`[SERVER] graceful shutdown timed out after 10s (${signal}) — forcing exit`);
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
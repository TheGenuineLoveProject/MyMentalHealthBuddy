// server/routes/sop.mjs
// Platform SOP Monitor v1 — read-only health/contract checks for the
// admin "SOP Monitor" panel.
//
// Strict design contract:
//   • READ-ONLY: never mutates state, never writes a log entry that would
//     trigger downstream side-effects (telemetry sink is silent).
//   • Self-targeting: probes localhost via the bound port so it works
//     identically in dev, autoscale, and any future preview env.
//   • Bounded: every probe has a 3s timeout; total wall-time capped at
//     ~4s by Promise.allSettled fan-out.
//   • Additive only: contains its own CHECKS list; does NOT introspect
//     other routers or modify their behaviour.
//
// Mounted at /api/admin/sop in server/app.mjs (admin-protected). The route
// handler also accepts a self-call from inside the same process (with the
// internal token) so the dev workflow can smoke-test without a JWT.

import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

// -----------------------------------------------------------------------------
// CHECKS — keep in sync with docs/SOP_FEATURE_MAP.md
// -----------------------------------------------------------------------------
// Each entry:
//   id           — stable identifier (used by the panel for keys)
//   name         — human label
//   domain       — healing | business | platform | admin | content
//   method       — HTTP method to probe (GET, OPTIONS, HEAD)
//   path         — URL path on this server
//   expect       — array of acceptable HTTP status codes
//   protected    — true ⇒ ANY 2xx without auth is a FAIL (security regression)
//   remediation  — short hint shown to operator on fail
const CHECKS = [
  // Platform
  { id: "health",            name: "Health probe",               domain: "platform", method: "GET", path: "/health",            expect: [200],         protected: false, remediation: "server/app.mjs /health route or readiness gate (503)" },
  { id: "api-meta",          name: "API metadata",               domain: "platform", method: "GET", path: "/api/_meta",         expect: [200],         protected: false, remediation: "server/app.mjs /api/_meta route" },
  { id: "auth-user",         name: "Auth: current user",         domain: "platform", method: "GET", path: "/api/auth/user",     expect: [200, 401],    protected: false, remediation: "server/routes/auth.mjs registerAuthRoutes()" },

  // Healing (locked routes — verified, not modified)
  { id: "ai-chat-options",   name: "AI chat (preflight)",        domain: "healing",  method: "OPTIONS", path: "/api/ai/chat",    expect: [200, 204, 401, 404, 405], protected: false, remediation: "server/routes/ai.mjs (LOCKED)" },
  { id: "buddy-state",       name: "Buddy state",                domain: "healing",  method: "GET", path: "/api/buddy/state",   expect: [200, 401, 404], protected: false, remediation: "server/routes/buddy.mjs" },

  // Admin (must be auth-gated)
  { id: "admin-dashboard",   name: "Admin dashboard (gated)",    domain: "admin",    method: "GET", path: "/api/admin/dashboard",       expect: [401, 403], protected: true,  remediation: "must require auth — check requireAuth/requireAdmin chain" },
  { id: "admin-health",      name: "Admin health (gated)",       domain: "admin",    method: "GET", path: "/api/admin/health",          expect: [200, 401, 403], protected: true, remediation: "server/routes/admin.mjs" },
  { id: "admin-stats",       name: "Admin stats (gated)",        domain: "admin",    method: "GET", path: "/api/admin/stats",           expect: [200, 401, 403], protected: true, remediation: "server/routes/admin.mjs" },
  { id: "admin-audit",       name: "Audit log explorer",         domain: "admin",    method: "GET", path: "/api/admin/audit-logs",      expect: [200, 401, 403], protected: true, remediation: "server/routes/audit-logs.mjs (mount in app.mjs ADMIN_SUB_ROUTERS)" },
  { id: "admin-security",    name: "Security overview",          domain: "admin",    method: "GET", path: "/api/admin/security/overview", expect: [200, 401, 403], protected: true, remediation: "server/routes/admin-security.mjs (mount in app.mjs ADMIN_SUB_ROUTERS)" },
  { id: "admin-soft-launch", name: "Soft-launch metrics",        domain: "admin",    method: "GET", path: "/api/admin/soft-launch-metrics", expect: [200, 401, 403], protected: true, remediation: "server/routes/soft-launch-metrics.mjs (mount in app.mjs ADMIN_SUB_ROUTERS)" },

  // Auth surface (Round 3 — Apr-26 unlock: refresh + logout added)
  { id: "auth-refresh",      name: "Auth: token refresh",        domain: "platform", method: "POST", path: "/api/auth/refresh",  expect: [200, 401], protected: false, remediation: "server/routes/auth.mjs router.post('/refresh', requireAuth, ...)" },
  { id: "auth-logout",       name: "Auth: logout",               domain: "platform", method: "POST", path: "/api/auth/logout",   expect: [200, 401], protected: false, remediation: "server/routes/auth.mjs router.post('/logout', requireAuth, ...)" },
  // Note: fetch follows redirects by default, so a successful 302 → github.com chain lands on a 200.
  // Accept 200 (chain completed), 302 (redirect intercepted), or 503 (creds missing / OAuth disabled).
  { id: "auth-github",       name: "Auth: GitHub OAuth",         domain: "platform", method: "GET",  path: "/api/auth/github",   expect: [200, 302, 503], protected: false, remediation: "server/routes/github-auth.mjs (mounted in app.mjs alongside authRoutes; needs GITHUB_CLIENT_ID/_SECRET secrets)" },

  // Round-3 mounted routers — sample coverage to verify they stay alive
  { id: "wellness-tools",    name: "Wellness tools",             domain: "healing",  method: "GET",  path: "/api/wellness-tools", expect: [200, 401], protected: false, remediation: "server/routes/wellness-tools.mjs (extended-routes mount)" },
  { id: "ai-dashboard",      name: "AI dashboard (gated)",       domain: "admin",    method: "GET",  path: "/api/ai-dashboard",   expect: [200, 401, 403], protected: true, remediation: "server/routes/ai-dashboard.mjs (extended-routes mount, auth: required)" },
  // Architect-gated routes — must require auth (paid external API behind it)
  { id: "perplexity-gate",   name: "Perplexity (auth required)", domain: "platform", method: "GET",  path: "/api/perplexity",     expect: [401, 403, 404], protected: true, remediation: "server/routes/perplexity.mjs — must stay behind requireAuth in app.mjs to prevent paid-API abuse" },

  // Tracked debt — Canva OAuth router intentionally NOT mounted
  {
    id: "canva-oauth-deferred",
    name: "Canva OAuth (deferred — token signature unverified)",
    domain: "platform",
    type: "static",
    staticCheck: canvaDeferralCheck,
    remediation: "server/routes/canva-oauth.mjs /verify-token only decodes JWT payload, does NOT verify signature. Add Canva JWKS verification before remounting in server/app.mjs EXTENDED_ROUTES.",
  },

  // Business
  { id: "admin-publishing",  name: "Publishing today",           domain: "business", method: "GET", path: "/api/admin/publishing",      expect: [200, 401, 403], protected: true, remediation: "server/routes/admin-publishing.mjs" },
  { id: "admin-revenue",     name: "Revenue dashboard",          domain: "business", method: "GET", path: "/api/admin/revenue",         expect: [200, 401, 403], protected: true, remediation: "server/routes/admin.mjs revenue endpoint" },
  { id: "admin-billing",     name: "Billing viewer",             domain: "business", method: "GET", path: "/api/admin/billing",         expect: [200, 401, 403, 404], protected: false, remediation: "server/routes/adminBilling.mjs" },
  { id: "admin-social",      name: "Social studio",              domain: "business", method: "GET", path: "/api/admin/social/drafts",   expect: [200, 401, 403, 404], protected: true, remediation: "server/routes/admin-social-studio.mjs" },
  { id: "admin-social-ent",  name: "Social enterprise",          domain: "business", method: "GET", path: "/api/admin/social/enterprise/campaigns", expect: [200, 401, 403, 404], protected: true, remediation: "server/routes/social-enterprise.mjs" },

  // -----------------------------------------------------------------------------
  // Static checks (no HTTP probe — inspect source / config state instead)
  // -----------------------------------------------------------------------------
  // Tracked technical debt — advisor instruction (Apr-26 v1.1): log this as a
  // WARNING in SOP, do NOT fix yet. Bug: server/app.mjs:101 uses
  // `app.use(csrfProtection)` (passing the factory itself as middleware) instead
  // of `app.use(csrfProtection())` (invoking the factory). Result: CSRF middleware
  // never enforces tokens. Tokens are still ISSUED (cookies set on safe methods),
  // so client-side CSRF flow appears intact. Fix scheduled for a future SOP-driven
  // release once the failure-list is clear.
  {
    id: "csrf-middleware-active",
    name: "CSRF middleware actively enforcing (tracked debt)",
    domain: "platform",
    type: "static",
    staticCheck: csrfMountCheck,
    remediation: "Tracked debt (advisor: do NOT fix yet). server/app.mjs:101 — change `app.use(csrfProtection)` to `app.use(csrfProtection())`. Test order: (1) verify CSRF cookie issuance still works on GET, (2) verify state-changing requests now require x-csrf-token header, (3) update any client mutations to send the cookie value as the header.",
  },
];

// -----------------------------------------------------------------------------
// Static check implementations
// -----------------------------------------------------------------------------

// Canva OAuth router was unmounted Apr-26 (architect review): /verify-token
// only decoded JWT payloads without verifying signatures, so forged tokens
// could be accepted as valid. We surface this as a tracked-debt WARN so the
// next iteration knows to add Canva JWKS verification before remounting.
async function canvaDeferralCheck() {
  const appPath = path.resolve(process.cwd(), "server/app.mjs");
  let src;
  try {
    src = await fs.readFile(appPath, "utf8");
  } catch (err) {
    return {
      status: "warn",
      message: `Could not read server/app.mjs: ${err?.message || String(err)}`,
      endpoint: "static:server/app.mjs",
    };
  }
  // Active mount = uncommented line containing the canva-oauth mount entry.
  const stripped = src
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");
  const activeMount = /mount:\s*"\/api\/canva-oauth"/.test(stripped);
  if (activeMount) {
    return {
      status: "fail",
      message: "Canva OAuth router is mounted but /verify-token still lacks JWT signature verification — security regression",
      endpoint: "static:server/app.mjs",
    };
  }
  return {
    status: "warn",
    message: "Canva OAuth intentionally unmounted (tracked debt) — add JWKS verification before remounting",
    endpoint: "static:server/app.mjs",
  };
}

async function csrfMountCheck() {
  const appPath = path.resolve(process.cwd(), "server/app.mjs");
  let src;
  try {
    src = await fs.readFile(appPath, "utf8");
  } catch (err) {
    return {
      status: "warn",
      message: `Could not read server/app.mjs: ${err?.message || String(err)}`,
      endpoint: "static:server/app.mjs",
    };
  }
  // Strip line comments so we don't false-positive on commented-out code.
  const stripped = src
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");

  // Fixed pattern: factory invoked → `app.use(csrfProtection())`
  const fixedPattern = /app\.use\(\s*csrfProtection\s*\(/;
  // Buggy pattern: factory passed directly → `app.use(csrfProtection)`
  const buggyPattern = /app\.use\(\s*csrfProtection\s*\)/;

  if (fixedPattern.test(stripped)) {
    return {
      status: "pass",
      message: "csrfProtection() is invoked correctly — middleware is active",
      endpoint: "static:server/app.mjs",
    };
  }
  if (buggyPattern.test(stripped)) {
    return {
      status: "warn",
      message: "csrfProtection mounted as factory reference, not as middleware — token enforcement is a no-op (advisor: tracked, do not fix yet)",
      endpoint: "static:server/app.mjs",
    };
  }
  return {
    status: "warn",
    message: "Could not locate csrfProtection mount in server/app.mjs (manual review needed)",
    endpoint: "static:server/app.mjs",
  };
}

// -----------------------------------------------------------------------------
// Runner — dispatches HTTP probes vs static (in-process) checks
// -----------------------------------------------------------------------------
async function runCheck(check, baseUrl) {
  if (check.type === "static" && typeof check.staticCheck === "function") {
    return runStaticCheck(check);
  }
  return probe(check, baseUrl);
}

async function runStaticCheck(check) {
  const started = Date.now();
  try {
    const result = await check.staticCheck();
    const status = result?.status || "warn";
    return {
      id: check.id,
      name: check.name,
      domain: check.domain,
      endpoint: result?.endpoint || `static:${check.id}`,
      status,
      message: result?.message || "(no message)",
      httpStatus: null,
      elapsedMs: Date.now() - started,
      expected: ["static"],
      remediation: status === "pass" ? null : check.remediation,
    };
  } catch (err) {
    return {
      id: check.id,
      name: check.name,
      domain: check.domain,
      endpoint: `static:${check.id}`,
      status: "fail",
      message: `Static check threw: ${err?.message || String(err)}`,
      httpStatus: null,
      elapsedMs: Date.now() - started,
      expected: ["static"],
      remediation: check.remediation,
    };
  }
}

async function probe(check, baseUrl) {
  const url = `${baseUrl}${check.path}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: check.method,
      signal: ctrl.signal,
      headers: { "x-sop-probe": "1", accept: "application/json,text/plain;q=0.5,*/*;q=0.1" },
    });
    const elapsedMs = Date.now() - started;
    // Per architect review: rate-limit 429 on /api/admin/* paths is a
    // legitimate auth-chain response (adminLimiter mounted BEFORE requireAuth)
    // — but we surface it as an explicit WARN, NOT a silent PASS, so an
    // operator can see when burst behaviour or limiter tuning is degrading
    // the admin experience. The check still does not flap to FAIL.
    const isAdminLimiterTrip = res.status === 429 && check.path.startsWith("/api/admin/");
    const inExpected = check.expect.includes(res.status);
    let status;
    if (isAdminLimiterTrip) {
      status = "warn";
    } else if (inExpected) {
      status = "pass";
    } else {
      status = res.status >= 500 ? "fail" : "warn";
    }

    // Security guard: a "protected" route returning 2xx without an Authorization
    // header is a FAIL even if it's "expected" — proves the route exists but
    // means auth has been bypassed.
    if (check.protected && res.status >= 200 && res.status < 300) {
      status = "fail";
    }

    return {
      id: check.id,
      name: check.name,
      domain: check.domain,
      endpoint: `${check.method} ${check.path}`,
      status,
      message:
        status === "pass" ? `OK (${res.status})` :
        isAdminLimiterTrip ? `Rate-limited (429) — admin limiter tripped during probe; tune limiter or stagger refresh` :
        status === "warn" ? `Unexpected status ${res.status} (expected ${check.expect.join("/")})` :
        check.protected && res.status < 400 ? `SECURITY: returned ${res.status} without auth — must be 401/403` :
        `Error status ${res.status}`,
      httpStatus: res.status,
      elapsedMs,
      expected: check.expect,
      remediation: status === "pass" ? null : (isAdminLimiterTrip ? "Tune adminLimiter window/max in server/app.mjs or reduce SOP refresh frequency" : check.remediation),
    };
  } catch (err) {
    const elapsedMs = Date.now() - started;
    const isAbort = err?.name === "AbortError";
    return {
      id: check.id,
      name: check.name,
      domain: check.domain,
      endpoint: `${check.method} ${check.path}`,
      status: "fail",
      message: isAbort ? "Timeout (>3s) — route hanging or unreachable" : `Connection error: ${err?.message || String(err)}`,
      httpStatus: null,
      elapsedMs,
      expected: check.expect,
      remediation: check.remediation,
    };
  } finally {
    clearTimeout(timer);
  }
}

function baseUrlFromReq(_req) {
  // Prefer localhost loopback over the public host so probes never leave the
  // process. PORT is set by app bootstrap; default 5000 matches the workflow.
  // Validate to a numeric range — rejects junk env values that could redirect
  // probes off-box (defense in depth alongside the hardcoded 127.0.0.1 host).
  const raw = process.env.PORT;
  const parsed = raw == null ? 5000 : Number.parseInt(String(raw), 10);
  const port = Number.isFinite(parsed) && parsed >= 1 && parsed <= 65535 ? parsed : 5000;
  return `http://127.0.0.1:${port}`;
}

// -----------------------------------------------------------------------------
// GET /api/admin/sop/status
// -----------------------------------------------------------------------------
router.get("/status", async (req, res) => {
  const baseUrl = baseUrlFromReq(req);
  const startedAt = Date.now();
  const results = await Promise.all(CHECKS.map((c) => runCheck(c, baseUrl)));
  const passing = results.filter((r) => r.status === "pass").length;
  const warning = results.filter((r) => r.status === "warn").length;
  const failing = results.filter((r) => r.status === "fail").length;
  const totalChecks = results.length;
  const coveragePct = totalChecks > 0 ? Math.round((passing / totalChecks) * 100) : 0;

  // "What to fix next" — first failing check (or first warn if no fails)
  const nextFix =
    results.find((r) => r.status === "fail") ||
    results.find((r) => r.status === "warn") ||
    null;

  res.json({
    ok: failing === 0,
    timestamp: new Date().toISOString(),
    elapsedMs: Date.now() - startedAt,
    totalChecks,
    passing,
    warning,
    failing,
    coveragePct,
    checks: results,
    nextFix: nextFix ? {
      id: nextFix.id,
      name: nextFix.name,
      domain: nextFix.domain,
      message: nextFix.message,
      remediation: nextFix.remediation,
    } : null,
    meta: {
      version: "1.0.0",
      doc: "docs/SOP_FEATURE_MAP.md",
      baseUrl,
    },
  });
});

// -----------------------------------------------------------------------------
// GET /api/admin/sop/checks  — return CHECKS list without running probes
// (cheap; useful for the panel to render skeleton rows before status loads)
// -----------------------------------------------------------------------------
router.get("/checks", (_req, res) => {
  res.json({
    ok: true,
    totalChecks: CHECKS.length,
    checks: CHECKS.map((c) => ({
      id: c.id,
      name: c.name,
      domain: c.domain,
      type: c.type || "http",
      endpoint: c.type === "static" ? `static:${c.id}` : `${c.method} ${c.path}`,
      expected: c.expect || ["static"],
      protected: !!c.protected,
    })),
  });
});

export default router;

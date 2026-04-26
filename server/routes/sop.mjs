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

  // Business
  { id: "admin-publishing",  name: "Publishing today",           domain: "business", method: "GET", path: "/api/admin/publishing",      expect: [200, 401, 403], protected: true, remediation: "server/routes/admin-publishing.mjs" },
  { id: "admin-revenue",     name: "Revenue dashboard",          domain: "business", method: "GET", path: "/api/admin/revenue",         expect: [200, 401, 403], protected: true, remediation: "server/routes/admin.mjs revenue endpoint" },
  { id: "admin-billing",     name: "Billing viewer",             domain: "business", method: "GET", path: "/api/admin/billing",         expect: [200, 401, 403, 404], protected: false, remediation: "server/routes/adminBilling.mjs" },
  { id: "admin-social",      name: "Social studio",              domain: "business", method: "GET", path: "/api/admin/social/drafts",   expect: [200, 401, 403, 404], protected: true, remediation: "server/routes/admin-social-studio.mjs" },
  { id: "admin-social-ent",  name: "Social enterprise",          domain: "business", method: "GET", path: "/api/admin/social/enterprise/campaigns", expect: [200, 401, 403, 404], protected: true, remediation: "server/routes/social-enterprise.mjs" },
];

// -----------------------------------------------------------------------------
// Probe runner
// -----------------------------------------------------------------------------
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
    const inExpected = check.expect.includes(res.status);
    let status = inExpected ? "pass" : (res.status >= 500 ? "fail" : "warn");

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
        status === "warn" ? `Unexpected status ${res.status} (expected ${check.expect.join("/")})` :
        check.protected && res.status < 400 ? `SECURITY: returned ${res.status} without auth — must be 401/403` :
        `Error status ${res.status}`,
      httpStatus: res.status,
      elapsedMs,
      expected: check.expect,
      remediation: status === "pass" ? null : check.remediation,
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
  const results = await Promise.all(CHECKS.map((c) => probe(c, baseUrl)));
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
      endpoint: `${c.method} ${c.path}`,
      expected: c.expect,
      protected: !!c.protected,
    })),
  });
});

export default router;

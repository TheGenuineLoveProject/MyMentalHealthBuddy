// server/routes/observability.mjs
// ---------------------------------------------------------------------------
// Admin-gated diagnostic surface for the Week 2 OpenTelemetry + PagerDuty wiring.
// Mounted in app.mjs ADMIN_SUB_ROUTERS at /api/admin/observability — auth +
// rate limit + admin gate are applied by the parent app.mjs mount.
//
// All endpoints are read-only EXCEPT POST /alerter/test which fires a single
// synthetic test alert (info severity, unique dedup key) so operators can
// verify the PagerDuty integration without faking a real failure.
// ---------------------------------------------------------------------------

import express from "express";
import { getTracingState } from "../observability/tracing.mjs";
import {
  getAlerterState,
  isAlerterDegraded,
  sendTestAlert,
} from "../observability/alerter.mjs";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    surface: "observability",
    endpoints: [
      "GET  /api/admin/observability/tracing",
      "GET  /api/admin/observability/alerter",
      "GET  /api/admin/observability/health",
      "POST /api/admin/observability/alerter/test",
    ],
  });
});

router.get("/tracing", (_req, res) => {
  res.json({ ok: true, tracing: getTracingState() });
});

router.get("/alerter", (_req, res) => {
  res.json({ ok: true, alerter: getAlerterState() });
});

router.get("/health", (_req, res) => {
  const tracing = getTracingState();
  const alerter = getAlerterState();
  // "Health" of the observability stack itself (not the app's overall health,
  // which lives at /api/health). Operators alert on this rolling up to red
  // when tracing fails to start in production.
  const tracingHealthy =
    tracing.enabled || process.env.OTEL_DISABLED === "true";
  // alerter is allowed to be unconfigured — that is the documented dev posture.
  // It's only "degraded" if a recent failure occurred AND no successful send
  // has happened since (see isAlerterDegraded for the recovery-window logic).
  const alerterDegraded = isAlerterDegraded();

  res.json({
    ok: tracingHealthy && !alerterDegraded,
    tracing: {
      enabled: tracing.enabled,
      reason: tracing.reason,
      exporter: tracing.exporter,
    },
    alerter: {
      configured: alerter.configured,
      enabled: alerter.enabled,
      reason: alerter.reason,
      degraded: alerterDegraded,
      lastError: alerter.lastError,
      lastFailureAt: alerter.lastFailureAt,
      lastEventAt: alerter.lastEventAt,
    },
  });
});

router.post("/alerter/test", async (_req, res) => {
  const result = await sendTestAlert();
  res.status(result.ok ? 200 : 502).json({
    ok: result.ok,
    mode: result.mode,
    error: result.error,
    note:
      "Test alert dispatched. Check PagerDuty for an 'info' severity event titled " +
      "'MMHB synthetic test alert'. If alerter is in dry-run mode, only logs were emitted.",
  });
});

export default router;

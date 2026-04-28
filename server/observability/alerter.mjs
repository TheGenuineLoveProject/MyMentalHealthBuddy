// server/observability/alerter.mjs
// ---------------------------------------------------------------------------
// PagerDuty Events API v2 client + console fallback — Week 2 Foundation Sprint.
//
// Behaviour matrix:
//   • PAGERDUTY_ROUTING_KEY missing       → no-op + log to stdout (always-on
//                                           fallback so the call sites are
//                                           always safe to invoke)
//   • ALERTS_ENABLED=false (default true) → dry-run only, log "would page"
//   • NODE_ENV !== "production"           → never pages, always logs (override
//                                           with ALERTS_FORCE=true for testing)
//
// Call sites in safetyAlerts.mjs MUST always be safe to invoke regardless of
// configuration. This module never throws.
//
// Dedup: a 5-minute window per (severity, dedup_key) pair to prevent storms.
// PagerDuty also dedups server-side via dedup_key, but local dedup keeps us
// from hammering their API in tight failure loops.
// ---------------------------------------------------------------------------

import { logger } from "../utils/logger.mjs";

const PD_EVENTS_URL = "https://events.pagerduty.com/v2/enqueue";

const DEDUP_WINDOW_MS = parseInt(
  process.env.ALERT_DEDUP_WINDOW_MS || `${5 * 60 * 1000}`,
  10,
);

const SEVERITIES = new Set(["critical", "error", "warning", "info"]);

const dedupCache = new Map(); // key → expiresAt epoch ms
function isDuplicate(key) {
  const now = Date.now();
  for (const [k, exp] of dedupCache) {
    if (exp <= now) dedupCache.delete(k);
  }
  if (dedupCache.has(key)) return true;
  dedupCache.set(key, now + DEDUP_WINDOW_MS);
  return false;
}

const state = {
  configured: false,
  reason: "PAGERDUTY_ROUTING_KEY not set",
  enabled: false,
  forced: process.env.ALERTS_FORCE === "true",
  isProd: process.env.NODE_ENV === "production",
  totalSent: 0,
  totalSuppressed: 0,
  totalFailed: 0,
  lastEventAt: null,
  lastError: null,
  lastFailureAt: null, // ISO timestamp of most recent failure; used by /health
                       // to age-out transient blips (see RECOVERY_WINDOW_MS).
};

// If the most recent alerter failure is older than this window, /health no
// longer reports the alerter as degraded. This prevents a single transient
// PagerDuty 5xx from pinning health red indefinitely during quiet periods.
export const RECOVERY_WINDOW_MS = parseInt(
  process.env.ALERT_RECOVERY_WINDOW_MS || `${10 * 60 * 1000}`,
  10,
);

export function isAlerterDegraded() {
  if (!state.configured) return false; // unconfigured ≠ degraded
  if (!state.lastFailureAt) return false;
  const lastFailMs = Date.parse(state.lastFailureAt);
  if (Number.isNaN(lastFailMs)) return false;
  // Recovered if a successful send occurred AFTER the last failure.
  if (state.lastEventAt && Date.parse(state.lastEventAt) > lastFailMs) return false;
  // Otherwise, only degraded if the failure is recent.
  return Date.now() - lastFailMs < RECOVERY_WINDOW_MS;
}

function refreshState() {
  state.configured = Boolean(process.env.PAGERDUTY_ROUTING_KEY);
  state.enabled = state.configured && process.env.ALERTS_ENABLED !== "false";
  state.forced = process.env.ALERTS_FORCE === "true";
  state.isProd = process.env.NODE_ENV === "production";
  if (!state.configured) state.reason = "PAGERDUTY_ROUTING_KEY not set";
  else if (!state.enabled) state.reason = "ALERTS_ENABLED=false (dry-run)";
  else if (!state.isProd && !state.forced) state.reason = "non-prod (ALERTS_FORCE=false)";
  else state.reason = "live";
  return state;
}

/**
 * Send a PagerDuty alert. Always safe to call.
 *
 * @param {object} args
 * @param {"critical"|"error"|"warning"|"info"} args.severity
 * @param {string} args.summary - Human-readable one-line description.
 * @param {string} args.source - The component/service that triggered the alert.
 * @param {string} args.dedupKey - Stable identifier per incident type.
 * @param {object} [args.custom_details] - Free-form metadata payload.
 * @param {string} [args.component] - Optional sub-component (e.g. "stripe-webhook").
 * @param {string} [args.group] - Optional logical grouping (e.g. "billing").
 * @param {string} [args.class] - Optional class/type (e.g. "signature-failure").
 * @returns {Promise<{ok:boolean, mode:string, dedup?:boolean, error?:string}>}
 */
export async function sendAlert({
  severity,
  summary,
  source,
  dedupKey,
  custom_details,
  component,
  group,
  class: alertClass,
}) {
  refreshState();

  if (!SEVERITIES.has(severity)) severity = "error";
  if (!summary || typeof summary !== "string") summary = "(no summary)";
  if (!source || typeof source !== "string") source = "mmhb";
  if (!dedupKey || typeof dedupKey !== "string") dedupKey = `${source}:${severity}`;

  const dedupHit = isDuplicate(`${severity}:${dedupKey}`);
  if (dedupHit) {
    state.totalSuppressed += 1;
    logger.info("[alerter] suppressed (dedup)", { severity, dedupKey, source });
    return { ok: true, mode: "suppressed", dedup: true };
  }

  // Always log — even in dry-run mode — so operators have a record.
  logger.warn(`[alerter:${severity}] ${summary}`, {
    severity,
    source,
    dedupKey,
    component,
    group,
    class: alertClass,
    custom_details,
    mode: state.reason,
  });

  if (!state.configured || !state.enabled) {
    return { ok: true, mode: state.reason };
  }
  if (!state.isProd && !state.forced) {
    return { ok: true, mode: "dry-run-non-prod" };
  }

  const payload = {
    routing_key: process.env.PAGERDUTY_ROUTING_KEY,
    event_action: "trigger",
    dedup_key: `${state.isProd ? "prod" : "dev"}:${severity}:${dedupKey}`,
    payload: {
      summary: summary.slice(0, 1024),
      source,
      severity,
      component,
      group,
      class: alertClass,
      custom_details: custom_details || undefined,
    },
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(PD_EVENTS_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`PagerDuty ${res.status}: ${text.slice(0, 200)}`);
    }
    state.totalSent += 1;
    state.lastEventAt = new Date().toISOString();
    state.lastError = null;
    return { ok: true, mode: "sent" };
  } catch (err) {
    state.totalFailed += 1;
    state.lastError = err?.message || String(err);
    state.lastFailureAt = new Date().toISOString();
    logger.error("[alerter] PagerDuty send failed", {
      severity,
      dedupKey,
      error: state.lastError,
    });
    return { ok: false, mode: "failed", error: state.lastError };
  }
}

/**
 * Resolve a previously-triggered incident. Optional convenience wrapper.
 * Use the same dedupKey that was used to trigger.
 */
export async function resolveAlert({ dedupKey, severity = "error" }) {
  refreshState();
  if (!state.configured || !state.enabled || (!state.isProd && !state.forced)) {
    return { ok: true, mode: state.reason };
  }
  try {
    const res = await fetch(PD_EVENTS_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        routing_key: process.env.PAGERDUTY_ROUTING_KEY,
        event_action: "resolve",
        dedup_key: `${state.isProd ? "prod" : "dev"}:${severity}:${dedupKey}`,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`PagerDuty resolve ${res.status}: ${text.slice(0, 200)}`);
    }
    return { ok: true, mode: "resolved" };
  } catch (err) {
    return { ok: false, mode: "failed", error: err?.message || String(err) };
  }
}

export function getAlerterState() {
  refreshState();
  return { ...state };
}

/**
 * Force-send a synthetic test alert. Used by the admin endpoint to validate
 * the PagerDuty wiring end-to-end. Always uses a unique dedupKey.
 */
export async function sendTestAlert() {
  return sendAlert({
    severity: "info",
    summary: "MMHB synthetic test alert (admin-triggered, ignore)",
    source: "mmhb-observability-admin",
    dedupKey: `synthetic-test-${Date.now()}`,
    custom_details: {
      note: "This is a manually-triggered test from /api/admin/observability/alerter/test",
      env: process.env.NODE_ENV,
    },
  });
}

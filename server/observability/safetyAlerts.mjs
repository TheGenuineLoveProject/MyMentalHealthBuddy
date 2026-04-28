// server/observability/safetyAlerts.mjs
// ---------------------------------------------------------------------------
// Typed convenience wrappers for the safety-critical alert classes identified
// in ADR-0001 (Modular Monolith → Strangler Fig). Each wrapper has a stable
// dedupKey shape so PagerDuty + local dedup can correlate repeat incidents.
//
// Call sites import from here, never from alerter.mjs directly, so the call
// shape (severity, dedupKey, source, group) is consistent across the codebase
// and so we can add per-class behaviour (rate limits, additional log routing,
// auto-resolve) in one place later.
// ---------------------------------------------------------------------------

import { createHash } from "node:crypto";
import { sendAlert } from "./alerter.mjs";

// Privacy helper: short irreversible hash of a sensitive identifier so we can
// correlate per-user incidents in PagerDuty without sending raw user/session
// IDs to a third party. Salted by JWT_SECRET when available so two different
// deploys don't share the same hash space.
function hashId(id) {
  if (id === undefined || id === null || id === "") return undefined;
  const salt = process.env.JWT_SECRET || "mmhb-default-salt";
  return createHash("sha256")
    .update(String(salt))
    .update(":")
    .update(String(id))
    .digest("hex")
    .slice(0, 12);
}

/**
 * Crisis detection / safety pipeline failure.
 * SEVERITY: critical — a regression here could fail to route a real user to /crisis.
 */
export function alertCrisisPipelineFailure({ stage, error, requestId }) {
  return sendAlert({
    severity: "critical",
    summary: `Crisis pipeline failure at stage="${stage}" — ${error?.message || error}`,
    source: "mmhb-crisis-pipeline",
    dedupKey: `crisis-pipeline:${stage}`,
    component: stage,
    group: "safety",
    class: "pipeline-failure",
    custom_details: {
      requestId,
      error: error?.message || String(error),
      stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
    },
  });
}

/**
 * PHQ-9 item 9 escalation could not deliver. (Item 9 = suicidal ideation.)
 * SEVERITY: critical — the entire protocol exists for this moment.
 */
export function alertPHQ9EscalationFailure({ sessionId, userId, error }) {
  // Dedup at the incident-class level — operators want one page when "PHQ-9
  // escalation is broken", not one page per session during a system outage.
  // Hashed identifiers are sent in custom_details for correlation only.
  return sendAlert({
    severity: "critical",
    summary: `PHQ-9 item-9 escalation failed (see custom_details for hashed session id)`,
    source: "mmhb-protocol-executor",
    dedupKey: `phq9-escalation`,
    component: "phq9",
    group: "safety",
    class: "escalation-failure",
    custom_details: {
      sessionIdHash: hashId(sessionId),
      userIdHash: hashId(userId),
      error: error?.message || String(error),
    },
  });
}

/**
 * Stripe webhook signature verification failed.
 * SEVERITY: error — could be an attack, could be a misconfigured secret rotation.
 */
export function alertWebhookSignatureFailure({ provider, error, sourceIp }) {
  return sendAlert({
    severity: "error",
    summary: `${provider} webhook signature verification failed`,
    source: "mmhb-webhook",
    dedupKey: `webhook-sig:${provider}`,
    component: provider,
    group: "billing",
    class: "signature-failure",
    custom_details: {
      provider,
      error: error?.message || String(error),
      sourceIp,
    },
  });
}

/**
 * Biometric ingestion failure (OAuth callback, normalizer, encryption error).
 * SEVERITY: error — PHI-adjacent, must not silently drop.
 */
export function alertBiometricIngestionFailure({ provider, userId, error, stage }) {
  return sendAlert({
    severity: "error",
    summary: `Biometric ingestion failed: provider=${provider} stage=${stage}`,
    source: "mmhb-biometrics",
    dedupKey: `biometric:${provider}:${stage}`,
    component: provider,
    group: "biometrics",
    class: stage,
    custom_details: {
      provider,
      userIdHash: hashId(userId),
      stage,
      error: error?.message || String(error),
    },
  });
}

/**
 * Constitutional gate violation — the AI orchestrator emitted output that
 * violated one of the five inviolable rules (no diagnosis, no impersonation,
 * no payment requests, etc.). Should never happen in production.
 * SEVERITY: critical.
 */
export function alertConstitutionalViolation({ rule, agentId, requestId, snippet }) {
  return sendAlert({
    severity: "critical",
    summary: `Constitutional gate triggered: rule="${rule}" agent="${agentId}"`,
    source: "mmhb-constitutional-gate",
    dedupKey: `constitutional:${rule}`,
    component: agentId,
    group: "safety",
    class: "constitutional-violation",
    custom_details: {
      rule,
      agentId,
      requestId,
      snippet: typeof snippet === "string" ? snippet.slice(0, 280) : undefined,
    },
  });
}

/**
 * Database schema/migration failure or boot-time integrity check failure.
 * SEVERITY: critical — the app is likely degraded.
 */
export function alertSchemaFailure({ stage, error }) {
  return sendAlert({
    severity: "critical",
    summary: `Schema/boot integrity failure at stage="${stage}" — ${error?.message || error}`,
    source: "mmhb-boot",
    dedupKey: `schema:${stage}`,
    component: "ensureSchema",
    group: "platform",
    class: "boot-failure",
    custom_details: {
      stage,
      error: error?.message || String(error),
      stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
    },
  });
}

/**
 * Generic uncaught exception / unhandled promise rejection.
 * SEVERITY: error — the process-level handlers in app.mjs already log;
 * this gives PagerDuty visibility for the same event class.
 */
export function alertUncaught({ kind, error }) {
  return sendAlert({
    severity: "error",
    summary: `Uncaught ${kind}: ${error?.message || error}`,
    source: "mmhb-process",
    dedupKey: `uncaught:${kind}`,
    component: "process",
    group: "platform",
    class: kind,
    custom_details: {
      kind,
      error: error?.message || String(error),
      stack: error?.stack?.split("\n").slice(0, 8).join("\n"),
    },
  });
}

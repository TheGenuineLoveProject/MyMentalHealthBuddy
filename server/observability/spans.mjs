// server/observability/spans.mjs
// ---------------------------------------------------------------------------
// Helpers for creating custom OpenTelemetry spans at high-value call sites
// (agent orchestrator, awareness detection, protocol session, crisis
// routing). All helpers are no-op safe when OTel is disabled — the global
// API returns a ProxyTracer backed by NoopTracerProvider, so startSpan /
// end / setAttribute become no-ops.
//
// Baggage helpers stamp request.id / enduser.id (hashed) / session.id
// (hashed) on the active span and emit OTel baggage so downstream child
// spans inherit the same correlation context.
// ---------------------------------------------------------------------------

import {
  trace,
  context,
  propagation,
  SpanStatusCode,
} from "@opentelemetry/api";
import { createHash } from "node:crypto";

const TRACER_NAME = "mmhb";

function tracer() {
  return trace.getTracer(TRACER_NAME);
}

// Privacy helper: short irreversible hash of a sensitive identifier so we
// can correlate per-user traces without sending raw IDs to the trace
// backend. Salted by JWT_SECRET when available so two deploys don't share
// the same hash space. Mirrors the helper in safetyAlerts.mjs.
function shortHash(id) {
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
 * Run `fn` inside a child span. Records exceptions, marks ERROR status
 * on throw, always ends the span. Returns whatever fn returns.
 */
export async function withSpan(name, attrs, fn) {
  const span = tracer().startSpan(name, { attributes: attrs || {} });
  try {
    return await context.with(
      trace.setSpan(context.active(), span),
      () => fn(span)
    );
  } catch (err) {
    try {
      span.recordException(err);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err?.message || String(err),
      });
    } catch {}
    throw err;
  } finally {
    try {
      span.end();
    } catch {}
  }
}

/**
 * Same as withSpan, but tags safety.critical=true so safety-critical
 * paths are easy to isolate in dashboards and alert rules.
 */
export async function withCriticalSpan(name, attrs, fn) {
  return withSpan(name, { ...(attrs || {}), "safety.critical": true }, fn);
}

/**
 * Stamp the active span with hashed user/session/request identifiers and
 * emit OTel baggage so downstream child spans inherit the same context.
 * Safe to call from middleware — never throws, never blocks.
 */
export function setObservabilityBaggage({
  requestId,
  userId,
  sessionId,
} = {}) {
  try {
    const entries = {};
    if (requestId) entries["request.id"] = { value: String(requestId) };
    const enduser = shortHash(userId);
    if (enduser) entries["enduser.id"] = { value: enduser };
    const sess = shortHash(sessionId);
    if (sess) entries["session.id"] = { value: sess };
    if (Object.keys(entries).length === 0) return context.active();

    const baggage = propagation.createBaggage(entries);
    const ctx = propagation.setBaggage(context.active(), baggage);
    const span = trace.getActiveSpan();
    if (span) {
      for (const [k, v] of Object.entries(entries)) {
        try {
          span.setAttribute(k, v.value);
        } catch {}
      }
    }
    return ctx;
  } catch {
    return context.active();
  }
}

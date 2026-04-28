// server/middleware/observabilityContext.mjs
// ---------------------------------------------------------------------------
// Express middleware that stamps the active OpenTelemetry span with
// requestId / userId / sessionId and emits OTel baggage so downstream
// child spans (custom orchestrator/awareness/protocol/crisis spans)
// inherit the correlation context.
//
// Safe-by-default: never throws, never blocks. Mounted globally after
// the requestId middleware so req.requestId is always available; per-
// route auth populates req.user / req.dbUserId later, so handlers wrapped
// in withSpan/withCriticalSpan should also call setObservabilityBaggage
// inline if they need user-level baggage on their span.
//
// IMPORTANT: setObservabilityBaggage returns a new OTel context that
// carries the baggage entries. To make downstream child spans actually
// INHERIT that baggage, the rest of the request lifecycle must run inside
// that context — that's why we wrap next() in context.with(ctx, next).
// Without this wrapping, the baggage is created but never propagated.
// ---------------------------------------------------------------------------

import { context as otelContext } from "@opentelemetry/api";
import { setObservabilityBaggage } from "../observability/spans.mjs";

export function observabilityContext(req, _res, next) {
  const ctx = setObservabilityBaggage({
    requestId: req.requestId,
    userId: req.user?.id || req.dbUserId,
    sessionId: req.sessionID,
  });
  // Run the remainder of the request inside the baggage-carrying context
  // so any child spans created downstream (custom orchestrator/awareness/
  // protocol/crisis spans) inherit request.id, enduser.id, session.id.
  if (ctx) {
    otelContext.with(ctx, next);
  } else {
    next();
  }
}

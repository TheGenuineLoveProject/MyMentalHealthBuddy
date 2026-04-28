// server/observability/otelApi.mjs
// ---------------------------------------------------------------------------
// Resilient re-export of @opentelemetry/api.
//
// In production deploy images we have occasionally seen the OpenTelemetry
// packages fail to install or fail to resolve. Because spans.mjs,
// errorHandler.mjs, and observabilityContext.mjs statically import from
// "@opentelemetry/api", a missing package crashed boot before the server
// could call app.listen() — turning observability (a non-essential feature)
// into a hard outage.
//
// This module attempts to load the real @opentelemetry/api at module-eval
// time. If the import fails we export tiny no-op shims that mirror the
// subset of the API actually used in this codebase. Callers do not need to
// know whether OTel is present — span starts, status updates, baggage
// emissions, and context propagation all become safe no-ops.
//
// Surface used by the codebase:
//   trace.getTracer(name).startSpan(name, opts) -> span
//   trace.getActiveSpan() -> span | undefined
//   trace.setSpan(ctx, span) -> ctx
//   context.active() -> ctx
//   context.with(ctx, fn) -> fn()
//   propagation.createBaggage(entries) -> baggage
//   propagation.setBaggage(ctx, baggage) -> ctx
//   span.end() / setAttribute(k,v) / setStatus({code,message}) / recordException(err)
//   SpanStatusCode.OK | ERROR | UNSET
// ---------------------------------------------------------------------------

let _trace;
let _context;
let _propagation;
let _SpanStatusCode;
let _isReal = false;

try {
  const otel = await import("@opentelemetry/api");
  _trace = otel.trace;
  _context = otel.context;
  _propagation = otel.propagation;
  _SpanStatusCode = otel.SpanStatusCode;
  _isReal = true;
} catch (err) {
  console.warn(
    "[otel] @opentelemetry/api unavailable — using no-op shim. Tracing/baggage will be disabled.",
    err?.message || err,
  );

  const NOOP_SPAN = {
    end() {},
    setAttribute() {},
    setAttributes() {},
    setStatus() {},
    recordException() {},
    addEvent() {},
    updateName() {},
    spanContext() {
      return { traceId: "", spanId: "", traceFlags: 0 };
    },
    isRecording() {
      return false;
    },
  };

  const NOOP_CTX = Object.freeze({});

  _trace = {
    getTracer() {
      return {
        startSpan() {
          return NOOP_SPAN;
        },
        startActiveSpan(name, optsOrFn, ctxOrFn, fn) {
          // Mirror the OTel overloads: callable as
          //   startActiveSpan(name, fn)
          //   startActiveSpan(name, opts, fn)
          //   startActiveSpan(name, opts, ctx, fn)
          const cb =
            typeof fn === "function"
              ? fn
              : typeof ctxOrFn === "function"
                ? ctxOrFn
                : typeof optsOrFn === "function"
                  ? optsOrFn
                  : null;
          return cb ? cb(NOOP_SPAN) : undefined;
        },
      };
    },
    getActiveSpan() {
      return undefined;
    },
    setSpan(ctx) {
      return ctx || NOOP_CTX;
    },
    setSpanContext(ctx) {
      return ctx || NOOP_CTX;
    },
    deleteSpan(ctx) {
      return ctx || NOOP_CTX;
    },
  };

  _context = {
    active() {
      return NOOP_CTX;
    },
    with(_ctx, fn) {
      return typeof fn === "function" ? fn() : undefined;
    },
  };

  _propagation = {
    createBaggage(entries) {
      return entries || {};
    },
    setBaggage(ctx) {
      return ctx || NOOP_CTX;
    },
    getBaggage() {
      return undefined;
    },
    deleteBaggage(ctx) {
      return ctx || NOOP_CTX;
    },
  };

  _SpanStatusCode = Object.freeze({ UNSET: 0, OK: 1, ERROR: 2 });
}

export const trace = _trace;
export const context = _context;
export const propagation = _propagation;
export const SpanStatusCode = _SpanStatusCode;
export const otelApiAvailable = _isReal;

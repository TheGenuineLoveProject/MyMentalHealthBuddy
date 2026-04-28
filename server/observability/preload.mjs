// server/observability/preload.mjs
// ---------------------------------------------------------------------------
// Loaded via `node --import ./server/observability/preload.mjs server/app.mjs`
// (workflow + deployment run commands). MUST initialize OpenTelemetry BEFORE
// any other module imports express/http/pg, otherwise auto-instrumentation
// can't patch them.
//
// This file is intentionally tiny — all logic lives in tracing.mjs so it can
// be unit-tested without going through the preload path.
// ---------------------------------------------------------------------------

import { startTracing } from "./tracing.mjs";

// Belt-and-suspenders: tracing.mjs has its own internal try/catch, but if even
// the import itself fails (e.g. dynamic require of a missing peer dep) we must
// NOT abort process boot. Observability is non-essential to user safety.
try {
  const result = startTracing();
  if (result && typeof result.then === "function") {
    result.catch((err) => {
      console.warn("[otel] startTracing() rejected asynchronously:", err?.message || err);
    });
  }
} catch (err) {
  console.warn("[otel] preload failed (continuing without tracing):", err?.message || err);
}

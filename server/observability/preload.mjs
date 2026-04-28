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

// Belt-and-suspenders: tracing.mjs has its own internal try/catch, but if even
// the import itself fails (e.g. missing @opentelemetry/* peer dep in a deploy
// image) we must NOT abort process boot. Observability is non-essential to
// user safety. We use a *dynamic* import wrapped in try/catch so a missing
// module surfaces as a warning instead of an unrecoverable boot crash.
try {
  const { startTracing } = await import("./tracing.mjs");
  const result = startTracing();
  if (result && typeof result.then === "function") {
    result.catch((err) => {
      console.warn("[otel] startTracing() rejected asynchronously:", err?.message || err);
    });
  }
} catch (err) {
  console.warn("[otel] preload skipped (continuing without tracing):", err?.message || err);
}

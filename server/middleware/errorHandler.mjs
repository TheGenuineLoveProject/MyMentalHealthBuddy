import { failWithCode } from "../utils/response.mjs";
import { logger } from "../utils/logger.mjs";
import { alertUncaught } from "../observability/safetyAlerts.mjs";
import { trace, SpanStatusCode } from "@opentelemetry/api";

export function notFoundHandler(_req, res) {
  return failWithCode(res, 404, "Not found", "NOT_FOUND");
}

export function errorHandler(err, req, res, _next) {
  logger.error("Unhandled error", {
    error: err?.message,
    stack: err?.stack,
    requestId: req.requestId,
  });

  // Stamp the active HTTP span as failed so traces visualize the error.
  try {
    const span = trace.getActiveSpan();
    if (span) {
      span.recordException(err);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err?.message || "unhandled",
      });
    }
  } catch {}

  // Fire-and-forget PagerDuty alert. Deduped by class in alerter.
  void alertUncaught({ kind: "http-500", error: err });

  if (res.headersSent) return;
  return failWithCode(res, 500, "Internal server error", "UNHANDLED_ERROR");
}

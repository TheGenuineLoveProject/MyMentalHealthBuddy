import { fail } from "../utils/apiResponse.mjs";
import { logger } from "../utils/logger.mjs";

export function notFoundHandler(_req, res) {
  return fail(res, 404, "Not found", "NOT_FOUND");
}

export function errorHandler(err, req, res, _next) {
  logger.error("Unhandled error", { error: err?.message, stack: err?.stack, requestId: req.requestId });
  if (res.headersSent) return;
  return fail(res, 500, "Internal server error", "UNHANDLED_ERROR");
}

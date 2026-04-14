// server/middleware/requestId.mjs
// Request ID middleware for correlation tracking

import crypto from "crypto";
import { logger } from "../utils/logger.mjs";

export function requestId(req, res, next) {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}

export function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers["user-agent"]?.substring(0, 100),
    };

    if (req.user?.id) {
      logData.userId = req.user.id;
    }

    if (res.statusCode >= 500) {
      logger.error("Request failed", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("Request error", logData);
    } else {
      logger.info("Request completed", logData);
    }
  });

  next();
}

export { logger };

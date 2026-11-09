// server/middleware/requestId.mjs
// Request ID middleware for correlation tracking

import crypto from "crypto";
import { logger } from "../utils/logger.mjs";

export function requestId(req, res, next) {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}

// Only these known literal mounts can contribute a prefix. Express baseUrl
// may contain concrete parameter values on other mounts.
const labeledMounts = new Set([
  "/api/account", "/api/admin", "/api/health", "/api/journal", "/api/integrations",
  "/api/admin/security", "/api/admin/health-deep", "/api/admin/audit-logs", "/api/admin/platform-evolution",
  "/api/admin/social/enterprise",
]);

function logRoute(req, earlyLabel) {
  if (earlyLabel) return earlyLabel;

  // Express supplies the declared route pattern here. Wildcard handlers (such
  // as the SPA shell), regex routes and early failures have no specific label.
  const route = req.route?.path;
  if (typeof route !== "string" || !/^\/(?:[\w:-]+(?:\/[\w:-]+)*)?$/.test(route)) {
    return "[unresolved]";
  }
  if (!req.baseUrl) return route;
  const prefix = labeledMounts.has(req.baseUrl) ? req.baseUrl : "[mounted]";
  return route === "/" ? prefix : prefix + route;
}

export function requestLogger(req, res, next) {
  const startTime = Date.now();
  const method = req.method;
  // This logger is installed at the application root before the route guards.
  // Keep a known static label only, so early denials still identify the endpoint.
  const path = req.path.replace(/\/$/, "");
  const earlyLabel = labeledMounts.has(path) || path === "/api/admin/overview" ? path : undefined;
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId: req.requestId,
      method,
      path: logRoute(req, earlyLabel),
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

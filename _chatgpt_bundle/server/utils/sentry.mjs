// server/utils/sentry.mjs
// Sentry initialization for server-side error tracking

import * as Sentry from "@sentry/node";
import { logger } from "./logger.mjs";

const SENTRY_DSN = process.env.SENTRY_DSN;
const isProduction = process.env.NODE_ENV === "production" || !!process.env.REPLIT_DEPLOYMENT;

export function initSentry(app) {
  if (!SENTRY_DSN) {
    logger.info("Sentry DSN not configured, error tracking disabled");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: isProduction ? "production" : "development",
    release: process.env.npm_package_version || "1.0.0",
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      return event;
    },
  });

  logger.info("Sentry initialized", { environment: isProduction ? "production" : "development" });
}

export function sentryRequestHandler() {
  if (!SENTRY_DSN) {
    return (req, res, next) => next();
  }
  return Sentry.Handlers?.requestHandler?.() || ((req, res, next) => next());
}

export function sentryErrorHandler() {
  if (!SENTRY_DSN) {
    return (err, req, res, next) => next(err);
  }
  return Sentry.Handlers?.errorHandler?.() || ((err, req, res, next) => next(err));
}

export function captureException(error, context = {}) {
  if (!SENTRY_DSN) {
    logger.error("Sentry would capture exception", { error: error.message });
    return;
  }
  
  Sentry.withScope((scope) => {
    if (context.user) {
      scope.setUser({ id: context.user.id, email: context.user.email });
    }
    if (context.requestId) {
      scope.setTag("requestId", context.requestId);
    }
    if (context.extra) {
      scope.setExtras(context.extra);
    }
    Sentry.captureException(error);
  });
}

export function addBreadcrumb(message, category = "default", data = {}) {
  if (!SENTRY_DSN) return;
  
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}

export { Sentry };

export default {
  initSentry,
  sentryRequestHandler,
  sentryErrorHandler,
  captureException,
  addBreadcrumb,
  Sentry,
};

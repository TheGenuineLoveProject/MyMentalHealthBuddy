// client/src/lib/sentry.js
// Sentry initialization for client-side error tracking

import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const isProduction = import.meta.env.PROD;

export function initSentry() {
  if (!SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: isProduction ? "production" : "development",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      return event;
    },
  });

}

export function captureException(error, context = {}) {
  if (!SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context.user) {
      scope.setUser({ id: context.user.id, email: context.user.email });
    }
    if (context.extra) {
      scope.setExtras(context.extra);
    }
    Sentry.captureException(error);
  });
}

export function setUser(user) {
  if (!SENTRY_DSN) return;
  
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email });
  } else {
    Sentry.setUser(null);
  }
}

export function addBreadcrumb(message, category = "ui", data = {}) {
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
  captureException,
  setUser,
  addBreadcrumb,
  Sentry,
};

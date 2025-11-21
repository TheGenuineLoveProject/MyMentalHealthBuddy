import * as Sentry from '@sentry/react';

const isProduction = import.meta.env.PROD;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    
    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: isProduction,
        blockAllMedia: isProduction,
      }),
    ],
    
    // Performance
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/.*\.replit\.dev/,
      /^https:\/\/.*\.repl\.co/,
    ],
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Environment
    environment: isProduction ? 'production' : 'development',
    
    // Filter out performance monitoring noise
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
    
    // Add user context from session
    beforeSend(event, hint) {
      // CRITICAL: Defensive access to hint (can be undefined with manual captureException)
      const exception = hint?.originalException as Error | undefined;
      if (exception?.message?.includes('Failed to fetch')) {
        return null;
      }
      return event;
    },
  });

  console.log('🔒 Sentry monitoring initialized');
} else {
  console.warn('⚠️  VITE_SENTRY_DSN not configured. Error tracking disabled.');
}

export default Sentry;

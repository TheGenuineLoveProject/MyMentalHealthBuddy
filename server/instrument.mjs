/**
 * Sentry Instrumentation - ESM Compatible
 * This file MUST be imported using Node.js --import flag for proper instrumentation
 * 
 * Usage: node --import=./instrument.mjs src/index.ts
 */

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Environment
    environment: process.env.NODE_ENV || 'development',
    // Release tracking
    release: process.env.npm_package_version || '1.0.0',
  });

  console.log('🔒 Sentry instrumentation initialized (ESM)');
} else {
  console.warn('⚠️  SENTRY_DSN not configured. Error tracking disabled.');
}

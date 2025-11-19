import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
const isProduction = process.env.NODE_ENV === 'production';
const sentryDsn = process.env.SENTRY_DSN;
if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        // Performance Monitoring
        tracesSampleRate: isProduction ? 0.1 : 1.0,
        // Profiling
        integrations: [
            nodeProfilingIntegration(),
        ],
        profilesSampleRate: isProduction ? 0.1 : 1.0,
        // Environment & Release tracking
        environment: process.env.NODE_ENV || 'development',
        release: process.env.npm_package_version || '1.0.0',
        // Security: Don't send user IP & headers in production
        sendDefaultPii: !isProduction,
        // Filter out health check errors
        beforeSend(event) {
            if (event.request?.url?.includes('/api/health')) {
                return null;
            }
            return event;
        },
    });
    console.log('🔒 Sentry error tracking initialized');
}
else {
    console.warn('⚠️  SENTRY_DSN not configured. Error tracking disabled.');
}
export default Sentry;

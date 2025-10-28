#!/usr/bin/env node

/**
 * Analytics & Monitoring Setup Script
 * Generates configuration for production monitoring
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📊 Analytics & Monitoring Setup');
console.log('================================\n');

// Analytics configuration template
const analyticsConfig = {
  production: {
    enabled: true,
    providers: {
      // Google Analytics 4
      ga4: {
        enabled: false, // Enable when ready
        measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
        config: {
          send_page_view: true,
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        }
      },
      
      // Plausible Analytics (Privacy-friendly alternative)
      plausible: {
        enabled: false,
        domain: 'mymentalhealthbuddy.com',
        apiHost: 'https://plausible.io'
      },
      
      // PostHog (Product analytics)
      posthog: {
        enabled: false,
        apiKey: 'phc_XXXXXXXXXX',
        apiHost: 'https://app.posthog.com',
        options: {
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: false // Manual event tracking for privacy
        }
      },
      
      // Sentry (Error tracking)
      sentry: {
        enabled: false,
        dsn: 'https://XXXXXXXXXX@sentry.io/XXXXXXX',
        environment: 'production',
        tracesSampleRate: 0.1, // 10% of transactions
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0
      },
      
      // LogRocket (Session replay)
      logrocket: {
        enabled: false,
        appId: 'xxxxxx/mymentalhealthbuddy',
        sanitizer: true // Sanitize sensitive data
      }
    },
    
    // Custom event tracking
    events: {
      pageViews: true,
      userActions: true,
      errorTracking: true,
      performanceMetrics: true
    },
    
    // Privacy settings
    privacy: {
      anonymizeIp: true,
      respectDoNotTrack: true,
      cookieConsent: true,
      dataRetention: 90 // days
    }
  },
  
  development: {
    enabled: false,
    providers: {}
  }
};

// Performance monitoring configuration
const performanceConfig = {
  // Web Vitals tracking
  webVitals: {
    enabled: true,
    metrics: ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'],
    reportingThreshold: 1000 // ms
  },
  
  // Custom performance marks
  customMarks: [
    'app-initialized',
    'user-authenticated',
    'data-loaded',
    'ui-interactive'
  ],
  
  // Resource timing
  resourceTiming: {
    enabled: true,
    threshold: 100 // Report resources over 100ms
  },
  
  // Long tasks
  longTasks: {
    enabled: true,
    threshold: 50 // Report tasks over 50ms
  }
};

// Write configuration files
const configDir = path.join(__dirname, '..', 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(
  path.join(configDir, 'analytics.json'),
  JSON.stringify(analyticsConfig, null, 2)
);

fs.writeFileSync(
  path.join(configDir, 'performance.json'),
  JSON.stringify(performanceConfig, null, 2)
);

console.log('✅ Analytics configuration created: config/analytics.json');
console.log('✅ Performance configuration created: config/performance.json\n');

console.log('📝 Next Steps:');
console.log('----------------------------------');
console.log('1. Choose your analytics provider(s)');
console.log('2. Add your API keys to config/analytics.json');
console.log('3. Set enabled: true for your chosen providers');
console.log('4. Implement cookie consent banner');
console.log('5. Test in development before production\n');

console.log('🔒 Privacy Recommendations:');
console.log('----------------------------------');
console.log('✓ IP anonymization enabled by default');
console.log('✓ Respect Do Not Track enabled');
console.log('✓ Cookie consent required');
console.log('✓ 90-day data retention');
console.log('✓ No sensitive data tracking\n');

console.log('🎉 Setup complete!');
console.log('================================\n');

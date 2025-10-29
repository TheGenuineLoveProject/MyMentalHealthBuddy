# Observability & Monitoring Integration Guide

## Overview

MyMentalHealthBuddy includes comprehensive observability infrastructure with production-ready endpoints for error tracking, performance monitoring, and analytics. This guide shows you how to integrate with external monitoring services.

## Current Implementation Status

✅ **Fully Implemented:**
- Frontend error capture and reporting
- Web Vitals performance monitoring (LCP, INP, CLS, FCP, TTFB)
- Backend endpoints: `/api/errors`, `/api/performance`, `/api/health`, `/api/monitoring/stats`
- Automatic error boundary integration
- Real-time performance tracking with sendBeacon API

🔄 **Ready for External Integration:**
- Error tracking service (Sentry, DataDog, LogRocket)
- Analytics platform (Google Analytics, PostHog, Plausible)

---

## Error Tracking Integration

### Option 1: Sentry (Recommended)

**Free Tier:** 5,000 errors/month

**Setup Steps:**

1. **Sign up at [sentry.io](https://sentry.io)**

2. **Install Sentry SDK:**
```bash
npm install @sentry/react @sentry/vite-plugin
```

3. **Add to `apps/server/src/routes.ts`** (line 821):
```typescript
import * as Sentry from '@sentry/node';

// In the /api/errors endpoint:
app.post("/api/errors", asyncHandler(async (req, res) => {
  const errorData = Sanitizer.sanitizeObject(req.body);
  
  // Forward to Sentry
  Sentry.captureException(new Error(errorData.message), {
    extra: {
      stack: errorData.stack,
      url: errorData.url,
      userAgent: errorData.userAgent,
      timestamp: errorData.timestamp,
      context: errorData.context
    }
  });
  
  res.status(200).json({ success: true });
}));
```

4. **Add environment variable:**
```bash
# Add to Replit Secrets
SENTRY_DSN=your_sentry_dsn_here
```

5. **Initialize in `apps/server/src/index.ts`:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});
```

### Option 2: DataDog

**Setup Steps:**

1. Install: `npm install dd-trace`
2. Add API key to environment variables
3. Update `/api/errors` endpoint with DataDog logger

### Option 3: LogRocket

**Setup Steps:**

1. Install: `npm install logrocket`
2. Initialize in frontend and backend
3. Captures session recordings + errors

---

## Performance Analytics Integration

### Option 1: Google Analytics 4

**Free & Unlimited**

**Setup Steps:**

1. **Create GA4 property at [analytics.google.com](https://analytics.google.com)**

2. **Add tracking script to `apps/client/index.html`:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. **Web Vitals are automatically sent** via the existing `performance.ts` implementation (line 86-93)

4. **Add measurement ID to environment:**
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Option 2: PostHog (Open Source)

**Free Tier:** 1M events/month

**Setup Steps:**

1. **Sign up at [posthog.com](https://posthog.com)**

2. **Install SDK:**
```bash
npm install posthog-js
```

3. **Update `apps/client/src/lib/performance.ts`** (after line 93):
```typescript
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init('YOUR_PROJECT_API_KEY', {
  api_host: 'https://app.posthog.com'
});

// In reportMetric function:
posthog.capture('web_vitals', {
  metric_name: metric.name,
  value: metric.value,
  rating: metric.rating,
  page: window.location.pathname
});
```

### Option 3: Plausible Analytics (Privacy-First)

**Setup Steps:**

1. Sign up at [plausible.io](https://plausible.io)
2. Add script tag to `index.html`
3. Use Plausible events API for Web Vitals

---

## Backend Endpoint Reference

### POST `/api/errors`

**Purpose:** Receive frontend error reports

**Request Body:**
```json
{
  "message": "Error message",
  "stack": "Stack trace",
  "url": "https://app.example.com/page",
  "timestamp": "2025-10-29T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "context": {
    "user": { "id": "123" },
    "tags": { "severity": "error" }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Error logged successfully",
  "errorId": "err_1234567890_abc123"
}
```

**Current Behavior:**
- Development: Logs to console with emoji 📊
- Production: Ready for external service integration

---

### POST `/api/performance`

**Purpose:** Receive Web Vitals and performance metrics

**Request Body:**
```json
{
  "metrics": {
    "LCP": { "value": 1250, "rating": "good" },
    "INP": { "value": 85, "rating": "good" },
    "CLS": { "value": 0.05, "rating": "good" }
  },
  "page": "/dashboard",
  "timestamp": "2025-10-29T12:00:00.000Z",
  "userAgent": "Mozilla/5.0..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Metrics logged successfully"
}
```

**Current Behavior:**
- Development: Logs to console with emoji 📈
- Production: Ready for analytics integration
- Uses `navigator.sendBeacon` for reliability

---

### GET `/api/health`

**Purpose:** Health check endpoint for uptime monitoring

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-29T12:00:00.000Z",
  "uptime": 123456,
  "environment": "production"
}
```

**Use Cases:**
- Uptime monitoring (UptimeRobot, Pingdom, StatusCake)
- Load balancer health checks
- CI/CD deployment validation

---

### GET `/api/monitoring/stats`

**Purpose:** Real-time monitoring dashboard data

**Response:**
```json
{
  "errors": {
    "total": 0,
    "last24h": 0,
    "criticalCount": 0
  },
  "performance": {
    "avgLCP": 0,
    "avgINP": 0,
    "avgCLS": 0,
    "avgFCP": 0,
    "avgTTFB": 0
  },
  "uptime": 123456,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Future Enhancement:**
- Store metrics in database
- Query aggregated statistics
- Display in internal monitoring dashboard

---

## Quick Start Recommendations

### Minimal Setup (100% Free)

1. **Error Tracking:** Sentry Free Tier (5K errors/month)
2. **Analytics:** Google Analytics 4 (unlimited)
3. **Uptime:** UptimeRobot (50 monitors free)

**Total Cost:** $0/month  
**Setup Time:** 15 minutes

### Professional Setup

1. **Error Tracking:** Sentry Team Plan ($26/month)
2. **Analytics:** PostHog ($0-450/month based on usage)
3. **Session Replay:** LogRocket ($99/month)
4. **Uptime:** Pingdom ($10/month)

**Total Cost:** ~$135-585/month  
**Setup Time:** 1-2 hours

---

## Environment Variables Reference

Add these to your Replit Secrets:

```bash
# Error Tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxx

# Monitoring
UPTIME_ROBOT_API_KEY=xxx
```

---

## Testing Your Integration

### 1. Test Error Tracking

Open browser console and run:
```javascript
throw new Error('Test error from frontend');
```

Check your error tracking service dashboard (Sentry, DataDog, etc.)

### 2. Test Performance Monitoring

1. Open DevTools → Network tab
2. Reload the page
3. Check for POST requests to `/api/performance`
4. Verify metrics appear in analytics dashboard

### 3. Test Health Endpoint

```bash
curl https://your-app.repl.co/api/health
```

---

## Best Practices

1. **Rate Limiting:** Error/performance endpoints have built-in rate limiting to prevent abuse

2. **Privacy:** All user-identifying information is sanitized before logging

3. **Performance:** Uses `navigator.sendBeacon` for non-blocking metric submission

4. **Reliability:** Automatic retry logic for failed requests (via offline manager)

5. **Development vs Production:**
   - Development: All metrics logged to console
   - Production: Sent to external services only

---

## Troubleshooting

### Metrics Not Appearing in Dashboard

1. Check browser console for network errors
2. Verify environment variables are set correctly
3. Check external service API key permissions
4. Review rate limiting (max 100 requests/minute per IP)

### High Error Volume

1. Review error patterns in monitoring dashboard
2. Check for client-side JavaScript errors
3. Verify API endpoint responses
4. Enable source maps for better stack traces

---

## Support

For integration help:
- Sentry Docs: https://docs.sentry.io
- GA4 Docs: https://developers.google.com/analytics
- PostHog Docs: https://posthog.com/docs

---

**Last Updated:** October 29, 2025  
**Platform Version:** 1.0.0  
**Status:** Production Ready ✅

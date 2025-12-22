# The Genuine Love Project - Production Launch Checklist

## Pre-Launch Verification

### 1. Environment Secrets (Required)

Verify all required secrets are set in Replit Secrets:

| Secret | Required | Purpose |
|--------|----------|---------|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `SESSION_SECRET` | **Yes** | Session encryption (min 32 chars) |
| `OPENAI_API_KEY` | **Yes** | AI therapy features |
| `STRIPE_SECRET_KEY` | **Yes** | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | Webhook signature verification |
| `STRIPE_PRICE_PRO` | Yes | Pro plan price ID |
| `STRIPE_PRICE_BASIC` | Optional | Basic plan price ID |
| `CORS_ORIGIN` | Yes | Production domain (e.g., `https://yourdomain.com`) |
| `SENTRY_DSN` | Optional | Error tracking |

### 2. Database Preparation

```bash
# Push any pending schema changes
npm run db:push

# Verify database connectivity
curl https://YOUR_DOMAIN/api/health/detailed
```

Expected response:
```json
{"status":"ok","ready":true,"checks":{"db":{"ok":true}}}
```

### 3. Build Verification

```bash
# Create production build
npm run build

# Verify dist folder exists
ls -la client/dist/
```

---

## Replit Deploy Configuration

### Build Command
```
npm run build
```

### Run Command
```
node server/index.mjs
```

### Environment Variables for Deployment
- All secrets from development are automatically copied
- Verify `NODE_ENV` is set to `production` in deployment

---

## Security Checklist

- [x] **Helmet.js** enabled with security headers
- [x] **CORS** configured with explicit origin in production
- [x] **Rate limiting** on all endpoints (120/min general, 10/15min auth, 20/min AI)
- [x] **Session cookies** hardened (`httpOnly`, `secure`, `sameSite`)
- [x] **CSP headers** configured
- [x] **Input sanitization** on all request bodies
- [x] **XSS protection** headers enabled
- [x] **Graceful shutdown** handlers for SIGTERM/SIGINT

---

## Endpoint Verification

After deployment, verify critical endpoints:

```bash
# Health check
curl https://YOUR_DOMAIN/api/health
# Expected: {"status":"healthy","database":{"connected":true}}

# Readiness probe
curl https://YOUR_DOMAIN/api/health/ready
# Expected: {"status":"ready"}

# Liveness probe
curl https://YOUR_DOMAIN/api/health/live
# Expected: {"status":"alive","uptime":...}

# Metrics
curl https://YOUR_DOMAIN/api/health/metrics
# Expected: {"status":"ok","version":"2.0.0",...}
```

---

## Stripe Webhook Configuration

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Post-Launch Monitoring

### Health Monitoring
- Set up uptime monitoring for `/api/health`
- Configure alerts for 5xx error rates
- Monitor `/api/health/metrics` for memory usage

### Error Tracking
- Verify Sentry errors appear in dashboard
- Set up error alerts for critical issues

### Performance
- Monitor response times via Sentry APM
- Watch database connection pool health

---

## Rollback Plan

If issues arise after deployment:

1. **Quick fix**: Use Replit Checkpoints to rollback code
2. **Database**: Checkpoints include database state
3. **Secrets**: Re-verify all environment variables

---

## Launch Day Commands

```bash
# Final build
npm run build

# Verify health locally
curl localhost:5000/api/health

# Deploy via Replit Publish button
# Select "Autoscale" deployment type
```

---

## Contact & Support

- **Crisis Resources**: Always available at `/crisis`
- **Disclaimer**: Displayed during onboarding
- **Terms**: `/terms`
- **Privacy**: `/privacy`

---

**Tagline**: Live in Genuine Love

*Last updated: December 2025*

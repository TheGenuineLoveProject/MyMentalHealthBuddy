# 🚀 Deployment Guide - MyMentalHealthBuddy

## Production Deployment Checklist

### 1. Environment Variables Configuration

#### Required Secrets (Add to Replit Secrets)

**Core Application:**
```bash
# Database (automatically provided by Replit PostgreSQL)
DATABASE_URL=postgresql://...

# Session Security
SESSION_SECRET=<generate-random-32-character-string>

# Server Configuration
NODE_ENV=production
PORT=5000
```

**OpenAI Integration:**
```bash
OPENAI_API_KEY=sk-...
```

**Stripe Payment Processing:**
```bash
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Optional but recommended for production
```

**Canva Visual Design Integration (Optional):**
```bash
CANVA_CLIENT_ID=your_client_id
CANVA_CLIENT_SECRET=your_client_secret
CANVA_REDIRECT_URI=https://yourdomain.com/api/canva/callback
```

### 2. Pre-Deployment Configuration

#### A. Fix Port Forwarding (.replit file)

**CRITICAL:** Replit Autoscale only supports ONE external port.

Edit your `.replit` file and remove all `[[ports]]` sections except one:

```toml
# Keep ONLY this port configuration:
[[ports]]
localPort = 5000
externalPort = 80

# DELETE all other [[ports]] sections
```

#### B. Verify Deployment Configuration

The deployment settings are already configured via `deploy_config_tool`:

```toml
[deployment]
deploymentTarget = "autoscale"
run = ["npm", "start"]
build = ["npm", "run", "build"]
```

### 3. Build Process

The production build process:

```bash
# 1. Build client (Vite production build)
npm --prefix apps/client run build

# 2. Build server (TypeScript compilation)
npm --prefix apps/server run build

# Combined command (used by deployment):
npm run build
```

**Build outputs:**
- Client: `apps/client/dist/` (bundled HTML, CSS, JS with gzip/brotli compression)
- Server: `dist/apps/server/` (compiled TypeScript)

### 4. Production Start Command

```bash
npm start
# Runs: cross-env PORT=5000 NODE_ENV=production node dist/apps/server/src/index.js
```

### 5. Database Migration

**Before first deployment:**

```bash
# Push schema to production database
npm run db:push

# If you get data-loss warnings:
npm run db:push --force
```

### 6. Health Check Endpoint

The application includes a health check at `/health`:

```json
{
  "ok": true,
  "service": "MyMentalHealthBuddy API",
  "timestamp": "2025-10-28T...",
  "uptime": 3600,
  "memory": {
    "used": 45,
    "total": 128,
    "unit": "MB"
  }
}
```

### 7. Performance Optimizations (Already Configured)

✅ **Build Optimizations:**
- Gzip + Brotli compression
- Code splitting (React, Query, Router, UI chunks)
- Tree shaking enabled
- CSS minification
- Asset optimization (4KB inline threshold)
- Module preload polyfill

✅ **Server Optimizations:**
- Compression middleware
- Static asset caching (1 year for immutable assets)
- HTML cache prevention (no-cache headers)
- Graceful shutdown handlers
- Request/error logging

✅ **Security:**
- Helmet.js security headers
- CORS configuration
- Request size limits (10MB)
- Input validation
- XSS protection

### 8. Monitoring & Logging

**Production logs include:**
- Request logging with duration and status
- Error tracking with stack traces
- Unhandled promise rejection handlers
- Uncaught exception handlers
- Memory usage monitoring

**Access logs via Replit:**
- View logs in the Replit deployment dashboard
- Monitor health endpoint for uptime

### 9. Stripe Webhook Configuration

**After deployment:**

1. Get your production URL: `https://your-repl-name.repl.co`
2. Go to Stripe Dashboard → Developers → Webhooks
3. Add endpoint: `https://your-repl-name.repl.co/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 10. Canva OAuth Configuration

**If using Canva integration:**

1. Go to Canva Developers Console
2. Update redirect URI to: `https://your-repl-name.repl.co/api/canva/callback`
3. Verify `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REDIRECT_URI` in secrets

### 11. Deployment Steps

1. **Configure Environment Variables** (Replit Secrets panel)
2. **Fix .replit port configuration** (remove extra ports)
3. **Run Database Migration** (`npm run db:push`)
4. **Click "Publish" in Replit**
5. **Select Autoscale deployment**
6. **Configure machine size** (2GB RAM recommended minimum)
7. **Set max instances** (scale based on expected traffic)
8. **Deploy!**

### 12. Post-Deployment Verification

```bash
# 1. Check health endpoint
curl https://your-repl-name.repl.co/health

# 2. Test API endpoints
curl https://your-repl-name.repl.co/api/crisis-resources

# 3. Verify Stripe integration
# Visit /billing page and test checkout

# 4. Test Canva integration (if enabled)
# Visit /designs page and connect to Canva
```

### 13. Custom Domain (Optional)

1. Go to Replit deployment settings
2. Click "Add Custom Domain"
3. Follow DNS configuration instructions
4. Update `CANVA_REDIRECT_URI` if using Canva

### 14. Known Issues & Limitations

#### 🔴 CRITICAL SECURITY ISSUE

**Authentication Vulnerability:**
- Current implementation uses client-controlled `x-user-id` header
- **NOT PRODUCTION-READY** - any user can impersonate others
- **Required before production:** Implement proper session-based or JWT authentication

**Impact:** Affects all protected endpoints (Stripe, Canva, user data)

**Remediation:** 
- Implement real authentication system
- Replace x-user-id header with session validation
- Add comprehensive integration tests

#### Other Considerations:

- **Rate Limiting:** Currently not enforced on all endpoints
- **Token Refresh:** Canva token auto-refresh not yet implemented
- **Design Persistence:** Canva designs not saved to database yet
- **Webhook Idempotency:** Stripe webhook events need idempotency handling

### 15. Scaling Considerations

**Autoscale Configuration:**
- Min instances: 0 (scales to zero when idle)
- Max instances: Set based on budget (e.g., 5 instances)
- CPU: 1-2 vCPU recommended
- RAM: 2-4 GB recommended

**Database:**
- Replit PostgreSQL (Neon) auto-scales
- Connection pooling already configured

**Traffic Estimates:**
- ~100 concurrent users per 2GB instance
- Scale horizontally with Autoscale

### 16. Cost Optimization

**Recommendations:**
- Use Autoscale (pay for actual usage)
- Set reasonable max instances limit
- Monitor usage in Replit dashboard
- Enable scale-to-zero for low traffic periods

### 17. Rollback Strategy

**If deployment fails:**

1. Replit provides automatic rollback capability
2. Access via Replit dashboard → Rollback tab
3. Select previous checkpoint
4. Restore code + database state

### 18. Support & Documentation

- **Replit Docs:** https://docs.replit.com/
- **Stripe Docs:** https://stripe.com/docs
- **Canva Connect Docs:** https://www.canva.com/developers/docs/connect/
- **OpenAI Docs:** https://platform.openai.com/docs

---

## Quick Deployment Command Reference

```bash
# Local build test
npm run build

# Database migration
npm run db:push

# Production start (for testing)
npm start

# Analyze bundle size
ANALYZE=true npm run build
# View: apps/client/dist/stats.html

# Database studio (local development)
npm run db:studio
```

---

## Production Ready Status

✅ **Completed:**
- Build configuration and optimization
- Production scripts
- Environment validation
- Health checks
- Error handling
- Logging infrastructure
- Security middleware
- Database schema
- Stripe integration
- Canva integration
- SEO optimization

🔴 **Blockers (Pre-Production):**
- Authentication system (replace x-user-id header)
- Webhook signature verification
- Stripe webhook event processing
- Canva token auto-refresh
- Comprehensive integration tests

⚠️ **Recommended (Pre-Production):**
- Add rate limiting to all endpoints
- Implement proper session management
- Add monitoring/alerting (e.g., Sentry)
- Configure CSP headers properly
- Add automated E2E tests
- Set up CI/CD pipeline
- Create backup/restore procedures

---

**Last Updated:** October 28, 2025  
**Version:** 1.1.0  
**Deployment Target:** Replit Autoscale

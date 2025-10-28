# ✅ Production Deployment Checklist

## Pre-Deployment (Complete Before Publishing)

### Environment Configuration
- [ ] **Set SESSION_SECRET** in Replit Secrets (minimum 32 characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] **Set DATABASE_URL** (auto-provided by Replit PostgreSQL)
- [ ] **Set OPENAI_API_KEY** for AI chat features
- [ ] **Set STRIPE_SECRET_KEY** for billing (use live key: `sk_live_...`)
- [ ] **Set VITE_STRIPE_PUBLIC_KEY** for billing (use live key: `pk_live_...`)
- [ ] **Set STRIPE_WEBHOOK_SECRET** (recommended, from Stripe dashboard)
- [ ] **Set NODE_ENV=production** in Replit deployment settings

### Optional Integrations
- [ ] **Set CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, CANVA_REDIRECT_URI** if using design features
- [ ] Update `CANVA_REDIRECT_URI` to production URL: `https://your-app.repl.co/api/canva/callback`

### Configuration Files
- [ ] **Fix .replit file** - Remove extra `[[ports]]` sections, keep only:
  ```toml
  [[ports]]
  localPort = 5000
  externalPort = 80
  ```
- [ ] **Verify deployment section** in .replit:
  ```toml
  [deployment]
  deploymentTarget = "autoscale"
  run = ["npm", "start"]
  build = ["npm", "run", "build"]
  ```

### Database
- [ ] **Run database migration**: `npm run db:push`
- [ ] **Verify database connection** in Replit PostgreSQL panel
- [ ] **Backup database** if migrating from development (optional)

### Testing
- [ ] **Run production check**: `npm run production-check`
- [ ] **Test build locally**: `npm run build`
- [ ] **Test production start** (optional): `npm start`
- [ ] **Check bundle size**: `npm run build:analyze` → view `apps/client/dist/stats.html`

### Third-Party Services
- [ ] **Stripe webhook configuration**:
  - Add webhook endpoint: `https://your-app.repl.co/api/stripe/webhook`
  - Select events: checkout.session.completed, customer.subscription.*, invoice.payment_*
  - Copy webhook secret to STRIPE_WEBHOOK_SECRET
- [ ] **OpenAI API key** has sufficient credits
- [ ] **Canva OAuth app** (if using) configured with production redirect URI

### Security Review
- [ ] Review CORS settings for production domain
- [ ] Verify Helmet security headers are enabled
- [ ] Check rate limiting is appropriate
- [ ] Ensure no debug logs expose sensitive data
- [ ] **KNOWN ISSUE**: x-user-id authentication vulnerability documented (see replit.md)

---

## Deployment Steps

### 1. Pre-Flight Check
```bash
npm run production-check
```
✅ All checks should pass (or show only warnings)

### 2. Build Test
```bash
npm run build
```
✅ Should complete without errors

### 3. Database Migration
```bash
npm run db:push
# If warnings about data loss:
npm run db:push --force
```

### 4. Publish in Replit
1. Click **"Publish"** button in Replit
2. Select **"Autoscale"** deployment
3. Configure resources:
   - **CPU**: 1-2 vCPU
   - **RAM**: 2-4 GB (2GB minimum recommended)
   - **Max Instances**: 5 (adjust based on expected traffic)
4. Verify environment variables are set
5. Click **"Deploy"**

### 5. Post-Deployment Verification
```bash
# Check health endpoint
curl https://your-app.repl.co/health

# Expected response:
# {"ok":true,"service":"MyMentalHealthBuddy API",...}

# Test API
curl https://your-app.repl.co/api/crisis-resources
```

### 6. Configure Webhooks
- **Stripe**: Add webhook endpoint with production URL
- **Canva**: Update OAuth redirect URI to production URL

### 7. Smoke Testing
- [ ] Visit homepage - loads correctly
- [ ] Navigate to /chat - AI chat works
- [ ] Navigate to /mood - mood tracking works
- [ ] Navigate to /journal - journaling works
- [ ] Navigate to /billing - subscription plans display
- [ ] Navigate to /designs - Canva integration works (if configured)
- [ ] Test signup/login flow (when authentication added)
- [ ] Submit test payment (Stripe test mode)

---

## Post-Deployment

### Monitoring
- [ ] Check Replit deployment logs for errors
- [ ] Monitor /health endpoint for uptime
- [ ] Watch for application errors in logs
- [ ] Monitor Stripe dashboard for webhook failures

### Performance
- [ ] Test page load times (aim for <3 seconds)
- [ ] Check Time to First Byte (TTFB)
- [ ] Verify compression is working (check response headers)
- [ ] Test on mobile devices

### DNS & Domain (Optional)
- [ ] Configure custom domain in Replit
- [ ] Update DNS records
- [ ] Verify SSL certificate
- [ ] Update CANVA_REDIRECT_URI if using custom domain

### Documentation
- [ ] Update README with production URL
- [ ] Document any deployment issues encountered
- [ ] Update replit.md with deployment date

---

## Troubleshooting

### Build Fails
1. Check Node.js version (should be 20.x)
2. Clear dist folders: `rm -rf dist apps/client/dist`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Try build again: `npm run build`

### Deployment Fails
- **"Port already in use"**: Remove extra [[ports]] from .replit
- **"Environment validation failed"**: Check all required env vars are set
- **"Build command failed"**: Test build locally first
- **"Database connection failed"**: Verify DATABASE_URL is set

### Application Errors
- **500 errors**: Check logs in Replit deployment panel
- **Database errors**: Verify migration ran successfully
- **Stripe errors**: Check API keys are correct (live vs test)
- **OpenAI errors**: Verify API key and check credits

### Performance Issues
- **Slow loading**: Check bundle size with `npm run build:analyze`
- **High memory**: Increase RAM in deployment settings
- **Timeout errors**: Increase autoscale instances

---

## Rollback Procedure

If deployment fails or introduces critical bugs:

1. **Immediate**: Stop accepting new traffic (Replit dashboard)
2. **Revert**: Use Replit Rollback feature
   - Go to Rollback tab in Replit
   - Select previous checkpoint
   - Restore code + database
3. **Investigate**: Review logs to identify issue
4. **Fix**: Address problems in development
5. **Redeploy**: Follow checklist again

---

## Security Hardening (Recommended Before Production)

### Critical
- [ ] **Replace x-user-id authentication** with proper session/JWT auth
- [ ] Add STRIPE_WEBHOOK_SECRET and enforce signature verification
- [ ] Implement webhook idempotency handling
- [ ] Add CSRF protection

### Recommended
- [ ] Configure Content Security Policy (CSP) headers
- [ ] Add rate limiting to all endpoints (not just some)
- [ ] Implement request logging to external service (e.g., Datadog, Sentry)
- [ ] Set up error monitoring and alerting
- [ ] Add database connection pooling limits
- [ ] Implement API key rotation policy

### Best Practices
- [ ] Add comprehensive integration tests
- [ ] Set up CI/CD pipeline
- [ ] Create staging environment
- [ ] Document incident response procedures
- [ ] Set up automated backups
- [ ] Create disaster recovery plan

---

## Cost Optimization

### Monitor Usage
- [ ] Track Replit instance hours
- [ ] Monitor OpenAI API usage
- [ ] Review Stripe transaction fees
- [ ] Check database storage size

### Optimize
- [ ] Set appropriate autoscale min/max instances
- [ ] Enable scale-to-zero for low-traffic periods
- [ ] Optimize database queries
- [ ] Cache frequently accessed data
- [ ] Compress large responses

### Budget Alerts
- [ ] Set up cost alerts in Replit
- [ ] Monitor OpenAI spending limits
- [ ] Track monthly costs

---

## Success Metrics

### Performance Targets
- ✅ Page load time: < 3 seconds
- ✅ API response time: < 500ms (p95)
- ✅ Uptime: > 99.5%
- ✅ Error rate: < 1%

### Business Metrics
- Track user signups
- Monitor subscription conversions
- Measure feature adoption
- Track support requests

---

## Quick Reference

```bash
# Run production readiness check
npm run production-check

# Build for production
npm run build

# Analyze bundle size
npm run build:analyze

# Test production start
npm start

# Database migration
npm run db:push

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check health
curl https://your-app.repl.co/health
```

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Production URL:** _________________  
**Rollback Plan:** ✅ Documented Above  

---

**Last Updated:** October 28, 2025  
**Version:** 1.1.0  
**Status:** Ready for Production (pending authentication fix)

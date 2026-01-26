# Launch Checklist

## Pre-Launch Verification

### Environment Configuration
- [ ] All required environment variables set in production
- [ ] DATABASE_URL points to production database
- [ ] STRIPE_SECRET_KEY is production key (not test)
- [ ] STRIPE_WEBHOOK_SECRET is production webhook secret
- [ ] OPENAI_API_KEY has appropriate rate limits
- [ ] SESSION_SECRET/JWT_SECRET are strong, unique values
- [ ] CORS_ORIGIN set to production domain

### Database
- [ ] Production database created and accessible
- [ ] Schema migrations applied (`npm run db:push`)
- [ ] Database backups configured
- [ ] Connection pooling appropriate for expected load

### Security
- [ ] HTTPS only (no HTTP)
- [ ] Security headers verified (Helmet)
- [ ] CSP configured appropriately
- [ ] Rate limiting enabled
- [ ] Admin routes protected
- [ ] No secrets in logs or error messages

### Authentication
- [ ] Registration flow works
- [ ] Login flow works
- [ ] Password reset flow works
- [ ] Admin access restricted to authorized users
- [ ] Session expiration working correctly

### Payments (Stripe)
- [ ] Stripe webhook configured for production
- [ ] Webhook signature verification enabled
- [ ] Test subscription flow end-to-end
- [ ] Verify plan gating works
- [ ] Customer portal accessible

### AI Features
- [ ] OpenAI integration working
- [ ] Crisis detection active
- [ ] Disclaimers displayed
- [ ] Rate limiting on AI endpoints
- [ ] Cost monitoring in place

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Health endpoint accessible (/api/health)
- [ ] Uptime monitoring configured
- [ ] Log aggregation working
- [ ] Alerting for critical errors

### Legal & Compliance
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Disclaimer visible to users
- [ ] Age verification (18+) in place
- [ ] Cookie consent (if applicable)
- [ ] GDPR compliance verified

### Performance
- [ ] Build optimized for production
- [ ] Assets minified and compressed
- [ ] CDN configured (if applicable)
- [ ] Response times acceptable (<500ms)
- [ ] Load testing completed

### Content
- [ ] All placeholder content replaced
- [ ] Links working correctly
- [ ] Images optimized
- [ ] Mobile responsive verified
- [ ] Accessibility audit passed

## Post-Launch

### Day 1
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Verify AI responses appropriate
- [ ] Review user feedback channels

### Week 1
- [ ] Review analytics
- [ ] Address any reported issues
- [ ] Monitor server resources
- [ ] Verify backup restores work

---

*Last updated: January 2026*

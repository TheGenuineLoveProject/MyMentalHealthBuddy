# Security Review Checklist

## Quarterly Review

### Authentication & Authorization
- [ ] Password hashing uses bcrypt with cost ≥ 10
- [ ] Session tokens are secure random
- [ ] Session expiry is configured
- [ ] RBAC middleware on protected routes
- [ ] Rate limiting on auth endpoints
- [ ] Brute force protection active

### Input Validation
- [ ] Zod validation on all API inputs
- [ ] SQL injection protected (Drizzle ORM)
- [ ] XSS protection (React escaping)
- [ ] File upload restrictions (if applicable)

### Secrets Management
- [ ] No secrets in code/git
- [ ] .env.example up to date
- [ ] Secrets stored in Replit Secrets
- [ ] API keys scoped to minimum permissions

### Headers & Transport
- [ ] HTTPS enforced
- [ ] Helmet middleware active
- [ ] CORS configured correctly
- [ ] Cookie flags (httpOnly, secure, sameSite)

### Dependencies
- [ ] npm audit run (no critical vulnerabilities)
- [ ] Dependencies up to date (within reason)
- [ ] Lockfile committed

### Data Protection
- [ ] PII logged with redaction
- [ ] Audit logs for sensitive actions
- [ ] Data export/delete capability exists
- [ ] Backup strategy documented

### AI Safety
- [ ] Crisis detection active
- [ ] Prompt injection hardening
- [ ] Non-diagnostic boundaries
- [ ] Rate limits on AI endpoints
- [ ] AI interactions audited

### Third-Party Integrations
- [ ] Stripe webhook signature verification
- [ ] OAuth state parameter checked
- [ ] External API error handling

## Automated Checks

```bash
# Dependency vulnerabilities
npm audit

# Secrets in code
git secrets --scan  # if configured

# Content compliance
npm run content-check
```

## Review Schedule

| Review Type | Frequency |
|-------------|-----------|
| Full security review | Quarterly |
| Dependency audit | Monthly |
| Access review | Quarterly |
| Incident review | As needed |

## Issue Tracking

| Issue | Severity | Status | Due |
|-------|----------|--------|-----|
| — | — | No open issues | — |

## Sign-off

| Reviewer | Date | Notes |
|----------|------|-------|
| — | — | Quarterly review pending |

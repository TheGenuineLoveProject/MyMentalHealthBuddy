# Disaster Recovery

## Overview

Procedures for recovering from various failure scenarios.

## Recovery Time Objectives

| Scenario | RTO | RPO |
|----------|-----|-----|
| App crash | < 5 min | 0 |
| Database issue | < 15 min | < 1 hour |
| Full outage | < 1 hour | < 1 hour |

## Scenarios

### 1. Application Crash

**Symptoms:** 5xx errors, app unresponsive

**Recovery:**
1. Check Replit deployment status
2. Review error logs: `node scripts/scan.mjs`
3. Restart workflow
4. If persistent, rollback to last known good commit

### 2. Database Connection Failure

**Symptoms:** DB timeout errors, data not saving

**Recovery:**
1. Check Neon dashboard status
2. Verify DATABASE_URL in secrets
3. Test connection: `npm run db:push` (dry run)
4. If Neon issue, wait for their status update

### 3. Authentication Issues

**Symptoms:** Users can't login

**Recovery:**
1. Check SESSION_SECRET is set
2. Verify JWT_SECRET is set
3. Clear any corrupted sessions
4. Check Replit Auth integration status

### 4. Stripe Webhook Failures

**Symptoms:** Subscriptions not syncing

**Recovery:**
1. Check Stripe dashboard for failed webhooks
2. Verify STRIPE_WEBHOOK_SECRET
3. Manually replay failed events
4. Check webhook endpoint logs

### 5. Full Platform Outage

**Recovery:**
1. Communicate with users (status page if available)
2. Identify root cause via logs
3. Fix or rollback as needed
4. Run verification: `node scripts/verify.mjs`
5. Post-incident review

## Backup Strategy

### Database (Neon)
- Automatic backups by Neon
- Point-in-time recovery available
- Manual export for critical data

### Code
- Git repository with full history
- Checkpoints in Replit
- Tag releases for easy rollback

### Configuration
- `.env.example` documents all required vars
- Secrets stored in Replit Secrets

## Runbook Checklist

- [ ] Identify the issue
- [ ] Assess impact (users affected, data at risk)
- [ ] Communicate if needed
- [ ] Apply fix
- [ ] Verify resolution
- [ ] Document incident
- [ ] Post-mortem if major

---

*The Genuine Love Project — Live in Genuine Love*

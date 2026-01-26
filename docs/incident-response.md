# Incident Response Playbook

## Severity Levels

| Level | Definition | Response Time |
|-------|------------|---------------|
| P1 (Critical) | Site down, data breach, safety risk | Immediate |
| P2 (High) | Major feature broken, payment issues | < 1 hour |
| P3 (Medium) | Minor feature broken, degraded UX | < 4 hours |
| P4 (Low) | Cosmetic issues, minor bugs | Next business day |

## Incident Response Steps

### 1. Detection
- Health check failure
- User report
- Error spike in logs
- Monitoring alert

### 2. Triage
- Determine severity level
- Assign incident owner
- Create incident channel/thread

### 3. Investigation
```bash
# Check health
curl https://[your-domain]/health

# Check logs
npm run refresh-logs

# Check database
npm run db:check
```

### 4. Mitigation
- Immediate fix if possible
- Rollback if fix not quick
- Disable affected feature if needed

### 5. Resolution
- Deploy fix
- Verify health
- Monitor for recurrence

### 6. Post-Mortem
- Document root cause
- Document timeline
- Identify prevention measures
- Update runbooks

## Common Scenarios

### Site Down
1. Check Replit status
2. Check database connectivity
3. Review recent deployments
4. Rollback if needed

### Payment Issues
1. Check Stripe dashboard
2. Verify webhook signatures
3. Check subscription sync
4. Contact Stripe support if needed

### Data Breach (P1)
1. Isolate affected systems
2. Document scope
3. Notify affected users
4. Report to authorities if required
5. Conduct security review

### AI Misbehavior
1. Disable AI feature
2. Review affected interactions
3. Update guardrails
4. Re-enable with monitoring

## Contacts

| Role | Contact |
|------|---------|
| On-call | [Configure in Replit] |
| Database | Neon support |
| Payments | Stripe support |
| AI | OpenAI support |

## Post-Incident Checklist

- [ ] Incident timeline documented
- [ ] Root cause identified
- [ ] Fix deployed and verified
- [ ] Prevention measures identified
- [ ] Runbook updated
- [ ] Team notified of resolution

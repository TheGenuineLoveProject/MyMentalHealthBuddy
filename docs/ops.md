# Operations Documentation

## Infrastructure

- **Platform:** Replit Autoscale
- **Database:** Neon PostgreSQL (managed)
- **Runtime:** Node.js 20+

## Health Checks

### Endpoints
- `GET /api/health` - Basic health check
- `GET /api/ready` - Readiness check (DB connectivity)
- `GET /api/admin/health` - Detailed system status (admin only)

### Monitoring
- Uptime checks via `/api/health`
- Database connectivity via `/api/ready`
- System metrics via admin dashboard

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
See `.env.example` for required variables.

## Database Operations

### Push Schema Changes
```bash
npm run db:push
```

### Force Push (data-loss warning)
```bash
npm run db:push --force
```

### Studio (Development)
```bash
npm run db:studio
```

## Backups

- **Automatic:** Neon continuous backups
- **Manual:** Replit checkpoints
- **Recovery:** Point-in-time restore via Neon

## Disaster Recovery

See `docs/ops/DISASTER_RECOVERY.md` for:
- Incident response procedures
- Recovery time objectives (RTO)
- Recovery point objectives (RPO)
- Rollback procedures

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run scan` | Platform health scan |
| `npm run report` | Generate status report |
| `npm run verify` | Full verification suite |
| `npm run content-check` | Tier compliance check |
| `npm run release` | Release notes generator |

## Observability

### Logging
- Request ID middleware: `server/middleware/requestId.mjs`
- Structured logging with scrubbed PII
- Error tracking via Sentry (optional)

### Metrics
- LCP/CLS performance budgets
- API response times
- Error rates

## Runbooks

1. **High CPU:** Check AI rate limits, scale down if needed
2. **DB Connection Issues:** Verify Neon status, check connection pool
3. **Auth Failures:** Check session configuration, cookie settings
4. **Payment Issues:** Verify Stripe webhook, check logs

# Replit Deployment Guide

**Generated:** 2026-02-06
**Platform:** Replit (NixOS)

---

## Current Configuration

### .replit File

| Setting | Value | Status |
|---------|-------|--------|
| Entrypoint | server/index.mjs | CORRECT |
| Dev Command | NODE_ENV=development node server/dev.mjs | CORRECT |
| Build Command | npm run build | CORRECT |
| Prod Command | npm run start | CORRECT |
| Deployment Target | autoscale | CORRECT |
| Primary Port | 5000 (external 80) | CORRECT |
| Nix Channel | stable-25_05 | CORRECT |
| Node.js Module | nodejs-20 | CORRECT |

### Port Configuration

| Port | External | Purpose | Status |
|------|----------|---------|--------|
| 5000 | 80 | Primary app (REQUIRED) | ACTIVE |
| 5001 | 4200 | Unused | CLEANUP CANDIDATE |
| 5099 | 3002 | Unused | CLEANUP CANDIDATE |
| 5173 | 5173 | Vite HMR (dev only) | CLEANUP CANDIDATE |
| 5174 | 3001 | Unused | CLEANUP CANDIDATE |
| 5175 | 3000 | Unused | CLEANUP CANDIDATE |
| 24678 | 3003 | Unused | CLEANUP CANDIDATE |

**Recommendation:** Only port 5000 is needed. Extra ports can be removed for cleaner configuration.

---

## Startup Verification

### Deterministic Startup Sequence

1. Express server initializes on port 5000
2. Middleware chain loads (CORS, Helmet, compression, sessions)
3. All API routes register
4. Vite dev server attaches (development mode)
5. Static assets served (production mode)
6. Server binds to 0.0.0.0:5000

### No Background Daemons

The platform does NOT use:
- No cron jobs within the app
- No background workers
- No socket listeners on other ports
- No subprocess spawning

GitHub Actions handle scheduled tasks (hourly/daily/weekly/monthly) externally.

---

## Environment Variables

### Required for Production

| Variable | Source | Required |
|----------|--------|----------|
| DATABASE_URL | Replit DB | Auto-set |
| NODE_ENV | .replit env | Auto-set |
| ADMIN_TOKEN | Secret | Yes |
| PERPLEXITY_API_KEY | Secret | Yes |
| GITHUB_CLIENT_ID | Secret | Yes |
| GITHUB_CLIENT_SECRET | Secret | Yes |

### Auto-Managed by Integrations

- OpenAI API key (via AI Integrations)
- Stripe keys (via Stripe integration)
- Resend API key (via Resend integration)
- Object Storage credentials (via Object Storage integration)
- Google Analytics ID (via GA integration)

---

## Production Deployment Checklist

1. Build completes without errors: `npm run build`
2. Server starts on port 5000 only
3. No development-only dependencies in production path
4. All secrets configured in Replit Secrets
5. Database schema is up to date: `npm run db:push`
6. Health endpoint responds: `GET /api/health`
7. Crisis page accessible without auth: `GET /crisis`

---

## Constraints

1. **Single Port:** Only port 5000 is exposed to the internet
2. **No Docker:** Replit uses Nix, no containerization
3. **No Virtual Environments:** Use Nix packages directly
4. **Autoscale Target:** App scales down when inactive, scales up on requests
5. **Stateless Requirement:** No in-memory state between requests (use database)
6. **Build Step:** Vite builds frontend assets before deployment

---

## Phase 4 Status: COMPLETE
No code was modified. Configuration documented and validated.

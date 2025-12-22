# BLOCKER_FIX_PACK_QuantumBrain_v1.0_111111111111111^

This checklist tracks the critical P0/P1 blockers from the 1111111111111111111111111^ audit.

## 1. Replit configuration

- [ ] `.replit` uses `run = "npm start"`
- [ ] `.replit` has `[deployment]` block with `run = ["npm", "start"]` and `build = ["npm", "run", "build"]`
- [ ] `.replit` has exactly ONE `[[ports]]` block: `localPort = 5000`, `externalPort = 80`

## 2. Server core

- [ ] `server/index.mjs` binds to `0.0.0.0`
- [ ] `server/index.mjs` serves static files from `client/dist`
- [ ] `/health`, `/health/live`, `/health/ready` endpoints exist and return 200 when healthy
- [ ] Global 404 and error handlers exist

## 3. Security

- [ ] No `origin: "*"` CORS configuration remains
- [ ] `server/middleware/rateLimiter.mjs` exists
- [ ] Rate limiting is applied to `/api`, `/ai`, `/auth/login`, `/auth/register`, `/webhooks/stripe`

## 4. Schema

- [ ] `shared/schema.ts` exists with users, mood_entries, journal_entries tables
- [ ] Backend imports tables and schemas from `shared/schema.ts`
- [ ] Frontend imports types from `shared/schema.ts` (later)

## 5. Automation

- [ ] `scripts/safetyGuard.mjs` exists
- [ ] `scripts/scanCriticalBlockers.mjs` exists
- [ ] `npm run scan:blockers` runs successfully and reports ✅ for all core checks
# CHANGE GATE RULES — Prompt-OS v8.0

## Status: ACTIVE
## Effective: 2026-04-14
## Authority: Prompt-OS Canonical Kernel v8.0

---

## Gate Protocol

All changes MUST pass every gate below. If ANY gate fails, DO NOT IMPLEMENT.

---

### Gate 1: Domain Classification

Every change must be classified into exactly one domain:

| Domain | Scope | Owner |
|--------|-------|-------|
| ENGINEERING | Code, backend, frontend, DB, infra | Engineering |
| BUSINESS | Monetization, pricing, funnels, billing | Business |
| CONTENT | Blog, SEO, social media, newsletters | Content |
| CLINICAL_SAFETY | Evidence-based MH, disclaimers, crisis | Clinical |
| GOVERNANCE | Kernel, quality gates, architecture | Governance |
| OBSERVABILITY | Health, telemetry, metrics, logging | Engineering |

**Rule**: Cross-domain changes require explicit justification and higher scrutiny.

---

### Gate 2: Impact Scope

Classify the blast radius:

| Level | Definition | Approval Required |
|-------|------------|-------------------|
| LOW | Single file, no API/schema change | Self-review |
| MEDIUM | Multiple files, no breaking changes | Build verification |
| HIGH | API changes, schema changes, auth changes | Full verification + rollback plan |

---

### Gate 3: Risk Check

Answer ALL of these before proceeding:

- [ ] Does it affect auth middleware? → If YES, requires auth verification
- [ ] Does it affect route definitions? → If YES, requires endpoint verification
- [ ] Does it affect database schema? → If YES, requires `db:push` + data integrity check
- [ ] Does it affect the kernel? → If YES, requires 51-check kernel health
- [ ] Does it affect billing/Stripe? → If YES, requires webhook verification
- [ ] Does it affect CSP/security headers? → If YES, requires header verification

---

### Gate 4: Verification Steps (MANDATORY)

Every change MUST include:

1. **Build check**: `npm run build` passes
2. **Endpoint check**: All public endpoints return 200
3. **Auth check**: All protected endpoints return 401 without auth
4. **Telemetry check**: `/api/system` shows 0% 5xx rate
5. **Kernel check**: `/api/kernel/health` passes 51/51

---

### Gate 5: Rollback Plan (MANDATORY for MEDIUM/HIGH)

Document:
- What files were changed
- How to revert (git commit hash or manual steps)
- What to verify after rollback

---

## Frozen Components (NO modification without proven failure)

### Server Core
- `server/routes/health.mjs` — Liveness probe
- `server/routes/system.mjs` — Telemetry
- `server/routes/kernel.mjs` — Kernel endpoints
- `server/middleware/auth.mjs` — JWT authentication
- `server/middleware/security.mjs` — Security headers
- `server/middleware/rateLimit.mjs` — Rate limiting
- `server/engine/prompt-os/kernel-bridge.mjs` — Kernel bridge

### Frontend Core
- `client/src/pages/admin/CommandCenter.jsx` — Admin panels
- `client/src/components/safety/SafetyFooter.jsx` — Crisis safety
- `client/src/components/wellness/WellnessPageShell.jsx` — Wellness shell

### Infrastructure
- `shared/schema.mjs` — Database schema (additive only)
- `server/dev.mjs` — Dev server entry
- `server/index.mjs` — Production entry
- `prompt-os-kernel/` — Kernel governance files

---

## Violation Protocol

If a change is made without passing all gates:
1. Revert immediately
2. Document what was changed and why it failed
3. Re-submit through the gate process

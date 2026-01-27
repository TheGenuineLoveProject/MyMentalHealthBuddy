# DECISIONS — TheGenuineLoveProject.com

> Rule: Record decisions to prevent duplicate work.

## Format

```
## D-NNN — <Title>
- Date:
- Context:
- Decision:
- Alternatives considered:
- Implications:
```

---

## Active Decisions

### DEC-001: Content Tiers (Beginner/Intermediate/Advanced)
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Need consistent content difficulty levels across platform
**Decision**: Use ONLY Beginner, Intermediate, Advanced as tier names
**Consequences**: All UI, API, and docs must use these exact terms

### DEC-002: Single Source of Truth for Routes
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Prevent duplicate route definitions and broken links
**Decision**: Use `routeKey` as universal naming convention in `client/src/content/routes.js`
**Consequences**: All links must resolve via routeKey, not hardcoded paths

### DEC-003: Design Tokens System
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Ensure visual consistency across all components
**Decision**: Centralize all design values in `client/src/styles/tokens.css`
**Consequences**: Components must use CSS variables, not hardcoded values

### DEC-004: AI Safety Guardrails
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Platform handles mental wellness, requires safety measures
**Decision**: Implement crisis detection, prompt hardening, PII redaction
**Consequences**: All AI responses pass through safety filters

### DEC-005: No Duplicate Work Policy
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Prevent wasted effort and conflicting implementations
**Decision**: Run dup-scan before every batch, maintain work ledger
**Consequences**: Check feature-map.md before implementing anything

### DEC-006: Non-Destructive Updates
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Protect user data and production stability
**Decision**: Never delete files without explicit approval, use quarantine
**Consequences**: Shadow copies moved to `_quarantine/`, not deleted

### DEC-007: Human-in-the-Loop
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Platform should not take autonomous actions
**Decision**: No background daemons, no auto-posting, human-triggered only
**Consequences**: All scheduled tasks require manual trigger

### DEC-008: Single Port Architecture
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Replit requires applications to bind to single port
**Decision**: All services (frontend + API) bind to port 5000
**Consequences**: Simplified deployment, Vite proxies API requests

### DEC-009: Drizzle ORM with Neon PostgreSQL
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Need type-safe ORM for serverless
**Decision**: Use Drizzle ORM with Neon PostgreSQL
**Consequences**: Schema in `shared/schema.mjs`, push migrations with `npm run db:push`

### DEC-010: WCAG AA Accessibility
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Mental wellness platform must be accessible
**Decision**: 44px minimum button height, ARIA labels, keyboard navigation
**Consequences**: Inclusive UX, compliance with accessibility standards

### DEC-011: Batch Processing Engine
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Large platform requires systematic completion
**Decision**: Implement "Endless 50" batch system with PROCESS_CATALOG_360.json
**Consequences**: 50 processes per batch, idempotent, traceable progress

### DEC-012: Stateless Design for Autoscale
**Date**: 2026-01
**Status**: ACCEPTED
**Context**: Replit autoscale requires stateless design
**Decision**: No local file storage, sessions in database
**Consequences**: Horizontal scaling ready, DB is single source of truth

---

_Last updated: January 27, 2026_

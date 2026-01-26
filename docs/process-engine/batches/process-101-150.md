# Process Batch 101–150 (LOCKED)

> **Rule**: Keep every item ❌ LOCKED until Batch 051–100 is 100% ✅.

Each process must be completed in order, with:
- Why
- Done means (checkboxes)
- Touch points (files/routes)
- Verify (commands)
- Duplicate-safety check (keeper + collision scan)
- Status: ❌ LOCKED / 🟡 / ✅

---

## 101) Design System Tokens + Brand Lock Enforcement
**Why**: Single source of truth for Serenity Sage™ palette + typography + spacing.
**Done means**:
- [ ] Tokens file created (colors/spacing/radius/shadows)
- [ ] Tailwind config uses tokens
- [ ] UI components reference tokens only

**Touch points**: `client/tailwind.config.*`, `client/src/styles/*`, UI component library
**Verify**: `npm run verify`
**Duplicate-safety**: dup-scan + collisions for theme/tokens
**Status**: ❌ LOCKED

---

## 102) Component Library Audit + Canonical "shadcn/ui" Keeper Map
**Why**: Prevent multiple button/input/toast implementations.
**Done means**:
- [ ] Keeper files for each primitive (Button/Input/Toast/Dialog/etc.)
- [ ] All imports routed to keepers

**Touch points**: `client/src/components/ui/*`
**Verify**: `npm run verify`
**Duplicate-safety**: scan-duplicates cluster on ui/*
**Status**: ❌ LOCKED

---

## 103) Layout Consistency: Grid + Spacing + Container System
**Why**: Eliminate overcrowding and inconsistent widths.
**Done means**:
- [ ] Container + section layout utilities
- [ ] Pages conform to layout primitives

**Touch points**: `client/src/components/layout/*`
**Verify**: `npm run verify`
**Duplicate-safety**: Collisions for duplicate layout wrappers
**Status**: ❌ LOCKED

---

## 104) Global Navigation + Route Map Consistency
**Why**: Ensure discoverability and no broken links.
**Done means**:
- [ ] Nav items derived from single route registry
- [ ] 404 + fallback routes

**Touch points**: `client/src/router*`, `client/src/components/nav*`
**Verify**: `npm run verify`
**Duplicate-safety**: scan-architecture ui-routes.md
**Status**: ❌ LOCKED

---

## 105) Accessibility Pass 2: Focus Management + Dialog/Drawer
**Why**: Keyboard + screen reader correctness.
**Done means**:
- [ ] Focus trap for modal components
- [ ] Aria-labels for icon buttons

**Touch points**: `client/src/components/ui/*`
**Verify**: `npm run verify` + basic a11y checks
**Duplicate-safety**: Ensure single dialog implementation
**Status**: ❌ LOCKED

---

## 106) Security Pass 2: Threat Model + Abuse Case Catalog
**Why**: Formalize safety and reduce blind spots.
**Done means**:
- [ ] threat-model.md created
- [ ] Mitigations mapped to processes

**Touch points**: `/docs/security/*`
**Verify**: `npm run verify`
**Duplicate-safety**: None (docs)
**Status**: ❌ LOCKED

---

## 107) Privacy Pass 2: Data Inventory + DPIA-lite
**Why**: Clarify data collected + why.
**Done means**:
- [ ] data-inventory.md
- [ ] Retention schedules

**Touch points**: `/docs/privacy/*`
**Verify**: `npm run verify`
**Duplicate-safety**: None (docs)
**Status**: ❌ LOCKED

---

## 108) Centralized Config: "appConfig" Single Export (client + server)
**Why**: Stop scattered constants.
**Done means**:
- [ ] Server config module keeper
- [ ] Client config module keeper

**Touch points**: `server/src/config*`, `client/src/config*`
**Verify**: `npm run verify`
**Duplicate-safety**: Collisions for config exports
**Status**: ❌ LOCKED

---

## 109) API Client SDK (typed) + Zod Response Parsing
**Why**: Eliminate ad-hoc fetch and runtime surprises.
**Done means**:
- [ ] API client wrapper + typed endpoints
- [ ] Zod parse on responses

**Touch points**: `client/src/lib/api*`
**Verify**: `npm run verify`
**Duplicate-safety**: Collision scan for multiple API clients
**Status**: ❌ LOCKED

---

## 110) Server Router Refactor: Single Route Registrar
**Why**: Prevent endpoint duplication/collisions.
**Done means**:
- [ ] Central router index registers all routes
- [ ] scan-collisions returns zero collisions

**Touch points**: `server/src/routes/*`
**Verify**: `npm run verify` + scan-collisions
**Duplicate-safety**: collisions-latest.json must be clean
**Status**: ❌ LOCKED

---

## 111) Observability: Request Metrics + Latency Buckets
**Why**: Measure real performance.
**Done means**:
- [ ] /metrics endpoint (optional) or structured logs
- [ ] Latency metrics included

**Touch points**: Server middleware
**Verify**: `npm run verify`
**Duplicate-safety**: Ensure one metrics middleware
**Status**: ❌ LOCKED

---

## 112) Rate Limiting Advanced: per-IP + per-user + per-route profiles
**Why**: Prevent AI abuse + auth brute force.
**Done means**:
- [ ] Profiles defined for /auth /ai /admin /stripe

**Touch points**: Server middleware
**Verify**: `npm run verify`
**Duplicate-safety**: Ensure single limiter
**Status**: ❌ LOCKED

---

## 113) Advanced Input Sanitization + Safe Markdown Policy
**Why**: Prevent XSS in user content.
**Done means**:
- [ ] Sanitize pipeline for any HTML/markdown rendering

**Touch points**: Client markdown renderer + server storage
**Verify**: `npm run verify`
**Duplicate-safety**: Single sanitizer utility keeper
**Status**: ❌ LOCKED

---

## 114) Content Engine: Tools Library Framework (A–Z module slots)
**Why**: Scalable evidence-informed content structure.
**Done means**:
- [ ] "Tools registry" schema
- [ ] Tool pages generated from registry

**Touch points**: DB schema + client pages
**Verify**: `npm run verify`
**Duplicate-safety**: Prevent multiple tool registries
**Status**: ❌ LOCKED

---

## 115) Beginner/Intermediate/Advanced Tiering Framework (global)
**Why**: Consistent tier filtering everywhere.
**Done means**:
- [ ] Tier enum used across DB/API/UI
- [ ] Filters + badges + gating consistent

**Touch points**: shared/types, DB, UI
**Verify**: `npm run verify`
**Duplicate-safety**: Ensure single enum definition
**Status**: ❌ LOCKED

---

## 116) Onboarding 2.0: Intent + Goals + Tier Selection
**Why**: Personalize without clinical claims.
**Done means**:
- [ ] Onboarding wizard persists preferences

**Touch points**: Client onboarding, server endpoint, DB
**Verify**: `npm run verify`
**Duplicate-safety**: Avoid duplicate onboarding flows
**Status**: ❌ LOCKED

---

## 117) Personalization: Recommended Tools + Journaling Prompts
**Why**: Increase retention.
**Done means**:
- [ ] Rec engine v1 (rules-based)

**Touch points**: Server recommendation service + client UI
**Verify**: `npm run verify`
**Duplicate-safety**: Single recommender module
**Status**: ❌ LOCKED

---

## 118) Search v2: Full-text search for journals/tools/blog
**Why**: Findability at scale.
**Done means**:
- [ ] DB FTS or external (documented)

**Touch points**: Server search endpoints, DB indexes
**Verify**: `npm run verify`
**Duplicate-safety**: One search endpoint set
**Status**: ❌ LOCKED

---

## 119) Tagging v2: Controlled vocab + user tags with moderation
**Why**: Prevent chaos and ensure safe language.
**Done means**:
- [ ] Vocab list + CRUD admin

**Touch points**: DB + admin UI
**Verify**: `npm run verify`
**Duplicate-safety**: One tagging schema
**Status**: ❌ LOCKED

---

## 120) Admin Dashboard v2: Live System Health + Queues
**Why**: Operational readiness.
**Done means**:
- [ ] Admin health widgets reflect real metrics

**Touch points**: Admin UI + server analyzer endpoints
**Verify**: `npm run verify`
**Duplicate-safety**: Single admin dashboard route
**Status**: ❌ LOCKED

---

## 121) Content Publishing v2: Editorial Workflow (draft/review/publish)
**Why**: Safe evidence-informed publishing.
**Done means**:
- [ ] States + roles + audit trail

**Touch points**: DB + admin UI
**Verify**: `npm run verify`
**Duplicate-safety**: Ensure single publishing workflow
**Status**: ❌ LOCKED

---

## 122) Media Pipeline: Image Resize + WebP + Cache Headers
**Why**: Performance and quality.
**Done means**:
- [ ] Upload/transform approach documented + implemented

**Touch points**: Server upload route or build pipeline
**Verify**: `npm run verify`
**Duplicate-safety**: One media pipeline
**Status**: ❌ LOCKED

---

## 123) SEO v2: Structured Data (JSON-LD) for key pages
**Why**: Discoverability.
**Done means**:
- [ ] JSON-LD for blog/articles/tools

**Touch points**: Client head tags
**Verify**: `npm run verify`
**Duplicate-safety**: Single SEO helper
**Status**: ❌ LOCKED

---

## 124) Internationalization (i18n) v2: Locale switch + copy registry
**Why**: Future global reach.
**Done means**:
- [ ] Translation keys + fallback behavior

**Touch points**: Client i18n system
**Verify**: `npm run verify`
**Duplicate-safety**: One i18n library
**Status**: ❌ LOCKED

---

## 125) Email System v2: Templates + Delivery Logs
**Why**: Trust and debugging.
**Done means**:
- [ ] Template system
- [ ] Delivery log table

**Touch points**: Server email module, DB
**Verify**: `npm run verify`
**Duplicate-safety**: Single email sender
**Status**: ❌ LOCKED

---

## 126) Notifications v2: Digest + Preference Center
**Why**: Reduce spam + increase engagement.
**Done means**:
- [ ] Notification preferences UI
- [ ] Weekly digest job (human-triggered)

**Touch points**: Client settings + server job runner
**Verify**: `npm run verify`
**Duplicate-safety**: One notification scheduler
**Status**: ❌ LOCKED

---

## 127) Audit Trail v2: Admin searchable + exportable
**Why**: Compliance-lite.
**Done means**:
- [ ] Audit UI with filters

**Touch points**: Admin UI + server audit endpoints
**Verify**: `npm run verify`
**Duplicate-safety**: One audit table
**Status**: ❌ LOCKED

---

## 128) Data Export v2: Self-serve download bundle (safe)
**Why**: User trust.
**Done means**:
- [ ] Export job creates archive

**Touch points**: Server export endpoint + storage
**Verify**: `npm run verify`
**Duplicate-safety**: One export pipeline
**Status**: ❌ LOCKED

---

## 129) Data Deletion: User-initiated account deletion flow
**Why**: Privacy baseline.
**Done means**:
- [ ] Deletion request + confirmation + delay

**Touch points**: Server + client settings
**Verify**: `npm run verify`
**Duplicate-safety**: One deletion flow
**Status**: ❌ LOCKED

---

## 130) Legal Pages v2: Jurisdiction toggles + versioning
**Why**: Maintainable policies.
**Done means**:
- [ ] Versioned policy pages

**Touch points**: Public pages
**Verify**: `npm run verify`
**Duplicate-safety**: None
**Status**: ❌ LOCKED

---

## 131) AI Safety v2: Prompt templates registry + allowlist
**Why**: Prevent prompt sprawl.
**Done means**:
- [ ] Prompt registry file + tests

**Touch points**: Server AI prompts
**Verify**: `npm run verify`
**Duplicate-safety**: One prompt registry
**Status**: ❌ LOCKED

---

## 132) AI Streaming Responses + UI typing states
**Why**: Better UX.
**Done means**:
- [ ] Streaming endpoint + client reader

**Touch points**: Server AI route + client chat
**Verify**: `npm run verify`
**Duplicate-safety**: Single AI route
**Status**: ❌ LOCKED

---

## 133) AI Cost Controls: Token budgets + per-model caps
**Why**: Predictability.
**Done means**:
- [ ] Budgets enforced with clear errors

**Touch points**: Server AI wrapper
**Verify**: `npm run verify`
**Duplicate-safety**: One budget enforcer
**Status**: ❌ LOCKED

---

## 134) Abuse Reporting + Moderation Queue
**Why**: Safety and community trust.
**Done means**:
- [ ] Report UI + admin queue

**Touch points**: DB + admin UI
**Verify**: `npm run verify`
**Duplicate-safety**: Single moderation queue
**Status**: ❌ LOCKED

---

## 135) Crash Recovery: Safe-mode boot + diagnostics banner
**Why**: Reduce downtime.
**Done means**:
- [ ] Safe-mode flag
- [ ] Diagnostics page

**Touch points**: Server startup + admin UI
**Verify**: `npm run verify`
**Duplicate-safety**: Single boot flag logic
**Status**: ❌ LOCKED

---

## 136) Dependency Governance: Allowed list + lockfile policy
**Why**: Keep stable.
**Done means**:
- [ ] Policy doc
- [ ] CI check

**Touch points**: CI workflow + docs
**Verify**: `npm run verify`
**Duplicate-safety**: None
**Status**: ❌ LOCKED

---

## 137) Monorepo Hygiene: Path aliases + boundary rules
**Why**: Eliminate import spaghetti.
**Done means**:
- [ ] tsconfig paths + lint rule

**Touch points**: tsconfig + eslint
**Verify**: `npm run verify`
**Duplicate-safety**: scan-collisions for duplicate utilities
**Status**: ❌ LOCKED

---

## 138) "One Command Doctor" v2: Auto-scan + actionable fix plan
**Why**: Reduce human load.
**Done means**:
- [ ] Doctor script prints prioritized actions

**Touch points**: scripts/doctor*
**Verify**: `npm run verify`
**Duplicate-safety**: Ensure single doctor script
**Status**: ❌ LOCKED

---

## 139) Release Process v2: Semver + changelog automation
**Why**: Reliable releases.
**Done means**:
- [ ] Changelog generation

**Touch points**: Scripts + CI
**Verify**: `npm run verify`
**Duplicate-safety**: None
**Status**: ❌ LOCKED

---

## 140) Staging vs Prod Config Separation (strict)
**Why**: No accidental prod calls.
**Done means**:
- [ ] Env separation enforced

**Touch points**: Config modules
**Verify**: `npm run verify`
**Duplicate-safety**: One config loader
**Status**: ❌ LOCKED

---

## 141) Backups v2: Scheduled (human-triggered) + verification
**Why**: Safety.
**Done means**:
- [ ] Backup script + restore test doc

**Touch points**: scripts/backup*
**Verify**: `npm run verify`
**Duplicate-safety**: One backup method
**Status**: ❌ LOCKED

---

## 142) Performance Pass v2: DB query profiling + slow query logs
**Why**: Scale readiness.
**Done means**:
- [ ] Slow query logging enabled

**Touch points**: DB layer
**Verify**: `npm run verify`
**Duplicate-safety**: One DB wrapper
**Status**: ❌ LOCKED

---

## 143) Caching v2: Server-side caching policy for public content
**Why**: Speed and cost.
**Done means**:
- [ ] Cache policy documented + implemented

**Touch points**: Server middleware
**Verify**: `npm run verify`
**Duplicate-safety**: One caching layer
**Status**: ❌ LOCKED

---

## 144) Error Boundaries v2: Granular + recovery actions
**Why**: Better UX on failures.
**Done means**:
- [ ] Page-level and component-level boundaries

**Touch points**: Client error boundary components
**Verify**: `npm run verify`
**Duplicate-safety**: Single error boundary pattern
**Status**: ❌ LOCKED

---

## 145) Loading States v2: Skeleton + progressive disclosure
**Why**: Perceived performance.
**Done means**:
- [ ] Skeleton components for all major views

**Touch points**: Client UI components
**Verify**: `npm run verify`
**Duplicate-safety**: Single skeleton pattern
**Status**: ❌ LOCKED

---

## 146) Empty States v2: Helpful prompts + next actions
**Why**: Guide users.
**Done means**:
- [ ] Empty state components with CTAs

**Touch points**: Client UI components
**Verify**: `npm run verify`
**Duplicate-safety**: Single empty state pattern
**Status**: ❌ LOCKED

---

## 147) Toast/Notification System v2: Queue + accessibility
**Why**: Consistent feedback.
**Done means**:
- [ ] Toast queue with aria-live

**Touch points**: Client toast component
**Verify**: `npm run verify`
**Duplicate-safety**: Single toast system
**Status**: ❌ LOCKED

---

## 148) Form Validation v2: Real-time + accessible errors
**Why**: Better UX.
**Done means**:
- [ ] Zod + react-hook-form integration

**Touch points**: Client form components
**Verify**: `npm run verify`
**Duplicate-safety**: Single form pattern
**Status**: ❌ LOCKED

---

## 149) Mobile Responsiveness v2: Touch targets + gestures
**Why**: Mobile users.
**Done means**:
- [ ] 44px touch targets
- [ ] Swipe gestures where appropriate

**Touch points**: Client UI components
**Verify**: `npm run verify`
**Duplicate-safety**: Single responsive pattern
**Status**: ❌ LOCKED

---

## 150) Dark Mode v2: System preference + manual toggle
**Why**: User preference.
**Done means**:
- [ ] Theme toggle persisted
- [ ] All components support dark mode

**Touch points**: Client theme system
**Verify**: `npm run verify`
**Duplicate-safety**: Single theme provider
**Status**: ❌ LOCKED

---

_Last updated: January 2026_

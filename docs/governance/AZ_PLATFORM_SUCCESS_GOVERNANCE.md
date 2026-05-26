# A→Z Platform Success Governance

**Status:** LOCKED — canonical governance for platform completion
**Kernel:** MMHB v7.4 (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Companion registry:** `registry/platform/az-platform-success-registry.json`
**Companion roadmap:** `docs/reports/PHASE_103_AZ_PLATFORM_SUCCESS_ROADMAP.md`

## Purpose
Convert platform improvement priorities into a governed execution system for MyMentalHealthBuddy + The Genuine Love Project. This document is the **decision contract**; the JSON registry is the **machine-readable mirror**; the Phase 103 report is the **execution ledger**.

## Verified Strengths (entry baseline, 2026-05-25)
- Governed architecture under v7.4 kernel
- Production health verification (`/healthz`, `/readyz`, `/api/health` — 3/3 green)
- Canonical route taxonomy (`CANONICAL_ROUTE_TAXONOMY.md`) with audit ledger
- Privacy governance lock (`PHASE_99_PRIVACY_CANONICAL_DECISION_LOCK.md`)
- Bundle auditing + budget guardrail (`PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md`)
- Navigation governance (`PHASE_95_NAVIGATION_COHERENCE_LOCK.md`)
- Observability signals (Sentry, `server/observability/preload.mjs`, runtime topology doc)
- Structured deployment discipline (Replit deployments + health gates)
- Strong mission identity (TGLP + MMHB joint brand stack)
- Differentiated emotional UX direction (Lumi agent + avatar system)
- 127 routes / 27 admin pages tracked; integrations live: Perplexity, Resend, Sentry, Stripe

## Primary Law
Do **not** add random features. Every future improvement must strengthen at least one of:
**coherence · trust · safety · discoverability · retention · journey completion · emotional continuity · operational compression**

If a proposed change strengthens none of these, it is rejected at intake.

## Next Major Leap (priority order)
1. **System coherence** — one IA spine, one design-system surface, one route registry
2. **Experience depth** — guided journeys, emotional continuity, knowledge graph
3. **Trust architecture** — `/account/data` reveal/export/delete + AI transparency
4. **Retention loops** — lifecycle email + return-with-care patterns (never dark)
5. **Discoverability systems** — semantic search + canonical hubs
6. **Emotional continuity** — Lumi memory transparency + cross-session callbacks (consent-gated)
7. **Operational compression** — fewer surfaces, smaller bundles, faster routes
8. **AI orchestration governance** — prompt isolation, red-team CI, cost caps
9. **Content intelligence** — tagged library, evidence-base annotations, "if this helped" rails
10. **User journey completion** — every entry surface has a defined exit + a defined "stay-with-you" path

## A→Z Success Domains (canonical 26)

| Letter | Domain | One-line contract |
|---|---|---|
| **A** | Authority Systems | Admin auth + audit + two-person rule for destructive ops |
| **B** | Behavioral Continuity | Lumi memory transparency; consent-gated cross-session recall |
| **C** | Content Intelligence | Tagged library + evidence base + curated rails |
| **D** | Discoverability Engine | Single IA spine; semantic search; sitemap parity |
| **E** | Experience Depth | Guided journeys with named beginnings, middles, ends |
| **F** | Feature Priority Matrix | New work must map to a Next Major Leap line |
| **G** | Growth Systems | Lifecycle email + word-of-mouth (no growth hacks) |
| **H** | Human Trust Systems | `/account/data` reveal/export/delete in ≤3 clicks |
| **I** | Information Architecture | One spine: `/explore` + `/hubs/<topic>` |
| **J** | Journey Engineering | Each healing entry has a defined exit + crisis-aware fallback |
| **K** | Knowledge Graph | Library articles linked by `{emotion, situation, modality}` |
| **L** | Legal + Trust Maturity | Privacy + terms + disclaimer uniformity; one source per surface |
| **M** | Meaningful Metrics | Mood-aware metrics, never vanity counters |
| **N** | Navigation Systems | One header, one footer, one mobile bar — derived from registry |
| **O** | Observability | pino + OTel + web-vitals + domain dashboards |
| **P** | Performance | Bundle + LCP/INP/CLS + AI latency budgets, CI-enforced |
| **Q** | Quality Gates | build · health · routes · a11y · bundle · duplication · privacy · rollback |
| **R** | Retention | Calm return; "still with you" cadence; no shame patterns |
| **S** | Search | Semantic + scoped; respects domain (healing vs admin) |
| **T** | Trust + Safety | Crisis interlock, prompt-injection defenses, immutable audit log |
| **U** | UX Maturity | Four named states per async component; reduced-motion verified |
| **V** | Visual System | Design-system tokens only; lint-enforced |
| **W** | Wellness Intelligence | Lumi persona + boundaries + crisis interlock contract |
| **X** | Experience Differentiation | Calm-by-default; voice spec applied to every surface |
| **Y** | Yield Systems | Conversion behind a non-coercive paywall; BUSINESS-domain only |
| **Z** | Zero-Fragmentation Architecture | One registry of routes, one of components, one of content |

## Top Priority Upgrades (sequenced)
1. **Semantic search** — index library + tools + practices; returns domain-typed results
2. **Guided emotional journeys** — `/journeys/<slug>` with curated step graphs
3. **Unified wellness dashboard** — Dashboard becomes the only "home" for signed-in healing
4. **Knowledge graph** — build-time computed `{tag → article[]}` for "if this helped"
5. **Emotional continuity engine** — Lumi cross-session memory under transparency contract
6. **Mobile nervous-system-safe UX** — 320px-first audit; reduced-motion baseline
7. **Content intelligence architecture** — taxonomy + provenance + AI summary disclosure
8. **Discoverability engine** — `/explore/*` becomes the single discovery spine
9. **AI transparency center** — `/account/ai` shows model, system prompt summary, memory state
10. **Trust + safety center** — `/account/safety` exposes crisis routing, blocked patterns, audit access

## Safety Boundaries (non-negotiable)
- No diagnosis
- No prescribing
- No determining suicidality (always escalate — never resolve)
- No emotional manipulation
- No dark patterns (no shame nudges, no fake urgency, no loss-aversion paywalls)
- No healing-data monetization (mood, journal, Lumi turns)
- No business logic inside healing flows (kernel Primary Law)
- No autonomous clinical decisions

## Execution Rule (per implementation phase)
Every implementation must pass, in order:

1. **Build verification** — `npm run build` exits 0
2. **Health verification** — `/healthz` + `/readyz` + `/api/health` all 200
3. **Route verification** — taxonomy audit (`CANONICAL_ROUTE_TAXONOMY.md`) shows no regression
4. **Accessibility review** — axe baseline preserved or improved on touched routes
5. **Bundle review** — within `PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md` limits
6. **Duplication review** — no new duplicate routes/components/content
7. **Privacy review** — no new PII surfaces without `/account/data` integration
8. **Rollback readiness** — change is revertible by one git revert without manual fix-up

A phase that skips any gate is invalid and must reopen.

## Domain Separation (kernel Primary Law restated)
| Domain | What ships here | What never ships here |
|---|---|---|
| HEALING | Lumi, journals, mood, crisis, library, journeys | Pricing, conversion CTAs, debug surfaces |
| BUSINESS | Pricing, checkout, billing, account upgrades | Reflection prompts, mood validation, healing copy |
| PLATFORM | Admin, observability, internal docs, status | Healing UX, marketing copy, customer support flows |

Crisis routing crosses all three; it is the only legal cross-domain affordance.

## Change Intake Contract
Before any new phase opens, the proposer must answer in writing:
1. Which Next Major Leap line does this strengthen?
2. Which A→Z domain owns it?
3. What is the smallest valid engine (CSS / patch / component / page / service)?
4. What evidence (audit, scan, probe) opens the phase?
5. What evidence (screenshot, build hash, probe) closes the phase?
6. What rollback is one revert away?

Phases that cannot answer all six are returned to intake.

## Versioning
- This document is **v1.0** — locked 2026-05-25.
- Edits to A→Z domain contracts require a new phase report and a kernel note.
- The companion registry must be kept byte-aligned with this document's "Top Priority Upgrades" list at all times.

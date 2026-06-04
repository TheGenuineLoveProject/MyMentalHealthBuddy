# MMHB — A→Zero 360° Elite Recommendations

**Authored:** 2026-05-25
**Governance:** MMHB v7.4 Archival Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Scope:** Strategic recommendations across Content, Components, Platform. Doc-only deliverable. No source/route/dependency changes. Each recommendation is annotated with **domain**, **blast radius**, **effort**, **success metric**, and **dependencies** so it can be lifted directly into a phase plan.

**Status snapshot at authorship**
- Prod: 127 routes, 27 admin pages, version `2.0.0`, services `{perplexity, resend, sentry, stripe}` ✅, AI ✅, DB ✅, uptime 21h+
- Bundle: ~751 kB main (per `docs/architecture.md` Quick Reference)
- Governance: Phase 103 (Bundle Budget Guardrail) most recent locked phase; Phase 80 Step 4 just closed NO-OP
- Outstanding taxonomy gaps (from `CANONICAL_TAXONOMY_AUDIT.md`): `/buddy` missing; `/admin-login`, `/content-admin` violate `/admin/*` family; duplicate `<Route path="/privacy">`; competing discovery hubs (`/explore/*`, `/hubs/* ×43`, `/wellness-tools-hub`, `/tools/all`)

---

## 0. North-Star Principles (re-affirmation)

Before any rec lands, the elite bar is set by these non-negotiables (existing kernel + a few additions):

1. **Crisis asymmetry.** Every wellness surface routes to `/crisis` + 988 + 741741. Err toward over-provision. **Never** soften, A/B-test, or behind-flag this.
2. **Domain purity.** HEALING ≠ BUSINESS ≠ PLATFORM. No pricing in a healing flow. No "debug build hash" in a healing flow. No mood-validation copy in a checkout step.
3. **Smallest valid engine.** CSS > React patch > new component > new page > new service. Anyone who reaches for a bigger engine must justify in writing.
4. **Calm by default.** `prefers-reduced-motion` is the spec, not an afterthought. WCAG AA is floor, AAA is target for body text.
5. **Evidence-led changes.** Every fix begins with a diagnostic artifact (audit, scan, probe) and ends with a verification artifact (screenshot, build hash, probe response).
6. **Doc-first, ship-second.** A change without a ledger entry didn't happen. The ledger is the product.
7. **(NEW) Trust ledger.** Anything the user could perceive as the platform "knowing them" (memory, mood history, identifiers, exports) gets a one-click reveal + one-click reset. Trust is shipped, not declared.
8. **(NEW) Latency budget = mood budget.** Every additional second on a healing surface measurably increases bounce + dysregulation. Treat p75 LCP as a clinical-adjacent metric, not a perf metric.

---

## 1. CONTENT — A→Z

### 1.A — Editorial taxonomy lock (foundational)

Pick **one** discovery spine and demote the rest to redirects. Current state has three competing IA spines (`/explore/*`, `/hubs/*` ×43, `/wellness-tools-hub`, `/tools/all`) which the taxonomy audit flagged. The right single spine is:

```
/explore           → discovery landing (curated)
/explore/tools     → all tools (canonical, replaces /tools/all + /wellness-tools-hub)
/explore/library   → all reads (canonical, replaces /healing-library duplicates)
/explore/practices → all practices (rituals, breathing, grounding)
/hubs/<topic>      → topical clusters under explore (anxiety, sleep, grief, self-love)
```
- **Blast radius:** medium (routing + 301s, no component logic).
- **Effort:** 1 phase to map redirects, 1 phase to ship.
- **Success metric:** 0 competing canonical URLs in audit; sitemap has one URL per intent.
- **Dependencies:** must follow `DUPLICATE_ROUTE_FAMILY_RULES.md`; coordinate with Phase 100-103 footer/sitemap work.

### 1.B — Voice & tone codification

Today the brand voice lives in `client/src/brand/copy.ts` (254 B) and `voice.ts` (254 B) — too small to be authoritative. Write a **Voice Specification** (`docs/voice/MMHB_VOICE_SPEC.md`) with:
- Six tonal modes: **Steady**, **Curious**, **Compassionate**, **Boundaried**, **Celebratory**, **Crisis-First**.
- Per-mode lexicon (200 approved + 50 banned words each — e.g., banned: "fix", "cure", "broken"; approved: "alongside", "noticing", "with you").
- Per-mode example pairs (before/after).
- Per-surface assignment matrix (Dashboard = Steady; Lumi conversation = Curious; Crisis = Crisis-First locked).
- **Blast radius:** doc-only (low) → component reskin (medium) in follow-ups.
- **Success metric:** 100% of healing surfaces declare their mode; lint rule flags banned words.

### 1.C — Trauma-informed copy lint

Build a lightweight CI check (`scripts/lint/copy-lint.mjs`) that scans `client/src/**/*.{tsx,jsx,ts,js}` for banned-word literals + missing crisis routing on wellness pages.
- **Blast radius:** additive (CI only).
- **Success metric:** PRs blocked when banned terms ship.
- **Dependencies:** Voice Spec (1.B).

### 1.D — Disclaimer & consent uniformity

Currently `client/src/lumi-disclaimer/` exists as a module — confirm every healing surface that collects a reflection, mood, or journal entry imports the disclaimer pattern. Audit + fix gaps.
- **Blast radius:** low (already a module; just wiring).
- **Success metric:** 100% audit coverage; one disclaimer-of-record per surface.

### 1.E — Crisis pathway content density

`/crisis` is the most important surface in the product. Audit it against an elite bar:
- Above the fold: 988, Text 741741, 911 — three taps, three readable lines, no animation.
- Below the fold: warm "stay-with-you" content (grounding, what-to-tell-the-dispatcher script, what-not-to-do for a friend).
- Internationalization slot ready (don't ship yet; reserve the data shape).
- Multi-modal: TTY/Deaf line, Veterans 988-press-1, Trevor (LGBTQ+), Trans Lifeline, RAINN.
- **Blast radius:** content-only.
- **Success metric:** crisis card visible without scroll on 320px viewport; Lighthouse a11y = 100; reduced-motion verified.

### 1.F — Library knowledge graph

`HealingLibraryPage` exists. Elevate it from a list to a **knowledge graph**:
- Each article tagged with `{emotion, situation, modality, time-to-read, evidence-base}`.
- "If this helped, try this" rail powered by tag co-occurrence (computed at build time, not runtime → zero perf cost).
- "Save for later" persists per-user; "Read history" persists per-user; both behind the trust ledger (1-click reveal/reset).
- **Blast radius:** medium (data shape + UI).
- **Success metric:** average articles-per-session > 1.6; time-to-helpful < 30 s.

### 1.G — News & external content provenance

`NewsPage` exists and you pay for Perplexity. Add:
- "Source" pill on every card with domain + retrieved-on date.
- AI-summary disclaimer ("Auto-summarized by Lumi. Read the original for nuance.")
- Manual editorial veto list (`server/content/news-blocklist.json`).
- **Blast radius:** medium.
- **Success metric:** zero un-attributed AI summary surfaces; click-through to source > 8%.

### 1.H — Email content surface

You have Resend wired. Codify three transactional templates and three lifecycle templates in `server/email/templates/` with the Voice Spec applied:
- Transactional: welcome, password reset (if applicable), receipt.
- Lifecycle: 7-day "still with you" check-in, 30-day "what helped most" reflection, 90-day "would you share this with a friend" referral.
- Every email has unsubscribe + `/crisis` link in the footer.
- **Blast radius:** medium.
- **Success metric:** open > 35%, unsubscribe < 0.5%, zero crisis-link omissions.

### 1.I — SEO & schema content layer

Implement JSON-LD per page type:
- `Organization` + `WebSite` site-wide.
- `Article` for library + news.
- `MedicalWebPage` for crisis with `MedicalAudience.Patient`.
- `FAQPage` for the help center.
- **Blast radius:** additive `<script type="application/ld+json">`.
- **Success metric:** Google rich results valid for 100% of typed pages.

### 1.J — Internationalization-readiness (don't ship — prep)

- Externalize copy to `client/src/content/<locale>/` with `en-US` as canonical.
- Wire a no-op i18n shim today so future PRs don't require a refactor.
- **Blast radius:** low (additive shim).
- **Success metric:** 95% of healing copy externalized; 0 hardcoded strings in new components (lint rule).

---

## 2. COMPONENTS — A→Z

### 2.A — Design-system canonization

`client/src/design-system/` exists. Lock it as the **only** allowed component surface for healing flows. Anything outside (`@/components/ui/*` shadcn) is a primitive layer below it.

```
design-system/
  primitives/       → from shadcn (Button, Input, Dialog)
  components/       → MMHBButton, MMHBCard, MMHBCompanion (existing)
  patterns/         → CrisisCard, MoodCheckin, JournalEntry (new — promoted from one-offs)
  surfaces/         → AppShell, BrandShell, CrisisShell (new)
  tokens/           → colors, spacing, typography, radius, motion, elevation
```
- **Blast radius:** doc + governance lint, no code change initially.
- **Success metric:** healing pages import only from `@/design-system`; lint enforces.

### 2.B — Token-driven theming end-to-end

You already have `client/src/brand/tokens.ts` (4 kB) and the v7.4-locked 8-color palette. Audit that **every** inline color in `client/src/**` resolves to a token, not a hex. Use a CSS-in-JS or stylelint rule to enforce.
- **Blast radius:** low (lint), medium (cleanup PR).
- **Success metric:** 0 raw hex/rgb in healing surfaces; only ambient-overlay neutrals allowed (per kernel).

### 2.C — Motion system + reduced-motion contract verification

The polish layers already honor `prefers-reduced-motion`. Promote this from a pattern to a **system**:
- `client/src/design-system/motion/` exports `motionTokens`, `useMotionPreference`, `<Motion>` wrapper.
- All animation goes through it. Lint forbids raw `transition:` / `animation:` outside the module.
- **Blast radius:** medium (consolidation).
- **Success metric:** axe + manual audit on every healing surface with reduced-motion ON; 0 jitter.

### 2.D — Accessibility audit per route family

Run `@axe-core/playwright` against every canonical route. Snapshot results to `docs/reports/A11Y_BASELINE_<date>.md`. Set Phase 104+ as the iterative push toward 0 critical violations.
- **Blast radius:** doc + CI.
- **Success metric:** 0 critical, 0 serious; warnings < 5 per page.

### 2.E — Lumi (avatar + companion) elite hardening

`avatar-life/`, `lumi-*` modules are the soul of the product. Elite bar:
- **Persona contract:** `lumi-conversation/persona.json` declares allowed/disallowed behaviors (no diagnosis, no advice in legal/medical/financial, always offer to "step back").
- **Memory transparency:** `lumi-memory/` already has `MemoryTransparencyView` + `MemoryResetButton` — verify they're on the Settings page and reachable in ≤ 2 taps from any Lumi surface.
- **Crisis interlock:** `lumi-crisis/` must short-circuit `lumi-conversation/` whenever a flagged signal appears; verify with red-team script in `scripts/lumi/red-team.mjs`.
- **Voice mode:** `lumi-voice/` — confirm STT/TTS calls degrade gracefully offline; never block input on network.
- **Boundaries:** `lumi-boundaries/` — ship the BoundaryCard on first conversation start (one-time consent moment, not buried in settings).
- **Blast radius:** mostly verification (low–medium).
- **Success metric:** red-team script passes 100% of 50 scripted crisis prompts.

### 2.F — Form pattern unification

Confirm 100% of forms use `useForm` + shadcn `<Form>` + Zod resolver against `shared/schema.ts`. Replace any one-off forms.
- **Blast radius:** medium (cleanup).
- **Success metric:** 0 raw `<form>` in `client/src/`.

### 2.G — Empty / loading / error / offline states

Every data-driven component must have **four named states** and a Storybook-like preview surface (`/admin/component-preview`). Today many surfaces have only "loaded" + "loading."
- **Blast radius:** medium.
- **Success metric:** component-preview shows all 4 states for every async component.

### 2.H — Image + media discipline (the Phase 80 lesson)

Phase 80 Step 4 closed NO-OP because asset pairs weren't pre-generated. Fix:
- Build script `scripts/assets/generate-webp.mjs` walks `attached_assets/` + `client/public/brand/` and emits `*.webp` siblings with `sharp`.
- Build script `scripts/assets/audit-image-refs.mjs` emits a JSON manifest of every image import + its on-disk size + best variant.
- Components consume via `<Picture src=... fallback=... />` design-system wrapper (one source of truth).
- **Blast radius:** medium (scripts + 1 wrapper component).
- **Success metric:** total brand image weight cut by ≥ 50%; LCP image always WebP/AVIF when supported.

### 2.I — Iconography consolidation

`lib/lucide-brands.ts` already proxies brand icons. Audit for direct `lucide-react` imports + missing tree-shaking. Confirm `react-icons/si` is only used for company logos per guidelines.
- **Blast radius:** low.
- **Success metric:** icon weight in bundle drops; per `PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md` budgets stay green.

### 2.J — Component telemetry (privacy-preserving)

Add a `useComponentLifecycle(name, {props_to_hash})` hook → Sentry breadcrumb (no PII, no message content). Lets you correlate UX regressions with Sentry errors.
- **Blast radius:** low (additive hook).
- **Success metric:** every critical-path component (Crisis, Lumi, Checkin, Journal) emits open/error breadcrumbs.

---

## 3. PLATFORM — A→Z

### 3.A — Route registry as code

`docs/governance/CANONICAL_ROUTE_REGISTRY_LAW.md` exists. Promote it to executable: `shared/routes/registry.ts` exports `{ path, domain, owner, public, requiresAuth, crisisRouted, sitemap }[]`. `client/src/App.jsx` imports + renders from this. Sitemap, footer, breadcrumbs, robots — all derived.
- **Blast radius:** medium (refactor `App.jsx`, but additive: keep current `<Route>` elements until parity).
- **Success metric:** single source of truth; the audit gaps (`/buddy`, `/admin-login`, `/content-admin`, duplicate `/privacy`) become impossible to reintroduce.

### 3.B — Close the audited gaps

Three specific, time-boxed phases:
1. **Phase 104:** Resolve duplicate `<Route path="/privacy">` (decision lock already in Phase 99; ship the dedupe).
2. **Phase 105:** Migrate `/admin-login` → `/admin/login`, `/content-admin` → `/admin/content` with 301s.
3. **Phase 106:** Implement `/buddy` (the missing user-domain path).
- **Blast radius:** low–medium each, all routing.
- **Success metric:** taxonomy audit shows 22/22 user paths + 29/29 admin paths.

### 3.C — Observability second wave

You have Sentry, `server/observability/preload.mjs`, `runtime-topology.md`, `observability-inventory.md`. Next layer:
- **Structured logs:** `pino` JSON in prod, request_id + user_id_hash in every line.
- **Metrics:** Prometheus exporter on `/metrics` (admin-auth only) — request rate, p50/p75/p95 latency by route, AI token spend per minute, Stripe webhook lag.
- **Traces:** OpenTelemetry HTTP → Lumi AI → DB span tree; sampled 5% in prod, 100% on errors.
- **Dashboards:** one dashboard per domain (HEALING/BUSINESS/PLATFORM) so you can spot cross-contamination instantly.
- **Blast radius:** medium (additive packages).
- **Success metric:** any user-visible regression detectable in < 5 min from a single Grafana view.

### 3.D — Performance budget enforcement

`PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md` exists. Extend to runtime:
- **Bundle:** main < 250 kB gz, route chunks < 100 kB gz each (today main is 751 kB raw; quantify gz then set target).
- **Runtime:** p75 LCP < 2.0 s on 4G, INP < 200 ms, CLS < 0.05 — measured via real-user monitoring (web-vitals.js → Sentry).
- **AI latency:** Lumi first-token < 1.5 s, full response < 8 s.
- CI gate on bundle; alert on runtime regressions.
- **Blast radius:** additive measurement.
- **Success metric:** dashboards green for 30 consecutive days.

### 3.E — Security hardening pass

Use the `security_scan` skill to baseline (`runDependencyAudit`, `runSastScan`, `runHoundDogScan`). Then:
- **CSP:** strict, `script-src 'self' 'sha256-...'` + Sentry + Stripe; report-only first, enforced after 7 days clean.
- **Headers:** HSTS, X-Content-Type-Options, Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy minimal.
- **Auth:** session rotation on privilege change; `ADMIN_TOKEN` rotated quarterly; admin routes require IP allowlist or hardware key (your call).
- **Webhooks:** Stripe signature verification + idempotency keys + replay protection; failures alert PagerDuty (or email-equivalent).
- **PII at rest:** journal entries encrypted with envelope encryption; key rotation documented.
- **Blast radius:** medium.
- **Success metric:** Mozilla Observatory A+; OWASP ASVS Level 2 compliant; HoundDog 0 high/critical.

### 3.F — Data governance & user trust

Implement a `/account/data` page giving every user:
- **Reveal:** every row stored about them (mood logs, journals, Lumi turns, memory facts) on one screen.
- **Export:** JSON + Markdown bundle, signed URL, expires in 24 h.
- **Delete:** per-item AND full account wipe with 30-day undo window.
- **Audit log:** who accessed their data (admin queries logged immutably).
- **Blast radius:** medium (UI + endpoints).
- **Success metric:** zero data requests blocked by lack of self-service; aligns with GDPR/CCPA right-to-know + right-to-delete.

### 3.G — Crisis incident response runbook

Operational, not technical. `docs/runbooks/crisis-incident.md`:
- Who's on-call.
- What's a P0 (any failure on `/crisis`, 988 link broken, Lumi suggesting self-harm topic without escalation).
- How to push an emergency content-only patch in < 15 min.
- Post-incident review template.
- **Blast radius:** doc-only.
- **Success metric:** drill quarterly; MTTR < 15 min for content-only P0.

### 3.H — Deployment & environment hygiene

You're on Replit deployments. Elite hygiene:
- **Health gates:** `/healthz` (liveness), `/readyz` (readiness — DB + AI + Stripe reachable), `/api/health` (verbose). All three already exist and pass — keep them as deployment-gate.
- **Blue/green or canary:** if Replit deployments support traffic split, route 5% to canary; auto-rollback on Sentry error-rate spike.
- **Secrets hygiene:** rotate `JWT_SECRET`, `ADMIN_TOKEN` quarterly; document rotation in `docs/runbooks/secret-rotation.md`; never read secret values inside Agent flow.
- **Backups:** automated daily DB snapshot + 30-day retention + monthly restore drill (documented).
- **Blast radius:** ops, mostly doc.
- **Success metric:** restore drill passes monthly; secret-rotation cadence met.

### 3.I — AI cost & safety governance

Lumi runs on Perplexity. Add:
- **Per-user daily token cap** (soft warning at 80%, hard cap at 100%) with calm copy ("Lumi needs a rest — try again in a bit").
- **Per-request cost log** to a `ai_usage` table for trend analysis.
- **Prompt-injection defenses:** input sanitization, system-prompt isolation, never echo system prompt, refuse role-override patterns.
- **Red-team CI:** `scripts/lumi/red-team.mjs` runs 50 adversarial prompts (jailbreak, self-harm, medication, legal-advice, financial-advice) on every release. Hard fail on any leak.
- **Blast radius:** medium.
- **Success metric:** zero red-team escapes per release; AI spend forecastable ± 10%.

### 3.J — Admin surface elevation

You have 27 admin pages. Elite admin:
- **Single shell:** `/admin/*` uses one `AdminShell` with breadcrumbs + last-saved + audit-trail panel.
- **Audit trail:** every write logged `{actor, ts, action, before, after, ip}` to `admin_audit` table; viewable at `/admin/audit`.
- **Read-only mode:** flag-flip to freeze writes during incidents.
- **Two-person rule:** destructive admin actions (delete user, mass email, content publish) require a second admin approval within 10 min.
- **Blast radius:** medium.
- **Success metric:** any admin-induced incident traceable in < 60 s.

### 3.K — Testing pyramid

Today's pyramid is implicit. Make it explicit:
- **Unit:** Vitest, `*.test.ts` colocated; target 60% coverage on `shared/`, `server/storage`, `lumi-*`.
- **Integration:** Vitest against in-memory storage; per-API contract.
- **E2E:** Playwright + the `testing` skill, scripted against canonical routes + the 6 critical journeys (signup, first checkin, crisis path, Lumi conversation, journal create, account delete).
- **Visual regression:** Playwright + pixelmatch for the 10 most-trafficked surfaces.
- **Smoke in prod:** the existing `/healthz`/`/readyz`/`/api/health` probe expanded to a 30-second canary suite, scheduled.
- **Blast radius:** additive.
- **Success metric:** main-branch green required to deploy; canary suite runs every 15 min in prod.

### 3.L — Documentation as a product

You already treat docs as a product (this is rare and good). Polish:
- **Versioned governance:** `docs/governance/` gets `CHANGELOG.md` for kernel revisions.
- **Phase index:** `docs/reports/_INDEX.md` auto-generated from filenames; current count > 100.
- **Search:** ship `docs/.search-index.json` so internal search across all docs is instant.
- **Onboarding:** `docs/onboarding/NEW_AGENT.md` (≤ 1500 lines) — what a new agent needs to be safe on day one.
- **Blast radius:** doc-only.
- **Success metric:** new agent productive in < 1 hour; zero "where do I find X" loops.

---

## 4. Cross-cutting matrices

### 4.1 Domain × Surface contamination guardrail

A simple rule, hard to violate once tooled:

| Surface | Allowed copy domains | Forbidden copy domains |
|---|---|---|
| `/crisis` | CRISIS only | BUSINESS, PLATFORM, marketing |
| `/dashboard` | HEALING + (small) PLATFORM (settings link) | BUSINESS pricing/upsell |
| `/lumi/*` | HEALING + CRISIS | BUSINESS, PLATFORM debug |
| `/pricing`, `/billing` | BUSINESS + (link to) CRISIS footer | HEALING flow copy |
| `/admin/*` | PLATFORM | HEALING reflection language |

Tool this with the copy-lint (1.C) by mapping route → allowed-vocabulary set.

### 4.2 Crisis routing checklist (every page)

- Footer link to `/crisis` (verified, not behind login).
- Floating "Need help right now?" affordance on healing surfaces (dismissible per session, not per app).
- Lumi system prompt contains crisis-detection block; verified by red-team.
- 988, 741741, 911 numbers hard-coded in three places: `/crisis` page, footer, Lumi response template. **Never** sourced from a fetch (offline-safe).

### 4.3 Reduced-motion + a11y matrix

Every new component PR must show:
- Screenshot motion ON.
- Screenshot motion OFF.
- Axe scan output (0 critical/serious).
- Keyboard-only traversal video (or notation).

### 4.4 Bundle budget matrix

| Chunk | Today | 90-day target | 180-day target |
|---|---:|---:|---:|
| Main entry (raw) | 751 kB | 500 kB | 250 kB |
| Largest route chunk | TBD | 150 kB | 100 kB |
| Total brand images | TBD | -50% | -70% |

(Measure today; lock numbers in `PHASE_104_BUNDLE_BASELINE.md`.)

---

## 5. 30 / 60 / 90 Day Roadmap

**Day 0–30 — Foundations + close audit gaps**
- Phase 104: Privacy duplicate route resolution (ship Phase 99 decision).
- Phase 105: `/admin-login` + `/content-admin` migration with 301s.
- Phase 106: `/buddy` route implementation.
- Phase 107: Voice Spec doc + banned-word lint (1.B + 1.C).
- Phase 108: Image pipeline scripts (2.H) — re-run Phase 80 Step 4 with real pairs.
- Phase 109: Bundle baseline measurement + budget lock (extension of Phase 103).
- Phase 110: Crisis page audit + hardening (1.E).

**Day 31–60 — Trust, design system, observability**
- Phase 111: `/account/data` reveal/export/delete (3.F).
- Phase 112: Design system canonization + lint (2.A + 2.B).
- Phase 113: Motion system consolidation (2.C).
- Phase 114: Observability second wave — pino + web-vitals (3.C).
- Phase 115: AI cost cap + ai_usage table (3.I).
- Phase 116: Lumi red-team script + CI hook (3.I + 2.E).

**Day 61–90 — Resilience, scale, polish**
- Phase 117: CSP + headers strict-mode (3.E).
- Phase 118: Admin shell + audit trail + two-person rule (3.J).
- Phase 119: Testing pyramid + scheduled canary (3.K).
- Phase 120: Email lifecycle templates + Resend ramp (1.H).
- Phase 121: SEO schema + sitemap automation (1.I).
- Phase 122: Route registry-as-code refactor (3.A).
- Phase 123: Crisis runbook + drill (3.G).

Each phase ships under the v7.4 contract: diagnose → smallest patch → verify → next.

---

## 6. Anti-patterns to refuse, on sight

1. **"Just one quick fix"** in a healing flow that includes pricing copy.
2. **"Let's A/B test the crisis page."** No. Crisis page is locked content.
3. **"We can build this in a hub."** Without IA lock (1.A), every "hub" deepens the duplicate-route problem.
4. **"The webp variant is close enough."** Phase 80 Step 4's lesson: no swap is a format swap unless it's truly the same art.
5. **"We'll add the disclaimer later."** Disclaimers are gates, not garnishes.
6. **"Animation tells a story."** Yes — and `prefers-reduced-motion` overrides the story.
7. **"The admin page is internal, skip a11y."** No. The admin team also includes humans on screen readers.
8. **"Let's let Lumi handle X."** AI is for logic only, never for compliance, billing, or routing decisions.
9. **"Push directly to prod for a tiny copy fix."** Even tiny goes through the runbook.
10. **"The bundle grew 30 kB, ship it."** Budget exists to be enforced, not displayed.

---

## 7. Success — what "elite" looks like in 90 days

- Lighthouse a11y = 100 on every public route. Perf ≥ 90 on every healing route on mobile 4G.
- Bundle main < 500 kB raw; route chunks < 150 kB.
- 100% of healing surfaces use design-system tokens; 0 raw hex.
- Crisis surface verified weekly; 988/741741/911 hard-coded; reduced-motion verified; offline-resilient.
- Lumi red-team script: 100% pass on 50 adversarial prompts.
- `/account/data` shipped; users can reveal + export + delete in 3 clicks.
- One canonical IA spine; sitemap audit shows 0 duplicates; taxonomy audit at 22/22 + 29/29.
- Observability dashboards live; any regression detectable in < 5 min.
- AI spend forecastable ± 10%.
- Phase ledger past 120; every phase has diagnose + patch + verify artifacts.
- One published runbook per critical surface (crisis, billing, admin, AI, deployment).
- Zero domain contamination incidents in the last 30 days (HEALING ≠ BUSINESS ≠ PLATFORM enforced by lint).

---

## 8. What this document does **not** do

- Modify any source file.
- Reorder phases already locked.
- Override governance kernel decisions.
- Introduce new dependencies (only recommends, awaits owner approval).
- Claim certainty where the kernel demands evidence. Every recommendation above is to be validated with diagnose-before-patch.

---

*Doc-only deliverable. Zero source changes. Author + ownership: main agent under MMHB v7.4 kernel. Next action: owner selects which Day 0–30 phases to greenlight; each then opens with its own diagnose phase before any patch lands.*

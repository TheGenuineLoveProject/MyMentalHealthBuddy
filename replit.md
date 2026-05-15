# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support globally, striving to reduce stigma and empower individuals.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible
- DRY-RUN FIRST
- Non-destructive (never delete without permission)
- Educational only (no diagnosis, no treatment claims)
- Original writing only
- WCAG AA accessibility
- Calm, consent-based language
- Always include /crisis routing on wellness content
- Replit-safe execution only
- If unsure, ask ONE clarifying question. Never guess.

## Governance Kernel — MMHB v7.4 (Locked 2026-05-06)
All AI-assisted development is governed by the **MMHB v7.4 Archival Kernel** at `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`. Key contracts:
- **Primary Law:** Business logic never appears in healing flows; healing responses never contain pricing, conversion, or platform debugging.
- **Domain routing:** Every request classified as HEALING / BUSINESS / PLATFORM before solutioning. Cross-domain contamination is a critical failure.
- **Engine model:** Smallest valid engine wins (CSS fix > React patch > new component > new page > new service).
- **BHCE:** Crisis escalation overrides all rules; explicit self-harm signal → 988 + Crisis Text 741741 + 911 + `/crisis`. Asymmetric risk: err toward resource provision.
- **Execution discipline:** Diagnose with evidence → smallest patch → screenshot verify → build check → next blocker. Never skip verify, never multi-blocker, never proceed past a failed gate.
- **Replit mode:** Shell for mechanical work, AI for logic only, adapter mode (preserve structure, thin wrappers, zero breaking changes).
- **Output contract:** What changed (files+lines) / Before / After / Build status / Next step. No speculation, only verified fixes.
- **Circuit breaker:** Same bug recurring 3× after fix → architectural review, not another patch.

## Polish & Feature History

**Archive notice:** Entries older than v5.8.65 removed to keep this file lightweight. Entries v4.1.1 → v5.8.64 archived to `docs/replit-history.md`. Full deep-technical detail for every release lives in `docs/changelog.md`.

### Index (v5.8.65 – v5.8.82)

| Version | Date | Modules | Key Change |
|---|---|---|---|
| v5.8.82 | 2026-05-15 | Settings.jsx + MemorySettingsPanel.tsx hook fix + Footer.jsx + CanvaLanding.jsx mobile menu (P6 activation surface) | INSPECT-first uncovered MemorySettingsPanel.tsx had a pre-existing compile-blocker: lines 34-35 referenced `useMemoryStore`/`selectConsent`/`selectLiveEntries` directly but none were imported (raw store + internal selectors are intentionally NOT exported from barrel per Phase 16 contract; the public hooks `useMemoryConsent` + `useMemoryLiveEntries` were imported at L12-13 but never used). File would have crashed first time it ran — explains why Phase 16 stayed shelved. Smallest valid engine: 4 files. (1) Fix panel hooks to use the imported public read surface. (2) Mount panel + transparency view in `/settings` (`pages/Settings.jsx`) between Privacy and Referral sections — a 17-line `<section>` block with `Brain` icon, opt-in copy, and explicit "never feelings, vulnerabilities, or crisis history" reassurance. (3) Footer.jsx: add Settings link with cog icon between Newsletter and Disclaimer (public — `ProtectedRoute` redirects unauthed to login). (4) CanvaLanding.jsx mobile hamburger Account section: gate Settings link on `isAuthenticated()` so signed-in users see it under "My Dashboard" (per user spec: mobile + footer, NOT desktop header). Result: clicking "Allow gentle memory" in /settings flips `consent.state="granted"` → v5.8.80 ReturnLoop tier-aware welcome auto-activates on next visit (writes silently no-op'd until consent granted, so this is the one button that turns P6 on for real users). tsc 0 errors, vite 19.81s, /health+/ready+4 routes 200 (incl /settings). P7 (Arm & Leg Movement) queued as next blocker per user. |
| v5.8.80 | 2026-05-15 | ReturnLoop.jsx + lumi-memory store persistence (P6 Path B — Emotional Continuity, first Phase 16 consumer) | INSPECT-first uncovered the dormant Phase 16 Reflective Memory Layer (`client/src/lumi-memory/`) — fully built, hardened (consent + retention + audit + forbidden-pattern scan), 0 production callers. P6 ask was already over-spec'd by Phase 16 — gap was wiring + persistence. Smallest valid engine: 2 files. ReturnLoop now (a) reads prior `lastSessionAt` via `readMemory()` BEFORE writing fresh, (b) computes days-since-last, (c) picks message from tier subset (`<1d` short / `1-7d` medium / `7+d` long), (d) writes new `lastSessionAt` via `writeMemory()` (silently no-ops when consent unset/declined — intentional). All 10 messages preserved across tier indices `[0,2,3]/[1,5,9]/[4,6,7,8]` (none orphaned, no new copy). useMemo→useState; try/catch falls back to v5.6 random on any router failure. **Architect catch:** memoryStore.ts had no persist middleware — `lastSessionAt` would have evaporated on every reload, making P6 dead in production. Wrapped Zustand `create()` with `persist(...)` + `createJSONStorage(localStorage)` + `partialize` (consent + entries only; audit stays in-memory). Tier boundary tightened from `<= 7` to `< 7` so day-7 routes to long per spec literal "7+". Pre-opt-in users see zero UX change. tsc 0 errors, vite 18.80s, /health+/ready+3 routes 200. P3/P7-P10 + LUMI_PATH commission + chat pilot deferred. |
| v5.8.79 | 2026-05-15 | LumiV7.jsx (P4 T4 — Avatar Life System Phase 1 emotion wiring) | Inspect-first found T1-T3 already shipped in LumiV7 (4 eye CSS classes, lerp-tracked pupils ±10/±6, randomized 2-6s blink + 15% double, `prefers-reduced-motion`, `.is-crisis` stillness); only T4 emotion wiring missing. Added optional `emotion` prop deriving eye+mouth from canonical V24 `EMOTION_STATES` (lumiEmotionMap.ts) via `getEmotionState()`. Explicit `eye`/`mouth` props always win (preserves AvatarLab per-variant gallery). Crisis fallback emits `soft`+`calm` only when explicit eye/mouth absent (motion stillness enforced unconditionally by `.is-crisis` CSS + effect early-returns). 3 surgical edits, 1 file (+12 net lines). Smallest valid engine per V34 — declined to duplicate work into LumiV6 (which is preview-only PNG-based, would have failed `DUPLICATION_GATE`). tsc 0 errors, vite 26.66s, bundle 753.79 kB (+2.4 kB). LumiV6/V8 archive deferred. P2 (sprout walking-path) skipped per user. |
| v5.8.78 | 2026-05-15 | replit.md Tier C trim + V35 prompt library install | v5.8.67-72 verbose rows compressed to one-liners (12.4k → 5.9k chars). V35 library installed at `prompt-os/v35-prompt-library.md` (168L, 10 prompts indexed). Full v5.8.67-72 detail prepended to `docs/changelog.md` (now 2891L). |
| v5.8.77 | 2026-05-15 | replit.md trim + Tier B archive removal | Rolled v5.8.74-76 verbose rows into one-liners; full detail moved to `docs/changelog.md`. Deleted `client/public/brand/v17/.archive-v5.8.76/` (12 files, 4.0 MB, zero refs). Combined w/ v5.8.76 = ~8.7 MB freed total. tsc + vite build clean. |
| v5.8.76 | 2026-05-15 | Unofficial avatar removal (sprout-only enforcement) | Repointed 14 live refs across 8 source files (`lumiAssets`, `nlpMiContent`, `PageTemplate`, `LumiV6`, `BuddyAvatar`, `LumiMascotImage`, `OnboardingFlow`, `officialLumiRegistry`+`VisualBenefits`) from legacy `/brand/v17/avatar-*` (cream-blob) to canonical `/lumi/official/lumi-{float-idle,heart,meditation}.png` (sprout-only per V26). Tier A rm: 4 placeholder-bak + 5 .archive-pre-v5.8.40 (~4.7 MB). Tier B mv→archive: 12 legacy avatars (4.1 MB). Pre-existing missing `lumi-path.png` repointed to `lumi-float-idle.png`. Final state: 7 sprout PNGs + MANIFEST in `/lumi/official/`; 4 benefit-scene pairs only in `/brand/v17/`. Full detail → `docs/changelog.md`. |
| v5.8.75 | 2026-05-15 | V29 Phase 1 hybrid nav (CanvaLanding + BrandShell) | Action-first 8-link desktop strip (Home·Tools·Check-In·Companion·Journal·Blog·Crisis·Pricing); Crisis link in rose accent; mobile menu reorganized into 4 sections (Core/Discover/Trust/Account). BrandShell.jsx: 3 inert Journal/Mood/Check-In `<button>`s replaced with wouter `<Link>` wrappers — clicks now actually navigate. Full detail → `docs/changelog.md`. |
| v5.8.74 | 2026-05-15 | Canonical Lumi sprout-only replacement (`/lumi/official/` × 7 + `benefit-companionship.png`) | All-sprout V26 mandate. 7/8 canonical PNGs replaced with sprout artwork (`LUMI_SOFT_PRESENCE`, `LUMI_HEART`, `LUMI_CALM_FLOAT`, `LUMI_MEDITATION`, `LUMI_COMPANION`, `LUMI_EMOTION_ORB`, `LUMI_FLOAT_IDLE`). 1 exception: `LUMI_PATH` kept on hooded source pending sprout walking-path commission. Hooded `benefit-companionship.png` swapped to sprout halo (708 KB vs 2.2 MB prior). 8 placeholders preserved as `*.placeholder-bak.png` siblings. Zero code changes — registry path constants unchanged. Full detail → `docs/changelog.md`. |
| v5.8.73 | 2026-05-15 | PAGE_PLACEMENT_MAP enrollment + history archive | 6 new page entries (breathing/journal/habits/library/settings/chat), 6 call sites wired with `pageId`, floor guard 18→24, CanvaLanding footer via RUNTIME_ONLY_VARIANTS, replit.md 152→137 lines, docs/replit-history.md +15 rows |
| v5.8.72 | 2026-05-15 | OfficialLumi page integration (Path A) + CanvaLanding L1262 swap | Canonical Lumi rendered on 7 pages. Last legacy `<LumiMascot>` swapped to `<OfficialLumi LUMI_FLOAT_IDLE>` (footer 28px). 5 no-avatar pages got OfficialLumi: Breathing (LUMI_MEDITATION 120px), Journal (LUMI_SOFT_PRESENCE 100px), Habits (LUMI_PATH 100px), SavedLibrary (LUMI_EMOTION_ORB 100px), Settings (LUMI_COMPANION 60px). AIChatPage got header LUMI_HEART 48px. All `decorative` aria-hidden. Architect catch: added required `scene` + `position` (jsx files mask type errors). Skipped CrisisResources (BHCE) + CheckIn (BuddyAvatar). Full detail → `docs/changelog.md`. |
| v5.8.71 | 2026-05-15 | sections/VisualBenefits.jsx (V25 pose mapping) | Live homepage benefit rows pointed at legacy `/brand/v17/avatar-*.png` (bypassing canonical registry). Swapped 4 `avatar`/`avatarWebp` fields to canonical paths: meditation→LUMI_MEDITATION, heart→LUMI_HEART, companionship→LUMI_COMPANION, growth→LUMI_PATH. `avatarWebp` set to undefined (PNG-only canonical assets; `<ResponsiveImage>` falls back cleanly). 16:9 background scenes untouched. Full detail → `docs/changelog.md`. |
| v5.8.70 | 2026-05-15 | hxos-vnext.css (utility token expansion) | Iter 2g Option C non-destructive. Appended 4 utility tokens to `.hxos-vnext`: `--glp-warm-white #FAFAF7`, `--glp-light-gray #F0EDE6`, `--glp-border rgba(22,58,54,0.08)`, `--glp-shadow rgba(22,58,54,0.06)`. Brand accents (violet, gold) NOT overridden per Universal Contracts. Zero `!important`. All 9 wrapped routes auto-pick-up. Full detail → `docs/changelog.md`. |
| v5.8.69 | 2026-05-15 | Iter 2g Part B closeout + toast UI sink | Portal audit confirmed zero portal surface (no createPortal, no Radix, no Toaster mount) — Phase 5 caveat closed as no-op. Bonus: added `client/src/components/ui/toast-container.tsx` (96L custom, zero deps, subscribes to useToast memoryState, fixed bottom-24 right-6 z-60 to clear AccessibilityToolbar). Resolves silent toast calls in Settings L117/121/126. `useToast` API untouched. Full detail → `docs/changelog.md`. |
| v5.8.68 | 2026-05-15 | hxos-vnext.css + 8 page wrappers | Iter 2g Phases 2-5. Visual unification across 8 routes (CheckIn, Breathing, Journal, AIChat, Habits, SavedLibrary, Settings, CrisisResources) via opt-in `client/src/styles/hxos-vnext.css` (14-token `.hxos-vnext` override + rose-only `.hxos-vnext-crisis`). Each page got wrapper class. brand-tokens.css untouched (70 non-opted pages unaffected). Full detail → `docs/changelog.md`. |
| v5.8.67 | 2026-05-15 | canva-landing.css (HX-OS vNEXT scoped tokens) | Iter 2g Phase 1. 14 `--glp-*` tokens redefined inside `.canva-landing` only (warm-cream paper, ink-teal, sage-deep, soft-sage, dusty-rose + 9 alpha derivatives). Global `brand-tokens.css` untouched (78 other consumers unchanged). Approved page-scoped governance exception for sage/rose accent divergence from locked palette. Full detail → `docs/changelog.md`. |
| v5.8.66 | 2026-05-14 | CanvaLanding header (Iter 2c canonical Lumi swap) | First legacy `<LumiMascot>` swapped to `<OfficialLumi pageId="landing-canva">` on `/` header (L360, 48px). 8 canonical PNGs bridged to `/lumi/official/` with provenance manifest. |
| v5.8.65 | 2026-05-14 | lumi-backend, lumi-notifications, lumi-rbac, lumi-audit, lumi-tokens, lumi-language, lumi-disclaimer | 7 backend + HX-OS vNEXT integration modules, 25 files. Crisis regex `i`-flag fix. `tsc` + vite build clean. |

### Part B — Portal Token Audit (CLOSED)

- **Status:** NO-OP — deferred caveat moot
- **Finding:** Zero portal mounts in codebase (0 `createPortal`, 0 Radix UI, 0 Dialog/Toaster/Tooltip)
- All modals/dropdowns render inline in React tree — already inherit `.hxos-vnext` tokens via Phase 2-5 page wraps
- Architect deferred caveat closed by audit — no edits needed

### Universal contracts

Every polish layer above honors these (and any new layer must too):

- Scoped under a unique `.{name}-polish` wrapper class — zero leak risk.
- All accent / aura / particle / glow color values drawn from the canonical 8-hex brand palette (sage `#A8C9A0`, sunshine `#FFD93D`, blush `#FF9A8B`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`, mint `#A8D5BA`, warmth-orange `#FFB88C`, heart-amber `#E8913A`). Neutral base RGBAs (cream / white / black with low alpha) permitted only for ambient overlays, drop-shadows, and ring-on-white outlines, never as a brand accent.
- `prefers-reduced-motion: reduce` blanket: particles `display:none`, animations/transitions killed, transforms pinned.
- Z-index contract: decorative layers 0/1/2 → content `relative z-10`.
- Crisis routing (`/crisis`, 988, 741741) preserved on every wellness surface.

### Quick Reference

```bash
# Build verification
npm run build                  # vite ~16s clean

# Type check
npx tsc --noEmit               # clean across all 16 opt-in modules

# Bundle size
# 751.39 kB main (modules tree-shaken; zero production wiring)
```

```ts
// To import a module: opt-in — import what you need, nothing more
import { COLORS, alpha } from "@/lumi-tokens";
import { translateNegation } from "@/lumi-language";
import { REQUIRED_DISCLAIMER, enforceDisclaimer } from "@/lumi-disclaimer";
```

For complete per-version detail, file breakdowns, and architect reviews → see `docs/changelog.md`.

## System Architecture

### UI/UX Decisions
The frontend features a Canva-inspired design using HSL color formatting, custom typography, enhanced gradients, and refined shadows, with an "Aurora Token System" for light/dark themes and WCAG AA accessibility. A "Buddy Engine" provides a visual companion. The Lumi Design System v2.0 offers an additive visual system with new tokens, typography, dark-mode mapping, and brand assets including a mascot. The platform includes five additive React pages for Discernment, Protocols, Biometrics, and Admin, two marketing pages, and a public tools directory. Eight interactive, client-side wellness tools are provided, each with crisis links and accessibility features. Motion respects `prefers-reduced-motion`.

### Technical Implementations
The project uses a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies, integrating with the AI chat. An "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an audit log and a three-tier memory abstraction (Hot, Warm, Cold). "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, encrypting data at rest and supporting OAuth integrations. The "Discernment Tutor" is an awareness-training belt ladder over the awareness detection pipeline, using scenario-based lessons. The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs, seeded with ten evidence-informed protocols. An SEO content generation script drafts trauma-informed blog posts.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards and an "Admin Command Center" with an "SOP Monitor." The `/growth` page serves as a "Metacognition Mirror," and the "Peace Scape" surface provides a sanctuary environment.

Both chat surfaces (`AIChatPage.jsx`, `AIChatPanel.tsx`) display the canonical Lumi mascot avatar on assistant bubbles and typing indicators (with `lumi-breathe` motion and graceful `onError` fallback). The home footer surfaces Home, About, Tools, Wisdom, Blog, Newsletter, Disclaimer, Privacy, Terms, and Crisis routes through its 4-column block plus the `SafetyFooter` strip. Signup-intent CTAs route to `/register`; "Sign In" buttons remain on `/login`. The canonical Lumi mascot lockup uses a soft sage radial halo across all auth and landing surfaces. The `/chat` surface renders a top breadcrumb nav with **Back to Dashboard**, Home, Journal, Mood, and a right-aligned rose **Crisis Support** link.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints, utilizing OpenTelemetry tracing and PagerDuty alerting. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair. Autoscale deployment uses split build/run phases to optimize cold-start times. The system AI prompt is extended with governance sections for canonical domain classification, UX contract integration, tone guidelines, a reflection prompt library, a Therapeutic Framework Reference Library (Motivational Interviewing, Active Listening, Validation Support, Rapport Building, Metacognition Prompts, Belief Exploration, Emotion Processing, Strength-Based Coaching, NLP-Informed Communication, Safety Boundaries) with an explicit hard rule against framework-name leakage to users, and crisis escalation protocols. Admin panels are wrapped in `<SafeBoundary>` for error isolation.

## External Dependencies

- **OpenAI API**: AI chat therapy.
- **Vite**: Frontend build tool.
- **TypeScript**: Language.
- **React**: Frontend UI library.
- **Wouter**: Client-side routing.
- **React Hook Form**: Form management.
- **Zod**: Runtime type validation.
- **Tailwind CSS**: Styling framework.
- **Lucide React**: Icons.
- **Node.js**: Backend runtime.
- **Express**: Backend web framework.
- **Express Session**: Session management.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Helmet**: Security headers middleware.
- **Compression**: Response compression middleware.
- **Morgan**: HTTP request logger middleware.
- **Sentry**: Error tracking and performance monitoring.
- **Drizzle ORM**: Database interactions.
- **Neon PostgreSQL**: Primary database.
- **Stripe**: Billing and payment processing.
- **Replit Auth**: User authentication.
- **Resend**: Transactional email service.
- **Perplexity**: Factual AI.
- **Oura**: Biometric data integration.
- **Google Fit**: Biometric data integration.
- **Whoop**: Biometric data integration.
- **Apple HealthKit**: Biometric data integration (via webhook).
- **PagerDuty**: Alerting and incident management.

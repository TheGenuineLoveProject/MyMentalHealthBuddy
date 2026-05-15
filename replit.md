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

**Archive notice:** Entries older than v5.8.50 removed to keep this file lightweight. Entries v4.1.1 → v5.8.39 archived to `docs/replit-history.md`. Full deep-technical detail for every release lives in `docs/changelog.md`.

### Index (v5.8.50 – v5.8.69)

| Version | Date | Modules | Key Change |
|---|---|---|---|
| v5.8.69 | 2026-05-15 | Iter 2g Part B closeout (portal audit) + toast UI sink | **Phase 5 deferred caveat closed.** Audit confirmed zero portal surface in `client/src/`: no `createPortal`, no `@radix-ui` imports, no `<Toaster>`/`<Sonner>` mount, and `SacredModal` / `AgeConfirmationModal` / `dropdown-menu` / `popover` / `select` all render inline within the React tree. No portal escape exists on the 9 HX-OS vNEXT routes — caveat resolved as no-op. **Bonus fix (orphan toast bug):** added `client/src/components/ui/toast-container.tsx` (96 lines, custom, zero deps — subscribes to existing `useToast` memoryState, fixed bottom-right, max-w 320px, z-50, auto-dismiss 3s, opacity+translateY enter/exit transitions, X close button, role=status/alert by variant). Mounted once in `App.jsx` L1907 inside `ErrorBoundary` (sibling of lazy-widgets `<Suspense>`). Toast colors hardcoded to HX-OS vNEXT values inline (warm-cream paper / ink-teal text / sage-or-rose accent border per variant) — **no `.hxos-vnext` class on container**, since that class also applies `min-height:100vh` + `background-color` and would create a full-viewport invisible block at the bottom-right corner (architect catch). Container offset to `bottom-24` and lifted to `z-index:60` to clear AccessibilityToolbar (`bottom-6 right-6 z-50`) and other fixed widgets in the same corner cluster. Resolves silent toast calls in `Settings.jsx` L117/121/126 (previously dispatched into memoryState with no UI sink). `useToast` hook API untouched. tsc + vite build clean (17.25s). |
| v5.8.68 | 2026-05-15 | hxos-vnext.css + 8 page wrappers (CheckIn, BreathingExercisesPage, JournalPage, AIChatPage, HabitsHubPage, SavedLibrary, Settings, CrisisResources) | **Iter 2g Phases 2-5.** Visual unification across 8 live routes via shared opt-in CSS file `client/src/styles/hxos-vnext.css` (1 import in `index.css`, 14-token override on `.hxos-vnext`, rose-only override on `.hxos-vnext-crisis` per Phase 5 brief exception). Each page got class added to its outermost JSX wrapper (CheckIn: appended to existing className; AIChatPage + HabitsHubPage: fragment→div swap; 5 others: wrapped existing shell). `brand-tokens.css` untouched — 70 non-opted-in pages unaffected. CrisisResources urgent styling preserved (no cream bg override, only rose accent unified). Architect PASS. **Deferred caveat:** portal-rendered UI (toasts/modals/dialogs mounted to `document.body`) escapes the `.hxos-vnext` subtree and won't inherit the new tokens — needs follow-up audit if portal theming is in scope. vite build clean (18.47s). |
| v5.8.67 | 2026-05-15 | canva-landing.css (HX-OS vNEXT scoped tokens) | **Iter 2g Phase 1.** Visual unification on `/`. 14 `--glp-*` tokens redefined inside `.canva-landing` only (warm-cream `#F6F1E8` paper, ink-teal `rgb(22,58,54)`, deep-teal `rgb(47,93,93)` sage-deep, soft-sage `rgb(143,191,159)`, dusty-rose `#C4787A` + 9 alpha derivatives). Global `brand-tokens.css` untouched — other 78 `var(--glp-*)` consumers unchanged. Canonical brand accents (gold/violet/aurora) preserved per Universal Contracts. **Approved governance exception:** CanvaLanding's local sage/rose accent values diverge from the locked 8-hex palette under explicit Iter 2g scope; exception is page-scoped, documented inline in `canva-landing.css` L34-48, and does NOT extend to other surfaces without a Phase 2-5 brief. tsc + vite build clean (14.83s). |
| v5.8.66 | 2026-05-14 | CanvaLanding header (Iter 2c canonical Lumi swap) | First legacy `<LumiMascot>` swapped to `<OfficialLumi pageId="landing-canva">` on `/` header (L360, 48px). 8 canonical PNGs bridged to `/lumi/official/` with provenance manifest. |
| v5.8.65 | 2026-05-14 | lumi-backend, lumi-notifications, lumi-rbac, lumi-audit, lumi-tokens, lumi-language, lumi-disclaimer | 7 backend + HX-OS vNEXT integration modules, 25 files. Crisis regex `i`-flag fix. `tsc` + vite build clean. |
| v5.8.64 | 2026-05-14 | lumi-cbt, lumi-tracker, lumi-crisis, lumi-library, lumi-agent + Phase 30b OfficialLumi flip | 5 clinical modules, 40 files. CBT thought-record + ACT defusion, mood/habit tracker (`streakGuard`), 988 crisis resources, AI agent adapter with 8 guardrails. `OfficialLumi` flipped to `<img>`-only. |
| v5.8.63 | 2026-05-14 | lumi-registry (Phase 30 + 31 reconcile) | Reconcile-mode delta: 8th canonical variant `LUMI_FLOAT_IDLE`, asset fields on all variants, `lumiMotion.css` (locked 7.1s breath), opt-in `renderMode`/`motion` props, `RUNTIME_ONLY_VARIANTS` whitelist, 11-entry replacement audit. |
| v5.8.62 | 2026-05-14 | lumi-registry (Phase 28 + 29) | 7 canonical variants frozen, 25 emotional roles, 17-page placement map (floor-guarded), `OfficialLumi` + `LumiSceneRenderer`, trust boundaries: forbidden surfaces render hidden, unknown `pageId` refuses. |
| v5.8.61 | 2026-05-13 | lumi-integration smoke test | Cross-module integration tests (23/23 across 4 suites): type-surface alignment + governance + identity verification + end-to-end ritual flow. Frozen mapping tables (`AVATAR_TO_SCENE`/`RITUAL_TO_SCENE`/`RITUAL_TO_AVATAR`). |
| v5.8.60 | 2026-05-13 | lumi-voice, lumi-boundaries, lumi-consistency | Web Speech API wrapper (vol cap 0.4, 23 forbidden phrases, 4 anti-manipulation regexes), 4 boundary types + transparency drawer, 8 consistency tokens + 10 enforcement rules + 7-check identity verification. |
| v5.8.59 | 2026-05-13 | Presence page wiring | First production wiring of 4 opt-in modules (`lumi-circadian`/`lumi-memory`/`lumi-rituals`/`lumi-scenes`) onto `/presence`. 6 new feature flags (admin-only by default), route guard + first-checkin gate, SSR-safe lazy-init `localStorage` flag. |
| v5.8.58 | 2026-05-13 | lumi-circadian | Presence Scheduler & Circadian Calm. 5 phases, OFF by default, `MAX_NUDGES_PER_DAY=3`, 5-min spacing, sleep window 22-7, no required responses. |
| v5.8.57 | 2026-05-12 | lumi-rituals | 7 ritual presets (softArrival/oneBreathReset/grounding54321/gentleTransition/holdingSpace/sleepSoftener/tinyHope), pure reducer, never-persists, `/crisis` anchor in every status. |
| v5.8.56 | 2026-05-12 | lumi-scenes | 7 emotional scene presets, locked numeric ceilings, 14 forbidden effects, soft 1.5s crossfade, avatar identity frozen behind `children`. |
| v5.8.55 | 2026-05-12 | lumi-memory | Reflective Memory Layer. 10 ALLOWED FIELDS (floor-guarded), 7 FORBIDDEN CATEGORIES (≥25 patterns), consent state machine, 6-step write router, audit log capped, atomic revocation wipe. |
| v5.8.54 | 2026-05-11 | lumi-conversation | Phase 15 spec-aligned variant (parallel to v5.8.52). 8-step safety pipeline, 8-tone classifier, 60+15 forbidden phrases/regexes, 8 boundary rules, grounding (15) + reflection (15) prompts, crisis safety in 3 layers. |
| v5.8.53 | 2026-05-11 | calm-checkin | Phase 14 spec-aligned variant (parallel to v5.8.51). 4s/2s/6s × 1 cycle, 3 entry options (Breath/Grounding/Reflection), no progress bars, no streaks. |
| v5.8.52 | 2026-05-11 | companion-voice | Phase 15 first-pass: `MMHBCompanion` conversational shell, 11 EmotionCategory classifier, response bank, depth-cap router, deferred LLM augmentation. |
| v5.8.51 | 2026-05-10 | checkin-flow | Phase 14 first-pass: 4-7-8 × 4 breathing flow, gentle UI, opt-in. |
| v5.8.50 | 2026-05-10 | legacyMap.ts | Phase 12 Wave 1 reconciliation bridge — opt-in, zero page edits, maps legacy avatar/asset references onto canonical registry slots. |

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

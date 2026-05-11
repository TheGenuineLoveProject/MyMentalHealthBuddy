# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support globally, striving to reduce stigma and empower individuals. The business vision is to make mental wellness support accessible, ethical, and personalized, leveraging AI to foster self-love and emotional growth. The project ambition is to become a leading global platform for mental wellness, empowering individuals and reducing stigma around mental health.

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
Detailed implementation notes for completed feature evolutions live in **`docs/changelog.md`**. That file is the source of truth for the deep technical contracts (z-index, reduced-motion, keyframe timing, cascade order, etc.) of:
- v5.8.7 — V3 round/no-hood benefit illustrations + `sharp` dep cleanup. Regenerated all four `VisualBenefits` heroes as round, hood-less, transparent-background plush mascots with the requested Pompompurin / Cinnamoroll / Chiikawa DNA at the same fidelity bar as the V17 avatars: `benefit-relief-v3` (sage→calm-blue plush, closed meditation eyes, breath bubbles), `benefit-understanding-v3` (lavender Cinnamoroll-DNA plush cradling a pastel-purple heart), `benefit-growth-v3` (sunshine-gold Pompompurin-DNA plush with sprout + golden sparkles), `benefit-companionship-v3` (blush-coral plush, big tender smile, paw waving, floating hearts). Two retries on relief + companionship to scrub residual robe/kimono/cloak elements from the first pass via aggressive negative-prompting (`robe, hood, kimono, monk robe, cloak, cape, scarf, blanket wrap, swaddled, towel wrap, clothing, sash, belt, hat, costume, outfit, dress, shawl`). Pipeline: `generateImage(removeBackground:true)` → `cp` to `client/public/brand/v17/` → `cwebp -q 85` (~12-20 KB WebP / 600-800 KB PNG, ~98% transfer reduction). `VisualBenefits.jsx` image paths repointed to `-v3` variants; avatar overlay (using V17 `avatar-{breathing,heart,floating}.{png,webp}`) untouched, `<picture>`+lazy/async wiring untouched, sensory-tag pills + reveal IO untouched. Also: `npm uninstall sharp` removed an unused 0.34.5 dep that had been silently auto-installed (architect-flagged in v5.8.6 review; verified zero `import "sharp"` / `require("sharp")` references in the entire codebase before removal).
- v5.8.6 — V12 Phase 3 breathing tool polish (`/tools/breathing` → `BreathingTool.jsx` + `styles/breathing-tool.css`). Additive deltas on top of the already-shipped polish layer (background tint, particles, concentric rings, progress, reduced-motion blanket): (1) **Per-sub-phase color drift** — `.breath-ring--inner/outer` border-color and `.breathing-particle` background swap blue/purple/sage on `[data-breath-sub="inhale|hold|exhale"]` with 1.6s ease transition; (2) **Soft glow halo** — new `<span.breath-glow>` behind avatar (z-index −2) with box-shadow that pulses on the same 10s breath cycle and re-tints per sub-phase; (3) **SVG ring progress** — replaced 3 horizontal pill segments with `<svg>` circles using stroke-dasharray (circumference 2π·11≈69.12); pending=track only, active=75% drawn + drop-shadow pulse, done=full + checkmark. ARIA tightened per architect: SVG rings are `aria-hidden="true"` + `focusable="false"` (parent `progressbar` retains semantics with new `aria-valuetext` describing breath number AND sub-phase). Reduced-motion blanket extended to suppress transition/animation/filter on `.breath-progress-ring__fill` for ALL states (not just active) and to pin `.breath-glow` transform/animation. Cadence: 10s breath cycle = 0.1Hz, 2.5s active-ring pulse = 0.4Hz — both well below 3Hz seizure-safety bar. Existing `BuddyAvatar` resolution (pose/style/colorMode), phase state machine, breath-circle scale, and crisis stillness all untouched. Triple gate: TSC=0, Build=17.95s.
- v5.8.5 — Avatar perf pass: `<picture>` + WebP-first across `BuddyAvatar.tsx` + `LumiV6.tsx` (V17 nobg paths only — `pickWebp()` helper guards v4 themes from spurious 404s). 14 KB WebP vs 268 KB PNG = **94.8% transfer reduction** on every Lumi render. Added `imageLoading` (lazy/eager/auto) + `fetchPriority` (high/low/auto) props; defaults conservative (lazy) but set to `eager` + `high` on the 5 above-fold hero call sites: `Header.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`. Added `decoding="async"` everywhere. Architect-review-driven LCP fix (lazy default would have delayed first-paint of header logo + login/register hero). React 19 prop case (`fetchPriority` not `fetchpriority`). Triple gate: TSC=0, Build=16.31s. Visual verify clean on `/login` + `/`. Motion class on `<img>`, fallback `onError`, V6 overlay positioning, and aura/shadow layering all preserved.
- v5.8.4 — Transparent-background V17 avatars across all unframed surfaces. Generated `avatar-{floating,breathing,heart}-nobg.{png,webp}` (removeImageBackgroundTool → 512px → cwebp -q 85, 14–22 KB WebP / 263–365 KB PNG). Repointed `BuddyAvatar.tsx` (COLOR_MODE_SRC, FALLBACK_LUMI, all POSE_SRC entries), `LumiV6.tsx` (COLOR_PNG, POSE_PNG, FALLBACK_PNG), `lumiAssets.js` (lumiDefaultUrl), `PageTemplate.jsx` (lumiIconUrl), and `LumiMascotImage.jsx` (lumiFullBodyPng) to `-nobg` variants. Hero + VisualBenefits intentionally kept on framed (with-bg) variants. Color theme variants (yellow/pink/blue/purple/orange/sleep) and sanrio styles preserved on v4 (only fire on explicit user theme selection).
- v5.8.3 — Universal V17 swap.
- v5.8.2 — Hero avatar V17 alignment. The hero on `CanvaLanding.jsx` was rendering `<LumiV6 size="xl" emotion="greeting" v8 ... />` — a smooth round v4 plush avatar that visually clashed with the new V17 hooded plush Lumi anchoring the four `VisualBenefits` rows (`avatar-breathing`, `avatar-heart`, `avatar-floating`). Swapped the hero render to a `<picture>` element pointing at `/brand/v17/avatar-floating.{webp,png}` (the same asset that anchors the Growth row), with `<source srcSet=".webp" type="image/webp">` + `<img src=".png" loading="eager" decoding="async" fetchpriority="high">` so first paint pulls the optimized 9 KB WebP (~98% of traffic) with the 230 KB PNG as fallback. Kept the existing `.hero-lumi-wrapper` (sage radial halo, 800ms scale-in entrance, hover lift) untouched and re-applied the `lumi-breathe` class so the V17 image breathes at the established 0.5 Hz rate (from `client/src/styles/lumi-motion.css`). Removed the now-unused `LumiV6` import from `CanvaLanding.jsx`; `LumiV6` itself is untouched and remains the canonical companion across Header, Footer, chat surfaces, login flows, etc. Triple gate: TSC=0, Build=15.06s. Net: hero now matches the rest of the V17 visual storytelling — same character, same warmth, same hood — without disturbing any other Lumi surface.
- v5.8.1 — V17 spec-alignment pass: image optimization (cwebp+ImageMagick → 98 KB WebP / 3.5 MB PNG fallback, was 9 MB), `<picture>` element + lazy/async, sensory-word pill tags via `color-mix`, spec-faithful section copy + CTAs, header reveal animation. Canonical palette preserved (rejected spec's off-palette `#F7B7A3`/`#F4B942` in favor of `#FF9A8B`/`#FFD93D`). See `docs/changelog.md`.
- v5.8.0 — V17 Visual Emotional Storytelling: 4-row alternating image/text section on `CanvaLanding` between `EmotionalJourney` and `Philosophy`. 7 AI illustrations + `VisualBenefits.jsx` (`IntersectionObserver` reveal, no framer-motion) + scoped `visual-benefits.css`. Introduced `.btn-sacred-gold` global utility + universal button micro-interaction layer. Reduced-motion blanket covers everything. See `docs/changelog.md`.
- v5.7.8 — Self-hosted fonts (root-cause fix for mobile FCP=26s under Google Fonts 503s). 11 woff2 files (~216 KB) at `client/public/fonts/`, inline `@font-face` block in `client/index.html`, removed all `googleapis`/`gstatic` references across 7 leftover files (architect-driven sweep), bumped serviceWorker `CACHE_VERSION` to 2.2.0. See `docs/changelog.md`.
- v5.7.7 — Async-load Google Fonts (preload+swap pattern), crossorigin preconnect, dedup. Shipped before v5.7.8 made it moot. See `docs/changelog.md`.
- v5.7.6 — Lighthouse SEO + perf: header CTA descriptive text + `aria-label` (`"Start Your Free Account"` desktop / `"Start Free"` mobile). System-font fallback chains strengthened across `index.css` + `brand-tokens.css`. See `docs/changelog.md`.
- v5.7.5 — Lighthouse SEO descriptive link text: `CanvaLanding` feature cards → `"Explore {title}"`, hero tertiary + `ConsentBanner` got descriptive `aria-label`s. "Page blocked from indexing" diagnosed as Replit-injected `.replit.app` Disallow (not a code defect — re-audit canonical domain). See `docs/changelog.md`.
- v5.7.4 — SEO meta descriptions on 8 priority pages. 5 had `<SEO>` (description swapped); 3 added (`CanvaLanding`, `AIChatPage`, `About`); `client/index.html` default swapped. See `docs/changelog.md`.
- v5.7.3 — Canonical domain swap to `mymentalhealthbuddy.com`. 75+ URL refs across 19 surfaces flipped from `thegenuineloveproject.com`. See `docs/changelog.md`.
- v5.7 — NLP + Motivational Interviewing Content Engine (V18 port). New `data/nlpMiContent.js` (5 page content objects with affirmation/openQuestion/reflection/presupposition/embeddedCommand + sensory-word tags) + new `sections/NlpMiContent.jsx` 7-section renderer mounted on `CanvaLanding` after `EmotionalJourney`. Framework names never leak to users (Therapeutic Framework Reference Library hard rule).
- v5.6 — V16 Emotional Convergence + Hero/CTA polish. New 3-tier hero CTA hierarchy ("Talk With Buddy" / "Take a Calm Check-In" / "Explore Safely"), 4-pill trust strip, `ReturnLoop.jsx` (visit-count-gated rotating banner) + `MicroWinPrompt.jsx` (45s idle dialog). Additive-only `.btn-sacred-*` polish on hero/Pricing/Header/Footer with palette focus rings + reduced-motion blankets. `WelcomeBackBanner` yields when ReturnLoop fires (single welcome surface).

**Older entries (v4.1.1 – v5.5)** are summarized in `docs/changelog.md`. Topics covered: Subscription Elicitation Layer (v5.5), Engagement Hooks Layer (v5.4), V14 audio coordinator + Lumi voice/expression sync (v5.1–5.3), Emotional Journey timeline (v5.0), `/v6` Control Panel + Breathing/Check-In/Celebration polish (v4.6–4.9), Hero Polish (v4.5), LumiV9 "Soul Capture" (v4.3–4.4), Schema Drift Guardrail (v4.2), Avatar Uniformity (v4.1).

**Universal contracts** that every polish layer above honors (and any new layer must honor):
- Scoped under a unique `.{name}-polish` wrapper class — zero leak risk.
- All accent / aura / particle / glow color values are drawn from the canonical 8-hex brand palette (sage `#A8C9A0`, sunshine `#FFD93D`, blush `#FF9A8B`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`, mint `#A8D5BA`, warmth-orange `#FFB88C`, heart-amber `#E8913A`). Neutral base RGBAs (cream / white / black with low alpha) are permitted only for ambient overlays, drop-shadows, and ring-on-white outlines, never as a brand accent.
- `prefers-reduced-motion: reduce` blanket: particles `display:none`, animations/transitions killed, transforms pinned.
- Z-index contract: decorative layers 0/1/2 → content `relative z-10`. (v4.5.1 normalization added explicit tiers to the hero `.hero-depth-layer` and `.decorative-orb` so the hero matches every other surface.)
- Visual-first additions: phase logic, localStorage math, ARIA wiring, and BuddyAvatar/LumiV6 integration are preserved on every surface. Two intentional UX exceptions are documented in the changelog: (a) Check-In v4.7 defers the emotion-card → intensity-phase transition by 350ms (skipped under reduced motion) so users perceive the selection pulse before the grid unmounts; (b) Celebration v4.8 forces a `<section>` remount per phase via `key={phase}` so the entrance animation replays — neither alters end-state behavior.
- Crisis routing (`/crisis`, 988, 741741) preserved on every wellness surface.

## System Architecture

### UI/UX Decisions
The frontend features a Canva-inspired design using HSL color formatting, custom typography, enhanced gradients, and refined shadows, with an "Aurora Token System" for light/dark themes and WCAG AA accessibility. A "Buddy Engine" provides a visual companion. The Lumi Design System v2.0 offers an additive visual system with new tokens, typography, dark-mode mapping, and brand assets including a mascot. The platform includes five additive React pages for Discernment, Protocols, Biometrics, and Admin, two marketing pages, and a public tools directory. Eight interactive, client-side wellness tools are provided, each with crisis links and accessibility features. Motion respects `prefers-reduced-motion`.

### Technical Implementations
The project uses a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies, integrating with the AI chat. An "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an audit log and a three-tier memory abstraction (Hot, Warm, Cold). "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, encrypting data at rest and supporting OAuth integrations. The "Discernment Tutor" is an awareness-training belt ladder over the awareness detection pipeline, using scenario-based lessons. The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs, seeded with ten evidence-informed protocols. An SEO content generation script drafts trauma-informed blog posts.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards and an "Admin Command Center" with an "SOP Monitor." The `/growth` page serves as a "Metacognition Mirror," and the "Peace Scape" surface provides a sanctuary environment.

Both chat surfaces (`AIChatPage.jsx`, `AIChatPanel.tsx`) display the canonical Lumi mascot avatar on assistant bubbles and typing indicators (with `lumi-breathe` motion and graceful `onError` fallback). The home footer surfaces Home, About, Tools, Wisdom, Blog, Newsletter, Disclaimer, Privacy, Terms, and Crisis routes through its 4-column block plus the `SafetyFooter` strip. The `FeedbackWidget` floating action supports a 7-day localStorage suppression (`mmhb-feedback-suppressed-until`) via the dedicated "7d" hide button **and** the X close button. `BuddyAvatar.tsx` renders the canonical Lumi PNG with `lumi-breathe` animation gated by `v.motion !== 'steady'` so crisis state stays still per the original safety contract. `AIChatPanel.tsx` reads the API response shape `data?.response?.reply || data?.reply || data?.message || data?.error` with a gentle `/crisis`-routing fallback so server-shape drift never surfaces "No response returned" to the user.

Signup-intent CTAs ("Start Free", "Get Started Free", "Start Your Journey — Free") on `CanvaLanding.jsx` and `Pricing.jsx` (free-tier card) route to `/register`; "Sign In" buttons remain on `/login`. The canonical Lumi mascot lockup uses a soft sage radial halo (`radial-gradient` with `overflow: visible`) instead of the legacy hard square frame; applied across `Header.jsx`, `Footer.jsx`, `CanvaLanding.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, and `ResetPassword.jsx`. The `/chat` surface renders a top breadcrumb nav (`data-testid="nav-chat-breadcrumbs"`) with **Back to Dashboard**, Home, Journal, Mood, and a right-aligned rose **Crisis Support** link.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints, utilizing OpenTelemetry tracing and PagerDuty alerting. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair. Autoscale deployment uses split build/run phases to optimize cold-start times. The system AI prompt is extended with governance sections for canonical domain classification, UX contract integration, tone guidelines, a reflection prompt library, a Therapeutic Framework Reference Library (Motivational Interviewing, Active Listening, Validation Support, Rapport Building, Metacognition Prompts, Belief Exploration, Emotion Processing, Strength-Based Coaching, NLP-Informed Communication, Safety Boundaries) with an explicit hard rule against framework-name leakage to users, and crisis escalation protocols. Admin panels are wrapped in `<SafeBoundary>` for error isolation.

## External Dependencies

-   **OpenAI API**: AI chat therapy.
-   **Vite**: Frontend build tool.
-   **TypeScript**: Language.
-   **React**: Frontend UI library.
-   **Wouter**: Client-side routing.
-   **React Hook Form**: Form management.
-   **Zod**: Runtime type validation.
-   **Tailwind CSS**: Styling framework.
-   **Lucide React**: Icons.
-   **Node.js**: Backend runtime.
-   **Express**: Backend web framework.
-   **Express Session**: Session management.
-   **CORS**: Cross-Origin Resource Sharing middleware.
-   **Helmet**: Security headers middleware.
-   **Compression**: Response compression middleware.
-   **Morgan**: HTTP request logger middleware.
-   **Sentry**: Error tracking and performance monitoring.
-   **Drizzle ORM**: Database interactions.
-   **Neon PostgreSQL**: Primary database.
-   **Stripe**: Billing and payment processing.
-   **Replit Auth**: User authentication.
-   **Resend**: Transactional email service.
-   **Perplexity**: Factual AI.
-   **Oura**: Biometric data integration.
-   **Google Fit**: Biometric data integration.
-   **Whoop**: Biometric data integration.
-   **Apple HealthKit**: Biometric data integration (via webhook).
-   **PagerDuty**: Alerting and incident management.
-   **Redis**: Agent working memory (optional).

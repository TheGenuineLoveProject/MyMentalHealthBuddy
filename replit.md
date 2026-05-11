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
- v5.7.6 — Lighthouse SEO + perf follow-up. **(1) Descriptive link text**: `CanvaLanding.jsx` header `/register` CTA — visible text upgraded from `"Start Free"` (desktop) / bare `"Start"` (mobile, Lighthouse-flagged) → `"Start Your Free Account"` (desktop) / `"Start Free"` (mobile), plus `aria-label="Start your free MyMentalHealthBuddy account"` on the button so the accessible name is descriptive at every viewport. **(2) Font render-blocking resilience**: Google Fonts URLs in `client/index.html` already carry `&display=swap` (verified — sets `font-display: swap` on every Google-injected `@font-face` so text paints in fallback if the stylesheet 503s); we have no app-owned `@font-face` declarations to patch. Strengthened the system-font fallback chains so FOUT-then-swap looks consistent and never goes invisible: `client/src/index.css` body / headings / `.font-sacred` / `.font-healing` / `.font-display` and `:root` `--font-display` / `--font-body`, plus `client/src/styles/brand-tokens.css` `--glp-font-display` / `--glp-font-heading` / `--glp-font-body` — all sans chains now read `'Inter' | 'Poppins', 'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`; serif chains gained `'Times New Roman'` before the generic `serif`. `'Geist Sans'` is intentionally a phantom fallback (we don't ship the file) — browsers that don't have it skip silently to the system stack. Triple gate: TSC=0, Build=14.43s, Drift=0.
- v5.7.5 — Lighthouse SEO follow-up. **Descriptive link text** (additive): `CanvaLanding.jsx` feature-card links changed from generic `"Explore"` (×4 duplicate) → `"Explore {feature.title}"` with matching `aria-label` so each of the 4 cards has a unique, self-descriptive accessible name; hero tertiary `"Explore Safely"` got `aria-label="Explore wellness features safely"` (visible text preserved); `ConsentBanner.jsx` `"Learn more"` → `"Learn more about our privacy practices"` + matching `aria-label` (Lighthouse explicitly flags the bare phrase). **"Page is blocked from indexing" diagnosis**: NOT a code defect — production custom domain `mymentalhealthbuddy.com/robots.txt` serves `Allow: /` and homepage meta reads `index, follow`. Flag only fires when auditing the `.replit.app` URL, which Replit's hosting layer injects with `Disallow: /` to prevent duplicate-content indexing (intentional, not fixable in app code; was documented in v5.7.3). User should re-audit the canonical custom domain. Triple gate: TSC=0, Build=17.05s, Drift=0.
- v5.7.4 — SEO meta descriptions on 8 priority pages (Lighthouse remediation). One-line: 5 surfaces had existing `<SEO>` (description prop swapped); 3 had none (added `<SEO>` to `CanvaLanding`, `AIChatPage`, `About`); `client/index.html` default also swapped. See changelog for routing nuance on `/about` (matches `ConfigRoute` first; About SEO is defensive — proper fix is per-route meta in `client/src/content/routes.js`).
- v5.7.3 — Canonical domain swap to `mymentalhealthbuddy.com`. Flipped 75+ URL refs across 19 surfaces from `thegenuineloveproject.com` → `mymentalhealthbuddy.com` (sitemap, robots.txt, SEO components, RSS feeds, og:url, canonicals). Preserved: parent-org mailtos, JSON-LD `Organization` publisher entries, `social.ts`, and 48 published social-post bodies. See changelog for the full file list and the `.replit.app` Disallow constraint.
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

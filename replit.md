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
- v5.7.4 — SEO meta descriptions on 8 priority pages (Lighthouse remediation). User supplied 8 descriptions (all ≤155 chars). Updated existing `<SEO description>` prop on `BreathingTool.jsx`, `CheckIn.jsx`, `CelebrationFlow.jsx`, `BlogIndex.jsx` (also brand-flipped title to MyMentalHealthBuddy), and `Pricing.jsx` (= `PricingReal` via lazy alias at App.jsx:256). Added new `<SEO>` component to surfaces that previously had none: `CanvaLanding.jsx` (home), `AIChatPage.tsx` (wrapped `<AIChatPanel />` in fragment), and `About.jsx`. Also swapped `client/index.html` static `<meta name="description">` to the homepage description so the SPA-shell fallback is meaningful for any route that hasn't yet React-mounted (or doesn't mount its own SEO). Routing nuance: `/about` matches `<ConfigRoute>` (App.jsx:385) before the explicit `<About />` route (line 1600), so the new About SEO is defensive — live `/about` currently inherits the new index.html default; per-route description in `client/src/content/routes.js` / `PageTemplate` is the proper future fix and is flagged in the changelog. Triple gate: TSC=0, Build=15.84s, Drift=0; all 8 strings confirmed shipped in `client/dist` JS bundles. Additive only, zero new packages, zero visual changes, crisis routing untouched.
- v5.7.3 — Canonical domain swap to `mymentalhealthbuddy.com`. Diagnosed via direct production audit of both `mymentalhealthbuddy.replit.app` and `mymentalhealthbuddy.com`: the `.replit.app` URL serves a Replit-injected `User-agent: * / Disallow: /` (intentional platform behavior to prevent duplicate-content with custom domains — not fixable in app code, audit the custom domain only); `mymentalhealthbuddy.com` was self-canonicalizing to `https://thegenuineloveproject.com/` (parent nonprofit) on every page + serving a 41-URL sitemap full of `thegenuineloveproject.com` `<loc>` entries — Google was being told "the real version of these pages lives on a different host." Per user clarification (MMHB is the product, TGLP is the parent org), flipped 75 individual URL references across 19 surfaces from `https://thegenuineloveproject.com` → `https://mymentalhealthbuddy.com`. Wholesale replaces: `client/public/sitemap.xml` (41 `<loc>`), `client/public/robots.txt` + `public/robots.txt` (`Sitemap:` line), `client/src/components/SEO.tsx` (`SITE_URL` const default), `client/src/hooks/useSEO.ts` (BASE_URL fallback), `client/src/components/ShareableReflectionCard.jsx` (PNG watermark URL), `tools/generate-sitemap.mjs` (`DOMAIN` const), `server/routes/blog.mjs` (4 RSS feed URLs), `server/routes/content.mjs` (1 article ogImage), `static-export/sitemap.xml` (10), `static-export/robots.txt`, `static-export/blog.html`, `client/src/pages/admin/SocialStudioAdmin.jsx` (UTM base), `client/src/pages/admin/AdminPublishing.jsx` (blog share URL). Partial replaces (preserving Organization JSON-LD publisher = parent nonprofit's actual URL): `client/index.html` (6 of 8 lines flipped — preserved 91, 92), `static-export/index.html` (8 of 10 — preserved 78, 79), `seo_meta_blocks.json` (1 of 3 — preserved 129, 130), `static-export/seo-metadata.json` (1 of 3 — preserved 129, 130). Intentionally untouched per user instruction: `Footer.jsx` + `SupportPage.tsx` + `Privacy.jsx` + `LegalPage.jsx` (real org email mailtos: `support@`, `privacy@thegenuineloveproject.com`), `client/src/config/social.ts` (org's social-profile website URL), `client/src/pages/admin/SocialGenerator.jsx` (org-marketing CTA inside YouTube description copy template), `content/narrative/social_posts.json` (48 published social-media post bodies that mention the org by name + URL — these are the parent org's published voice). robots.txt rules + auth-page noindex from v5.7.2 untouched. Triple gate: TSC=0, Build=14.99s, Drift=0. Live `/sitemap.xml` first 3 entries serve `https://mymentalhealthbuddy.com/`, `/about`, `/about/approach`; `/robots.txt` `Sitemap:` line serves the new domain; homepage canonical + og:url serve the new domain. Post-deploy: 1–14-day Google re-crawl propagation; submit new sitemap via Google Search Console to accelerate.
- v5.7 — NLP + Motivational Interviewing Content Engine (V18 port). NEW `client/src/data/nlpMiContent.js` — 5 page content objects (`/`, `/tools/breathing`, `/checkin`, `/celebration`, `/chat`) each carrying headline, subline, trustLine, affirmation, openQuestion, reflection, presupposition, embeddedCommand, paired CTAs, and (home only) 4 benefit sections with sensory-word tags (visual / auditory / kinesthetic). NEW `client/src/sections/NlpMiContent.jsx` — single component renders the 7 sub-sections (affirmation banner → open question → reflection → embedded command → benefit cards → presupposition → CTAs) using IntersectionObserver reveal (NOT framer-motion — preserves the v5.6 contract), Lucide icons only, scoped under `.nlp-mi-polish` so styles never leak. Sensory words highlighted with palette tints (visual=calm-blue, auditory=empathy-purple, kinesthetic=sage). Mounted on `CanvaLanding.jsx` directly after `<EmotionalJourney />` and before the Philosophy section. Governance: NLP/MI framework names never surface to the user (per the existing Therapeutic Framework Reference Library hard rule); section labels stay human ("A Gentle Question", "Lumi Reflects", "What Awaits You"). Crisis routing untouched (page-level SafetyFooter handles it). prefers-reduced-motion blanket pins reveal + hover transforms; WCAG AA contrast preserved on every text color.
- v5.6 polish — Hero & Top CTA polish (additive). `canva-landing.css` btn-sacred-gold and btn-sacred-secondary refined: gentle `translateY(-1px)` hover (no scale), `translateY(1px)` 90ms press state, soft shadow growth/shrink via 280ms cubic-bezier transitions, palette-tinted focus-visible rings (gold for warm, sage-deep for calm). NEW `.btn-sacred-tertiary` class for V16's "Explore Safely" — sage-deep underline link with hover lift + underline-offset shift + arrow translate. `brand.css` `.btn-premium` / `.btn-secondary-premium` (Pricing tier buttons) gained matching `:active` press states, 3px palette focus rings, hover lift parity, and reduced-motion blankets. Header & Footer extension (added in same v5.6 wave): NEW `.btn-header-cta` class on `TglpNavbar` Get Started / Start / Dashboard gold pill (composes additively with existing Tailwind utilities — only adds transform + shadow + 3px gold focus ring); NEW `.btn-header-secondary` on the Sign In text link (subtle lift + 3px sage focus ring); NEW `.footer-nav-link` on all 9 Footer nav links (no hover lift to keep dense rows calm, but consistent 3px sage focus ring). Tool cards, form/modal buttons, and `/v6` panel untouched per user scope.
- v5.6 — V16 Emotional Convergence (4 of 5 transformations shipped; tool-label transform skipped — source labels do not exist in the codebase). Hero rewritten on `CanvaLanding.jsx`: H1 → "You don't have to / carry everything alone."; serif subheadline → "A calm companion for gentle check-ins, emotional support, and quiet moments when you need someone there."; new 4-pill trust strip ("Private", "No judgment", "Emotionally safe", "Designed for calm") with sage-tinted background between subheadline and "You Are Safe Here" badge; 2-CTA hero block replaced with 3-tier hierarchy — Primary "Talk With Buddy" (gold) → /chat if authed else /register, Secondary "Take a Calm Check-In" (outline) → /checkin, Tertiary "Explore Safely" (text underline) → "#features" anchor. New `components/ReturnLoop.jsx` sticky-top z-50 banner with 5 rotating tone-matched messages (sage/gold/lavender/mint/rose accents from canonical palette), gated by `localStorage["mmhb_visit_count"] >= 2` (incremented once per browser session), 800ms reveal delay, dismissible via `mmhb:returnloop_dismissed` sessionStorage flag, hidden on `/crisis`. New `components/MicroWinPrompt.jsx` fixed bottom-center z-40 dialog (yields z-index to ConsentBanner per architect catch), 45s idle detection across click/scroll/keydown/touchstart, once per session via `mmhb:microwin_shown`, auto-focuses close button on appear, Esc dismisses, 3 options (Take one calm breath → /tools/breathing, Name how you feel → /checkin, Meet your companion → /chat or /register). v5.5 `WelcomeBackBanner` updated with a yield guard so it self-suppresses when `mmhb_visit_count >= 2` — only one welcome-back surface ever fires. framer-motion intentionally NOT used (not a dep); CSS animations with `prefers-reduced-motion` blanket throughout. Additive only, zero new packages.
- v5.5 — Subscription Elicitation Layer (4th hero stat "10,000+ Buddy Conversations" on `CanvaLanding`; `Pricing.jsx` "Most Popular" badge restyled with warmth-orange `#E8913A` + per-tier money-back text under Pro/Elite CTAs; new `sections/EmailCapture.jsx` "Stay Connected With Lumi" strip on the homepage between FAQ and the final CTA, sharing the v5.4 `mmhb:email_subscribers` localStorage key; new `sections/PricingFAQ.jsx` 5-question accordion under TrustSignals on `/pricing`; new `sections/ValueBridge.jsx` 3-card free→Pro upsell between testimonials and ValueProposition on the homepage; new `components/WelcomeBackBanner.jsx` slim sage strip rendered inside `<main>` after `SkipToContent`, gated by `sessionStorage["mmhb:returning_visitor"]` (seeded silently on first visit, shown on subsequent navigations) with `mmhb:welcome_dismissed` X-kill, hidden on `/crisis`, CTA → `/chat` if `mmhb_token` present else `/login`. Additive only, zero new packages.)
- v5.4 — Engagement Hooks Layer (`sections/ValueProposition.jsx` full + compact variants with `mmhb:email_subscribers` localStorage signup; `sections/NextStepCTA.jsx` 6-context driver — after-breathing / after-checkin / after-celebration / general / about / blog) wired into CanvaLanding, About, Blog, BreathingTool, CheckIn, CelebrationFlow. Additive only, zero new packages, every variant carries a /crisis deep link.
- v5.3 — V14 universalized via shared audio coordinator (BuddyAvatar/LumiMascot now ship the same pop/heartbeat/chime as LumiV6; module-scoped one-shot pop, single-owner heartbeat, app-wide 2s chime debounce; PageTemplate nav logo migrated off raw `<img>` onto BuddyAvatar)
- v5.2 — V14 wired into LumiV6 (entrance pop / heartbeat sync / interaction chime — all gated by the v5.1 audio toggle, default OFF)
- v5.1 — Lumi Voice + Expression Sync (V14 engine — gentle Web Audio cues, default OFF, gated behind localStorage preference `lumi:audio:enabled`, surfaced on `/v6`)
- v5.0 — Emotional Journey Section (V13 port — 6-phase visual timeline on landing page)
- v4.9 — /v6 Control Panel Polish
- v4.8 — Celebration Polish
- v4.7 — Check-In Polish
- v4.6 — Breathing Tool Polish
- v4.5 — Homepage Hero Polish
- v4.4 — LumiV9.6 + V9.7 "Soul Capture" additions
- v4.3 — LumiV9 "Soul Capture"
- v4.2 — Schema Drift Guardrail (`scripts/checkSchemaDrift.mjs`)
- v4.1 — Avatar Uniformity (canonical Lumi PNG everywhere)
- v4.1.1 — Learning Library bug fix

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

# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support, reducing stigma and empowering individuals globally.

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

## System Architecture

### UI/UX Decisions
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, respecting `prefers-reduced-motion`. A dynamic Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations. Branded elements emphasize an "Aurora Token System" for consistent visual effects, extending to scrollbars and input fields. The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes, including crescent eyes, a dot-matrix heart, and animated limbs, all maintaining existing CSS animation hooks and `prefers-reduced-motion` compliance.

### Technical Implementations
The project is a monorepo with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot via `ensureSchema.mjs`, running idempotent `CREATE TABLE IF NOT EXISTS` statements for various tables. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks.

### Feature Specifications
The `/pricing` page renders a single h1 ("Choose What Feels Right") inside its own gradient hero — the generic `WellnessPageShell` wrapper is invoked without `title`/`subtitle` props to avoid a duplicate page heading. Tier cards use `gap-2` between price and period and use `var(--glp-sage-deep)` (with 0.78–0.82 opacity) for body text, achieving ≈7.5:1 contrast on `var(--glp-paper)` backgrounds.
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment with a ZenScape backdrop, displaying the user's sanctuary palette, accessory, theme, and computed evolution stage. A `CustomizerPanel` lets authenticated users save palette (6 options), accessory (7 options), and theme (6 options) via `PATCH /api/peacescape/state` — values are validated against server-side allowlists and upserted into `user_avatars` (parameterized Drizzle SQL with COALESCE for partial updates). Guests can preview choices locally with a soft "sign in to remember" notice. An `InteractiveBuddy` wrapper lets users tap the sanctuary Buddy to cycle through positive expressions (calm → encouraging → curious → celebratory → nudging); the wrapper is hard-locked when state is `crisis`, preserving the v2.11 crisis-color stability gate without modifying `BuddyAvatar.tsx`. The `ZenScape` backdrop is now palette/theme/accessory aware: the root `.zenscape` element sets `data-zen-palette` and `data-zen-theme` data-attributes that drive a CSS-variable cascade (`--zen-cool`, `--zen-cool-deep`, `--zen-warm`, `--zen-cool-rgb`, `--zen-warm-rgb`, `--zen-petal-rgb`, `--zen-wash-tail-rgb`). Defaults `sage` + `meadow` produce byte-identical visuals to v1, so the 6 zen surfaces that don't opt in are unchanged. SVG `<stop>` elements use inline `style={{ stopColor: var(--zen-cool, fallback) }}` for gradient hue. An optional accessory glyph (`✦ ♡ ❋ ☾ ☀ ⌇`) floats above Buddy via a `.zenscape__buddy-stack` wrapper with a 6s float animation gated by `prefers-reduced-motion`. PeacescapePage refetches `/api/peacescape/state` on `storage` and `focus` events so the customizer leaves "guest" mode without a manual reload.

ZenScape additionally accepts an optional `stage` prop (1–6) that emits a `data-zen-stage` attribute on the root. When the attribute is present, a stage-driven CSS cascade reveals progressively more visuals: stage 1 (Seed Garden) shows 2 petals + dim rings, stage 2 (First Bloom) shows 3 petals, stage 3 (Tended Grove) shows 4 petals + the first sparkle, stage 4 (Mossy Sanctuary) shows 5 petals + 3 sparkles, stage 5 (Living Forest) shows all 6 petals + 4 sparkles, and stage 6 (Inner Cathedral) adds a soft `mix-blend-mode: screen` aura that breathes via `zenAuraBreathe`. Sparkles are always rendered (5 spans inside `.zenscape__sparkles`), opacity-gated per stage, and twinkle via `zenSparkleTwinkle`. When `stage` is omitted the attribute is not emitted, so all callers without explicit stage data render byte-identical to v1/Layer 4. PeacescapePage forwards `stage={stage.stage}` from `/api/peacescape/state` to the hero ZenScape. All Layer 5 animations (sparkle twinkle, stage-6 aura) are gated by `prefers-reduced-motion`.

The homepage final-CTA section ("Your Buddy Is Ready. Are You?") was tightened in CanvaLanding.jsx + canva-landing.css to address two visual issues from user screenshots:
- **Manifesto quote ("We didn't build another app...") font visibility** — the `text-white` Tailwind utility was being overridden by some descendant cascade rule, leaving the dark green panel text near-invisible. Switched the `<p>` to inline `style={{ color: 'var(--glp-paper)' }}` (#fcf6ea, ~16:1 on the dark sage gradient panel) so the cascade can't override it.
- **Final CTA section height + plain buttons** — the section was using global `.section-breathe` (5/7/8rem padding) and the buttons were minimal pills. Replaced `section-breathe` with new `cta-enterprise--compact` class (3/4.5/5.5rem padding, ~30-40% shorter footprint). Replaced inline button styles with two new utility classes: `.cta-btn-primary` (light gold gradient `#fbe39a → #f4d271 → #e7bf5d` with `var(--glp-sage-deep)` text — all stops kept bright enough to clear AA 4.5:1, measured ~12:1 / ~10:1 / ~8.7:1 across the gradient — embossed inset highlights, outer warm glow, and a hover sheen sweep) and `.cta-btn-secondary` (dark sage frosted glass `rgba(6,42,42,0.55)` with white text and 1.5px gold border at 70% opacity — composites to ~5.9:1 even at the bright `var(--glp-sage)` half of the section gradient, AA pass). Both buttons fully respect `prefers-reduced-motion` (transitions disabled and `transform: none !important` on hover to neutralize Tailwind `hover:scale-[1.04]`).

The `/crisis` page underwent a WCAG AA contrast remediation pass. CrisisResources.jsx now meets AA across all text:
- Hotline descriptions, self-care tip body, and "You Are Not Alone" reminder switched from `var(--glp-sage)` (#1ec890, ~1.7:1 on cream) to `var(--glp-sage-deep)` (#062a2a, ~14:1).
- "Back to Dashboard" link switched from `var(--glp-sage)` to `var(--glp-sage-deep)` for legibility on the cream hero.
- Phone CTA buttons (4 sites: hotline call, bottom action, "talk to buddy", "journal") now use a dark gradient `linear-gradient(135deg, var(--glp-sage-deep), var(--glp-ink))` with `var(--glp-paper)` text — ~14:1 across the entire button surface (was ~2.0:1 at the light end of the prior `sage → sage-deep` gradient).
- Text-988 badge keeps its `var(--glp-gold) → var(--glp-gold-dark)` gradient but now uses `var(--glp-sage-deep)` foreground (was `var(--glp-paper)` at ~2.95:1).
- "In immediate danger?" body copy switched from `var(--glp-rose-dark)` (#e11d48 on rose-20 ≈3.8:1) to `var(--glp-ink)` (#142626 ≈13:1); the heading retains rose-dark for emergency emphasis (qualifies as large text under AA).
- The decorative `HandHeart` icon on the rose gradient remains paper-on-rose (aria-hidden, exempt from text-contrast rules).

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol.

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
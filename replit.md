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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, respecting `prefers-reduced-motion`. A dynamic Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations. Branded elements emphasize an "Aurora Token System" for consistent visual effects, extending to scrollbars and input fields.

### Technical Implementations
The project is a monorepo with React 18 (TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing (`healing/`) and administrative (`business/`) engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses.

The "Buddy Engine" is a separate visual companion layer that renders alongside the AI Chat orchestrator, with its own typed contract (`/api/buddy` v1.9) for visual output and DOM mirroring for accessibility and testing. The visual avatar (BuddyAvatar v1.15 "screen-face robot" redesign — visually inspired by a friendly white desktop-companion robot reference image supplied by the user) uses a layered SVG design with: a square white head with rounded corners and a glassy dark face screen filling most of the head, soft state-tinted CRESCENT eyes (◡ ◡) on the screen instead of round dots, a small camera-lens pip at the top of the screen, a square white body with rounded corners + chunky rounded arm pads on the sides (like the bumper-style arms on the reference robot), a recessed chest plate hosting an LED-style DOT-MATRIX heart (28 small circles arranged in a 7×6 heart-pattern grid, all wrapped in a single `.buddy__heart-shape` group so the existing CSS heartbeat keyframe pulses every dot together as one organism), a small dark speaker/grille slot below the heart, a round disc base ("puck") under the body with a state-tinted status LED at the front, a state-tinted ambient aura, a state-tinted floor pool, a chunky bridging neck collar that fuses head ↔ body into one silhouette, and a small antenna pip on the head with a softly pulsing outer halo. Crucially the redesign preserves every CSS animation hook (`.buddy__antenna circle:nth-of-type(1)`, `.buddy__heart-shape`, `.buddy__heart-glow`, `.buddy__heart-core`, `.buddy__eye buddy__eye--left/right`) so the existing keyframes (heartbeat, eye-blink, antenna-ping, aura-breathe, floor-breathe, state-specific motion variants) drive the new geometry without any CSS surgery. All rendered within the same 200×240 viewBox and using only the three canonical CSS variables (`--buddy-eye-color`, `--buddy-heart-color`, `--buddy-heart-pulse`) so every accent shifts color naturally with the BuddyState — the dot-matrix heart inherits `var(--buddy-heart-color)` per dot so crisis state still renders the entire matrix in sage green at the byte-locked 5800ms cadence. State-driven motion variants include a compassionate head-tilt for the encouraged state and CSS-only floating sparkle particles for the celebrate state (both fully gated by `prefers-reduced-motion`). The hero on `/start` renders Buddy at 180×180 to give the polish real presence. It manages placement rules for different UI surfaces and incorporates robust invariant scripts to ensure architectural contracts related to heading semantics, placement geometry, telemetry parity, DOM-mirror parity, crisis-color stability, strict-protected-file import boundary, and VISUAL_MAP exhaustiveness + state↔key consistency + free-text fallback coverage. These scripts act as pre-test gates (joined via `scripts/check-contract-routes.sh`) to enforce design, safety, and separation contracts; the import-boundary guard locks the architectural separation between Buddy Engine source files and the strict-protected `/api/ai/chat` handlers, the orchestrator/provider/memory/profile/summary/crisis logic in `server/ai/`, and the `/start` page internals; the VISUAL_MAP guard locks BUDDY_STATES↔VISUAL_MAP exhaustiveness, per-entry key↔state consistency, all 8 BuddyVisualOutput required fields with structurally-valid values, the crisis safety-routing flag (`safetyMode: "crisis_safe"` exclusive to the `crisis` state), and `resolveBuddyState` regex-fallback coverage for every non-default BuddyState.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub.

The `/register` and `/login` pages render real email/password forms (`client/src/pages/Register.jsx` and `client/src/pages/Login.jsx`) that POST to `/api/auth/register` and `/api/auth/login`. On success they call `useAuth().login(token, user)` which writes the JWT to `localStorage["mmhb_token"]` (the canonical key consumed by `apiRequest` in `client/src/lib/queryClient.js`) and starts the refresh timer. Backend errors surface as destructive toasts with the verbatim server message (e.g. "Invalid credentials"). Both pages are CSRF-exempt because `csrfProtection` in `server/security/csrf.mjs` skips `/api/auth/*`. Both responses now include `user.createdAt` (sourced from `users.created_at`) so downstream surfaces can compute "days together" tenure for the forever-companion experience. `auth.mjs` `ensureUsersTable()` is idempotent and bootstraps the canonical `users` table via `CREATE TABLE IF NOT EXISTS` matching `shared/schema.mjs` exactly, so registration works even when `drizzle-kit push` has been a no-op against the empty `database/schema/` config target.

The `/growth` page (`client/src/pages/GrowthPage.jsx`) is the forever-companion **Metacognition Mirror**. It renders a hero with a page-local **GrowthAura** SVG (three concentric breathing rings + warming core whose intensity scales with tenure × journal-count, fully `prefers-reduced-motion` gated and NOT a Buddy Engine surface), a "We've been together N days" tenure stamp, four mirror stats (reflections, check-ins, emotional palette, milestones unlocked), a `ReflectionMirror` panel that lists dominant feelings + thematic threads from the user's own journal data, a `MetacognitiveInvitations` panel that auto-rotates a 3-prompt slice every 7 seconds with `aria-live="polite"`, dynamic milestone cards with progress bars (unlocks computed from real activity, never punitive), and the existing four pillars + four paths navigators below. It reads from a new aggregator endpoint **`GET /api/growth/journey`** mounted via `EXTENDED_ROUTES` in `server/app.mjs` with `auth: "optional"`. The endpoint (`server/routes/growth-journey.mjs`) is read-only, runs a `safeQuery` wrapper around drizzle `sql` tagged-template selects against `users`, `journals`, and `moods`, reuses the existing pure `buildJournalSummary` function from `server/engine/therapyIntelligence.mjs` so feelings/themes/observation copy stays consistent with the rest of the app, and returns aggregate counts only (no PII, no raw text). It does NOT import from `/api/ai/chat` handlers, the orchestrator/provider/memory/profile/summary/crisis modules in `server/ai/`, or `/start` internals — so the strict-protected import boundary stays clean. Guests get the same payload shape with zeros and starter copy, and the page degrades gracefully when no data is present.

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
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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system. The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes, maintaining existing CSS animation hooks and `prefers-reduced-motion` compliance. Branded elements emphasize an "Aurora Token System" for consistent visual effects. The landing page uses an NLP-informed emotional journey structure.

### Technical Implementations
The project is a monorepo with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot via `ensureSchema.mjs`. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment with a ZenScape backdrop, displaying the user's sanctuary palette, accessory, theme, and computed evolution stage. A `CustomizerPanel` allows authenticated users to save personalization choices, with guests able to preview locally. An `InteractiveBuddy` wrapper enables users to cycle through positive expressions.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol.

### Self-Healing Tooling (A→Z 360°)
The platform includes a layered self-heal stack, each script/module independently runnable and producing structured output:
- **`scripts/heal-all.sh`** — orchestrator: probe → topology sanity → contract gates → rolled-up verdict (manual sweep).
- **`scripts/heal-360.mjs`** — read-only comprehensive probe; persists `docs/health-check-result.json`; exit 0/1/2/3 (HEALTHY/DEGRADED/NEEDS_REPAIR/INTERNAL_ERROR).
- **`scripts/heal-repair.mjs`** — recipe-driven fix prescriber. DRY-RUN by default; safe fixes need `--apply`, destructive fixes need `--apply-destructive`. Locked surfaces (`/api/ai/chat`, `server/ai/*`, `BuddyAvatar.tsx`, `/start`) are excluded from the recipe registry.
- **`scripts/heal-watch.mjs`** — continuous probe loop; persists rolling `docs/health-watch-status.json` (latest sample + 10-sample streak window + history). Read-only.
- **`scripts/heal-cron.mjs`** — scheduled single-shot for cron/systemd. Single syslog-style line + daily-rotating NDJSON at `docs/health-cron-YYYYMMDD.log` with `--retention=<days>` auto-prune. Nagios-style exit codes; flags `--silent` `--json`.
- **`scripts/heal-self.mjs`** — fully autonomous closed-loop: probe → safe-only repair → re-probe → persist `docs/health-self-status.json`. Never invokes `--apply-destructive`. Outcomes: ALREADY_HEALTHY / REPAIRED_TO_HEALTHY / REPAIRED_TO_DEGRADED / STILL_NEEDS_REPAIR / REPAIR_FAILED / DRY_RUN / STALE_STATUS / TIMEOUT.
- **`server/lib/healScheduler.mjs`** — singleton in-process background scheduler. **Opt-in only** via `HEAL_AUTO_ENABLED=true` (default OFF). Configurable interval via `HEAL_AUTO_INTERVAL_MS` (default 30 min, floor 5 min). Spawns `heal-self.mjs --silent` on schedule, applies freshness guard against the status file timestamp, auto-pauses after 3 consecutive *failed* outcomes (REPAIR_FAILED / STILL_NEEDS_REPAIR / TIMEOUT / STALE_STATUS / INTERNAL_ERROR — partial outcomes like REPAIRED_TO_DEGRADED and DRY_RUN are forward progress and do not advance the failure streak), persists state to `docs/health-scheduler-status.json`. 48-entry rolling history (~24h at 30-min). Cleans up child processes on SIGTERM/SIGINT; `timer.unref()` so it never blocks process exit.
- **`server/lib/healAI.mjs`** — admin-only AI diagnosis helper. Sends a slimmed health-probe report (verdict + totals + truncated nonPass[≤20]) to Perplexity (`sonar-pro` with `json_schema` response_format) and returns a structured remediation plan: `{summary, overall_severity, remediation_steps[{issue,severity,root_cause_hypothesis,suggested_fix,risk_level,estimated_effort}], next_action}`. System prompt forbids destructive recommendations and weakening trauma-informed safeguards. AbortController-based timeout, fence-stripping JSON-recovery fallback. **Does NOT touch user-facing AI chat (`/api/ai/chat`) or `server/ai/*`.**

Admin Command Center surfaces this via five endpoints (admin-only, all gated by mount-level `adminLimiter → requireAuth → requireAdmin` chain in `server/app.mjs`):
- `GET /api/admin/health-deep` — reads heal-360 + heal-watch + ring buffers + scheduler state server-side, returns `{ verdict, totals, categories, nonPass, watch, probeHistory, selfHealHistory, aiHistory, scheduler }`. The three `*History` fields are in-memory ring buffers (probe & selfHeal: 10 each, ai: 5).
- `POST /api/admin/health-deep/run` — admin-triggered re-probe; spawns heal-360 with 30s timeout + 30s cooldown.
- `POST /api/admin/health-deep/self-heal` — admin-triggered closed-loop; spawns `heal-self.mjs --silent` with 90s timeout + 60s cooldown. **Freshness guard** ensures only status files with `timestamp >= startedAt` are trusted (otherwise outcome=`STALE_STATUS`). Always safe-only.
- `POST /api/admin/health-deep/ai-analyze` — admin-triggered AI diagnosis via `healAI.mjs`. 60s cooldown, 30s timeout, returns 409 if no probe report exists, 502 on Perplexity failure. Last 5 results retained in `_aiHistory`.
- `POST /api/admin/health-deep/scheduler/{resume,pause}` — operator controls for the in-process scheduler. `pause` accepts an optional `reason` (≤200 chars). Cannot enable the scheduler from here — that's gated by `HEAL_AUTO_ENABLED` env so a paused scheduler can be resumed but a disabled one stays disabled.

`client/src/pages/admin/HealthDashboard.jsx` consumes the GET via React Query (60s refetch) and renders the Deep Health panel with totals, per-category breakdown, non-pass items + repair hints, watch streak, **scheduler status pill** (ON/OFF/PAUSED + interval + totalRuns + consecutiveFails + inline pause/resume buttons), **latest AI diagnosis widget** (severity-color pill, summary, next-action callout, collapsible remediation steps with risk-level badges), recent autonomous self-heals, and recent admin re-probes. Three action buttons in the panel header — "Re-probe now" (sage, RefreshCw) + "Self-heal now" (amber, Stethoscope) + "Ask AI" (violet, Sparkles) — are wired via TanStack mutations with toast feedback and mutually disable each other while any is pending. Uses the `glp-pane` design token.

### Design Tokens — `glp-pane`
`client/src/styles/glp-pane.css` exports a reusable sanctuary-depth pane primitive. Apply `className="glp-pane"` to any container to inherit cream-gradient bg + inset highlight + animated tri-color top accent bar (gold → sage → gold) + soft hover lift + sage hover border. Modifiers:
- `glp-pane--accent` — permanent gold ring (for "featured" panes).
- `glp-pane--quiet` — disables hover lift (for non-interactive cards).
- `glp-pane--bare` — disables `overflow:hidden` and the `::before` accent bar; lets the host element control its own visual chrome (used by Pricing tier cards which have inline 2px gold borders + absolutely-positioned popular badges that would otherwise be clipped).

Border declarations on `.glp-pane` deliberately omit `!important` so inline `style="border:..."` can win on opt-in surfaces. Includes built-in dark-mode variant and `prefers-reduced-motion` gating. Currently applied to all four Deep Health Dashboard panels (Environment / Resources / Quick Actions / Deep Health) and to all 4 Pricing tier cards (with `--bare`).

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
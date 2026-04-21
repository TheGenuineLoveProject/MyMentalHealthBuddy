# Replit.md — The Genuine Love Project

## Overview

The Genuine Love Project is a wellness/mental health adjacent web platform. It features a React frontend, a planned Express.js backend, and integrations with OpenAI (AI-driven features), Stripe (subscriptions/payments), and an email service. The platform includes blog/newsletter content, user accounts, subscriptions, and AI-assisted features (likely healing or emotional support oriented). It is **not** a crisis service and carries a disclaimer directing users in danger to emergency services.

The codebase is in an early/rebuilding state. Most server-side files are currently empty or quarantined. The active frontend has minimal components. The architecture is being established fresh from a clean foundation.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **Routing**: `wouter` (lightweight client-side router, chosen over React Router for simplicity)
- **Styling**: Tailwind CSS with shadcn/ui component conventions (utility-first, component-driven UI)
- **Structure**: Components live in `client/src/components/`. Quarantined/deprecated components are held in `client/src/components/_quarantine/` to preserve them without using them.

### Backend (Planned / Being Built)
- **Framework**: Express.js with TypeScript
- **Structure**: Modular route files per domain (auth, users, content, subscriptions, AI, webhooks, health)
- **Middleware stack** (planned):
  - `auth.ts` — authentication checks
  - `rbac.ts` — role-based access control
  - `validate.ts` — Zod schema request validation (already implemented)
  - `rateLimit.ts` — rate limiting per endpoint
  - `promptshield.ts` — AI prompt injection protection
  - `errorHandler.ts` — centralized error handling
- **Validation**: Zod schemas defined as contracts (e.g., `content.schema.ts`) and applied via a reusable `validate()` middleware wrapper
- **Environment**: Managed via a `utils/env.ts` utility (planned)
- **Logging**: Centralized logger via `utils/logger.ts` (planned)

### Data Storage
- No database is wired up yet. The content route has a `// TODO: persist to DB` comment. Drizzle ORM is likely the intended choice given the Replit stack. Postgres may be added later.

### Authentication & Authorization
- Planned via `auth.ts` middleware and `rbac.ts` for role-based access
- Specific auth provider (JWT, session, OAuth) not yet determined from available code

### AI Features
- Two planned AI route modules: `ai.business.ts` and `ai.healing.ts` — suggesting separate AI flows for business tooling and emotional/healing support
- OpenAI service layer planned in `server/services/openai.ts`
- Prompt shield middleware planned to protect against prompt injection attacks

### Payments & Subscriptions
- Stripe integration planned via `server/services/stripe.ts`
- Dedicated `subscriptions.ts` route for subscription management
- Webhook route (`webhooks.ts`) likely handles Stripe webhook events

### Email
- Email service planned in `server/services/email.ts` (provider TBD — likely Resend, SendGrid, or similar)

---

## External Dependencies

| Service | Purpose | Status |
|---|---|---|
| **OpenAI** | AI healing and business features | Planned (service file empty) |
| **Stripe** | Subscriptions and payments | Planned (service file empty) |
| **Email provider** | Transactional email (newsletters, auth) | Planned (service file empty) |
| **Zod** | Request schema validation | Implemented in middleware |
| **wouter** | Client-side routing | Active in frontend |
| **Tailwind CSS** | UI styling | Active in frontend |
| **shadcn/ui** | Component design system conventions | Active in frontend |
| **nodemon** | Dev server auto-restart | Configured |
| **semgrep** | Security static analysis (Replit-managed) | Configured |

### Notes for the Code Agent
- The `_quarantine/archive_DO_NOT_DELETE/` folder preserves old server code for reference — do **not** delete it, but do **not** import from it directly. Use it as a reference when rebuilding server modules.
- The `backups/` directory is a snapshot and should not be modified.
- When building out server routes, follow the pattern: define a Zod schema in a `contracts/` file, apply it via the `validate()` middleware, keep business logic in a `services/` layer.
- The platform has mental health adjacent content — always preserve the disclaimer/crisis safety messaging visible in the footer component.
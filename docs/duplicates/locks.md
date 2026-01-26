# Locked Files (Single Source of Truth)

> These files must never be duplicated. All imports should reference these paths.

## Schema & Data
- `shared/schema.ts` — Database schema definitions
- `shared/schema.mjs` — Runtime schema
- `server/db.mjs` — Database connection
- `server/storage.ts` — Storage interface

## Configuration
- `drizzle.config.ts` — Drizzle configuration
- `vite.config.ts` — Vite configuration  
- `tailwind.config.ts` — Tailwind configuration
- `tsconfig.json` — TypeScript configuration
- `package.json` — Dependencies and scripts

## Routes
- `server/routes.ts` — Main API routes
- `client/src/App.tsx` — Main app component
- `client/src/App.jsx` — JSX app entry

## Auth
- `server/middleware/auth.mjs` — Auth middleware
- `server/routes/auth.mjs` — Auth routes

## AI
- `server/routes/ai.mjs` — AI routes
- `server/lib/crisisDetection.mjs` — Crisis detection
- `server/lib/aiSafety.mjs` — AI safety guardrails

## Billing
- `server/routes/billing.mjs` — Billing routes
- `server/routes/webhook.mjs` — Stripe webhooks

## Design Tokens
- `client/src/styles/tokens.css` — Design tokens
- `client/src/styles/brand-tokens.css` — Brand tokens

## Content
- `client/src/content/routes.js` — Route registry
- `client/src/content/readingLevels.js` — Content tier mapping

---

_Last updated: January 2026_

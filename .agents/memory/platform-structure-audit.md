---
name: Platform structure & orphaned routes
description: Durable map of MMHB's biggest structural debt — built-but-unmounted API routes, shadow root dirs, and duplicate component families.
---

# MMHB platform structure debt

**Why:** A 2026-06 full A→Z audit found the codebase is huge (319 pages, 423 components, ~1000 Route entries in `client/src/App.jsx`) with several high-impact gaps that are NOT obvious from a passing build (build passes, 0 TS errors, yet live endpoints 404).

## Built-but-unmounted API routes (runtime 404/403 despite full logic)
- `server/routes/gamification.mjs` — full XP/quests/leaderboard logic, **never `app.use`d** in `server/app.mjs`. Causes live 404 on `/api/gamification/progress` + `/quests`.
- `server/routes/analytics-events.mjs` — implements POST `/event`; **not mounted** → 403/404 on `/api/analytics/event`.
- `server/routes/blog.mjs` — full RSS/admin/comments; **not mounted** in the boot chain.
**How to apply:** routes are mounted in `server/app.mjs` via `app.use("/api/...", router)`. When an endpoint 404s but the route file exists, check mounting first, not the route logic.

## Shadow / legacy trees (clutter, not the live app)
- Root-level `src/`, `components/`, `pages/`, `api/`, `app/` duplicate the real `client/`+`server/` trees. `app/backend/server/` is a legacy shadow holding STUB routes (e.g. blog stub returning `{"posts":[]}`). The live entry is `server/app.mjs` + `client/src/App.jsx`.
- ~27 stray `*.txt`/`*.log` audit dumps + `package.json.bak`/`.backup` at repo root.

## Duplicate component families (.jsx + .tsx coexisting, different APIs)
StateTracker, ReflectionFooter, UpsellModal, BehaviorChangePage, Privacy; plus `Button.jsx`/`button.tsx` and `Card.jsx`/`card.tsx` (the uppercase `.tsx` casing-collision orphans were already deleted 2026-06; the `.jsx` canonical-vs-`.tsx`-shadcn split remains).
**Why it matters:** importing the wrong one gives a different component API silently.

## Schema/server facts
- Real Postgres + Drizzle (NOT MemStorage). Connection in `server/db/connection.mjs`, client in `server/db/client.mjs`. Schema is `shared/schema.mjs` (~1000+ lines), NOT `shared/schema.ts`.

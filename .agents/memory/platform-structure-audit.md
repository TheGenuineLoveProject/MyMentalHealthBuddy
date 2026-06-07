---
name: Platform structure & orphaned routes
description: Durable map of MMHB's biggest structural debt — built-but-unmounted API routes, shadow root dirs, and duplicate component families.
---

# MMHB platform structure debt

**Why:** A 2026-06 full A→Z audit found the codebase is huge (319 pages, 423 components, ~1000 Route entries in `client/src/App.jsx`) with several high-impact gaps that are NOT obvious from a passing build (build passes, 0 TS errors, yet live endpoints 404).

## Route mounting (2026-06)
- **There is NO bulk route registry/auto-loader.** Routes mount ONLY via explicit `app.use("/api/...", router)` in `server/app.mjs`. Files in `server/routes/` are NOT auto-wired; many are legacy/aspirational with no frontend caller.
**How to apply:** when an endpoint 404s but the route file exists, check it's `app.use`d in app.mjs. The real signal for a live 404 is a FRONTEND `/api/...` call whose path has no matching `app.use` mount — not merely an unmounted file.

## Mounting an orphaned route can newly EXPOSE unauthenticated surfaces (audit auth before wiring)
**Why:** Wiring 13 frontend-called-but-unmounted routers fixed real 404s, but architect review caught that `content.mjs` shipped unauthenticated in-memory-store WRITE endpoints (`POST /items`, `PATCH /items/:id`, `POST /seed-demo`) that no page calls — mounting them as-is created a public integrity-abuse surface. `community.mjs` similarly exposes unauthenticated `heart`/`like` mutations (lower risk, left public pending product call).
**How to apply:** before mounting any orphaned router, audit each handler's auth. Gate mutating/tooling endpoints with `requireAuth`+`requireAdmin` (importable from `server/middleware/auth.mjs`); prefer per-route gates over whole-module gates when the page is only `ProtectedRoute` (e.g. `/content-studio` is any-auth, NOT admin — gating the whole `/api/content` would break `/formats`+`/generate`). Global CSRF already 403s unauthenticated POST/PATCH, but that is not authz. Note: many routers define only sub-paths (no base `/` route), so a base-prefix probe returning 404 is NOT a mount failure — probe a real sub-path.

## Mounting a req.user-reading router WITHOUT optionalAuth silently degrades signed-in users
**Why:** auth is Bearer-only and lazy — nothing populates `req.user` unless an auth middleware runs. A router whose handler does `const user = req.user || null` (e.g. `growth-journey.mjs` `GET /journey`) mounted as a plain `app.use("/api/x", router)` always sees `req.user` undefined, so signed-in callers get guest/zeroed personalized data. This PASSES a 200 smoke check and only fails on personalization — easy to miss.
**How to apply:** when mounting any router that reads `req.user` but has no per-route `requireAuth`, wrap the mount with `optionalAuth` (imported in app.mjs): `app.use("/api/x", optionalAuth, router)`. Precedent: `/api/streaks`, `/api/growth`. Verify with two curls (guest vs `Bearer <jwt>`) that an identity flag (`privacy.signedIn`) flips.

## Frontend-called prefixes with NO backend (need implementation, NOT just mounting)
**Why:** A 2026-06 full frontend↔mount cross-ref mounted every `/api/*` prefix that had a matching `server/routes/*.mjs`. As of Batch 3-4, `/api/user-settings`, `/api/dashboard`, `/api/uploads`, `/api/social`, `/api/system`, `/api/kernel`, `/api/growth` are all built+mounted; `/api/subscribe` and `/api/session/extend` were resolved by repointing the frontend to existing routes (`/api/newsletter/subscribe`, `/api/session-boundary/extend`) rather than new backends.
**How to apply:** remaining non-live items are deferrals, NOT gaps: `/api/v1/*` (rbac map only, aspirational); `/api/pathways/progress` (consumer `useQuery enabled:false` — never fires); `/api/journals` (consumers expect a bare DB-backed array but `journal.mjs` GET "/" returns `{ok,data}` from an in-memory `journalStore` — data-source mismatch, needs a product/contract decision before wiring). Prefer the smallest engine: a 1-line frontend repoint to an existing tested route beats a new backend module.

## Shadow / legacy trees (clutter, not the live app)
- Root-level `src/`, `components/`, `pages/`, `api/`, `app/` duplicate the real `client/`+`server/` trees. `app/backend/server/` is a legacy shadow holding STUB routes (e.g. blog stub returning `{"posts":[]}`). The live entry is `server/app.mjs` + `client/src/App.jsx`.
- ~27 stray `*.txt`/`*.log` audit dumps + `package.json.bak`/`.backup` at repo root.

## Duplicate component families (.jsx + .tsx coexisting, different APIs)
StateTracker, ReflectionFooter, UpsellModal, BehaviorChangePage, Privacy; plus `Button.jsx`/`button.tsx` and `Card.jsx`/`card.tsx` (the uppercase `.tsx` casing-collision orphans were already deleted 2026-06; the `.jsx` canonical-vs-`.tsx`-shadcn split remains).
**Why it matters:** importing the wrong one gives a different component API silently.

## Schema/server facts
- Real Postgres + Drizzle (NOT MemStorage). Connection in `server/db/connection.mjs`, client in `server/db/client.mjs`. Schema is `shared/schema.mjs` (~1000+ lines), NOT `shared/schema.ts`.

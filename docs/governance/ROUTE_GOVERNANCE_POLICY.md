# Route Governance Policy

_Status: ACTIVE. Governs the single-source-of-truth route registry
(`client/src/content/routes.js`) and its per-category modules under
`client/src/content/routes/`. Subordinate to the MMHB v7.4 Archival Kernel and
the canonical route laws (`CANONICAL_ROUTE_REGISTRY_LAW.md`,
`CANONICAL_ROUTE_OWNERSHIP.md`, `ROUTING_GOVERNANCE.md`,
`DUPLICATE_ROUTE_FAMILY_RULES.md`)._

## Purpose

Lock in the verified-green state of the route registry after the controlled
decomposition effort, and define the boundaries within which any future route
change must operate. This policy is **documentation + tooling only**; it does
not move, rename, reorder, or delete any route.

## Registry shape (module map)

The route registry is one ordered array (`rawRoutes`) assembled in
`routes.js`. Extracted categories are spread back **in place** via `...module`
so array order and runtime behavior are unchanged.

| Source file | Contents |
| --- | --- |
| `client/src/content/routes.js` | All non-extracted routes (inline), plus `...module` spreads at their original positions |
| `routes/coreRoutes.js` | Public support pages (note: holds the *support* pages, **not** the `core` protected category) |
| `routes/supportRoutes.js` | `/support/*` subpages |
| `routes/learningRoutes.js` | Learning routes |
| `routes/legalRoutes.js` | Legal routes |
| `routes/contentRoutes.js` | Content routes (incl. dynamic `/blog/:slug`) |
| `routes/toolRoutes.js` | Advanced & mastery informational routes |
| `routes/marketingRoutes.js` | Public marketing pages (`/about`, `/about/approach`, `/features`, `/testimonials`) |

> Naming trap: `coreRoutes.js` contains **support** pages. The `core` *category*
> (dashboard / journal / analytics / mood / state, etc.) is the protected app
> surface and is **NEVER** extracted.

## Classification buckets

Every route is one of three governance buckets. Extraction is permitted **only**
for `SAFE` routes that form a contiguous block, moved verbatim with an in-place
spread.

### NEVER EXTRACT / NEVER MODIFY (protected boundaries)

- **Root family:** `/`, `/home`, `/welcome` (alias metadata, but `/welcome`
  actually renders the onboarding flow — auth-coupled).
- **Auth:** `/login`, `/login/callback`, `/register`, `/forgot-password`,
  `/reset-password`, `/onboarding`, and aliases `/signin`, `/sign-in`,
  `/signup`, `/sign-up`.
- **Core protected app:** `/dashboard`, `/overview`, `/crm`, `/today`, `/mood`,
  `/state`, `/journal`, `/analytics`, `/progress`, `/growth-analytics`,
  `/guided-journaling`.
- **AI:** `/chat` (+ `/ai-chat`), `/companion`, `/ai/insights`, `/ai/coach`,
  `/ai/meditation`, `/ai/companion`.
- **Crisis / safety:** `/crisis`, `/safety`.
- **Healing domain:** `/healing` and all `wellness` category routes.
- **Monetization:** `/pricing`, `/premium`, `/billing`, `/upgrade`,
  `/account/billing`, `/admin/billing`.
- **Account-protected:** `/account/sessions`, `/account/delete`.
- **Admin:** `/admin`, `/content-admin`, `/control`, `/admin/billing`.
- **Component-coupled landing:** `/canva-landing` (dedicated lazy component).
- **Routing fallback:** `/not-found` (catch-all; ordering must be preserved).

### HOLD (extractable in theory, deferred by policy)

- `/original-home`, `/landing` — pure registry-driven plain data, but isolated
  (not contiguous with any safe block) and home/position-adjacent. Low benefit,
  non-zero risk. Do not extract without explicit approval.
- Internal tooling: `/health`, `/publishing`, `/wireframes`,
  `/design-dashboard`, `/design-system`.

### SAFE (already extracted)

Public, registry-driven, dependency-free informational/marketing routes:
support, learning, legal, content, advanced, and marketing categories. These
have been moved into modules above. **No further safe extraction targets
remain** as of this policy's adoption.

## Change rules

1. **No movement without contiguity.** Only a contiguous block of `SAFE` routes
   may be extracted, moved verbatim, and spread back at the exact same array
   position. Preserve metadata, titles, descriptions, icons, CTAs, disclaimers,
   accessibility fields, and ordering.
2. **No protected/healing/monetization/auth edits** under this policy.
3. **Parity is law.** Total route count must never change during reorganization
   (locked baseline in `reports/route-manifest.baseline.json`).
4. **No duplicates.** A path may appear once across the entire registry
   (aliases use distinct paths). Enforced by the registry auditor.
5. **SEO + crisis routing preserved** on every wellness/marketing surface.
6. **Green gate.** Every change must pass: `npm run build`, `npm run verify:all`,
   the registry audit, and HTTP 200 checks for affected public routes. Stop on
   any regression.

## Verification tooling

| Command | Scope |
| --- | --- |
| `npm run routes:manifest` | Snapshot registry → `reports/route-manifest.json` + integrity report; locks/compares baseline |
| `node scripts/audit-registry-routes.mjs` | Registry-level duplicate + parity + sentinel + category + self-check audit |
| `npm run audit:duplicates` | App.jsx `<Route>` duplicate audit (existing) |
| `npm run scan:routes` | Route governance scan (existing, part of `verify:all`) |
| `npm run verify:all` | Build + duplicate + governance scan + copyright (green gate) |

### What the registry guards enforce

Both `routes:manifest` and `audit-registry-routes.mjs` fail (exit non-zero) on any of:

1. **Duplicate paths** — the same `route` declared more than once across `routes.js` + modules.
2. **Total parity drift** — total route count differs from the locked baseline.
3. **Category parity drift** — any per-category count differs from `baseline.byCategory`. Catches reclassification / category-shift even when the total is unchanged.
4. **Sentinel violations** — each protected sentinel must be *present* **and** keep its expected `category` and (where applicable) its `protected: true` flag. Presence alone is not enough.
5. **Parser self-check** — the block-parsed route total must equal an independent line count (`^    route:`) across all sources. A formatting change that breaks one parsing strategy fails loudly instead of silently under-collecting.

The baseline lives at `reports/route-manifest.baseline.json` (locked at first run). Intentional, reviewed route changes require regenerating the baseline; unintended drift is a stop-the-line regression.

See `reports/README.md` for the reporting structure and `reports/RUNTIME_VERIFICATION.md` for the latest verified-green run.

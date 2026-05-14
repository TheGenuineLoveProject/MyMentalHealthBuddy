# Platform Analysis Report — MMHB / GLP

**Generated:** 2026-05-15
**Layer:** HX-OS vNEXT ∞ Current Platform Analysis
**Source diagnostics:** `docs/diagnostics/*.txt` (refresh via `prompt-os/current-platform-analysis-layer.md` § Diagnostic Commands)

---

## 1. Hard Truth

The application **runs green** (workflow up, port 5000, host `0.0.0.0`, build clean at 11.90s in last verify). But the codebase carries **multiple parallel scaffolds** — 4 landing pages, 2 prompt-os trees, 19 legacy Lumi components shadowing 25 canonical opt-in `lumi-*` modules, and root-level `pages/ components/ src/ ai/` folders living **alongside** the canonical `client/` and `server/` trees. Nothing is on fire; everything has drift debt. Contributors (human and agent) cannot tell which scaffold is canonical without grepping `App.jsx`.

## 2. Current Platform Summary

Monorepo. Express 5 server entrypoint at `server/app.mjs` (binds `process.env.PORT || 5000` on `0.0.0.0`); React 18 + Vite client at `client/src/` mounting **1,034 `<Route>`** entries through `App.jsx`. Drizzle ORM over Neon Postgres. Workflow `Start application` runs `node --import ./server/observability/preload.mjs server/app.mjs`. Production deploy target: `vm` with `node dist/server.mjs` after `npm ci && vite build && build-server.mjs`. 317 server `.mjs` files. 7,372 `.ts/.tsx/.js/.mjs/.jsx` source files total.

## 3. Active Runtime Path

```
.replit · run = "npm run dev"          (interactive)
        · workflow = "node --import server/observability/preload.mjs server/app.mjs"
        · waitForPort = 5000  →  externalPort 80
package.json · "dev"   = "node server/app.mjs"
             · "start" = "node server/app.mjs"   ← matches workflow ✓
server/app.mjs · L683  PORT = process.env.PORT || 5000          ✓
              · L739  app.listen(PORT, "0.0.0.0", () => …)      ✓
              · L300  app.use("/api/health", healthRoutes)       ✓
              · L431  app.use("/api/ai", optionalAuth, aiRoutes)
              · L327  app.use("/api/auth", authRoutes)
```
Single canonical entrypoint. `.replit` ↔ `package.json` aligned. Production build path divergent (`dist/server.mjs` produced by `scripts/build-server.mjs`) — verify-on-deploy required.

## 4. Folder + File Inventory (top-level, classified)

| Path | Status | Notes |
|---|---|---|
| `client/` | ACTIVE / canonical | React 18 + Vite, 1,034 routes |
| `server/` | ACTIVE / canonical | Express 5, 317 `.mjs` files |
| `shared/` | ACTIVE | Drizzle schema |
| `db/`, `drizzle/`, `migrations/` | ACTIVE | Neon Postgres |
| `prompt-os/` | NEW (1 file) | Just installed `current-platform-analysis-layer.md` |
| `prompt-os-kernel/` | ACTIVE / **unclear** | Contains `contracts/ engines/ governance/ prompts/ install.sh` — appears more canonical |
| `agents/` | ACTIVE | 6 markdown specs (content/growth/layout/mcp/safety/seo) |
| `automation/` | ACTIVE | Background scripts |
| `pages/` (root) | **LEGACY DRIFT** | 21 files alongside `client/src/pages/` |
| `components/` (root) | **LEGACY DRIFT** | 23 files alongside `client/src/components/` |
| `src/` (root) | **LEGACY DRIFT** | 43 files alongside `client/src/` |
| `ai/` (root) | **LEGACY DRIFT** | 37 files alongside `server/routes/ai*.mjs` |
| `app/`, `api/`, `auth/` | LEGACY STUB | 1–2 files each |
| `_quarantine/` | ARCHIVE | `archive_DO_NOT_DELETE`, `attached_assets` |
| `.archive/` | ARCHIVE | Pre-v5.x backup |
| `attached_assets/` | INPUT | User-attached prompts/screenshots (large) |
| `client/src/lumi-*/` | ACTIVE / canonical | **25 opt-in modules** (v5.8.40-65) |
| `client/src/components/lumi/` | **DRIFT** | **19 components**, includes LumiV6, LumiV7 (older versions) |

## 5. Existing Systems (working)

- **Runtime:** Express 5 single-process, OpenTelemetry preload, Sentry hooks, PagerDuty alerts on uncaught.
- **Health:** `/api/health` (public) + `/api/admin/kernel/health` (auth+admin gated).
- **Auth:** `replit_integrations/auth` + custom JWT + cookie + CSRF + Helmet + CORS allowlist + rate-limit middleware.
- **AI:** dual-engine routing (`ai.mjs` user, `ai.business.mjs` admin, `ai.healing.mjs` adult-gated).
- **Lumi canonical (v5.8.40-65):** 25 `lumi-*` modules — `lumi-registry` (placement gates), `lumi-tokens`, `lumi-disclaimer`, `lumi-cbt`, `lumi-tracker`, `lumi-crisis`, `lumi-conversation`, `lumi-rituals`, `lumi-scenes`, `lumi-memory`, `lumi-circadian`, `lumi-voice`, `lumi-boundaries`, `lumi-consistency`, `lumi-language`, `lumi-rbac`, `lumi-audit`, `lumi-notifications`, `lumi-backend`, `lumi-bridge`, `lumi-cohesion`, `lumi-integration`, `lumi-motion`, `lumi-library`, `lumi-agent`.
- **Crisis:** unified detector + `/crisis` route + 988 + 741741 baked into wellness surfaces (verified in `CanvaLanding.jsx` line 726, footer block).
- **Build:** Vite 11.9s clean.

## 6. Missing Systems (gaps)

- **Single source-of-truth registry** for which routes/pages/components are canonical vs legacy. No `CANONICAL.md` or routing manifest pinned at root.
- **Explicit landing-page contract:** 4 landing files exist; only 1 mounted at `/`; the other 3 still imported.
- **prompt-os ↔ prompt-os-kernel relationship is undocumented** — risk of split-brain governance.
- **`/api/ready`** (readiness probe distinct from liveness `/api/health`) — not found in runtime scan.
- **Route manifest output:** script `routes:manifest` exists but no committed output to compare drift against.

## 7. Duplicate / Conflicting Systems (top 5 by risk)

| # | Duplicate | Files | Risk |
|---|---|---|---|
| 1 | **Landing pages** | `CanvaLanding.jsx` (live `/`), `HealingLandingPage.jsx`, `Home.jsx`, `LandingV2.jsx` | Medium — orphans still imported in `App.jsx` + `declarations.d.ts` |
| 2 | **Lumi rendering** | `client/src/components/lumi/` (19 files, incl. LumiV6/V7/Mascot/Companion/FloatIdleRig) **vs** `client/src/lumi-*/` (25 canonical modules incl. `OfficialLumi`/`lumi-registry`) | High — visible drift; user already flagged "3D rendered or alternate Lumi styles" |
| 3 | **Prompt-os trees** | `prompt-os/` (just installed) **vs** `prompt-os-kernel/` (contracts+engines+governance+prompts+install) | High — governance split-brain |
| 4 | **Root-level legacy scaffold** | `pages/` `components/` `src/` `ai/` `app/` `api/` `auth/` (124 files total) | Medium — not imported by canonical entrypoints, but pollutes search/grep and tooling |
| 5 | **Build chain** | dev: `node server/app.mjs` directly; prod: `node dist/server.mjs` after `scripts/build-server.mjs` | Low — known pattern, but no parity test |

## 8. Broken or High-Risk Areas

- **App.jsx route count = 1,034.** Even at ~1 LOC per route, this file is unreviewable in a single sitting and likely contains dead routes pointing at orphan pages. **Highest cognitive-load risk.**
- **Pre-existing tsc deprecations** (`rootDir`/`baseUrl` in `client/tsconfig.json`) — baseline noise, not breaking, but obscures real type errors when they appear.
- **No automated drift detector** between `client/src/pages/` and the route table.

## 9. Homepage + UX Findings

- `/` → `CanvaLanding.jsx` (1,397 lines). Recently polished (v5.8.66): 5 validation cards re-wired to `/breathe /checkin /chat /journal`; sticky `Talk to Lumi` bar inserted before footer with z-110 to clear the existing scroll-to-top button.
- Crisis routing intact (line 726 inline + footer + `SafetyFooter` strip).
- Strongest UX asset: emotional-validation card row + multi-engine brand hierarchy.
- Biggest UX blocker: page is 1,397 lines with hand-tuned per-section gradients — a future flatten/unify pass would need a mockup-first approach (offered last turn, deferred).

## 10. SEO + Content Findings

- `client/public/sitemap.xml` present; `robots.txt` present; OG image + manifest present.
- Wisdom content shipped as data-only (`client/src/data/wisdomContent.ts`, 172 lines, 9 exports + 5 helpers) — not yet wired to any page.
- No pillar-page taxonomy committed to repo (would need separate audit on `content/` and `client/src/pages/blog*` if present).

## 11. AI + Prompt Findings

- 3 AI route engines mounted (`ai`, `ai.business`, `ai.healing`) — domain separation correct.
- `agents/` holds 6 markdown specs (content / growth / layout / mcp / safety / seo).
- **`prompt-os-kernel/` appears to be the real prompt registry** with `contracts engines governance prompts` subdirs. The newly installed `prompt-os/current-platform-analysis-layer.md` may belong inside it. **Confirm before adding more files to `prompt-os/`.**

## 12. Business / Healing Firewall Findings

- Healing routes (`/api/ai/healing`) gated by `requireAdult` middleware (L305).
- Business routes (`/api/ai/business`) separated (L324).
- No contamination found in spot-check of `CanvaLanding.jsx` healing card section — pricing CTAs live in their own surfaces.
- ✅ Domain separation contract honored at the API layer.

## 13. Deployment Findings

- Deploy target = `vm` (not `autoscale`). Build = `npm ci && vite build && node scripts/build-server.mjs` → `dist/server.mjs`.
- **Risk:** dev runs `server/app.mjs` (source); prod runs `dist/server.mjs` (bundled). Changes to dynamic imports or `import.meta.url` paths can diverge silently. No parity smoke test in `scripts/verify.sh` for the bundled output.
- Last published checkpoint: `e80fe4b…` (before this analysis).

## 14. Avatar + Identity Findings

- **Drift confirmed.** `client/src/components/lumi/` contains: `LumiV6.tsx`, `LumiV7.jsx`, `LumiMascot.jsx`, `LumiCompanion.jsx`, `FloatIdleAnimated.jsx`, `FloatIdleRig.jsx`, `LumiMascotImage.jsx`, `LumiBrandLockupImage.jsx`, `LumiBrandLogo.jsx`, `LumiAccessibleWrapper.jsx`, `LumiCustomizer.jsx`, `LumiCustomizerTrigger.jsx`, `TGLPMandala.jsx`, `TGLPMandalaImage.jsx` + 5 CSS files (19 total).
- Canonical system per v5.8.62: `OfficialLumi` + `lumi-registry/registry/officialLumiRegistry.ts` + `lumiPlacementRules.ts` (8 canonical variants, 25 emotional roles, 17-page placement map, forbidden surfaces refuse to render).
- `CanvaLanding.jsx` currently uses `LumiMascot` (×2) + `FloatIdleAnimated` (×1) — **all from the legacy folder**, not the canonical registry. Migration would require adding `landing-canva` to `lumiPagePlacementMap.ts` first.

## 15. First Highest-Impact Blocker

**Parallel-scaffold ambiguity in the Lumi rendering layer.**
The user has already flagged this twice ("Use OfficialLumi canonical avatar", "Replace any 3D rendered or alternate Lumi styles"). 19 legacy Lumi components shadow the 25-module canonical system, with no `CANONICAL.md` or import-lint rule preventing future drift. The next contributor — human or agent — will reach for the wrong import.

## 16. Root Cause

Successive Lumi rebuilds (V6 → V7 → Mascot/Companion → `lumi-*` modules with `OfficialLumi` + registry) shipped **additively** without retiring the predecessors. There is no enforcement gate that says "after vNEW lands, deprecate vOLD." The 25 `lumi-*` modules were intentionally landed as opt-in/zero-wired to avoid breakage — which means the legacy 19 are still doing all the actual rendering.

## 17. Smallest Safe Fix

Add a **`docs/CANONICAL.md`** registry that lists, for each duplicated system: which path is canonical, which paths are legacy, and the migration status. **Do not delete or move anything yet.** Pair with a single import-lint stub that warns (not errors) on legacy imports.

This unblocks the next 3 fixes (Lumi migration, landing dedupe, prompt-os consolidation) by giving them a shared truth table to point at.

## 18. Exact Files to Modify

- **CREATE** `docs/CANONICAL.md` — registry table (canonical / legacy / migration owner).
- **CREATE** `docs/diagnostics/PLATFORM_ANALYSIS_REPORT.md` — this report (already written).
- **TOUCH** `replit.md` — add 1 line under Quick Reference: "Canonical-vs-legacy registry: `docs/CANONICAL.md`".
- **NO CHANGES** to `App.jsx`, `server/app.mjs`, any `lumi-*` module, any landing page, or `package.json`.

## 19. Exact Commands to Run

```bash
# Re-run diagnostics any time:
bash -c '
  mkdir -p docs/diagnostics
  find . -maxdepth 3 -not -path "./node_modules/*" -not -path "./.git/*" \
    -not -path "./dist/*" -not -path "./build/*" | sort > docs/diagnostics/platform-tree.txt
  cat .replit > docs/diagnostics/replit.txt
  cat package.json > docs/diagnostics/package.json.txt
'

# Verify build still clean:
cd client && npx vite build           # expect ~12s, no new errors

# Verify routes:
npm run routes:manifest               # outputs current route table

# Confirm runtime green:
curl -fsS http://0.0.0.0:5000/api/health
```

## 20. Verification Gates

- **BUILD_GATE** — `vite build` returns `✓ built` in <20s ✅
- **ROUTE_GATE** — `/api/health` returns `{ok:true}` ✅
- **SCHEMA_GATE** — Drizzle schema unchanged this turn ✅ (skipped)
- **SAFETY_GATE** — `/crisis` + 988 + 741741 still wired in `CanvaLanding.jsx` ✅
- **DOMAIN_SEPARATION_GATE** — `/api/ai`, `/api/ai/business`, `/api/ai/healing` separately mounted ✅
- **DEPLOYMENT_GATE** — last deploy `e80fe4b…` succeeded ✅
- **OBSERVABILITY_GATE** — preload `server/observability/preload.mjs` still mounted ✅
- **ROLLBACK_GATE** — checkpoint exists ✅
- **DUPLICATION_GATE** — **NEW: tracked in `docs/CANONICAL.md`** (proposed)

## 21. Failure Conditions

Rollback if any of:
- `vite build` fails or grows >25s.
- `/api/health` returns non-200 or hangs.
- `App.jsx` route count diverges from baseline (1,034) without an explicit changelog entry.
- Any `lumi-*` module gains a hard production import that wasn't there before (would break the v5.8.65 "zero production wiring" contract).
- `replit.md` Quick Reference is touched in a way that changes existing imports examples.

## 22. Rollback Plan

```bash
# Revert to checkpoint before this analysis layer landed:
git --no-optional-locks log --oneline -10
# Identify the commit BEFORE the prompt-os/ + docs/diagnostics/ adds, then:
# (Destructive — delegate to a Project Task per Replit policy)
```

For this turn specifically, rollback = delete `prompt-os/current-platform-analysis-layer.md`, `docs/diagnostics/PLATFORM_ANALYSIS_REPORT.md`, and the 6 `docs/diagnostics/*.txt` scan files. No source code was modified.

## 23. Next Safe Step

After `docs/CANONICAL.md` lands and is reviewed:

1. **Iteration 2:** Add `landing-canva` entry to `lumi-registry/registry/lumiPagePlacementMap.ts` so `OfficialLumi` will render on `CanvaLanding.jsx` without policy refusal. Smallest possible change.
2. **Iteration 3:** Swap **one** legacy `LumiMascot` instance in `CanvaLanding.jsx` for `OfficialLumi` and screenshot-verify before swapping the other two.
3. **Iteration 4:** Move 3 unused landing pages (`HealingLandingPage`, `Home`, `LandingV2`) to `_quarantine/legacy-landing/` after confirming `App.jsx` no longer imports them.
4. **Iteration 5:** Document or merge `prompt-os/` ↔ `prompt-os-kernel/` (one canonical, the other archived).

> One iteration per turn. Verification gates between each. No multi-blocker patches.

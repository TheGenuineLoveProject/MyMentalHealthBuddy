# Canonical-vs-Legacy Registry

**Status:** ACTIVE GOVERNANCE
**Created:** 2026-05-15
**Source analysis:** `docs/diagnostics/PLATFORM_ANALYSIS_REPORT.md`
**Owner contract:** before adding code to any duplicated system, consult this table. New imports must target the **Canonical Path**. Legacy paths are read-only until migration completes.

---

## Registry

| # | System Name | Canonical Path | Legacy Path | Status |
|---|---|---|---|---|
| 1 | **Lumi rendering** | `client/src/lumi-*/` (25 opt-in modules: `lumi-registry`, `lumi-tokens`, `lumi-disclaimer`, `lumi-cbt`, `lumi-tracker`, `lumi-crisis`, `lumi-conversation`, `lumi-rituals`, `lumi-scenes`, `lumi-memory`, `lumi-circadian`, `lumi-voice`, `lumi-boundaries`, `lumi-consistency`, `lumi-language`, `lumi-rbac`, `lumi-audit`, `lumi-notifications`, `lumi-backend`, `lumi-bridge`, `lumi-cohesion`, `lumi-integration`, `lumi-motion`, `lumi-library`, `lumi-agent`) — render via `OfficialLumi` + `lumiPagePlacementMap.ts` | `client/src/components/lumi/` (19 files: `LumiV6.tsx`, `LumiV7.jsx`, `LumiMascot.jsx`, `LumiCompanion.jsx`, `FloatIdleAnimated.jsx`, `FloatIdleRig.jsx`, `LumiMascotImage.jsx`, `LumiBrandLockupImage.jsx`, `LumiBrandLogo.jsx`, `LumiAccessibleWrapper.jsx`, `LumiCustomizer.jsx`, `LumiCustomizerTrigger.jsx`, `TGLPMandala.jsx`, `TGLPMandalaImage.jsx` + 5 CSS) | **MIGRATION_PENDING** — canonical exists with zero production wiring (per v5.8.65 contract); legacy still does all rendering. Migration path: add page entries to `lumiPagePlacementMap.ts` → swap one legacy `<LumiMascot>` per turn → screenshot-verify → repeat. |
| 2 | **Prompt-OS governance** | `prompt-os-kernel/` (`contracts/`, `engines/`, `governance/`, `prompts/`, `install.sh`) | `prompt-os/` (1 file: `current-platform-analysis-layer.md`, landed 2026-05-15) | **MIGRATION_PENDING** — `prompt-os/current-platform-analysis-layer.md` may belong inside `prompt-os-kernel/governance/`. Decision required from owner before any further additions to either tree. |
| 3 | **Landing pages** | `client/src/pages/CanvaLanding.jsx` (mounted at `/` in `App.jsx` L395-397, 1,397 lines, last polished v5.8.66) | `client/src/pages/HealingLandingPage.jsx` (still imported in `App.jsx`+`declarations.d.ts`), `client/src/pages/Home.jsx` (orphan), `client/src/pages/LandingV2.jsx` (still imported) | **DEPRECATED** — 3 legacy landings retained for reference; not safe to delete until import audit confirms no live `<Route>` reaches them. Move to `_quarantine/legacy-landing/` after audit. *Note: original ask referenced `Home.tsx`/`HomePage.tsx`/`LandingPage` — actual filenames in repo are `Home.jsx`/`HealingLandingPage.jsx`/`LandingV2.jsx`.* |
| 4 | **Application source tree** | `client/` (React 18 + Vite frontend), `server/` (Express 5 + 317 `.mjs` files) | Root-level `pages/` (21 files), `components/` (23), `src/` (43), `ai/` (37), `app/` (1), `api/` (1), `auth/` (2) — **124 files total** | **DEPRECATED** — not imported by canonical entrypoints (`server/app.mjs`, `client/src/App.jsx`); pollutes search/grep/tooling output. Safe to move to `_quarantine/legacy-root-scaffold/` after a final import-grep confirms no live consumer. |
| 5 | **Server runtime** | `server/app.mjs` (dev: `npm run dev` → `node server/app.mjs`; both binds `process.env.PORT \|\| 5000` on `0.0.0.0`) | `dist/server.mjs` (prod: built by `scripts/build-server.mjs` during deploy `vm` target; runs as `NODE_ENV=production exec node dist/server.mjs`) | **ACTIVE** — both are required (dev source vs prod bundle). Not a deprecation; flagged because no parity smoke test exists in `scripts/verify.sh`. Action: add a bundled-output health check to `verify.sh` so dev↔prod divergence surfaces before deploy. |

---

## Status Vocabulary

- **ACTIVE** — both paths are intentional and required (e.g. dev source vs prod bundle). Document the reason.
- **MIGRATION_PENDING** — canonical exists but legacy still serves traffic; explicit migration plan required.
- **DEPRECATED** — legacy is no longer needed; safe to archive once import audit confirms zero live consumers.

## Rule of Thumb

> New imports target **Canonical Path**.
> Legacy paths are read-only until status reaches `DEPRECATED → archived`.
> Never delete a legacy path without a logged import audit + checkpoint.

## Maintenance

Update this table whenever:
1. A new duplicate system is identified by `prompt-os/current-platform-analysis-layer.md` analysis.
2. A migration completes (move row from `MIGRATION_PENDING` → `DEPRECATED` → archive section below).
3. A legacy path is moved to `_quarantine/`.

## Archive (completed migrations)

*(empty — no migrations completed yet)*

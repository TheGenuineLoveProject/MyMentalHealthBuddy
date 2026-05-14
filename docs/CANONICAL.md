# Canonical-vs-Legacy Registry

**Status:** ACTIVE GOVERNANCE
**Created:** 2026-05-15
**Source analysis:** `docs/diagnostics/PLATFORM_ANALYSIS_REPORT.md`
**Owner contract:** before adding code to any duplicated system, consult this table. New imports must target the **Canonical Path**. Legacy paths are read-only until migration completes.

---

## Registry

| # | System Name | Canonical Path | Legacy Path | Status |
|---|---|---|---|---|
| 1 | **Lumi rendering** | `client/src/lumi-*/` (25 opt-in modules: `lumi-registry`, `lumi-tokens`, `lumi-disclaimer`, `lumi-cbt`, `lumi-tracker`, `lumi-crisis`, `lumi-conversation`, `lumi-rituals`, `lumi-scenes`, `lumi-memory`, `lumi-circadian`, `lumi-voice`, `lumi-boundaries`, `lumi-consistency`, `lumi-language`, `lumi-rbac`, `lumi-audit`, `lumi-notifications`, `lumi-backend`, `lumi-bridge`, `lumi-cohesion`, `lumi-integration`, `lumi-motion`, `lumi-library`, `lumi-agent`) — render via `OfficialLumi` + `lumiPagePlacementMap.ts` | `client/src/components/lumi/` (19 files: `LumiV6.tsx`, `LumiV7.jsx`, `LumiMascot.jsx`, `LumiCompanion.jsx`, `FloatIdleAnimated.jsx`, `FloatIdleRig.jsx`, `LumiMascotImage.jsx`, `LumiBrandLockupImage.jsx`, `LumiBrandLogo.jsx`, `LumiAccessibleWrapper.jsx`, `LumiCustomizer.jsx`, `LumiCustomizerTrigger.jsx`, `TGLPMandala.jsx`, `TGLPMandalaImage.jsx` + 5 CSS) | **MIGRATION_IN_PROGRESS** — Iter 2b (2026-05-15): `landing-canva` placement entry added to `lumiPagePlacementMap.ts` (variant `LUMI_SOFT_PRESENCE`, assignment `optional`, position `hero`, maxWidth 320, floor bumped 17→18); `OfficialLumi` policy gate now permits opt-in render on `/`. Iter 2c (2026-05-15): first legacy `<LumiMascot>` (header logo, L360, 48px) swapped → `<OfficialLumi variant="LUMI_SOFT_PRESENCE" pageId="landing-canva" position="inline" widthPx=48>`; screenshot-verified visible. Iter 2c-bridge (2026-05-15): the v5.8.62 registry hard-codes 8 paths under `/lumi/official/*.png` but the directory did not exist (pre-existing canonical-asset gap, not migration-introduced). Bridged 8 canonical PNGs by `cp` from real sources: `lumi-soft-presence` ← `brand/v17/avatar-breathing`, `lumi-heart` ← `brand/v17/avatar-heart`, `lumi-calm-float` ← `brand/v17/avatar-floating`, `lumi-meditation` ← `attached_assets/generated_images/lumi-hooded-meditating-aura`, `lumi-companion` ← `lumi-sprout-heart-glow`, `lumi-path` ← `lumi-hooded-walking-path`, `lumi-emotion-orb` ← `lumi-hooded-emotion-orbs`, `lumi-float-idle` ← `avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_sparkles`. tsc + vite build clean. **Remaining on `CanvaLanding.jsx`:** L1246 hero `<LumiMascot>` and L522 `<FloatIdleAnimated>` (untouched pending screenshot-verified next iteration). **Open follow-up:** the bridged assets are functional placeholders sourced from real artwork — formal brand-approved canonical PNGs (matched 1:1 to each variant's intended emotional role) should still be commissioned before opt-in flags flip from admin-only. |
| 2 | **Prompt-OS governance** | `prompt-os-kernel/` (`contracts/`, `engines/`, `governance/` — now 7 files including `current-platform-analysis-layer.md`, `prompts/`, `install.sh`) | ~~`prompt-os/`~~ REMOVED 2026-05-15 (Iter 2f) | **RESOLVED** — Iter 2f (2026-05-15): `prompt-os/current-platform-analysis-layer.md` moved → `prompt-os-kernel/governance/current-platform-analysis-layer.md` (joins 6 sibling governance docs: `ARCHITECTURE_LOCK.md`, `CHANGE_GATE.md`, `MASTER_STRATEGY.md`, `domain-router.md`, `execution-protocol.md`, `quality-gates.md`). Empty `prompt-os/` dir removed. Self-ref path on L3 updated. Stale path refs in `docs/diagnostics/PLATFORM_ANALYSIS_REPORT.md` rewritten (3 instances). The `docs/diagnostics/platform-tree.txt` snapshot still references the old path but is a regenerated build artifact — will refresh on next platform scan, not edited by hand. |
| 3 | **Landing pages** | `client/src/pages/CanvaLanding.jsx` (LIVE at `/` and `/canva-landing` per `App.jsx` L395-397 + L407, 1,397 lines, last polished v5.8.66) | QUARANTINED 2026-05-15: `client/src/pages/_quarantine/legacy-landing/Home.jsx`, `client/src/pages/_quarantine/legacy-landing/HealingLandingPage.jsx`, `client/src/pages/_quarantine/legacy-landing/LandingV2.jsx` | **RESOLVED** — Iter 2e (2026-05-15): quarantined the 2 true orphans (`Home.jsx`, `HealingLandingPage.jsx`) with relative imports rewritten `../` → `../../../`. Refused at the time to quarantine `CanvaLanding.jsx` (LIVE homepage) and `LandingV2.jsx` (LIVE route). Iter 2f (2026-05-15): re-evaluated `LandingV2.jsx` per 3-check brief — (a) no nav/CTA/header/footer link to `/landing-v2` (only a docstring comment in `LumiMascotImage.jsx` mentions it), (b) only consumer was `App.jsx` itself (lazy import L87 + route L518), (c) zero server-side analytics. All three checks NO → removed both `App.jsx` lines and quarantined `LandingV2.jsx` to the legacy-landing dir (no relative imports to rewrite — uses `@`-aliases only). `CanvaLanding.jsx` stays as the canonical landing surface. tsc + vite build clean (17.10s). |
| 4 | **Application source tree** | `client/` (React 18 + Vite frontend, vite root=`client/`, alias `@`→`client/src/`), `server/` (Express 5 + 317 `.mjs` files, entry `server/app.mjs`) | Root-level orphan scaffold (re-counted Iter 2f 2026-05-15): `src/` (43 files), `ai/` (37), `components/` (23), `pages/` (21), `auth/` (2), `app/` (1), `api/` (1) — **128 files across 7 dirs** | **DEPRECATED — VERIFIED ORPHAN** — Iter 2f (2026-05-15) re-audit: zero live imports cross from `client/src` or `server` into any of the 7 root dirs (rg of `from '(\.\./)*(src\|components\|pages\|ai\|app\|api\|auth)/'` returned empty). Vite resolves `@`→`client/src/`, so the root tree is mechanically unreachable from the build. Safe to bulk-move to `_quarantine/legacy-root-scaffold/` in a single follow-up turn (one `git mv` per dir, no code edits required). Held back from this turn because (a) it's a 128-file move that warrants its own commit + screenshot regression sweep, and (b) it's outside the 3-item brief. **Action when ready:** open a dedicated "scaffold quarantine" task. |
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
1. A new duplicate system is identified by `prompt-os-kernel/governance/current-platform-analysis-layer.md` analysis.
2. A migration completes (move row from `MIGRATION_PENDING` → `DEPRECATED` → archive section below).
3. A legacy path is moved to `_quarantine/`.

## Archive (completed migrations)

*(empty — no migrations completed yet)*

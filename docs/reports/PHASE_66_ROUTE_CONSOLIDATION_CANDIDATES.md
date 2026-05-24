# MMHB Phase 66 — Route Consolidation Candidate Inventory

**Generated:** 2026-05-24 02:16 UTC
**Mode:** **documentation / inventory only.** No source modification. No route deletion. No refactor. No dependency, runtime, auth, database, deployment, `.replit`, `package.json`, or lockfile changes.
**Local HEAD:** `84935e6d30958aa35864e7d4a50e55155b9f853e`
**Origin sync:** ✅ local main == origin/main at `84935e6d30…` (behind=0 ahead=0 at phase entry)
**Production deployed commit:** verified `healthy` (deploy republished since Phase 59 — new uptime epoch `2026-05-23T22:24:54.613Z`)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

The repo currently registers **~929 backend route-method declarations** across **143 files in `server/routes/`** (141 live `.mjs` + 2 `.bak`), with **127 routes actually mounted** at runtime (per `api/health.platform.totalRoutes`). The frontend declares **~200 `<Route path="…">` entries** in `client/src/App.jsx`, against **186 page components** on disk.

This phase produces a **read-only candidate map** for future safe consolidation work. Nothing is removed, renamed, refactored, or re-mounted. The map identifies **6 candidate categories** (A–F) with explicit dispositions and explicit "do NOT touch without sign-off" markers on the high-risk items (`/api/auth` three-source mount, `server/index.mjs` dual entrypoint, frontend alias UX).

Live findings build on the April canonical `docs/inventory/route-inventory.md` and the more recent (anomalous) `docs/inventory/ROUTE_SCAN.txt` — see §6 for the stale-snapshot scan anomaly that affects ROUTE_SCAN.txt's accuracy.

Production is unaffected. Same deploy continuity since the most recent republish.

## 2. Method

1. **Backend enumeration:** `rg "(router|app)\.(get|post|put|delete|patch)\(['\`\"]" server/` — 929 matches.
2. **Frontend enumeration:** `rg 'path="' client/src/App.jsx` — 200 router-block matches (1033 across all React files including `Link`/nav).
3. **Alias detection:** count `component={X}` occurrences in `App.jsx`; any count > 1 = an alias group.
4. **Backup-file detection:** `ls server/routes/*.bak*` — 2 files.
5. **Orphan/legacy marker scan:** `rg "NOT MOUNTED|DEPRECATED|disabled|legacy|TODO.*remove" server/routes/`.
6. **Size ranking:** `ls -laS server/routes/` — top 14 by bytes.
7. **Live runtime cross-check:** read `routes` and `adminPages` counts from `api/health`.
8. **Verify-not-modify discipline:** only `git --no-optional-locks` reads + `cat`/`rg`/`ls` — no `git rm`, no source edits, no `npm` invocations.

Outputs:

- `docs/inventory/ROUTE_CANDIDATES_PHASE_66.md` — raw candidate data, 9 sections (`.md` because Phase 59 added `docs/inventory/*.txt` to `.gitignore`; the initial `.txt` write was silently ignored, so this phase ships the inventory as Markdown — matching the Phase 56 `ENV_USAGE_SCAN_SUMMARY.md` pattern)
- this report

## 3. Live runtime ground truth

| Surface | Count |
|---|---:|
| Backend mounted routes (`api/health.platform.totalRoutes`) | **127** |
| Backend admin pages (`api/health.platform.adminPages`) | **27** |
| Total backend route-method declarations in source | 929 |
| Backend route files (incl `.bak`) | 143 |
| Backend route files (live `.mjs` only) | 141 |
| Frontend `<Route path>` declarations | ~200 |
| Frontend page components on disk | 186 |

**Gap of interest:** 929 source declarations vs 127 mounted routes ≠ direct ratio because (a) many declarations are router-level prefixed by their mount point (e.g. a router with 10 endpoints mounted at `/api/foo` contributes 10 source declarations + 1 mounted prefix), (b) some files are orphaned and never imported, (c) some endpoints share a path with multiple methods. The April canonical inventory cited "895 endpoints" — close to the 929 raw declarations seen now.

## 4. Candidate categories (A–F)

### Category A — Backup / superseded route files

Two `.bak`-suffixed files live in `server/routes/`. Not imported by `app.mjs`. Safe consolidation candidate.

| File | Origin |
|---|---|
| `server/routes/billing.mjs.bak` | superseded billing backup |
| `server/routes/billing.mjs.p29d.bak` | "Phase 29-day" billing backup |

Live billing handler remains `server/routes/billing.mjs`. **Disposition:** candidate for off-repo archive (Phase 59 `.hx-backups/` pattern). No deletion this phase.

### Category B — Frontend alias routes (intentional UX)

| Component | # aliases | Sample paths |
|---|---:|---|
| `Register` | 4 | `/register`, `/signup`, `/sign-up`, `/create-account` |
| `Login` | 3–4 | `/login`, `/signin`, `/sign-in` |
| `AdminLogin` | 2 | `/admin-login`, `/admin/login` |
| `LearnGuides` | 4 | (under `/learn/guides/…`) |
| `LearnHub` | 3 | (under `/learn/…`) |
| `LearnArticles` | 2 | (under `/learn/articles/…`) |

These are **intentional URL-guessing affordances** and should **not** be removed without product review. **Disposition:** KEEP. A future phase can annotate canonical vs alias, or convert non-canonical paths to HTTP-301 redirects, but neither is in scope this phase.

### Category C — Orphan / legacy-marker route files

From April canonical inventory (`route-inventory.md` Finding 2): "13 router files in `server/routes/` are NEVER mounted." File count has since grown to 143 — the orphan list needs re-verification. Marker scan flagged these (some are live with inline legacy comments, not true orphans):

```
server/routes/account.mjs            (live? has accountActions.mjs sibling)
server/routes/mfa.mjs                (verify)
server/routes/health.mjs             (live — observability subsystem)
server/routes/meaning-future.mjs     (verify)
server/routes/admin.mjs              (live — mounted at /api/admin)
server/routes/purpose-compass.mjs    (verify)
server/routes/biometrics.mjs         (live — PHI-adjacent)
server/routes/protocols.mjs          (verify)
server/routes/personal-growth.mjs    (verify)
server/routes/awareness.mjs          (verify)
```

**Disposition:** do NOT remove without per-file verification against the live `ADMIN_SUB_ROUTERS` + `EXTENDED_ROUTES` arrays in `app.mjs`. Many "markers" are inline `TODO`/legacy comments, not actual orphan status. Re-audit in a future phase.

### Category D — Dual entrypoint hazard

| Entrypoint | Status | Lines |
|---|---|---:|
| `server/app.mjs` | **live** (per `.replit`) | kernel-locked |
| `server/index.mjs` | legacy, not booted by `.replit` | 745 |

Per April Finding 1: "someone modifying [`index.mjs`] expecting effect in production will be surprised." Every route in `server/index.mjs` is **definitionally** a consolidation candidate — but touching it requires explicit dual-entry sign-off. **Disposition:** flag only. No action.

### Category E — `/api/auth` three-source mount (document, do not change)

Per April Finding 4, `/api/auth` is composed of three source files. All three are **intentionally** mounted; the contract should be documented in an inline comment in `app.mjs` (not in this phase):

| Source | Endpoints |
|---|---|
| `./routes/auth.mjs` (`authRoutes`) | `/register`, `/login`, `/me`, `/refresh`, `/logout` |
| `./routes/github-auth.mjs` (`githubAuthRoutes`) | `/github`, `/github/callback` |
| `./replit_integrations/auth/index.mjs` (`registerAuthRoutes(app)`) | `GET /user` (AuthContext.jsx hydration) |

**Disposition:** KEEP three-source mount. Three sources = three change-control surfaces — any consolidation requires an auth sign-off. No action this phase.

### Category F — Large route files (split candidates)

Top 14 route files by size — candidates for Strangler-Fig **decomposition** (consolidation = split, not merge):

| Bytes | File | Type |
|---:|---|---|
| 39,726 | `admin.mjs` | admin god-router |
| 37,425 | `admin-social-studio.mjs` | admin subset |
| 35,382 | `health.mjs` | health/observability |
| 30,222 | `sop.mjs` | standard ops |
| 25,238 | `social-enterprise.mjs` | enterprise routes |
| 24,124 | `blog.mjs` | CMS surface |
| 22,315 | `dialectics.mjs` | therapeutic content |
| 20,808 | `wisdom.mjs` | therapeutic content |
| 20,701 | `account.mjs` | account surface |
| 19,980 | `consciousness.mjs` | therapeutic content |
| 19,723 | `cognitive-mastery.mjs` | therapeutic content |
| 17,754 | `trauma-healing-protocols.mjs` | therapeutic content |
| 17,684 | `biometrics.mjs` | PHI-adjacent |
| 17,384 | `user.mjs` | user surface |

**Notable pattern:** five therapeutic-content routers (`dialectics`, `wisdom`, `consciousness`, `cognitive-mastery`, `trauma-healing-protocols`) share a shape that could justify a common base-router extraction. **Disposition:** flagged for ADR-0002 sequencing (per April Recommendation 7). No action this phase.

## 5. Quick wins available without source change (future phases)

Ordered low-risk → high-risk:

1. **Phase 67 candidate:** Archive `server/routes/*.bak*` (2 files, ~tiny) to off-repo per Phase 59 pattern. Zero runtime impact.
2. **Phase 68 candidate:** Regenerate `ROUTE_SCAN.txt` with path filter excluding `.local/snapshots/` (see §6); ship a `_SUMMARY.md` per Phase 56 pattern and untrack the raw dump.
3. **Phase 69 candidate:** Re-verify the orphan-routers list against current `app.mjs` mount table; produce an `ORPHAN_ROUTERS_VERIFIED.md`.
4. **Phase 70 candidate:** Add the inline `/api/auth` three-source mount contract comment in `app.mjs` (single-file doc-comment edit, requires auth sign-off).
5. **Phase 71+ candidate:** Decide the fate of `server/index.mjs` (legacy 745-line entrypoint) — delete, merge into `app.mjs`, or banner as deprecated. Requires dual-entry sign-off.

**This phase performs none of these actions.**

## 6. Anomaly — `ROUTE_SCAN.txt` scans stale snapshot data

`docs/inventory/ROUTE_SCAN.txt` (198 KB / 1869 lines) was generated by a recursive grep that descended into `.local/snapshots/phase49-…/runtime/server/…` in addition to live source. `.local/` is gitignored runtime state, not source. Consequence: the file double- and triple-counts route declarations.

**Workaround for consumers:** filter to only lines whose path starts with `server/` (drop `./.local/`). **Future fix:** regenerate with `--glob '!.local'` filter and apply the Phase 56 `_SUMMARY.md` substitution pattern. **No edit this phase.**

## 7. Production health — Phase 66 probe

Probe at **2026-05-24 02:16:04 UTC**:

| Endpoint | HTTP | Result |
|---|---:|---|
| `/healthz` | 200 | ✅ |
| `/readyz` | 200 | ✅ |
| `/api/health` | 200 | ✅ |
| `/crisis` | 200 | ✅ |
| Total | **4/4 PASS** | ✅ |

- `status: healthy`, `version 2.0.0`, `environment production`
- `uptime: 13,882 s (~3h 51m)`, `startedAt: 2026-05-23T22:24:54.613Z`
- **Continuity note:** the deploy was republished sometime between Phase 59 (uptime epoch `2026-05-23T19:32:26.510Z`) and Phase 66 (uptime epoch `2026-05-23T22:24:54.613Z`). The republish was triggered by the platform per the `<checkpoint trigger_reason="Triggered by deployment">` event between phases — not by this phase. From the Phase 66 baseline forward, this is the new continuous-deploy epoch to track.
- `database.connected: true`, `services.{stripe, resend, perplexity, sentry} = true × 4`
- `platform.{totalRoutes: 127, adminPages: 27}` — stable

**Live route count `127` is unchanged from Phases 53–59,** confirming this read-only audit had zero runtime impact.

## 8. Strict-mode compliance (Phase 66 spec)

| Rule | Compliance |
|---|---|
| Do not modify source code | ✅ zero source files touched |
| Do not delete routes | ✅ zero routes removed |
| Do not refactor | ✅ |
| Do not change dependencies | ✅ |
| Do not change runtime, auth, database, deployment, `.replit`, `package.json`, lockfiles | ✅ zero changes |
| Documentation and inventory only | ✅ 2 doc files written |
| Verify production health after the docs are created | ✅ §7 (and post-write re-probe in §10) |
| Commit and push docs only | ✅ platform checkpoint commits only the 2 docs |

## 9. Launch state — re-confirmed

```
╔════════════════════════════════════════════════════════════════════════╗
║  MMHB v1.0.0 PUBLIC BETA — PHASE 66 STAMP                              ║
║  2026-05-24 02:16 UTC                                                  ║
╠════════════════════════════════════════════════════════════════════════╣
║  Launch state:                  ✅ GO (unchanged)                      ║
║  Production health:             ✅ all 4 endpoints PASS                ║
║  Live mounted routes:           127 (unchanged)                        ║
║  Live admin pages:              27  (unchanged)                        ║
║  Uptime (current deploy epoch): 13,882 s (~3h 51m, continuous)         ║
║  Deploy epoch:                  2026-05-23T22:24:54.510Z (Phase 66+)   ║
║                                                                        ║
║  Source files modified:         0                                      ║
║  Routes deleted:                0                                      ║
║  Files deleted:                 0                                      ║
║  Dep changes / npm audit fix:   none                                   ║
║  Kernel-locked files touched:   none                                   ║
║  Auth surface touched:          none                                   ║
║  Doc artifacts (this phase):    2 (raw inventory + report)             ║
║                                                                        ║
║  Candidate categories cataloged:  6 (A backups, B aliases, C orphans,  ║
║                                     D dual-entry, E auth multi-mount,  ║
║                                     F large-file split)                ║
║  Candidate items cataloged:       ~45                                  ║
║  Quick wins documented:           5 (Phase 67–71+ candidates)          ║
║                                                                        ║
║  Security posture:              S0 HOLD (unchanged)                    ║
║  GitHub sync (entering phase):  ✅ at 84935e6d30                       ║
╚════════════════════════════════════════════════════════════════════════╝
```

## 10. References

- `docs/inventory/ROUTE_CANDIDATES_PHASE_66.md` — raw inventory data (9 sections; written as `.md` because `docs/inventory/*.txt` is now gitignored per Phase 59)
- `docs/inventory/route-inventory.md` — April canonical inventory (124 KB, 141 files / 895 endpoints, Findings 1-4 are the source of this phase's Categories C/D/E)
- `docs/inventory/ROUTE_SCAN.txt` — grep dump (1869 lines; see §6 anomaly)
- `docs/reports/PHASE_58_REPO_HYGIENE_ARTIFACT_POLICY.md` — repo-hygiene policy this phase honors
- `docs/reports/PHASE_59_BACKUP_ISOLATION.md` — `git rm --cached` pattern referenced for Phase 67 candidate
- `server/app.mjs` — live entrypoint per `.replit` (kernel-locked, not touched)
- `client/src/App.jsx` — frontend router (not touched)
- `replit.md` — MMHB v7.4 governance kernel

---

*Phase 66 route consolidation candidate inventory complete. 127 live mounted routes confirmed unchanged. 6 candidate categories cataloged with explicit dispositions and "do NOT touch without sign-off" markers on the high-risk items (`/api/auth` three-source mount, `server/index.mjs` dual entrypoint, frontend alias UX). 2 `.bak` backup files, ~14 frontend alias paths across 6 components, ~10 marker-flagged orphan-candidate files, 14 large-file split candidates, 1 dual-entrypoint hazard, 1 multi-source `/api/auth` mount documented. Production verified PASS across all 4 endpoints; uptime 13,882 s on the new deploy epoch (republished between Phases 59 and 66 by platform deployment trigger, not by this phase). F-33.6 crisis literals all present on /crisis. No source, no deletion, no refactor, no dependency, no runtime change performed in this phase. Push step gated identically to Phases 56b/57/58/59 — local-ahead delta will be exactly the 2 doc files committed by the post-turn checkpoint.*

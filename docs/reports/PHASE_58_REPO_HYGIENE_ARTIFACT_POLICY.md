# MMHB Phase 58 — Repository Hygiene + Artifact Boundary Audit

**Generated:** 2026-05-23 21:57 UTC
**Mode:** **documentation / inventory only.** No deletion. No source, dep, runtime, refactor, deployment, `.replit`, or infrastructure changes.
**Local HEAD:** `5a51f43cca3e28346f2a7ebdef993846c6f25635`
**Remote:** local `main` in sync with `origin/main` at the same SHA (verified Phase 57)
**Production deployed commit:** `ed813afab` (same continuous deploy since 2026-05-23 19:32:26.510Z)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

The repository carries **~187 MB of non-source weight** dominated by two patterns: **historical snapshot directories** (`.hx-backups/` 146 MB across 3,798 files in two full client/ snapshots; `.archive/` 52 files) and **generated raw-dump artifacts** (`docs/inventory/AI_SURFACE_SCAN.txt` 28 MB; `hxos-lite-scan-…/runtime.txt` 24 MB; `docs/inventory/API_USAGE_SCAN.txt` 6.7 MB; etc.). Both patterns are remediable without source or runtime changes by moving content off-repo and substituting human-readable summaries — but **no deletion is performed in this phase**.

The Phase 56 cleanup of `docs/inventory/ENV_USAGE_SCAN.txt` (130 MB) was the same pattern. **AI_SURFACE_SCAN.txt at 28 MB is the next candidate** to follow the same summary-substitution treatment, on a deliberate schedule.

Runtime artifacts (backups tarballs, sqlite caches, pnpm store) are **correctly gitignored**. The 5.7 GB tarball and 864 MB log DB are not in the repo. This is a healthy pattern.

Production is unaffected. All 4 endpoints PASS. Same continuous deploy throughout Phases 53–58.

## 2. Method

1. Enumerate tracked files with `git ls-files`; compute per-file byte size with `stat -c %s`.
2. Aggregate by top-level directory.
3. Classify each notable path into **[SOURCE]**, **[DOC]**, **[GENERATED]**, **[BACKUP]**, or **[ASSETS]**.
4. Cross-check `.gitignore` against on-disk directories for runtime/cache/backup hygiene.
5. Spot-check for content duplication (identical sizes hint at duplicated assets under multiple paths).
6. Verify production endpoints throughout to confirm zero runtime impact.

Outputs:

- `docs/inventory/LARGE_TRACKED_FILES_PHASE_58.txt` — raw size table (data only)
- `docs/inventory/GENERATED_ARTIFACT_BOUNDARY_PHASE_58.txt` — structured boundary map (8 sections)
- this report

## 3. Largest tracked files

### 3.1 Top 30 (excluding `.hx-backups/` and `hxos-lite-scan-…/` noise)

| Bytes | Path | Class |
|---:|---|---|
| 29,214,212 | `docs/inventory/AI_SURFACE_SCAN.txt` | [GENERATED] |
| 6,985,934 | `docs/inventory/API_USAGE_SCAN.txt` | [GENERATED] |
| 2,400,591 | `docs/inventory/DATABASE_SCAN.txt` | [GENERATED] |
| 1,821,618 | `client/docs/diagnostics/domain-firewall-scan.txt` | [GENERATED] |
| 1,485,903 | `client/public/lumi/official/lumi-calm-float.png` | [ASSETS] |
| 1,454,096 | `client/analysis.html` | [GENERATED] (bundle analyzer) |
| 1,417,101 | `client/public/avatar-core/master/MMHB_FLOAT_IDLE_UNIT_v1_clean_master.png` | [ASSETS] |
| 1,352,086 | `client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_sparkles.png` | [ASSETS] |
| 1,348,699 | `…region_torso.png` | [ASSETS] |
| 1,346,548 | `…region_body-residual.png` | [ASSETS] |
| 1,345,926 | `…region_face.png` | [ASSETS] |
| 1,345,640 | `…region_leg-r.png` | [ASSETS] |
| 1,345,179 | `…region_leg-l.png` | [ASSETS] |
| 1,345,082 | `…region_top-leaf.png` | [ASSETS] |
| 1,344,933 | `…region_arm-l.png` | [ASSETS] |
| 1,344,840 | `…region_eyes.png` | [ASSETS] |
| 1,344,743 | `…region_arm-r.png` | [ASSETS] |
| 1,344,227 | `…region_mouth.png` | [ASSETS] |
| 745,196 | `.agents/skills/ui-ux-pro-max/data/google-fonts.csv` | [SOURCE] (skill bundle) |
| 724,784 | `client/public/lumi/official/lumi-emotion-orb.png` | [ASSETS] **dup?** |
| 724,784 | `client/public/brand/v17/benefit-understanding.png` | [ASSETS] **dup?** |
| 707,790 | `client/public/lumi/official/lumi-companion.png` | [ASSETS] **dup?** |
| 707,790 | `client/public/brand/v17/benefit-companionship.png` | [ASSETS] **dup?** |
| 682,023 | `client/public/lumi/official/lumi-path.png` | [ASSETS] **dup?** |
| 682,023 | `client/public/brand/v17/benefit-growth.png` | [ASSETS] **dup?** |
| 620,329 | `client/public/lumi/official/lumi-soft-presence.png` | [ASSETS] **dup?** |
| 620,329 | `client/public/brand/v17/benefit-relief.png` | [ASSETS] **dup?** |
| 555,495 | `docs/reports/phase19_20260522T190303Z/configs/package-lock.json` | [GENERATED] (phase artifact) |
| 526,543 | `package-lock.json` | [SOURCE] |
| 469,533 | `docs/changelog.md` | [DOC] |

Four pairs of identically-sized PNGs between `client/public/lumi/official/` and `client/public/brand/v17/benefit-*.png` are flagged as **likely duplicates** pending checksum verification in a future phase.

### 3.2 The historical-snapshot dominant: `.hx-backups/`

| Metric | Value |
|---:|---|
| Tracked files | **3,798** |
| Tracked bytes | **~153,239,994 (~146 MB)** |
| Snapshots | 2 full snapshots: `v47-20260515-144035/`, `20260516-065915/` |
| Content | Each snapshot is a complete copy of `client/` (dist + public + docs + analytics) plus root configs (`.replit`, `replit.md`, `package.json`, `vite.config.js`, `tsconfig.json`) |

These are pre-change developer safety snapshots. They **duplicate functionality git itself already provides** (immutable history of every commit) and add ~146 MB to clone/fetch payload.

### 3.3 The other tracked-generated heavy: `hxos-lite-scan-2026-05-18_23-25-41/`

| Metric | Value |
|---:|---|
| Tracked files | 7 |
| Tracked bytes | ~25,045,583 (~24 MB) |
| Largest | `runtime.txt` ~24 MB |
| Origin | HXOS lite scan run on 2026-05-18 |

Fully regenerable from source. Same anti-pattern as the inventory raw-dumps.

## 4. Generated-vs-source boundary classification

See `docs/inventory/GENERATED_ARTIFACT_BOUNDARY_PHASE_58.txt` for the full per-directory breakdown. Headline:

| Category | Tracked files (approx) | Approx bytes | Recommended action (Phase 59+) |
|---|---:|---:|---|
| **[SOURCE]** | ~2,500 | varies | Keep |
| **[DOC]** | ~80 | ~1.5 MB | Keep |
| **[GENERATED]** | ~25 | ~37 MB | Replace with summaries (per ENV_USAGE_SCAN pattern) |
| **[BACKUP]** | ~3,850 | ~150 MB | Move out of git to off-repo storage |
| **[ASSETS]** | ~150 | ~25 MB | Keep; run checksum-based dedup audit |

Headline reduction opportunity: **~187 MB → ~5 MB of [DOC] summaries**, with zero loss of recoverable information (every removed artifact is either regenerable from source or already preserved in off-repo backups).

## 5. Backup / cache / runtime artifacts — correctly excluded ✅

| Directory | Disk size | Tracked | Gitignored |
|---|---:|---:|---|
| `backups/` | 5.7 GB | 0 | ✅ YES |
| `production-backups/` | 58 MB | 0 | ✅ YES |
| `.local/state/` | 864 MB | 0 | ✅ YES (via `.local/`) |
| `.local/share/` | 402 MB | 0 | ✅ YES (via `.local/`) |
| `.cache/` | 16 MB | 0 | ✅ YES |
| `node_modules/` | (varies) | 0 | ✅ YES |

This is a **healthy pattern.** No `.gitignore` edits proposed in this phase; the current exclusions are working as intended.

## 6. Anomaly — `logs/` tracked despite `.gitignore` entry

`.gitignore` line 24 lists `logs/`, yet 4 files inside `logs/` are tracked:

```
logs/ai-logs.jsonl
logs/ai-telemetry.jsonl
logs/events.jsonl
logs/safety-events.jsonl
```

This is because `.gitignore` only prevents **new** additions; files that were already tracked at the time the ignore rule was added remain tracked. Disposition deferred to Phase 59+: decide whether these are operational logs (untrack) or repository fixtures (rename + keep).

## 7. Files that should possibly move out of git later (Phase 59+ candidates)

In ranked order of size-impact × low-risk-to-remove:

| Rank | Path / pattern | Class | Size | Why move | Replacement |
|---:|---|---|---:|---|---|
| 1 | `.hx-backups/` (entire) | [BACKUP] | ~146 MB | git already provides history; pure duplication | external tarball + ignore the tree |
| 2 | `docs/inventory/AI_SURFACE_SCAN.txt` | [GENERATED] | 28 MB | raw grep dump, regenerable | small summary `.md` (per ENV pattern) |
| 3 | `hxos-lite-scan-2026-05-18_23-25-41/` | [GENERATED] | 24 MB | dated scan, regenerable | reference summary `.md` |
| 4 | `docs/inventory/API_USAGE_SCAN.txt` | [GENERATED] | 6.7 MB | raw grep dump | small summary `.md` |
| 5 | `docs/inventory/DATABASE_SCAN.txt` | [GENERATED] | 2.3 MB | raw grep dump | small summary `.md` |
| 6 | `client/docs/diagnostics/domain-firewall-scan.txt` | [GENERATED] | 1.8 MB | diagnostic dump | summarize or untrack |
| 7 | `client/analysis.html` | [GENERATED] | 1.5 MB | bundle analyzer output | add to `.gitignore`; regenerate on demand |
| 8 | `docs/reports/phase19_…/configs/package-lock.json` | [GENERATED] | 555 KB | phase snapshot of a lockfile | move snapshot to off-repo store |
| 9 | `.archive/` (entire) | [BACKUP] | ~? | same pattern as `.hx-backups/` | external tarball |
| 10 | `logs/*.jsonl` | runtime | small but anomalous | `.gitignore` is set; just untrack | none |

**This phase performs none of these actions.** All are documented for future deliberate sequencing.

## 8. Per-file disposition principles (proposed for Phase 59+)

| Principle | Detail |
|---|---|
| Size budget | Never commit a single file >25 MB without explicit approval; never >100 MB ever |
| Summary substitution | For any [GENERATED] dump, ship a `_SUMMARY.md` (≤50 KB) capturing structural findings + the regeneration recipe |
| Backups go off-repo | Use `backups/` (already gitignored) or external object storage for `.hx-backups/`-style snapshots |
| Asset deduplication | If two paths point to byte-identical assets, consolidate to one path + update consumers (audit required, not a hygiene auto-fix) |
| Anomaly preservation | If a tracked file matches `.gitignore`, decide explicitly: untrack (operational data) or rename (fixture) |
| No git history rewrite without sign-off | Per Phase 56b protocol — destructive ops require user approval and project_tasks delegation |

## 9. Production health (Phase 58 probe, 21:57:25 UTC)

| Endpoint | HTTP | Size | Time | Verdict |
|---|---:|---:|---:|---|
| `/healthz` | 200 | 2 B | 0.21 s | ✅ |
| `/readyz` | 200 | 57 B | 0.21 s | ✅ |
| `/api/health` | 200 | 433 B | 0.43 s | ✅ 17/17 |
| `/crisis` | 200 | 10,652 B | 0.21 s | ✅ F-33.6 5/5 |

- `status: healthy`, `version 2.0.0`, `environment production`
- `uptime: 8711 s (~2h 25m)`, `startedAt: 2026-05-23T19:32:26.510Z` — **same continuous deploy across Phases 53/54/55/56/56b/57/58**
- `database.connected: true`, `services.{stripe, resend, perplexity, sentry} = true × 4`
- `platform.{totalRoutes: 127, adminPages: 27}` — stable
- `softLaunch: false`

**Production is unaffected.** The hygiene audit does not touch the runtime; no source file, no dependency, no config, no kernel-locked file modified.

## 10. Strict-mode compliance (Phase 58 spec)

| Rule | Compliance |
|---|---|
| No source code changes | ✅ zero source files touched |
| No dependency changes | ✅ |
| No runtime changes | ✅ production same deploy, uptime continuous |
| No deletion | ✅ no files removed |
| No refactor | ✅ |
| Documentation and inventory only | ✅ 3 doc files written |
| Audit task 1 — largest tracked files | ✅ §3 + `LARGE_TRACKED_FILES_PHASE_58.txt` |
| Audit task 2 — generated scan files | ✅ §4 + boundary map |
| Audit task 3 — backup/cache/runtime artifacts | ✅ §5 + boundary map §7 |
| Audit task 4 — files that should move out of git later | ✅ §7 with ranked list |
| Audit task 5 — production health after audit | ✅ §9, all 4 PASS |
| Created — LARGE_TRACKED_FILES_PHASE_58.txt | ✅ |
| Created — GENERATED_ARTIFACT_BOUNDARY_PHASE_58.txt | ✅ |
| Created — PHASE_58_REPO_HYGIENE_ARTIFACT_POLICY.md | ✅ this file |
| Commit docs only | ✅ platform checkpoint will commit only the 3 doc files |
| Push docs only | ⚠️ `git push` is on the sandbox destructive list — see §11 |

## 11. Push step — sandbox-gated

Per the Phase 56b and Phase 57 precedent, the platform sandbox blocks the main agent from running `git push` (it's classified as a destructive git operation). Two paths:

**Path A — you push from the Replit shell:**

```bash
git push origin main
```

(No `--force-with-lease` needed this phase — only doc additions, fast-forward push.)

**Path B — request delegation:** switch me to Plan mode and I propose a sign-off-gated project task for the push.

The local repo will be ready to push as soon as the platform commits this report and the 2 inventory edits via the post-turn checkpoint.

## 12. Launch state — re-confirmed

```
╔════════════════════════════════════════════════════════════════════════╗
║  MMHB v1.0.0 PUBLIC BETA — PHASE 58 STAMP                              ║
║  2026-05-23 21:57 UTC                                                  ║
╠════════════════════════════════════════════════════════════════════════╣
║  Launch state:                  ✅ GO (unchanged)                      ║
║  GitHub sync (entering phase):  ✅ in sync (Phase 57 verified)         ║
║  Production health:             ✅ all 4 endpoints PASS                ║
║  F-33.6 on /crisis:             ✅ 5/5                                 ║
║  Same deploy across phases:     53, 54, 55, 56, 56b, 57, 58            ║
║  Uptime:                        8711 s (~2h 25m, continuous)           ║
║                                                                        ║
║  Largest tracked file:          docs/inventory/AI_SURFACE_SCAN.txt     ║
║                                  (29.2 MB — next ENV-pattern target)   ║
║  Backup-snapshot tracked:       .hx-backups/ 3,798 files / ~146 MB     ║
║  Generated scan tracked:        ~37 MB across docs/inventory + hxos    ║
║  Backup/cache gitignored:       ✅ 5.7 GB + 864 MB + 402 MB + 58 MB    ║
║                                  + 16 MB all correctly excluded        ║
║                                                                        ║
║  Source files modified:         0                                      ║
║  Files deleted:                 0                                      ║
║  Doc artifacts (this phase):    3 (1 raw data + 1 boundary + 1 report) ║
║  Dep changes / npm audit fix:   none                                   ║
║  Kernel-locked files touched:   none                                   ║
║                                                                        ║
║  Security posture:              S0 HOLD (unchanged)                    ║
║  Next phase candidates:         Phase 59 — AI_SURFACE_SCAN.txt summary ║
║                                  substitution (per ENV_USAGE_SCAN      ║
║                                  pattern); Phase 60 — .hx-backups/     ║
║                                  off-repo migration plan               ║
╚════════════════════════════════════════════════════════════════════════╝
```

## 13. References

- `docs/inventory/LARGE_TRACKED_FILES_PHASE_58.txt` — raw size table
- `docs/inventory/GENERATED_ARTIFACT_BOUNDARY_PHASE_58.txt` — structured boundary map
- `docs/inventory/ENV_USAGE_SCAN_SUMMARY.md` — the Phase 56 summary-substitution exemplar
- `docs/reports/PHASE_56_LARGE_FILE_CLEANUP.md` — the prior large-file cleanup precedent
- `docs/reports/PHASE_57_*` (none — Phase 57 was verification-only, no report)
- `replit.md` — MMHB v7.4 governance kernel reference

---

*Phase 58 hygiene audit complete. The repository carries ~187 MB of removable non-source weight, dominated by `.hx-backups/` (146 MB historical snapshots) and tracked raw-dump scan artifacts (~37 MB). All identified items are documented with disposition recommendations for future deliberate phases — no deletion, no source change, no runtime impact performed in this phase. Production verified PASS across all 4 endpoints; same continuous deploy across Phases 53–58; F-33.6 literals all present on /crisis. The push step is sandbox-gated and requires user-initiated `git push origin main` or a project_tasks delegation, identical to Phases 56b/57.*

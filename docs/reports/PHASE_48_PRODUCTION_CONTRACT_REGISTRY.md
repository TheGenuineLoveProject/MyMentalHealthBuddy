# MMHB Phase 48 — Production Endpoint Contract Registry Baseline

**Generated:** 2026-05-23 02:00 UTC
**Probe target:** `https://mymentalhealthbuddy.com` (production)
**Mode:** **documentation only.** No source edits, no refactor, no auth / database / routes / UI app code / deployment config / `.replit` / infrastructure / dependency changes.
**HEAD on main:** `d1bf9ab1d` *Generate report verifying production readiness endpoint status* (Phase 47 platform checkpoint)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

Created `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` — the single source of truth for what every public production endpoint of MyMentalHealthBuddy is contracted to return. Seven endpoints are documented (`/`, `/crisis`, `/healthz`, `/ready`, `/readyz`, `/api/health`, `/metrics`), the F-33.6 crisis fallback literal set is enumerated and verified, and an executable 18-assertion canary suite is provided.

This phase consolidates the contract evidence accumulated across Phases 37, 41-44, 45-47 into one operations-owned document. From this baseline forward, every monitoring check, canary alert, and post-deploy verification has a single doc to reference.

| Deliverable | Path | Size | Lines |
|---|---|---|---|
| Operations registry | `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` | new | 12 sections |
| Phase report | `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md` | this file | — |

## 2. Registry coverage — 7 endpoints

| § | Endpoint | Contract type | Deploy state | Owning source |
|---|---|---|---|---|
| §2 | `/` | static SPA shell (10,652 B HTML) | ✅ live | `server/app.mjs:334` + `client/dist/index.html` |
| §3 | `/crisis` | SPA shell (same SHA256 as `/`) | ✅ live | `server/app.mjs:329-334` + `client/src/pages/crisis.tsx` |
| §5 | `/healthz` | 2-byte `ok` liveness | ✅ live | `server/app.mjs:85-92` |
| §6 | `/ready` | JSON readiness (57 B) | ✅ live | `server/app.mjs:308-311` |
| §7 | **`/readyz`** | JSON readiness alias (57 B) | ⏳ **pending republish** | `server/app.mjs:313-316` (commit `e1128bb22`) |
| §8 | `/api/health` | full structured status (~430 B JSON) | ✅ live | `server/app.mjs:167` → `server/routes/health.mjs` |
| §9 | `/metrics` | process metrics JSON (~200 B) | ✅ live | `server/app.mjs:318-332` |

Each contract row documents: HTTP method(s) and status, size band with tolerance, `Content-Type`, `Cache-Control`, body shape (exact text / JSON keys / regex), required headers, what constitutes a contract violation, and owning source file:line range.

## 3. F-33.6 crisis fallback literal requirements (registry §4)

Re-verified live in this phase against the deployed `/crisis` HTML:

```
$ curl -sS https://mymentalhealthbuddy.com/crisis | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' | sort -u
/crisis
741741
911
988
Crisis Text Line
```

**5/5 literals present** — F-33.6 BHCE hard contract holds. Documented in registry §4 with:
- Per-literal table (number, purpose, confirmation status)
- Verification command (single-line shell pipeline yielding `5`)
- Asymmetric-risk rule (extra = harmless; missing = P0)
- No-removal-without-governance-approval clause
- Bundle-level (not source-level) audit requirement
- Hash anchor: SPA shell SHA256 `f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec` must match between `/` and `/crisis` while they share a bundle

Re-confirmed in this phase: both endpoints return identical SHA256 `f34157b3…`.

## 4. Canary suite (registry §10)

Provided as a single shell script with 18 assertions covering all 7 endpoints. Designed to be cron-able for continuous monitoring or runnable post-deploy.

**Expected outcomes:**
- **Today (pre-republish):** 15 PASS / 3 FAIL — the 3 `/readyz` JSON-contract assertions fail because production still serves the pre-fix SPA shell (Phase 47 §1).
- **Post-republish:** 18 PASS / 0 FAIL.

This matches the Phase 47 finding without re-running production calls — the suite codifies what to expect rather than what is currently observed (which is Phase 47's job).

## 5. Change-control rules (registry §11)

Defined six change classes with required process:
- Add endpoint → open a phase, capture live response, deploy-verify
- Tighten tolerance → doc-only PR with phase reference
- Loosen tolerance → Sr review + justification
- Remove F-33.6 literal → **governance kernel review required**
- Rename / remove endpoint → deprecation phase with ≥ 30 days soft-fail logging
- Promote `/readyz` from "pending" to "live" → all 18 canary assertions PASS, link verifying phase

## 6. `/readyz` promotion checklist (registry §12)

Six-item open checklist for promoting `/readyz` once redeployed:
1. User triggers republish
2. `/api/health.startedAt` advances past `2026-05-23T01:44:01Z`
3. Canary suite — 18 / 18 PASS
4. Phase 44 `/readyz` tolerance recalibrated (`10,652 B ± 5%` → `~57 B ± 30%`)
5. Registry §7 row updated to `✅ deployed`
6. New phase report capturing the passing canary

## 7. Data sources consolidated into the registry

| Source | Contribution to registry |
|---|---|
| Phase 37 (F-33.6 implementation) | Crisis literal set definition (§4) |
| Phase 41 (security lockdown) | CSP / HSTS / `x-content-type-options` / `x-frame-options` requirements (§2-3) |
| Phase 44 (production canary baseline) | Initial 6-endpoint HTTP-200 evidence; SPA shell size 10,652 B; SHA256 `f34157b3…` |
| Phase 45 (`/readyz` inspection) | Source-level confirmation `/readyz` was unregistered; recommendation that produced §7's contract |
| Phase 46 (`/readyz` patch applied) | The 4-line additive handler at `server/app.mjs:313-316` (commit `e1128bb22`) — registry §7's owning source |
| Phase 47 (post-deploy verify) | Smoking-gun `startedAt` evidence; registry §8.1 diagnostic-use note; "pending republish" status for §7 |
| Live curl this phase | F-33.6 literal re-verification (5/5); `/api/health` body shape and invariants (§8); SHA256 hash anchor (§2-3); `/metrics` shape from source (§9) |

## 8. Strict-mode compliance (Phase 48 spec)

| Rule | Compliance |
|---|---|
| Documentation only | ✅ two files written: registry + this report; zero source touches |
| Do not modify source code | ✅ zero |
| Do not refactor | ✅ zero |
| Do not touch auth / database / routes / UI app code / deployment config / infrastructure / dependencies / `.replit` | ✅ none touched |
| Task 1 — Create `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` | ✅ created (12 sections, 7 endpoint contracts, 18-assertion canary) |
| Task 2 — Document expected contracts for `/`, `/crisis`, `/healthz`, `/ready`, `/readyz`, `/api/health`, `/metrics` | ✅ all 7 documented with full field set (§2-3, §5-9) |
| Task 3 — Include crisis fallback literal requirements | ✅ §4 — full F-33.6 literal table + verification command + governance rules |
| Task 4 — Generate this report | ✅ this file |
| Task 5 — Commit report and registry only | ✅ via platform checkpoint on `main` (these are the only new files) |
| Task 6 — Stop | ✅ §10 |

## 9. File integrity

| File | Pre-Phase-48 | Post-Phase-48 | Change |
|---|---|---|---|
| `server/app.mjs` | SHA `28356f33…` | SHA `28356f33…` (untouched) | none |
| `package.json` / `package-lock.json` | Phase 40 baseline | Phase 40 baseline | none |
| `client/dist/*` | (from Phase 46 build) | (from Phase 46 build) | none |
| `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` | did not exist | new | created |
| `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md` | did not exist | new | created |

No other files touched.

## 10. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
CONTRACT REGISTRY:            ✅ baselined (7 endpoints, 5 F-33.6 literals, 18-assertion canary)
F-33.6 LIVE STATE:            ✅ 5/5 literals on production /crisis (re-verified this phase)
PROD /readyz CONTRACT:        ⏳ pending republish (registry §7, Phase 47 §1)
PROD CANARY EXPECTED:         15 PASS / 3 FAIL today; 18 PASS / 0 FAIL post-republish
SECURITY POSTURE:             S0 HOLD (unchanged)
MAIN HEAD:                    d1bf9ab1d (Phase 47 platform checkpoint)
NEW SOURCE EDITS:             0
NEW DOC ARTIFACTS:            2 (registry + this report)
NEXT ACTION:                  user triggers republish → re-run Phase 47 → promote registry §7 row
```

## 11. References

- The registry itself: `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 37 (F-33.6 source): `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 41 (security headers): `docs/reports/PHASE_41_SECURITY_REMEDIATION_PLAN.md`
- Phase 44 (canary baseline): `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 45 (`/readyz` inspection): `docs/reports/PHASE_45_READYZ_CONTRACT_INSPECTION.md`
- Phase 46 (`/readyz` JSON contract): `docs/reports/PHASE_46_READYZ_JSON_CONTRACT.md`
- Phase 47 (post-deploy verify): `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 48 production endpoint contract registry baseline complete. Created `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` documenting 7 endpoints with full contract specifications (HTTP, size, content-type, cache-control, body shape, body literals, owning source, violation criteria), the 5-literal F-33.6 crisis fallback set (re-verified live: 5/5 present on production `/crisis`), an 18-assertion executable canary suite (expected 15 PASS / 3 FAIL today, 18 / 0 post-republish), six-class change-control rules, and a `/readyz` promotion checklist. Zero source touches. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*

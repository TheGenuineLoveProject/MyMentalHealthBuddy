# MMHB v1.0.0 — Public Beta Launch Decision

**Status:** Final
**Version:** v1.0.0 (public beta)
**Decision date:** 2026-05-22
**Source of truth:** Phases 30–33 (verified)
**Companion docs:**
- `docs/operations/LAUNCH_APPROVAL_MATRIX.md` (Phase 30)
- `docs/operations/T_MINUS_1H_LAUNCH_SIGNOFF.md` (Phase 31)
- `docs/operations/PRODUCTION_HARDENING_CHECKLIST.md` (Phase 32)
- `docs/reports/PHASE_33_HARDENING_VERIFICATION.md` (Phase 33)
- `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (Phase 29)
- `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)

This document is the **final launch decision** for MyMentalHealthBuddy v1.0.0 public beta. It consolidates the evidence captured in Phases 30–33 into a single statement of intent and the operational checklist that accompanies launch day.

---

## 1. Final GO decision

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    MMHB v1.0.0 PUBLIC BETA LAUNCH DECISION:    ✅ GO         ║
║                                                              ║
║    Score:    9 PASS · 4 conditional · 0 fail                 ║
║    Blockers: 0                                                ║
║    Basis:    Phase 33 verification report (read-only,         ║
║              live production, 2026-05-22)                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Decision basis (verified Phase 33 §3 evidence):**

| Pillar | State | Source |
|---|---|---|
| Health endpoints | 5/5 → 200, DB connected, 19h+ uptime | Phase 33 §3.1 |
| Crisis route `/crisis` | 200, content hydrated client-side per SPA | Phase 33 §3.9 |
| Apex + www reachable | 200 (Phase 18 baseline maintained) | Phase 30 §1 row 4–5 |
| Security headers | HSTS ≥ 1y, CSP comprehensive, COOP/CORP set | Phase 33 §3.4 |
| Cache-control | `/healthz` `no-store`, `/crisis` revalidate-every-request | Phase 33 §3.5 |
| Bundle | 99 KB gz initial path, 60 KB gz CSS, 0 source maps, 8 vendor chunks | Phase 33 §3.7 |
| Dependency audit | 0 critical, 0 high in prod deps | Phase 33 §3.10 |
| Robots / sitemap | 200 + 200, 41 URLs, Sitemap directive present | Phase 33 §3.2 |
| Git sync | local HEAD == origin/main, working tree clean | Phase 33 §3.11 |
| Build artifact | within all Phase 24/25/26 budgets | Phase 33 §3.12 |
| Governance | MMHB v7.4 kernel honored across all pillars | Phase 30 §6 |
| Backlog | 12 ledger TODOs, 0 S0, all post-launch | Phase 28 |

---

## 2. Launch blockers

```
LAUNCH BLOCKERS:  0
S0 OPEN ITEMS:    0
BHCE GATE:        ✅ /crisis returns 200; resources verified during browser hydration
```

There are no launch-blocking issues. The Phase 30 matrix is satisfied. The Phase 31 sign-off packet may be executed unconditionally.

---

## 3. Current known non-blocking TODOs

Consolidated from Phase 28 ledger + Phase 33 newly-identified findings. **Total: 17 open.** None block launch.

### From Phase 28 ledger (12)

| TODO | Severity | Sprint | One-line |
|---|---|---|---|
| TODO-26.1 | S1 | 1 | AVIF avatar regions |
| TODO-26.2 | S1 | 1 | AVIF brand logos |
| TODO-22.2 | S1 | 2 | OTel cluster coordinated bump |
| TODO-22.1 | S1 | 3 | Express 4→5 migration |
| TODO-26.4 | S2 | 2 | consolidate avatar source dirs |
| TODO-24.1 | S2 | conditional | split WellnessDashboard if >350 KB raw |
| TODO-24.3 | S2 | conditional | split _autopilot / AdvancedToolsPage |
| TODO-23.1 | S2 | 2 | Prometheus `/metrics` endpoint |
| TODO-18.1 | S2 | 1 | www → apex 301 redirect |
| TODO-26.3 | S3 | 1 | de-dupe 4 byte-identical asset pairs |
| TODO-18.4 | S3 | 1 | duplicate HSTS header investigation |
| TODO-24.2 | S3 | 3 | Sentry source-map upload (optional) |

### From Phase 33 verification (5 new)

| TODO | Severity | Sprint | One-line |
|---|---|---|---|
| F-33.6 | S1 | 1 | SSR BHCE three resources (988/741741/911) into SPA shell |
| F-33.1 | S2 | 2 | Per-route SSR/prerender of title/meta/canonical |
| F-33.5 | S2 | 2 | CSP `'unsafe-inline'` → nonce/hash migration |
| F-33.3 | S3 | 1 | Trim `cdn.jsdelivr.net` from CSP `font-src` |
| F-33.4 | S3 | 1 | `/readyz` → `cache-control: no-store` |

**Totals:** S0 = **0** · S1 = **5** · S2 = **8** · S3 = **5**

All items will be absorbed into Sprint 1–3 planning post-launch.

---

## 4. Rollback instructions

If any §6 health command fails post-launch, or if the BHCE canary regresses, execute the following procedure. Source: Probe Checklist §4 + Runbook §4. **Rollback SLO: 5 minutes from P0 confirmation.**

```
STEP   ACTION                                                   VERIFY
─────  ──────────────────────────────────────────────────────  ──────────────────────────
  1    Announce in launch channel: "Rolling back due to <X>"   Posted within 60s
  2    Open Replit Deployments → Deployment history             Last 5 deploys visible
  3    Identify last known-good deploy (tag or timestamp)       Cross-ref launch log
  4    Click "Restore" on last known-good                        Panel: "deploying"
  5    Wait for restore to complete                              Panel: "deployed"
  6    Re-run §6 health checklist                                All 5 endpoints → 200
  7    Re-run BHCE canary (§6 last block)                        /crisis 200 + content
  8    Post in channel: "Rolled back to <version>"               Posted
  9    Preserve failing deploy artifact                          DO NOT delete
 10    Open POST_MORTEM_INC_<#>.md within 48h (24h for BHCE)     File created
```

**Discipline:** rollback is not failure. Proceeding past a failing gate is failure. Rollback within 5 minutes of P0 confirmation is the operational SLO. Preserve the failing artifact for post-mortem — do **not** delete.

---

## 5. Production health command checklist

Read-only, Replit-native. Run from Shell tab. Every command idempotent and side-effect-free.

```bash
PROD="https://mymentalhealthbuddy.com"

# ── 5.1  Liveness sweep (5 endpoints) ──────────────────────────────
for path in / /healthz /readyz /crisis /api/health; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "${PROD}${path}")
  echo "${path}  ->  ${code}"
done
# expected: all 200

# ── 5.2  API health detail ────────────────────────────────────────
curl -s --max-time 8 "${PROD}/api/health"
# expected: {"status":"healthy", "database":{"connected":true}, services all true}

# ── 5.3  Crisis content (browser verification required) ───────────
curl -s -o /dev/null -w "/crisis %{http_code}\n" --max-time 8 "${PROD}/crisis"
# expected: 200
# Then in a real browser: open /crisis, visually confirm 988, 741741, 911 are present

# ── 5.4  Apex + www reachability ──────────────────────────────────
for host in mymentalhealthbuddy.com www.mymentalhealthbuddy.com; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "https://${host}/")
  echo "${host}  ->  ${code}"
done
# expected: both 200 (or apex 200 + www 301 once TODO-18.1 lands)

# ── 5.5  Security headers ─────────────────────────────────────────
curl -sI --max-time 8 "${PROD}/" | grep -iE "strict-transport-security|content-security-policy|x-content-type-options|x-frame-options"
# expected: HSTS max-age >= 31536000, CSP present, XCTO nosniff, XFO SAMEORIGIN

# ── 5.6  Cache-control sanity ─────────────────────────────────────
for path in / /crisis /healthz; do
  cc=$(curl -sI --max-time 8 "${PROD}${path}" | grep -i cache-control)
  echo "${path}  ->  ${cc:-NONE}"
done
# expected: / and /crisis = "public, max-age=0" or "no-cache"
#           /healthz = "no-store"

# ── 5.7  TTFB sample (5 samples) ──────────────────────────────────
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "%{time_starttransfer}\n" --max-time 8 "${PROD}/"
done
# expected: median <= 0.5s (Phase 23 baseline ~0.185s)

# ── 5.8  Robots + sitemap ─────────────────────────────────────────
curl -s -o /dev/null -w "robots:  %{http_code}\n"  --max-time 8 "${PROD}/robots.txt"
curl -s -o /dev/null -w "sitemap: %{http_code}\n"  --max-time 8 "${PROD}/sitemap.xml"
# expected: both 200

# ── 5.9  Deployment log ERROR scan (last 1h) ──────────────────────
# Via Replit agent tool: fetch_deployment_logs with message="ERROR|FATAL"
# expected: 0 hits

# ── 5.10  BHCE canary (P0 priority — run hourly through T+72h) ────
curl -s -o /dev/null -w "/crisis %{http_code}\n" --max-time 8 "${PROD}/crisis"
# AND verify in a real browser that 988, 741741, 911 render after hydration
# expected: 200 + all three resources visible
# FAIL on this canary = automatic P0 BHCE incident, halt all merges
```

**Discipline:** §5.10 BHCE canary is the highest-priority probe. Any failure auto-escalates to P0 and triggers Architecture / Governance signer veto authority per Phase 30 §5.

---

## 6. Post-launch monitoring window

Source: Phase 32 §13.1 pulse rotation.

| Window | Cadence | Owner | Surface |
|---|---|---|---|
| **T+0 → T+1h** | every **5 min** | Primary on-call | §5.1 liveness sweep + §5.3 BHCE + §5.4 apex/www |
| **T+1h → T+24h** | every **15 min** | Primary on-call | §5.1 + §5.7 TTFB + §5.10 BHCE canary + log scan |
| **T+24h → T+72h** | every **1 h** | On-call rotation | §5.1 + §5.10 BHCE canary |
| **T+72h+** | every **6 h** | On-call rotation | §5.10 BHCE canary + standard alerting |

### Hard escalation triggers (within monitoring window)

| Symptom | Severity | Action |
|---|---|---|
| `/crisis` returns 5xx OR content missing in browser | **P0 BHCE** | Auto-page Architecture + Engineering. Halt all merges. Consider rollback within 5 min. Open `POST_INCIDENT_BHCE_<TS>.md` within 24 h. |
| Apex returns 5xx for >2 min | P0 | Page on-call. Rollback within 5 min if no clear fix. |
| `/api/health` reports `database.connected: false` | P0 | Page on-call. Database skill / production verification per Replit docs. |
| TTFB p50 > 2s sustained | P1 | Page on-call. INC ticket. Update every 30 min. |
| Any service in `/api/health` reports false | P1 | Page on-call. INC ticket. |
| Single non-critical route 5xx | P2 | Triage queue. Fix in next deploy window. |
| Cosmetic regression (e.g., duplicate header) | P3 | Phase 28 ledger entry. |

### Post-launch retrospective

| Artifact | When | Owner |
|---|---|---|
| Hourly pulse log | T+0 → T+72h | on-call |
| `docs/reports/POST_LAUNCH_v1.0.0.md` | within 7 d of T+0 | Engineering on-call |
| `docs/reports/POST_INCIDENT_BHCE_<TS>.md` | within 24 h of any BHCE incident | Architecture / Governance |
| `docs/reports/POST_MORTEM_INC_<#>.md` | within 48 h (P0) / 7 d (P1) | Engineering on-call |

---

## 7. Final founder sign-off

Two signatures required: **Engineering on-call** (operational readiness) and **Architecture / Governance** (kernel + BHCE authority). Founder co-signature optional but encouraged for a v1.0.0 milestone.

```
─────────────────────────────────────────────────────────────────
  ENGINEERING ON-CALL

  Name:       _______________________________________________
  Date/Time:  _______________________________________________
  Decision:   ☐ GO    ☐ NO-GO
  Authority:  Operational readiness (Phase 30 matrix rows 1–19, 23–25)
  Signature:  _______________________________________________

─────────────────────────────────────────────────────────────────
  ARCHITECTURE / GOVERNANCE

  Name:       _______________________________________________
  Date/Time:  _______________________________________________
  Decision:   ☐ GO    ☐ NO-GO    ☐ BHCE VETO
  Authority:  Kernel + crisis-routing veto (Phase 30 §5)
  Signature:  _______________________________________________

─────────────────────────────────────────────────────────────────
  FOUNDER (The Genuine Love Project)  — optional milestone signature

  Name:       _______________________________________________
  Date/Time:  _______________________________________________
  Statement:
    "I acknowledge MMHB v1.0.0 is launching as a free, educational,
     trauma-informed wellness companion — not a medical device, not
     a therapist, not a diagnosis. /crisis routes to 988, 741741, and
     911. I sign in the spirit of genuine love, for the people who
     will use this software to be a little kinder to themselves today."

  Signature:  _______________________________________________
─────────────────────────────────────────────────────────────────
```

Both engineering and architecture signatures must read **GO** for launch. Either's **NO-GO** is final until corrected. The Architecture signer's **BHCE VETO** is unilateral and absolute.

---

## 8. "Live in Genuine Love" launch statement

The following statement is read aloud (or posted) by the founder or launch lead at the moment of T-0. It is the closing act of the launch ceremony and the opening words of the post-launch monitoring window.

> **MyMentalHealthBuddy is now live.**
>
> We built this for the moments between the appointments. For the late nights and the quiet mornings. For the people who don't yet have words for what they are feeling, and the people who have too many.
>
> This is not a clinical product. It does not diagnose. It does not prescribe. It does not replace a human being who loves you, or a professional trained to help. What it offers is gentle company — a check-in, a breath, a place to put your thoughts where no one will judge them.
>
> If you are in crisis right now, please call **988** (Suicide & Crisis Lifeline), text **741741** (Crisis Text Line), or dial **911**. These numbers are available on every page at `/crisis`, and they always will be.
>
> To everyone who shows up here: you are worthy of care. You are worthy of patience. You are worthy of softness, even from yourself — especially from yourself.
>
> Welcome to MyMentalHealthBuddy.
>
> **Live in Genuine Love.**
>
> — The Genuine Love Project, 2026

---

## 9. References

- Launch Approval Matrix (Phase 30): `docs/operations/LAUNCH_APPROVAL_MATRIX.md`
- T-1h Sign-Off Packet (Phase 31): `docs/operations/T_MINUS_1H_LAUNCH_SIGNOFF.md`
- Production Hardening Checklist (Phase 32): `docs/operations/PRODUCTION_HARDENING_CHECKLIST.md`
- Phase 33 Verification Report: `docs/reports/PHASE_33_HARDENING_VERIFICATION.md`
- Production Probe Checklist (Phase 29): `docs/operations/PRODUCTION_PROBE_CHECKLIST.md`
- Post-Launch TODO Ledger (Phase 28): `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`
- Launch Operations Runbook (Phase 27): `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*This is the final launch decision document for MMHB v1.0.0 public beta. Documentation only. No source code, no refactor, no auth/db/routes/UI/.replit/deployment-config/infrastructure changes were made to produce it.*

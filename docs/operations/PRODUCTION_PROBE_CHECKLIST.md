# MMHB Production Probe Checklist

**Status:** Active
**Last updated:** 2026-05-22 (Phase 29)
**Owner:** Engineering on-call
**Companion docs:** `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`, `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`

This document is the executable probe and verification suite for MMHB production. Every check is a single, idempotent, read-only command runnable from the Shell tab. Nothing here mutates production state.

> **Discipline:** every probe in this checklist runs without side effects. If a check would require a write, it does not belong here — file it as a TODO in the Phase 28 ledger instead.

---

## 1. Probe targets

| Target | URL | Purpose |
|---|---|---|
| Apex | `https://mymentalhealthbuddy.com` | canonical production |
| www | `https://www.mymentalhealthbuddy.com` | TODO-18.1 will 301 → apex post-launch |
| Replit-app | `https://<deployment>.replit.app` | bypass DNS for edge debugging |
| Dev | `$REPLIT_DEV_DOMAIN` | pre-launch verification |

Throughout this document, `${PROD}` = `https://mymentalhealthbuddy.com`.

---

## 2. curl probe suite

Each probe is read-only. Run from Shell tab; capture exit code and HTTP status.

### 2.1 Liveness loop

```bash
for path in / /healthz /readyz /crisis; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${PROD}${path}")
  echo "${path} -> ${code}"
done
```

**Pass:** all 4 return `200`.

### 2.2 Critical content probe

```bash
# /crisis must contain the three core resources
curl -s "${PROD}/crisis" | grep -c -E "988|741741|911"
```

**Pass:** count ≥ 3 (one match per resource).

### 2.3 Security header probe

```bash
curl -sI "${PROD}/" | grep -iE "strict-transport-security|content-security-policy|x-content-type-options|x-frame-options|referrer-policy|permissions-policy"
```

**Pass:** at minimum HSTS present with `max-age >= 31536000; includeSubDomains; preload`. Other headers logged but not gating (governed by Phase 18 baseline).

### 2.4 Bundle integrity probe

```bash
# Main entry HTML should reference hashed assets, not bare paths
curl -s "${PROD}/" | grep -oE "assets/[a-zA-Z0-9_-]+-[A-Za-z0-9_-]{6,}\.(js|css)" | sort -u | head
```

**Pass:** ≥ 1 hashed JS and ≥ 1 hashed CSS reference. No bare `assets/index.js` or `assets/index.css` (would indicate broken build artifact).

### 2.5 Asset 404 probe

```bash
# Pull one each of: hashed JS, hashed CSS, favicon, og-image
for asset in /favicon.ico /og-image.png; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${PROD}${asset}")
  echo "${asset} -> ${code}"
done
```

**Pass:** both `200`.

### 2.6 Apex + www reachability

```bash
for host in mymentalhealthbuddy.com www.mymentalhealthbuddy.com; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://${host}/")
  echo "${host} -> ${code}"
done
```

**Pass (current):** both `200` (TODO-18.1 will change www to `301`).
**Pass (post-TODO-18.1):** apex `200`, www `301` with `Location: https://mymentalhealthbuddy.com/`.

### 2.7 TTFB sample

```bash
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "%{time_starttransfer}\n" "${PROD}/"
done
```

**Pass:** median ≤ 0.5s. Phase 23 baseline was ~185ms.

### 2.8 Robots & sitemap

```bash
curl -s -o /dev/null -w "robots: %{http_code}\n" "${PROD}/robots.txt"
curl -s -o /dev/null -w "sitemap: %{http_code}\n" "${PROD}/sitemap.xml"
```

**Pass:** both `200`.

---

## 3. Launch smoke-test matrix

Execute strictly in order during the T-0 launch sequence (Runbook §2 step 4). Each row blocks the next on failure.

| # | Surface | Probe | Pass criteria |
|---|---|---|---|
| 1 | Root | `GET /` | 200, HTML, has `<title>` containing "MMHB" or "MyMentalHealthBuddy" |
| 2 | Crisis | `GET /crisis` | 200, contains `988`, `741741`, `911` |
| 3 | Liveness | `GET /healthz` | 200 |
| 4 | Readiness | `GET /readyz` | 200 |
| 5 | API health | `GET /api/health` (or canonical) | 200 |
| 6 | Auth surface | `GET /login` | 200 (unauthenticated render) |
| 7 | Admin gate | `GET /admin` unauthed | redirect or 401/403 — never 200 with admin data |
| 8 | Static asset | `GET /favicon.ico` | 200 |
| 9 | OG card | `GET /og-image.png` | 200 |
| 10 | TTFB | apex `/` | p50 ≤ 500ms |
| 11 | Headers | apex `/` | HSTS present, exactly one |
| 12 | Apex+www | both | apex 200; www 200 (or 301 post-TODO-18.1) |

**Hard gate:** rows 1, 2, 3, 4, 7 are P0 blockers. Any failure → halt launch, do not proceed to §2 step 5 of the runbook.

---

## 4. Deployment rollback checklist

Execute when §3 hard gates fail OR when an incident playbook (Runbook §4) invokes rollback.

| # | Action | Verification |
|---|---|---|
| 1 | Announce in launch channel: "Rolling back due to <symptom>." | Posted within 60s of decision |
| 2 | Open Replit deployment history panel | Last 5 deploys visible |
| 3 | Identify last known-good deploy (tag or timestamp) | Cross-reference with launch log |
| 4 | Click "Restore" on chosen deploy | Panel turns green / "deploying" |
| 5 | Wait for restore to complete | Status: "deployed" |
| 6 | Run §2.1 liveness loop | All 4 → 200 |
| 7 | Run §3 smoke-test rows 1, 2, 3, 4, 7 | All PASS |
| 8 | Post in channel: "Rolled back to <version>. Triage continues out-of-band." | |
| 9 | Preserve failing deploy artifact | Do NOT delete — needed for post-mortem |
| 10 | Open `docs/reports/POST_MORTEM_INC_<#>.md` within 48h | Documented per Runbook §4 |

**Discipline:** rollback is not failure — proceeding past a failing gate is failure. Rollback within 5 minutes of P0 confirmation is the operational SLO.

---

## 5. Production incident severity matrix

| Severity | Definition | Examples | Response SLO | Required actions |
|---|---|---|---|---|
| **P0** | User safety or full outage | `/crisis` 5xx, apex 5xx for >2min, auth fully broken | Page within 5 min | Page on-call, halt all merges, consider rollback in <5 min |
| **P1** | Major degradation, partial outage | TTFB >2s sustained, API error rate >5%, key feature 5xx | Page within 15 min | Page on-call, open INC ticket, status update every 30 min |
| **P2** | Minor degradation | Single non-critical route 5xx, slow image loads | Triage within 1 hr | Open INC ticket, fix in next deploy window |
| **P3** | Cosmetic | Duplicate header, stale cache on one asset | Triage within 24 hr | File in Phase 28 TODO ledger |

**BHCE override:** any `/crisis` regression is automatically P0 regardless of other classification (Governance Kernel §1).

---

## 6. Launch / no-launch gate system

The T-24h checklist (Runbook §1) produces 5 sub-gates. Each gate is binary: **GO** or **NO-GO**.

| Gate | Source | NO-GO trigger |
|---|---|---|
| **G1 Build & probe** | Runbook §1.1 (7 checks) | Any non-200; build exit ≠ 0 |
| **G2 Bundle budget** | Runbook §1.2 / Phase 24 contract | Initial path >150KB gz; largest JS >350KB raw; any source map in dist |
| **G3 Static asset** | Runbook §1.3 / Phase 26 contract | dist >50MB; any external font CDN; `/crisis` static asset 404 |
| **G4 Secrets & env** | Runbook §1.4 | Any required secret missing |
| **G5 Governance** | Runbook §1.5 | Kernel doc missing; uncommitted phase reports; working tree dirty |

**Launch decision rule:** **5/5 GO** = launch. **Any NO-GO** = halt, fix, re-run gate, re-evaluate. No partial launches. No "launch anyway" override.

---

## 7. Operational readiness score

Scored at T-24h. Each row is 1 point. Max = 25.

| # | Criterion | 1 pt if… |
|---|---|---|
| 1 | Build PASS | exit 0, <90s |
| 2 | All 4 liveness probes 200 | yes |
| 3 | `/crisis` 200 + contains 988/741741/911 | yes |
| 4 | Apex 200 | yes |
| 5 | www 200 (or 301 post-TODO-18.1) | yes |
| 6 | TTFB p50 ≤ 500ms | yes |
| 7 | Initial path ≤ 150KB gz | yes |
| 8 | Largest JS ≤ 350KB raw | yes |
| 9 | Main CSS ≤ 100KB gz | yes |
| 10 | 0 source maps in dist | yes |
| 11 | 8 named vendor chunks | yes |
| 12 | Total dist ≤ 50MB | yes |
| 13 | 0 external font CDN refs | yes |
| 14 | All 8 required secrets present | yes |
| 15 | HSTS header present | yes |
| 16 | favicon.ico 200 | yes |
| 17 | og-image.png 200 | yes |
| 18 | robots.txt 200 | yes |
| 19 | sitemap.xml 200 | yes |
| 20 | Governance kernel doc present | yes |
| 21 | All Phase 21–28 reports committed | yes |
| 22 | Working tree clean | yes |
| 23 | Workflow `Start application` running | yes |
| 24 | Deployment logs free of ERROR last 1h | yes |
| 25 | On-call paged in and acknowledged | yes |

**Score interpretation:**
- **25/25** → launch
- **23–24/25** → launch only if missing items are P3-cosmetic; document the carveout
- **≤ 22/25** → NO-GO, halt and remediate

---

## 8. Dependency risk summary

| Dependency | Current | Risk | Mitigation owner |
|---|---|---|---|
| `express` | 4.x | **Medium** (deferred 4→5, TODO-22.1) | Post-launch sprint 3 |
| `@opentelemetry/*` cluster | partial | **Medium** (silent telemetry loss if partial bump, TODO-22.2) | Post-launch sprint 2 |
| `react`, `react-dom` | current | Low | — |
| `vite` | current | Low | — |
| `tailwindcss` | v3 | Low (v4 migration deliberate non-goal) | — |
| Self-hosted fonts (woff2) | all 4 families | None (Phase 26 verified 0 external CDN) | — |
| Crisis routing surfaces | static | None (BHCE governed) | — |

No dependency carries a **High** or **Critical** risk flag at T-24h.

---

## 9. Observability verification map

| Signal | Source | Verification command | Pass criteria |
|---|---|---|---|
| Liveness | `/healthz` | `curl ${PROD}/healthz` | 200 |
| Readiness | `/readyz` | `curl ${PROD}/readyz` | 200 |
| Logs | `fetch_deployment_logs` | message filter `ERROR\|FATAL` | 0 hits in last 1h |
| Logs (broader) | `fetch_deployment_logs` | message filter `WARN` | reviewed, no novel patterns |
| Traces | OTel exporter → backend | first trace visible | within 60s of launch |
| Metrics | internal endpoint | (TODO-23.1 will standardize to Prometheus) | endpoint reachable |
| Crisis routing audit | manual | `curl ${PROD}/crisis \| grep -c "988"` | ≥ 1 |
| Error budget | rolling 30d | post-launch, weekly | tracked by on-call |

---

## 10. Crisis-routing surface integrity check

**Highest-priority probe.** Runs on every gate, every deploy, every rollback.

```bash
# 1. /crisis route reachable
curl -s -o /dev/null -w "%{http_code}\n" "${PROD}/crisis"
# expected: 200

# 2. All three resources present in payload
curl -s "${PROD}/crisis" | grep -oE "988|741741|911" | sort -u
# expected: three lines (988, 741741, 911)

# 3. Footer link present on root
curl -s "${PROD}/" | grep -ci 'href="/crisis"'
# expected: ≥ 1
```

If any of the three fails, the incident is automatically **P0** regardless of any other classification. Halt all other work until restored (Runbook §4.5).

---

## 11. Replit-native recovery procedures

Every recovery action below is invocable from the Replit UI or `fetch_deployment_logs` tool — no Docker, no virtualenvs, no manual SQL.

| Symptom | Smallest engine | Action |
|---|---|---|
| Workflow not serving | workflow restart | Workflows panel → `Start application` → Restart |
| Stale deploy | rollback | Deployment history → "Restore" on last good |
| Missing secret | secrets panel | Secrets panel → add → restart workflow |
| Schema mismatch | `npm run db:push` | per database skill, production env, dry-run first |
| Asset 404 storm | redeploy | Publishing flow → deploy current main |
| TLS / cert | edge config | Replit deployment domains panel (no code change) |
| DNS | edge config | Replit deployment domains panel |
| Telemetry gap | dependency triage | Open INC ticket per §5, do NOT bump under fire |

---

## 12. Release approval checklist

Sign-off required before T-0:

- [ ] All 5 launch gates (§6) = GO
- [ ] Operational readiness score (§7) ≥ 23
- [ ] Crisis-routing integrity check (§10) PASS
- [ ] Dependency risk summary (§8) reviewed — no new High/Critical
- [ ] Observability map (§9) all signals verified
- [ ] On-call rotation confirmed (Runbook §3.1)
- [ ] Rollback owner identified
- [ ] Launch channel open and announced
- [ ] Phase 28 TODO ledger reviewed — no carry-forward item escalated to S0
- [ ] Engineering on-call: ____________________ ack
- [ ] Architecture / governance owner: ____________________ ack

---

## 13. References

- Launch Operations Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- Phase 28 TODO ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- PagerDuty: `docs/runbooks/pagerduty.md`
- Probe routes: `docs/reports/probe-routes.md`
- Public surface: `docs/reports/public-surface-audit.md`

---

*This checklist is operational documentation. No code or configuration was modified to produce it. Every probe is read-only and Replit-native.*

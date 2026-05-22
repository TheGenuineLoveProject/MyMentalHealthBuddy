# MMHB T-1h Launch Scoring and Sign-Off Packet

**Status:** Active — executable T-1h checklist
**Last updated:** 2026-05-22 (Phase 31)
**Owner:** Engineering on-call + Architecture / Governance owner (joint authority)
**Source of truth:** `docs/operations/LAUNCH_APPROVAL_MATRIX.md` (Phase 30)
**Companion docs:**
- `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (Phase 29)
- `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)
- `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (Phase 28)

This packet is the **single executable document** for the T-1h pre-launch window. It is filled in live during the hour before T-0 and submitted to the launch channel as proof of approval. It introduces no new contracts — every gate maps to Phase 30 §1 (25-row matrix) or Phase 30 §12 (30-point score).

> **Discipline:** every row is filled in by **observation**, not memory. Run the command, read the output, mark the box. No defaults.

---

## 0. Packet header

```
LAUNCH PACKET ID:        v1.0.0 / public beta
PACKET OPENED (UTC):     ______________________________
PACKET CLOSED (UTC):     ______________________________
ENGINEERING SIGNER:      ______________________________
ARCHITECTURE SIGNER:     ______________________________
LAUNCH WINDOW TARGET:    ______________________________
COMMS CHANNEL:           ______________________________
PRIMARY ON-CALL:         ______________________________
SECONDARY ON-CALL:       ______________________________
```

---

## 1. 25/25 go/no-go checklist

Source: Phase 30 §1. Mark each row GO or NO-GO based on **observation at T-1h**. All 25 rows must be GO. Any NO-GO blocks launch.

| # | Gate | How to verify (one-liner) | Result |
|---|---|---|---|
| 1 | Build PASS | `npm run build` exit 0, < 90s | ☐ GO  ☐ NO-GO |
| 2 | All 4 liveness probes 200 | `for p in / /healthz /readyz /crisis; do curl -s -o /dev/null -w "$p %{http_code}\n" "https://mymentalhealthbuddy.com$p"; done` | ☐ GO  ☐ NO-GO |
| 3 | Crisis content present | `curl -s https://mymentalhealthbuddy.com/crisis \| grep -oE "988\|741741\|911" \| sort -u \| wc -l` = 3 | ☐ GO  ☐ NO-GO |
| 4 | Apex 200 | `curl -s -o /dev/null -w "%{http_code}\n" https://mymentalhealthbuddy.com/` = 200 | ☐ GO  ☐ NO-GO |
| 5 | www reachable | `curl -s -o /dev/null -w "%{http_code}\n" https://www.mymentalhealthbuddy.com/` = 200 (or 301 post-TODO-18.1) | ☐ GO  ☐ NO-GO |
| 6 | TTFB within budget | 5-sample median `time_starttransfer` ≤ 0.5s | ☐ GO  ☐ NO-GO |
| 7 | Initial JS path ≤ 150 KB gz | inspect `client/dist/assets/index-*.js` + `vendor-react-*.js` gzipped | ☐ GO  ☐ NO-GO |
| 8 | Largest JS chunk ≤ 350 KB raw | `ls -lS client/dist/assets/*.js \| head -1` | ☐ GO  ☐ NO-GO |
| 9 | Main CSS ≤ 100 KB gz | inspect `client/dist/assets/index-*.css` gzipped | ☐ GO  ☐ NO-GO |
| 10 | 0 source maps in dist | `find client/dist -name "*.map" \| wc -l` = 0 | ☐ GO  ☐ NO-GO |
| 11 | 8 named vendor chunks | `ls client/dist/assets/vendor-*.js \| wc -l` = 8 | ☐ GO  ☐ NO-GO |
| 12 | Total dist ≤ 50 MB | `du -sh client/dist` | ☐ GO  ☐ NO-GO |
| 13 | 0 external font CDN | `grep -r "fonts.googleapis.com\|fonts.gstatic.com" client/dist \| wc -l` = 0 | ☐ GO  ☐ NO-GO |
| 14 | All 8 required secrets present | secrets panel inspection (ADMIN_TOKEN, JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, DEFAULT_OBJECT_STORAGE_BUCKET_ID, PRIVATE_OBJECT_DIR, PUBLIC_OBJECT_SEARCH_PATHS, PERPLEXITY_API_KEY) | ☐ GO  ☐ NO-GO |
| 15 | HSTS header present | `curl -sI https://mymentalhealthbuddy.com/ \| grep -i strict-transport-security` shows `max-age >= 31536000` | ☐ GO  ☐ NO-GO |
| 16 | favicon.ico 200 | `curl -s -o /dev/null -w "%{http_code}\n" https://mymentalhealthbuddy.com/favicon.ico` = 200 | ☐ GO  ☐ NO-GO |
| 17 | og-image.png 200 | `curl -s -o /dev/null -w "%{http_code}\n" https://mymentalhealthbuddy.com/og-image.png` = 200 | ☐ GO  ☐ NO-GO |
| 18 | robots.txt 200 | `curl -s -o /dev/null -w "%{http_code}\n" https://mymentalhealthbuddy.com/robots.txt` = 200 | ☐ GO  ☐ NO-GO |
| 19 | sitemap.xml 200 | `curl -s -o /dev/null -w "%{http_code}\n" https://mymentalhealthbuddy.com/sitemap.xml` = 200 | ☐ GO  ☐ NO-GO |
| 20 | Governance kernel doc present | `ls docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` | ☐ GO  ☐ NO-GO |
| 21 | Phase 21–30 reports committed | `git --no-optional-locks log --oneline \| grep -ciE "phase 2[1-9]\|phase 30"` ≥ 10 | ☐ GO  ☐ NO-GO |
| 22 | Working tree clean | `git --no-optional-locks status --short` empty | ☐ GO  ☐ NO-GO |
| 23 | Workflow `Start application` running | workflows panel green | ☐ GO  ☐ NO-GO |
| 24 | Deployment logs free of ERROR last 1h | `fetch_deployment_logs` filter `ERROR\|FATAL` = 0 hits | ☐ GO  ☐ NO-GO |
| 25 | On-call paged in and acknowledged | rotation primary + secondary confirmed | ☐ GO  ☐ NO-GO |

**Tally:**

```
GO total:    ____ / 25
NO-GO list:  ________________________________________________________
```

**Decision rule:** 25/25 = GO. Any NO-GO = halt, fix, re-run that row, re-evaluate.

---

## 2. 30-point readiness score worksheet

Source: Phase 30 §12. Score one point per row; max = 30.

| # | Criterion | Source | 1 pt |
|---|---|---|---|
| 1 | §1 row 1 (build) | matrix | ☐ |
| 2 | §1 row 2 (4 liveness probes) | matrix | ☐ |
| 3 | §1 row 3 (crisis content) | matrix | ☐ |
| 4 | §1 row 4 (apex 200) | matrix | ☐ |
| 5 | §1 row 5 (www reachable) | matrix | ☐ |
| 6 | §1 row 6 (TTFB) | matrix | ☐ |
| 7 | §1 row 7 (initial path) | matrix | ☐ |
| 8 | §1 row 8 (largest JS) | matrix | ☐ |
| 9 | §1 row 9 (main CSS) | matrix | ☐ |
| 10 | §1 row 10 (0 source maps) | matrix | ☐ |
| 11 | §1 row 11 (8 vendor chunks) | matrix | ☐ |
| 12 | §1 row 12 (dist size) | matrix | ☐ |
| 13 | §1 row 13 (0 external font CDN) | matrix | ☐ |
| 14 | §1 row 14 (secrets) | matrix | ☐ |
| 15 | §1 row 15 (HSTS) | matrix | ☐ |
| 16 | §1 row 16 (favicon) | matrix | ☐ |
| 17 | §1 row 17 (og-image) | matrix | ☐ |
| 18 | §1 row 18 (robots) | matrix | ☐ |
| 19 | §1 row 19 (sitemap) | matrix | ☐ |
| 20 | §1 row 20 (governance doc) | matrix | ☐ |
| 21 | §1 row 21 (Phase reports committed) | matrix | ☐ |
| 22 | §1 row 22 (working tree clean) | matrix | ☐ |
| 23 | §1 row 23 (workflow running) | matrix | ☐ |
| 24 | §1 row 24 (no ERROR logs last 1h) | matrix | ☐ |
| 25 | §1 row 25 (on-call ack) | matrix | ☐ |
| 26 | §6 rollback readiness (all 7 items) | this packet §6 | ☐ |
| 27 | §3 BHCE hard gate (3 probes) | this packet §3 | ☐ |
| 28 | §5 health endpoint hard gate (3 endpoints) | this packet §5 | ☐ |
| 29 | §7 production hard gate (5 P0 rows) | matrix §7 / probe §3 | ☐ |
| 30 | §8 security header hard gate (HSTS) | matrix §8 | ☐ |

**Score tally:**

```
TOTAL:  ____ / 30
```

**Interpretation:**
- **30/30** → unconditional GO
- **28–29/30** → conditional GO (only if missing items are §1 rows 18, 19, or §8 cosmetic / S3); document carveout in §9 below
- **≤ 27/30** → NO-GO, halt, remediate, re-score

---

## 3. BHCE crisis-routing pass / fail section

**Highest priority. Cannot be waived. BHCE asymmetry: when in doubt, NO-GO.**

Source: Phase 30 §5. Run all three probes against production at T-1h.

### Probe 1 — `/crisis` reachable

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://mymentalhealthbuddy.com/crisis"
```

Expected: `200`
Observed: `_______`
Result: ☐ PASS  ☐ FAIL

### Probe 2 — three resources present

```bash
curl -s "https://mymentalhealthbuddy.com/crisis" | grep -oE "988|741741|911" | sort -u
```

Expected: three distinct lines (988, 741741, 911)
Observed: `_______________________`
Result: ☐ PASS  ☐ FAIL

### Probe 3 — global footer link

```bash
curl -s "https://mymentalhealthbuddy.com/" | grep -ci 'href="/crisis"'
```

Expected: ≥ 1
Observed: `_______`
Result: ☐ PASS  ☐ FAIL

### BHCE decision

```
BHCE GATE:  ☐ PASS (all three probes PASS)
            ☐ FAIL (any probe FAIL — automatic NO-GO, Architecture signer must veto)

NOTES / EVIDENCE:
________________________________________________________________
________________________________________________________________
```

If FAIL: halt all launch activity. Open `docs/reports/POST_INCIDENT_BHCE_<TS>.md` post-resolution and re-run §1 matrix end-to-end before attempting launch again.

---

## 4. Required signer fields

Both signatures required for launch. Either signer's NO-GO is final until corrected.

### Engineering on-call

```
NAME:          _______________________________________
ROLE:          Engineering on-call (primary)
DATE / TIME:   _______________________________________
SCORE:         ____ / 30
DECISION:      ☐ GO    ☐ NO-GO

AUTHORITY:     Operational readiness (matrix rows 1–19, 23–25)

CARVEOUTS / NOTES:
________________________________________________________________
________________________________________________________________

SIGNATURE:     _______________________________________
```

### Architecture / Governance

```
NAME:          _______________________________________
ROLE:          Architecture / Governance owner
DATE / TIME:   _______________________________________
DECISION:      ☐ GO    ☐ NO-GO    ☐ BHCE VETO

AUTHORITY:     Governance + contract integrity (matrix rows 20–22)
               + crisis-routing veto (BHCE)

CARVEOUTS / NOTES / VETO REASON:
________________________________________________________________
________________________________________________________________

SIGNATURE:     _______________________________________
```

**Both signatures present and both = GO** is the precondition for §9 launch window decision = GO.

---

## 5. Final health probe commands

Source: Phase 30 §6. Run against production at T-1h. All three must return 200.

```bash
# /healthz
curl -s -o /dev/null -w "%{http_code}\n" "https://mymentalhealthbuddy.com/healthz"
# expected: 200
# observed: _______

# /readyz
curl -s -o /dev/null -w "%{http_code}\n" "https://mymentalhealthbuddy.com/readyz"
# expected: 200
# observed: _______

# /api/health (or canonical health endpoint)
curl -s -o /dev/null -w "%{http_code}\n" "https://mymentalhealthbuddy.com/api/health"
# expected: 200
# observed: _______
```

```
HEALTH GATE:  ☐ PASS (all three 200)
              ☐ FAIL (any non-200 — invoke §6 rollback if already deployed)
```

---

## 6. Final rollback confirmation

Source: Phase 30 §4 (rollback readiness, 7 items) + Probe Checklist §4 (10-step rollback procedure).

Engineering signer confirms each item below **before** signing §4:

- [ ] Last 5 deploys visible in Replit deployment history panel
- [ ] Last known-good deploy identified by tag or timestamp (recorded below)
- [ ] "Restore" action reachable from deployment history panel
- [ ] Probe Checklist §4 (10-step rollback) is on-screen and readable
- [ ] Rollback owner identified (typically primary on-call)
- [ ] 5-minute rollback SLO is understood and acknowledged
- [ ] Failing deploy artifact preservation policy understood (do NOT delete after rollback)

```
LAST KNOWN-GOOD DEPLOY (tag or timestamp):  ___________________________
ROLLBACK OWNER:                              ___________________________

ROLLBACK READINESS:  ☐ ALL 7 ITEMS TRUE (1 pt for §2 row 26)
                     ☐ ONE OR MORE FALSE (automatic NO-GO until corrected)
```

---

## 7. Hard-gate summary (cross-reference)

The four hard gates (Phase 30 §5–§8) restated here for finality. Any FAIL = launch NO-GO.

| Hard gate | Source (Phase 30) | This packet §  | Result |
|---|---|---|---|
| BHCE crisis-routing | §5 | §3 | ☐ PASS  ☐ FAIL |
| Health endpoints | §6 | §5 | ☐ PASS  ☐ FAIL |
| Production endpoints (smoke rows 1, 2, 3, 4, 7) | §7 | §1 + Probe §3 | ☐ PASS  ☐ FAIL |
| Security headers (HSTS) | §8 | §1 row 15 | ☐ PASS  ☐ FAIL |

All four must PASS to proceed to §8.

---

## 8. Final public beta GO / NO-GO statement

Filled in after §1 matrix, §2 score, §3 BHCE, §4 signers, §5 health, §6 rollback, §7 hard-gates are all complete.

### Decision

```
PUBLIC BETA v1.0.0 LAUNCH DECISION:

☐ GO — proceed to launch sequence (Phase 30 §3 / Runbook §2)
☐ CONDITIONAL GO — proceed with documented carveout (28–29/30 score, S3-only misses)
☐ NO-GO — halt, remediate, re-score

REQUIRED PRE-CONDITIONS FOR GO:
  ☐ §1 matrix = 25/25
  ☐ §2 score ≥ 28/30
  ☐ §3 BHCE = PASS (all 3 probes)
  ☐ §4 both signers = GO (no NO-GO, no BHCE VETO)
  ☐ §5 health gate = PASS (all 3 endpoints 200)
  ☐ §6 rollback readiness = all 7 items TRUE
  ☐ §7 all 4 hard gates = PASS
```

### Statement

```
At ___________ UTC on ___________, the MMHB v1.0.0 public beta launch
is hereby declared:

☐ GO              ☐ CONDITIONAL GO              ☐ NO-GO

Score: ____/30      Matrix: ____/25      BHCE: ☐ PASS ☐ FAIL

By:
  Engineering on-call:        _______________________________________
  Architecture / Governance:  _______________________________________
```

---

## 9. Launch window decision log

This log is the audit trail. Every event during the T-1h → T-0 window is recorded here. Append-only.

```
T-1h  ___________ UTC  Packet opened by ___________________________
T-1h  ___________ UTC  §1 matrix start
T-__  ___________ UTC  §1 matrix complete: ____/25
T-__  ___________ UTC  §2 score complete: ____/30
T-__  ___________ UTC  §3 BHCE complete: ☐ PASS ☐ FAIL
T-__  ___________ UTC  §5 health complete: ☐ PASS ☐ FAIL
T-__  ___________ UTC  §6 rollback readiness complete: ☐ PASS ☐ FAIL
T-__  ___________ UTC  Engineering signer decision: ☐ GO ☐ NO-GO
T-__  ___________ UTC  Architecture signer decision: ☐ GO ☐ NO-GO ☐ VETO
T-__  ___________ UTC  §8 final decision: ☐ GO ☐ CONDITIONAL GO ☐ NO-GO
T-__  ___________ UTC  Launch sequence step 5 (git tag v1.0.0) begun
T-__  ___________ UTC  Launch sequence step 6 (deploy) begun
T+__  ___________ UTC  Launch sequence step 11 (announce) complete
T+__  ___________ UTC  Packet closed
```

### Carveouts / deviations recorded

```
ITEM:        ____________________________
RATIONALE:   ____________________________
APPROVED BY: ____________________________

ITEM:        ____________________________
RATIONALE:   ____________________________
APPROVED BY: ____________________________
```

### Incident references (if any)

```
INC #:       ____________________________
SEVERITY:    ____________________________
LINK:        ____________________________
RESOLUTION:  ____________________________
```

---

## 10. After packet close

1. Save filled packet to `docs/launches/v1.0.0_launch_packet_<UTC_TS>.md` (post-launch archival; not part of pre-launch flow).
2. Open T+0 → T+72h hourly pulse rotation per Runbook §3.2.
3. Open `docs/reports/POST_LAUNCH_v1.0.0.md` within 7 days for retrospective per Runbook §6.
4. If any NO-GO was hit during the packet, open `docs/reports/LAUNCH_NOGO_<UTC_TS>.md` describing what halted, what was remediated, and the new launch window target.

---

## 11. References

- Launch Approval Matrix (source of truth): `docs/operations/LAUNCH_APPROVAL_MATRIX.md`
- Production Probe Checklist: `docs/operations/PRODUCTION_PROBE_CHECKLIST.md`
- Launch Operations Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- Post-Launch TODO Ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*This packet is the executable T-1h surface for the Phase 30 approval matrix. It introduces no new contracts and adds no TODOs. Documentation only.*

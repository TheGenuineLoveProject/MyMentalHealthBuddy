# MMHB Launch Approval Matrix

**Status:** Active — final pre-launch authority
**Last updated:** 2026-05-22 (Phase 30)
**Owner:** Engineering on-call + Architecture / Governance owner (joint authority)
**Evidence base:** verified Phases 21–29
**Companion docs:**
- `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)
- `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (Phase 28)
- `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (Phase 29)

This matrix is the **final** authority gating launch. It does not introduce new contracts — it consolidates the gates established by Phases 21–29 into a single binary go/no-go decision.

> **Authority rule:** launch requires **both** signatures (Engineering + Architecture). Either signer may issue NO-GO unilaterally. Neither may issue GO unilaterally.

---

## 1. Final go/no-go checklist

This is the single document that decides launch. Every row maps to a verified gate from Phases 21–29. **All rows must be GO. Any NO-GO blocks launch.**

| # | Gate | Source phase | Binary check | GO / NO-GO |
|---|---|---|---|---|
| 1 | Build PASS | Phase 24, 25, 26 | `npm run build` exit 0, <90s | ☐ |
| 2 | All 4 liveness probes 200 | Phase 23, 29 §2.1 | `/ /healthz /readyz /crisis` all 200 | ☐ |
| 3 | Crisis content present | Phase 27, 29 §10 | `/crisis` contains 988, 741741, 911 | ☐ |
| 4 | Apex 200 | Phase 18, 29 §2.6 | `mymentalhealthbuddy.com` 200 | ☐ |
| 5 | www reachable | Phase 18, 29 §2.6 | `www.mymentalhealthbuddy.com` 200 (or 301 post-TODO-18.1) | ☐ |
| 6 | TTFB within budget | Phase 23 | p50 ≤ 500 ms | ☐ |
| 7 | Initial JS path ≤ 150 KB gz | Phase 24 §6 | `index + vendor-react` gzipped | ☐ |
| 8 | Largest JS chunk ≤ 350 KB raw | Phase 24 §3 | top JS file | ☐ |
| 9 | Main CSS ≤ 100 KB gz | Phase 25 §2 | `index-*.css` gzipped | ☐ |
| 10 | 0 source maps in public dist | Phase 24 §6 | `find client/dist -name "*.map" \| wc -l` = 0 | ☐ |
| 11 | 8 named vendor chunks present | Phase 24 §4 | `ls client/dist/assets/vendor-*.js \| wc -l` = 8 | ☐ |
| 12 | Total dist ≤ 50 MB | Phase 26 §2 | `du -sh client/dist` | ☐ |
| 13 | 0 external font CDN deps | Phase 26 §6 | no `fonts.googleapis.com` / `fonts.gstatic.com` refs | ☐ |
| 14 | All 8 required secrets present | Phase 27 §1.4 | secrets panel inspection | ☐ |
| 15 | HSTS header present | Phase 18, 29 §2.3 | `curl -I` shows `Strict-Transport-Security` ≥ 1y | ☐ |
| 16 | favicon.ico 200 | Phase 29 §2.5 | curl probe | ☐ |
| 17 | og-image.png 200 | Phase 29 §2.5 | curl probe | ☐ |
| 18 | robots.txt 200 | Phase 29 §2.8 | curl probe | ☐ |
| 19 | sitemap.xml 200 | Phase 29 §2.8 | curl probe | ☐ |
| 20 | Governance kernel doc present | Phase 27 §1.5 | `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` exists | ☐ |
| 21 | All Phase 21–29 reports committed | Phase 27 §1.5 | `git --no-optional-locks log` shows each phase | ☐ |
| 22 | Working tree clean | Phase 27 §1.5 | `git --no-optional-locks status` empty | ☐ |
| 23 | Workflow `Start application` running | Phase 23 | workflows panel green | ☐ |
| 24 | Deployment logs free of ERROR last 1h | Phase 29 §9 | `fetch_deployment_logs` zero matches on `ERROR\|FATAL` | ☐ |
| 25 | On-call paged in and acknowledged | Phase 27 §3.1 | rotation primary + secondary confirmed | ☐ |

**Decision rule:** **25/25 = GO**. Any NO-GO = halt, remediate, re-run that gate, re-evaluate.

---

## 2. Required sign-off categories

Both signers must sign for GO. Either may issue NO-GO unilaterally.

| Category | Owner | Authority |
|---|---|---|
| Engineering on-call | _________________ | Operational readiness (rows 1–19, 23–25) |
| Architecture / Governance | _________________ | Governance + contract integrity (rows 20–22) + crisis-routing veto |

### BHCE veto

The Architecture / Governance signer may **veto** launch for **any** crisis-routing concern, even if rows 2, 3, and the §5 hard gate all pass. BHCE asymmetry: err toward stopping launch when in doubt about a crisis surface.

---

## 3. Launch-day command checklist

Execute strictly in order on launch day. Do not parallelize. Each line is a Shell-tab command.

| # | Step | Command / panel action | Verify |
|---|---|---|---|
| 1 | Announce window open | (post in launch channel) | acknowledged |
| 2 | Freeze main | (post in #engineering: "no merges until further notice") | acknowledged |
| 3 | Run final §1 matrix | each row, top-to-bottom | 25/25 GO |
| 4 | Both signers sign §2 | (post sign-offs in launch channel) | both names captured |
| 5 | Tag release | `git tag -a v1.0.0 -m "MMHB public launch"` then `git push origin v1.0.0` (Shell tab) | tag visible on origin |
| 6 | Deploy | `suggest_deploy` flow / Publishing panel | Replit shows "deploying" → "deployed" |
| 7 | Liveness loop post-deploy | Probe Checklist §2.1 | all 4 → 200 |
| 8 | Smoke matrix rows 1–12 | Probe Checklist §3 | rows 1, 2, 3, 4, 7 = P0 hard PASS |
| 9 | Observability check | Probe Checklist §9 | first trace + first metric within 60s |
| 10 | Crisis probe | Probe Checklist §10 (3-step) | all three steps PASS |
| 11 | Launch channel announce | "MMHB v1.0.0 live at https://mymentalhealthbuddy.com" | posted |
| 12 | Open T+0 → T+72h hourly pulse rotation | Runbook §3.2 | first pulse logged |

If step 7, 8, 9, or 10 fails: **halt and execute §4 rollback immediately.**

---

## 4. Rollback readiness confirmation

Before signing §2, the Engineering signer confirms each item below is true:

- [ ] Last 5 deploys visible in Replit deployment history panel
- [ ] Last known-good deploy is identified by tag or timestamp (recorded in launch log)
- [ ] Replit deployment history "Restore" action is reachable from the panel (no permissions issue)
- [ ] Probe Checklist §4 (10-step rollback procedure) is on-screen and readable
- [ ] Rollback owner is identified (typically primary on-call) and accessible
- [ ] 5-minute rollback SLO is understood and acknowledged
- [ ] Failing deploy artifact preservation policy understood (do NOT delete after rollback)

**If any rollback readiness item is false → automatic NO-GO until corrected.**

---

## 5. Crisis-routing hard gate (BHCE)

**Highest priority. Cannot be waived.**

This gate runs **before** the rest of §1, **during** the launch sequence at step 10, and **after** any rollback. Three commands:

```bash
# 1. /crisis reachable
curl -s -o /dev/null -w "%{http_code}\n" "https://mymentalhealthbuddy.com/crisis"
# expected: 200

# 2. All three resources present
curl -s "https://mymentalhealthbuddy.com/crisis" | grep -oE "988|741741|911" | sort -u
# expected: three distinct lines

# 3. Global footer link
curl -s "https://mymentalhealthbuddy.com/" | grep -ci 'href="/crisis"'
# expected: ≥ 1
```

**If any of the three fails:**
- This gate = NO-GO
- §1 matrix = NO-GO (overrides any other GO state)
- Architecture / Governance signer must veto
- Launch is halted until restored end-to-end
- Cause must be documented in `docs/reports/POST_INCIDENT_BHCE_<TS>.md` post-resolution

This is the only gate in the matrix where the BHCE asymmetry applies — when in doubt, NO-GO.

---

## 6. Health endpoint hard gate

| Endpoint | Pass | NO-GO if |
|---|---|---|
| `/healthz` | 200 | non-200 or unreachable |
| `/readyz` | 200 | non-200 or unreachable |
| `/api/health` (or canonical) | 200 | non-200 or returns degraded JSON |

All three must pass against the **production** URL (post-deploy), not just dev. Health gate failure during the launch sequence = automatic invocation of §4 rollback.

---

## 7. Production endpoint hard gate

Smoke matrix rows 1, 2, 3, 4, 7 from Probe Checklist §3 are P0 hard gates. Restated here for finality:

| Row | Surface | Probe | Hard gate criterion |
|---|---|---|---|
| 1 | Root | `GET /` | 200, HTML, has `<title>` |
| 2 | Crisis | `GET /crisis` | 200, contains 988/741741/911 |
| 3 | Liveness | `GET /healthz` | 200 |
| 4 | Readiness | `GET /readyz` | 200 |
| 7 | Admin gate | `GET /admin` unauthed | redirect or 401/403 — **never** 200 with admin data |

Row 7 specifically guards against an unauthenticated admin data leak, which is a P0 security regression even if all other gates pass.

---

## 8. Security header hard gate

```bash
curl -sI "https://mymentalhealthbuddy.com/" | grep -iE "strict-transport-security|content-security-policy|x-content-type-options"
```

**Minimum required:**
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (exactly one occurrence post-TODO-18.4)

**Currently noted (informational, not gating):**
- HSTS may appear twice pre-TODO-18.4 (one from Replit edge, one from app) — cosmetic, browsers honor strictest
- CSP, X-Content-Type-Options, Referrer-Policy logged for the launch log but not launch-blocking at v1.0.0

**Hard NO-GO trigger:** zero HSTS headers, or HSTS `max-age` < 31536000.

---

## 9. Domain readiness note

**Current state (verified Phase 18):**
- Apex `mymentalhealthbuddy.com` → 200 (canonical)
- www `www.mymentalhealthbuddy.com` → 200 (will become 301 → apex post-TODO-18.1)
- Edge IP `34.111.179.208`
- TLS terminated at Replit edge (mTLS-proxied preview in dev; standard HTTPS in production)

**Pre-launch:** both apex and www returning 200 is acceptable for v1.0.0 launch. The www → apex 301 redirect (TODO-18.1) is a post-launch Sprint-1 item to consolidate SEO signal.

**No domain-readiness item is a launch blocker at v1.0.0.** This section exists to make the deferred state explicit so post-launch readers understand the current behavior is intentional.

---

## 10. Open TODO carry-forward list (Phase 28 ledger snapshot)

12 items open at launch. **None are S0.** None block launch.

| TODO | Severity | Sprint | One-line |
|---|---|---|---|
| TODO-18.1 | S2 | 1 | www → apex 301 |
| TODO-26.1 | S1 | 1 | AVIF avatar regions |
| TODO-26.2 | S1 | 1 | AVIF brand logos |
| TODO-26.3 | S3 | 1 | de-dupe 4 byte-identical pairs |
| TODO-18.4 | S3 | 1 | duplicate HSTS investigation |
| TODO-22.2 | S1 | 2 | OTel cluster coordinated bump |
| TODO-23.1 | S2 | 2 | Prometheus `/metrics` |
| TODO-26.4 | S2 | 2 | consolidate avatar source dirs |
| TODO-22.1 | S1 | 3 | Express 4→5 |
| TODO-24.2 | S3 | 3 | Sentry sourcemap upload (optional) |
| TODO-24.1 | S2 | conditional | split WellnessDashboard if >350 KB raw |
| TODO-24.3 | S2 | conditional | split _autopilot / AdvancedToolsPage |

**Retired:** TODO-23.2 (CSS purge — closed by Phase 25).

**Launch impact:** zero. All 12 items are post-launch optimization. The Phase 28 ledger explicitly forbids any of these from being picked up during the launch window (T-24h → T+72h).

---

## 11. Public beta readiness decision

**Recommendation: GO for public beta launch at v1.0.0, conditional on §1 matrix = 25/25 and both §2 sign-offs.**

**Evidence base:**

| Pillar | Source | Status |
|---|---|---|
| Performance baseline | Phase 23 | TTFB ~185 ms, 99 KB gz initial path |
| Bundle health | Phase 24 | 8 vendor chunks, lazy routes, 0 source maps |
| CSS pipeline | Phase 25 | 60 KB gz main, 0 duplicate selectors |
| Static assets | Phase 26 | 35 MB dist, 0 external font CDN, exemplary fonts |
| Operational playbook | Phase 27 | runbook with 6 incident playbooks |
| Backlog discipline | Phase 28 | 12 TODOs ledgered, 0 S0, schedule defined |
| Probe suite | Phase 29 | 13-section read-only probe checklist |

**Risk profile at v1.0.0:**
- S0 risks: **0**
- S1 risks: 4 (all dependency / asset weight, none user-facing-blocking)
- S2 risks: 5 (operational hygiene)
- S3 risks: 3 (cosmetic)

**Public beta criteria all met:**
- ✅ User safety (crisis routing) verified end-to-end
- ✅ Performance budgets all under threshold
- ✅ Operational runbook + probe suite + rollback procedure documented and rehearseable
- ✅ Post-launch backlog ordered and schedulable
- ✅ Governance kernel honored across all pillars

**Beta caveats to communicate to early users (optional, marketing/comms decision):**
- Asset weight optimization scheduled Sprint 1 (TODO-26.1/26.2) — initial page weight will drop ~17 MB within 14 days
- Observability standardization scheduled Sprint 2 (TODO-22.2 / 23.1)
- These are improvements, not defects

---

## 12. Launch approval score

Calculated at T-1h before launch. Each row is 1 point. Max = 30.

| # | Criterion | 1 pt if… |
|---|---|---|
| 1 | §1 row 1 (build) | GO |
| 2 | §1 row 2 (4 liveness probes) | GO |
| 3 | §1 row 3 (crisis content) | GO |
| 4 | §1 row 4 (apex 200) | GO |
| 5 | §1 row 5 (www reachable) | GO |
| 6 | §1 row 6 (TTFB) | GO |
| 7 | §1 row 7 (initial path) | GO |
| 8 | §1 row 8 (largest JS) | GO |
| 9 | §1 row 9 (main CSS) | GO |
| 10 | §1 row 10 (0 source maps) | GO |
| 11 | §1 row 11 (8 vendor chunks) | GO |
| 12 | §1 row 12 (dist size) | GO |
| 13 | §1 row 13 (0 external font CDN) | GO |
| 14 | §1 row 14 (secrets) | GO |
| 15 | §1 row 15 (HSTS) | GO |
| 16 | §1 row 16 (favicon) | GO |
| 17 | §1 row 17 (og-image) | GO |
| 18 | §1 row 18 (robots) | GO |
| 19 | §1 row 19 (sitemap) | GO |
| 20 | §1 row 20 (governance doc) | GO |
| 21 | §1 row 21 (Phase 21–29 reports committed) | GO |
| 22 | §1 row 22 (working tree clean) | GO |
| 23 | §1 row 23 (workflow running) | GO |
| 24 | §1 row 24 (no ERROR logs last 1h) | GO |
| 25 | §1 row 25 (on-call ack) | GO |
| 26 | §4 rollback readiness (all 7 items) | all true |
| 27 | §5 BHCE hard gate (3 probes) | all PASS |
| 28 | §6 health endpoint hard gate (3 endpoints) | all 200 |
| 29 | §7 production hard gate (5 P0 rows) | all PASS |
| 30 | §8 security header hard gate (HSTS) | present, ≥ 1y |

**Score interpretation:**
- **30/30** → GO (launch)
- **28–29/30** → CONDITIONAL GO — only if missing items are §1 rows 18, 19, or §8 cosmetic (S3); document the carveout and proceed
- **≤ 27/30** → NO-GO, halt, remediate, re-score

---

## 13. Final approval signatures

The two signers below must both sign before any T-0 action.

```
ENGINEERING ON-CALL

Signature:  _______________________________________
Name:       _______________________________________
Date/Time:  _______________________________________
Score:      ___ / 30
Decision:   ☐ GO    ☐ NO-GO

Notes / carveouts:
________________________________________________________________
________________________________________________________________


ARCHITECTURE / GOVERNANCE

Signature:  _______________________________________
Name:       _______________________________________
Date/Time:  _______________________________________
Decision:   ☐ GO    ☐ NO-GO    ☐ BHCE VETO

Notes / carveouts / veto reason:
________________________________________________________________
________________________________________________________________
```

Both signatures required for launch. Either signer's NO-GO is final until corrected.

---

## 14. References

- Probe Checklist: `docs/operations/PRODUCTION_PROBE_CHECKLIST.md`
- Launch Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- TODO Ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Phase reports: `docs/reports/PHASE_2{1..9}_*` for each evidence pillar

---

*This matrix is the final pre-launch authority. It introduces no new contracts — every gate is sourced from a verified Phase 21–29 baseline. Documentation only.*

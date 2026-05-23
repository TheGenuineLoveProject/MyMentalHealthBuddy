# MMHB Disaster Recovery Runbook

**Baseline established:** 2026-05-23 (Phase 50)
**Production target:** `https://mymentalhealthbuddy.com`
**Authority:** MMHB v7.4 Governance Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Owner:** Operations / Release Engineering / On-call
**Audience:** the next person paged at 3am
**Companion docs:**
- Contract registry → `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Latest runtime snapshot → `.local/snapshots/phase49-20260523T020643Z/` (meta-hash `7452a538…`)
- Diagnostics skill → `.local/skills/diagnostics/SKILL.md`

---

## 0. Read this first — Primary Law

**BHCE (Behavioral Healing Crisis Escalation) overrides every other rule in this document.**

If you are unsure whether an action is safe during an incident, ask: *Will users still see crisis hotline numbers if I do this?* If the answer might be "no," **stop and verify §4 first**. Asymmetric risk: a 5-minute delay to verify crisis routing is always cheaper than a single moment where a user in crisis cannot reach 988 / 741741 / 911.

Do not skip §4 even when a different alarm is louder.

## 1. Severity ladder

| Sev | Definition | Examples | Response window |
|---|---|---|---|
| **P0 — crisis surface degraded** | `/crisis` returns non-200, or `/crisis` HTML is missing any F-33.6 literal (`988`, `741741`, `911`, `/crisis`, `Crisis Text Line`) | broken redirect, deploy stripped crisis page, CDN cache poisoned with empty body | **immediate** — rollback within 10 min |
| **P1 — site down or auth broken** | `/` returns 5xx, login fails for all users, `/api/health.database.connected = false` | DB outage, server crash loop, certificate expiry | within 15 min |
| **P2 — feature regression** | a non-crisis page or API broken; mood / journal / chat unavailable | a wellness route 500s, AI provider outage | within 1 h |
| **P3 — metric drift** | canary fail on `/healthz` `/ready` `/readyz` `/api/health` `/metrics` `/metrics` shape but the user-facing surface is intact | `/api/health.platform.totalRoutes` deviates ± 5; npm audit jumps to high/critical | within 1 day |

Every section below is keyed to one of these severities.

## 2. Emergency health checks (run these first — always, every incident)

### 2.1 The 30-second triage

Single shell pipeline that returns the full surface state. Run before any other action.

```bash
BASE="https://mymentalhealthbuddy.com"
for ep in "" "crisis" "healthz" "ready" "readyz" "api/health" "metrics"; do
  printf "/%-12s " "$ep"
  curl -sS -o /dev/null --max-time 10 -w "http=%{http_code}  size=%{size_download}B  ct=%{content_type}\n" "$BASE/$ep"
done
```

**Expected (healthy):**

```
/             http=200 size=10652B  ct=text/html; charset=UTF-8
/crisis       http=200 size=10652B  ct=text/html; charset=UTF-8
/healthz      http=200 size=2B      ct=text/plain; charset=utf-8
/ready        http=200 size=57B     ct=application/json; charset=utf-8
/readyz       http=200 size=57B     ct=application/json; charset=utf-8
/api/health   http=200 size=~430B   ct=application/json; charset=utf-8
/metrics      http=200 size=~160B   ct=application/json; charset=utf-8
```

Read across rows for the failure pattern. The patterns in §2.3 cover 90 % of incidents.

### 2.2 The 60-second forensic check

```bash
# Is the database alive?
curl -sS https://mymentalhealthbuddy.com/api/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('db=',d['database']['connected'],'env=',d['environment'],'status=',d['status'],'uptime=',d['uptime'],'softLaunch=',d['softLaunch'])"

# Is the deploy what you think it is? (startedAt = current deploy's boot time)
curl -sS https://mymentalhealthbuddy.com/api/health | python3 -c "import sys,json; print('startedAt=',json.load(sys.stdin)['startedAt'])"

# Are the F-33.6 crisis literals still in the HTML?
curl -sS https://mymentalhealthbuddy.com/crisis | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' | sort -u | wc -l
# Must equal 5. Anything less is P0.
```

### 2.3 Failure pattern → likely cause table

| Pattern | Likely cause | Go to |
|---|---|---|
| All 7 endpoints 5xx or timeout | server crashed / not bound to port | §3.1 (rollback) + Replit Deployments panel restart |
| `/healthz` 200 but `/ready`/`/readyz` 5xx | app booted but post-middleware crash | §3.2 (logs) → §3.1 if unresolved |
| `/api/health.database.connected = false` | DB outage or credentials rotated | §6 (DB-specific) — do **not** redeploy until DB recovers |
| `/crisis` returns 10,652 B HTML but F-33.6 literal count < 5 | bad build stripped crisis content | **P0** — §3.1 rollback **immediately** |
| `/crisis` returns non-200 | catch-all SPA fallback broken, or routing regression | **P0** — §3.1 rollback **immediately** |
| `/readyz` returns 10,652 B `text/html` instead of 57 B JSON | route handler missing from deployed build (pre-Phase 47 baseline) | not P0 if `/ready` still works; treat as deferred deploy gap, see Phase 47 |
| `/api/health.platform.totalRoutes` ≠ 127 | route registration drift; possible missing import | §3.2 (logs) — investigate before rollback |
| `/api/health.startedAt` older than expected | deploy didn't restart; new code not running | redeploy via Replit Deployments panel |
| `/api/health.services.{stripe,resend,perplexity,sentry} = false` | external service outage | §6 — do not rollback for this; raise vendor incident |
| All 200 but user reports broken UI | client bundle issue; check browser console | §3.2 (logs) + browser DevTools |

## 3. Rollback procedures

**Hard rule:** rollback decisions are made on evidence (§2 triage output), never on intuition. Capture the failing `/api/health` body and at least one `/crisis` curl before rolling back — these are forensics for the post-mortem.

### 3.1 Full deploy rollback (P0 / P1)

**Use when:** P0 crisis surface degraded, P1 site down with no obvious recoverable cause, or you have already tried a focused fix and failed.

The preferred path is **Replit checkpoint rollback**, not manual `git reset`, because checkpoints capture database state alongside code.

#### Procedure

1. **Identify the last-known-good commit.** Most recent `Published your App` checkpoint that you have evidence was healthy. Examples of recorded good states:
   - `d9b443597 Published your App` (2026-05-23, Phase 49 snapshot) — anchor for v1.0.0 baseline
   - Whatever the latest `Published your App` checkpoint is at incident time, if it was running cleanly before the failing change
2. **Open the Replit Deployments panel.** Find the deployment history; locate the last-known-good version.
3. **Trigger rollback** via the Replit UI. Do **not** attempt `git reset --hard` or `git push --force` from the agent — these are blocked and unsafe.
4. **Wait for redeploy to finish.** Watch `/api/health.startedAt` — it must change to a fresh timestamp.
5. **Re-run §2.1 triage.** All 7 endpoints must return their expected contract per `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`.
6. **Re-run §2.2 forensic check.** `database.connected = true`, F-33.6 literal count = 5, `environment = "production"`.
7. **Promote success per §7.**

#### When checkpoint rollback is unavailable

If the Replit checkpoint system is itself unhealthy:

1. Compare current production runtime against the most recent snapshot's manifest:
   ```bash
   SNAP=".local/snapshots/phase49-20260523T020643Z"
   # Verify snapshot integrity first
   sha256sum -c $SNAP/SHA256_MANIFEST.meta
   # Then verify the manifest itself
   ( cd $SNAP && sha256sum -c SHA256_MANIFEST.txt )
   ```
2. The snapshot is **a reference, not an installer**. Do not blindly `cp` snapshot files over production — they may have been captured under different env config. Use the snapshot to *identify* which files diverged.
3. Open a phase task for the recovery work; coordinate with the user before any code restoration.

### 3.2 Investigation without rollback (P2 / P3)

**Use when:** failure is localized, crisis surface is intact, you can roll forward instead of back.

1. Refresh logs: read `Start application` workflow logs via `refresh_all_logs`.
2. Check for stack traces around the failing endpoint.
3. If a single recent commit is suspect:
   - Read the commit diff
   - Reproduce locally by restarting the workflow with a minimal repro curl
   - Patch under a new phase (smallest valid engine wins — kernel rule)
4. Re-run §2 after the fix.

## 4. Crisis route protection (NEVER negotiate this)

The `/crisis` page and the F-33.6 literal set are **non-negotiable, P0-blocking, governance-locked surfaces.** They are protected by these rules in priority order:

### 4.1 Verification gate (run before AND after every rollback)

```bash
COUNT=$(curl -sS https://mymentalhealthbuddy.com/crisis | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' | sort -u | wc -l)
test "$COUNT" -eq 5 && echo "F-33.6 PASS" || echo "F-33.6 FAIL — count=$COUNT — DO NOT PROMOTE"
```

If the count is < 5 at any point during incident response, **stop everything else and restore the crisis surface first**, even if a different failure is louder.

### 4.2 Hard rules

- **Never deploy a code change that removes any of the 5 literals.** A PR that touches `client/src/pages/crisis.tsx`, the BHCE fallback in `index.html`, or any string-asset bundle including these literals requires governance kernel review per registry §11.
- **Never accept a "we'll patch the crisis page in the next release" framing.** Patch it now or roll back now. There is no acceptable interval where `/crisis` is degraded in production.
- **Never gate `/crisis` behind authentication, paywall, soft-launch flag, feature flag, or any conditional rendering** that could hide hotline numbers from a user who lands there directly.
- **Never depend on JavaScript to render the hotline numbers.** They must be present in the HTML source so the BHCE fallback works even when JS fails to hydrate. The current build embeds them in the SPA shell at SHA256 `f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec`.
- **Never enable a robots.txt, headers, or CSP rule that prevents `/crisis` from being indexed or cached by browsers.** If a user has visited the site once, the page should be reachable from browser cache even if the server is down.

### 4.3 Synthetic monitoring

A canary against §4.1 should be running continuously (cron or external uptime monitor). If you adopt or change the monitoring stack, the §4.1 check **migrates with it** — it is the only check that, when failing, automatically triggers §3.1 rollback without further deliberation.

### 4.4 Cross-domain contamination check

Per v7.4 kernel Primary Law: healing flows never contain pricing, conversion, or platform debugging content; business flows never contain crisis content for routing reasons. During incident response:

- If you introduce a banner / toast / modal / overlay, **never** add it to `/crisis`.
- Maintenance pages must include the 5 F-33.6 literals or must explicitly link to a static `/crisis` mirror.
- Any "we're down" page served as a fallback **must** carry the crisis hotline numbers.

## 5. Do-not-do incident rules

These have caused or could cause real outages. Memorize them.

| ❌ Do **NOT** | Why | Do this instead |
|---|---|---|
| `git reset --hard`, `git push --force`, `git rebase` during an incident | irreversible, can drop the recovery commits | use Replit checkpoint rollback (§3.1) |
| `npm audit fix --force` | breaking-change upgrades; project hard rule prohibits this | leave vulnerabilities alone unless governance phase scoped the fix |
| `npm update`, package version bumps, runtime upgrades | reproducibility loss; new bugs | snapshot must reload as-is |
| Edit `.replit`, `vite.config.ts`, `drizzle.config.ts` to "make the build work" | forbidden by fullstack_js guidelines; permanent breakage risk | open a new phase with explicit user approval |
| Disable rate limiting, helmet, CSP, HSTS to "unblock" a failing call | introduces security regressions; the call probably isn't the actual problem | inspect logs (`refresh_all_logs`) — root-cause first |
| Manually edit production database to "fix" a bad write | no audit trail; reconciliation impossible | open a phase, write a SQL migration, get user approval |
| Skip §4.1 because "the crisis page is unrelated to this incident" | bad deploys correlate; the rollback you're about to do might silently strip it | always run §4.1 before AND after every change |
| Run `npm run db:push --force` against production | irreversible schema change; risk of data loss | use `npm run db:push` (no `--force`); if it warns, **stop and escalate** |
| Touch source code in main agent during a P0 if the user is not online to approve | scope creep; you might paper over a regression | rollback first, source-fix in a follow-up phase |
| Restart the `Start application` workflow without first reading the logs | you lose evidence of why it failed | `refresh_all_logs` → screenshot the error → then restart |
| Trust "it works on my machine" — i.e. the Replit dev domain — as proof production is fixed | dev and production are different runtimes (different `startedAt`) | curl `https://mymentalhealthbuddy.com` directly, every time |
| Promote a fix without re-running §2.1 + §2.2 + §4.1 | unverified fixes are not fixes | gate every "done" claim on those three checks passing |
| Send users a "we're back" announcement before §7 success criteria are met | reputational damage when problems recur | wait for the full check (§7) |
| Modify `replit.md` polish/history sections during an incident | log noise drowns the actual incident detail | record incident in a phase report; `replit.md` updates can wait |
| Add `console.log` or `debugger` statements to running production code | leaks user data, performance hit | use `/metrics` and `/api/health` for runtime diagnostics; reproduce locally |

## 6. Database-specific recovery

This section is intentionally narrow — DB rollback is not in the agent's scope per project rules. It exists to tell you what to do **before** escalating.

- If `/api/health.database.connected = false`:
  1. Do **not** redeploy — this won't fix DB outage.
  2. Confirm `DATABASE_URL` env var is set (do not print its value).
  3. Check Replit database panel for the database's health indicator.
  4. If the DB is healthy but the app cannot connect, restart the `Start application` workflow.
  5. If still failing, escalate — DB rollback uses Replit's checkpoint system, which the user must initiate from the Replit UI (see `diagnostics` skill).
- **Never** run destructive SQL against production. The `database` skill's `environment: "production"` mode is **read-only** by contract.
- Schema migrations are governed by `npm run db:push` (or `--force` on data-loss warnings) — both require explicit user approval and a dedicated phase. They are **never** an emergency-response action.

## 7. Recovery success criteria

A recovery is **not complete** until **all** of the following pass:

### 7.1 Surface health (registry §10 canary suite)

Re-run the 18-assertion canary from `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` §10. Required: **18 PASS / 0 FAIL.**

### 7.2 Critical invariants

| # | Check | Pass criterion |
|---|---|---|
| 1 | F-33.6 literal count (§4.1) | exactly 5 |
| 2 | `/api/health.status` | `"healthy"` |
| 3 | `/api/health.environment` | `"production"` |
| 4 | `/api/health.database.connected` | `true` |
| 5 | `/api/health.softLaunch` | `false` (unless soft-launch is the intended state) |
| 6 | `/api/health.platform.totalRoutes` | `127` (or current registry baseline) |
| 7 | `/api/health.services.{stripe,resend,perplexity,sentry}` | all `true` |
| 8 | `/api/health.node` | matches the runtime version recorded in latest snapshot (currently `v20.20.0`) |
| 9 | `/readyz` body matches `^\{"status":"ready","timestamp":"\d{4}-\d{2}-\d{2}T.+Z"\}$` | regex match |
| 10 | `/api/health.startedAt` | newer than the failing-deploy's `startedAt` (proves redeploy actually happened) |

### 7.3 User-facing smoke test

- Load `https://mymentalhealthbuddy.com/` in a real browser (not just curl). SPA hydrates, navigation works.
- Click through to `/crisis`. Hotline numbers visible. No JS errors in console.
- Attempt one authenticated read (e.g. dashboard). Loads without 5xx.
- Attempt one authenticated write (e.g. mood entry). Persists and reads back.

### 7.4 Forensics captured

A recovery without a written post-mortem is half a recovery. After §7.1–§7.3 pass, before closing the incident:

1. Capture pre- and post-fix curl outputs to a new phase report (`docs/reports/PHASE_N_*.md`).
2. Record the failing commit SHA, the recovery commit SHA, the rollback method (checkpoint vs. roll-forward), and the timeline (detection → mitigation → resolution).
3. Update this runbook (§2.3, §5) if a new failure pattern or new "do not do" rule emerged.
4. Take a fresh runtime snapshot per the Phase 49 protocol if the recovery shipped any code change.
5. Update `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` if any contract changed (size band, header, body shape).

### 7.5 The 24-hour shadow

For 24 hours after recovery, monitor `/healthz` `/readyz` `/api/health` at 1-minute cadence. Confirm `uptime` increases monotonically (no silent restarts) and `memory.heapUsedMB` stays bounded. Recovery is **closed** only after this window completes cleanly.

## 8. Quick reference card (print this)

```
TRIAGE (always first)
  for ep in "" crisis healthz ready readyz api/health metrics; do
    curl -sS -o /dev/null --max-time 10 \
      -w "/$ep http=%{http_code} size=%{size_download}B ct=%{content_type}\n" \
      "https://mymentalhealthbuddy.com/$ep"
  done

CRISIS GATE (always before & after every action)
  curl -sS https://mymentalhealthbuddy.com/crisis \
    | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' \
    | sort -u | wc -l    # must equal 5

DEPLOY FRESHNESS
  curl -sS https://mymentalhealthbuddy.com/api/health \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['startedAt'])"

ROLLBACK
  Replit Deployments panel → last-known-good `Published your App`
  Do NOT git reset / git push --force / npm audit fix --force

RECOVERY CLOSED?
  18/18 canary PASS  +  F-33.6 = 5  +  /api/health all green
  +  browser smoke test  +  post-mortem written  +  24h shadow clean
```

## 9. Change-control

| Action | Required process |
|---|---|
| Add a new "do not do" rule | doc-only PR; reference the incident report that produced it |
| Update §7 success criteria | requires Sr review; tie to a phase report with evidence |
| Modify §4 crisis protection | **governance kernel review required** — these rules are P0 invariants |
| Update §2.3 failure-pattern table | doc-only PR; include the curl output that established the new pattern |
| Adopt a new monitoring tool | the §4.1 crisis check **must** migrate with it; the §2.1 triage **must** be runnable against it |

## 10. References

- Contract registry → `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Most recent runtime snapshot → `.local/snapshots/phase49-20260523T020643Z/` (meta-hash `7452a538…`)
- F-33.6 origin → `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Production canary baseline → `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- `/readyz` republish-gap precedent → `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Snapshot precedent → `docs/reports/PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`
- Governance Kernel → `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Diagnostics skill (rollback) → `.local/skills/diagnostics/SKILL.md`

---

*This runbook is descriptive of today's production contract, not aspirational. When the contract changes, this runbook updates with it. When this runbook saves an incident, write the incident report so the next person inherits the lesson.*

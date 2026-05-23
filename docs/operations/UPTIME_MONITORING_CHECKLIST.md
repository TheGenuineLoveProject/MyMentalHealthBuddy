# MMHB Uptime Monitoring Checklist

**Baseline established:** 2026-05-23 (Phase 51)
**Production target:** `https://mymentalhealthbuddy.com`
**Authority:** MMHB v7.4 Governance Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Audience:** anyone wiring up Pingdom / UptimeRobot / Better Stack / Checkly / Datadog Synthetics / a homegrown cron — pick your tool, the contract is the same
**Companion docs:**
- Contract registry → `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` (source of truth for every expected value below)
- Disaster recovery runbook → `docs/operations/DISASTER_RECOVERY_RUNBOOK.md` (what to do when a monitor fires)

---

## 0. Read this first

This checklist tells you **what** to monitor, **at what frequency**, **with what alert priority**, and **what to do when it fires**. It is intentionally tool-agnostic — adopt any reputable uptime provider and translate the contracts below into its check definitions.

**Two non-negotiables before you publish this stack as "monitored":**

1. **The S0 crisis check (`/crisis` F-33.6 literal verification) must be wired up.** Without it, you have not protected the user surface that matters most. This is a kernel-level requirement, not a recommendation.
2. **Every alert routes to a human, not a queue that no one reads.** S0 wakes someone up; S1 pages during business hours; S2 lands in a digest. If you cannot satisfy this, downgrade the launch readiness claim.

## 1. Required production endpoint monitors

The 7 endpoints below are the entire contract surface (Phase 48). Every uptime stack must monitor **all 7**, with the parameters below.

| # | Endpoint | Frequency | Severity on failure | Pass criteria | Notes |
|---|---|---|---|---|---|
| 1 | `https://mymentalhealthbuddy.com/crisis` (literal check) | **60 s** | **S0** | HTTP 200 **and** body contains all 5 literals: `988`, `741741`, `911`, `/crisis`, `Crisis Text Line` | crisis surface — kernel BHCE invariant; **never** silence this alert |
| 2 | `https://mymentalhealthbuddy.com/healthz` | **30 s** | **S1** | HTTP 200, body = `ok`, `content-type: text/plain`, response < 500 ms | classic load-balancer-style liveness probe |
| 3 | `https://mymentalhealthbuddy.com/ready` | **60 s** | **S1** | HTTP 200, `content-type: application/json`, body regex `^\{"status":"ready","timestamp":"\d{4}-\d{2}-\d{2}T.+Z"\}$` | readiness — app accepted traffic |
| 4 | `https://mymentalhealthbuddy.com/readyz` | **60 s** | **S1** | HTTP 200, `content-type: application/json`, body regex same as `/ready` | k8s-style readiness alias; live since Phase 49 republish |
| 5 | `https://mymentalhealthbuddy.com/api/health` (deep) | **60 s** | **S1** | HTTP 200, JSON, `status: "healthy"`, `database.connected: true`, `environment: "production"`, `services.{stripe,resend,perplexity,sentry}: all true` | deepest internal-state check; do not silence partial failures |
| 6 | `https://mymentalhealthbuddy.com/` (SPA shell) | **120 s** | **S1** | HTTP 200, `content-type: text/html`, body size ≈ 10,652 B ± 10 % | catches CDN poisoning + total app outage |
| 7 | `https://mymentalhealthbuddy.com/metrics` | **300 s** | **S2** | HTTP 200, `content-type: application/json`, `cache-control: no-store` | operational signal; not user-facing |

### 1.1 TLS / certificate monitor

| Check | Frequency | Severity | Trigger |
|---|---|---|---|
| TLS certificate validity for `mymentalhealthbuddy.com` | **3600 s** | **S1** | < 14 days to expiry |
| TLS certificate validity for `mymentalhealthbuddy.com` | **3600 s** | **S0** | < 48 h to expiry **or** already expired |

Replit-managed deployments auto-renew, but if a renewal fails you must catch it before the cliff.

### 1.2 DNS resolution monitor

| Check | Frequency | Severity | Trigger |
|---|---|---|---|
| `A`/`CNAME` lookup for `mymentalhealthbuddy.com` from 2+ geographic regions | **300 s** | **S1** | NXDOMAIN or > 2 s resolution time |

### 1.3 Geographic distribution

Run check #1 (the crisis literal check) from **at least 3 regions**: one US, one EU, one APAC. The crisis surface is a global commitment; a single-region monitor does not satisfy it. Checks #2–#7 can run from one region if budget is constrained, but #1 cannot.

## 2. Alert priorities — S0 / S1 / S2

The three-tier model below is the **default**. If your provider uses different terms (P1/P2/P3, Critical/High/Low), map them, do not rename.

### 2.1 S0 — wake someone up, immediately

**Definition:** the user-facing crisis surface is degraded. Asymmetric risk — false-positive cost is a missed hour of sleep; false-negative cost is a person in crisis who cannot reach 988.

**Triggers:**
- Check #1 fails: `/crisis` returns non-200 **or** any of the 5 F-33.6 literals missing
- TLS certificate < 48 h to expiry or expired
- Check #1 fails simultaneously from ≥ 2 regions (excludes single-region transient network blips)

**Response SLA:** acknowledge within **5 min**, mitigate within **10 min**.

**Routing:** phone call + SMS + push notification to the primary on-call; auto-escalate to secondary on-call if not acknowledged in 5 min.

**Auto-action:** none — humans rollback per the disaster recovery runbook §3.1. (Auto-rollback is too risky to wire to S0; the runbook's §4.1 gate is run by a human.)

**Silencing rule:** S0 alerts **cannot** be silenced from the alerting tool's UI without a written reason captured in the incident channel. The "do-not-do" rule in the disaster recovery runbook §5 line "Skip §4.1 because the crisis page is unrelated" is the enforcement mechanism.

### 2.2 S1 — page during business hours, escalate after hours

**Definition:** core platform unhealthy but crisis surface intact; or a leading indicator of a soon-to-be-S0 (e.g. TLS expiry in 7 days).

**Triggers:**
- Checks #2, #3, #4, #5, #6 fail (any of them)
- TLS certificate < 14 days to expiry
- DNS resolution fails
- `/api/health` returns 200 but `database.connected: false` or any of the 4 external services reports `false`
- Synthetic login + write transaction fails (see §4)

**Response SLA:** acknowledge within **15 min**, mitigate within **1 h**.

**Routing:** Slack/Discord page + email; phone call after 30 min unacknowledged outside business hours.

**Auto-action:** none.

**Silencing rule:** may be silenced for up to **4 h** with a written reason; longer silences require a phase report explaining why.

### 2.3 S2 — log it, batch into a daily digest

**Definition:** operational drift; nothing user-visible.

**Triggers:**
- Check #7 (`/metrics`) fails
- `/api/health.platform.totalRoutes` deviates from baseline by ± 5
- `/api/health.platform.totalTools` deviates from baseline by ± 5
- `/api/health.memory.heapUsedMB` exceeds 200 (current baseline ~43)
- npm audit posture changes (new high/critical CVE published)
- Response time p95 for any endpoint exceeds 2 s

**Response SLA:** review next business day.

**Routing:** daily digest email + dashboard tile.

**Auto-action:** none.

**Silencing rule:** standard digest suppression rules apply.

### 2.4 Severity decision table

| Symptom | Severity |
|---|---|
| `/crisis` returns 404, 5xx, or strips a hotline number | **S0** |
| `/healthz` returns non-200 from one region only | S1 |
| `/healthz` returns non-200 from ≥ 2 regions | S0 (likely full outage) |
| `/readyz` returns 10,652 B HTML instead of 57 B JSON | S1 (deploy gap; not P0 if `/ready` works) |
| TLS expires in 13 days | S1 |
| TLS expires in 36 h | S0 |
| `/api/health.database.connected: false` | S1 (immediately; do not redeploy) |
| `/api/health.services.stripe: false` | S1 (payments degraded; vendor incident) |
| `/api/health.platform.totalRoutes` drifts by ± 5 | S2 |
| Response time p95 spikes from 250 ms to 800 ms | S2 |
| Response time p95 spikes from 250 ms to 5 s | S1 |
| Daily npm audit increments moderate count by +1 | S2 |
| Daily npm audit shows new critical CVE | S1 |

## 3. Manual health-check command

When a monitor fires — or when no monitor is wired yet — run this from a bare shell. Copy-pasteable, no dependencies beyond `curl` + `python3` + standard text utilities.

### 3.1 The 30-second triage (`/crisis` check + 7 endpoints)

```bash
BASE="https://mymentalhealthbuddy.com"

# S0 gate — crisis literals (run FIRST, always)
COUNT=$(curl -sS "$BASE/crisis" | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' | sort -u | wc -l)
test "$COUNT" -eq 5 && echo "[S0 PASS] F-33.6 literals = 5/5" || echo "[S0 FAIL] F-33.6 literals = $COUNT/5 — PAGE ON-CALL"

# 7-endpoint surface check
echo "----"
for ep in "" "crisis" "healthz" "ready" "readyz" "api/health" "metrics"; do
  printf "/%-12s " "$ep"
  curl -sS -o /dev/null --max-time 10 \
    -w "http=%{http_code}  size=%{size_download}B  ct=%{content_type}  time=%{time_total}s\n" \
    "$BASE/$ep"
done
```

**Expected (healthy):**

```
[S0 PASS] F-33.6 literals = 5/5
----
/             http=200 size=10652B  ct=text/html; charset=UTF-8  time=~0.3s
/crisis       http=200 size=10652B  ct=text/html; charset=UTF-8  time=~0.3s
/healthz      http=200 size=2B      ct=text/plain; charset=utf-8 time=~0.2s
/ready        http=200 size=57B     ct=application/json          time=~0.2s
/readyz       http=200 size=57B     ct=application/json          time=~0.2s
/api/health   http=200 size=~430B   ct=application/json          time=~0.7s
/metrics      http=200 size=~160B   ct=application/json          time=~0.2s
```

### 3.2 The 60-second deep-state check

```bash
curl -sS https://mymentalhealthbuddy.com/api/health | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'  status:      {d[\"status\"]}        (expect: healthy)')
print(f'  environment: {d[\"environment\"]}   (expect: production)')
print(f'  database:    {d[\"database\"][\"connected\"]}        (expect: True)')
print(f'  softLaunch:  {d[\"softLaunch\"]}        (expect: False)')
print(f'  uptime:      {d[\"uptime\"]}s')
print(f'  startedAt:   {d[\"startedAt\"]}')
print(f'  routes:      {d[\"platform\"][\"totalRoutes\"]}      (expect: 127)')
print(f'  tools:       {d[\"platform\"][\"totalTools\"]}       (expect: 127)')
print(f'  admin pages: {d[\"platform\"][\"adminPages\"]}        (expect: 27)')
print(f'  services:    {d[\"services\"]}')
print(f'  memory:      heap={d[\"memory\"][\"heapUsedMB\"]}MB rss={d[\"memory\"][\"rssMB\"]}MB')
print(f'  node:        {d[\"node\"]}            (expect: v20.20.0)')
"
```

### 3.3 TLS / cert verification

```bash
echo | openssl s_client -servername mymentalhealthbuddy.com \
  -connect mymentalhealthbuddy.com:443 2>/dev/null \
  | openssl x509 -noout -dates -subject -issuer
```

Read `notAfter=…`. If the date is < 14 days out, escalate to S1; if < 48 h, escalate to S0.

### 3.4 Quick-reference card

```
S0 GATE (run before everything else, every time)
  curl -sS https://mymentalhealthbuddy.com/crisis \
    | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' \
    | sort -u | wc -l        # must = 5

7-SURFACE TRIAGE
  for ep in "" crisis healthz ready readyz api/health metrics; do
    curl -sS -o /dev/null --max-time 10 \
      -w "/$ep http=%{http_code} size=%{size_download}B ct=%{content_type}\n" \
      "https://mymentalhealthbuddy.com/$ep"
  done

DEPLOY FRESHNESS
  curl -sS https://mymentalhealthbuddy.com/api/health \
    | python3 -c "import sys,json;print(json.load(sys.stdin)['startedAt'])"

SEVERITY MAP
  /crisis broken    → S0
  /healthz multi-region → S0
  /healthz single-region → S1
  TLS < 48h          → S0
  TLS < 14d          → S1
  DB disconnected    → S1 (do NOT redeploy)
  /readyz HTML not JSON → S1 (deploy gap)
  /metrics fail      → S2
```

## 4. Crisis route protection — monitor-specific addendum

The disaster recovery runbook §4 holds the hard rules; this section adds **monitor-specific** requirements.

### 4.1 Mandatory checks

1. **`/crisis` HTTP 200 from ≥ 3 regions** (US, EU, APAC) — every 60 s.
2. **F-33.6 literal count = 5** in response body — every 60 s, same check as above. Failure of either condition is S0.
3. **TLS certificate valid** for the domain serving `/crisis` — every 3600 s.
4. **DNS resolves** to a public IP from ≥ 2 regions — every 300 s. NXDOMAIN at the apex domain hides `/crisis`.

### 4.2 Forbidden monitor configurations

The following monitor configurations look "harmless" but violate the kernel:

- ❌ Monitor `/crisis` for HTTP 200 only, skip literal check → catches uptime, misses content stripping. **Both checks must run.**
- ❌ Monitor `/crisis` with substring-match for only `988` → if a build strips other hotlines but leaves `988`, the false-pass hides a real degradation. **All 5 literals required.**
- ❌ Monitor `/crisis` from a single region (e.g. `us-east-1`) → routing or CDN issue in another region goes undetected. **≥ 3 regions.**
- ❌ Monitor `/crisis` at > 60 s intervals "to save quota" → user-impact window grows linearly with check interval. **60 s max.**
- ❌ Silence the `/crisis` alert during a deploy → the deploy is the most likely cause of `/crisis` degradation; silencing it defeats the purpose. **Never silence S0.**
- ❌ Route the `/crisis` alert to email-only → email is not a 3am paging mechanism. **Must include phone or push.**
- ❌ Set the S0 acknowledgement SLA to > 5 min → eliminates the on-call's ability to mitigate in 10 min. **5 min ack, 10 min mitigate.**

### 4.3 Synthetic transaction (optional but recommended)

Beyond the literal check, a synthetic *transaction* test catches subtler regressions:

| Transaction | Frequency | Severity |
|---|---|---|
| Load `/crisis` via headless browser, assert that all 5 literals are **visible in rendered HTML** (not just in source), click the `988` link, verify it resolves to `tel:988` | 600 s | S1 |
| Load `/`, navigate to `/crisis` via the in-app nav, verify literal count = 5 on the resulting page | 600 s | S1 |

These guard against CSS or JS regressions that hide the literals visually without removing them from source. The 60-second literal check (§4.1) is required regardless; the synthetic transaction is an additional layer.

## 5. Incident rule — restore first, refactor never (during outage)

This rule is **load-bearing** for the entire monitoring stack and is restated here so it cannot be missed:

> **During an active outage, restore the last-known-good state first. Never refactor, redesign, or "improve while we're in there." Refactoring during an outage compounds risk and corrupts forensics.**

### 5.1 What "restore first, refactor never" means in practice

| Situation | Allowed | Forbidden |
|---|---|---|
| `/crisis` degraded, suspect commit identified | Rollback to last `Published your App` checkpoint via Replit Deployments panel | Rewrite the crisis component "better" while the page is down |
| `/api/health` reports DB disconnected | Wait, restart workflow, escalate per disaster recovery runbook §6 | Migrate to a new DB driver mid-incident |
| `/readyz` route handler missing in deployed build | Redeploy after fix lands; verify per disaster recovery runbook §7 | Refactor the readiness module to "make it more testable" |
| Memory leak detected via S2 alert | Open a follow-up phase to investigate after restoration | Patch the leak by `git push` directly to main during the alert |
| `npm audit` shows new critical CVE | Triage in a follow-up phase | Run `npm audit fix --force` during the alert |

### 5.2 The two questions to ask before touching code during an outage

1. **Is the user-facing crisis surface intact right now?** If no → see disaster recovery runbook §4.1, fix that first.
2. **Will this change get the site back faster than rolling back?** If no or uncertain → roll back. The fix lands in a follow-up phase.

If both answers are "yes" and the user has approved the change, then a minimal patch is acceptable. **Smallest valid engine wins** (kernel rule) — CSS fix > config tweak > one-line patch > new function > new module. Never the inverse.

### 5.3 Why this rule exists

Every major outage in software history has a "we tried to fix it and made it worse" subchapter. Refactoring during an incident:

- Corrupts evidence — the failing commit's diff is no longer the smoking gun.
- Compounds risk — you're now debugging two changes at once.
- Burns the on-call's time on the wrong artifact — they should be reading logs, not reviewing your new abstraction.
- Violates the kernel's "circuit breaker" rule — recurring bugs need architectural review, not another patch.

## 6. Coverage matrix — what gets monitored, by surface

| Surface | What's monitored | Frequency | Severity |
|---|---|---|---|
| **Crisis route** (`/crisis` content + reachability) | HTTP 200, F-33.6 literal count = 5, ≥ 3 regions | 60 s | S0 |
| **Liveness** (`/healthz`) | HTTP 200, `ok` body, p95 < 500 ms | 30 s | S1 (multi-region) / S0 (all-region) |
| **Readiness** (`/ready`, `/readyz`) | HTTP 200, JSON regex match | 60 s | S1 |
| **Deep state** (`/api/health`) | HTTP 200, status/db/env/services invariants | 60 s | S1 |
| **SPA shell** (`/`) | HTTP 200, body size ≈ 10,652 B | 120 s | S1 |
| **Metrics** (`/metrics`) | HTTP 200, JSON | 300 s | S2 |
| **TLS** | not-expired, > 14 d remaining | 3600 s | S1 / S0 |
| **DNS** | resolves from ≥ 2 regions | 300 s | S1 |
| **Synthetic transactions** | rendered crisis page + nav round-trip | 600 s | S1 |
| **Deploy freshness** | `startedAt` increments on each deploy | manual / on-deploy | observational |
| **Resource ceilings** | heap < 200 MB, p95 latency < 2 s | derived from /api/health + /metrics | S2 |

## 7. Onboarding checklist for a new monitoring provider

If you adopt or migrate monitoring tools, check off **every item** before declaring the migration complete:

- [ ] S0 crisis check (§1 #1) is wired up with all 5 F-33.6 literals as a single assertion
- [ ] S0 crisis check runs from ≥ 3 geographic regions
- [ ] S0 alerts route to phone or push (not email-only)
- [ ] S0 alerts auto-escalate to a secondary on-call after 5 min unacknowledged
- [ ] S0 alerts cannot be silenced from the UI without a written reason
- [ ] All 6 other endpoint monitors (§1 #2–#7) are wired up with their respective pass criteria
- [ ] TLS expiry monitor wired up with 14-day S1 and 48-h S0 thresholds
- [ ] DNS resolution monitor wired up from ≥ 2 regions
- [ ] Severity decision table (§2.4) translated into provider's terms and documented
- [ ] Manual health-check command (§3) tested by a human and added to on-call runbook
- [ ] Disaster recovery runbook (`docs/operations/DISASTER_RECOVERY_RUNBOOK.md`) is linked from every alert template
- [ ] First fire drill executed (simulated S0 by pointing the monitor at a staging endpoint with a stripped literal); on-call ack'd within 5 min
- [ ] Daily digest configured for S2 alerts
- [ ] All 11 boxes ticked, sign-off recorded in a new phase report

Migration is not complete until **all 13 items above** are checked.

## 8. Change-control

| Action | Required process |
|---|---|
| Add a new endpoint to the monitored set | update §1 + Phase 48 contract registry; new phase report |
| Change a severity assignment | update §2 + §6; new phase report; if downgrading from S0, **governance kernel review required** |
| Change the F-33.6 literal set | **governance kernel review required**; updates ripple to disaster recovery runbook §4 + contract registry §4 + this checklist §1 #1 + §4.1 |
| Change check frequency | update §1, §2.4, §6; new phase report |
| Migrate monitoring providers | full §7 onboarding checklist; phase report on completion |

## 9. References

- Contract registry (source of truth for expected values) → `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Disaster recovery runbook (incident response) → `docs/operations/DISASTER_RECOVERY_RUNBOOK.md`
- Phase 37 (F-33.6 origin) → `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 44 (canary baseline — established the response time / size expectations) → `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 47 (`/readyz` republish lesson — informs §2.4 severity entry) → `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Phase 48 (registry baseline) → `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 49 (immutable snapshot) → `docs/reports/PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`
- Phase 50 (disaster recovery runbook) → `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md`
- Governance Kernel (BHCE Primary Law + circuit breaker) → `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*This checklist is descriptive of today's production contract. When the contract registry changes, this checklist updates with it. When a monitor fires, the disaster recovery runbook drives the response. The S0 crisis check is the load-bearing item; everything else is in service of it.*

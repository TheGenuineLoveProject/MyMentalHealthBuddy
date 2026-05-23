# MMHB Production Incident Severity Matrix

**Baseline established:** 2026-05-23 (Phase 52)
**Production target:** `https://mymentalhealthbuddy.com`
**Authority:** MMHB v7.4 Governance Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Audience:** on-call engineers, incident commanders, anyone making a "how bad is this?" judgment under pressure
**Companion docs (operations triad):**
- Contract registry → `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Disaster recovery runbook → `docs/operations/DISASTER_RECOVERY_RUNBOOK.md`
- Uptime monitoring checklist → `docs/operations/UPTIME_MONITORING_CHECKLIST.md`

---

## 0. Read this first

This matrix is **the single source of truth** for incident severity classification at MMHB. Every monitoring alert, every user-reported issue, every "is this a problem?" question routes through this document.

Three rules govern the entire matrix:

1. **Crisis route degradation is always S0.** Asymmetric risk dominates — kernel BHCE Primary Law.
2. **Rollback before refactor, always, during any active incident.** Refactoring during an outage compounds risk and corrupts forensics.
3. **No `npm audit fix --force` during an incident, ever.** This is a project hard rule that exists because the cure has historically been worse than the disease.

If you find yourself reading the matrix and rationalizing an exception to any of these three, stop and re-read §0. The exceptions you're imagining are the ones that have caused real outages elsewhere.

## 1. Severity ladder — at a glance

| Severity | One-line definition | Ack SLA | Mitigate SLA | Routing |
|---|---|---|---|---|
| **S0** | Crisis surface degraded; users in distress cannot reach hotlines | **5 min** | **10 min** | phone + SMS + push; auto-escalate to secondary in 5 min |
| **S1** | Core platform unhealthy; crisis surface intact | **15 min** | **1 h** | Slack/Discord + email; phone after 30 min if unack'd outside business hours |
| **S2** | Feature regression; not user-blocking, or affecting < 10 % of users | **1 h** | **1 business day** | Slack/Discord + email |
| **S3** | Operational drift; no user impact | **next business day** | **next sprint** | daily digest + dashboard |

The full definitions, triggers, response steps, and exit criteria live in §3–§6. The decision table in §7 lets you classify a new incident in 5 seconds.

## 2. Severity is decided by impact, not by cause

A common error is classifying by what's failing instead of who's affected.

- A misconfigured CSP header that hides hotline links on `/crisis` is **S0** — even though the symptom is "a header is wrong."
- A 500 from `/api/admin/dashboard` that affects 1 internal admin is **S2** — even though the symptom is "a 500."
- A flaky external API that intermittently fails one feature for 3 % of users is **S2** — even though the symptom is "5xx in logs."

Always answer: *Who is affected, and what cannot they do?* Then map to §1.

## 3. S0 — Critical / wake-someone-up

### 3.1 Definition

The user-facing crisis surface is degraded or unreachable. A person in distress cannot reach 988 / 741741 / 911 / Crisis Text Line via MMHB.

This is **the only severity** that pages a human regardless of business hours.

### 3.2 Trigger conditions

Any one of these triggers S0:

- `/crisis` returns HTTP non-200 from any region
- `/crisis` response body is missing any of the 5 F-33.6 literals: `988`, `741741`, `911`, `/crisis`, `Crisis Text Line`
- Same `/crisis` failure (HTTP or literal) observed from ≥ 2 geographic regions (rules out single-region transient blips)
- TLS certificate for `mymentalhealthbuddy.com` expired, or expires in < 48 hours
- DNS for the apex domain returns NXDOMAIN from ≥ 2 regions
- Apex domain (`https://mymentalhealthbuddy.com/`) returns 5xx for > 2 consecutive minutes
- All 7 contract registry endpoints return non-200 simultaneously (full outage)
- Database reports persistent disconnection AND user-facing pages return 5xx
- A deploy ships that strips, hides, or moves any F-33.6 literal from `/crisis` HTML
- Crisis-related feature (the `/crisis` page itself, or a redirect that lands on it) is silently disabled by a feature flag or kill switch

### 3.3 Response steps

| # | Action | Time budget |
|---|---|---|
| 1 | Acknowledge the page | ≤ 5 min from alert |
| 2 | Run disaster recovery runbook §4.1 — confirm crisis surface state with a live curl | ≤ 1 min |
| 3 | Capture evidence: response body + headers + `/api/health.startedAt` for forensics | ≤ 2 min |
| 4 | Decide rollback vs. roll-forward per §4.2 ("the 2-question gate") | ≤ 1 min |
| 5 | Execute disaster recovery runbook §3.1 (full deploy rollback) — preferred path for S0 | ≤ 5 min |
| 6 | Re-verify §4.1 gate post-rollback — F-33.6 literal count = 5, all 7 endpoints PASS | ≤ 2 min |
| 7 | Post status update in incident channel (no users yet — internal first) | — |
| 8 | Continue 24-hour shadow per recovery runbook §7.5 | passive |

**Total mitigation budget: 10 min from ack.**

### 3.4 Crisis route priority

S0 has **absolute priority** over every other incident, every other ongoing change, every other engineering activity. Specifically:

- If S0 fires while you're mid-deploy of an unrelated change, **pause the deploy** and respond.
- If S0 fires while you're mid-investigation of an S1/S2/S3, **drop it** and respond to S0.
- If S0 fires while you're mid-refactor, mid-cleanup, mid-anything, **stop and respond to S0**.
- If two incidents fire simultaneously and one is S0, **S0 first**. The other waits.
- If you cannot decide whether something is S0, **treat it as S0 until proven otherwise**. Asymmetric risk.

### 3.5 Auto-actions during S0

| Action | Allowed? |
|---|---|
| Auto-rollback | ❌ no — humans rollback per disaster recovery runbook §3.1 |
| Silence the alert | ❌ no — S0 alerts cannot be silenced without a written reason in the incident channel |
| Disable the failing endpoint to "stop the bleeding" | ❌ no — `/crisis` cannot be disabled; that's the bleeding |
| Serve a static fallback | ✅ yes — *if* the fallback HTML contains the 5 F-33.6 literals; otherwise no |
| Wake the secondary on-call | ✅ yes — automatic at 5 min unack |

### 3.6 Exit criteria (S0 closed)

All of the following must hold:

- F-33.6 literal count = 5 from ≥ 3 regions
- All 7 contract registry endpoints PASS per `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` §10 canary
- 24-hour shadow window per disaster recovery runbook §7.5 has begun
- Post-mortem started (Phase report drafted; does not need to be complete to exit, but must exist)

## 4. S1 — High / page during business hours, escalate after hours

### 4.1 Definition

Core platform is unhealthy in a way that affects most users, but the crisis surface is intact. Or: a leading indicator of a soon-to-be S0 (TLS expiry in 7 days, etc.).

### 4.2 Trigger conditions

Any one of these triggers S1:

- `/healthz`, `/ready`, `/readyz`, `/api/health`, or `/` returns non-200 for > 2 consecutive minutes
- `/api/health.database.connected: false` (do **not** redeploy — see §4.5)
- `/api/health.status` ≠ `"healthy"`
- Any of `/api/health.services.{stripe, resend, perplexity, sentry}` reports `false`
- TLS certificate for `mymentalhealthbuddy.com` expires in < 14 days (but > 48 hours)
- DNS resolution fails from a single region
- `/readyz` returns 10,652 B HTML instead of the 57 B JSON contract (deploy gap — see Phase 47 precedent)
- Login fails for > 5 % of users
- Mood / journal / chat write endpoint returns 5xx for > 5 % of attempts
- p95 response time for any contract endpoint > 5 s
- New critical CVE published affecting a top-level dependency
- Synthetic transaction test (rendered `/crisis` page, click `988` link) fails

### 4.3 Response steps

| # | Action | Time budget |
|---|---|---|
| 1 | Acknowledge the page | ≤ 15 min |
| 2 | Run disaster recovery runbook §2.1 30-second triage to confirm scope | ≤ 2 min |
| 3 | Run §2.2 forensic check (`/api/health` deep state) | ≤ 2 min |
| 4 | **Verify §4.1 crisis gate** — even though it's S1, the gate must hold | ≤ 1 min |
| 5 | Consult disaster recovery runbook §2.3 pattern table to identify likely cause | ≤ 3 min |
| 6 | Decide: rollback (§3.1) vs roll-forward (§3.2) per §4.2 two-question gate | ≤ 5 min |
| 7 | Execute the decision; capture evidence as you go | ≤ 30 min |
| 8 | Re-verify all 7 endpoints + crisis gate | ≤ 5 min |
| 9 | Status update internally; user-facing comm if outage > 30 min | — |

**Total mitigation budget: 1 h from ack.**

### 4.4 Crisis route priority

The crisis route gate (§4.1 of the runbook — F-33.6 literal count = 5) **must still be verified** before and after any S1 action. S1 is "core unhealthy, crisis intact" — that second clause is a continuous obligation, not a one-time check.

### 4.5 Special case — database disconnected

If `/api/health.database.connected: false`:

- **Do not redeploy.** Redeploys do not fix DB outages and may compound the problem.
- Confirm `DATABASE_URL` is set (do not print its value).
- Check Replit database panel.
- If app cannot connect despite DB healthy, restart the `Start application` workflow.
- If still failing, escalate per disaster recovery runbook §6.
- Schema migrations are **never** an emergency response action. `npm run db:push --force` during an incident is forbidden.

### 4.6 Exit criteria (S1 closed)

All of the following must hold:

- The failing condition no longer triggers per §4.2
- All 7 contract registry endpoints PASS
- Crisis gate verified (F-33.6 = 5)
- p95 response times within registry tolerances
- Post-mortem started

## 5. S2 — Medium / next business day

### 5.1 Definition

A feature regression that affects < 10 % of users, or a non-critical surface degradation, or a slow-burn issue that needs attention but not immediately.

### 5.2 Trigger conditions

Any one of these triggers S2:

- A single non-critical endpoint returns 5xx for a subset of requests (< 10 %)
- One external service degraded but not failed (e.g. Stripe responding slowly)
- p95 response time degrades by 2× but stays < 5 s
- A single feature flag change has unexpected behavior (non-crisis flag)
- A user-reported bug affecting one workflow with a known workaround
- Email delivery (Resend) reports degraded throughput
- Admin pages return 5xx (affects internal staff only, not public users)
- `/api/health.platform.totalRoutes` drifts by ± 5 from baseline (currently 127)
- `/api/health.memory.heapUsedMB` exceeds 200 (current baseline ~43)
- New high-severity (not critical) CVE published affecting a transitive dependency

### 5.3 Response steps

| # | Action | Time budget |
|---|---|---|
| 1 | Acknowledge during business hours | ≤ 1 h |
| 2 | Reproduce the issue (curl, browser, headless transaction) | ≤ 30 min |
| 3 | Verify crisis gate still holds | ≤ 1 min |
| 4 | Identify suspect commit or external cause | ≤ 1 h |
| 5 | Open a phase to scope the fix; assess rollback vs roll-forward | ≤ 30 min |
| 6 | Execute the fix (smallest valid engine wins — kernel rule) | ≤ 1 business day |
| 7 | Verify per disaster recovery runbook §7 | — |

**Total mitigation budget: 1 business day from ack.**

### 5.4 Crisis route priority

S2 incidents do not directly threaten the crisis route, but the §4.1 gate should be verified before and after any change as a matter of standard practice. An S2 fix that accidentally strips an F-33.6 literal **immediately becomes S0**.

### 5.5 Exit criteria (S2 closed)

- The reproduction no longer occurs
- Affected users can use the feature again
- Crisis gate verified
- Post-mortem written (full report, not just a draft)

## 6. S3 — Low / next sprint

### 6.1 Definition

Operational drift, technical debt accumulation, monitoring artifacts that don't indicate user impact. The kind of thing that goes in the backlog and is addressed in a planned phase, not an unplanned response.

### 6.2 Trigger conditions

Any one of these triggers S3:

- `/metrics` endpoint returns 5xx (operational signal, not user-facing)
- A new moderate CVE published affecting a deep transitive dependency
- npm audit moderate count increments by 1 (current baseline: 6 moderate)
- A monitoring alert fires intermittently with no user-visible correlate
- Documentation drift detected (e.g. contract registry doesn't match observed behavior, but observed behavior is correct)
- Log warning patterns increase by < 2× from baseline
- Deploy freshness check reports `startedAt` older than expected but app is healthy (deploy didn't restart but doesn't need to)
- HSTS duplicate-header observation, dev artifact debris, similar harmless artifacts

### 6.3 Response steps

| # | Action | Time budget |
|---|---|---|
| 1 | Log the item in the next sprint planning | next business day |
| 2 | Open a phase or task to address it within the next sprint | within 2 weeks |
| 3 | Verify crisis gate still holds (standard practice) | — |
| 4 | Execute the planned fix per the smallest-valid-engine principle | within next sprint |
| 5 | Verify and close the phase | — |

**Total mitigation budget: next sprint.**

### 6.4 Crisis route priority

S3 items do not threaten the crisis route. Standard verification practice still applies — every code-touching phase verifies the §4.1 gate as part of the standard recovery success criteria.

### 6.5 Exit criteria (S3 closed)

- Phase or task that addresses the item is complete
- The trigger condition no longer fires
- Phase report written

## 7. Severity decision table (use this under pressure)

| Symptom | Severity |
|---|---|
| `/crisis` returns non-200 | **S0** |
| Any F-33.6 literal missing from `/crisis` | **S0** |
| Multi-region `/crisis` failure | **S0** |
| TLS expires < 48 h | **S0** |
| Multi-region DNS NXDOMAIN | **S0** |
| All 7 endpoints down simultaneously | **S0** |
| Crisis feature silently disabled by a flag | **S0** |
| `/healthz` or `/api/health` non-200 single region | S1 |
| `/healthz` or `/api/health` non-200 multi-region | S0 (full outage) |
| `/api/health.database.connected: false` | S1 (do NOT redeploy) |
| Any external service (`stripe`/`resend`/`perplexity`/`sentry`) reports `false` | S1 |
| TLS expires 48 h – 14 d | S1 |
| Single-region DNS NXDOMAIN | S1 |
| `/readyz` returns 10,652 B HTML (deploy gap, `/ready` works) | S1 |
| Login fails for > 5 % of users | S1 |
| New critical CVE in top-level dep | S1 |
| Single endpoint 5xx for < 10 % requests | S2 |
| External service degraded but responding | S2 |
| p95 latency 2× baseline (< 5 s) | S2 |
| Admin-only page broken | S2 |
| `/api/health.platform.totalRoutes` drift ± 5 | S2 |
| Memory `heapUsedMB` > 200 | S2 |
| New high (not critical) CVE | S2 |
| `/metrics` endpoint failure | S3 |
| New moderate CVE | S3 |
| Intermittent alert with no user impact | S3 |
| Doc drift | S3 |
| Log warnings up < 2× | S3 |
| Deploy didn't restart but app healthy | S3 |

When in doubt, **classify one level higher** — false-positive cost is small, false-negative cost is unbounded.

## 8. Rollback-first rule

**This rule applies to every severity, every incident, every time.**

> During an active incident, the first option considered must be: **roll back to the last-known-good state**. Other options are evaluated only if rollback is not faster, not safer, or not possible.

### 8.1 The 2-question gate (apply before any code change during an incident)

1. **Is the user-facing crisis surface intact right now?**
   - No → fix that first per S0 response (§3.3)
   - Yes → proceed to question 2
2. **Will this change get the site back faster than rolling back?**
   - No or uncertain → roll back; the fix lands in a follow-up phase
   - Yes, with high confidence → minimal patch is acceptable

If both answers are "yes" and the user has approved the change, a **minimal patch** is acceptable. Smallest valid engine wins (kernel rule): CSS fix > config tweak > one-line patch > new function > new module. Never the inverse during an incident.

### 8.2 What "rollback" means here

- **Preferred:** Replit Deployments panel → previous `Published your App` checkpoint
- **Fallback (if checkpoint system unavailable):** see disaster recovery runbook §3.1 for snapshot-as-reference path
- **Forbidden:** `git reset --hard`, `git push --force`, `git rebase` on `main` — these are blocked and unsafe

### 8.3 Why this rule exists

Every major outage in software history has a "we tried to fix it and made it worse" subchapter. During an incident:

- The failing change is the most likely culprit; reverting it has the highest probability of restoring service.
- A roll-forward "fix" introduces a second variable — you're now debugging two changes at once.
- Rollback preserves forensics; the failing commit's diff remains the smoking gun for the post-mortem.
- Rollback respects the kernel's "circuit breaker" rule — recurring failures need architectural review, not another patch.

## 9. No unsafe emergency refactors

**This rule applies to every severity, every incident, every time.**

> During an active incident, do not refactor, redesign, rewrite, or "improve while we're in there." Address the immediate symptom with the smallest viable patch (or roll back). Refactoring waits for a planned phase.

### 9.1 What counts as a refactor and is forbidden during an incident

| Action | Why forbidden during an incident |
|---|---|
| Rename a function, file, class, or variable | introduces noise into the diff; the post-mortem becomes harder to read |
| Restructure module boundaries | corrupts the audit trail; future bisects fail |
| "Tidy up" adjacent code while fixing the bug | mixes the fix with unrelated changes; cannot revert in isolation |
| Migrate to a new library, framework, or API | maximum risk during minimum-information moment |
| Add abstraction layers ("this would be more testable if…") | testability is a planning concern, not an incident concern |
| Optimize an unrelated path | premature; can wait |
| Update comments / docs beyond the change itself | the doc update is a separate phase |
| Apply a code style or linter fix | belongs in a code-quality phase |
| Bump a dependency version "while we're here" | unbounded blast radius |
| Restructure the failing handler to be "more elegant" | the failure was elegance-independent; elegance is not the fix |

### 9.2 What is allowed during an incident

| Action | Constraints |
|---|---|
| Revert the specific failing commit | preferred over a forward patch |
| One-line bug fix targeting the failing condition | must be smallest valid engine; must verify per recovery runbook §7 |
| Restart the workflow / redeploy current commit | if app needs to be re-bound (e.g. lost DB connection) |
| Configuration change (env var, feature flag) | only if scoped to the failing behavior |
| Adding more observability (logging) to diagnose | only if logging itself is not a P0/P1 risk; never logs containing user data |

### 9.3 Why this rule exists

- Two changes at once obscures which one fixed (or broke) the situation.
- Refactor risk is unbounded; you cannot reason about its blast radius under pressure.
- The on-call's job during an incident is **restoration**, not improvement.
- The post-mortem becomes incoherent; the diff contains the bug fix, the refactor, and possibly an accidental regression that the refactor introduced.
- Kernel rule: smallest valid engine wins — refactor is never the smallest valid engine.

## 10. No `npm audit fix --force` during an incident

**This is a project-level hard rule. It applies regardless of severity, regardless of urgency.**

> `npm audit fix --force` is a breaking-change operation. It can — and historically has — broken production. It is **never** an incident response action.

### 10.1 What's forbidden

- `npm audit fix --force` — at any severity
- `npm audit fix` — at S0 / S1 (allowed at S2/S3 only as part of a planned phase, with user approval and verification)
- `npm update` — at any severity during an incident
- `npm install <package>@latest` — at any severity during an incident
- `npm install` with a deleted `package-lock.json` to "regenerate from scratch" — at any severity
- Manual edits to `package.json` `dependencies` or `devDependencies` — at any severity during an incident
- Manual edits to `package-lock.json` — at any severity, ever (kernel forbidden-file)
- Switching package managers (npm → pnpm/yarn) during an incident — at any severity

### 10.2 What's allowed

- Reading `package.json`, `package-lock.json`, npm audit output as forensic input
- Running `npm ls --depth=0` to capture the current dep tree (read-only)
- Running `npm audit --json` to capture the current vulnerability posture (read-only)
- Restarting the workflow (does not change deps)
- Rolling back to a previous checkpoint where the dep state was healthy

### 10.3 If a CVE is the root cause of the incident

This is the case that tempts an exception. Resist the temptation.

- If a critical CVE is actively being exploited against MMHB, that is itself a security incident at **S1 or S0** (depending on user impact) — escalate to security response, not to `npm audit fix`.
- The fix is: identify the affected package, pin to a known-safe version in a **planned phase** with user approval and full verification.
- Rolling back to a pre-vulnerable dep state may be the immediate mitigation. The dep upgrade itself is a follow-up.
- Even when the user approves an emergency dep change, it must be **the minimum** change (one package, pinned, with a tested upgrade path) — not an `npm audit fix --force`.

### 10.4 Why this rule exists

- `npm audit fix --force` accepts breaking-change major-version bumps; it has shipped production-breaking changes silently.
- npm's vulnerability database has false positives; "auto-fix" sometimes "fixes" non-problems and introduces real regressions.
- During an incident you cannot reason about the cross-dep blast radius of a forced upgrade.
- The project's S0 HOLD security posture (6 moderate / 0 high / 0 critical, baseline since Phase 41) is **intentional** — the moderates are accepted risk after evaluation; auto-fixing them introduces unknown risk.

## 11. Cross-cutting rules (apply to all severities)

1. **Always verify the crisis gate** before and after every action (`docs/operations/UPTIME_MONITORING_CHECKLIST.md` §3.1).
2. **Always capture evidence** — `curl -i`, `/api/health` body, log excerpt — before mutating anything.
3. **Always update status** in the incident channel; silence is not communication.
4. **Always write a post-mortem** — at least a draft before the incident is closed; full report within 1 week.
5. **Never edit forbidden config files** (`.replit`, `vite.config.ts`, `drizzle.config.ts`) during an incident; these are governance-locked.
6. **Never edit production data ad-hoc**; data fixes go through a planned phase with user approval.
7. **Never disable security middleware** (helmet, CSP, HSTS, rate limit) to "unblock" something; root-cause first.
8. **Never claim "resolved" without verification** — disaster recovery runbook §7 (canary + 10 invariants + browser smoke + 24-h shadow) is the gate.

## 12. Severity downgrade / upgrade rules

| Transition | Required process |
|---|---|
| S2 → S3 | informal — note in incident channel with reason |
| S1 → S2 | requires evidence the user impact is < 10 %; documented in incident channel |
| S2 → S1 | upgrade is always informal — anyone can upgrade |
| S1 → S0 | upgrade is always informal — anyone can upgrade |
| S0 → S1 | **governance kernel review required** — only after F-33.6 gate verified live |
| Any → 0 (close) | recovery exit criteria (§3.6 / §4.6 / §5.5 / §6.5) all satisfied |

**Upgrades are always free; downgrades require evidence.** This is the asymmetric-risk principle applied to classification itself.

## 13. Change-control for this matrix

| Action | Required process |
|---|---|
| Add a new symptom row to §7 decision table | doc-only PR; reference the incident or analysis that produced it |
| Change an SLA (ack or mitigate) | requires Sr review; tie to a phase report with evidence |
| Add a new trigger condition to S0 | informal — adding S0 triggers is always free |
| Remove or weaken an S0 trigger | **governance kernel review required**; cannot proceed without it |
| Modify the rollback-first rule (§8) | **governance kernel review required**; this is a load-bearing operational invariant |
| Modify the "no emergency refactor" rule (§9) | **governance kernel review required** |
| Modify the "no `npm audit fix --force`" rule (§10) | **governance kernel review required**; this is a project hard rule beyond just operations |

## 14. References

- Contract registry → `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Disaster recovery runbook → `docs/operations/DISASTER_RECOVERY_RUNBOOK.md`
- Uptime monitoring checklist → `docs/operations/UPTIME_MONITORING_CHECKLIST.md`
- Phase 37 (F-33.6 origin) → `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 41 (security S0 HOLD baseline) → `docs/reports/PHASE_41_SECURITY_LOCKDOWN.md`
- Phase 44 (canary baseline) → `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 47 (republish gap precedent — anchors §4.2 deploy-gap row) → `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Phase 48 (contract registry baseline) → `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 49 (immutable snapshot) → `docs/reports/PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`
- Phase 50 (disaster recovery runbook) → `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md`
- Phase 51 (uptime monitoring checklist) → `docs/reports/PHASE_51_UPTIME_MONITORING_CHECKLIST.md`
- Governance Kernel → `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*This matrix is descriptive of the current operational state and the kernel contracts that govern it. When the kernel changes, this matrix updates with it. When an incident is misclassified, the post-mortem updates §7. The four severity tiers exist to make decisions fast under pressure; the three load-bearing rules (rollback-first, no-emergency-refactor, no-audit-fix-force) exist to prevent the failure modes that have caused real outages elsewhere.*

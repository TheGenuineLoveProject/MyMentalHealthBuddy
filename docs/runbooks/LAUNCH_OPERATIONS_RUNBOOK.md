# MMHB Launch Operations Runbook

**Status:** Active
**Last updated:** 2026-05-22 (Phase 27)
**Owner:** Engineering on-call
**Companion docs:** `docs/runbooks/pagerduty.md`, `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

This runbook is the operational playbook for taking MMHB from steady-state to live launch traffic, and for handling the most common production incidents in the first 72 hours. It is documentation only — every action below maps to an existing tool, env-var, or panel toggle. No new code paths are introduced.

---

## 0. Read this first

- **Primary law:** healing flows never contain business logic; business flows never contain healing prompts. If a runbook step would violate this, stop and escalate to architecture review (MMHB v7.4 Archival Kernel, §1).
- **BHCE override:** any explicit self-harm signal during an incident → confirm `/crisis`, 988, 741741, and 911 routing is reachable **before** continuing any other work. Asymmetric risk: err toward resource provision.
- **Smallest valid engine wins:** CSS fix > React patch > new component > new page > new service. Never reach for a bigger engine to fix a smaller problem under launch pressure.
- **DRY-RUN FIRST.** No destructive action without an explicit dry-run output reviewed by a second engineer.
- **Replit-safe execution only.** No Docker, no virtualenvs, no manual SQL migrations. Use `npm run db:push` for schema, the workflows panel for restarts, and the secrets panel for credentials.

---

## 1. Pre-launch checklist (T-24h)

Run each of these and record the result in the launch log. Stop and resolve any ❌ before continuing.

### 1.1 Build & probe gate

| Check | Command | Pass criteria |
|---|---|---|
| Production build | `npm run build` | exit 0, build duration < 90s |
| Server boot | `Start application` workflow → restart | `[ready]` log line within 10s |
| Liveness probe | `curl -s -o /dev/null -w "%{http_code}" $REPLIT_DEV_DOMAIN/healthz` | `200` |
| Readiness probe | `curl -s -o /dev/null -w "%{http_code}" $REPLIT_DEV_DOMAIN/readyz` | `200` |
| `/crisis` route | `curl -s -o /dev/null -w "%{http_code}" $REPLIT_DEV_DOMAIN/crisis` | `200` |
| Apex domain | `curl -s -o /dev/null -w "%{http_code}" https://mymentalhealthbuddy.com/` | `200` |
| www domain | `curl -s -o /dev/null -w "%{http_code}" https://www.mymentalhealthbuddy.com/` | `200` |

### 1.2 Bundle budget gate (Phase 24 contract)

| Check | Threshold | Source |
|---|---|---|
| Initial critical path (gz) | ≤ 150 KB | `client/dist/assets/index-*.js` + `vendor-react-*.js` |
| Largest single JS chunk (raw) | ≤ 350 KB | `find client/dist/assets -name "*.js" -exec ls -la {} \;` |
| Main CSS (gz) | ≤ 100 KB | `client/dist/assets/index-*.css` |
| Source maps in public dist | 0 | `find client/dist -name "*.map" \| wc -l` |
| Vendor chunks (named) | 8 | `ls client/dist/assets/vendor-*.js \| wc -l` |

### 1.3 Static asset gate (Phase 26 contract)

| Check | Threshold |
|---|---|
| Total `client/dist` | ≤ 50 MB |
| Font external CDN deps | 0 (must be 100% self-hosted woff2) |
| `/crisis` static assets reachable | `curl` each og-image / favicon → `200` |

### 1.4 Secrets & env gate

Verify presence (do NOT print values):
- `ADMIN_TOKEN`
- `JWT_SECRET`
- `DATABASE_URL`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `PERPLEXITY_API_KEY`
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS`

Use the Replit secrets panel. If any is missing, request from the user via the environment-secrets flow. Never paste secrets into code or logs.

### 1.5 Governance gate

- `replit.md` Governance Kernel block present and unchanged.
- `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` present.
- No uncommitted Phase 21–26 reports.
- `git --no-optional-locks status` clean.

---

## 2. Launch sequence (T-0)

Execute strictly in order. Do not parallelize.

1. **Freeze main.** Announce in chat: "MMHB launch window open — no merges to main until further notice."
2. **Tag release.** From Shell tab: `git tag -a v1.0.0 -m "MMHB public launch"` then `git push origin v1.0.0`.
3. **Deploy.** Use the Publishing flow (`suggest_deploy`) — Replit handles build, hosting, TLS, health checks. Do not invoke a separate Dockerfile or external CI.
4. **Smoke test (post-deploy, against the published `.replit.app` or apex domain):**
   - `GET /` → 200, HTML contains `<title>`
   - `GET /crisis` → 200, contains "988" and "741741"
   - `GET /healthz` → 200
   - `GET /readyz` → 200
   - `GET /api/health` → 200 (or whatever the canonical api liveness route is)
5. **Verify analytics & observability:**
   - First event visible in observability backend within 60s.
   - No `ERROR`-level lines in deployment logs (use `fetch_deployment_logs`).
6. **Open the launch channel** and post: "MMHB v1.0.0 live at https://mymentalhealthbuddy.com."

---

## 3. First 72 hours — monitoring rotations

### 3.1 On-call rotation

- **Primary:** 8h shifts. PagerDuty per `docs/runbooks/pagerduty.md`.
- **Secondary backup:** 24h shifts, called only on Primary no-ack within 5 min.
- **Architecture escalation:** Owner of `replit.md` governance kernel.

### 3.2 Hourly health pulse (first 24h)

Run from Shell tab, log result in launch log:

```bash
for path in / /crisis /healthz /readyz; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://mymentalhealthbuddy.com${path}")
  echo "${path} -> ${code}"
done
```

All four must return `200`. Any non-200 → see §4.

### 3.3 Deployment log scan (every 4h, first 72h)

Use `fetch_deployment_logs` with `message="ERROR|FATAL|Exception|timeout"`. Any non-zero match → triage per §4.

### 3.4 Crisis routing audit (daily, first 7 days)

Confirm on each surface:
- `/crisis` link present in global footer
- "If you are in crisis" disclosure on any wellness/AI surface
- 988, 741741, 911 numbers visible and correct

---

## 4. Incident playbooks

Use the **smallest valid engine** that fixes the symptom. Never reach for a larger engine without exhausting the smaller one.

### 4.1 Site down — apex returns 5xx

1. Check Replit deployment status panel.
2. `fetch_deployment_logs` last 5 min, look for the first `ERROR` / stack trace.
3. **If recent deploy:** roll back via Replit deployment history (single click). Do NOT attempt a hot-patch under fire.
4. **If no recent deploy:** check DB connectivity (`SELECT 1` via the database panel, production environment, read-only).
5. **If DB healthy:** restart `Start application` workflow.
6. Verify with §3.2 hourly pulse before declaring resolved.

### 4.2 Site up but slow (TTFB > 2s)

1. Use `fetch_deployment_logs` with `message="slow|timeout|p99"`.
2. Check observability dashboard for hot endpoints.
3. **Do not** add caching or refactor under pressure. Capture data, file as TODO-postlaunch, restart workflow if CPU/memory saturated.

### 4.3 Auth flow broken

1. Verify `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` present in secrets panel.
2. Test OAuth callback URL matches deployed domain in GitHub OAuth app settings.
3. If callback URL drifted, update in GitHub OAuth app (NOT in code) and re-test.
4. Do NOT modify auth code under pressure — this is a governance kernel red zone (auth touched = architecture review required).

### 4.4 Database degradation

1. Production DB queries via the database skill, `environment: "production"`, **read-only** until a write is explicitly approved.
2. If a schema mismatch is reported (`column does not exist`, `relation does not exist`), apply via `npm run db:push` against production per the database skill — never write raw SQL migrations.
3. Capture before/after row counts on any write.

### 4.5 Crisis routing failure (BHCE override)

**Highest priority.** If `/crisis` returns non-200, or the 988 / 741741 / 911 disclosures are missing or incorrect anywhere on a wellness surface:

1. **Immediately** post a static fallback banner at the global layout level pointing to 988 (text/voice) and 741741 (text "HOME").
2. Rollback the offending deploy if the regression is recent.
3. Do NOT proceed with any other work — including unrelated bug fixes — until crisis routing is restored end-to-end and verified on the affected surface(s).
4. Post-incident: file a Phase-numbered report under `docs/reports/` documenting cause and prevention.

### 4.6 Asset / image 404 storm

1. Verify build artifact actually contains the asset (`find client/dist -name "<basename>"`).
2. If absent: rebuild and redeploy — likely a stale cache or interrupted publish.
3. If present but 404: check CDN / Replit static-serving config in the deployment panel.

---

## 5. Rollback procedure

1. Replit deployment history → select last known-good version → "Restore".
2. Wait for restore to complete (panel turns green).
3. Run §3.2 hourly pulse + §2 step-4 smoke test against the restored deploy.
4. Post in launch channel: "Rolled back to <version> due to <symptom>. Triage continues out-of-band."
5. The original failing deploy artifact stays available for post-mortem — do NOT delete.

---

## 6. Communication templates

### 6.1 Status update (every 4h, first 72h)

```
MMHB launch status — <hh:mm UTC>
Uptime: <healthy | degraded | down>
Errors last 4h: <count> (top: <message>)
TTFB p95: <ms>
Active incidents: <none | INC-#>
Next update: <hh:mm UTC>
```

### 6.2 Incident open

```
[INC-#] <one-line symptom>
Started: <hh:mm UTC>
Impact: <e.g. all /api/wellness POSTs returning 503>
Severity: <P0 | P1 | P2>
Lead: <name>
Updates in this thread.
```

### 6.3 Incident resolved

```
[INC-#] RESOLVED at <hh:mm UTC>
Root cause: <one sentence>
Fix: <one sentence — what changed>
Customer impact window: <duration>
Post-mortem: <link to docs/reports/POST_MORTEM_INC_#.md within 48h>
```

---

## 7. Post-launch (T+72h → T+14d)

- Daily: §3.4 crisis routing audit.
- Weekly: re-run Phases 23 (perf baseline) and 24 (bundle budget) and compare against pre-launch numbers. Any regression → file a Phase-numbered TODO.
- T+14d: cut a `v1.0.x` patch release if any in-flight TODOs from the Phase 21–26 deferred list have been addressed.
- T+30d: archive the launch log to `docs/reports/LAUNCH_LOG_v1.0.0.md`.

---

## 8. References

- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Architecture: `docs/architecture.md`
- Changelog: `docs/changelog.md`
- PagerDuty: `docs/runbooks/pagerduty.md`
- Phase reports: `docs/reports/PHASE_21_*` through `PHASE_26_*`
- Probe routes: `docs/reports/probe-routes.md`
- Public surface: `docs/reports/public-surface-audit.md`

---

*This runbook is operational documentation. No code or configuration was modified to produce it. All commands referenced are read-only or correspond to existing panel toggles, workflow restarts, or established Phase-21-through-26 patterns.*

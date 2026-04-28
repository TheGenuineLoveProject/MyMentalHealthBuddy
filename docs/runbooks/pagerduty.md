# Runbook — PagerDuty Alerting

> **Owner:** MMHB Platform / On-call
> **Module:** `server/observability/alerter.mjs` + `server/observability/safetyAlerts.mjs`
> **Admin endpoints:** `/api/admin/observability/{tracing,alerter,health}` and `POST /api/admin/observability/alerter/test`
> **Created:** Week 2 of the 90-Day Foundation Sprint

---

## What this is

A thin, always-safe-to-call alert dispatcher built on PagerDuty Events API v2. Every safety-critical code path imports a typed wrapper from `safetyAlerts.mjs` (e.g. `alertCrisisPipelineFailure`, `alertWebhookSignatureFailure`, `alertPHQ9EscalationFailure`) — never `alerter.mjs` directly. This keeps the alert taxonomy consistent.

Every call:
- **Always logs** at `warn` level via the structured logger (operators get a record even if PagerDuty is unconfigured)
- **Dedups locally** for 5 minutes per (severity, dedupKey) pair
- **Falls back to no-op + log** if `PAGERDUTY_ROUTING_KEY` is unset
- **Dry-runs in non-prod** unless `ALERTS_FORCE=true` is set

The dispatcher is **never allowed to throw** — call sites wrap it in `void` and forget. A failure to alert is itself logged as an error but does not propagate.

---

## Configuration

### Required for live paging
| Env var | Required? | Default | Effect |
|---|---|---|---|
| `PAGERDUTY_ROUTING_KEY` | Yes (for live paging) | unset | Integration key from a PagerDuty service's "Events API v2" integration. **Treat as a secret.** |
| `NODE_ENV` | Yes | `development` | Must be `production` to actually page (unless `ALERTS_FORCE=true`). |

### Optional tuning
| Env var | Default | Effect |
|---|---|---|
| `ALERTS_ENABLED` | `true` | Set to `false` for dry-run-with-logs even in prod (e.g. during a noisy incident). |
| `ALERTS_FORCE` | `false` | Set to `true` to force pages from non-prod (testing the wiring end-to-end). Use sparingly. |
| `ALERT_DEDUP_WINDOW_MS` | `300000` (5 min) | Local dedup window per (severity, dedupKey). |

---

## How to set up PagerDuty (one-time, ~5 minutes)

1. **PagerDuty → Service Directory → New Service**
   - Name: `MMHB Production`
   - Escalation policy: your existing 24/7 policy (or create one)
   - Alert grouping: `Intelligent` (recommended) or `Time-based 5 min`
2. **Add an integration** → Events API v2 → name it `mmhb-events-api`. Copy the **Integration Key** (32-char hex).
3. **Add the key as a Replit secret:** `PAGERDUTY_ROUTING_KEY = <integration-key>`
4. **Verify** with the synthetic test endpoint (see "Verify the wiring" below).
5. **Recommended**: create a second service for `MMHB Staging` with a separate routing key, gated on a different env var if/when staging exists.

---

## Verify the wiring

```bash
# Replace with your admin token
ADMIN=$(echo -n "admin@example.com:$ADMIN_TOKEN" | base64)

# 1. Read the current state
curl -s -H "Authorization: Basic $ADMIN" \
  https://<your-host>/api/admin/observability/health | jq

# Expected when configured + prod:
# { "ok": true,
#   "tracing":  { "enabled": true,  "reason": "started",  "exporter": "noop" },
#   "alerter":  { "configured": true, "enabled": true, "reason": "live", "degraded": false } }

# 2. Fire a synthetic test alert (info severity)
curl -s -X POST -H "Authorization: Basic $ADMIN" \
  https://<your-host>/api/admin/observability/alerter/test | jq

# Expected: { "ok": true, "mode": "sent", ... }
# Then: open PagerDuty — you should see an "info" event titled
# "MMHB synthetic test alert (admin-triggered, ignore)".
# Resolve it manually; the dedupKey is unique per call so it won't auto-dedup.
```

If the alerter says `mode: "dry-run-non-prod"`, set `ALERTS_FORCE=true` for the verification call only, then unset.

---

## Alert taxonomy (what pages, when, why)

| Wrapper | Severity | Dedup window | What it means | First responder action |
|---|---|---|---|---|
| `alertCrisisPipelineFailure` | **critical** | 5 min per stage | The crisis-detection short-circuit failed at one of its stages (rule match, ML stub, LLM reasoner). User-facing crisis routing may be degraded. | Page on-call; check `/api/admin/observability/health`; check `server/ai/safety/crisis.mjs` logs; if the failure is in the LLM reasoner, traffic still routes via rules layer — verify by looking at recent `awareness_detections` rows. |
| `alertPHQ9EscalationFailure` | **critical** | 5 min per session | PHQ-9 item-9 (suicidal ideation) was answered ≥1 but the escalation event failed to deliver. **The user may be in crisis right now.** | Page on-call **immediately**; manually verify the user has `/crisis` deep link; check `protocol_sessions` row for `escalated_at`; consider out-of-band contact if user has consented. |
| `alertConstitutionalViolation` | **critical** | 5 min per rule | The agent orchestrator's constitutional gate triggered — model output violated an inviolable rule (no diagnosis, no impersonation, no payment requests, crisis routing, educational voice). | Page on-call; the gate already blocked the output, so no user-facing harm — but a recurring trigger means a regression in prompt or model behaviour. Inspect `agent_decisions.outcome` for the violating decision. |
| `alertSchemaFailure` | **critical** | 5 min per stage | `ensureSchema()` or boot-time integrity check failed. App may be running with degraded schema. | Page on-call; check boot logs; rollback to prior deploy if the failure correlates with a deploy. |
| `alertWebhookSignatureFailure` | error | 5 min per provider | Stripe (or other) webhook signature verification failed. Could be attack, could be rotated secret. | Triage during business hours; check Stripe dashboard for the webhook endpoint's recent attempts; verify `STRIPE_WEBHOOK_SECRET` matches the active webhook signing secret. |
| `alertBiometricIngestionFailure` | error | 5 min per (provider, stage) | OAuth callback, normalizer, or encryption-at-rest failed for a biometric provider. PHI-adjacent. | Triage during business hours; check `biometric_connections` row for the affected user; verify provider OAuth secret hasn't expired. |
| `alertUncaught` | error | 5 min per kind | Process-level uncaught exception or unhandled promise rejection. The existing `process.on('uncaughtException', ...)` handler in `app.mjs` already logs — this gives PagerDuty visibility for the same class. | Triage; correlate with request logs by timestamp; if recurring, file a bug. |

---

## Wiring checklist for new safety-critical code paths

When you write code that touches a safety-critical surface, you **must** decide whether a failure there warrants paging. Defaults:

- Anything that could fail to route a user to `/crisis` → **critical**, page on-call.
- Anything that could fail to apply a paid-subscription entitlement after a successful Stripe charge → **error**, triage in business hours.
- Anything that could fail to encrypt PHI-adjacent data at rest → **error**, triage in business hours.
- Anything that could leak PII in logs or responses → **critical**, page on-call.
- Anything that could fail to enforce the constitutional gate → **critical**, page on-call.

Add a new wrapper in `safetyAlerts.mjs` rather than calling `sendAlert` directly. Keep dedupKeys short, stable, and low-cardinality (e.g. `crisis-pipeline:${stage}` not `crisis-pipeline:${requestId}`).

---

## Troubleshooting

### `alerter.lastError` shows a 401 from PagerDuty
The routing key is wrong (typo, or copied from a different integration). Verify in PagerDuty UI → Service → Integrations → Events API v2 → Integration Key.

### `alerter.lastError` shows a 429 from PagerDuty
Rate-limited. PagerDuty Events API v2 limit is 120 events/minute per routing key. The local dedup should make this nearly impossible — if you see it, you have an alert storm. Investigate the call site.

### `alerter.configured = true` but `enabled = false`
`ALERTS_ENABLED=false` is set somewhere. Probably an operator silenced it during an incident. Re-enable when the incident is resolved.

### Test alert returns `mode: "dry-run-non-prod"`
You're not in `NODE_ENV=production` and `ALERTS_FORCE` is not set. This is correct, expected, and prevents you from paging the on-call rotation from a dev container. Set `ALERTS_FORCE=true` only for a single verification call, then unset.

### No PagerDuty event but `mode: "sent"`
Check PagerDuty's Events API explorer (Profile → API Access). Sometimes events are dropped if the integration was deleted from the service. Re-add the Events API v2 integration and update the secret.

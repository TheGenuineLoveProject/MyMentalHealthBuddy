# Behavior Events — Funnel Analytics

Single source of truth for user-behavior telemetry on the launch surface.

## Pipeline

```
client/src/pages/Start.tsx
  └─ track(type, metadata)
        └─ POST /api/telemetry/event
              └─ server/routes/telemetry.mjs
                    └─ logEvent({type, guestId, metadata})  [server/ai/aiTelemetry.mjs]
                          └─ append JSONL → logs/events.jsonl
```

- Whitelist enforced server-side. Unknown event types are silently dropped.
- Fail-silent at every layer — telemetry can never break the UI or the AI flow.
- No message body is ever sent or logged. No crisis text is ever logged.

## Event Whitelist

| # | Event | Where it fires | Metadata |
|---|---|---|---|
| 1 | `start_page_click` | `/start` mount | — |
| 2 | `first_tool_selected` | user taps Calm Me Down / Help Me Think / Understand This Feeling | `{ tool }` |
| 3 | `first_response_success` | AI replied without crisis flag | `{ button, toolId }` |
| 4 | `streak_incremented` | check-in returned `incremented:true` | `{ day }` |
| 5 | `paywall_shown` | `PaywallCard` mounted | `{ reason }` |
| 6 | `paywall_clicked` | upgrade or dismiss button | `{ reason, action }` |
| 7 | `share_clicked` | Share button used after relief | `{ method: "native" \| "clipboard" }` |
| 8 | `return_user_detected` | `/api/streaks/me` reports `daysAway >= 2` on mount | `{ daysAway, currentStreak }` |

## Allowed Metadata Keys

Only these keys may appear in `metadata`:

- `tool`, `toolId`, `button`, `module` — feature identifiers
- `day`, `daysAway`, `currentStreak` — streak state
- `reason` — paywall reason (`value_proven`, `daily_limit`, `premium_feature`)
- `action` — paywall button (`upgrade`, `dismiss`)
- `method` — share path (`native`, `clipboard`)

Never log: message text, AI reply, crisis content, names, emails, IPs.

## Identity

`guestId` is a sanitized client-generated id (alphanumeric + `_-`, max 64 chars). Authenticated users still send `guestId`; backend correlates separately when needed.

## Funnel Drop-Off Diagnostic

Tail the log and look for missing transitions:

```bash
tail -n 200 logs/events.jsonl | jq -c '{type, guestId}'
```

| Drop-off | Likely fix |
|---|---|
| `start_page_click` → no `first_tool_selected` | Hero copy or tool buttons unclear |
| `first_tool_selected` → no `first_response_success` | AI latency or error path |
| `first_response_success` → no `streak_incremented` | Check-in route failure (or guest, by design) |
| `streak_incremented` → no `return_user_detected` next session | Return-cue copy too soft |
| `paywall_shown` → no `paywall_clicked` | Timing too early or offer copy weak |
| Repeated `share_clicked` with no traffic spike | Share copy not landing |

## Adding a New Event

1. Add the string to `ALLOWED_EVENT_TYPES` in `server/ai/aiTelemetry.mjs`.
2. Update this table.
3. Fire it from the client via `track("new_event_name", { ...metadata })`.
4. Confirm the new line appears in `logs/events.jsonl`.

## What's Explicitly Not Built (and why)

- **No second log file.** A separate `data/logs/behavior-events.jsonl` was proposed; rejected to avoid data fragmentation. All funnel events live in `logs/events.jsonl`.
- **No PII columns.** Email, name, IP are never written.
- **No message-body logging.** Even hashed. Trauma-informed product rule.

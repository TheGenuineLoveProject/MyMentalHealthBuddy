# API Testing

## Identity model

All `/api/*` POST/PUT/PATCH/DELETE requests must carry **one** identity header.
Requests without an identity are rejected by the CSRF middleware (`server/security/csrf.mjs`)
with `403 {"error":"CSRF token missing or invalid"}`.

| Header | When to use |
| --- | --- |
| `x-guest-id: <any string>` | Anonymous / guest sessions (also required by guest-history persistence) |
| `Authorization: Bearer <token>` | Authenticated users |

Browser flows that hold a session cookie additionally use a CSRF cookie + `x-csrf-token` header pair, but API/script clients should prefer one of the two identity headers above.

## Testing `/api/ai/chat`

### Liveness (GET)
```bash
curl http://0.0.0.0:5000/api/ai/chat
# → {"status":"AI route is alive (use POST)"}
```

### Normal message (one-line POST)
```bash
curl -X POST http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-guest-id: test-session-1" \
  -d '{"message":"I feel anxious"}'
```
Expected: `200 {"ok":true,"reply":"…","therapy":{…},"historyUsed":N}`

### Crisis message (must short-circuit to 988/741741)
```bash
curl -X POST http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-guest-id: test-session-1" \
  -d '{"message":"I want to kill myself"}'
```
Expected: `200 {"isCrisis":true,"reply":"…988…741741…","action":"escalate_immediately"}`

### Validation cases
| Input | Expected |
| --- | --- |
| Empty body / blank `message` | `400 {"error":"Message required"}` |
| `message` longer than 4000 chars | `400 {"error":"Message too long (max 4000 characters)."}` |
| No `x-guest-id`, no `Authorization` | `403 {"error":"CSRF token missing or invalid"}` |

## Logs

Every request is recorded to two places (no message body, no secrets — metadata only):

- **Workflow console** — structured `ai_chat` line via `server/utils/logger.mjs`
- **`logs/ai-logs.jsonl`** — JSONL via `server/logging/aiLogger.mjs` with one of:
  - `type:"success"` — `model`, `latencyMs`, `inputLength`, `outputLength`
  - `type:"fallback"` — `reason` (e.g. `not_configured`, `circuit_open`, `timeout`)
  - `type:"failure"` — `error.message`

Tail the file while testing:
```bash
tail -f logs/ai-logs.jsonl
```

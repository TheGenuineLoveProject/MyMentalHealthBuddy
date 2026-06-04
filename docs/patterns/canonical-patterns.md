# Canonical Patterns (memory)

Verified, reusable conventions for this codebase. Add a pattern only after it is
confirmed in code or by a verified fix — no speculative guidance.

## Build then clean-restart (never build against live)
The dev server serves a **prebuilt** `client/dist` via `express.static` (no Vite
middleware). Any `client/src` change requires `npm run build`, then a clean
workflow restart. `server/*.mjs` changes need only a restart. Treat `npm run
build` as a deliberate, momentarily-destructive action (it empties `client/dist`).

## Non-destructive verification
The canonical verifier (`scripts/verify-foundation.mjs`) only *checks* the build
artifact; it never triggers a build. Hard gates: build artifact present +
`/api/health` 200. Structured results append to `logs/verification.jsonl`.

## Graceful shutdown frees the port immediately
The SIGTERM/SIGINT handler in `server/app.mjs` must call
`server.closeAllConnections()` right after `server.close()` — the Replit preview
proxy holds keep-alive sockets open, so `close()` alone never resolves until the
force-timeout and the dying process keeps port 5000. Keep a **single** shutdown
handler; bound a `listen` EADDRINUSE retry on the startup side for the handoff
overlap.

## Append-only structured logs
Operational logs use append-only JSONL under `logs/` (`events.jsonl`,
`uptime.jsonl`, `verification.jsonl`) with a `ts` + `event` field. New runtime
telemetry should follow this shape rather than inventing a new format.

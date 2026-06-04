# Runtime Governance — Verification Foundation

Companion to the MMHB v7.4 Archival Kernel. Defines how runtime health and the
build are verified. Prevention-first: the canonical verifier is **non-destructive**
and safe to run against the live server.

## Canonical commands

| command | what it does | destructive? |
| --- | --- | --- |
| `npm run verify` | Runs the foundation verifier (delegates to `verify:foundation`). | No |
| `npm run verify:foundation` | `node scripts/verify-foundation.mjs` — health + build-artifact checks, structured log, status snapshot. | No |
| `npm run build` | `vite build` — empties and regenerates `client/dist`. | **Yes** (see warning) |

### Build warning (verified incident)
`vite build` empties `client/dist` (`emptyOutDir`) before regenerating it. The
dev server serves a **prebuilt** `client/dist` via `express.static` with no Vite
middleware, so during the ~50s build window `client/dist/index.html` does not
exist and every `/` request returns HTTP 500 (`ENOENT … index.html`). The
supervisor health-check can then mark the workflow FAILED, and the
failed-but-still-listening process becomes a port-5000 orphan that blocks the
next restart. **Therefore the verifier never triggers a build** — it only checks
that the artifact already exists. Run `npm run build` deliberately, then
clean-restart the workflow.

## Verification gates

- **Hard gates** (fail the run, non-zero exit): `build_artifact` present,
  `api_health` returns `200`.
- **Soft checks** (informational only): `healthz`, `readyz`.
- **Scope:** `build_artifact` verifies PRESENCE of `client/dist/index.html`
  only. Build freshness (whether `dist` matches current source) is out of scope
  for the non-destructive verifier — run `npm run build` deliberately for that.

## Structured logging

Every run appends one JSON record to `logs/verification.jsonl` (same convention
as `logs/events.jsonl`, `logs/uptime.jsonl`). Record shape:

```json
{ "ts": "<iso>", "event": "verification", "ok": true, "base": "http://localhost:5000",
  "checks": [ { "name": "api_health", "ok": true, "detail": "... -> 200" } ] }
```

`docs/architecture/platform-status.md` is an auto-generated snapshot of the most
recent run (do not hand-edit).

## Docs architecture memory system

Durable, topic-based memory surfaces (seed verified facts only — no speculation):

- `docs/architecture/platform-status.md` — auto-generated latest verification snapshot.
- `docs/governance/runtime-governance.md` — this file: the verification contract.
- `docs/errors/runtime-errors.md` — known runtime failure modes + recovery.
- `docs/patterns/canonical-patterns.md` — verified code/operational patterns.

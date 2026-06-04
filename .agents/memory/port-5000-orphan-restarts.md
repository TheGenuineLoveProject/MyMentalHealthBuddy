---
name: Port 5000 orphan process blocks workflow restart
description: Why "Start application" can show FAILED / EADDRINUSE and how stale-build orphans cause client SafeBoundary route crashes
---

# Symptom
- "Start application" workflow shows FAILED; `restart_workflow` reports "had failing tasks" and times out.
- Server logs show `listen EADDRINUSE: address already in use 0.0.0.0:5000` on the platform's own boot attempt.
- Browser shows repeated `[SafeBoundary:Route]` errors with an empty `{}` error object (the real Error's message/stack are non-enumerable, so the log capture flattens them to `{}`).

# Root cause
- `npm run dev` launches `npm -> sh -c "node server/app.mjs"`. SIGTERM/SIGKILL from the restart can hit the npm/sh wrapper without propagating to the `node` child, leaving an **orphaned node process** still bound to port 5000.
- A new boot then cannot bind (EADDRINUSE) -> workflow FAILED.
- While the orphan keeps serving an older `client/dist`, the browser can hold an index.html referencing lazy chunk hashes that no longer match a rebuilt dist -> dynamic import fails -> empty `{}` error caught by SafeBoundary. Confirming clue: chunk hashes (e.g. `CanvaLanding-<hash>.js`) differ between the failing session and a clean restart.

# Root cause (updated — durable code fix applied)
Two compounding causes, both now fixed:
1. **Signal propagation:** `npm run dev` ran `npm -> sh -c "node ..."`; SIGTERM could hit the wrapper, not node. Fixed by `package.json` dev script `exec node server/app.mjs` (exec replaces the shell so node is the direct signal target).
2. **Port held during drain (the real recurrence):** the SIGTERM handler called `server.close()`, which waits for all connections to drain. The Replit preview proxy keeps **persistent keep-alive sockets** open, so `server.close()` never resolved until the 10s force-timeout — the dying process kept port 5000 the whole time, and any restart/redeploy that started a new process in that window hit EADDRINUSE. Fixed in `server/app.mjs` shutdown handler by calling `server.closeAllConnections()` (Node 18.2+) right after `server.close()`, which drops the keep-alive sockets immediately so close() resolves at once and the port frees instantly.

Also removed a **duplicate** shutdown handler: `app.mjs` previously defined BOTH `shutdown` and `gracefulShutdown` and registered both on SIGTERM/SIGINT. Consolidated to the single `shutdown` handler.

3. **Startup-side race (the part the shutdown fix alone could NOT cover):** on restart the supervisor spawns the new process and signals the old one almost simultaneously. Even with fast release, there is a sub-second window where both overlap and the new process's `listen()` hits EADDRINUSE. Previously that became an `uncaughtException` → `process.exit(1)` → workflow FAILED. Fixed by attaching `server.on("error")` that, on EADDRINUSE, retries `server.listen()` a bounded number of times (15 × 400ms) before giving up. Combined with fast release on the old side, the retry binds within a few hundred ms. Switched `app.listen(port, host, cb)` to `app.listen(port, host)` + `server.on("listening", …)` so the error handler is attached before the bind resolves.

**Why both halves are needed:** shutdown-side `closeAllConnections()` frees the port fast; startup-side retry tolerates the unavoidable handoff overlap. One without the other still races.

**Verify the fix:** two back-to-back `restart_workflow` calls should both bind cleanly (before the fix, the 2nd reliably failed with EADDRINUSE).

# Running `npm run build` against the LIVE dev server can mark the workflow FAILED
The dev server serves a **prebuilt** `client/dist` via `express.static` (no vite middleware). `vite build` **empties `client/dist` first** (`emptyOutDir`), so for the whole ~50s build window `client/dist/index.html` does not exist and the running server returns HTTP 500 (`ENOENT … client/dist/index.html`) on every `/` request. The supervisor health-check fails during that window → workflow shows **FAILED**, and the failed-but-still-listening process becomes the port-5000 **orphan** that then blocks the next `restart_workflow` ("had failing tasks"). Recovery: confirm `client/dist/index.html` exists again (build finished), then **kill the orphan by PID** (see manual-clear below) and `restart_workflow`. To avoid it: prefer building when a brief outage is acceptable, or stop the workflow before building.

# Unrelated red herring seen during this work
Right after a **publish/deploy**, `client/dist/index.html` can be briefly absent while the publish copies build output, so `GET /` returns HTTP 500 (`ENOENT … client/dist/index.html`). This is transient — it resolves once the copy finishes; it is NOT the EADDRINUSE bug and needs no code change. `npm run build` (vite build) regenerates it if it stays missing.

# If an orphan still appears (manual clear)
1. `ps -eo pid,ppid,etime,cmd | grep -E "server/app.mjs|npm run dev" | grep -v grep` (look for a long `etime`).
2. Kill by **explicit PID** (`kill -9 <pid> ...`), NOT `pkill -f "npm run dev"` — that pattern can match and kill your own shell (exit 137). `lsof`/`fuser`/`ss` cannot see the :5000 socket owner in this sandbox, so port-based kills silently miss the holder; use PID from `ps`.
3. `restart_workflow`, then `curl -s -o /dev/null -w "%{http_code}" localhost:5000/` should return 200.

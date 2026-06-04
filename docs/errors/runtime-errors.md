# Runtime Errors — Known Failure Modes (memory)

Verified runtime failure modes and their recovery. Seed entries only — add a row
only after a failure is reproduced and a fix is verified (kernel: "no
speculation, only verified fixes").

## Port 5000 orphan blocks workflow restart
- **Symptom:** Workflow shows FAILED; `restart` reports "had failing tasks";
  server logs show `EADDRINUSE 0.0.0.0:5000`, yet `curl localhost:5000/` still
  returns 200 (an orphaned, untracked node process is holding the port).
- **Recovery:** Kill the orphan by **explicit PID** (from `ps -eo pid,etimes,cmd
  | grep server/app`), not by `pkill -f`, then restart once. `lsof`/`fuser`/`ss`
  cannot see the `:5000` owner in this sandbox.

## `ENOENT client/dist/index.html` → HTTP 500 on `/`
- **Symptom:** All `/` requests 500 with `ENOENT … client/dist/index.html`;
  health check fails; workflow marked FAILED.
- **Cause:** `vite build` empties `client/dist` for the whole ~50s build window.
  Running a build against the live dev server takes the app down during that
  window. Also occurs transiently right after a publish/deploy while build
  output is copied.
- **Recovery:** Confirm `client/dist/index.html` exists again (build finished),
  kill any orphan, restart once. Prevention: don't build against the live server
  unless a brief outage is acceptable; the foundation verifier never builds.

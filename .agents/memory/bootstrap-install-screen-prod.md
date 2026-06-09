---
name: Production stuck on "MMHB bootstrap (installing)" screen
description: Prod shows the bootstrap placeholder because deps aren't installed at build time, forcing a slow runtime npm install that races the healthcheck.
---

**Symptom:** published app serves "MMHB bootstrap (installing)" / "MMHB BOOTSTRAP INSTALL" for every URL; deployment logs show repeated `healthcheck / returned status 500`, then `[bootstrap] listening ... needs_install=true`, then `[bootstrap] running npm install --omit=dev` taking 145s+.

**Mechanism:** `.replit [deployment] run = node server/bootstrap.mjs`. bootstrap.mjs checks `existsSync("node_modules/express")`; if absent it serves a placeholder page and runs `npm install` AT RUNTIME, then hands off to `server/app.mjs`. The runtime install is slow and loses the race against the deploy healthcheck, so the app never goes healthy and users see the placeholder.

**Root cause:** the deploy `build` was `npm run build` (vite build ONLY) — it never populated `node_modules`, so the runtime VM image had no express.

**Fix:** make the build install deps so they persist into the runtime image and bootstrap hands off instantly:
`build = ["sh","-c","npm install && NODE_OPTIONS=--max-old-space-size=4096 npm run build"]` (heap flag avoids the known vite "rendering chunks" OOM). Keep run = bootstrap (it now finds express → immediate handoff). Set via deployConfig, then user must REPUBLISH.

**How to apply:** dev preview can be perfectly fine while prod is broken — always check `fetch_deployment_logs`, not the dev screenshot, when the user reports the live/published app is broken.

---
name: Production stuck on "MMHB bootstrap (installing)" screen
description: bootstrap.mjs used a cwd-relative existsSync("node_modules/express") that falsely reports deps missing in the prod VM, triggering an endless slow runtime npm install.
---

**Symptom:** published app serves "MMHB bootstrap (installing)" / "MMHB BOOTSTRAP INSTALL" for every URL; deployment logs repeat `healthcheck / returned status 500`, then `[bootstrap] listening ... needs_install=true`, then `[bootstrap] running npm install --omit=dev` — and never log "install complete" / "handing off".

**ROOT CAUSE (cwd trap):** `server/bootstrap.mjs` checked `existsSync("node_modules/express")` — a path relative to `process.cwd()`. In the prod VM the working dir is NOT the repo root, so the check returns false even though `node_modules` IS present at runtime → bootstrap needlessly runs a slow `npm install` that races/loses the healthcheck and never hands off. `server/app.mjs` was already fixed for this same trap (resolves assets via `__dirname`, not cwd — see its inline comment).

**FIX:** resolve deps cwd-independently — `createRequire(import.meta.url).resolve("express")` (fallback `existsSync(path.join(ROOT, "node_modules","express"))` where `ROOT = path.resolve(__dirname,"..")`), and pass `cwd: ROOT` to the install spawn. ESM `import("./app.mjs")` is already cwd-independent. Then user must REPUBLISH (bootstrap.mjs is a server file, not part of vite build; no local rebuild needed).

**MISTAKE TO AVOID:** my first attempt added `npm install` to the deploy build command — did NOT help, because deps already reach runtime; the bug was purely the cwd-relative existence check. When prod shows "installing" forever, suspect cwd-relative path checks before build config.

**How to apply:** dev preview is served by `node server/app.mjs` directly (never exercises bootstrap.mjs), so dev can look perfect while prod is broken — always read `fetch_deployment_logs`, and grep boot/server code for cwd-relative `existsSync(...)`/`readFile(...)`/static-dir paths.

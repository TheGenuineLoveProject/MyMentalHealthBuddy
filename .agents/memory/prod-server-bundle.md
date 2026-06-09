---
name: Prod server bundle (self-contained esbuild)
description: Why prod runs a bundled dist/server.mjs with a staged dist/node_modules, and the rule for adding native deps.
---

# Production server bundle

Production VM deploy runs `node dist/server.mjs` (set in `.replit` [deployment]). It does NOT run `server/bootstrap.mjs` anymore.

**Why:** The deploy upload excludes `node_modules` (`.replitignore` — the ~4.7GB tree times out the uploader) and the runtime VM does not reliably carry build-phase `node_modules`. The old run cmd `node server/bootstrap.mjs` detected the missing `express`, fell into a slow runtime `npm install` that never completed on the e2-small VM, so every URL served the 27-byte "MMHB bootstrap (installing)" placeholder.

**The fix / how it works:** `scripts/build-server.mjs` (esbuild) inlines the whole server (entry `server/app.mjs`) into one self-contained ESM file `dist/server.mjs` that boots with ZERO node_modules. It also copies `server/db/schema.canonical.sql` next to the bundle (ensureSchema replays it on boot).

**Reliable runtime artifact = the committed/uploaded `dist/` files**, not build-phase outputs. So regenerate `dist/server.mjs` on disk (it ships via upload). The build cmd also reruns the bundler as belt-and-suspenders. `.replitignore` re-includes `dist/**` and `dist/node_modules/**` past the global `node_modules/` exclusion.

**Native-dep rule (footgun):** Native modules can't be inlined (they load a prebuilt `.node` and need a real `__dirname`). `bcrypt` is the only one currently used (6 server files). It must be in BOTH `EXTERNAL` (so esbuild leaves the require) AND `NATIVE_DEPS` (so its tree is copied into `dist/node_modules`) in `scripts/build-server.mjs`. bcrypt@6 uses N-API (ABI-stable) prebuilds via node-gyp-build; linux-x64 glibc prebuild matches the VM; node-addon-api is build-time only (omit). argon2 is NOT used despite an aspirational `.replitignore` comment.
**How to apply:** Any NEW server-side native runtime dep → add it to both `EXTERNAL` and `NATIVE_DEPS`, rebuild, and DRY-RUN boot from a node_modules-free dir, or prod crashes with `__dirname is not defined` / MODULE_NOT_FOUND.

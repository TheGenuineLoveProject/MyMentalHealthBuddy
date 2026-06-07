---
name: Deployment build catches errors tsc misses
description: Why publish can fail even when the one-by-one tsc workflow looks clean; run vite build to validate.
---

The shipped build is `vite build` (rolldown/esbuild). `tsc --noEmit` is typecheck-only and does NOT gate the build, so a green/one-error-at-a-time tsc pass does not mean publish will succeed.

`vite build` fails on a different, often more severe class of issues that tsc may not surface in the same way:
- **Case-sensitive module resolution.** Renaming a file (e.g. `Button.jsx` → `button.tsx`) while imports still say `./Button` builds in dev (forgiving) but fails the Linux build with `[UNRESOLVED_IMPORT]`.
- **Duplicate top-level `const` declarations** (`[PARSE_ERROR] X has already been declared`) — e.g. a manual block mistakenly named the same as the merged export instead of its referenced name.
- **default-vs-named export mismatch** (`[MISSING_EXPORT] "default" is not exported`) — a hook with only `export function useX` imported as `import useX from ...`.

**Why:** these come from concurrent `.jsx→.tsx` conversion / renames. The IDE one-by-one tsc helper does not flag them as the active error, so they only surface at publish time.

**How to apply:** when the user reports a failed publish/deploy, reproduce locally with `npx vite build` (not tsc), read the `[UNRESOLVED_IMPORT]/[PARSE_ERROR]/[MISSING_EXPORT]` blocks, fix, and re-run the build until green. The build itself is the verification for build fixes.

**Dev-container OOM vs real code error:** a plain `npx vite build` in the dev container dies silently during "rendering chunks" (process exits, no error, no `dist/`) — that is the container heap ceiling, NOT a code defect. The code-correctness signal is reaching `✓ N modules transformed`; everything after that is bundling/minify (memory-bound). To actually complete the build locally, run `NODE_OPTIONS="--max-old-space-size=4096" npx vite build` (~1 min). The deploy build env has more memory, so a default-heap OOM here does not mean publish fails. Output dir is `client/dist` (root `client`, see `vite.config.js`), not `dist/public`.

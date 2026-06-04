---
name: allowJs vs TS7016 in MMHB
description: Why enabling allowJs to fix "missing declaration file" errors backfires in this repo, and the safe alternative.
---

# Fixing TS7016 (".jsx implicitly has any type") in MMHB

The root `tsconfig.json` has `allowJs` OFF. Any `.jsx`/`.js`/`.mjs` imported from
a `.ts`/`.tsx` file therefore throws TS7016. The barrel
`client/src/design-system/index.ts` re-exports many `.jsx` files, so these errors
recur as the user clicks through the IDE error panel one by one.

**Do NOT fix this by setting `allowJs: true`.**
**Why:** it pulls every `.jsx` page (e.g. `BreathingExercisesPage.jsx`,
`ControlDashboard.jsx`) into the TS program, and tsc — stricter than the
Vite/esbuild build that actually ships — flags raw `>`/`}` in JSX text as
syntax errors (TS1381/1382/1109/1005). Measured impact: cleared 18 TS7016 but
added 22 new noise errors (130 → 152). The app builds and runs fine; these are
tsc-only false positives, so it's a net-negative IDE experience.

**Safe fix:** add a sibling declaration file next to the offending JS module.
- For the 0-byte stub components (`PageSection`, `Container`, `Stack`, `Surface`
  in `client/src/design-system/`), a `*.d.ts` containing just `export {};` is
  accurate (they export nothing) and resolves TS7016 with zero blast radius.
- For non-empty `.jsx` (Button, Card, PageShell, Typography, etc.) a `.d.ts`
  must declare the real exports — more work, do per-file as requested.

**How to apply:** when a TS7016 names a relative `.js/.jsx`, prefer a colocated
`.d.ts` over a global config flag. Verify with `npx tsc --noEmit -p tsconfig.json`
and diff against a baseline (`comm -13`) to confirm no regressions — and note the
user may be editing other files concurrently, so unrelated new errors can appear.

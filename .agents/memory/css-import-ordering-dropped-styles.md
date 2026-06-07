---
name: Late @import in index.css silently drops stylesheets in prod
description: Appending @import below normal rules makes vite/postcss drop those stylesheets from the production CSS bundle.
---

In `client/src/index.css`, `@import "./styles/..."` statements MUST sit in the top import block (before `@tailwind base` and any normal rules). Per the CSS spec, `@import` must precede all other statements; postcss/vite honor this and **drop** any `@import` that appears after rules.

**Why:** stylesheets appended at the bottom of the giant `index.css` (it's ~7600 lines) emit only a non-fatal build warning `@import must precede all other statements`, then get silently excluded from the production CSS — so those styles are present in dev (forgiving) but missing in the published build. This is a production-parity/UX risk, not a build failure, so it slips past a "build succeeded" check.

**How to apply:** when adding a stylesheet, add its `@import` to the top block near the other `@import`s, never at the end of the file. If you see the `@import must precede` warning in a build log, move the offending imports up — confirm clean by grepping the build log for `@import must precede` (expect 0).

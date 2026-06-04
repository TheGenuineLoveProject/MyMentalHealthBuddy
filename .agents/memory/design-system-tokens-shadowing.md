---
name: design-system tokens.js shadowing
description: Why `./tokens` / `../tokens` imports throw TS7016 in the design-system, the fix, and the latent bugs the fix unmasks.
---

# `tokens.js` shadows the typed `tokens/` directory

In `client/src/design-system/`, an untyped `tokens.js` shim sits next to the
typed `tokens/` directory (the real barrel is `tokens/index.ts`). Module
resolution picks the **file** over the sibling **directory**, so any
`export * from "./tokens"`, `import ... from "../tokens"`, or
`import * as tokens from "./tokens"` resolves to the untyped `.js` shim →
TS7016 ("implicitly has an 'any' type"). The shim's own
`export * from "./tokens"` is self-referential (resolves to itself), so it does
NOT actually re-export the directory — it yields nothing useful.

**Fix:** import the typed barrel explicitly as `"./tokens/index"` (or
`"../tokens/index"`). This bypasses the file-vs-directory shadowing definitively.
Do not delete `tokens.js` (non-destructive preference; still referenced).

**Watch out — the fix unmasks latent `any`-suppressed bugs.**
**Why:** while `./tokens` was untyped, everything flowing through it was `any`,
which silently swallowed real type errors downstream. Once you point at the typed
barrel, those errors surface. Concrete case: `design-system/index.ts` had legacy
compat exports `export const heading = ""` / `body = ""` (empty-string stubs) that
shadow the real typography objects; consumers (`lumi-circadian`, `lumi-rituals`)
use `heading.h3` / `body.md` / `body.sm`. These only errored (TS2339 "Property
'h3' does not exist on type ''") AFTER the tokens import was typed. Fixing the
resolution increased the error count until the stubs were also corrected to the
file's existing `(tokens as any).X ?? {}` pattern.

**How to apply:** when fixing a `./tokens` TS7016, redirect to `tokens/index`,
then re-run `tsc --noEmit` and diff against baseline (`comm -13`). Expect to also
fix any `""`/empty stubs in `index.ts` that were masking consumer usage.

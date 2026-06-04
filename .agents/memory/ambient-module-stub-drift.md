---
name: Ambient declare-module stubs can override real exports
description: Why useLumiAudio (and similar) imports flip-flop between named/default and never satisfy both tsc and the build.
---

`client/src/types/global.d.ts` (and sibling `*.d.ts` in `client/src/types/`) contain hand-written `declare module "@/path/to/x" { ... }` ambient stubs. An ambient declaration whose specifier exactly matches an import specifier WINS over the real file's resolved types.

**The trap:** if such a stub declares `export default X` but the real `.js`/`.ts` file actually has `export function X` (named), then:
- tsc trusts the stub → demands a default import, and its quick-fix suggests "Did you mean default import".
- the build (vite/rolldown/esbuild) ignores `.d.ts` and reads the real file → demands a named import (`[MISSING_EXPORT] "default" is not exported`).
These two can never be satisfied by the same import line, so the import gets flipped back and forth indefinitely.

**Why:** allowJs is intentionally OFF in this project (see allowjs-ts7016 note), so `.js` modules have no inferred types; the team stubs them via ambient `declare module`. The stubs drift from the real export shape over time.

**How to apply:** when an import's named-vs-default form won't satisfy both tsc and the build at once, do NOT keep flipping the import. Grep `client/src/types/*.d.ts` (and any `declarations.d.ts`) for a `declare module` matching that specifier and fix the STUB to mirror the real runtime export (named↔default). A colocated `useLumiAudio.d.ts` next to the `.js` will NOT help — the exact-specifier ambient stub still wins. Then set every importer to match the real export.

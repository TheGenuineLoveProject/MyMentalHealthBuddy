---
name: LotusLoader reduced-motion defect
description: Why <LotusLoader> does not fully honor prefers-reduced-motion, and the rule for consolidating ad-hoc spinners to it.
---

# LotusLoader reduced-motion defect

`client/src/components/ui/LotusLoader.jsx` does NOT fully honor
`prefers-reduced-motion`. Its petal `<ellipse>` and center `<circle>` declare
their animations via **inline** `style={{ animation: ... }}`, which beats the
component's own stylesheet rule
`@media (prefers-reduced-motion: reduce) { .lotus-loader ellipse/circle { animation: none } }`.
Inline styles win over stylesheet rules, so under reduce-motion the outer
`.lotus-loader` rotation stops but the petals/center keep pulsing.

**Why this matters:** MMHB governance requires reduced-motion + WCAG AA on every
surface. Any ad-hoc spinner that used `motion-reduce:animate-none` (fully stops)
will *regress* when consolidated to `<LotusLoader>` — it inherits this partial-
animation bug.

**How to apply:**
- When swapping an ad-hoc loader to the canonical `LotusLoader`, know you are
  inheriting this reduce-motion gap. Surface it (don't silently ship it).
- The fix belongs in `LotusLoader` itself (move inline `animation` decls into the
  existing `<style>` block as classes, or omit them when reduce-motion is active).
  But `LotusLoader` is a SHARED primitive — fixing it is its own governed task,
  out of scope for single-route spinner-consolidation work.
- `BrandSpinner` (`.brand-spinner`, gated in index.css) is the small inline
  loader; `LotusLoader` is the large-area loader per their own JSDoc.
- Open follow-up tracked in `codex/design/classification/loadingPatternAudit.md`
  under "Follow-Up — Governance (open)".

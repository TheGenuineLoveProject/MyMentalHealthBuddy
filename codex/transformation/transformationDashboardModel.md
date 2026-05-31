# Transformation Dashboard Model

> **Phase:** B1 · **Mode:** GOVERNANCE / ARCHITECTURE ONLY (no runtime code).
> **Governed by:** MMHB v7.4 Archival Kernel. Educational only — no diagnosis, no clinical scoring of a person. Consent-gated, reversible, non-coercive, trauma-informed. Crisis routing preserved. Reflection layer is **read-only** over existing user data.

This document defines the governance shape of a **reflection dashboard** — a gentle mirror of a person's self-authored growth, never a performance scoreboard.

---

## 1. Dashboard law

The dashboard **reflects, it does not grade**. No single "transformation score," no ranking, no comparison to other people, no anxiety-inducing graph-of-self. It is opt-in, dismissible, and reversible. Disabling it removes derived views; raw data is untouched.

---

## 2. What the dashboard shows (descriptive, opt-in)

- **Gentle "lately you've…"** — small, kind summary in the person's framing.
- **Per-domain reflection** — qualitative bands across the six domains (`transformationDomains.md`): resting / emerging / practicing / integrating; noticing / naming / understanding.
- **Themes** — recurring themes the person may choose to explore.
- **Seasons & timeline** — active/resting seasons (neutral), per `transformationTimelineModel.md`.
- **Proof of growth** — self-validated, honest reflections of change (`proofOfGrowthSignals.md`).
- **Always-present support** — crisis resources visible on the surface.

---

## 3. Self-awareness progression (descriptive)

Reflected per-domain, in the person's own words, confidence-honest:

```
noticing → naming → understanding
  (movement in any direction is normal; sparse data → "it's early")
```

- **Noticing** — becoming aware something is present.
- **Naming** — putting language to it.
- **Understanding** — connecting it to patterns/meaning.

No stage is "better"; progression is non-linear and never used to pressure.

---

## 4. Dashboard structure (governance shape, not a schema)

```
DashboardView (derived, consented, reversible, person-only):
  domainReflections[]  — qualitative band + plain-language "why"
  themes[]             — recurring, explorable, dismissible
  season               — active | resting (neutral)
  proofMoments[]       — self-validated growth reflections
  confidence           — early | emerging | consistent
  visibility           — private-by-default
  crisisRouting        — always present
```

**Rules:**
- **Read-only** over journal/mood/tools; never mutates them.
- **No aggregation into a single number-of-self.**
- **Explainable** — every element shows plain-language "why," sourced from defined, consented signals.
- **No hidden engagement weights** — nothing tuned for session time or conversion.
- **No business content** — zero pricing/conversion/debugging (Primary Law).

---

## 5. Anti-manipulation (dashboard-specific)

- No streak calendars with shame mechanics.
- No loss-framing, urgency, or "you're falling behind."
- No comparison/leaderboards/percentiles.
- No variable-reward reveals engineered for compulsion.
- Resting shown warmly; re-entry welcomed, never penalized.

---

## 6. Accessibility & safety

- WCAG AA, reduced-motion honored, keyboard + screen-reader support.
- Crisis routing on the surface (`/crisis`, 988, 741741).
- Opt-in, dismissible, reversible throughout.

---

**Companion docs:** domains (`transformationDomains.md`), proof of growth (`proofOfGrowthSignals.md`), non-manipulative engagement (`nonManipulativeEngagement.md`), scoring model (`transformationScoringModel.md`).

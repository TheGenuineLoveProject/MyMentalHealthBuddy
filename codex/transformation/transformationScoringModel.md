# Transformation Scoring Model

> **Phase:** T1 · **Mode:** GOVERNANCE / ARCHITECTURE ONLY (no runtime code).
> **Governed by:** MMHB v7.4 Archival Kernel. Educational only — no diagnosis, no clinical scoring of a person. Consent-gated, reversible, non-coercive.

This document defines how TI may *organize* signals into gentle, **descriptive** reflections. The word "scoring" here means **internal organization of signals for reflection** — it is **never** a grade of the person, never shown as a single number-of-self, and never used to gate, rank, or pressure.

---

## 1. Non-negotiable scoring laws

1. **No score of a human.** There is no "transformation score," no overall percentage, no rank. A person is never reduced to a number.
2. **Descriptive, not evaluative.** Outputs are qualitative reflections ("you've returned to self-compassion often lately"), not pass/fail or good/bad.
3. **No comparison.** No leaderboards, no percentiles, no "vs. other users," no normative benchmarks.
4. **No coupling to business.** Scores never influence pricing, upsell, feature-gating, or any conversion mechanic. (Primary Law: business logic out of healing flows.)
5. **Reversible & private.** Disabling TI deletes derived scores; raw user data is untouched. Scores never leave the person's scope.
6. **Crisis overrides scoring.** Any explicit risk signal halts scoring and routes to crisis resources (BHCE).

---

## 2. Integration scoring (descriptive)

"Integration" describes how consistently a person is *weaving a noticed insight into lived practice* — reflected gently, per-domain, never globally.

- **Inputs:** consented growth indicators + regulation/embodiment engagement + self-authored "this fit / didn't fit" feedback.
- **Representation:** qualitative bands per domain — **emerging → practicing → integrating** (and "resting," an explicit, non-penalized state).
- **Resting is honored:** pausing is a valid state, shown neutrally — never "you stopped" or "you lost progress."
- **No aggregation across domains** into a single figure. Each domain reflects independently.

```
Integration (per domain, qualitative):
  resting · emerging · practicing · integrating
  (movement in any direction is normal and shown without judgment)
```

---

## 3. Awareness scoring (descriptive)

"Awareness" describes how much a person is *noticing their own inner states and patterns* — again per-domain, qualitative.

- **Inputs:** emotion-naming range, reflection cadence (presence not pressure), self-identified patterns.
- **Representation:** qualitative band — **noticing → naming → understanding** — always in the person's own framing.
- **Honest about sparsity:** little data → "it's early," not a confident claim.

---

## 4. How bands are derived (governance, not algorithm)

This phase defines *rules*, not code. Any future implementation must obey:

- **Consent first** — only consented signals contribute.
- **Confidence-weighted** — sparse/low-confidence signals soften the band, never inflate it.
- **Self-correction** — "this doesn't fit" feedback suppresses and down-weights a reflection.
- **Decay-with-grace** — inactivity moves a domain to **resting** (neutral), never to a negative or "failing" state.
- **Explainable** — every band can show plain-language "why," sourced from defined signals only.
- **No hidden persuasion weights** — no factor may be tuned to increase engagement, session time, or conversion.

---

## 5. Anti-manipulation guarantees (scoring-specific)

- No variable-reward/intermittent-reinforcement scoring.
- No loss-framing ("don't break your streak," "you'll fall behind").
- No artificial scarcity or urgency tied to scores.
- No dark-pattern progress bars engineered to drive compulsion.
- No score-based notifications that pressure return (see UX doc for the non-coercive notification contract).

---

## 6. Output contract

Every scoring-derived reflection must be:
- **Optional** to view, **dismissible**, and **correctable**.
- **Plain-language** and **kind** in tone.
- **Crisis-safe** — accompanied by crisis routing on any wellness surface.
- **Free of business content** — zero pricing/conversion/debugging.

---

**Companion docs:** domains (`transformationDomains.md`), signals (`transformationSignals.md`), UX safety (`nervousSystemSafeUX.md`), timeline (`transformationTimelineModel.md`).

# Transformation Timeline Model

> **Phase:** T1 · **Mode:** GOVERNANCE / ARCHITECTURE ONLY (no runtime code).
> **Governed by:** MMHB v7.4 Archival Kernel. Educational only — no diagnosis, no clinical automation. Consent-gated, reversible, non-coercive, trauma-informed. Crisis routing preserved.

This document defines how TI may represent a person's growth **over time** — as a gentle, self-authored *story of returning*, not a performance chart or a deadline-driven roadmap.

---

## 1. Timeline philosophy

- **A spiral, not a ladder.** Growth revisits the same themes at new depths. The timeline reflects *returning*, not linear ascent — there is no "top," no "behind."
- **The person is the author.** Their own words, choices, and milestones define the story. TI organizes; it does not narrate over them.
- **No deadlines, no pace pressure.** The timeline never implies "you should be further along." Pauses are part of the story.
- **Reversible & private.** Disabling TI removes the derived timeline; raw entries remain the person's own.

---

## 2. Progress timeline structure

A lightweight, descriptive, append-only structure (governance shape — not an implemented schema):

```
TimelineEntry (derived, consented, reversible):
  id            — derived reference
  occurredAt    — when the reflected event happened
  domain        — D1..D6 (see transformationDomains.md)
  kind          — moment | reflection | return | rest | milestone(self-set)
  band          — qualitative (e.g. emerging/practicing/integrating | noticing/naming/understanding)
  sourceRef     — read-only pointer to the person's own entry (never a copy out of scope)
  selfNote      — the person's own words (optional)
  confidence    — early | emerging | consistent
  visibility    — private-by-default (person-only)
```

**Structural rules:**
- **Append-only & non-destructive** — the timeline never rewrites or deletes the person's history; corrections are added, not overwritten.
- **Self-set milestones** — only the person marks a "milestone." TI may *suggest* one gently, opt-in, dismissible.
- **Rest is a first-class entry** — pauses appear neutrally ("a season of rest"), never as gaps-to-explain.
- **Read-only sourcing** — entries point back to existing journal/mood/tool data; TI never mutates those systems.
- **Confidence-honest** — sparse periods render softly, not as failure.

---

## 3. Timeline views (all opt-in, all calm)

- **Recent gentle reflection** — a small, dismissible "lately you've…" summary in the person's framing.
- **Spiral / theme view** — recurring themes across time the person can choose to explore.
- **Then & now** — optional, opt-in self-contrast in the person's own words.
- **Seasons** — neutral grouping into active/resting seasons, honoring natural rhythm.

> Anti-pattern ban: no anxiety-inducing line-graph-of-self, no "score over time," no comparison to other people, no streak calendar with shame mechanics.

---

## 4. Time, decay & grace

- **Decay-with-grace** — inactivity moves domains to a neutral **resting** state, never a negative one.
- **No re-engagement pressure** — the timeline is not used to trigger guilt notifications (see non-coercive notification contract in `nervousSystemSafeUX.md`).
- **Re-entry is warm** — returning after a pause is welcomed ("welcome back, your story continued waiting"), never penalized.

---

## 5. Crisis & safety on the timeline

- The timeline **never** scores or charts distress/crisis events as "progress" data.
- Any explicit self-harm signal halts TI processing and routes to crisis resources (BHCE): `/crisis`, 988, Crisis Text 741741, 911.
- Crisis routing is present on every timeline surface.

---

## 6. Governance guarantees (timeline-specific)

- **Consent-gated** — no timeline without explicit opt-in.
- **Reversible** — off = derived timeline removed; raw data untouched.
- **Non-coercive** — no deadlines, urgency, streak-bait, or loss-framing.
- **No business contamination** — zero pricing/conversion/debugging on any timeline surface (Primary Law).
- **Evidence-informed** — qualitative, confidence-banded, non-clinical; no false precision.
- **Accessible** — WCAG AA, reduced-motion honored.

---

**Companion docs:** domains (`transformationDomains.md`), signals (`transformationSignals.md`), scoring (`transformationScoringModel.md`), UX safety (`nervousSystemSafeUX.md`).

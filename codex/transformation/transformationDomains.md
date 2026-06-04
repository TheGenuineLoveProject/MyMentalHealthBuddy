# Transformation Domains

> **Phase:** T1 — Transformation Intelligence Foundation · **Mode:** GOVERNANCE / ARCHITECTURE ONLY (no runtime code).
> **Governed by:** MMHB v7.4 Archival Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`).
> **Boundaries:** Educational only — no diagnosis, no treatment claims, no clinical automation. Trauma-informed, consent-based, non-coercive. Crisis routing preserved on every surface. No business logic in healing flows.

This document defines **what** the Transformation Intelligence (TI) system observes and organizes. It is descriptive and reflective, **never** prescriptive or evaluative of a person's worth.

---

## 1. Purpose & framing

Transformation Intelligence is a **reflection layer**, not a scoring authority over a human being. It helps a person *notice their own patterns of growth* in a gentle, consent-based way. It never grades, ranks, diagnoses, or pressures.

**Language law:** every TI surface uses descriptive, self-authored, non-clinical language ("you've been returning to gratitude lately") — never clinical/diagnostic ("your depression score is…") and never coercive ("you're falling behind").

---

## 2. The transformation domains

TI organizes reflection across **six non-hierarchical domains**. No domain is "higher" than another; a person may grow in any order, pause, or revisit. Domains are lenses, not levels.

| Domain | What it reflects (descriptive) | Example self-noticed signals |
|---|---|---|
| **D1 · Self-Awareness** | Noticing inner states, naming feelings, recognizing patterns | More frequent emotion-naming in journaling; recognizing a recurring trigger |
| **D2 · Emotional Regulation** | Returning to baseline, self-soothing, widening the window of tolerance | Shorter time-to-calm after distress; use of grounding tools |
| **D3 · Reflection & Meaning** | Making sense of experience, reframing, integrating lessons | Reframed entries; connecting past events to present growth |
| **D4 · Embodiment & Nervous System** | Felt-sense awareness, rest, breath, body cues | Logged rest/breath practices; noticing body signals before overwhelm |
| **D5 · Connection & Compassion** | Self-compassion and relational warmth (self and others) | Kinder self-talk; reaching out; gratitude toward others |
| **D6 · Values & Agency** | Acting in alignment with chosen values; sense of choice | Small aligned actions; setting consent-based boundaries |

> Domains map loosely to existing wellness tooling (mood, journaling, self-compassion, breathing, values explorer) **as a reflection overlay only** — TI does not modify those runtime features.

---

## 3. Domain principles

- **Non-hierarchical** — no domain ranking, no "complete the levels" mechanic.
- **Self-authored** — the person's own words and choices define what growth means to them.
- **Consent-gated** — a domain is only reflected back if the person opted into that kind of data.
- **Reversible** — turning TI off removes all derived reflections; raw user data is untouched.
- **Asymmetric toward safety** — any signal that could indicate crisis defers entirely to BHCE (crisis escalation), never to a "score."

---

## 4. Consciousness integration architecture

A layered, **read-only-over-user-data** architecture. TI *derives* reflections from data the person already chose to record; it never writes back into healing/journal/crisis runtime systems.

```
┌─────────────────────────────────────────────────────────┐
│  Layer 4 · Reflection Surface (gentle, opt-in, reversible)│  ← what the person sees
├─────────────────────────────────────────────────────────┤
│  Layer 3 · Integration & Awareness Scoring (descriptive)  │  ← see scoring model
├─────────────────────────────────────────────────────────┤
│  Layer 2 · Signals (growth/regulation/embodiment)         │  ← see signals doc
├─────────────────────────────────────────────────────────┤
│  Layer 1 · Consent & Domain Routing                       │  ← classifies + gates by consent
├─────────────────────────────────────────────────────────┤
│  Layer 0 · Source data (existing, untouched)              │  ← journal/mood/tools (read-only)
└─────────────────────────────────────────────────────────┘
        ▲ Crisis path (BHCE) overrides ALL layers, always.
```

**Integration contract:**
- **Read-only** over Layer 0. TI never mutates journal, mood, crisis, provider, billing, auth, or admin systems.
- **One-way derivation** — signals → scores → reflections. No reflection ever feeds back as an automated action on the person's account.
- **Crisis primacy** — if any layer encounters an explicit self-harm signal, it stops TI processing and routes to `/crisis` + 988 + 741741 + 911 (per BHCE). TI never "scores" crisis.
- **Domain separation** — TI is HEALING-domain only; it contains zero pricing/conversion/business logic.

---

## 5. What TI is NOT

- Not a diagnosis or assessment instrument.
- Not a gamified leaderboard, streak-pressure, or "level up" system.
- Not a predictor of clinical outcomes.
- Not a behavior-modification or persuasion engine.
- Not a replacement for human care or professional support.

---

**Companion docs:** signals (`transformationSignals.md`), scoring (`transformationScoringModel.md`), UX safety (`nervousSystemSafeUX.md`), timeline (`transformationTimelineModel.md`).

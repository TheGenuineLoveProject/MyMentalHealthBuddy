# Emotional State Engine Governance

**Status:** LOCKED v1.0 — governance-only architecture
**Kernel:** MMHB v7.4 (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Phase:** 112
**Companion registry:** `registry/emotional-state/emotional-state-engine-registry.json`
**Companion report:** `docs/reports/PHASE_112_EMOTIONAL_STATE_ENGINE_GOVERNANCE.md`
**Parent governance:** `docs/governance/AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (domains **E**, **H**, **L**, **U**)

## Purpose
Define the canonical contract for any current or future system that **infers, stores, or adapts to a user's emotional state** inside MMHB. This document is the decision contract; the JSON registry is the machine-readable mirror; the Phase 112 report is the execution ledger. Phase 112 ships **zero runtime change** — no inference, no scoring, no UI adaptation is introduced. The map only declares what is allowed, what is forbidden, and the sequence by which any future emotional-state surface must be built and audited.

## Primary Law
**The platform may adapt tone, pacing, layout density, and suggestions for the user's comfort. It must never diagnose, manipulate, pressure, shame, exploit, or monetize emotional state.**

If a feature cannot demonstrably honor every word of that sentence, it does not ship.

## Scope (what this engine *is* and *is not*)
| Is | Is Not |
|---|---|
| A consent-gated personalization layer for surface tone & pacing | A clinical assessment instrument |
| A signal-aware UX adapter (reduced motion, smaller choices, calmer copy) | A diagnostic system |
| A user-controllable, user-visible, user-resettable state | A hidden user score |
| A short-horizon, recency-weighted hint | A persistent personality profile |
| Optional and reversible | A default-on behavior tracker |

## Nine Supported States (canonical)
| # | State id | Plain-language cue | UX intent |
|---|---|---|---|
| 1 | `calm`        | "I'm okay right now"        | normal density, no extra prompts |
| 2 | `grounded`    | "I'm steady, ready"          | normal density, optional growth surfaces |
| 3 | `focused`     | "I want to do one thing"     | minimize peripheral chrome, single-task layout |
| 4 | `reflective`  | "I want to think"            | favor journal + library; longer-form copy ok |
| 5 | `hopeful`     | "Things are looking up"      | celebrate gently; no streaks/pressure |
| 6 | `sad`         | "Heavy today"                | softer copy, validation first, no upbeat CTAs |
| 7 | `anxious`     | "Buzzy, on edge"             | grounding tools surfaced, slower transitions |
| 8 | `overwhelmed` | "Too much"                   | minimum-choice layout, max 1 next step visible |
| 9 | `exhausted`   | "Empty"                      | rest + restorative tools surfaced, no goals nudge |

New states require a phase report + kernel addendum. States are **states**, not traits — they expire (see "Recency + Expiry" below).

## Allowed Adaptations (the only ones)
- Tone-softening (controlled-vocabulary copy variants)
- Slower transitions / reduced motion
- Lower cognitive density (fewer choices visible)
- Grounding-prompt surfacing (breath, body scan, 5-4-3-2-1)
- Shorter paragraphs
- Gentler navigation (no abrupt context shifts)
- Accessibility-first layout (larger touch, higher contrast)
- Surface ordering — promote rest/regulation tools; demote (never hide) growth/goal tools
- Optional Lumi opening line variant matched to state

Nothing else. Any new adaptation requires a phase report.

## Forbidden Adaptations (kernel-aligned, non-negotiable)
- **Diagnosis** — naming a disorder, syndrome, or DSM/ICD label.
- **Prescribing** — recommending medication, dose, or change.
- **Suicidality determination** — judging "how at risk" a user is from emotional signals. Crisis routing remains keyword/explicit-signal driven and always surfaces 988 / 741741 / 911 / `/crisis`.
- **Clinical claims** — "we detected…", "you have…", "your level of…".
- **Emotional scoring for monetization** — no upsell, ad targeting, or paywall logic conditioned on state.
- **Urgency manipulation** — no timers, scarcity, "act now" prompts on healing surfaces.
- **Addictive streak pressure** — no shame on broken streaks; never gate care behind continuity.
- **Hidden persuasion** — no nudges the user cannot see, label, or disable.
- **Targeted upsells from emotional data** — emotional state never enters BUSINESS surfaces.
- **Vulnerability exploitation** — never surface an upgrade prompt while state ∈ {`sad`, `anxious`, `overwhelmed`, `exhausted`}.
- **Default-on without consent** — no inference until the user opts in at the explicit consent moment.
- **Persistent profiling** — no long-horizon "this user is the anxious type" trait store.

A feature that violates any of these is a kernel breach and must be reverted.

## Inputs Allowed → Inferred State
| Input | Allowed | Notes |
|---|---|---|
| Mood check-in (explicit user pick) | ✅ | Primary signal. Always wins. |
| Journal sentiment (on-device only, opt-in) | ✅ | Local NLP; no raw text leaves device for state inference. |
| Selected tool category in current session | ✅ | Weak signal; recency only. |
| Time-of-day / quiet-hours window | ✅ | UX hint only, not state by itself. |
| Reduced-motion / a11y settings | ✅ | Hard adaptation, not state inference. |
| **Click rate / dwell time / scroll depth** | ❌ | Engagement signals are forbidden as state inputs. |
| **Conversion proximity / billing status** | ❌ | BUSINESS data never enters HEALING state. |
| **Crisis lexicon hits** | ❌ for state | Routed instead to crisis-pin (see Search governance §safetyFirstRouting). |

## Recency + Expiry
- Default state TTL: **30 minutes** of inactivity.
- Explicit user check-in TTL: **6 hours**, then degrades to `calm` (neutral default).
- Session boundary resets state unless user enables "remember tonight".
- State is per-device by default; cross-device sync requires a second opt-in.

## User Control Contract
Every emotional-state surface must expose:
1. **Visible label** — "Right now we're showing a softer layout because you said you feel overwhelmed."
2. **One-tap override** — "Show me the normal layout."
3. **One-tap reset** — "Forget today."
4. **Settings toggle** — "Don't adapt to my state" (master off).
5. **Transparency view** — what we currently think + every input that contributed (links to `client/src/lumi-memory/components/MemoryTransparencyView`).
6. **No memory write without consent moment** — first inference is preceded by a `BoundaryCard` from `client/src/lumi-boundaries/`.

## Crisis Interlock (overrides everything)
- A crisis signal (explicit lexicon hit) **bypasses the emotional-state engine entirely**.
- `/crisis` + 988 + 741741 + 911 surface regardless of inferred state.
- No state adaptation is allowed to delay, soften, or hide a crisis affordance.
- The engine never claims to "detect" suicidality; that is out of scope and forbidden.

## Domain Separation
| State surface | HEALING content | PLATFORM content | BUSINESS content |
|---|---|---|---|
| Tone/pacing adaptation | ✅ | label-only | **forbidden** |
| Surface ordering | ✅ rest first | ✅ trust pins | **forbidden** in healing flow |
| Lumi opening line variant | ✅ | n/a | **forbidden** |
| Pricing / upgrade / billing | ❌ never | n/a | conditioned only on explicit, non-emotional triggers |

Emotional state **must not** be a feature in the pricing, upgrade, or conversion model. Ever.

## Storage Contract
- **Local-first.** State lives in client-side ephemeral memory by default.
- **No DB write** unless user enables "remember tonight" / "sync across devices".
- **No third-party processor** (analytics, ads, marketing) ever receives state.
- **No emotional state in logs** — server logs may record `tool_id`, never `state`.
- **Right to delete** — one tap clears all state history (interlocks with Trust Center §user-rights).

## Quality Gates Bound by This Map
| Gate | Required | Tooling |
|---|---|---|
| build | `npm run build` exit 0 | npm |
| health | `/healthz` + `/readyz` + `/api/health` 200 | curl |
| routes | no taxonomy regression | route registry |
| accessibility | 0 critical/serious; reduced-motion honored | axe |
| privacy | no emotional state in any server log or analytics | log review |
| consent | engine off until explicit opt-in moment | manual |
| crisis | crisis interlock verified on every release | red-team |
| domain | no BUSINESS conditioning on state | manual + grep |
| rollback | one `git revert` restores prior state | git |

## Build Sequence (Phases 113–118 proposed; none executed here)
1. **Phase 113** — Emotional State UX Audit (read-only): scan existing surfaces for any *implicit* adaptation (tone, density, ordering) and confirm none silently keys off engagement signals. Emit `docs/reports/PHASE_113_EMOTIONAL_STATE_UX_AUDIT.md`.
2. **Phase 114** — Controlled-vocabulary tone variants per state (doc only, in `docs/content/tone/`).
3. **Phase 115** — Consent moment design (BoundaryCard variant) — design doc, no code.
4. **Phase 116** — Inference module spec: local-only, deterministic, recency-weighted (no ML model on device beyond on-device sentiment lib already in scope).
5. **Phase 117** — Transparency-view component spec (extends `lumi-memory` patterns).
6. **Phase 118** — Red-team script for the engine (50+ prompts covering monetization-leak, crisis-bypass, hidden-persuasion, default-on, persistent-trait).

Each phase opens with a diagnose artifact and closes with verification (build + health + audit screenshot).

## Linkage Map
- ↑ Parent: `AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (E, H, L, U)
- ↑ Kernel: `MMHB_v7.4_ARCHIVAL_KERNEL.md`
- ↔ Trust + AI partner: `TRUST_CENTER_AI_TRANSPARENCY_ARCHITECTURE.md` (Phase 104) — boundaries restated here are derivative
- ↔ Search partner: `SEMANTIC_SEARCH_AND_TOOL_INDEX_GOVERNANCE.md` (Phase 105) — `crisisSignalTerms[]` and `safetyFirstRouting` shared
- ↔ Memory/boundaries live modules (read-only): `client/src/lumi-memory/`, `client/src/lumi-boundaries/`, `client/src/lumi-disclaimer/`, `client/src/lumi-crisis/`
- → Companion registry: `registry/emotional-state/emotional-state-engine-registry.json`
- → Execution ledger: `docs/reports/PHASE_112_EMOTIONAL_STATE_ENGINE_GOVERNANCE.md`

## Versioning
- v1.0 locked 2026-05-25.
- Changes to Primary Law, Forbidden Adaptations, or Crisis Interlock require a kernel addendum.
- New states or new allowed adaptations require a phase report.

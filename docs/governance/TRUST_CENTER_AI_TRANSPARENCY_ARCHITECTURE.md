# Trust Center + AI Transparency Architecture

**Status:** LOCKED v1.0 — governance-only architecture map
**Kernel:** MMHB v7.4 (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Phase:** 104 (this is the *map*; no surface is built in this phase)
**Companion registries:** `registry/trust/trust-center-registry.json`, `registry/ai-governance/ai-transparency-registry.json`
**Companion report:** `docs/reports/PHASE_104_TRUST_AI_TRANSPARENCY_ARCHITECTURE.md`

## Purpose
Define the governance architecture for two paired public surfaces — **Trust Center** and **AI Transparency Center** — that will, in later phases, become the platform's user-facing accountability layer. This document is the **contract**; the JSON registries are the **machine-readable mirror**; the Phase 104 report is the **execution ledger**. Phase 104 ships zero UI.

## Why these two surfaces are paired
Trust without AI transparency is hollow; AI transparency without trust framing is intimidating. The two must ship together, link reciprocally, and never diverge on a shared claim (e.g., "we do not diagnose" appears verbatim in both, sourced from the same registry value).

## Core Trust Center Sections (10, canonical)

| # | Section | Anchor slug | Owner domain | Source of truth |
|---|---|---|---|---|
| 1 | Safety Philosophy | `#safety-philosophy` | HEALING+PLATFORM | this doc |
| 2 | Privacy + Data Boundaries | `#privacy-data-boundaries` | PLATFORM | `/privacy` + this doc |
| 3 | AI Transparency (summary card) | `#ai-transparency` | PLATFORM | link to AI Transparency Center |
| 4 | Human Oversight | `#human-oversight` | PLATFORM | this doc |
| 5 | Crisis Boundaries | `#crisis-boundaries` | CRISIS | `/crisis` + this doc |
| 6 | Evidence + Research Standards | `#evidence-research` | HEALING | this doc |
| 7 | Anti-Manipulation Pledge | `#anti-manipulation-pledge` | PLATFORM | this doc |
| 8 | User Rights | `#user-rights` | PLATFORM | `/account/data` (future) + this doc |
| 9 | Accessibility Commitment | `#accessibility` | PLATFORM | WCAG AA baseline + this doc |
| 10 | Contact + Support | `#support` | PLATFORM | existing support surface |

## Core AI Transparency Center Sections (10, canonical)

| # | Section | Anchor slug | Source of truth |
|---|---|---|---|
| 1 | What AI Can Do | `#what-ai-can-do` | this doc |
| 2 | What AI Cannot Do | `#what-ai-cannot-do` | this doc + boundaries registry |
| 3 | Human Supervision Boundaries | `#human-supervision` | this doc |
| 4 | No Diagnosis / No Prescribing | `#no-diagnosis-no-prescribing` | this doc + boundaries registry |
| 5 | Crisis Escalation Boundaries | `#crisis-escalation` | `/crisis` + this doc |
| 6 | Memory + Personalization Transparency | `#memory-transparency` | `client/src/lumi-memory/` (existing module) + this doc |
| 7 | Data Use Boundaries | `#data-use` | this doc |
| 8 | Safety Testing + Red-Team Practices | `#safety-testing` | this doc |
| 9 | Limitations | `#limitations` | this doc |
| 10 | How to Get Human Help | `#human-help` | `/crisis` + support surface |

## Proposed canonical routes (architecture only — not implemented in this phase)
- `/trust` → Trust Center hub
- `/trust/<section-slug>` → deep-linkable sections (one route, hash anchors acceptable; alternate: nested routes — decision deferred to Phase 105 audit)
- `/ai-transparency` → AI Transparency Center hub
- `/ai-transparency/<section-slug>` → deep-linkable sections (same decision deferred)

**Both routes must:**
- Be public (no auth required).
- Be linked from the global footer.
- Be linked reciprocally (Trust Center §3 → AI Transparency Center; AI Transparency Center top nav → Trust Center).
- Be linked from `/crisis` footer ("How we keep you safe").
- Pass Lighthouse a11y = 100 at ship time.
- Carry no business CTAs (HEALING/PLATFORM only — never BUSINESS).

## Non-Negotiable Laws (the eight)
1. **No diagnosis.** Lumi/MMHB never names a disorder for a user.
2. **No prescribing.** Lumi/MMHB never recommends a medication, dose, or change.
3. **No suicidality determination.** Lumi/MMHB escalates — never resolves — any self-harm signal. 988 + 741741 + 911 + `/crisis` always shown.
4. **No emergency replacement.** Lumi/MMHB is never positioned as an alternative to 911 or a clinician.
5. **No provider impersonation.** Lumi/MMHB never claims professional credentials or roleplays as a therapist.
6. **Human-supervised.** All AI output is governed by written human policy; red-team review precedes release.
7. **Privacy-preserving.** No healing data is monetized; no third-party ad/marketing tracking on healing surfaces.
8. **Non-coercive.** No dark patterns, no shame nudges, no fake urgency, no loss-aversion paywalls.

Any change that touches an AI surface must reaffirm these eight in writing.

## Anti-Manipulation Pledge (verbatim, copy-locked)
> *We will not engineer urgency you don't feel, scarcity that isn't real, or shame to keep you here. If you want to leave, we will help you leave. If something we build pulls at you in a way that feels off, please tell us — we will take it seriously and, when warranted, we will remove it.*

This block is the canonical source for the same text wherever it appears on the platform.

## User Rights (declared here, implemented in later phases)
- **Right to know:** view every datum stored about you.
- **Right to export:** receive a portable bundle (JSON + Markdown) within 24 h.
- **Right to delete:** per-item OR full wipe; 30-day undo window.
- **Right to correct:** edit any mood/journal/memory item.
- **Right to refuse:** opt out of any optional feature (memory, voice, lifecycle email) without losing core access.
- **Right to escape:** account deletion is one button, two confirmations, no chat-with-retention friction.
- **Right to audit:** know who at MMHB has accessed your data (admin queries logged immutably).

## Safety Testing + Red-Team Practices (declared, implemented later)
- A standing prompt set of ≥ 50 adversarial inputs (jailbreak, self-harm, medication, legal/financial advice, role-override) runs against the AI surface on every release.
- Hard fail on any breach of the eight laws.
- Results stored in `docs/reports/RED_TEAM_<date>.md`.
- Independent review at minimum quarterly cadence.

## Memory + Personalization Transparency (declared)
- `client/src/lumi-memory/` already exposes `MemoryTransparencyView` + `MemoryResetButton`.
- Trust Center §6 (Memory Transparency) links into those surfaces; AI Transparency Center §6 explains them in plain language.
- No memory write happens without explicit consent moment on first conversation (existing `lumi-boundaries/` BoundaryCard).

## Crisis Routing Contract (cross-surface)
Both centers must:
- Show 988 + 741741 + 911 above the fold.
- Link to `/crisis` in the header and the footer.
- Never gate crisis information behind a click, a modal, or a login.
- Hard-code the numbers (never fetched at runtime).

## Domain Separation (kernel restated)
| Surface | HEALING content | PLATFORM content | BUSINESS content |
|---|---|---|---|
| `/trust` | only Crisis + safety framing | full | **forbidden** |
| `/ai-transparency` | none | full | **forbidden** |

A Trust Center page that contains a pricing CTA is a kernel violation and must be reverted.

## Build Sequence (Phase 105+ proposed, not executed here)
1. **Phase 105:** route/source ownership audit — confirm `/trust` and `/ai-transparency` are not currently claimed; map redirect needs.
2. **Phase 106:** content drafts — write all 20 sections in `docs/content/trust/` and `docs/content/ai-transparency/` as plain markdown.
3. **Phase 107:** component shells — `TrustShell`, `AiTransparencyShell` derived from `BrandShell`, no new design-system primitives.
4. **Phase 108:** wire routes + footer links + reciprocal links + crisis footer link.
5. **Phase 109:** a11y + reduced-motion + Lighthouse audit; lock at 100 a11y before merging.
6. **Phase 110:** red-team baseline + publish `RED_TEAM_<date>.md`.

Each Phase opens with a diagnose artifact and closes with verification (build + health + audit screenshot).

## Quality Gates this map binds future phases to
| Gate | Required | Tooling |
|---|---|---|
| build | `npm run build` exit 0 | npm |
| health | `/healthz` + `/readyz` + `/api/health` 200 | curl probe |
| routes | no taxonomy regression | `CANONICAL_ROUTE_TAXONOMY.md` audit |
| a11y | 0 critical / 0 serious | axe + Lighthouse 100 |
| bundle | within `PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md` | CI report |
| duplication | no second Trust/AI surface | route registry |
| privacy | no new PII surface without `/account/data` integration | manual review |
| rollback | one revert restores prior state | git |

## Linkage Map
- ↑ Parent governance: `AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (domains H + T + L)
- ↑ Kernel: `MMHB_v7.4_ARCHIVAL_KERNEL.md`
- → Companion registries: `registry/trust/trust-center-registry.json`, `registry/ai-governance/ai-transparency-registry.json`
- → Execution ledger: `docs/reports/PHASE_104_TRUST_AI_TRANSPARENCY_ARCHITECTURE.md`
- ⇄ Future content sources: `docs/content/trust/`, `docs/content/ai-transparency/` (Phase 106)
- ⇄ Existing live modules referenced: `client/src/lumi-memory/`, `client/src/lumi-boundaries/`, `client/src/lumi-disclaimer/`, `/crisis`
- ⇄ Privacy lock peer: `docs/reports/PHASE_99_PRIVACY_CANONICAL_DECISION_LOCK.md`

## Versioning
- v1.0 locked 2026-05-25 (this phase).
- Any future edit to the eight Non-Negotiable Laws requires a new phase report + a kernel addendum.
- Section additions are allowed; section removals require kernel sign-off.

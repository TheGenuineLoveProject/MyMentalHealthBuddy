# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support globally, striving to reduce stigma and empower individuals.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible
- DRY-RUN FIRST
- Non-destructive (never delete without permission)
- Educational only (no diagnosis, no treatment claims)
- Original writing only
- WCAG AA accessibility
- Calm, consent-based language
- Always include /crisis routing on wellness content
- Replit-safe execution only
- If unsure, ask ONE clarifying question. Never guess.

## Governance Kernel — MMHB v7.4 (Locked 2026-05-06)
All AI-assisted development is governed by the **MMHB v7.4 Archival Kernel** at `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`. Key contracts:
- **Primary Law:** Business logic never appears in healing flows; healing responses never contain pricing, conversion, or platform debugging.
- **Domain routing:** Every request classified as HEALING / BUSINESS / PLATFORM before solutioning. Cross-domain contamination is a critical failure.
- **Engine model:** Smallest valid engine wins (CSS fix > React patch > new component > new page > new service).
- **BHCE:** Crisis escalation overrides all rules; explicit self-harm signal → 988 + Crisis Text 741741 + 911 + `/crisis`. Asymmetric risk: err toward resource provision.
- **Execution discipline:** Diagnose with evidence → smallest patch → screenshot verify → build check → next blocker. Never skip verify, never multi-blocker, never proceed past a failed gate.
- **Replit mode:** Shell for mechanical work, AI for logic only, adapter mode (preserve structure, thin wrappers, zero breaking changes).
- **Output contract:** What changed (files+lines) / Before / After / Build status / Next step. No speculation, only verified fixes.
- **Circuit breaker:** Same bug recurring 3× after fix → architectural review, not another patch.

## Polish & Feature History

**Archive notice:** Entries older than v5.8.86 removed to keep this file lightweight. Entries v4.1.1 → v5.8.85 archived to `docs/replit-history.md`. Full deep-technical detail for every release lives in `docs/changelog.md`.

### Index (v5.8.86 – v5.8.94)

| Version | Date | Modules | Key Change |
|---|---|---|---|
| v5.8.94 | 2026-05-15 | replit.md (V45 ACTION 2 — row archival) + docs/replit-history.md (+7L) | V45 ACTION 1 already shipped in v5.8.93 (Quick Reference extraction, replit.md 94→75L). This cycle ships ACTION 2: archived 5 rows v5.8.80–v5.8.85 to `docs/replit-history.md` as 1-line summaries; bumped archive-notice cutoff (v5.8.80→v5.8.86) and Index range (v5.8.80–v5.8.93→v5.8.86–v5.8.94). Result: replit.md 75L → ~71L. Combined V45 (C1c+C1d) closes Phase 1 trim work. |
| v5.8.93 | 2026-05-15 | replit.md (V45 C1c — Quick Reference extraction) + docs/architecture.md (+22L appendix) | V45 GO-SIGNAL: extracted Quick Reference block (heading + 2 code blocks + changelog pointer = 20L) → `docs/architecture.md` Quick Reference appendix. Replaced with 1-line dual-pointer in Universal Contracts trailer. Per v5.8.89 honest-deficit analysis: this was the last significant extractable block. Result: replit.md 94L → 75L (−19, sub-80L target met ✅). Phase 1 EXIT-CLEAN under all V44 metrics. |
| v5.8.92 | 2026-05-15 | .archive/avatar-core/source/ (NEW 9 subdirs) + ./avatar-core/ (DELETED) + V44 governance ratified | V44 GO-SIGNAL: ratified V44 Integrated Governance V2 (ONE Authority Principle + Patch Rules ALLOWED/FORBIDDEN list) — already compliant per v5.8.86 audit (single runtime entrypoint server/app.mjs; otelApi.mjs `app.listen` reference is a code-comment, not boot path). Executed C2 iter #2 Path B per V34 SMALLEST_VALID_ENGINE: mass-archived remaining root SOURCE tree (alpha/edge-cleanup/masks/master/regions/rig-reference/shadow/transparent/verification = 9 subdirs, 22 files, ~22M) → `.archive/avatar-core/source/` in 1 op (vs 22 ops at 1-file/cycle); rmdir'd empty avatar-core/raw + avatar-core/ root. Gates: tsc 0, /+/chat+/crisis+/health+/ready 200, master+regions+shadow+lumi-path all 200 (active mirror at client/public/avatar-core/ untouched), 0 relative-import refs to archived paths. .archive/avatar-core/ now 24M / 23 files (full SSOT preserved); root tree size 22M→0M; root avatar-core/ no longer exists. C2 CLOSED. |
| v5.8.91 | 2026-05-15 | .archive/avatar-core/source/raw/ (NEW) + ./avatar-core/raw/ (emptied) | V43 C2 iter #1 — avatar-core/ orphan audit. CLASSIFY: client/public/avatar-core/* (16M, 24 files) ACTIVE per FloatIdleRig.jsx:76 + FloatIdleAnimated.jsx:71 + Presence.jsx:117 + avatar-life/index.ts:9; root ./avatar-core/* (24M, 23 files) SOURCE per FloatIdleRig.jsx:5-6 comment ("SSOT mirrored from repo avatar-core/"). ONE blocker: largest source file `MMHB_FLOAT_IDLE_UNIT_v1_raw.png` (1.5M) → `.archive/avatar-core/source/raw/`. Gates: tsc 0, /+/health 200, master/regions/shadow + lumi-path all 200 (active mirror untouched), 0 code refs to archived path. .archive/avatar-core/ now 1.5M / 1 file; root avatar-core/ 24M→22M. |
| v5.8.90 | 2026-05-15 | replit.md (V41 C1 iter — v5.8.86 cell trim) + docs/changelog.md (+62L) | Per V41 PHASE 2 literal: most-verbose remaining row = v5.8.86 (~2528 chars). Full detail prepended to `docs/changelog.md` as `# v5.8.86` heading; row collapsed to 1-sentence summary. Net replit.md line count: 91→92 (cell-trim is char-saving not line-saving; new row +1L). Honest result: V41's "30-40 lines saved per iter" is structurally impossible — table rows are single lines regardless of cell width. |
| v5.8.89 | 2026-05-15 | replit.md (V38 C1 iter #3 — System Architecture extraction) + docs/architecture.md (NEW) | Per maturity-first rule (Phase 1 must exit clean before C2): extracted 50L narrative (System Architecture sub-sections + External Dependencies manifest) → new `docs/architecture.md`; replaced with 3-line pointer in replit.md. Result: 137L → 91L (−46). Architecture narrative preserved verbatim. Closes V38 Cycle 1. |
| v5.8.88 | 2026-05-15 | replit.md (V38 Cycle 1 iter #2 — row archival) + docs/replit-history.md | Archived 15 rows v5.8.65–v5.8.79 from active Index → `docs/replit-history.md` (same pattern as v5.8.78 for v4.1.1–v5.8.64). Cell-trim alone capped at ~150L; row archival is the only path to <80L. Result: replit.md 151L → 136L (−15). Active Index now v5.8.80–v5.8.88. |
| v5.8.87 | 2026-05-15 | replit.md (V38 Tier C trim) + docs/changelog.md + .local/zombies/ | V38 Cycle 1 iter #1: v5.8.84 detail (2437 chars) → changelog; v5.8.86 archives moved from in-place to V37-spec `.local/zombies/` so published rollback works. v5.8.65-73 already trimmed in v5.8.78 (V38 list stale). |
| v5.8.86 | 2026-05-15 | server/ (zombie boot scaffold archive — 3 mv + 1 rm) | Archived `server/{index,dev}.mjs` zombie Express boot scaffolds + deleted 0-byte `server/app.ts`; architect-catch same-cycle archived orphan `server/tests/vitest.setup.mjs`. Single canonical entrypoint `server/app.mjs` confirmed. Full detail → `docs/changelog.md`. |

### Part B — Portal Token Audit (CLOSED)

- **Status:** NO-OP — deferred caveat moot
- **Finding:** Zero portal mounts in codebase (0 `createPortal`, 0 Radix UI, 0 Dialog/Toaster/Tooltip)
- All modals/dropdowns render inline in React tree — already inherit `.hxos-vnext` tokens via Phase 2-5 page wraps
- Architect deferred caveat closed by audit — no edits needed

### Universal contracts

Every polish layer above honors these (and any new layer must too):

- Scoped under a unique `.{name}-polish` wrapper class — zero leak risk.
- All accent / aura / particle / glow color values drawn from the canonical 8-hex brand palette (sage `#A8C9A0`, sunshine `#FFD93D`, blush `#FF9A8B`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`, mint `#A8D5BA`, warmth-orange `#FFB88C`, heart-amber `#E8913A`). Neutral base RGBAs (cream / white / black with low alpha) permitted only for ambient overlays, drop-shadows, and ring-on-white outlines, never as a brand accent.
- `prefers-reduced-motion: reduce` blanket: particles `display:none`, animations/transitions killed, transforms pinned.
- Z-index contract: decorative layers 0/1/2 → content `relative z-10`.
- Crisis routing (`/crisis`, 988, 741741) preserved on every wellness surface.

For complete per-version detail → `docs/changelog.md`. For Quick Reference (build/tsc/bundle commands + opt-in module import patterns) → `docs/architecture.md` (Quick Reference appendix).

## System Architecture & Dependencies

For the full architecture narrative (UI/UX, technical implementations, feature specs, system design choices) and external-dependency manifest, see `docs/architecture.md`.

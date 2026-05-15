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

**Archive notice:** Entries older than v5.8.80 removed to keep this file lightweight. Entries v4.1.1 → v5.8.79 archived to `docs/replit-history.md`. Full deep-technical detail for every release lives in `docs/changelog.md`.

### Index (v5.8.80 – v5.8.91)

| Version | Date | Modules | Key Change |
|---|---|---|---|
| v5.8.91 | 2026-05-15 | .archive/avatar-core/source/raw/ (NEW) + ./avatar-core/raw/ (emptied) | V43 C2 iter #1 — avatar-core/ orphan audit. CLASSIFY: client/public/avatar-core/* (16M, 24 files) ACTIVE per FloatIdleRig.jsx:76 + FloatIdleAnimated.jsx:71 + Presence.jsx:117 + avatar-life/index.ts:9; root ./avatar-core/* (24M, 23 files) SOURCE per FloatIdleRig.jsx:5-6 comment ("SSOT mirrored from repo avatar-core/"). ONE blocker: largest source file `MMHB_FLOAT_IDLE_UNIT_v1_raw.png` (1.5M) → `.archive/avatar-core/source/raw/`. Gates: tsc 0, /+/health 200, master/regions/shadow + lumi-path all 200 (active mirror untouched), 0 code refs to archived path. .archive/avatar-core/ now 1.5M / 1 file; root avatar-core/ 24M→22M. |
| v5.8.90 | 2026-05-15 | replit.md (V41 C1 iter — v5.8.86 cell trim) + docs/changelog.md (+62L) | Per V41 PHASE 2 literal: most-verbose remaining row = v5.8.86 (~2528 chars). Full detail prepended to `docs/changelog.md` as `# v5.8.86` heading; row collapsed to 1-sentence summary. Net replit.md line count: 91→92 (cell-trim is char-saving not line-saving; new row +1L). Honest result: V41's "30-40 lines saved per iter" is structurally impossible — table rows are single lines regardless of cell width. |
| v5.8.89 | 2026-05-15 | replit.md (V38 C1 iter #3 — System Architecture extraction) + docs/architecture.md (NEW) | Per maturity-first rule (Phase 1 must exit clean before C2): extracted 50L narrative (System Architecture sub-sections + External Dependencies manifest) → new `docs/architecture.md`; replaced with 3-line pointer in replit.md. Result: 137L → 91L (−46). Architecture narrative preserved verbatim. Closes V38 Cycle 1. |
| v5.8.88 | 2026-05-15 | replit.md (V38 Cycle 1 iter #2 — row archival) + docs/replit-history.md | Archived 15 rows v5.8.65–v5.8.79 from active Index → `docs/replit-history.md` (same pattern as v5.8.78 for v4.1.1–v5.8.64). Cell-trim alone capped at ~150L; row archival is the only path to <80L. Result: replit.md 151L → 136L (−15). Active Index now v5.8.80–v5.8.88. |
| v5.8.87 | 2026-05-15 | replit.md (V38 Tier C trim) + docs/changelog.md + .local/zombies/ | V38 Cycle 1 iter #1: v5.8.84 detail (2437 chars) → changelog; v5.8.86 archives moved from in-place to V37-spec `.local/zombies/` so published rollback works. v5.8.65-73 already trimmed in v5.8.78 (V38 list stale). |
| v5.8.86 | 2026-05-15 | server/ (zombie boot scaffold archive — 3 mv + 1 rm) | Archived `server/{index,dev}.mjs` zombie Express boot scaffolds + deleted 0-byte `server/app.ts`; architect-catch same-cycle archived orphan `server/tests/vitest.setup.mjs`. Single canonical entrypoint `server/app.mjs` confirmed. Full detail → `docs/changelog.md`. |
| v5.8.85 | 2026-05-15 | sections/VisualBenefits.jsx (V25 Avatar Mapping Fix — 1 line) | INSPECT-first audit confirmed v5.8.71 already wired 3 of 4 V25-spec'd benefit sections correctly (Breathe→meditation/POSE D, Name-it→heart/POSE B, Not-alone→companion/POSE A). Only mismatch: "Grow at your own pace." L113 used `lumi-float-idle.png` (POSE G) but V25 demands POSE F (Walking Path) — exactly the `lumi-path.png` v5.8.84 just commissioned via IMG_4349. The pre-existing L110-112 comment explicitly said "Replace with sprout walking-path when commissioned." Smallest valid engine: 1-line src swap + comment update referencing V25 closure. Hero swap rejected per V34 SMALLEST_ENGINE — CanvaLanding.jsx L560 uses FloatIdleAnimated (v5.8.46 11-region animated SVG rig with breathing 7.1s + floating 9.3s + blink + glow halo); replacing with static PNG would destroy animated mascot architecture (L11 import comment marks hero as "intentionally untouched"). Architect PASS. tsc 0 errors, vite 24.52s, /+/chat+/crisis 200, /lumi/official/lumi-path.png 200/682KB. POSE E (check-in emotion-orbs) deferred — no homepage check-in surface renders static avatar today; needs stakeholder clarification before /checkin page touch. |
| v5.8.84 | 2026-05-15 | client/public/lumi/official/ (8 PNGs) + MANIFEST.md + attached_assets/ cleanup | Canonical avatar reinstall — 7 IMG_434* PNGs installed (incl. lumi-path.png closing 6-month sprout walking-path gap), 33 attached_assets files purged, registry L142 src fixed (architect catch). Full detail → docs/changelog.md. |
| v5.8.83 | 2026-05-15 | LumiV7.jsx (P7 — Avatar Life System Phase 3: Arm & Leg Movement) | INSPECT-first found P7 was 95% already shipped — LumiV7.css L116-185 had every required CSS class (6 arm poses, 5 leg poses, ±30° rotation, 800ms ease-in-out, walk/wave/bounce keyframes, crisis stillness override L223-230, prefers-reduced-motion blanket L233-241). EMOTION_STATES (lumiEmotionMap.ts L88-124) had carried `armPose` + `legPose` for all 7 V24 emotions since v5.8.10. The actual gap: v5.8.79 P4 emotion-derivation block (L101-103) only consumed eye+mouth, ignoring the arm+leg fields right next to them. Smallest valid engine: 1 file, ~7 net lines. Renamed `arm`/`leg` props to `armProp`/`legProp` (mirroring eye/mouth pattern), added 3-line derivation block with same precedence (explicit prop → crisis-pin "rest" → V24 derived → "rest" default), bridged the one type collision (`heart-hold` in V24 type → `heart` in CSS class) with a single ternary. JSDoc updated to reflect emotion now derives all 4 (eye+mouth+arm+leg). Backward-compatible: AvatarLab's 3 explicit-prop callers still win the precedence chain — zero behavior change for existing surfaces. New behavior only triggers when a parent passes `emotion` without explicit arm/leg, e.g. `<LumiV7 emotion="joy" />` now shows happy eyes + excited mouth + present arms + bouncing legs (vs v5.8.82's silent rest+rest). Crisis stillness preserved (CSS L223-230 + crisis branch in derivation pins to "rest"). DUPLICATION_GATE: did not create LumiV6 P7 module per V35 spec literal — LumiV6 is preview-only PNG-based and would have failed the gate; LumiV7 is the active animated avatar where P4 (eyes) + emotion wiring already shipped. tsc 0 errors, vite 18.39s, /+/settings+/chat+/crisis 200, /health ok. P3/P5/P8-P10 + LUMI_PATH commission deferred. |
| v5.8.82 | 2026-05-15 | Settings.jsx + MemorySettingsPanel.tsx hook fix + Footer.jsx + CanvaLanding.jsx mobile menu (P6 activation surface) | INSPECT-first uncovered MemorySettingsPanel.tsx had a pre-existing compile-blocker: lines 34-35 referenced `useMemoryStore`/`selectConsent`/`selectLiveEntries` directly but none were imported (raw store + internal selectors are intentionally NOT exported from barrel per Phase 16 contract; the public hooks `useMemoryConsent` + `useMemoryLiveEntries` were imported at L12-13 but never used). File would have crashed first time it ran — explains why Phase 16 stayed shelved. Smallest valid engine: 4 files. (1) Fix panel hooks to use the imported public read surface. (2) Mount panel + transparency view in `/settings` (`pages/Settings.jsx`) between Privacy and Referral sections — a 17-line `<section>` block with `Brain` icon, opt-in copy, and explicit "never feelings, vulnerabilities, or crisis history" reassurance. (3) Footer.jsx: add Settings link with cog icon between Newsletter and Disclaimer (public — `ProtectedRoute` redirects unauthed to login). (4) CanvaLanding.jsx mobile hamburger Account section: gate Settings link on `isAuthenticated()` so signed-in users see it under "My Dashboard" (per user spec: mobile + footer, NOT desktop header). Result: clicking "Allow gentle memory" in /settings flips `consent.state="granted"` → v5.8.80 ReturnLoop tier-aware welcome auto-activates on next visit (writes silently no-op'd until consent granted, so this is the one button that turns P6 on for real users). tsc 0 errors, vite 19.81s, /health+/ready+4 routes 200 (incl /settings). P7 (Arm & Leg Movement) queued as next blocker per user. |
| v5.8.80 | 2026-05-15 | ReturnLoop.jsx + lumi-memory store persistence (P6 Path B — Emotional Continuity, first Phase 16 consumer) | INSPECT-first uncovered the dormant Phase 16 Reflective Memory Layer (`client/src/lumi-memory/`) — fully built, hardened (consent + retention + audit + forbidden-pattern scan), 0 production callers. P6 ask was already over-spec'd by Phase 16 — gap was wiring + persistence. Smallest valid engine: 2 files. ReturnLoop now (a) reads prior `lastSessionAt` via `readMemory()` BEFORE writing fresh, (b) computes days-since-last, (c) picks message from tier subset (`<1d` short / `1-7d` medium / `7+d` long), (d) writes new `lastSessionAt` via `writeMemory()` (silently no-ops when consent unset/declined — intentional). All 10 messages preserved across tier indices `[0,2,3]/[1,5,9]/[4,6,7,8]` (none orphaned, no new copy). useMemo→useState; try/catch falls back to v5.6 random on any router failure. **Architect catch:** memoryStore.ts had no persist middleware — `lastSessionAt` would have evaporated on every reload, making P6 dead in production. Wrapped Zustand `create()` with `persist(...)` + `createJSONStorage(localStorage)` + `partialize` (consent + entries only; audit stays in-memory). Tier boundary tightened from `<= 7` to `< 7` so day-7 routes to long per spec literal "7+". Pre-opt-in users see zero UX change. tsc 0 errors, vite 18.80s, /health+/ready+3 routes 200. P3/P7-P10 + LUMI_PATH commission + chat pilot deferred. |

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

### Quick Reference

```bash
# Build verification
npm run build                  # vite ~16s clean

# Type check
npx tsc --noEmit               # clean across all 16 opt-in modules

# Bundle size
# 751.39 kB main (modules tree-shaken; zero production wiring)
```

```ts
// To import a module: opt-in — import what you need, nothing more
import { COLORS, alpha } from "@/lumi-tokens";
import { translateNegation } from "@/lumi-language";
import { REQUIRED_DISCLAIMER, enforceDisclaimer } from "@/lumi-disclaimer";
```

For complete per-version detail, file breakdowns, and architect reviews → see `docs/changelog.md`.

## System Architecture & Dependencies

For the full architecture narrative (UI/UX, technical implementations, feature specs, system design choices) and external-dependency manifest, see `docs/architecture.md`.

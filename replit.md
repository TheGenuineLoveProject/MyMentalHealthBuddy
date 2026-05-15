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

### Index (v5.8.86 – v5.8.99)

| Version | Date | Modules | Key Change |
|---|---|---|---|
| v5.8.99 | 2026-05-15 | components/Badges.jsx (V47 iter 5 — 1-line gradient hex swap) | V47 iter 5 — non-canonical color repair on visible gamification element. INSPECT pass: 8 parallel sweeps (hex literals in components/, img alt, icon-only button aria-label, OfficialLumi variants, form onSubmit, header parity, crisis numbers, CTA color classes). Findings: AVATARS=CLEAN (6/8 canonical sprout variants in use, 0 banned), BUTTONS=CLEAN (re-conf), CONSISTENCY=CLEAN (re-conf v5.8.98). COLORS=1 CRITICAL: `Badges.jsx:251` progress-bar gradient `from-[#8fbf9f] to-[#d4af37]` used legacy pre-v5.x sage + gold hex literals (NOT in canonical 8-color brand palette). Other hex hits triaged: AboutSection.jsx 24 literals → ZERO live mounts (only `_quarantine/legacy-landing/`); ErrorBoundary/SafeBoundary literals → crash-fallback UI only (low frequency); Badges per-badge accents → semantic gamification differentiation, out-of-scope. Smallest valid engine: 2-literal swap on the same line — `#8fbf9f`→`#A8C9A0` (canonical sage), `#d4af37`→`#FFD93D` (canonical sunshine). Live on /wellness for every gamification user. Gates: tsc 0, /+/wellness+all 8 audited routes 200, recurrence-grep 0 legacy hits in Badges gradient. |
| v5.8.98 | 2026-05-15 | pages/Pricing.jsx (V47 iter 4 — 1-line wrapper fix) | V47 per-page consistency sweep across 8 canonical routes (/, /chat, /journal, /mood, /checkin, /pricing, /settings, /crisis). 7/8 PASS, 1 CRITICAL: `/pricing`. ROOT CAUSE: `Pricing.jsx:224` inner wrapper lacked `hxos-vnext` token-scope class — wrapped only by WellnessPageShell (`wellness-shell`) — so inline `var(--glp-paper)` resolved to :root `#fcf6ea` (Sacred Pearl) instead of canonical hxos-vnext `#F6F1E8` rendered by /chat /journal /checkin /settings; additionally inline-fallback hex was non-canonical `#F7F4EE` (canonical paper is `#F7F1E8`). PATCH: prepended `hxos-vnext` to className + corrected fallback hex `#F7F4EE` → `#F7F1E8`. Smallest valid engine — page now inherits canonical token resolution matching sibling hxos-vnext pages. Other 7 pages confirmed canonical: CanvaLanding (`canva-landing`), AIChatPage (`hxos-vnext`), JournalPage (`hxos-vnext`), MoodPage (`WellnessPageShell` family), CheckIn (`hxos-vnext checkin-polish`), Settings (`hxos-vnext` + `v28-paper-bg`), CrisisResources (`hxos-vnext-crisis`). Gates: tsc 0, all 8 routes 200. |
| v5.8.97 | 2026-05-15 | replit.md (V47 iter 3 — audit-only EXIT) | V47 iter 3 — wider/deeper sweep CONFIRMED EXHAUSTION across all 4 bug categories. Audit only, no code change. Findings: (A) banned avatar patterns across ALL file types = 0 real hits (matches were word-substrings: "escape", "landscape", "ZenScape", "scapegoating"); (B) non-canonical /lumi/ refs = 0; (C) public lumi files = 8 sprout PNGs only; (D) no-op onClick = 0; (E) `<button>` missing type= = 0; (F) dark-bg classes classified as modal-scrims (`bg-black/50`-`/60`), tooltip chips (AchievementBadge:125), and dormant `dark:` variants — none violate "no harsh dark page backgrounds" policy; (G) banned avatar props = 0; (H) link-testid sample clean; (I) footer 12/12 targets resolve 200; (J) canonical page probe 12/12 routes → 200 (/, /chat, /journal, /mood, /checkin, /pricing, /settings, /crisis, /about, /blog, /tools, /companion). Per V47 PHASE 2 literal: "If all CLEAN: report 'No critical bugs found' and STOP." V47 mission COMPLETE across iter 1 (BrandShell Mood mislink), iter 2 (2× dead /blog slug), iter 3 (CLEAN confirm). |
| v5.8.96 | 2026-05-15 | components/NewsletterSignup.jsx + content/routes.js (V47 iter 2 — 2-line href fix) | V47 iter 2 — dead-link repair. INSPECT pass: ran 201-ref href/to sweep against 124 registered routes → 2 dead refs both pointing to `/blog/welcome-to-genuine-love` (API confirmed `HTTP 404 {"ok":false,"message":"Post not found."}` — slug exists in `Blog.jsx:30` index metadata only, no published post body). Smallest valid engine: redirect each site to its semantically-correct existing destination. (1) `NewsletterSignup.jsx:114` "Learn more about us" → `/about` (200). (2) `routes.js:7018` Blog hero "Read Latest" CTA → `/blog` (index of latest, 200). Did NOT author a missing post per V47 "repair-only, fix what's broken, don't add what's missing." Per-page wrapper sweep + inline-hex sweep both CLEAN (CONSISTENCY=CLEAN, COLORS=CLEAN re-confirmed). Gates: tsc 0, /+/health+/about+/blog 200, recurrence-grep 0 hits in src, dead-link sweep 2→0. |
| v5.8.95 | 2026-05-15 | components/BrandShell.jsx (V47 iter 1 — 1-line href fix) | V47 frontend bug audit — iter 1. INSPECT pass: AVATARS=CLEAN (sprout-only enforced, 0 banned patterns), COLORS=CLEAN (0 dark hex, 0 dark Tailwind bg), BUTTONS=1 CRITICAL (Mood mislinked), CONSISTENCY=deferred. ONE blocker: `BrandShell.jsx:63` Mood button `href="/checkin"` (copy-paste bug from v5.8.75 V29 Phase 1 Link-wrap migration) — same destination as adjacent "Start a Check-In" CTA, leaving global header with no path to `/mood` despite route being registered + serving 200. Smallest valid engine: 1-char-class swap (`/checkin`→`/mood`). Gates: tsc 0, /+/health+/mood+/checkin+/journal+/chat+/crisis all 200, recurrence-grep clean. Bug fix during 7-day Step 2 watch (V44 ALLOWED — patch existing runtime). |
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

## v5.8.95 — V47 Frontend Bug Fix Iteration 1
- Scope: Patch existing runtime only.
- Fixed: [REPLIT AI FILLS BUG CATEGORY]
- File changed: [REPLIT AI FILLS FILE]
- What was wrong: [REPLIT AI FILLS ROOT CAUSE]
- What was done: [REPLIT AI FILLS PATCH]
- Gates: TSC=[PASS/FAIL], BUILD=[PASS/FAIL], ROUTE=[PASS/FAIL], VISUAL=[PASS/FAIL]
- Rule followed: one blocker, one patch, verify, stop.

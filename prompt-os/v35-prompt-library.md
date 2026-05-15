# V35 — All Replit Prompts (Complete Library)

**MyMentalHealthBuddy** — every prompt for remaining work under HX-OS QUANTUM ∞ Governed Execution.

- **Version:** 35.0
- **Date:** 2026-05-12
- **Status:** PROMPT LIBRARY — use as needed, **ONE at a time**
- **Location:** `prompt-os/v35-prompt-library.md`
- **Governs:** every cycle still runs under `prompt-os/v34-governed-execution.md` (INSPECT → CLASSIFY → ONE BLOCKER → PATCH → VERIFY → DOCUMENT → STOP)
- **Spec source:** `prompt-os/current-platform-analysis-layer.md` (HX-OS vNEXT analysis layer)

---

## Index

| # | Prompt | When to use | Status |
|---|---|---|---|
| 1 | Fix missing analysis script | `scripts/run-platform-analysis.sh` not found | ✅ **Closed v5.8.77 / re-verified Prompt 1 cycle** — script extant, idempotent, snapshot fresh |
| 2 | Commission sprout walking-path render | Close last hooded avatar gap (`LUMI_PATH`) | ⏸️ **Queued NEXT** — awaiting asset-generation path decision |
| 3 | Audit `client/public/avatar-core/` | Classify master-grid source images | ⏸️ Pending |
| 4 | Avatar Life — eye coordination | Start avatar life system | ⏸️ Queued (after P2) |
| 5 | Avatar Life — mouth coordination | Eye coordination complete | ⏸️ Pending (depends on P4) |
| 6 | Emotional Continuity System | Highest-priority feature gap | ⏸️ Queued (after P4) |
| 7 | Arm & leg movement | Eye + mouth complete | ⏸️ Pending (depends on P4-5) |
| 8 | Full 23-section platform analysis | Want comprehensive diagnostic | ⏸️ On demand |
| 9 | Verify Growth quote block fix | Confirm v5.8.67-68 still correct | ⏸️ On demand |
| 10 | Deep clean `replit.md` (v5.8.65-73) | Reduce file further | ✅ **Closed in last cycle** — v5.8.67-72 trimmed, total index 12.4k → 5.9k chars |

---

## Prompt 1 — Fix missing analysis script

**Use when:** `scripts/run-platform-analysis.sh` not found.

- T1: Search `scripts/`, `prompt-os/`, alt names, check `docs/diagnostics/` exists
- T2: If found at wrong path, symlink/copy to `scripts/`
- T3: If truly missing, recreate as **read-only idempotent diagnostic runner** writing 6 outputs (`platform-tree.txt`, `code-files.txt`, `runtime-scan.txt`, `frontend-api-scan.txt`, `domain-scan.txt`, `SUMMARY.txt`); use `rg` with `grep` fallback
- T4: Run + confirm `docs/diagnostics/` populated

---

## Prompt 2 — Commission sprout walking-path render

**Use when:** ready to close the last hooded gap.

**Current state:** `LUMI_PATH` substituted with `lumi-float-idle.png` (only remaining hooded canonical asset).

**Visual DNA (immutable):** cream `#F5F0E8`, sage belly `#A8C9A0`, glossy black dot eyes, simple smile, soft pink blush `#F5A3A3`, sage sprout center-top.
**Pose:** Lumi walking forward on a path, hopeful expression.
**Style:** 3D plush, matte soft-touch, chibi proportions, no sharp edges, transparent BG, ≥512×512.
**Forbidden:** hood, long ears, bunny features.

**Deliverable:**
- Generate via available tools
- Save to `client/public/lumi/official/lumi-path.png`
- Create WebP variant
- Update `MANIFEST.md`
- Update `officialLumiRegistry.ts` to point at new file
- `tsc --noEmit` clean

---

## Prompt 3 — Audit `client/public/avatar-core/`

**Context:** master/regions/shadow subdirs likely contain source images for 6-pose grids.

- T1: List recursively (size, format, refs)
- T2: Classify each as ACTIVE / SOURCE / ORPHAN / DUPLICATE
- T3: Recommend action (keep / archive / integrate / delete)
- T4: Execute **safe actions only** (archive, never delete)

`tsc --noEmit` after.

---

## Prompt 4 — Avatar Life System: Eye Coordination

**Body is FROZEN. Only eyes + mouth evolve.**

- T1: 4 eye CSS classes — `.lumi-eye--default|wide|soft|happy`
- T2: Eye tracking — max ±10px H, ±6px V, lerp `calm:0.05` / `normal:0.12`, smooth
- T3: Randomized blinking — 2000-6000ms interval, 150ms duration, 15% double-blink
- T4: Wire to emotion state (calm→soft, greeting→default, empathy→soft, support→default, joy→happy, surprise→wide, sleepy→soft)

**Constraints:** body frozen, CSS-only, `prefers-reduced-motion` disables all, crisis = static eyes. `tsc` after each task.

---

## Prompt 5 — Avatar Life System: Mouth Coordination

**Depends on P4.**

- T1: 10 mouth CSS classes — `.lumi-mouth--happy|calm|surprise|sleepy|open|worried|excited|loving|focused|breathing`
- T2: Coordination — eyes lead, mouth follows 100ms; easeInOut 600ms; no abrupt changes
- T3: Wire to same emotion mapping as P4

**Constraints:** simple curved line only (no teeth/lips), CSS-only, reduced-motion off, crisis static.

---

## Prompt 6 — Emotional Continuity System

**Highest-priority missing feature** (Emergent Companion Intelligence).

- T1: Emotion memory store (last state, last interaction TS, journey progress, streak data — all `localStorage`)
- T2: Return detection (returning vs first visit, time since last, emotional context)
- T3: Continuity responses
  - `< 1 day` → "Welcome back. How has your heart been?"
  - `1-7 days` → "I'm glad you came back."
  - `7+ days` → "However you're feeling — it's okay. We're here."
- T4: Emotional journey tracking (trends, gentle viz, celebrate small wins, **never guilt-trip absence**)

**Constraints:** privacy-first (client-side only), no streak-anxiety, gentle tone, integrates with existing `ReturnLoop` component. `tsc --noEmit`.

---

## Prompt 7 — Arm & Leg Movement

**Depends on P4-5.**

- T1: 6 arm poses — `.lumi-arm--rest|wave|hug|point|present|heart` (max ±30°, 800ms)
- T2: 5 leg poses — `.lumi-leg--rest|sit|walk|bounce|tuck` (max step 8px, bounce 12px, 600ms)
- T3: Coordination — arms+legs move together per emotion; body posture adjusts (5 types: upright/curious/leaning/relaxed/bouncy)

**Constraints:** CSS-only, reduced-motion off, crisis static.

---

## Prompt 8 — Full 23-section platform analysis

**Use when:** want comprehensive diagnostic.

Sections: Platform Overview · Runtime Architecture · Frontend State · API Contracts · DB/Storage · Avatar System · Content System · Conversion Funnel · Safety & Crisis · Accessibility · Performance · Security · Deployment Pipeline · Dependency Health · Duplicate Detection · Dead Code · Broken Routes · Missing Features · Content Gaps · SEO Status · Mobile Experience · Error Handling · Recommendation Priority.

**Source:** `docs/diagnostics/` snapshot (~13k lines). Cross-ref live code where needed. HARD TRUTH per section. Identify ONE blocker. Document smallest safe patch.

---

## Prompt 9 — Verify Growth quote block fix

**Use when:** confirm v5.8.67-68 fix still correct.

1. Navigate to `/`
2. Scroll to "Being a human is hard…" section
3. Screenshot
4. Verify: light sage bg (NOT dark), white card with sage top accent, dark text on white (NOT white-on-dark)

If any check fails → report immediately with screenshot.

---

## Prompt 10 — Deep clean `replit.md`

**Use when:** further reduce file size.

Roll v5.8.65-73 verbose rows into `docs/changelog.md` (same pattern as v5.8.74-76). Keep Universal Contracts block inline. **Goal:** `replit.md` under 80 lines.

**Status:** v5.8.67-72 portion completed in v5.8.78 cycle (12.4k → 5.9k chars index). Remaining lift to <80 lines requires also collapsing the Governance Kernel + System Architecture prose blocks — separate decision.

---

## V34 ↔ V35 relationship

| Doc | Role |
|---|---|
| `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` | WHAT must always be true (Primary Law, BHCE) |
| `prompt-os/current-platform-analysis-layer.md` | HOW to gather evidence (diagnostic spec) |
| `prompt-os/v34-governed-execution.md` | WHEN/WHY to act (finite-state cycle, 6 phases, 6 gates) |
| `prompt-os/v35-prompt-library.md` (this) | WHICH prompt to run for which situation |

**ONE prompt per cycle. ONE blocker per cycle. Verify before declaring done. Document before stopping.**

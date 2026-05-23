# MMHB Content Cohesion Audit

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive audit — no copy edits

---

## 1. Brand voice

### 1.1 Canonical statement

> "MyMentalHealthBuddy by The Genuine Love Project — AI-powered mental wellness platform."

Source: `replit.md:1` + `client/src/shared/brand/copy.js`.

### 1.2 Tone mandate (kernel)

Trauma-informed · supportive · non-clinical · consent-based · calm · educational only · WCAG AA · gentle, compassionate, accessible (per replit.md User Preferences + MMHB v7.4 kernel).

### 1.3 Name consistency

| Form | Where used | Verdict |
|---|---|---|
| `MyMentalHealthBuddy` | full canonical | ✅ consistent |
| `MMHB` | abbreviation | ✅ used in tech contexts, not user copy |
| `My Mental Health Buddy` (spaced) | not found | ✅ no drift |
| `MMHB™` | not found | ✅ no fake-trademark drift |

**No product-name inconsistencies observed.**

## 2. Brand palette — drift detected

### 2.1 Canonical 8-hex palette (per replit.md governance kernel)

| Token | Canonical hex |
|---|---|
| sage | `#A8C9A0` |
| sunshine | `#FFD93D` |
| blush | `#FF9A8B` |
| calm-blue | `#74C0FC` |
| empathy-purple | `#C8B6FF` |
| mint | `#A8D5BA` |
| warmth-orange | `#FFB88C` |
| heart-amber | `#E8913A` |

### 2.2 Observed in code

| Token (code) | Observed hex | Canonical | Match |
|---|---|---|---|
| `serenitySage` (`client/src/brand/tokens.ts:8`) | `#8FBF9F` | `#A8C9A0` | ❌ **drift** |
| `eternalGold` (`client/src/brand/tokens.ts`) | `#D4AF37` | `#FFD93D` (sunshine) | ❌ **drift** |
| `softBlush` (`client/src/brand/tokens.ts`) | `#E5B8AE` | `#FF9A8B` | ❌ **drift** |
| `deepTeal` (`client/src/brand/tokens.ts`) | `#2F5D5D` | `#74C0FC` (calm-blue) | ❌ **drift** (different color entirely) |
| `sageGreen` (`tailwind.config.js`) | `#8fbf9f` | `#A8C9A0` | ❌ **drift** (same as serenitySage) |
| `metallicGold` (`tailwind.config.js`) | `#d4af37` | `#FFD93D` | ❌ **drift** |

### 2.3 Verdict — **HIGH severity finding**

The implemented palette is a **richer, more saturated, more "sacred"-style** palette than the canonical kernel palette (which is softer/pastel). Both are internally consistent — i.e., `client/src/brand/tokens.ts` and `tailwind.config.js` agree with each other. The drift is between **(code as implemented)** and **(kernel as documented in replit.md)**.

Two possible resolutions, both requiring a dedicated planned phase:

1. **Update the kernel palette** to match the implemented one. The implemented palette appears to be the actual designer intent; the kernel doc may be stale.
2. **Migrate the code** to the kernel palette. The implemented palette is technical debt from an earlier "Sacred" design direction.

This audit does not choose — both files would be edits, and the choice is a design + governance decision for the user.

## 3. Crisis content

### 3.1 F-33.6 literal presence (source verification)

| Literal | Location | Verified |
|---|---|---|
| `988` | `client/src/pages/CrisisResources.jsx:12` + `client/src/lumi-crisis/resources/crisisResources.ts` | ✅ |
| `741741` | `client/src/pages/CrisisResources.jsx:22, 31` | ✅ |
| `911` | `client/src/pages/CrisisResources.jsx:138` | ✅ |
| `/crisis` | route in `client/src/App.jsx` ~line 479 | ✅ |
| `Crisis Text Line` | `client/src/pages/CrisisResources.jsx:19` | ✅ |

### 3.2 Live verification

Production probe (2026-05-23 19:58 UTC) confirms **5/5 literals** in `/crisis` response body.

### 3.3 Crisis routing presence

See `docs/audits/DOMAIN_SEPARATION_AUDIT.md` §6 for the cross-surface presence table. **Footer fivelet** (§2.2 of duplication scan) is the only residual risk.

## 4. Tone on healing surfaces

| Surface | Finding | Severity |
|---|---|---|
| `/crisis` page | calm, direct, action-oriented; non-clinical | ✅ clean |
| Mood / Journal pages | supportive defaults; no clinical language | ✅ clean |
| AI companion (Lumi) | "Hello, beautiful soul"; "Share what's on your heart" — calm, compassionate | ✅ on-voice |
| `client/src/pages/tools/PHQ9Assessment.jsx` | clinical terms: "symptoms", "severity band", "moderate depression" | **MED** — necessary for screening tool, but contrast with kernel mandate |
| `client/src/pages/tools/GAD7Assessment.jsx` | same as PHQ9 | **MED** |
| AI fallback responses | canned supportive phrases (`SUPPORTIVE_RESPONSES`) | **LOW** — voice preserved on error but repetitive when triggered often |

### 4.1 Aggressive sales language

Grep across all `.jsx`/`.tsx` for "limited time", "act now", "FOMO" patterns on healing surfaces — **none found**. Sales-pressure tactics are absent from healing flows.

## 5. User journey continuity

See `docs/maps/USER_JOURNEY_MAP.md` for the full map. Cohesion findings from journey perspective:

| Break | Severity |
|---|---|
| Two onboarding routes (`Onboarding.tsx` + `OnboardingFlow.jsx`) — users can land on either | MED |
| Two mood surfaces (`MoodTracker.jsx` + `MoodPage.jsx`) | MED |
| Four chat surfaces (see duplication scan §2.5) — state does not persist across them | HIGH |
| AICompanion uses hardcoded `INITIAL_MESSAGES` — context loss between sessions if not persisted | MED |
| 1,036 routes in App.jsx — many lazy-loaded; risk of "Coming Soon" or NotFound dead-ends for unimplemented features | LOW |

## 6. Documentation health

### 6.1 Reference integrity

| Referenced from `replit.md` | Exists? |
|---|---|
| `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` | ✅ |
| `docs/architecture.md` | ✅ |
| `docs/changelog.md` | ✅ |
| `docs/replit-history.md` | ✅ |

### 6.2 Coverage

| Subdirectory | .md count | Health |
|---|---:|---|
| `docs/governance/` | several incl. kernel | active |
| `docs/operations/` | 4 (registry, runbook, checklist, matrix) | active |
| `docs/reports/` | grows per phase (incl. 50, 51, 52, 53, 54, 55) | active |
| `docs/architecture/` (new this phase) | 3 (system map, route registry, state graph) | active |
| `docs/audits/` (new this phase) | 3 (duplication, domain, content) | active |
| `docs/maps/` (new this phase) | 1 (user journey) | active |
| `docs/verification/lumi-*/` | 14 sub-areas, each with 1 verification doc | observational |
| `docs/vision/` | 1 file | observational |

**Total `docs/**/*.md`: ~379.** Among the highest-density doc trees observed; some pruning may be warranted in a planned phase, but each tree is internally coherent.

### 6.3 Stale references

- `docs/changelog.md:46-47` notes `CHECKIN_IS_HEALING_FLOW` orphan + stray `AIChatPanel.tsx` — flagged as pending follow-ups.
- `docs/API_REFERENCE_v5.1.md` may reference endpoints now in modular files; observational.

## 7. Changelog hygiene

- Current version: **v5.8.137**
- Last entry: Iter 22 / v5.8.137 / P3E-6 — `client/src/pages/tools/MeditationPlayer.jsx`
- `replit.md` archives entries older than v5.8.100 to `docs/replit-history.md` — index discipline is good

## 8. Net content cohesion posture

| Dimension | Verdict |
|---|---|
| Brand name | ✅ consistent |
| Brand voice on healing | ✅ on-voice with two MED exceptions (PHQ-9, GAD-7) |
| Brand palette (code vs kernel) | ❌ **drift across 4+ tokens** |
| Crisis content (F-33.6) | ✅ 5/5 in source + live production |
| Crisis routing presence | ✅ multi-surface; footer fivelet is residual risk |
| Sales pressure on healing | ✅ none |
| Documentation reference integrity | ✅ all referenced docs exist |
| User journey continuity | ⚠️ multiple competing surfaces for onboarding, mood, chat |

---

*The brand palette drift (§2) is the single content-cohesion item most likely to merit a deliberate planned phase — it touches both code and governance docs and requires a design decision. All other findings are tractable in a future cleanup pass with the smallest-valid-engine rule applied per item.*

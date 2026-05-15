# Phase 28 — Avatar Governance

## Canonical variants (7)

| ID | Name | Emotional role | Priority |
|---|---|---|---|
| `LUMI_CALM_FLOAT` | Calm Float Lumi | Ambient calm, grounding, idle presence | 1 |
| `LUMI_HEART` | Heart Lumi | Reassurance, compassion, warmth | 2 |
| `LUMI_MEDITATION` | Meditation Lumi | Breathing, mindfulness, rituals | 3 |
| `LUMI_COMPANION` | Companion Lumi | Listening, reflection, companionship | 4 |
| `LUMI_PATH` | Path Lumi | Onboarding, journey, forward movement | 5 |
| `LUMI_EMOTION_ORB` | Emotion Orb Lumi | Emotional awareness, literacy | 6 |
| `LUMI_SOFT_PRESENCE` | Soft Presence Lumi | Ambient support, silent companionship | 7 |

### Notes
- `LUMI_COMPANION` was renamed from "Angel Lumi" — religious framing was off-tone for a non-clinical wellness product.
- `LUMI_SOFT_PRESENCE` is new in this phase — fills the homepage-anchor gap that `LUMI_CALM_FLOAT` was being stretched to cover.

## Variant selection rules (5)

1. **Scene assignment is authoritative.** If `lumiSceneAssignments.SCENE_ASSIGNMENTS` defines a variant for a scene, that assignment wins. Hosts may pass `variantOverride` only to use the scene's declared `fallback`.
2. **One Lumi per section.** No section may render more than one Lumi at a time. Repetition turns presence into decoration.
3. **Emotional role match.** A variant must only be used in contexts that match its `useWhen` list and avoid all of its `neverUseWhen` list.
4. **Size limits enforced.** `OfficialLumi` clamps `widthPx` to `min(requested, getMaxSizeForContext(position, isMobile), variant.sizeLimits[position])`. Mobile reduces caps by 15%.
5. **No decoration spam.** Lumi must not be used as bullet markers, icon spacers, or visual filler.

## Motion governance (reference Phase 27)

- Breath cycle: **7100ms** (inhale 2800 / hold 400 / exhale 3600 / rest 300).
- Scale band: **1.000–1.018**. No further.
- Rotation: **±0.4°**. Translate: **±4px**.
- Blink interval: **3000–7000ms** random.
- Glow opacity: **0.08–0.18** band.
- All motion suppressed under `prefers-reduced-motion`.
- No bounce, spring, overshoot, confetti, sparkles, shake, vibrate, strobe, or attention-pulse.

## Accessibility requirements

- Decorative Lumi: `aria-hidden="true"`, no focus, no contrast contract.
- Meaningful Lumi: `role="img"` + descriptive `aria-label`.
- Interactive Lumi: 44×44 minimum touch target.
- All animation honors `prefers-reduced-motion`.

## Enforcement mechanism

Two-layer:

1. **Dev-time warnings** — `OfficialLumi` and `LumiSceneRenderer` show a red dashed border + console warning on placement violations when `process.env.NODE_ENV === "development"`. Production renders silently with the safe fallback (size clamped, no overlay).
2. **Silent correction** — size violations are clamped, not thrown. Unknown variants render a zero-size `role="img"` placeholder. Unassigned scenes render an inline error span (visible only in dev). UI never crashes on a misconfigured Lumi.

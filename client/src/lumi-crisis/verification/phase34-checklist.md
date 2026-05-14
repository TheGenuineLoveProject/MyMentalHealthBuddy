# Phase 34 — lumi-crisis Verification Checklist

## Files (6 + barrel)

| Path | Purpose |
|---|---|
| `resources/crisisResources.ts` | Frozen US + international directory |
| `components/CrisisPanel.tsx` | Distraction-free panel (no Lumi, no decoration) |
| `components/CrisisTriggerDetector.ts` | Pure detector, returns severity + matched phrases |
| `governance/crisisSafetyRules.ts` | 7 rules + module-load floor |
| `verification/phase34-checklist.md` | This file |
| `index.ts` | Public barrel |

## Pass criteria

- [x] `CRISIS_RESOURCES.us.length >= 3` (988, Crisis Text Line, SAMHSA)
- [x] `CRISIS_RESOURCES.international.length >= 1` (Befrienders + IASP directory)
- [x] `getPrimaryUSResource()` returns 988
- [x] `CrisisPanel` renders heading "You are not alone."
- [x] `CrisisPanel` has no Lumi import, no decorative imagery imports
- [x] `CrisisPanel` primary CTA is `tel:988`, secondary CTA is `sms:741741?body=HOME`
- [x] `detectCrisisIndicators` returns `severity: "immediate"` for explicit self-harm intent (kill myself / end it all / want to die / no point living)
- [x] `detectCrisisIndicators` returns `severity: "concern"` for surface mentions (suicide / hurt myself / self-harm) — still triggers panel
- [x] `CRISIS_SAFETY_RULES.length >= 7` (module-load throw on breach)

## Trust boundaries

- Crisis panel is the trust boundary; module enforces no-Lumi / no-decoration via spec + governance rule 7. Aligned with `lumi-registry`'s placement map (`crisis-support: variant:null, assignment:"forbidden"`).
- Detector is pure — no side effects, no I/O, no analytics emit.
- Panel renders without authentication and without external network calls.

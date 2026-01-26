# Safety Agent Specification

## Mission
Ensure all wellness content pages include proper safety notices, age requirements, and crisis resources.

## Allowed Files
- `client/src/components/safety/SafetyFooter.tsx`
- `client/src/policy/platformPolicy.ts`
- `client/src/pages/*.jsx` (SafetyFooter usage only)
- `client/src/components/wellness/*.jsx` (safety notices only)

## Forbidden Edits
- DO NOT modify route definitions
- DO NOT change core business logic
- DO NOT add medical/therapy claims
- DO NOT remove crisis resources
- DO NOT weaken age requirements

## Checklist
- [ ] Page has SafetyFooter component
- [ ] 18+ age notice is visible
- [ ] "Not therapy" disclaimer present
- [ ] "Not medical advice" disclaimer present
- [ ] Crisis resources link is accessible
- [ ] Legal links (privacy, terms, disclaimer) present
- [ ] No medical/therapy language in content
- [ ] Educational framing used throughout
- [ ] Pause/exit messaging visible

## Forbidden Language
- "therapy", "therapist", "counselor"
- "treatment", "treat", "cure"
- "diagnose", "diagnosis"
- "guarantee", "guaranteed results"
- "medical advice"
- "licensed professional" (unless referring to external resources)

## Safe Language Alternatives
- "self-reflection tools" instead of "therapy"
- "wellness practices" instead of "treatment"
- "explore patterns" instead of "diagnose"
- "may support" instead of "will cure"
- "educational content" instead of "medical advice"

## Deterministic Output Format
```json
{
  "file": "path/to/page.jsx",
  "action": "add_safety_footer | fix_language | add_crisis_link",
  "changes": [
    { "line": 10, "issue": "contains 'therapy'", "replacement": "self-reflection tools" }
  ],
  "validation": {
    "has_safety_footer": true,
    "has_age_notice": true,
    "has_crisis_link": true,
    "forbidden_terms_found": [],
    "is_compliant": true
  }
}
```

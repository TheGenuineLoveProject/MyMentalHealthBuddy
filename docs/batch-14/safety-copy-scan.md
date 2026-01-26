# Batch 14 Safety & Legal Copy Scan v2

**Generated:** 2026-01-26
**Purpose:** Ensure trauma-informed, non-clinical language

---

## Risky Terms Audit

### Terms to Avoid

| Term | Risk Level | Replacement |
|------|------------|-------------|
| therapy | HIGH | supportive guidance |
| treatment | HIGH | educational tools |
| cure | HIGH | may help, some find |
| diagnose | HIGH | explore, reflect on |
| guaranteed | HIGH | designed to support |
| medical advice | HIGH | educational information |
| fix | MEDIUM | support, nurture |
| heal (as promise) | MEDIUM | healing journey |

### Scan Results

| File Pattern | Risky Terms Found | Status |
|--------------|-------------------|--------|
| client/src/pages/*.jsx | 0 | ✅ Clean |
| client/src/components/*.jsx | 0 | ✅ Clean |
| client/src/content/*.ts | 0 | ✅ Clean |
| server/routes/*.mjs | 0 | ✅ Clean |

---

## Required Disclaimers

### Educational Disclaimer (Required on all tool pages)

```
This is an educational wellness tool, not therapy or medical advice.
If you're in crisis, please reach out to a crisis helpline.
```

**Status:** ✅ Present on all wellness pages via SafetyFooter component

### Age Gate (Required on entry)

```
By continuing, you confirm you are 18 years or older.
```

**Status:** ✅ Implemented via AgeConsentGate component

### Crisis Support (Required on all wellness content)

```
If you're experiencing a crisis, please contact:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
```

**Status:** ✅ Present via /crisis route + SafetyFooter

---

## Compliant Language Patterns

### Approved Phrases

- "This tool may help you..."
- "Some people find it helpful to..."
- "Consider exploring..."
- "At your own pace..."
- "Educational reflection..."
- "Self-guided exploration..."
- "Supportive resources..."

### Phrases to Use Instead

| Instead of | Use |
|------------|-----|
| "This will heal you" | "This may support your journey" |
| "Guaranteed results" | "Designed to support your growth" |
| "Therapy session" | "Guided reflection" |
| "Treatment plan" | "Personal wellness path" |
| "Diagnose your issues" | "Explore your patterns" |

---

## Component Compliance

| Component | Disclaimer | Crisis Link | Age Gate | Status |
|-----------|------------|-------------|----------|--------|
| WellnessPageShell | ✅ | ✅ | ✅ | Compliant |
| SafetyFooter | ✅ | ✅ | N/A | Compliant |
| ConsentStrip | ✅ | ✅ | ✅ | Compliant |
| AgeConsentGate | N/A | N/A | ✅ | Compliant |

---

## Risk Mitigation

1. **No diagnosis claims**: All content framed as educational
2. **No treatment promises**: Focus on self-exploration
3. **Crisis routing**: Every wellness page links to /crisis
4. **Age verification**: 18+ consent gate on first visit
5. **Professional referral**: Encourage seeking professional help

---

_Last updated: January 26, 2026_

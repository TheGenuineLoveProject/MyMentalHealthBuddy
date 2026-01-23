# GLP Content Policy

## Last Updated: 2026-01-23

This document defines the content standards for The Genuine Love Project. All copy, UI text, and AI-generated content must follow these guidelines.

---

## 1. Prohibited Language

### Never Use These Terms

| Term | Issue | Replace With |
|------|-------|--------------|
| "therapy" (as a service) | Implies licensed clinical service | "wellness tools", "reflective support" |
| "therapist" (referring to us) | Implies licensed professional | "companion", "guide" |
| "diagnose" / "diagnosis" | Medical claim | Remove entirely |
| "treat" / "treatment" | Medical claim | "support", "help with" |
| "cure" | Medical claim | Remove entirely |
| "heal" (as outcome promise) | Outcome guarantee | "support healing journey" |
| "clinically proven" | Requires evidence | "research suggests", "evidence-informed" |
| "guaranteed" | Outcome promise | "may help", "designed to support" |

### Safe Alternatives

| Instead of... | Use... |
|---------------|--------|
| "This will heal your trauma" | "This may support your healing journey" |
| "AI therapy session" | "AI wellness companion" |
| "Treatment for anxiety" | "Support for anxious feelings" |
| "Diagnose your attachment style" | "Explore your attachment patterns" |

---

## 2. Required Disclaimers

### Tool Pages (All)

Every tool page MUST include the `SafetyFooter` component:

```jsx
import SafetyFooter from '@/components/ui/SafetyFooter';

// At bottom of page
<SafetyFooter variant="default" />
```

### High-Emotion Pages (Journal, Mood, Inner Child, etc.)

Use prominent variant:

```jsx
<SafetyFooter variant="prominent" />
```

### Crisis Resources

Every page with emotional content must link to `/crisis` and include:
- 988 Suicide & Crisis Lifeline
- Crisis Text Line (741741)

---

## 3. Tone Guidelines

### Do Use

- "You might find..."
- "Some people notice..."
- "This practice may help..."
- "If you'd like to try..."
- "You can stop anytime"
- "There's no wrong way"
- "Take what resonates"

### Don't Use

- "You will feel better"
- "This works for everyone"
- "You need to do this"
- "You should always..."
- "Don't skip this step"
- Fear-based urgency

---

## 4. Consent Language

### Before Starting Any Practice

Include consent cues:
- "Would you like to begin?"
- "You're in control of your pace"
- "Skip any step that doesn't feel right"

### Stop Rule

Every practice must include exit language:
- "You can pause or stop at any time"
- "If this brings up difficult feelings, it's okay to take a break"

---

## 5. Evidence Standards

### Claims Must Be

1. **Evidence-informed**: Based on published research
2. **Contextual**: "Research suggests..." not "Studies prove..."
3. **Non-absolute**: Avoid "always", "never", "everyone"
4. **Sourced internally**: Reference `/learn` pages for deeper context

### Avoid

- Citing specific studies without verification
- Making causal claims (X causes Y)
- Implying FDA approval or medical endorsement

---

## 6. Accessibility Language

### Always Use

- Person-first language: "person experiencing anxiety" not "anxious person"
- Non-stigmatizing: "mental health challenges" not "mental illness"
- Inclusive: Avoid assumptions about ability, family, relationships

### Avoid

- "Normal" / "abnormal"
- "Crazy", "insane", "psycho"
- "Suffers from" (use "experiences" or "lives with")
- "High-functioning" / "low-functioning"

---

## 7. Component Reference

### Footer Components

| Component | Use For |
|-----------|---------|
| `SafetyFooter` | Tool pages, practice pages |
| `Footer` (ui/) | Site-wide footer |
| `SiteFooter` | Minimal pages |

### Import Path

```jsx
// Correct
import SafetyFooter from '@/components/ui/SafetyFooter';
import { Footer } from '@/components/ui';

// Deprecated (do not use)
import Footer from '@/components/Footer';
import SacredFooter from '@/components/SacredFooter';
```

---

## 8. Review Checklist

Before publishing any page, verify:

- [ ] No prohibited terms (therapy, diagnose, treat, cure)
- [ ] SafetyFooter included
- [ ] Crisis resources accessible
- [ ] Consent language present
- [ ] Stop rule included
- [ ] Evidence claims are contextual
- [ ] Language is inclusive and non-stigmatizing

---

## Questions?

Contact the content team or reference the glossary at `/glossary` for term definitions.

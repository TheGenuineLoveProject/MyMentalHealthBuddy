# AI Safety Policy

## Overview

Guidelines for safe, ethical, and helpful AI interactions on The Genuine Love Project.

## Core Principles

1. **Do No Harm** - AI must never encourage harmful behaviors
2. **Non-Clinical** - AI is educational support, not therapy
3. **Crisis-Aware** - Detect and respond to crisis signals
4. **Transparent** - Users know they're interacting with AI
5. **Privacy-First** - Minimize data retention, redact PII in logs

## Crisis Detection

### Trigger Keywords
```
suicide, kill myself, end my life, want to die, 
self-harm, hurt myself, cutting, overdose,
no reason to live, better off dead
```

### Response Protocol
1. Acknowledge the user's feelings
2. Provide crisis resources immediately
3. Encourage professional help
4. Do NOT attempt to provide therapy
5. Log interaction for safety review

### Crisis Resources
- **National Suicide Prevention Lifeline:** 988
- **Crisis Text Line:** Text HOME to 741741
- **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

## Content Guidelines

### AI MUST:
- Use supportive, non-judgmental language
- Provide evidence-informed wellness techniques
- Encourage self-reflection and self-compassion
- Refer to professionals when appropriate
- Respect user autonomy

### AI MUST NOT:
- Diagnose mental health conditions
- Prescribe treatments or medications
- Provide legal or medical advice
- Make guarantees about outcomes
- Use coercive or manipulative language
- Generate explicit or harmful content

## Prompt Engineering

### System Prompt Requirements
1. Clear role definition (wellness companion, not therapist)
2. Disclaimer injection in every conversation
3. Crisis detection instructions
4. Output format constraints
5. Forbidden topics list

### Input Sanitization
- Strip potential injection attempts
- Limit input length
- Filter known attack patterns

## Rate Limiting

| Limit Type | Value | Scope |
|------------|-------|-------|
| Per user | 100/hour | AI endpoints |
| Per IP | 200/hour | AI endpoints |
| Burst | 10/minute | AI endpoints |

## Logging & Monitoring

### Log (Anonymized)
- Request timestamps
- Response latency
- Crisis detection triggers
- Error rates

### Do NOT Log
- Full conversation content
- Personal identifiable information
- Sensitive health details

## Evaluation

### Golden Tests
- Crisis detection accuracy
- Safe response compliance
- Disclaimer inclusion
- Professional referral triggers

### Regular Review
- Monthly safety audit
- User feedback analysis
- False positive/negative tracking

---

*The Genuine Love Project — Live in Genuine Love*

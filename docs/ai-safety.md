# AI Safety Documentation

## Overview

The Genuine Love Project uses AI for supportive journaling and emotional guidance. This document outlines our safety measures.

## Core Principles

1. **Educational Only** - Not therapy, not medical advice
2. **Consent-Led** - User chooses intensity level
3. **Crisis-Aware** - Automatic detection and routing
4. **Privacy-First** - Minimal logging, no PII in AI requests
5. **Non-Diagnostic** - No labels, no pathologizing

## Crisis Detection

### Trigger Words
- Suicide-related language
- Self-harm references
- Immediate danger indicators

### Response Protocol
1. Interrupt AI response
2. Display crisis resources (988 Lifeline)
3. Offer grounding exercises
4. Log event (anonymized)

### Crisis Route
`/crisis` - Always accessible without authentication

## Rate Limiting

| Tier | Requests/Hour | Tokens/Request |
|------|---------------|----------------|
| Free | 10 | 1000 |
| Basic | 50 | 2000 |
| Premium | 200 | 4000 |

## Prompt Safety

### Injection Hardening
- Input sanitization before AI calls
- System prompts isolated from user input
- Output validation for unsafe patterns

### Forbidden Outputs
- Diagnosis or diagnostic language
- Treatment recommendations
- Medical claims or guarantees
- Prescriptive "should" statements

### Allowed Outputs
- "Some people find..."
- "You might consider..."
- "This is for educational purposes..."

## PII Handling

### Logged (Anonymized)
- Timestamp
- User tier
- Token count
- Error codes

### Never Logged
- Journal content
- AI responses
- Personal identifiers

## Model Configuration

### System Prompt Principles
- Warm, supportive tone
- Non-judgmental language
- Trauma-informed responses
- Cultural humility
- Autonomy-affirming

### Fallback Behavior
- Graceful degradation on API failure
- Cached supportive messages
- Clear error communication

## Moderation Rules

### Content Filters
- Harmful content detection
- Inappropriate request rejection
- Age-appropriate responses

### Human Escalation
- Crisis situations → immediate resources
- Repeated distress → encourage professional support
- Technical issues → support contact

## Compliance

- HIPAA awareness (not a covered entity)
- GDPR data minimization
- FTC guidance on AI transparency

## Safety Policy

See `docs/ai/SAFETY_POLICY.md` for detailed policy.

## Incident Response

1. Identify issue scope
2. Disable affected AI feature if needed
3. Document incident
4. Review and improve safeguards

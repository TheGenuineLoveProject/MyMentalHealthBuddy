# Threat Model

## Overview

Security threat analysis for The Genuine Love Project mental wellness platform.

## Assets to Protect

1. **User Data** - Personal information, journal entries, mood logs
2. **Authentication** - Credentials, sessions, tokens
3. **AI Interactions** - Chat history, prompts, responses
4. **Payment Data** - Handled by Stripe (PCI compliant)
5. **Platform Integrity** - Code, infrastructure, availability

## Threat Categories

### 1. Authentication Attacks
| Threat | Mitigation |
|--------|------------|
| Credential stuffing | Rate limiting, bcrypt hashing |
| Session hijacking | Secure cookies, HTTPS only |
| Token theft | Short-lived tokens, refresh rotation |

### 2. Data Exposure
| Threat | Mitigation |
|--------|------------|
| SQL injection | Parameterized queries (Drizzle) |
| XSS attacks | React escaping, CSP headers |
| Data leakage | PII minimization in logs |

### 3. AI-Specific Risks
| Threat | Mitigation |
|--------|------------|
| Prompt injection | System prompt boundaries, sanitization |
| Harmful output | Crisis detection, content moderation |
| Model abuse | Rate limiting per user/IP |

### 4. Infrastructure
| Threat | Mitigation |
|--------|------------|
| DDoS | Replit infrastructure, rate limiting |
| Dependency vulns | npm audit, Snyk (optional) |
| Secrets exposure | Env vars, never in code |

## Security Controls

### Preventive
- Input validation (Zod)
- Helmet security headers
- CORS configuration
- Rate limiting

### Detective
- Audit logging
- Error tracking (Sentry)
- Request ID tracing

### Corrective
- Incident response runbook
- Rollback capability
- User notification process

## Compliance

- **GDPR-Ready**: Data export/deletion
- **CCPA-Ready**: Privacy policy disclosures
- **Non-Medical**: Clear disclaimers

---

*The Genuine Love Project — Live in Genuine Love*

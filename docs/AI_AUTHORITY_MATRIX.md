# AI Authority Matrix

**Generated:** 2026-02-06
**Phase:** 11 — AI Governance Hardening

---

## Agent Authority Boundaries

### Authority Rule: No Overlapping Responsibility

Each AI agent has exactly ONE domain. No two agents may modify the same category of artifact.

| Domain | Authorized Agent | Boundary |
|--------|-----------------|----------|
| Content creation & maintenance | Content Agent | Only text content in content/ directories |
| Engagement mechanics | Growth Agent | Only growth config, never core features |
| Page structure & layout | Layout Agent | Only layout components, never content |
| Safety notices & crisis | Safety Agent | Only safety/ components and disclaimers |
| SEO metadata | SEO Agent | Only meta tags, never page content |

### Forbidden Cross-Domain Actions

| Agent | CANNOT Do |
|-------|-----------|
| Content Agent | Modify layout, change SEO tags, alter safety notices |
| Growth Agent | Write content, modify safety features, change auth |
| Layout Agent | Write content, modify AI prompts, change billing |
| Safety Agent | Write marketing content, modify engagement, change layout |
| SEO Agent | Write page content, modify safety notices, change AI behavior |

---

## Human Trigger Requirement

### Enforcement Rules

1. **No agent may execute without explicit human initiation**
2. **No agent may invoke another agent**
3. **No agent has database write access**
4. **No agent has access to user PII**
5. **No agent may modify authentication or authorization logic**
6. **No agent may modify billing or payment flows**

### Verification Checklist

These are governance rules documented in agent specification files. They are NOT enforced via code — agents are markdown specification documents, not executable programs. Enforcement relies on human review during development.

| Control | How to Verify | Status |
|---------|---------------|--------|
| No cron-triggered agents | Agents are .md spec files (not executable) | DOCUMENTED |
| No inter-agent calls | Agents are .md spec files (not executable) | DOCUMENTED |
| No DB write in agents | Agents are .md spec files (not executable) | DOCUMENTED |
| No PII access | Agents are .md spec files (not executable) | DOCUMENTED |
| Human trigger only | Agent specs state human-triggered requirement | DOCUMENTED |

**Note:** These boundaries are governance documentation, not runtime enforcement. Server-side AI safety (OpenAI/Perplexity routes) IS enforced via middleware (requireAuth, requireAdult, rateLimit, crisisClassifier).

---

## AI Service Authority (Server-Side)

### OpenAI Integration Boundaries

| Endpoint | Auth Required | Rate Limited | Crisis Detection | Adult Only |
|----------|--------------|-------------|------------------|-----------|
| /api/ai | Yes | Yes | Yes (crisisClassifier) | Yes (requireAdult) |
| /api/ai/chat | Yes | Yes | Yes | Yes |
| /api/perplexity | Yes | Yes | No (factual only) | No |

### Safety Enforcement Chain

```
User Request
  → requireAuth (must be logged in)
  → requireAdult (18+ verified)
  → rateLimit (abuse prevention)
  → crisisClassifier (safety check)
  → systemPrompt (trauma-informed framing)
  → OpenAI API call
  → safetyCheck (response validation)
  → User Response
```

### System Prompt Governance

| Prompt Category | File | Review Required |
|----------------|------|-----------------|
| Base system prompt | server/ai/system-prompts/ | Human review |
| Crisis intervention | server/ai/safety/ | Human review |
| Therapy flows | server/ai/therapyFlows.mjs | Human review |

All system prompts must:
- Use trauma-informed language
- Include educational disclaimers
- Never claim to diagnose or treat
- Include crisis resource references
- Be reviewed before deployment

---

## Automated Health Checks (External Only)

| Schedule | Script | Runs In | Can Modify Code? |
|----------|--------|---------|-----------------|
| Hourly | scripts/ai/hourly.mjs | GitHub Actions | NO |
| Daily | scripts/ai/daily.mjs | GitHub Actions | NO |
| Weekly | scripts/ai/weekly.mjs | GitHub Actions | NO |
| Monthly | scripts/ai/monthly.mjs | GitHub Actions | NO |

These scripts are read-only monitors. They:
- Check system health endpoints
- Validate content quality
- Report findings (do not auto-fix)
- Run externally (not in-app)

---

## Incident Response

If an AI agent produces harmful content:
1. **Immediate:** Disable the specific endpoint via feature flag
2. **Short-term:** Review and update system prompts
3. **Long-term:** Add the pattern to safety guardrails
4. **Documentation:** Record in incident log

---

## Phase 11 Status: COMPLETE
No code modified. Authority matrix documented with enforcement rules.

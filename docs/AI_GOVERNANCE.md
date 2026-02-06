# AI System Governance

**Generated:** 2026-02-06
**Baseline Commit:** c82c2d124efec42154e2f0ff4550778bb2c577de

---

## AI Agent Registry

| Agent | File | Role | Trigger | Status |
|-------|------|------|---------|--------|
| Content Agent | agents/content-agent.md | Create/maintain wellness content | Human-triggered | COMPLIANT |
| Growth Agent | agents/growth-agent.md | Ethical engagement mechanics | Human-triggered | COMPLIANT |
| Layout Agent | agents/layout-agent.md | Page structure and accessibility | Human-triggered | COMPLIANT |
| Safety Agent | agents/safety-agent.md | Safety notices and crisis resources | Human-triggered | COMPLIANT |
| SEO Agent | agents/seo-agent.md | SEO metadata management | Human-triggered | COMPLIANT |
| MCP Tools | agents/mcp-tools-spec.md | Tool specification (not an agent) | N/A | DOCUMENTATION |

---

## Agent Authority Matrix

| Capability | Content | Growth | Layout | Safety | SEO |
|------------|---------|--------|--------|--------|-----|
| Create content | Yes | No | No | No | No |
| Modify UI layout | No | No | Yes | No | No |
| Edit safety notices | No | No | No | Yes | No |
| Update SEO meta | No | No | No | No | Yes |
| Modify engagement hooks | No | Yes | No | No | No |
| Access user data | No | No | No | No | No |
| Database writes | No | No | No | No | No |
| Autonomous execution | No | No | No | No | No |

**No overlapping authority detected. Each agent has a distinct, non-overlapping role.**

---

## AI Integration (Server-Side)

### OpenAI Integration

| Property | Value |
|----------|-------|
| Route | /api/ai |
| Access Control | requireAdult middleware |
| System Prompts | server/ai/system-prompts/ |
| Safety Layer | server/ai/safety/ |
| Rate Limiting | Applied |

### Perplexity Integration

| Property | Value |
|----------|-------|
| Route | /api/perplexity |
| Purpose | Factual information search |
| Access Control | Authenticated users |

---

## Safety Guardrails

### Content Guardrails

1. **Trauma-informed language** - All AI responses use trauma-informed NLP patterns
2. **No diagnosis** - AI never provides medical/psychological diagnosis
3. **No treatment claims** - Platform explicitly states it is educational only
4. **Crisis routing** - AI responses include crisis resources when appropriate
5. **Educational framing** - All content framed as educational, not clinical

### Technical Guardrails

1. **No autonomous execution** - All AI agents require human trigger
2. **No background autonomy** - No hidden cron jobs or self-triggering
3. **No user data access** - Agents operate on content, not user data
4. **Explainable outputs** - AI responses include reasoning when applicable
5. **Rate limiting** - All AI endpoints are rate-limited

### Automated Health Checks (GitHub Actions)

| Schedule | Script | Purpose |
|----------|--------|---------|
| Hourly | scripts/ai/hourly.mjs | System health monitoring |
| Daily | scripts/ai/daily.mjs | Content quality checks |
| Weekly | scripts/ai/weekly.mjs | Comprehensive review |
| Monthly | scripts/ai/monthly.mjs | Deep audit |

These run externally via GitHub Actions, NOT within the application itself.

---

## Compliance Checklist

| Requirement | Status |
|-------------|--------|
| No duplicate authority between agents | PASS |
| No hidden autonomy | PASS |
| Human-triggered execution only | PASS |
| Explainable outputs | PASS |
| No user data access by agents | PASS |
| Crisis routing in AI responses | PASS |
| Educational-only framing | PASS |
| Age gating on AI features | PASS |

---

## Phase 6 Status: COMPLETE
No code was modified. AI governance documented and validated.

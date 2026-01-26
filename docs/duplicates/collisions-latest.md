# Collision Scan Report

**Timestamp**: 2026-01-26T07:00:18.741Z

## Summary

| Type | Count |
|------|-------|
| Unique Endpoints | 439 |
| Auth Middlewares | 7 |
| Stripe Handlers | 3 |
| OpenAI Wrappers | 10 |
| Schema Tables | 2 |
| Admin Dashboards | 11 |
| **Collisions Found** | 68 |

## Collisions

### endpoint: GET /api/health-check
**Severity**: high

Files:
- `server/dev.mjs`
- `server/index.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /healthz
**Severity**: high

Files:
- `server/dev.mjs`
- `server/index.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /health
**Severity**: high

Files:
- `server/dev.mjs`
- `server/index.mjs`
- `server/routes/admin.mjs`
- `server/routes/canva-oauth.mjs`
- `server/routes/email.mjs`
- `server/routes/perplexity.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /api/conversations
**Severity**: high

Files:
- `server/replit_integrations/audio/routes.ts`
- `server/replit_integrations/chat/routes.ts`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /api/conversations/:id
**Severity**: high

Files:
- `server/replit_integrations/audio/routes.ts`
- `server/replit_integrations/chat/routes.ts`

**Suggestion**: Consolidate to single route handler

### endpoint: POST /api/conversations
**Severity**: high

Files:
- `server/replit_integrations/audio/routes.ts`
- `server/replit_integrations/chat/routes.ts`

**Suggestion**: Consolidate to single route handler

### endpoint: DELETE /api/conversations/:id
**Severity**: high

Files:
- `server/replit_integrations/audio/routes.ts`
- `server/replit_integrations/chat/routes.ts`

**Suggestion**: Consolidate to single route handler

### endpoint: POST /api/conversations/:id/messages
**Severity**: high

Files:
- `server/replit_integrations/audio/routes.ts`
- `server/replit_integrations/chat/routes.ts`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /export
**Severity**: high

Files:
- `server/routes/account.mjs`
- `server/routes/audit-logs.mjs`
- `server/routes/leads.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /drafts
**Severity**: high

Files:
- `server/routes/admin-social-studio.mjs`
- `server/routes/content-generator.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: POST /drafts
**Severity**: high

Files:
- `server/routes/admin-social-studio.mjs`
- `server/routes/content-generator.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /analytics
**Severity**: high

Files:
- `server/routes/admin-social-studio.mjs`
- `server/routes/admin-social-studio.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: POST /generate
**Severity**: high

Files:
- `server/routes/admin-social-studio.mjs`
- `server/routes/content-generator.mjs`
- `server/routes/content.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /stats
**Severity**: high

Files:
- `server/routes/admin.mjs`
- `server/routes/audit-logs.mjs`
- `server/routes/mood.mjs`
- `server/routes/user.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /metrics
**Severity**: high

Files:
- `server/routes/admin.mjs`
- `server/routes/health.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /
**Severity**: high

Files:
- `server/routes/ai-dashboard.mjs`
- `server/routes/analytics.mjs`
- `server/routes/audit-logs.mjs`
- `server/routes/blog.mjs`
- `server/routes/health.mjs`
- `server/routes/integrationHealth.mjs`
- `server/routes/journal.mjs`
- `server/routes/leads.mjs`
- `server/routes/metrics.mjs`
- `server/routes/mood.mjs`
- `server/routes/products.mjs`
- `server/routes/social-posts.mjs`
- `server/routes/states.mjs`
- `server/routes/ui-dashboard.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /history
**Severity**: high

Files:
- `server/routes/ai.mjs`
- `server/routes/therapy.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: POST /login
**Severity**: high

Files:
- `server/routes/auth.mjs`
- `server/routes/login.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: POST /
**Severity**: high

Files:
- `server/routes/blog.mjs`
- `server/routes/journal.mjs`
- `server/routes/leads.mjs`
- `server/routes/mirror.mjs`
- `server/routes/mood.mjs`
- `server/routes/products.mjs`
- `server/routes/social-posts.mjs`
- `server/routes/states.mjs`
- `server/routes/stripeWebhook.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: PUT /:id
**Severity**: high

Files:
- `server/routes/blog.mjs`
- `server/routes/journal.mjs`
- `server/routes/mood.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: DELETE /:id
**Severity**: high

Files:
- `server/routes/blog.mjs`
- `server/routes/journal.mjs`
- `server/routes/mood.mjs`
- `server/routes/products.mjs`
- `server/routes/social-posts.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /status
**Severity**: high

Files:
- `server/routes/canva-oauth.mjs`
- `server/routes/figma.mjs`
- `server/routes/onboarding.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /models
**Severity**: high

Files:
- `server/routes/cognitive-lab.mjs`
- `server/routes/wisdom.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /tools
**Severity**: high

Files:
- `server/routes/cognitive-lab.mjs`
- `server/routes/ethical-reasoning.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /biases
**Severity**: high

Files:
- `server/routes/cognitive-lab.mjs`
- `server/routes/cognitive-mastery.mjs`
- `server/routes/dialectics.mjs`
- `server/routes/metacognition.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /daily
**Severity**: high

Files:
- `server/routes/cognitive-lab.mjs`
- `server/routes/collective-intelligence.mjs`
- `server/routes/contemplative.mjs`
- `server/routes/creativity.mjs`
- `server/routes/dialectics.mjs`
- `server/routes/embodiment.mjs`
- `server/routes/ethical-reasoning.mjs`
- `server/routes/existential.mjs`
- `server/routes/foresight.mjs`
- `server/routes/insights.mjs`
- `server/routes/knowledge.mjs`
- `server/routes/metacognition.mjs`
- `server/routes/mind-body-integration.mjs`
- `server/routes/narrative.mjs`
- `server/routes/neuro-integration.mjs`
- `server/routes/peak-performance.mjs`
- `server/routes/personal-growth.mjs`
- `server/routes/philosophy.mjs`
- `server/routes/post-trauma.mjs`
- `server/routes/practices.mjs`
- `server/routes/praxis.mjs`
- `server/routes/prompts.mjs`
- `server/routes/psychological-safety.mjs`
- `server/routes/relational.mjs`
- `server/routes/resilience.mjs`
- `server/routes/social-intelligence.mjs`
- `server/routes/socio-ecology.mjs`
- `server/routes/systems-compassion.mjs`
- `server/routes/values.mjs`
- `server/routes/wisdom-engine.mjs`
- `server/routes/wisdom-synthesis.mjs`
- `server/routes/wisdom.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /frameworks
**Severity**: high

Files:
- `server/routes/cognitive-mastery.mjs`
- `server/routes/collective-intelligence.mjs`
- `server/routes/content-intelligence.mjs`
- `server/routes/ethical-reasoning.mjs`
- `server/routes/life-design.mjs`
- `server/routes/mirror.mjs`
- `server/routes/narrative.mjs`
- `server/routes/purpose-compass.mjs`
- `server/routes/systems-compassion.mjs`
- `server/routes/universal-content.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /frameworks/:id
**Severity**: high

Files:
- `server/routes/cognitive-mastery.mjs`
- `server/routes/content-intelligence.mjs`
- `server/routes/purpose-compass.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /categories
**Severity**: high

Files:
- `server/routes/cognitive-mastery.mjs`
- `server/routes/healing-intelligence.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /principles
**Severity**: high

Files:
- `server/routes/collective-intelligence.mjs`
- `server/routes/creativity.mjs`
- `server/routes/self-mastery.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /synthesis
**Severity**: high

Files:
- `server/routes/collective-intelligence.mjs`
- `server/routes/dialectics.mjs`
- `server/routes/knowledge.mjs`
- `server/routes/wisdom.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /all
**Severity**: high

Files:
- `server/routes/consciousness-expansion.mjs`
- `server/routes/healing-modalities.mjs`
- `server/routes/holistic-healing.mjs`
- `server/routes/human-potential.mjs`
- `server/routes/knowledge.mjs`
- `server/routes/life-design.mjs`
- `server/routes/mastery-excellence.mjs`
- `server/routes/philosophy.mjs`
- `server/routes/practices.mjs`
- `server/routes/prompts.mjs`
- `server/routes/self-mastery-intelligence.mjs`
- `server/routes/trauma-healing-protocols.mjs`
- `server/routes/universal-content.mjs`
- `server/routes/wisdom-traditions.mjs`
- `server/routes/wisdom.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /traditions
**Severity**: high

Files:
- `server/routes/contemplative.mjs`
- `server/routes/wisdom-engine.mjs`
- `server/routes/wisdom-traditions.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /formats
**Severity**: high

Files:
- `server/routes/content-generator.mjs`
- `server/routes/content.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /platforms
**Severity**: high

Files:
- `server/routes/content-intelligence.mjs`
- `server/routes/social-posting.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /strategies
**Severity**: high

Files:
- `server/routes/deep-learning.mjs`
- `server/routes/metacognition.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /archetypes
**Severity**: high

Files:
- `server/routes/deep-learning.mjs`
- `server/routes/narrative.mjs`
- `server/routes/self-mastery.mjs`
- `server/routes/wisdom-traditions.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /archetypes/:id
**Severity**: high

Files:
- `server/routes/deep-learning.mjs`
- `server/routes/self-mastery.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /prompts
**Severity**: high

Files:
- `server/routes/dialectics.mjs`
- `server/routes/narrative.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /somatic
**Severity**: high

Files:
- `server/routes/embodiment.mjs`
- `server/routes/healing-modalities.mjs`
- `server/routes/holistic-healing.mjs`
- `server/routes/trauma-healing-protocols.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /nervous-system
**Severity**: high

Files:
- `server/routes/embodiment.mjs`
- `server/routes/holistic-healing.mjs`
- `server/routes/mind-body-integration.mjs`
- `server/routes/trauma-healing-protocols.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /regulation
**Severity**: high

Files:
- `server/routes/embodiment.mjs`
- `server/routes/emotional-mastery.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /themes
**Severity**: high

Files:
- `server/routes/existential.mjs`
- `server/routes/wisdom-engine.mjs`
- `server/routes/wisdom-synthesis.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /questions
**Severity**: high

Files:
- `server/routes/existential.mjs`
- `server/routes/philosophy.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /meaning
**Severity**: high

Files:
- `server/routes/existential.mjs`
- `server/routes/values.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /modalities
**Severity**: high

Files:
- `server/routes/healing-intelligence.mjs`
- `server/routes/healing-modalities.mjs`
- `server/routes/post-trauma.mjs`
- `server/routes/transformation-engine.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /modalities/:id
**Severity**: high

Files:
- `server/routes/healing-intelligence.mjs`
- `server/routes/transformation-engine.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /journeys
**Severity**: high

Files:
- `server/routes/healing-intelligence.mjs`
- `server/routes/holistic-healing.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /patterns
**Severity**: high

Files:
- `server/routes/healing-tools.mjs`
- `server/routes/relational.mjs`
- `server/routes/wisdom-engine.mjs`
- `server/routes/wisdom-synthesis.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /breathwork
**Severity**: high

Files:
- `server/routes/holistic-healing.mjs`
- `server/routes/mind-body-integration.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /growth-mindset
**Severity**: high

Files:
- `server/routes/human-potential.mjs`
- `server/routes/personal-growth.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /:id
**Severity**: high

Files:
- `server/routes/journal.mjs`
- `server/routes/products.mjs`
- `server/routes/social-posts.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /learning
**Severity**: high

Files:
- `server/routes/knowledge.mjs`
- `server/routes/wisdom.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /virtues
**Severity**: high

Files:
- `server/routes/knowledge.mjs`
- `server/routes/philosophy.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /domains
**Severity**: high

Files:
- `server/routes/life-design.mjs`
- `server/routes/spiritual-intelligence.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /goal-systems
**Severity**: high

Files:
- `server/routes/life-design.mjs`
- `server/routes/peak-performance.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /discipline
**Severity**: high

Files:
- `server/routes/mastery-excellence.mjs`
- `server/routes/self-mastery-intelligence.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /mental-models
**Severity**: high

Files:
- `server/routes/mastery-excellence.mjs`
- `server/routes/peak-performance.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /growth
**Severity**: high

Files:
- `server/routes/practices.mjs`
- `server/routes/resilience.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: PATCH /:id
**Severity**: high

Files:
- `server/routes/products.mjs`
- `server/routes/social-posts.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /random
**Severity**: high

Files:
- `server/routes/prompts.mjs`
- `server/routes/wisdom.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /exercises
**Severity**: high

Files:
- `server/routes/purpose-compass.mjs`
- `server/routes/values.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /love-languages
**Severity**: high

Files:
- `server/routes/relational.mjs`
- `server/routes/relationship-dynamics.mjs`

**Suggestion**: Consolidate to single route handler

### endpoint: GET /practices
**Severity**: high

Files:
- `server/routes/spiritual-intelligence.mjs`
- `server/routes/systems-compassion.mjs`

**Suggestion**: Consolidate to single route handler

### auth-middleware: Multiple auth middlewares
**Severity**: medium

Files:
- `server/middleware/auth.mjs`
- `server/middleware/loginRateLimit.mjs`
- `server/middleware/rateLimit.mjs`
- `server/middleware/requireAdmin.mjs`
- `server/middleware/requireAuth.mjs`
- `server/middleware/requirePlan.mjs`
- `server/middleware/security.mjs`

**Suggestion**: Use single auth middleware, re-export from one location

### stripe-webhook: Multiple Stripe webhook handlers
**Severity**: high

Files:
- `server/routes/stripeWebhook.mjs`
- `server/routes/webhook.mjs`
- `server/shared/importMap.mjs`

**Suggestion**: Consolidate to single webhook handler

### openai-wrapper: Multiple OpenAI client wrappers
**Severity**: medium

Files:
- `server/ai/crisisClassifier.mjs`
- `server/replit_integrations/audio/client.ts`
- `server/replit_integrations/audio/routes.ts`
- `server/replit_integrations/chat/routes.ts`
- `server/replit_integrations/image/client.ts`
- `server/routes/admin-social-studio.mjs`
- `server/routes/mirror.mjs`
- `server/services/aiHandler.mjs`
- `server/services/aiService.mjs`
- `server/utils/aiClient.mjs`

**Suggestion**: Use single AI client wrapper

### admin-dashboard: Multiple admin dashboards
**Severity**: low

Files:
- `client/src/App.jsx`
- `client/src/components/admin/Top50ProcessTracker.jsx`
- `client/src/content/processes/top50ProcessMap.ts`
- `client/src/content/routes.js`
- `client/src/content/searchIndex.ts`
- `client/src/pages/Admin.jsx`
- `client/src/pages/ContentAdminDashboard.jsx`
- `client/src/pages/DesignSystem.jsx`
- `client/src/pages/WireframeTemplates.jsx`
- `client/src/pages/admin/CommandCenter.jsx`
- `client/src/pages/generated/admin.jsx`

**Suggestion**: May be intentional if different admin sections

---

_Generated by scan-collisions.mjs_
# Platform Capability Registry

**Generated:** 2026-02-06
**Phase:** 8 — Platform Capability Registry

---

## Capability Domains

### 1. FRONTEND (169 pages, 269 components)

| Sub-Domain | Systems | Key Files |
|-----------|---------|-----------|
| Landing & Marketing | CanvaLanding, LandingHero, LandingFeatures | client/src/pages/CanvaLanding.jsx, marketing/ |
| Dashboard | Dashboard, WellnessDashboard, InsightsDashboard, AtlasDashboard | client/src/pages/dashboard/, Dashboard.jsx |
| AI Chat | AIChatPage, ChatConversation, AICompanion | client/src/pages/ai/, AIChatPage.jsx |
| Journal & Mood | JournalPage, MoodTrendsChartJS, GuidedJournaling | client/src/pages/JournalPage.jsx, generated/mood.jsx |
| Healing | HealingJourneysPage, HealingLandingPage, HealingLibraryPage, InnerChildPage | client/src/pages/Healing*.jsx |
| Tools | ToolsPage, AdvancedToolsPage, MasteryToolsPage, WisdomToolsPage, EliteToolsDashboard | client/src/pages/*ToolsPage* |
| Content Studio | ContentStudioPage, ContentAdminDashboard, ContentIndexPage | client/src/pages/ContentStudioPage.tsx |
| Community | CommunityPage, CommunityCircle, CommunityFeed, AffirmationWall | client/src/pages/Community*.jsx |
| Admin | Admin.jsx, AdminBilling, SocialStudioAdmin, HealthDashboard | client/src/pages/admin/ |
| Auth | Login, Register, ForgotPassword, Settings | client/src/pages/auth/ |
| Growth & Progress | GrowthPage, GrowthAnalyticsPage, ProgressTracker | client/src/pages/Growth*.jsx |
| Cognitive | CognitiveArchitecturePage, CognitiveToolsPage, CollaborativeLabPage | client/src/pages/Cognitive*.tsx |
| Wellness | Wellness, BodyWellnessPage, BreathingExercisesPage, CalmingScenesPage, DailyPracticePage | client/src/pages/wellness/ |
| Sacred UI Library | SacredLayout, SacredSection, SacredHero, SacredButton, SacredFooter | client/src/components/sacred/ |
| Share Components | ReflectionCard, IdentityMirror, InfinityHeartCard, StreakShare, ShareModal | client/src/components/share/ |
| Safety | SafetyFooter, SafetyDisclaimer, CrisisResources, AgeConsentGate | client/src/components/safety/ |
| Design System | PageScaffold, PageTemplate, WellnessPageShell, ThemeProvider | client/src/components/layout/ |
| Navigation | TglpNavbar, CommandCenter, ModulesPanel | client/src/components/layout/ |

### 2. BACKEND (114 route files)

| Sub-Domain | Route Files | Base Path |
|-----------|-------------|-----------|
| Core API | api.mjs, health.mjs, integrationHealth.mjs | /api |
| AI Services | ai.mjs, ai-dashboard.mjs, perplexity.mjs | /api/ai, /api/perplexity |
| User Management | user.mjs, userSettings.mjs, accountActions.mjs, account.mjs | /api/user, /api/account |
| Authentication | auth.mjs, login.mjs, mfa.mjs, github-auth.mjs | /api/auth, /api/login |
| Billing | billing.mjs, stripeWebhook.mjs, adminBilling.mjs, products.mjs | /api/billing, /api/stripe |
| Content | content.mjs, content-studio.mjs, content-generator.mjs, content-intelligence.mjs, blog.mjs | /api/content, /api/blog |
| Wellness Tools | mood.mjs, journal.mjs, states.mjs, practices.mjs, healing.mjs, healing-tools.mjs | /api/mood, /api/journal |
| Healing Specialties | trauma-healing-protocols.mjs, post-trauma.mjs, healing-modalities.mjs, healing-intelligence.mjs, holistic-healing.mjs | /api/healing-* |
| Cognitive | cognitive-enhancement.mjs, cognitive-lab.mjs, cognitive-mastery.mjs, metacognition.mjs | /api/cognitive-* |
| Wisdom & Philosophy | wisdom.mjs, wisdom-engine.mjs, wisdom-synthesis.mjs, wisdom-traditions.mjs, philosophy.mjs | /api/wisdom* |
| Growth & Mastery | personal-growth.mjs, mastery-excellence.mjs, self-mastery.mjs, self-mastery-intelligence.mjs, peak-performance.mjs | /api/mastery* |
| Intelligence Systems | emotional-mastery.mjs, emotional-resilience.mjs, social-intelligence.mjs, collective-intelligence.mjs | /api/*-intelligence |
| Life Design | life-design.mjs, life-purpose.mjs, purpose-compass.mjs, foresight.mjs | /api/life-* |
| Body & Embodiment | mind-body-integration.mjs, embodiment.mjs | /api/mind-body, /api/embodiment |
| Relationships | relational.mjs, relationship-dynamics.mjs | /api/relational |
| Ethics & Values | ethical-reasoning.mjs, values.mjs, existential.mjs | /api/ethical-reasoning |
| Narrative & Meaning | narrative.mjs, meaning.mjs, meaning-future.mjs | /api/narrative, /api/meaning |
| Social & Community | community.mjs, social-posts.mjs, social-posting.mjs, feed.mjs | /api/community, /api/social |
| Admin | admin.mjs, admin-security.mjs, admin-social-studio.mjs, audit-logs.mjs | /api/admin |
| Analytics | analytics.mjs, metrics.mjs, insights.mjs, progress.mjs | /api/analytics, /api/metrics |
| Gamification | gamification.mjs, badges.mjs | /api/gamification |
| Communication | email.mjs, newsletter.mjs, contact.mjs, leads.mjs, invites.mjs | /api/email, /api/newsletter |
| Onboarding | onboarding.mjs | /api/onboarding |
| Favorites | favorites.mjs, gratitude.mjs | /api/favorites |
| Storage | object-storage.mjs | /api/storage |
| External Integrations | figma.mjs, canva-oauth.mjs, webhook.mjs | /api/figma, /api/canva |
| Transformation | transformation-engine.mjs, deep-learning.mjs, dialectics.mjs, praxis.mjs | /api/transformation |
| Prompts | prompts.mjs | /api/prompts |
| Pro Features | pro-features.mjs | /api/pro |
| Therapy | therapy.mjs, mirror.mjs | /api/therapy |

### 3. AI SYSTEMS

| System | File | Role |
|--------|------|------|
| OpenAI Client | server/ai/openaiClient.mjs | Core LLM interface |
| Crisis Classifier | server/ai/crisisClassifier.mjs | Safety-critical content classification |
| Therapy Flows | server/ai/therapyFlows.mjs | Guided therapeutic conversation engine |
| System Prompts | server/ai/system-prompts/ | Prompt templates (trauma-informed) |
| Safety Layer | server/ai/safety/ | Content safety guardrails |
| AI Service | server/services/aiService.mjs | Business logic wrapper |
| AI Handler | server/services/aiHandler.mjs | Request handling |
| AI Client Util | server/utils/aiClient.mjs | Shared utility |
| AI Guardrails | server/utils/aiGuardrails.mjs | Safety enforcement |
| Perplexity | server/routes/perplexity.mjs | Factual information search |
| Replit AI Chat | server/replit_integrations/chat/ | Chat integration |
| Replit AI Image | server/replit_integrations/image/ | Image generation |
| Replit AI Audio | server/replit_integrations/audio/ | Audio generation |

### 4. AUTHENTICATION & AUTHORIZATION

| System | File | Mechanism |
|--------|------|-----------|
| Replit Auth (OIDC) | server/middleware/auth.mjs | Primary auth provider |
| GitHub OAuth | server/routes/github-auth.mjs | Alternative auth |
| Session Management | server/middleware/session.mjs | Express sessions |
| Admin Guard | server/middleware/adminAuth.mjs | Admin-only access |
| Role Guard | server/middleware/requireRole.mjs | Role-based access |
| Plan Guard | server/middleware/requirePlan.mjs | Subscription gating |
| Adult Guard | server/middleware/requireAdult.mjs | Age verification |
| Auth Guard | server/middleware/requireAuth.mjs | Login requirement |
| MFA | server/routes/mfa.mjs | Multi-factor auth |
| CSRF Protection | server/middleware/csrf.mjs | Token validation |
| Rate Limiting | server/middleware/rateLimit.mjs | Abuse prevention |
| Login Rate Limit | server/middleware/loginRateLimit.mjs | Brute-force protection |
| JWT Utilities | server/utils/jwt.mjs | Token management |
| Password Utilities | server/utils/password.mjs | Hashing/verification |

### 5. BILLING & MONETIZATION

| System | File | Function |
|--------|------|----------|
| Billing Routes | server/routes/billing.mjs | Plan management, checkout |
| Stripe Webhook | server/routes/stripeWebhook.mjs | Subscription lifecycle |
| Admin Billing | server/routes/adminBilling.mjs | Revenue dashboards |
| Products | server/routes/products.mjs | Product catalog |
| Stripe Sync | server/services/stripeSync.mjs | Data synchronization |
| Stripe Utility | server/utils/stripe.mjs | Client configuration |
| Pro Features | server/routes/pro-features.mjs | Premium feature gating |
| Token System | server/services/tokens.mjs | Usage credits |

### 6. AUTOMATION & AGENTS

| Agent | File | Authority | Trigger |
|-------|------|-----------|---------|
| Content Agent | agents/content-agent.md | Content creation/maintenance | Human-triggered |
| Growth Agent | agents/growth-agent.md | Ethical engagement mechanics | Human-triggered |
| Layout Agent | agents/layout-agent.md | Page structure/accessibility | Human-triggered |
| Safety Agent | agents/safety-agent.md | Safety notices/crisis resources | Human-triggered |
| SEO Agent | agents/seo-agent.md | SEO metadata management | Human-triggered |
| MCP Tools Spec | agents/mcp-tools-spec.md | Tool specification (reference) | N/A |

GitHub Actions Automation:
| Schedule | Script | Purpose |
|----------|--------|---------|
| Hourly | scripts/ai/hourly.mjs | System health monitoring |
| Daily | scripts/ai/daily.mjs | Content quality checks |
| Weekly | scripts/ai/weekly.mjs | Comprehensive review |
| Monthly | scripts/ai/monthly.mjs | Deep audit |

### 7. GROWTH & ENGAGEMENT

| System | File | Mechanism |
|--------|------|-----------|
| Gamification Context | client/src/contexts/GamificationContext | XP, levels, streaks |
| Badges | server/routes/badges.mjs | Achievement system |
| Share Components | client/src/components/share/ | Social sharing cards |
| SocialShare | client/src/components/SocialShare.jsx | Platform sharing |
| Community Feed | server/routes/feed.mjs | Content discovery |
| Invites | server/routes/invites.mjs | Referral system |
| Newsletter | server/routes/newsletter.mjs | Email engagement |
| Leads | server/routes/leads.mjs | Lead capture |
| Affirmation Wall | client/src/pages/AffirmationWall.jsx | Community participation |
| Shared Reflections | client/src/components/community/SharedReflections.tsx | User-generated content |

---

## Capability Cross-Reference

| Route File | Frontend | Backend | AI | Auth | Billing | Automation | Growth |
|-----------|----------|---------|----|----|---------|-----------|--------|
| ai.mjs | x | x | x | x | | | |
| billing.mjs | | x | | x | x | | |
| gamification.mjs | x | x | | x | | | x |
| community.mjs | x | x | | x | | | x |
| content-studio.mjs | x | x | x | x | x | | |
| admin.mjs | x | x | | x | | | |
| therapy.mjs | | x | x | x | | | |
| social-posting.mjs | | x | | x | | x | x |
| analytics.mjs | x | x | | x | | | |
| mood.mjs | x | x | | x | | | |
| journal.mjs | x | x | | x | | | |

---

## Infrastructure Systems

| System | File | Category |
|--------|------|----------|
| Express Server | server/index.mjs | Core |
| Vite Dev Server | server/vite.ts | Dev tooling |
| Drizzle ORM | shared/schema.mjs | Data layer |
| Neon PostgreSQL | (external) | Database |
| Sentry | server/utils/sentry.mjs | Error tracking |
| Logger | server/utils/logger.mjs | Structured logging |
| Audit Logger | server/utils/auditLogger.mjs | Compliance logging |
| Request ID | server/middleware/requestId.mjs | Tracing |
| Compression | (express middleware) | Performance |
| Helmet | (express middleware) | Security |
| CORS | (express middleware) | Security |
| Service Worker | client/public/serviceWorker.js | PWA/offline |
| Object Storage | server/routes/object-storage.mjs | File storage |

---

## Summary

| Domain | Count |
|--------|-------|
| Frontend Pages | 169 |
| Frontend Components | 269 |
| Backend Route Files | 114 |
| AI Systems | 13 |
| Auth/Security Middleware | 14 |
| Billing Systems | 8 |
| Agent Specifications | 6 |
| Growth Systems | 10 |
| Infrastructure | 13 |
| **Total Registered Systems** | **616** |

---

## Phase 8 Status: COMPLETE
No code modified. Capability registry documented.

# GLP Page Optimization Run List

## Generated: 2026-01-23

Prioritized page-by-page optimization order based on user impact and safety requirements.

---

## Phase 1: Public Marketing Pages (HIGH PRIORITY)
First impressions — must be polished, accessible, brand-aligned.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 1 | `/` | `landing/Landing.jsx` | Begin Free | No | typography, hero |
| 2 | `/pricing` | `Pricing.jsx` | Start Free | No | hierarchy, buttons |
| 3 | `/features` | `marketing/LandingFeatures.tsx` | Try Now | No | spacing, cards |
| 4 | `/about` | `AboutPage.jsx` | Learn More | No | content, microcopy |
| 5 | `/faq` | `FAQPage.jsx` | Contact Support | Yes ✓ | SEO, schema |
| 6 | `/healing-landing` | `HealingLandingPage.jsx` | Start Healing | Yes | claims, safety |
| 7 | `/blog` | `BlogIndex.jsx` | Read More | No | layout, cards |

---

## Phase 2: Auth Pages (QUIET PROFILE)
Minimal, calm, single-action focus.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 8 | `/login` | `auth/Login.tsx` | Sign In | No | quiet profile |
| 9 | `/register` | `Register.jsx` | Create Account | No | spacing, focus |
| 10 | `/forgot-password` | `ForgotPassword.jsx` | Reset Password | No | clarity |
| 11 | `/reset-password` | `ResetPassword.jsx` | Set New Password | No | flow |
| 12 | `/onboarding` | `Onboarding.tsx` | Continue | No | steps, microcopy |

---

## Phase 3: Core Dashboard Pages (STRUCTURED PROFILE)
User home base — must be clear, actionable, insight-rich.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 13 | `/dashboard` | `Dashboard.jsx` | Start Check-In | No | layout, hierarchy |
| 14 | `/today` | `dashboard/Overview.jsx` | Daily Practice | No | cards, spacing |
| 15 | `/journal` | `JournalPage.jsx` | Write Entry | Yes ✓ | done |
| 16 | `/mood` | `MoodPage.jsx` | Log Mood | Yes ✓ | done |
| 17 | `/state` | `StatePage.jsx` | Track State | Yes ✓ | done |
| 18 | `/insights` | `dashboard/Insights.tsx` | View Insights | No | data viz |
| 19 | `/progress` | `ProgressDashboardPage.tsx` | See Progress | No | charts |
| 20 | `/settings` | `Settings.jsx` | Save | No | forms |
| 21 | `/profile` | `account/Profile.tsx` | Update | No | forms |
| 22 | `/billing` | `account/Billing.tsx` | Manage | No | Stripe UI |

---

## Phase 4: Wellness Tools Pages (PRACTICE PROFILE) — HIGH EMOTION
These need SafetyFooter variant="prominent" and careful language.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 23 | `/breathing-exercises` | `BreathingExercisesPage.jsx` | Start Practice | Yes | microcopy |
| 24 | `/grounding-techniques` | `GroundingTechniquesPage.jsx` | Begin Grounding | Yes | steps |
| 25 | `/meditation-guide` | `MeditationGuidePage.jsx` | Start Meditation | Yes | audio/timer |
| 26 | `/affirmations` | `AffirmationsPage.jsx` | Practice Now | Yes ✓ | done |
| 27 | `/calming-scenes` | `CalmingScenesPage.jsx` | View Scenes | Yes | media |
| 28 | `/inner-child` | `InnerChildPage.jsx` | Begin Healing | Yes | prominent safety |
| 29 | `/nervous-system` | (via routes.js) | Learn More | Yes | education |
| 30 | `/stress-response` | (via routes.js) | Understand | Yes | claims |
| 31 | `/self-compassion` | (via routes.js) | Practice | Yes | tone |
| 32 | `/emotional-regulation` | (via routes.js) | Tools | Yes | steps |
| 33 | `/sleep-wellness` | (via routes.js) | Sleep Better | Yes | claims |
| 34 | `/body-wellness` | `BodyWellnessPage.jsx` | Body Practice | Yes | somatic |
| 35 | `/cognitive-reframing` | (via routes.js) | Reframe | Yes | CBT refs |
| 36 | `/guided-journaling` | `GuidedJournalingPage.tsx` | Start Writing | Yes | prompts |
| 37 | `/daily-rituals` | `DailyRitualPage.tsx` | Build Routine | No | habits |
| 38 | `/healing-journeys` | `HealingJourneysPage.jsx` | Begin Journey | Yes | prominent safety |
| 39 | `/self-care` | `SelfCareToolkitPage.jsx` | Explore | No | cards |
| 40 | `/wellness-hub` | `WellnessHubPage.jsx` | Browse Tools | No | navigation |

---

## Phase 5: Advanced & Mastery Tools
Power users — complex features, need clear hierarchy.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 41 | `/wisdom-tools` | `WisdomToolsPage.tsx` | Explore | No | cards |
| 42 | `/advanced-tools` | `AdvancedToolsPage.tsx` | Unlock | No | layout |
| 43 | `/mastery-tools` | `MasteryToolsPage.tsx` | Master | No | hierarchy |
| 44 | `/wisdom-practices` | `WisdomPracticesPage.tsx` | Practice | No | steps |
| 45 | `/wisdom-synthesis` | `WisdomSynthesisPage.tsx` | Synthesize | No | complexity |
| 46 | `/meta-learning` | `MetaLearningPage.tsx` | Learn | No | education |
| 47 | `/philosophy` | `PhilosophicalInquiryPage.tsx` | Inquire | No | content |
| 48 | `/knowledge-synthesis` | `KnowledgeSynthesisPage.tsx` | Synthesize | No | AI |
| 49 | `/systems-thinking` | `SystemsThinkingPage.tsx` | Think | No | diagrams |
| 50 | `/cognitive-architecture` | `CognitiveArchitecturePage.tsx` | Build | No | complexity |

---

## Phase 6: AI & Chat Pages
Sensitive — need clear disclaimers, crisis handling.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 51 | `/ai/chat` | `AIChatPage.jsx` | Start Chat | Yes | disclaimers |
| 52 | `/ai/conversation` | `ai/ChatConversation.tsx` | Continue | Yes | flow |
| 53 | `/ai/crisis` | `ai/ChatCrisis.tsx` | Get Help | Yes ✓ | crisis prominent |
| 54 | `/ai/coach` | (via routes.js) | Coach Me | Yes | claims |
| 55 | `/ai/insights` | (via routes.js) | View | No | data |

---

## Phase 7: Content & Learning
Educational — need SEO, schema, internal links.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 56 | `/blog` | `BlogIndex.jsx` | Read | No | SEO |
| 57 | `/blog/:slug` | `BlogPost.jsx` | Share | No | schema |
| 58 | `/guides` | `HowToGuidesPage.jsx` | Learn | No | cards |
| 59 | `/glossary` | `GlossaryPage.jsx` | Explore | Yes ✓ | done |
| 60 | `/research` | `ResearchEvidencePage.jsx` | Study | No | citations |
| 61 | `/study-vault` | `StudyVaultPage.tsx` | Research | No | layout |
| 62 | `/content-studio` | `ContentAdminDashboard.jsx` | Create | No | admin |
| 63 | `/resources` | `ResourcesPage.jsx` | Browse | No | links |

---

## Phase 8: Support & Legal
Trust pages — must be clear, accessible, professional.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 64 | `/support` | `SupportPage.tsx` | Contact | No | forms |
| 65 | `/crisis` | `CrisisResources.jsx` | Get Help Now | Yes ✓ | prominent |
| 66 | `/safety` | `SafetyPage.jsx` | Learn More | Yes | education |
| 67 | `/privacy` | `Privacy.tsx` | Read | No | legal |
| 68 | `/terms` | `Terms.tsx` | Accept | No | legal |
| 69 | `/disclaimer` | `Disclaimer.tsx` | Understand | Yes | legal |
| 70 | `/professional` | `ProfessionalResourcesPage.jsx` | For Pros | No | layout |

---

## Phase 9: Admin Pages
Internal — functional over beautiful, but still accessible.

| # | Route | File Path | Primary CTA | Safety Footer | First Patch |
|---|-------|-----------|-------------|---------------|-------------|
| 71 | `/admin` | `ControlDashboard.jsx` | Manage | No | layout |
| 72 | `/admin/content` | `ContentAdminDashboard.jsx` | Create | No | forms |
| 73 | `/admin/analytics` | `Analytics.jsx` | View | No | charts |
| 74 | `/admin/crm` | `CRMPage.jsx` | Manage | No | tables |
| 75 | `/admin/qa` | `QAPage.jsx` | Test | No | dev |
| 76 | `/health` | `HealthPage.jsx` | Status | No | system |
| 77 | `/design-system` | `DesignSystem.jsx` | Browse | No | docs |

---

## Summary by Safety Requirement

### Pages with SafetyFooter (variant="prominent")
High-emotion, trauma-related content:
- `/journal` ✓
- `/mood` ✓
- `/state` ✓
- `/affirmations` ✓
- `/inner-child`
- `/healing-journeys`
- `/ai/crisis` ✓
- `/crisis` ✓
- `/nervous-system`
- `/stress-response`
- `/emotional-regulation`

### Pages with SafetyFooter (variant="default")
Educational, informational:
- `/faq` ✓
- `/glossary` ✓
- `/disclaimer`
- `/safety`
- `/ai/chat`
- `/ai/coach`
- `/body-wellness`
- `/cognitive-reframing`

---

## Optimization Priority Order

### Tier 1 (This Week)
1. Landing page (`/`)
2. Pricing page (`/pricing`)
3. Dashboard (`/dashboard`)
4. Inner Child (`/inner-child`) — safety critical
5. AI Chat (`/ai/chat`) — disclaimers

### Tier 2 (Next Week)
6-15. Remaining wellness tools with SafetyFooter needs

### Tier 3 (Following Week)
16-40. Advanced tools, content pages

### Tier 4 (Ongoing)
41+. Admin, system pages

---

## How to Use This List

1. Pick the next page from Tier 1
2. Run `GLP_PAGE_UPGRADE_ENGINE` with that route
3. Review DRY-RUN output
4. Apply patches one at a time
5. Mark page as "done" in this list
6. Move to next page

---

## Progress Tracker

| Route | Status | Date | Notes |
|-------|--------|------|-------|
| `/journal` | Done | 2026-01-23 | SafetyFooter prominent |
| `/mood` | Done | 2026-01-23 | SafetyFooter prominent |
| `/state` | Done | 2026-01-23 | SafetyFooter prominent |
| `/affirmations` | Done | 2026-01-23 | SafetyFooter prominent |
| `/faq` | Done | 2026-01-23 | Claims hedged, SafetyFooter |
| `/glossary` | Done | 2026-01-23 | Therapy disclaimers |

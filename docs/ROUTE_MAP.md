# The Genuine Love Project - Route Map

## Overview
Complete enumeration of all application routes with access levels, templates, and status.

---

## Public Routes (No Authentication Required)

| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/` | Home.jsx | Marketing | Landing page |
| `/login` | Login.jsx | Auth | Sign in |
| `/register` | Register.jsx | Auth | Sign up |
| `/forgot-password` | ForgotPassword.jsx | Auth | Password reset request |
| `/reset-password` | ResetPassword.jsx | Auth | Password reset form |
| `/pricing` | Pricing.jsx | Marketing | Pricing plans |
| `/blog` | BlogIndex.jsx | Marketing | Blog listing |
| `/blog/:slug` | BlogPost.jsx | Reading | Blog article |
| `/crisis` | CrisisResources.jsx | Tool | Crisis resources |
| `/privacy` | Privacy.tsx | Legal | Privacy policy |
| `/terms` | Terms.tsx | Legal | Terms of service |
| `/disclaimer` | Disclaimer.tsx | Legal | Disclaimer |
| `/ethics` | EthicsPage.tsx | Legal | Ethics commitment |
| `/support` | SupportPage.tsx | Tool | Help center |
| `/health` | HealthPage.jsx | Utility | System health check |

---

## Authenticated Routes (Login Required)

### Core Dashboard
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/dashboard` | Dashboard.jsx | Dashboard | Main dashboard |
| `/today` | StatePage.jsx | Tool | Daily wellness space |
| `/settings` | Settings.jsx | Account | User settings |
| `/analytics` | Analytics.jsx | Dashboard | Personal analytics |

### Mood & Journal
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/mood` | MoodPage.jsx | Tool | Mood tracking |
| `/journal` | JournalPage.jsx | Tool | Journal entries |
| `/journal/:id` | JournalPage.jsx | Reading | Single journal entry |

### Wellness
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/wellness` | Wellness.jsx | Tool | Wellness toolkit hub |
| `/premium` | Premium.jsx | Tool | Premium features |

### AI & Chat
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/chat` | AIChatPage.jsx | Tool | AI companion chat |
| `/mirror` | MirrorPage.tsx | Tool | Mirror journaling API |

### Atlas (Intellectual Tools)
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/atlas` | AtlasDashboard.tsx | Dashboard | Atlas hub |
| `/atlas/strategy-maps` | StrategyMapsPage.tsx | Tool | Strategy mapping |
| `/atlas/systems-thinking` | SystemsThinkingPage.tsx | Tool | Systems analysis |
| `/atlas/knowledge-synthesis` | KnowledgeSynthesisPage.tsx | Tool | Knowledge synthesis |
| `/atlas/wisdom-practices` | WisdomPracticesPage.tsx | Tool | Wisdom practices |
| `/atlas/wisdom-synthesis` | WisdomSynthesisPage.tsx | Tool | Wisdom synthesis |
| `/atlas/philosophical-inquiry` | PhilosophicalInquiryPage.tsx | Tool | Philosophy tools |
| `/atlas/meta-learning` | MetaLearningPage.tsx | Tool | Learning tools |
| `/atlas/cognitive-architecture` | CognitiveArchitecturePage.tsx | Tool | Cognitive tools |
| `/atlas/resilience-metrics` | ResilienceMetricsPage.tsx | Tool | Resilience tracking |
| `/atlas/collaborative-lab` | CollaborativeLabPage.tsx | Tool | Collaboration |
| `/atlas/insight-cards` | InsightCardsPage.tsx | Tool | Insight cards |
| `/atlas/daily-wisdom` | DailyWisdomOraclePage.tsx | Tool | Daily wisdom |
| `/atlas/adaptive-companion` | AdaptiveCompanionPage.tsx | Tool | Adaptive AI |
| `/atlas/guided-journaling` | GuidedJournalingPage.tsx | Tool | Guided journaling |

### Tools Hub
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/tools` | ToolsPage.tsx | Dashboard | All tools hub |
| `/tools/advanced` | AdvancedToolsPage.tsx | Tool | Advanced tools |
| `/tools/wisdom` | WisdomToolsPage.tsx | Tool | Wisdom tools |
| `/tools/mastery` | MasteryToolsPage.tsx | Tool | Mastery tools |
| `/tools/elite` | EliteToolsDashboard.tsx | Tool | Elite tools |

### Progress & Growth
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/growth-analytics` | GrowthAnalyticsPage.tsx | Dashboard | Growth tracking |
| `/progress` | ProgressDashboardPage.tsx | Dashboard | Progress overview |
| `/daily-ritual` | DailyRitualPage.tsx | Tool | Daily rituals |
| `/content-studio` | ContentStudioPage.tsx | Tool | Content creation |
| `/study-vault` | StudyVaultPage.tsx | Tool | Study resources |

### Account
| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/onboarding` | Onboarding.tsx | Onboarding | New user setup |
| `/upgrade` | Upgrade.jsx | Marketing | Upgrade prompt |
| `/billing` | Billing.tsx | Account | Billing management |

---

## Admin Routes (Admin Role Required)

| Route | File | Template | Description |
|-------|------|----------|-------------|
| `/admin` | Admin.jsx | Admin | Admin dashboard |
| `/control` | ControlDashboard.jsx | Admin | Control panel |
| `/design` | DesignDashboard.jsx | Admin | Design system |
| `/publish` | Publishing.jsx | Admin | Publishing tools |
| `/blog/new` | BlogEditor.jsx | Admin | Blog editor |

---

## API Routes (Server)

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Current user |

### Wellness
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mood` | GET/POST | Mood entries |
| `/api/journal` | GET/POST | Journal entries |
| `/api/dashboard` | GET | Dashboard data |

### Content
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blog` | GET/POST | Blog posts |
| `/api/blog/:slug` | GET | Single post |

### Health
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health-check` | GET | API health |
| `/healthz` | GET | Container health |

---

## Route Guards

| Guard | Protected Routes | Redirect |
|-------|------------------|----------|
| `RequireAuth` | All `/dashboard/*` routes | `/login` |
| `RequireAdmin` | All `/admin/*` routes | `/dashboard` |
| `RequireGuest` | `/login`, `/register` | `/dashboard` |

---

## Template Types

| Template | Description | Layout |
|----------|-------------|--------|
| Marketing | Public landing pages | Navbar + Footer |
| Auth | Authentication forms | Minimal centered |
| Dashboard | Authenticated dashboard | Sidebar + Navbar |
| Tool | Wellness/Atlas tools | Back link + Content |
| Reading | Long-form content | Narrow width |
| Legal | Legal documents | Simple header |
| Admin | Admin interfaces | Admin sidebar |
| Account | Account settings | Settings nav |

---

## 404 Handling

- Custom 404 page at `/not-found`
- Displays calm messaging
- Links to Dashboard (auth) or Home (public)
- Suggests popular destinations

---

## Last Updated
January 2026

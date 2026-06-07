# Phase 97 Active-Runtime Duplicate Ownership Gate

## Objective
Replace noisy duplicate scans with an active-runtime-only ownership audit.

## Why
The previous broad duplicate report included backup trees, cache folders, npm-global packages, historical snapshots, and generated artifacts. That noise makes canonical cleanup unsafe.

## Active Runtime Roots
- client/src
- server
- shared
- database
- scripts
- src
- components
- pages
- api
- app

## Excluded Noise Roots
- .git
- node_modules
- .cache
- .config
- .local
- diagnostics
- client/dist
- dist
- backups
- production-backups
- .hx-backups
- .archive
- _archive
- _quarantine
- coverage
- .tmp_drizzle

## Counts
- Active runtime files scanned: 1812
- Active duplicate families found: 120
- Root shadow trees found: 5

## Selected Next Candidate
Selected: **index**

- client/src/avatar-life/index.ts
- client/src/calm-checkin/index.ts
- client/src/checkin-flow/index.ts
- client/src/companion-voice/index.ts
- client/src/components/benefits/index.js
- client/src/components/methods/index.js
- client/src/components/mi/index.ts
- client/src/components/referral/index.js
- client/src/components/sacred/index.js
- client/src/components/share/index.js
- client/src/components/state/index.ts
- client/src/components/ui/index.js
- client/src/content/frameworks/index.js
- client/src/content/index.ts
- client/src/content/microcopy/index.js
- client/src/content/routes/index.js
- client/src/design-system/components/index.ts
- client/src/design-system/index.js
- client/src/design-system/index.ts
- client/src/design-system/tokens/index.ts
- client/src/lumi-agent/index.ts
- client/src/lumi-audit/index.ts
- client/src/lumi-boundaries/index.ts
- client/src/lumi-cbt/index.ts
- client/src/lumi-circadian/index.ts
- client/src/lumi-consistency/index.ts
- client/src/lumi-conversation/index.ts
- client/src/lumi-crisis/index.ts
- client/src/lumi-disclaimer/index.ts
- client/src/lumi-language/index.ts
- client/src/lumi-library/index.ts
- client/src/lumi-memory/index.ts
- client/src/lumi-notifications/index.ts
- client/src/lumi-rbac/index.ts
- client/src/lumi-registry/index.ts
- client/src/lumi-rituals/index.ts
- client/src/lumi-scenes/index.ts
- client/src/lumi-tokens/index.ts
- client/src/lumi-tracker/index.ts
- client/src/lumi-voice/index.ts
- client/src/pages/hubs/index.jsx
- client/src/pages/tools/index.jsx
- client/src/skills/index.ts
- database/schema/index.ts
- pages/forgot-password/index.jsx
- pages/index.jsx
- pages/login/index.jsx
- pages/onboarding/index.jsx
- pages/register/index.jsx
- pages/reset-password/index.jsx
- server/db/schema/index.mjs
- server/replit_integrations/audio/index.ts
- server/replit_integrations/auth/index.mjs
- server/replit_integrations/batch/index.ts
- server/replit_integrations/chat/index.ts
- server/replit_integrations/image/index.ts
- server/replit_integrations/object_storage/index.ts
- shared/constants/index.ts
- shared/types/index.ts
- shared/validators/index.ts
- src/index.js

## Boundary
- No files deleted.
- No imports rewritten.
- No routes changed.
- No component rewritten.
- No quarantine performed.

## Next Safe Step
Phase 98 should inspect only the selected family and produce a canonical owner + rollback-safe mutation plan.

# Active Duplicate Families

## index
- File count: 61
- Has client/src: yes
- Has server: yes
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - client/src/avatar-life/index.ts
  - client/src/calm-checkin/index.ts
  - client/src/checkin-flow/index.ts
  - client/src/companion-voice/index.ts
  - client/src/components/benefits/index.js
  - client/src/components/methods/index.js
  - client/src/components/mi/index.ts
  - client/src/components/referral/index.js
  - client/src/components/sacred/index.js
  - client/src/components/share/index.js
  - client/src/components/state/index.ts
  - client/src/components/ui/index.js
  - client/src/content/frameworks/index.js
  - client/src/content/index.ts
  - client/src/content/microcopy/index.js
  - client/src/content/routes/index.js
  - client/src/design-system/components/index.ts
  - client/src/design-system/index.js
  - client/src/design-system/index.ts
  - client/src/design-system/tokens/index.ts
  - client/src/lumi-agent/index.ts
  - client/src/lumi-audit/index.ts
  - client/src/lumi-boundaries/index.ts
  - client/src/lumi-cbt/index.ts
  - client/src/lumi-circadian/index.ts
  - client/src/lumi-consistency/index.ts
  - client/src/lumi-conversation/index.ts
  - client/src/lumi-crisis/index.ts
  - client/src/lumi-disclaimer/index.ts
  - client/src/lumi-language/index.ts
  - client/src/lumi-library/index.ts
  - client/src/lumi-memory/index.ts
  - client/src/lumi-notifications/index.ts
  - client/src/lumi-rbac/index.ts
  - client/src/lumi-registry/index.ts
  - client/src/lumi-rituals/index.ts
  - client/src/lumi-scenes/index.ts
  - client/src/lumi-tokens/index.ts
  - client/src/lumi-tracker/index.ts
  - client/src/lumi-voice/index.ts
  - client/src/pages/hubs/index.jsx
  - client/src/pages/tools/index.jsx
  - client/src/skills/index.ts
  - database/schema/index.ts
  - pages/forgot-password/index.jsx
  - pages/index.jsx
  - pages/login/index.jsx
  - pages/onboarding/index.jsx
  - pages/register/index.jsx
  - pages/reset-password/index.jsx
  - server/db/schema/index.mjs
  - server/replit_integrations/audio/index.ts
  - server/replit_integrations/auth/index.mjs
  - server/replit_integrations/batch/index.ts
  - server/replit_integrations/chat/index.ts
  - server/replit_integrations/image/index.ts
  - server/replit_integrations/object_storage/index.ts
  - shared/constants/index.ts
  - shared/types/index.ts
  - shared/validators/index.ts
  - src/index.js

## Hero
- File count: 4
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/landing/Hero.tsx
  - client/src/components/sacred/Hero.jsx
  - client/src/components/ui/Hero.jsx
  - components/Hero.jsx

## App
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - client/src/App.jsx
  - client/src/components/App.tsx
  - src/App.jsx

## microcopy
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/microcopy.js
  - client/src/lib/microcopy.ts
  - src/lib/microcopy.ts

## theme
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/theme.ts
  - client/src/components/ui/theme.js
  - src/theme.js

## wellnessMicrocopy
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/frameworks/wellnessMicrocopy.js
  - client/src/content/microcopy/wellnessMicrocopy.ts
  - components/microcopy/wellnessMicrocopy.js

## healing
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - pages/healing.jsx
  - server/routes/healing.mjs

## journal
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: yes

  - server/routes/journal.mjs
  - src/utils/journal.js

## EmotionLog
- File count: 4
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/EmotionLog.jsx
  - client/src/components/wellness/EmotionLog.jsx
  - components/EmotionLog.jsx
  - src/components/EmotionLog.jsx

## JournalAI
- File count: 4
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/JournalAI.jsx
  - client/src/components/wellness/JournalAI.jsx
  - components/JournalAI.jsx
  - src/components/JournalAI.jsx

## JournalPage
- File count: 4
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/features/journal/JournalPage.jsx
  - client/src/pages/JournalPage.jsx
  - pages/JournalPage.jsx
  - src/pages/JournalPage.jsx

## LotusGuide
- File count: 4
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/LotusGuide.jsx
  - client/src/components/sacred/LotusGuide.jsx
  - src/auth/sacred/LotusGuide.jsx
  - src/sacred/LotusGuide.jsx

## WellnessDashboard
- File count: 4
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/pages/WellnessDashboard.jsx
  - components/WellnessDashboard.jsx
  - src/WellnessDashboard.jsx
  - src/components/WellnessDashboard.jsx

## EmotionCalendar
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/EmotionCalendar.jsx
  - components/EmotionCalendar.jsx
  - src/components/EmotionCalendar.jsx

## MoodTrendsChart
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/MoodTrendsChart.jsx
  - components/MoodTrendsChart.jsx
  - src/components/MoodTrendsChart.jsx

## SacredFooter
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/SacredFooter.jsx
  - client/src/components/sacred/SacredFooter.jsx
  - components/SacredFooter.jsx

## aiChat
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/lib/aiChat.ts
  - src/lib/aiChat.ts

## AuthContext
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/context/AuthContext.jsx
  - src/auth/AuthContext.jsx

## BenefitBlock
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/benefits/BenefitBlock.tsx
  - src/components/benefits/BenefitBlock.tsx

## benefits
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/lib/benefits.ts
  - src/lib/benefits.ts

## blog
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - app/backend/server/routes/blog.mjs
  - server/routes/blog.mjs

## EmotionBackground
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/sacred/EmotionBackground.jsx
  - components/EmotionBackground.jsx

## LandingPage
- File count: 2
- Has client/src: no
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - pages/LandingPage.jsx
  - src/pages/LandingPage.jsx

## Login
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/pages/Login.jsx
  - src/auth/Login.jsx

## PageTemplate
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/PageTemplate.jsx
  - components/PageTemplate.jsx

## PlatformComponent
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/sacred/PlatformComponent.jsx
  - components/PlatformComponent.jsx

## SacredButton
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/sacred/SacredButton.jsx
  - components/SacredButton.jsx

## SacredNav
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/SacredNav.jsx
  - src/sacred/SacredNav.jsx

## SacredSection
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/sacred/SacredSection.jsx
  - components/SacredSection.jsx

## safety
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/lib/safety.ts
  - src/lib/safety.ts

## SafetyFooterStrip
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/safety/SafetyFooterStrip.tsx
  - src/components/safety/SafetyFooterStrip.tsx

## VoiceAffirmation
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: yes
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/VoiceAffirmation.jsx
  - src/components/VoiceAffirmation.jsx

## brand
- File count: 6
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/brand/brand.ts
  - client/src/config/brand.ts
  - client/src/layouts/brand.ts
  - client/src/lib/brand.ts
  - shared/brand.mjs
  - shared/brand.ts

## routes
- File count: 6
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/routes.js
  - server/replit_integrations/audio/routes.ts
  - server/replit_integrations/auth/routes.mjs
  - server/replit_integrations/chat/routes.ts
  - server/replit_integrations/image/routes.ts
  - server/replit_integrations/object_storage/routes.ts

## users
- File count: 4
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - database/schema/users.ts
  - server/db/queries/users.js
  - server/db/schema/users.js
  - server/services/users.mjs

## BenefitsBlock
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/BenefitsBlock.jsx
  - client/src/components/marketing/BenefitsBlock.tsx
  - client/src/components/wellness/BenefitsBlock.tsx

## client
- File count: 3
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - server/db/client.mjs
  - server/replit_integrations/audio/client.ts
  - server/replit_integrations/image/client.ts

## disclaimer
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/legal/disclaimer.ts
  - client/src/lumi-disclaimer/disclaimer.ts
  - shared/disclaimer.mjs

## Footer
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/Footer.jsx
  - client/src/components/layout/Footer.tsx
  - client/src/components/ui/Footer.jsx

## StateTracker
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/StateTracker.jsx
  - client/src/components/StateTracker.tsx
  - client/src/components/state/StateTracker.tsx

## tokens
- File count: 3
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/brand/tokens.ts
  - client/src/design-system/tokens.ts
  - server/auth/tokens.mjs

## analytics
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/lib/analytics.ts
  - server/routes/analytics.mjs

## api
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/lib/api.ts
  - server/routes/api.mjs

## auditLogger
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/lumi-audit/logger/auditLogger.ts
  - server/utils/auditLogger.mjs

## BehaviorChangePage
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/pages/BehaviorChangePage.jsx
  - client/src/pages/BehaviorChangePage.tsx

## BrandLogo
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/BrandLogo.tsx
  - client/src/components/brand/BrandLogo.jsx

## ClarityCard
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/content/ClarityCard.jsx
  - client/src/components/wellness/ClarityCard.tsx

## copy
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/brand/copy.ts
  - client/src/shared/brand/copy.js

## ExamplesAccordion
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/content/ExamplesAccordion.jsx
  - client/src/components/wellness/ExamplesAccordion.tsx

## featureFlags
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/flags/featureFlags.ts
  - shared/featureFlags.mjs

## journalPrompts
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/journalPrompts.js
  - client/src/data/journalPrompts.ts

## modules
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/modules/modules.js
  - server/ai/modules.mjs

## PageScaffold
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/PageScaffold.jsx
  - client/src/components/layout/PageScaffold.tsx

## PageShell
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/design-system/PageShell.jsx
  - client/src/design-system/layouts/PageShell.tsx

## password
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - server/auth/password.js
  - server/utils/password.mjs

## PrimaryButton
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/ui/PrimaryButton.jsx
  - client/src/design-system/components/PrimaryButton.tsx

## Privacy
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/pages/Privacy.jsx
  - client/src/pages/Privacy.tsx

## reflection
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/pages/reflection.tsx
  - server/routes/reflection.mjs

## ReflectionFooter
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/ui/ReflectionFooter.jsx
  - client/src/components/ui/ReflectionFooter.tsx

## routeMetaRegistry
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/content/meta/routeMetaRegistry.ts
  - client/src/content/routeMetaRegistry.js

## SafetyFooter
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/SafetyFooter.jsx
  - client/src/components/wellness/SafetyFooter.tsx

## security
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/lib/security.ts
  - server/middleware/security.mjs

## sentry
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/lib/sentry.js
  - server/utils/sentry.mjs

## SkipToContent
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/SkipToContent.jsx
  - client/src/components/a11y/SkipToContent.tsx

## storage
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - server/replit_integrations/auth/storage.mjs
  - server/replit_integrations/chat/storage.ts

## ToolCard
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/ToolCard.tsx
  - client/src/components/discovery/ToolCard.jsx

## UpsellModal
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: yes

  - client/src/components/UpsellModal.jsx
  - client/src/components/UpsellModal.tsx

## vitest.config
- File count: 10
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/avatar-life/__tests__/vitest.config.mjs
  - client/src/calm-checkin/__tests/vitest.config.mjs
  - client/src/checkin-flow/__tests/vitest.config.mjs
  - client/src/companion-voice/__tests/vitest.config.mjs
  - client/src/lumi-circadian/tests/vitest.config.mjs
  - client/src/lumi-conversation/tests/vitest.config.mjs
  - client/src/lumi-integration/tests/vitest.config.mjs
  - client/src/lumi-memory/tests/vitest.config.mjs
  - client/src/lumi-rituals/tests/vitest.config.mjs
  - client/src/lumi-scenes/tests/vitest.config.mjs

## csrf
- File count: 3
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/lib/csrf.mjs
  - server/middleware/csrf.mjs
  - server/security/csrf.mjs

## email
- File count: 3
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/routes/email.mjs
  - server/services/email.mjs
  - server/utils/email.mjs

## SacredBackground
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/SacredBackground.jsx
  - client/src/components/sacred/SacredBackground.jsx
  - client/src/components/ui/SacredBackground.jsx

## twelvePractices
- File count: 3
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/content/modules/twelvePractices.ts
  - client/src/content/paths/twelvePractices.ts
  - client/src/skills/packs/twelvePractices.ts

## aiClient
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/services/aiClient.mjs
  - server/utils/aiClient.mjs

## app
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/app.mjs
  - server/tests/app.mjs

## audit
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/middleware/audit.mjs
  - server/security/audit.mjs

## auth
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/middleware/auth.mjs
  - server/routes/auth.mjs

## Button
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/ui/Button.jsx
  - client/src/design-system/Button.jsx

## calmCheckinMotion
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/calm-checkin/motion/calmCheckinMotion.ts
  - client/src/lumi-conversation/motion/calmCheckinMotion.ts

## Card
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/ui/Card.jsx
  - client/src/design-system/Card.jsx

## cookies
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/security/cookies.mjs
  - server/utils/cookies.mjs

## Disclaimer
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/legal/Disclaimer.tsx
  - client/src/pages/Disclaimer.tsx

## EmailCapture
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/marketing/EmailCapture.jsx
  - client/src/sections/EmailCapture.jsx

## EmotionWheel
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/EmotionWheel.jsx
  - client/src/pages/tools/EmotionWheel.jsx

## EmptyState
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/EmptyState.jsx
  - client/src/components/ui/EmptyState.jsx

## Header
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/Header.jsx
  - client/src/components/layout/Header.jsx

## HeroSection
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/HeroSection.jsx
  - client/src/components/ui/HeroSection.jsx

## holdingSpace
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/lumi-rituals/presets/holdingSpace.ts
  - client/src/lumi-scenes/presets/holdingSpace.ts

## insightEngine
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/intelligence/insightEngine.ts
  - client/src/lib/insights/insightEngine.ts

## jwt
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/auth/jwt.mjs
  - server/utils/jwt.mjs

## LazyImage
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/LazyImage.jsx
  - client/src/components/ui/LazyImage.jsx

## lumiRegistry
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/lumi-registry/config/lumiRegistry.ts
  - client/src/lumi-registry/runtime/lumiRegistry.ts

## lumiSystemPrompt
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/lumi-agent/prompts/lumiSystemPrompt.ts
  - client/src/lumi-conversation/prompts/lumiSystemPrompt.ts

## metrics
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/routes/metrics.mjs
  - server/utils/metrics.mjs

## mi
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/content/modules/mi.ts
  - client/src/skills/packs/mi.ts

## mode
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/lib/mode.js
  - server/lib/mode.js

## nlpReframes
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/content/tools/nlpReframes.ts
  - client/src/lib/nlpReframes.ts

## OfficialLumi
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/lumi/OfficialLumi.tsx
  - client/src/lumi-registry/components/OfficialLumi.tsx

## officialLumiAssets
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/avatar-life/officialLumiAssets.ts
  - client/src/officialLumiAssets.ts

## OnboardingFlow
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/OnboardingFlow.jsx
  - client/src/pages/OnboardingFlow.jsx

## pipeline
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/awareness/detection/pipeline.mjs
  - server/biometrics/pipeline.mjs

## Profile
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/pages/Profile.jsx
  - client/src/pages/account/Profile.jsx

## ProgressTracker
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/ProgressTracker.jsx
  - client/src/components/sacred/ProgressTracker.jsx

## ProtectedRoute
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/ProtectedRoute.jsx
  - client/src/guards/ProtectedRoute.jsx

## protocols
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/protocols/seed/protocols.mjs
  - server/routes/protocols.mjs

## reflectionPrompts
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/data/reflectionPrompts.ts
  - client/src/lumi-conversation/content/reflectionPrompts.ts

## routeKey
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/content/routeKey.js
  - client/src/utils/routeKey.js

## SafetyFooter.d
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/SafetyFooter.d.ts
  - client/src/components/ui/SafetyFooter.d.ts

## schema
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/db/schema.mjs
  - shared/schema.mjs

## SEO
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/SEO.tsx
  - client/src/components/seo/SEO.tsx

## sessionStore
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/db/sessionStore.mjs
  - server/sessionStore.mjs

## Settings
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/pages/Settings.jsx
  - client/src/pages/account/Settings.jsx

## Skeleton
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/Skeleton.jsx
  - client/src/components/ui/Skeleton.jsx

## social-posting
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/routes/social-posting.mjs
  - server/services/social-posting.mjs

## StatePage
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/features/state/StatePage.jsx
  - client/src/pages/StatePage.jsx

## streaks
- File count: 2
- Has client/src: no
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - server/db/streaks.mjs
  - server/routes/streaks.mjs

## utils
- File count: 2
- Has client/src: yes
- Has server: yes
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/lib/utils.ts
  - server/replit_integrations/batch/utils.ts

## WeeklyRecap
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/WeeklyRecap.jsx
  - client/src/components/dashboard/WeeklyRecap.jsx

## WeeklyReflection
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/WeeklyReflection.jsx
  - client/src/pages/tools/WeeklyReflection.jsx

## WellnessToolkit
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/WellnessToolkit.jsx
  - client/src/components/ui/WellnessToolkit.jsx

## wellnessToolsData
- File count: 2
- Has client/src: yes
- Has server: no
- Has root shadow: no
- Has JSX/TSX/JS/TS mix: no

  - client/src/components/ui/wellnessToolsData.js
  - client/src/components/wellnessToolsData.js

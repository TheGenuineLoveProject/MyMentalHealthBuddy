# Feature Registry (Anti-Redo Map)

> Before implementing ANY feature, check this registry first.
> If a feature exists with keeper files, modify ONLY those files.

## Format

```
## Feature: <name>
- **Keeper**: <primary file(s)>
- **Related Routes**: <API endpoints>
- **Related Tables**: <DB tables>
- **Status**: ❌ | 🟡 | ✅
- **Owner**: client | server | shared
```

---

## Core Features

### Feature: Authentication
- **Keeper**: `server/routes/auth.mjs`, `server/middleware/auth.mjs`
- **Related Routes**: `/api/auth/*`, `/api/login`, `/api/logout`, `/api/me`
- **Related Tables**: `users`, `sessions`
- **Status**: ✅
- **Owner**: server

### Feature: AI Chat
- **Keeper**: `server/routes/ai.mjs`, `server/lib/aiSafety.mjs`
- **Related Routes**: `/api/ai/*`, `/api/chat`
- **Related Tables**: `conversations`, `messages`
- **Status**: ✅
- **Owner**: server

### Feature: Crisis Detection
- **Keeper**: `server/lib/crisisDetection.mjs`
- **Related Routes**: `/api/ai/chat`, `/crisis`
- **Related Tables**: None (in-memory)
- **Status**: ✅
- **Owner**: server

### Feature: Billing (Stripe)
- **Keeper**: `server/routes/billing.mjs`, `server/routes/webhook.mjs`
- **Related Routes**: `/api/billing/*`, `/api/webhooks/stripe`
- **Related Tables**: `subscriptions`, `payments`
- **Status**: ✅
- **Owner**: server

### Feature: Journaling
- **Keeper**: `server/routes/journaling.mjs`, `client/src/pages/JournalPage.tsx`
- **Related Routes**: `/api/journal/*`
- **Related Tables**: `journal_entries`
- **Status**: ✅
- **Owner**: shared

### Feature: Mood Tracker
- **Keeper**: `server/routes/mood.mjs`, `client/src/components/MoodTracker.tsx`
- **Related Routes**: `/api/mood/*`
- **Related Tables**: `mood_entries`
- **Status**: ✅
- **Owner**: shared

### Feature: Content Tiers
- **Keeper**: `client/src/content/readingLevels.js`, `shared/schema.ts`
- **Related Routes**: All content APIs
- **Related Tables**: `user_preferences`
- **Status**: ✅
- **Owner**: shared

### Feature: Admin Dashboard
- **Keeper**: `client/src/pages/admin/CommandCenter.tsx`
- **Related Routes**: `/api/admin/*`
- **Related Tables**: `admin_logs`, `audit_events`
- **Status**: ✅
- **Owner**: client

### Feature: SEO
- **Keeper**: `client/src/components/seo/SEO.tsx`
- **Related Routes**: All pages
- **Related Tables**: None
- **Status**: ✅
- **Owner**: client

### Feature: Design Tokens
- **Keeper**: `client/src/styles/tokens.css`, `client/src/styles/brand-tokens.css`
- **Related Routes**: None
- **Related Tables**: None
- **Status**: ✅
- **Owner**: client

---

## Rules

1. **Check before implementing**: Search this file before adding new features
2. **Update on changes**: Add new features here when implementing
3. **Single keeper**: Each feature has ONE primary location
4. **No shadows**: Don't create backup/alternate implementations

---

_Last updated: January 2026_

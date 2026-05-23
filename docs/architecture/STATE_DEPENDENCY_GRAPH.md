# MMHB State Dependency Graph

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive snapshot — no runtime changes

---

## 1. Three state systems coexist

MMHB uses **three** state management systems concurrently. This is observable in the codebase, not a recommendation; it is the principal source of the **state-management overlap** finding in the duplication scan.

| System | Primary use | Representative files |
|---|---|---|
| **Zustand** | Local domain stores | `client/src/avatar-life/state/useAvatarLifeStore.tsx`, `client/src/checkin-flow/state/*` |
| **React Context** | Cross-cutting providers (auth, theme, brand, emotion, gamification, reading-level) | `client/src/App.jsx` provider stack (deeply nested) |
| **TanStack Query** | Server-derived data + cache | `client/src/lib/queryClient.js` |

## 2. Data flow at a glance

```
   ┌──────────────────────────────────────────────────────────────┐
   │   Backend (Express)                                          │
   │   - PostgreSQL via Drizzle                                   │
   │   - Stripe, Resend, Perplexity, OpenAI, Sentry (external)    │
   └────────────────┬─────────────────────────────────────────────┘
                    │ JSON over HTTP
   ┌────────────────▼─────────────────────────────────────────────┐
   │   TanStack Query (server state cache)                        │
   │   - Initialized in client/src/lib/queryClient.js             │
   │   - Hooks: useQuery / useMutation across pages & components  │
   │   - Invalidation: per-queryKey                               │
   └────────────────┬─────────────────────────────────────────────┘
                    │ derived data
   ┌────────────────▼─────────────────────────────────────────────┐
   │   React Context layer                                        │
   │   ├─ AuthProvider          (user, JWT, session)              │
   │   ├─ ThemeProvider          (light/dark, brand mode)         │
   │   ├─ BrandProvider          (canonical palette tokens)       │
   │   ├─ EmotionProvider        (current emotional state)        │
   │   ├─ GamificationProvider   (XP, streaks, badges)            │
   │   ├─ ReadingLevelProvider   (a11y reading level)             │
   │   └─ … many more in client/src/App.jsx                       │
   └────────────────┬─────────────────────────────────────────────┘
                    │ context values
   ┌────────────────▼─────────────────────────────────────────────┐
   │   Zustand stores (transient feature state)                   │
   │   ├─ useAvatarLifeStore    (avatar-life feature)             │
   │   ├─ checkin-flow stores   (mood / journal multi-step)       │
   │   └─ feature-local stores in lumi-* modules                  │
   └────────────────┬─────────────────────────────────────────────┘
                    │ component reads
   ┌────────────────▼─────────────────────────────────────────────┐
   │   Components / Pages                                         │
   │   - Local component state via useState                       │
   │   - Form state via react-hook-form (when used)               │
   └──────────────────────────────────────────────────────────────┘
```

## 3. State source matrix — who owns what

| Concept | Owner system | Source of truth |
|---|---|---|
| Authenticated user | React Context (`AuthProvider`) | server JWT cookie |
| User profile | TanStack Query | server `/api/user/me`-class |
| Theme (light/dark) | React Context (`ThemeProvider`) | localStorage + system |
| Brand palette | React Context (`BrandProvider`) | `client/src/brand/tokens.ts` + `client/src/lumi-tokens/colors/colorTokens.ts` (drift — see duplication scan) |
| Current mood entry | Zustand (`checkin-flow`) | local then POST to server |
| Mood history | TanStack Query | server |
| Journal draft | Zustand | local then POST |
| Journal entries | TanStack Query | server |
| AI chat conversation | Zustand + Lumi runtime state | server-backed via `lumi-conversation` flow |
| AI long-term memory | Lumi runtime (`client/src/lumi-memory/**`) | server `lumi-memory` routes (if mounted) |
| Crisis resources | static (no state) | `client/src/lumi-crisis/resources/crisisResources.ts` (hardcoded literals) |
| Gamification (XP, streaks) | React Context | server-derived |
| Subscription / entitlements | TanStack Query | server `routes/billing.mjs` + Stripe |

## 4. Provider stack depth

`client/src/App.jsx` is observed to wrap the route tree in **a deep stack of Providers** (Auth + Theme + Brand + Emotion + Gamification + ReadingLevel + …). This is consistent with React Context as the primary cross-cutting state vehicle. **Depth itself is not a defect** — but it is the reason why the same logical concern (e.g. "current user") cannot be moved to Zustand without a rewrite, and why TanStack Query coexists with Context rather than replacing it.

## 5. State overlap risks (observational, no fix)

| Concern | Where seen | Severity |
|---|---|---|
| Brand palette defined in **two** files | `client/src/brand/tokens.ts` + `client/src/lumi-tokens/colors/colorTokens.ts` | **MED** — tokens drift (see audit §6) |
| Tailwind palette also defines colors | `tailwind.config.js` | **MED** — third source of color truth |
| User identity in Context + cached separately in TanStack | Auth context + `/api/user/me` query | **LOW** — common React pattern; not a defect |
| Mood draft in Zustand + persisted via Query | `checkin-flow/state/*` + mutation hook | **LOW** — standard hybrid pattern |
| Multiple chat surfaces with separate state | `AIChat.jsx` (legacy), `chat/AIChatPanel.tsx`, `lumi-conversation/LumiConversationPanel.tsx` | **HIGH** — three chat UIs with independent state stores (see duplication scan §2) |

## 6. External state dependencies

| Service | What state crosses the boundary |
|---|---|
| Stripe | subscription status, payment method, invoice events (via webhook) |
| Resend | outbound email queue state (write-only) |
| Perplexity | per-request prompt + response; no persistent state from MMHB |
| OpenAI | per-request prompt + response (used in `server/replit_integrations/chat/routes.ts`) |
| Sentry | error events (write-only) |
| Replit Object Storage | uploaded asset URLs (read/write) |

## 7. Persistence layer

| Tier | Tool | Source of truth |
|---|---|---|
| Schema | Drizzle (`shared/schema.ts` + `drizzle.config.ts`) | code |
| Migration | `npm run db:push` only (per replit.md) | Drizzle CLI |
| Connection | `DATABASE_URL` (PG) | environment |
| ORM hook | server-side only | `server/storage.ts`-class layer |

## 8. State invalidation conventions

| Pattern | Used? |
|---|---|
| `queryClient.invalidateQueries` after mutation | yes — required convention per replit.md |
| Hierarchical query keys (`['/api/mood', userId]`) | yes |
| Manual cache writes | rare; flagged when encountered |

## 9. Where this graph is **incomplete by design**

- It does not enumerate every Zustand store (there are dozens scattered across lumi-* modules).
- It does not enumerate every Context provider (deeply nested in `App.jsx`).
- It does not draw per-feature subgraphs (mood, journal, chat each have their own substacks).

For chat in particular, see the duplication scan (`docs/audits/DUPLICATION_SCAN.md` §2) — the **three competing chat surfaces** are the load-bearing finding for "state overlap" and warrant a dedicated future audit.

---

*This dependency graph is the descriptive snapshot. No state system is being removed or refactored in this phase. The brand-palette dual source (§5) and the three-chat-surface concern (§5, HIGH) are the two items most likely to merit a planned phase to address.*

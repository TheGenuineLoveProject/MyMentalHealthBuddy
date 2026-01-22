# FIX LEDGER — The Genuine Love Project

## Phase 0: Discovery (Completed)

### Framework Analysis
- **Frontend**: React 18 + Vite (SPA with wouter routing)
- **Backend**: Express.js (Node.js 20+, ESM modules)
- **Database**: PostgreSQL (Drizzle ORM)
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **Auth**: Passport.js + GitHub OAuth + JWT + Express Sessions
- **Payment**: Stripe integration
- **AI**: OpenAI API integration

### Key Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run test` | Run all tests |
| `npm run test:auth` | Auth-specific tests |
| `npm run smoke` | Smoke test |
| `npm run gate` | Release gate check |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |
| `npm run db:push` | Push schema to DB |

### Auth Implementation Locations
- `server/routes/auth.mjs` - Main auth routes
- `server/routes/login.mjs` - Login endpoints
- `server/routes/github-auth.mjs` - GitHub OAuth
- `server/middleware/auth.mjs` - Auth middleware
- `server/middleware/requireAuth.mjs` - Protected route guard
- `server/middleware/requireAdmin.mjs` - Admin route guard
- `server/middleware/requireRole.mjs` - Role-based access
- `server/middleware/session.mjs` - Session management
- `server/auth/authMiddleware.js` - Legacy auth middleware
- `client/src/context/AuthContext.jsx` - Frontend auth context

### Routing Map (90+ routes)
**Public Routes:**
- `/` - Landing (CanvaLanding)
- `/home`, `/welcome` - Landing aliases
- `/login`, `/register`, `/forgot-password`, `/reset-password` - Auth
- `/login/callback` - OAuth callback
- `/health` - Health check
- `/pricing` - Pricing page
- `/blog`, `/blog/:slug` - Blog
- `/faq`, `/support`, `/resources` - Help pages
- `/terms`, `/privacy`, `/legal`, `/ethics`, `/disclaimer` - Legal

**Protected Routes (require auth):**
- `/dashboard` - Main dashboard
- `/admin` - Admin panel
- `/onboarding` - User onboarding
- `/today`, `/mood`, `/state`, `/journal`, `/chat` - Core features
- `/tools`, `/wisdom`, `/advanced`, `/mastery`, `/elite-tools` - Feature tiers
- `/settings`, `/premium`, `/upgrade` - Account
- Plus 40+ additional wellness/cognitive tool pages

### Styling System
- Tailwind CSS 3.4 with custom config
- CSS custom properties (design tokens) in `client/src/index.css`
- Brand colors: Sage (#8FBF9F), Blush (#F4C7C3), Teal (#2F5D5D), Gold (#EAC33B)
- Typography: Playfair Display (headings), Inter (body)
- 3 visual modes: Default, Low-Stim, Reading

---

## Phase 1: QA Guardian (Completed)

### Fix 1: Added missing `brand` export to tokens.ts
- **Root cause**: BrandHero.tsx and BrandLogo.tsx imported `brand` from tokens, but only `tokens` was exported
- **Patch**: Added `brand` object with name, colors, and assets to `client/src/brand/tokens.ts`
- **Verification**: `npm run build` succeeds
- **Expected output**: Build completes without errors

### Baseline Results
| Check | Result |
|-------|--------|
| `npm install` | ✅ Clean |
| `npm run build` | ✅ Success (27s) |
| `npm run test:all` | ✅ 168/168 tests pass |
| `npm run smoke` | ✅ 7/7 endpoints pass |
| Login endpoint | ✅ Returns proper error for invalid credentials |
| Admin health | ✅ Returns health status JSON |
| Protected routes | ✅ Return 401 when unauthenticated |

### TypeScript Status
- 656 TS errors (mostly React types mismatch with lucide-react)
- Non-blocking: Build succeeds, app runs correctly
- Root cause: @types/react version mismatch with lucide-react types

### QA PASS Commands
```bash
npm run test:all    # Expected: 168 tests pass
npm run smoke       # Expected: 7/7 pass
npm run build       # Expected: Build succeeds
curl -X POST localhost:5000/api/auth/login -d '{"email":"x","password":"y"}' # Expected: {"message":"Invalid credentials"}
```

---

## Phase 2: UX Finisher

*(Pending)*

---

## Phase 3: Content Curator

*(Pending)*

---

## Release Gate

*(Pending)*

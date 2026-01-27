# Platform Inventory
**Generated: 2026-01-27**
**Platform: The Genuine Love Project**

## Canonical Entrypoints

| Type | File | Purpose |
|------|------|---------|
| Server (Dev) | `server/dev.mjs` | Development server with Vite |
| Server (Prod) | `server/index.mjs` | Production server |
| Client | `client/src/main.jsx` | React application entry |
| App | `client/src/App.jsx` | Main React component |
| Schema | `shared/schema.mjs` | Database schema (Drizzle) |

## File Tree Summary

```
├── client/
│   ├── src/
│   │   ├── components/     # 284 components
│   │   ├── pages/          # 372 pages
│   │   ├── hooks/          # 14 custom hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── features/       # Feature modules
│   │   ├── context/        # React contexts
│   │   └── content/        # Content management
│   └── dist/               # Build output
├── server/
│   ├── routes/             # 104 API route files
│   ├── middleware/         # Express middleware
│   ├── auth/               # Authentication
│   ├── billing/            # Stripe integration
│   ├── ai/                 # AI/OpenAI integration
│   ├── db/                 # Database utilities
│   └── services/           # Business logic
├── shared/
│   └── schema.mjs          # Database schema
├── docs/                   # Documentation
└── scripts/                # Automation scripts
```

## Ports

| Port | Purpose | Environment |
|------|---------|-------------|
| 5000 | Main application (frontend + API) | Development & Production |

## Key Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| dev | `NODE_ENV=development node server/dev.mjs` | Start dev server |
| build | `vite build` | Build frontend |
| db:push | `drizzle-kit push` | Push schema to DB |

## Database Schema Summary

| Table | Purpose |
|-------|---------|
| users | User accounts |
| journals | Journal entries |
| moods | Mood tracking |
| aiMessages | AI chat history |
| sessions | Auth sessions |
| achievements | Gamification |
| streaks | User streaks |
| habits | Habit tracking |
| goals | Goal tracking |
| reflections | Self-reflection |
| challenges | Challenges |
| milestones | Progress milestones |
| notifications | User notifications |
| (+ 36 more) | Various features |

**Total Tables: 49**

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API access
- `STRIPE_SECRET_KEY` - Stripe payments
- `STRIPE_PUBLISHABLE_KEY` - Stripe frontend
- `RESEND_API_KEY` - Email service

### Optional
- `GITHUB_CLIENT_ID` - GitHub OAuth
- `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `PERPLEXITY_API_KEY` - Perplexity AI
- `ADMIN_TOKEN` - Admin access
- `SESSION_SECRET` - Session encryption

## Statistics

| Metric | Count |
|--------|-------|
| Components | 284 |
| Pages | 372 |
| UI Routes | 251 |
| API Endpoints | 580 |
| Database Tables | 49 |
| Server Route Files | 104 |
| Custom Hooks | 14 |

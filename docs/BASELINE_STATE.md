# Baseline State Snapshot

**Generated:** 2026-02-06
**Commit Hash:** c82c2d124efec42154e2f0ff4550778bb2c577de
**Branch:** main
**Status:** Clean working tree, no uncommitted changes

---

## Repository Summary

| Metric | Count |
|--------|-------|
| Client Page Files (.jsx/.tsx) | 395 |
| Client Component Files (.jsx/.tsx) | 354 |
| Server Route Files (.mjs) | 114 |
| Scripts (.mjs/.js/.sh) | 115 |
| Shared Files | 7 |
| AI Agent Definitions | 6 |
| GitHub Workflows | 4 |
| Docs Files | 100+ |
| App.jsx Lines | 1,742 |

---

## Detected Systems

### Frontend (client/)
- **Framework:** React 18 SPA (JSX + TypeScript mixed)
- **Build Tool:** Vite
- **Routing:** Wouter with 531+ semantic redirects
- **Styling:** Tailwind CSS + custom design tokens
- **State:** React Context (Auth, Emotion, ReadingLevel)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Components:** 354 files across 60+ directories
- **Pages:** 395 files across 17 subdirectories

### Backend (server/)
- **Runtime:** Node.js 20 (ES Modules)
- **Framework:** Express
- **Database:** Neon PostgreSQL via Drizzle ORM
- **Auth:** Replit Auth (OIDC) + sessions
- **Security:** Helmet, CORS, rate limiting, CSP
- **AI:** OpenAI API integration
- **Billing:** Stripe integration
- **Email:** Resend integration
- **Search:** Perplexity API integration
- **Storage:** Replit Object Storage
- **Routes:** 114 route files

### Shared (shared/)
- schema.mjs (Drizzle ORM models)
- brand.mjs / brand.ts (brand constants)
- disclaimer.mjs
- microcopy/glpMicrocopy.ts
- stateTracker.mjs

### AI Agents (agents/)
- content-agent.md
- growth-agent.md
- layout-agent.md
- safety-agent.md
- seo-agent.md
- mcp-tools-spec.md

### Automation (automation/)
- automationCore.mjs (core engine)
- orchestrator.mjs
- scanErrors.mjs
- folderCheck.mjs
- archiveScripts.mjs
- AIEmployee_CodeReview.txt

### CI/CD (.github/workflows/)
- ai-employees.yml (hourly/daily/weekly/monthly health checks)
- ci.yml (route verification, lint, tests on push/PR)
- nav-audit.yml
- visual-doctor.yml

---

## Git State

| Property | Value |
|----------|-------|
| Current Branch | main |
| HEAD Commit | c82c2d12 |
| Remote Origin | github.com/TheGenuineLoveProject/TheGenuineLoveProject.git |
| Backup Remote | gitsafe-backup (gitsafe:5418) |
| Local Branches | main, replit-agent, copilot/fix-unverified-issues, fix/push-unblock, harden/admin-guard, visual-refine-v1 to v4 |
| Working Tree | Clean |

---

## Replit Configuration (.replit)

| Setting | Value |
|---------|-------|
| Entrypoint | server/index.mjs |
| Modules | nodejs-20, python-3.11, postgresql-16 |
| Deployment Target | autoscale |
| Build Command | npm run build |
| Run Command | npm run start |
| Primary Port | 5000 (external 80) |

---

## Known Warnings

| Source | Warning | Severity |
|--------|---------|----------|
| Vite Build | Chunk size exceeds 1000 kB limit | Low (performance) |
| Auth | 401 on /api/auth/user when not logged in | Expected behavior |
| Git | Multiple stale branches | Cleanup recommended |
| .replit | Extra port bindings (5001, 5099, 5173, 5174) | Low (only 5000 needed) |
| Root Files | Loose HTML files (content.html, crm.html, etc.) | Cleanup recommended |

---

## Installed Integrations

| Integration | Version |
|-------------|---------|
| OpenAI (AI Integrations) | 2.0.0 |
| Stripe | 2.0.0 |
| Perplexity | 1.0.0 |
| Replit Auth | 2.0.0 |
| Resend | 1.0.0 |
| Google Analytics | 1.0.0 |
| Object Storage | 2.0.0 |
| WebSocket | 1.0.0 |

---

## Available Secrets

- ADMIN_TOKEN
- DEFAULT_OBJECT_STORAGE_BUCKET_ID
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- PERPLEXITY_API_KEY
- PRIVATE_OBJECT_DIR
- PUBLIC_OBJECT_SEARCH_PATHS

---

## Directory Structure (Top Level)

```
workspace/
├── agents/          # AI agent definitions (6 files)
├── api/             # Legacy API directory
├── attached_assets/ # User-attached assets
├── auth/            # Auth config
├── automation/      # Automation scripts
├── brand/           # Brand assets
├── client/          # React frontend (src/pages, src/components, etc.)
├── components/      # Legacy root-level components
├── content/         # Content assets
├── db/              # Database utilities
├── docs/            # Documentation (100+ files)
├── drizzle/         # Drizzle migration artifacts
├── exports/         # Export utilities
├── helpers/         # Helper utilities
├── logs/            # Log files
├── migrations/      # Database migrations
├── pages/           # Legacy root-level pages
├── public/          # Public static assets
├── scripts/         # Build/scan/automation scripts (115 files)
├── server/          # Express backend (routes, middleware, AI, billing)
├── shared/          # Shared types, schemas, brand
├── .github/         # GitHub Actions workflows
├── .quarantine/     # Quarantined files
└── _quarantine/     # Additional quarantine
```

## Phase 0 Status: COMPLETE
No code was modified during this phase.

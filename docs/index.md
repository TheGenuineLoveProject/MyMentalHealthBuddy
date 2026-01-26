# Documentation Index (P148)

> The Genuine Love Project - Documentation Hub
> Auto-generated: January 26, 2026

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [replit.md](/replit.md) | Project overview & preferences |
| [Batch Runner](./batch-runner.md) | How to run development batches |
| [Release Checklist](./release-checklist.md) | Pre-release verification |
| [Incident Response](./incident-response.md) | Emergency procedures |

---

## Architecture & Design

- [Process Matrix](./platform/top-platform-processes-matrix.md) - All platform processes
- [Integrations](./integrations.md) - External service integrations
- [SLOs](./slos.md) - Service level objectives

---

## Registry & Tracking

- [Feature Map](./registry/feature-map.md) - Complete feature inventory
- [Endpoints](./registry/endpoints.md) - API endpoint catalog
- [Routes](./registry/routes.md) - Frontend route registry
- [Schema](./registry/schema.md) - Database schema

---

## Batch Documentation

### Batch 10 (P151-P200)
- [Summary](./batch-10/summary.md)
- [Deep Scan](./batch-10/deep-scan.md)

### Batch 9 (P101-P150)
- [Summary](./batch-9/summary.md) *(pending)*
- [Deep Scan](./batch-9/deep-scan.md)

### Previous Batches
- [Batch 6](./batch-6/final-report.md)
- [Process Batches](./process-batches/)

---

## Security & Compliance

- [Security Review](./security-review.md)
- [Duplicate Detection](./duplicates/README.md)

---

## Development

### npm Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript validation |
| `npm run doctor` | Full diagnostics |
| `npm run verify` | Build + typecheck + nodupes |
| `npm run smoke` | Critical route tests |
| `npm run a11y:check` | Accessibility audit |
| `npm run nodupes` | Duplicate detection |

### Database
| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes |
| `npm run db:studio` | Open Drizzle Studio |

---

## Content

- [Route Meta Registry](../client/src/content/meta/routeMetaRegistry.ts) - SEO metadata
- [Integration Registry](../client/src/content/meta/integrationRegistry.ts) - Feature tracking
- [Wellness Microcopy](../client/src/content/microcopy/wellnessMicrocopy.ts) - Copy library

---

## External Resources

- [Replit Dashboard](https://replit.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Neon Console](https://console.neon.tech)

---

_This index is auto-maintained. Run `npm run gen:docs-index` to regenerate._

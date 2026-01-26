# Database Migrations Guide

## Overview

The Genuine Love Project uses Drizzle ORM with Neon PostgreSQL. We use schema push for development simplicity.

## Schema Location

```
shared/schema.mjs
```

## Push Changes (Recommended)

### Standard Push
```bash
npm run db:push
```

### Force Push (bypasses data-loss warnings)
```bash
npm run db:push --force
```

## When to Use Force Push

Use `--force` when:
- Adding non-nullable columns (will require defaults)
- Removing columns
- Changing column types
- Development/staging environments

Never use on production without backup verification.

## Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `sessions` | Auth sessions |
| `journals` | Journal entries |
| `moods` | Mood check-ins |
| `subscriptions` | Stripe subscriptions |
| `audit_logs` | Security audit trail |
| `content_items` | CMS content |

## Adding a New Table

1. Define in `shared/schema.mjs`:
```javascript
export const newTable = pgTable("new_table", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
```

2. Run push:
```bash
npm run db:push
```

3. Update storage interface in `server/storage.ts`

## Adding a Column

1. Add to existing table definition
2. Provide default for non-nullable columns
3. Run `npm run db:push`

## Removing a Column

1. Remove from schema
2. Run `npm run db:push --force`
3. Column data will be lost

## Drizzle Studio

View/edit data in development:
```bash
npm run db:studio
```

## Backups

- **Neon:** Automatic continuous backups
- **Replit:** Checkpoint before major changes
- **Manual:** Export via Drizzle Studio

## Recovery

### Point-in-Time (Neon)
Available in Neon dashboard for paid plans.

### Rollback Schema
Revert code changes and re-push previous schema.

## Best Practices

1. Always backup before schema changes
2. Test migrations in development first
3. Use additive changes when possible
4. Document breaking changes
5. Never manually write SQL migrations

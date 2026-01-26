# Environment Configuration

## Overview

This document describes environment setup and promotion workflow.

## Environments

### Development
- **URL**: Replit dev URL
- **Database**: Development PostgreSQL
- **Purpose**: Active development and testing
- **Secrets**: Development API keys

### Production
- **URL**: Deployed Replit URL or custom domain
- **Database**: Production PostgreSQL (separate)
- **Purpose**: Live user traffic
- **Secrets**: Production API keys

## Environment Variables

### Required (All Environments)
```env
DATABASE_URL=postgres://...
SESSION_SECRET=<random-string>
```

### Development Only
```env
NODE_ENV=development
DEBUG=true
```

### Production Only
```env
NODE_ENV=production
SENTRY_DSN=<production-dsn>
```

### API Keys (Both)
```env
OPENAI_API_KEY=<key>
STRIPE_SECRET_KEY=<key>
STRIPE_WEBHOOK_SECRET=<key>
RESEND_API_KEY=<key>
```

## Promotion Workflow

### 1. Development → Production

```bash
# Verify all checks pass
npm run verify

# Build production bundle
npm run build

# Deploy via Replit
# Click "Deploy" button or use CLI
```

### 2. Database Migrations

```bash
# Push schema changes
npm run db:push

# If data loss warning, review carefully
npm run db:push --force  # Only if safe
```

### 3. Environment Variable Sync

- Update production secrets in Replit Secrets panel
- Never commit secrets to git
- Document required vars in .env.example

## Rollback Procedure

1. Use Replit checkpoints to restore code
2. Use database backup to restore data
3. Verify health endpoints after rollback

## Best Practices

- Never share production secrets
- Use separate databases per environment
- Test in development before promoting
- Monitor production after deployments

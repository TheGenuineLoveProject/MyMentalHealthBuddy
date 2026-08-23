# Production Secret Inventory

## Purpose

This file documents the production secrets required before final deployment.

## Required Secret Groups

### Core Runtime
- DATABASE_URL
- SESSION_SECRET
- JWT_SECRET
- APP_BASE_URL
- NODE_ENV=production

### Database TLS Policy
- `DATABASE_SSL` — optional; omit for the secure default. Must never be `false` in production.
- `DATABASE_SSL_CA_PEM` — optional CA certificate PEM contents for explicit private/custom trust.
- `PGSSLROOTCERT` — optional PostgreSQL/libpq-compatible root CA certificate file path; legacy direct PEM content remains accepted for backward compatibility. Prefer `DATABASE_SSL_CA_PEM` for PEM contents.
- SSL query parameters in `DATABASE_URL` are normalized out so application TLS policy remains authoritative.

### Stripe
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_PRO
- STRIPE_PRICE_CLINICAL

### HealthKit / Biometrics
- HEALTHKIT_WEBHOOK_SECRET
- HEALTHKIT_SIGNATURE_SECRET

### Backup
- BACKUP_STORAGE_PROVIDER
- BACKUP_BUCKET_NAME
- BACKUP_REGION
- BACKUP_KMS_KEY_ID
- BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY
- BACKUP_UPLOAD_SECRET_REF

### Email / Notifications
- SMTP_HOST or EMAIL_PROVIDER
- SMTP_USER or EMAIL_API_KEY
- ALERT_EMAIL_TO

## Launch Rule

Production deployment must not proceed if any required production secret is missing, placeholder, expired, shared, or stored outside the approved secret manager.

## Current Status

Secret inventory documented. Real secret values must be configured only in Replit Secrets or approved production secret manager. Never commit real secrets.

# MMHB Backup & Disaster Recovery Runbook

## Purpose
Protect irreplaceable user data including journals, moods, subscriptions, progress, biometric records, preferences, and safety-related records.

## Recovery Objectives
- RPO: target maximum acceptable data loss window: 24 hours initially.
- RTO: target restore time: under 4 hours initially.
- Backup frequency: daily minimum.
- Restore verification: monthly minimum before production launch.

## Data Classes
Critical:
- users
- journals
- moods
- subscriptions
- password_reset_tokens
- user_preferences
- wellness_goals
- biometric_connections
- biometric_readings
- healing_journeys
- user_journey_progress

Operational:
- audit_log
- analytics_events
- webhook_events
- publishing_events

## Backup Requirements
1. Export database using logical dump.
2. Store backup outside the primary database provider.
3. Encrypt backups at rest.
4. Rotate backups with retention policy.
5. Never delete backups without verification.
6. Never expose DATABASE_URL in logs.
7. Verify restore into scratch database before claiming backup readiness.


## Backup Retention Policy

Initial retention targets:
- Daily backups retained for 14 days.
- Weekly backups retained for 8 weeks.
- Monthly backups retained for 12 months.
- Production launch requires encrypted external storage before automated deletion.
- No backup may be deleted unless at least one newer backup has passed restore verification.
- Retention deletion must never run against primary production data.
- Restore verification logs must be preserved with the backup history.

Minimum deletion safety rules:
1. Confirm the backup file exists.
2. Confirm at least one newer backup exists.
3. Confirm a newer backup has passed disposable restore verification.
4. Confirm the file is outside the active production database.
5. Log the deletion decision.
6. Never print database secrets in logs.

## Restore Procedure
1. Confirm incident type.
2. Freeze destructive writes if needed.
3. Identify latest valid backup.
4. Restore into scratch database first.
5. Validate table counts and critical records.
6. Promote restored database only after verification.
7. Record incident timeline and lessons learned.

## Verification Checklist
- Backup file exists.
- Backup is non-empty.
- Backup does not leak secrets in logs.
- Restore command succeeds in scratch environment.
- Critical table counts are validated.
- Application can connect to restored DB.
- /api/health returns 200 after restore.


## Backup Automation Schedule

Initial production target:
- Database backups run daily.
- Backup job must run outside peak user activity.
- Backup output must be written to a protected backup directory before external upload.
- Backup logs must record timestamp, file path, file size, and completion status.
- Backup logs must never print DATABASE_URL or secrets.
- Failed backups must block production readiness until resolved.
- At least one backup per month must be restored into a disposable restore-test database.

Required proof before production launch:
- `npm run db:backup` completes successfully.
- `npm run db:restore:verify` completes successfully against a disposable database.
- External encrypted storage is configured.
- Retention policy is documented and followed.
- Restore drill result is recorded.


## Backup Failure Alerting

Production backup failures must never be silent.

Initial alerting requirements:
- Failed database backup must create an operational incident.
- Failed external upload must create an operational incident.
- Failed restore verification must block production readiness.
- Alert must include timestamp, environment, job name, and failure category.
- Alert must never include DATABASE_URL, tokens, secrets, or raw user data.
- Until resolved, failed backup status must remain visible in platform status documentation.

Minimum launch requirement:
- Backup success/failure is logged.
- Failure alert path is documented.
- Manual operator review is required before production launch.


## Production Backup Storage Provider Checklist

Before production launch, configure one encrypted external backup destination.

Required provider capabilities:
- Encryption at rest.
- Private access only.
- Versioning or object lock preferred.
- Lifecycle retention rules.
- Separate credentials from the production database.
- Access logs enabled.
- Restore download tested.
- Secrets stored only in environment variables.

Required environment variables:
- BACKUP_STORAGE_PROVIDER
- BACKUP_STORAGE_BUCKET
- BACKUP_STORAGE_REGION
- BACKUP_STORAGE_ACCESS_KEY_ID
- BACKUP_STORAGE_SECRET_ACCESS_KEY
- BACKUP_ENCRYPTION_KEY
- BACKUP_ALERT_WEBHOOK_URL

Launch requirement:
- No production launch until at least one backup is uploaded externally and restored successfully into a disposable database.

## Current Status
Runbook created. Backup and disposable restore verification scripts implemented. External encrypted storage provider selection, scheduled automation, and monthly restore drills remain pending. Retention policy is documented. Backup failure alerting plan is documented.


## External Encrypted Backup Storage Plan

Backups must be stored outside the primary runtime, outside the primary database provider, and outside ephemeral workspace storage.

### Required Storage Properties
- Encrypted at rest.
- Access controlled by least privilege.
- Versioned or object-locked where available.
- Not publicly accessible.
- Separate credentials from application runtime credentials.
- Restore-tested before production readiness is claimed.

### Approved Storage Targets
Primary recommendation:
- Encrypted cloud object storage bucket with restricted service account access.

Acceptable examples:
- AWS S3 with SSE-KMS and lifecycle retention.
- Google Cloud Storage with CMEK encryption.
- Azure Blob Storage with immutable retention.
- Encrypted offsite archive controlled by platform owner.

### Retention Policy Target
- Daily backups retained for 30 days.
- Weekly backups retained for 12 weeks.
- Monthly backups retained for 12 months.
- Manual legal/compliance holds must override deletion.

### Security Rules
- Never commit backup files.
- Never commit database URLs.
- Never print DATABASE_URL or RESTORE_DATABASE_URL.
- Never restore into production first.
- Restore only into disposable verification database before promotion.

### Status
External encrypted storage plan documented. Storage provider selection, credential setup, upload automation, and restore drill scheduling remain pending.

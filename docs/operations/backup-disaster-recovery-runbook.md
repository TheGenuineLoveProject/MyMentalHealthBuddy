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

## Current Status
Runbook created. Backup and disposable restore verification scripts implemented. External encrypted storage, scheduled automation, retention policy, and monthly restore drills are pending.


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

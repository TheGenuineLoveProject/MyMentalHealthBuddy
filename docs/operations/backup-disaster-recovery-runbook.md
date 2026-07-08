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
Runbook created. Implementation scripts pending.

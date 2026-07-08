# Real Backup Secret Setup Checklist

## Purpose

This checklist prevents production launch until real encrypted external backup storage is configured.

## Required Values

- BACKUP_STORAGE_PROVIDER
- BACKUP_BUCKET_NAME
- BACKUP_REGION
- BACKUP_KMS_KEY_ID
- BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY
- BACKUP_UPLOAD_SECRET_REF

## Required Production Rules

- Use a private backup bucket.
- Enable encryption at rest.
- Use KMS-managed encryption where available.
- Use least-privilege upload credentials.
- Do not reuse application runtime credentials.
- Do not commit secrets into Git.
- Do not print secrets in logs.
- Verify real upload before production readiness.
- Verify restore into disposable database before launch.

## Production Launch Blocker

Production launch remains blocked until:

1. Real backup secrets are configured.
2. Real backup upload succeeds.
3. Restore verification succeeds.
4. Backup readiness verifier passes.
5. Platform status is updated.

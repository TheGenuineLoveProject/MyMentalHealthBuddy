# Real Backup Secret Validation Checklist

## Purpose

Confirm that production backup secrets are real, private, restricted, and safe before enabling real external backup upload.

## Required Variables

Production must define:

- BACKUP_STORAGE_PROVIDER
- BACKUP_BUCKET_NAME
- BACKUP_REGION
- BACKUP_KMS_KEY_ID
- BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY
- BACKUP_UPLOAD_SECRET_REF

## Validation Rules

The platform must not launch if any value is:

- missing
- empty
- still a placeholder
- publicly exposed
- reused from app runtime credentials
- committed into Git
- printed into logs
- shared with frontend/client code

## Required Security Properties

Backup credentials must be:

- backup-only
- least-privilege
- unable to read unrelated infrastructure
- unable to modify application runtime secrets
- rotated before production if exposed
- stored only in approved secret storage

## Required Manual Review

Before production launch, the operator must confirm:

1. Bucket exists.
2. Bucket is private.
3. Encryption is enabled.
4. KMS key is active.
5. Lifecycle retention is enabled.
6. Upload-only access is configured.
7. Real upload succeeds.
8. Restore verification succeeds.
9. No secret appears in logs.
10. No secret appears in Git history.

## Launch Decision

If any backup secret validation fails, production launch remains blocked.

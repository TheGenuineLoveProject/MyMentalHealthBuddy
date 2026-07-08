# MMHB Backup Secrets Setup Guide

## Purpose

This guide explains the production secrets required before real external encrypted backup upload can be enabled.

Backups must never rely only on Replit workspace storage, local files, or the primary database provider.

## Required Production Backup Secrets

Add these as secure environment variables in the production host secret manager.

Required variables:

- BACKUP_STORAGE_PROVIDER
- BACKUP_BUCKET_NAME
- BACKUP_REGION
- BACKUP_KMS_KEY_ID
- BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY
- BACKUP_UPLOAD_SECRET_REF

## Recommended Initial Provider

Recommended provider:

- AWS S3
- Private bucket only
- SSE-KMS encryption
- Versioning enabled
- Lifecycle retention enabled
- Separate backup-only IAM credential
- No public access
- No reuse of normal application runtime credentials

## Meaning of Each Secret

BACKUP_STORAGE_PROVIDER:
The external storage provider. Initial value should be aws-s3.

BACKUP_BUCKET_NAME:
The private encrypted bucket where backup files are uploaded.

BACKUP_REGION:
The AWS region where the bucket exists.

BACKUP_KMS_KEY_ID:
The encryption key used to encrypt backups at rest.

BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY:
The backup-only identity allowed to upload backup files.

BACKUP_UPLOAD_SECRET_REF:
A secret reference or credential value used only for backup upload.

## Production Rule

Production backup readiness must not be claimed until:

1. Real secrets are configured.
2. A backup file is created.
3. The backup uploads to external encrypted storage.
4. The uploaded backup is restored into a disposable test database.
5. `/api/health` returns 200 after restore.
6. The restore result is recorded.

## Safety Rules

Never commit:

- real backup files
- database URLs
- AWS secret keys
- Replit secrets
- raw user data
- restore database credentials

Never print secrets in logs.

## Current Status

Backup verifier exists.

Real external backup upload script exists.

Backup readiness gate exists.

Pending:

- real provider credential setup
- real upload verification
- scheduled automation
- monthly restore drill execution

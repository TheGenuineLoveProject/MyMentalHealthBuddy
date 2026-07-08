#!/usr/bin/env node

/**
 * MMHB External Backup Upload Placeholder
 *
 * Purpose:
 * Prepare the production path for encrypted offsite backup upload.
 *
 * Current safety mode:
 * - Does not upload yet.
 * - Does not print secrets.
 * - Verifies required environment shape only.
 */

const required = [
  "BACKUP_FILE",
  "BACKUP_STORAGE_PROVIDER",
  "BACKUP_STORAGE_BUCKET"
];

let failed = false;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`ERROR: ${key} is not set.`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log("External backup upload placeholder verified.");
console.log("Provider:", process.env.BACKUP_STORAGE_PROVIDER);
console.log("Bucket configured:", Boolean(process.env.BACKUP_STORAGE_BUCKET));
console.log("Backup file configured:", Boolean(process.env.BACKUP_FILE));
console.log("No secrets printed.");
console.log("=== EXTERNAL_BACKUP_UPLOAD_PLACEHOLDER_PASS ===");

#!/usr/bin/env node

const required = [
  "BACKUP_STORAGE_PROVIDER",
  "BACKUP_BUCKET_NAME",
  "BACKUP_REGION",
  "BACKUP_KMS_KEY_ID",
  "BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY",
  "BACKUP_UPLOAD_SECRET_REF"
];

let failed = false;

for (const key of required) {
  const value = process.env[key];

  if (!value || value.includes("<your-") || value.includes("example") || value.includes("placeholder")) {
    console.error(`FAIL missing or placeholder env: ${key}`);
    failed = true;
  } else {
    console.log(`PASS real env configured: ${key}`);
  }
}

if (failed) {
  console.error("BACKUP_REAL_ENV_VERIFY_FAIL");
  process.exit(1);
}

console.log("BACKUP_REAL_ENV_VERIFY_PASS");

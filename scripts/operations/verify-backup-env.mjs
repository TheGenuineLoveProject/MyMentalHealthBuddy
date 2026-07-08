#!/usr/bin/env node

const required = [
  "BACKUP_STORAGE_PROVIDER",
  "BACKUP_BUCKET_NAME",
  "BACKUP_REGION",
  "BACKUP_KMS_KEY_ID",
  "BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY",
  "BACKUP_UPLOAD_SECRET_REF"
];

let ok = true;

for (const name of required) {
  const value = process.env[name];

  if (!value || value.includes("<your-")) {
    console.error(`FAIL missing or placeholder env: ${name}`);
    ok = false;
  } else {
    console.log(`PASS env configured: ${name}`);
  }
}

if (!ok) {
  console.error("BACKUP_ENV_VERIFY_FAIL");
  process.exit(1);
}

console.log("BACKUP_ENV_VERIFY_PASS");

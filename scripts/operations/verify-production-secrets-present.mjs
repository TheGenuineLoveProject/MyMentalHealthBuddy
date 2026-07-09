#!/usr/bin/env node

const required = [
  "DATABASE_URL",
  "SESSION_SECRET",
  "JWT_SECRET",
  "APP_BASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "HEALTHKIT_WEBHOOK_SECRET",
  "HEALTHKIT_SIGNATURE_SECRET",
  "BACKUP_STORAGE_PROVIDER",
  "BACKUP_BUCKET_NAME",
  "BACKUP_REGION",
  "BACKUP_KMS_KEY_ID",
  "BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY",
  "BACKUP_UPLOAD_SECRET_REF"
];

let failed = false;

for (const name of required) {
  const value = process.env[name];
  if (!value || value.includes("<") || value.includes("your-") || value === "changeme") {
    console.error(`FAIL missing or placeholder production secret: ${name}`);
    failed = true;
  } else {
    console.log(`PASS production secret present: ${name}`);
  }
}

if (failed) {
  console.error("PRODUCTION_SECRET_PRESENCE_VERIFY_FAIL");
  process.exit(1);
}

console.log("PRODUCTION_SECRET_PRESENCE_VERIFY_PASS");

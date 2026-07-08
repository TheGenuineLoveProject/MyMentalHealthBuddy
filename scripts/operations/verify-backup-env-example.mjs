#!/usr/bin/env node
import fs from "node:fs";

const file = ".env.example";

if (!fs.existsSync(file)) {
  throw new Error(".env.example is missing");
}

const text = fs.readFileSync(file, "utf8");

const required = [
  "BACKUP_STORAGE_PROVIDER",
  "BACKUP_BUCKET_NAME",
  "BACKUP_REGION",
  "BACKUP_KMS_KEY_ID",
  "BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY",
  "BACKUP_UPLOAD_SECRET_REF"
];

for (const key of required) {
  if (!text.includes(key)) {
    throw new Error(`Missing backup env example key: ${key}`);
  }
  console.log(`PASS env example contains: ${key}`);
}

console.log("BACKUP_ENV_EXAMPLE_VERIFY_PASS");

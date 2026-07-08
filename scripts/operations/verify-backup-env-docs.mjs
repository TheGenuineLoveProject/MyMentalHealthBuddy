#!/usr/bin/env node

import fs from "node:fs";

const candidates = [".env.example", ".env.production.example", "docs/operations/backup-secrets-setup.md"];

const required = [
  "BACKUP_STORAGE_PROVIDER",
  "BACKUP_BUCKET_NAME",
  "BACKUP_REGION",
  "BACKUP_KMS_KEY_ID",
  "BACKUP_UPLOAD_ROLE_OR_ACCESS_KEY",
  "BACKUP_UPLOAD_SECRET_REF"
];

let text = "";

for (const file of candidates) {
  if (fs.existsSync(file)) {
    text += "\n" + fs.readFileSync(file, "utf8");
  }
}

let ok = true;

for (const name of required) {
  if (!text.includes(name)) {
    console.error(`FAIL missing backup env documentation: ${name}`);
    ok = false;
  } else {
    console.log(`PASS backup env documented: ${name}`);
  }
}

if (!ok) {
  console.error("BACKUP_ENV_DOCS_VERIFY_FAIL");
  process.exit(1);
}

console.log("BACKUP_ENV_DOCS_VERIFY_PASS");

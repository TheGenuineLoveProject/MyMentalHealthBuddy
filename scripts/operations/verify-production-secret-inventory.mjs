#!/usr/bin/env node
import fs from "node:fs";

const file = "docs/operations/production-secret-inventory.md";

if (!fs.existsSync(file)) {
  throw new Error("Missing production secret inventory");
}

const text = fs.readFileSync(file, "utf8");

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
  "BACKUP_UPLOAD_SECRET_REF",
  "Never commit real secrets"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error(`Missing production secret inventory item: ${item}`);
  }
  console.log(`PASS production secret documented: ${item}`);
}

console.log("PRODUCTION_SECRET_INVENTORY_VERIFY_PASS");

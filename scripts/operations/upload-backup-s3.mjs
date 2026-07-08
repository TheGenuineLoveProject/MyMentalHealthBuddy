#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

function required(name) {
  const value = process.env[name];
  if (!value || value.includes("<your-")) {
    throw new Error(`${name} is required and must not be a placeholder`);
  }
  return value;
}

const backupFile = process.env.BACKUP_FILE;
if (!backupFile) throw new Error("BACKUP_FILE is required");
if (!fs.existsSync(backupFile)) throw new Error(`Backup file not found: ${backupFile}`);

const provider = required("BACKUP_STORAGE_PROVIDER");
if (provider !== "aws-s3") {
  throw new Error("Only BACKUP_STORAGE_PROVIDER=aws-s3 is currently supported");
}

const bucket = required("BACKUP_BUCKET_NAME");
const region = required("BACKUP_REGION");
const kmsKeyId = required("BACKUP_KMS_KEY_ID");

const stat = fs.statSync(backupFile);
if (stat.size <= 0) throw new Error("Backup file is empty");

const sha256 = crypto.createHash("sha256").update(fs.readFileSync(backupFile)).digest("hex");
const objectKey = `db-backups/${path.basename(backupFile)}`;

console.log("=== EXTERNAL BACKUP UPLOAD START ===");
console.log(`Provider: ${provider}`);
console.log(`Bucket: ${bucket}`);
console.log(`Region: ${region}`);
console.log(`Object key: ${objectKey}`);
console.log(`File size: ${stat.size}`);
console.log(`SHA256: ${sha256}`);

execFileSync("aws", [
  "s3",
  "cp",
  backupFile,
  `s3://${bucket}/${objectKey}`,
  "--region",
  region,
  "--sse",
  "aws:kms",
  "--sse-kms-key-id",
  kmsKeyId,
  "--only-show-errors"
], { stdio: "inherit" });

console.log("=== EXTERNAL BACKUP UPLOAD PASS ===");
console.log(JSON.stringify({
  provider,
  bucket,
  region,
  objectKey,
  sizeBytes: stat.size,
  sha256,
  uploadedAt: new Date().toISOString()
}, null, 2));

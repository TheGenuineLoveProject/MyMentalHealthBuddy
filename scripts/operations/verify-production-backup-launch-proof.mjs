#!/usr/bin/env node
import fs from "node:fs";

const requiredFiles = [
  "docs/operations/production-backup-launch-proof.md",
  "docs/operations/real-backup-secret-validation-checklist.md",
  "docs/operations/backup-secrets-setup.md",
  "docs/operations/backup-disaster-recovery-runbook.md",
  "scripts/operations/upload-backup-s3.mjs",
  "scripts/operations/verify-backup-readiness.mjs"
];

let ok = true;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL missing file: ${file}`);
    ok = false;
  } else {
    console.log(`PASS required file exists: ${file}`);
  }
}

const proof = fs.readFileSync("docs/operations/production-backup-launch-proof.md", "utf8");

const requiredText = [
  "Real encrypted external backup storage is configured",
  "Backup secrets are real and not placeholders",
  "Backup upload script succeeds",
  "Restore verification succeeds",
  "Do not claim production backup readiness"
];

for (const text of requiredText) {
  if (!proof.includes(text)) {
    console.error(`FAIL missing proof text: ${text}`);
    ok = false;
  } else {
    console.log(`PASS proof contains: ${text}`);
  }
}

if (!ok) {
  console.error("PRODUCTION_BACKUP_LAUNCH_PROOF_VERIFY_FAIL");
  process.exit(1);
}

console.log("PRODUCTION_BACKUP_LAUNCH_PROOF_VERIFY_PASS");

import fs from "fs";

const requiredFiles = [
  "scripts/operations/upload-backup-placeholder.mjs",
  "docs/operations/backup-disaster-recovery-runbook.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required backup upload readiness file: ${file}`);
  }
  console.log(`PASS file exists: ${file}`);
}

const runbook = fs.readFileSync("docs/operations/backup-disaster-recovery-runbook.md", "utf8");

const requiredText = [
  "external encrypted storage",
  "Backup Automation Schedule",
  "Backup Failure Alerting",
  "Backup Retention Policy",
  "Restore Procedure"
];

for (const text of requiredText) {
  if (!runbook.includes(text)) {
    throw new Error(`Runbook missing required section/text: ${text}`);
  }
  console.log(`PASS runbook contains: ${text}`);
}

console.log("BACKUP_UPLOAD_READINESS_VERIFY_PASS");

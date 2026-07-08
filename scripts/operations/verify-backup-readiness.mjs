import fs from "fs";

const requiredFiles = [
  "docs/operations/backup-disaster-recovery-runbook.md",
  "docs/operations/monthly-restore-drill-log.md",
  "scripts/db/backup-database.sh",
  "scripts/db/verify-restore.sh"
];

let failed = false;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL missing required backup/DR file: ${file}`);
    failed = true;
  } else {
    console.log(`PASS required file exists: ${file}`);
  }
}

const runbook = fs.readFileSync("docs/operations/backup-disaster-recovery-runbook.md", "utf8");

const requiredText = [
  "Backup Retention Policy",
  "Backup Automation Schedule",
  "Backup Failure Alerting",
  "Recovery Objectives",
  "Restore Procedure"
];

for (const text of requiredText) {
  if (!runbook.includes(text)) {
    console.error(`FAIL runbook missing section: ${text}`);
    failed = true;
  } else {
    console.log(`PASS runbook section present: ${text}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log("BACKUP_READINESS_VERIFY_PASS");

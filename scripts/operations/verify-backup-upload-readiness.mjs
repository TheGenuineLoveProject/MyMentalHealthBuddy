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
  {
    text: "external encrypted storage",
    caseSensitive: false
  },
  {
    text: "Backup Automation Schedule",
    caseSensitive: true
  },
  {
    text: "Backup Failure Alerting",
    caseSensitive: true
  },
  {
    text: "Backup Retention Policy",
    caseSensitive: true
  },
  {
    text: "Restore Procedure",
    caseSensitive: true
  }
];

for (const requirement of requiredText) {
  const { text, caseSensitive } = requirement;

  const present = caseSensitive
    ? runbook.includes(text)
    : runbook.toLocaleLowerCase("en-US").includes(
        text.toLocaleLowerCase("en-US")
      );

  if (!present) {
    throw new Error(`Runbook missing required section/text: ${text}`);
  }

  console.log(
    `PASS runbook contains: ${text} ` +
    `(caseSensitive=${caseSensitive})`
  );
}

console.log("BACKUP_UPLOAD_READINESS_VERIFY_PASS");

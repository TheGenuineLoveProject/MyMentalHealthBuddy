import fs from "node:fs";

const required = [
  "diagnostics/phase95/status-summary.md",
  "diagnostics/phase95/known-duplicate-family-audit.txt",
  "diagnostics/phase95/duplicate-basename-files.txt",
  "diagnostics/phase95/root-shadow-import-risk.txt",
  "diagnostics/phase95/todo-stub-placeholder-markers.txt",
];

const failures = [];

for (const file of required) {
  if (!fs.existsSync(file)) failures.push(`MISSING ${file}`);
}

const known = fs.existsSync("diagnostics/phase95/known-duplicate-family-audit.txt")
  ? fs.readFileSync("diagnostics/phase95/known-duplicate-family-audit.txt", "utf8")
  : "";

const dupes = fs.existsSync("diagnostics/phase95/duplicate-basename-files.txt")
  ? fs.readFileSync("diagnostics/phase95/duplicate-basename-files.txt", "utf8")
  : "";

if (!known.includes("FAMILY Button")) failures.push("KNOWN_FAMILY_BUTTON_MISSING");
if (!known.includes("FAMILY Card")) failures.push("KNOWN_FAMILY_CARD_MISSING");
if (!dupes.includes("DUPLICATE_BASE") && dupes.trim().length === 0) failures.push("DUPLICATE_BASE_AUDIT_EMPTY");

if (failures.length) {
  console.log("PHASE95_AUDIT_COMPLETION_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("PHASE95_AUDIT_COMPLETION_GATE_PASS");

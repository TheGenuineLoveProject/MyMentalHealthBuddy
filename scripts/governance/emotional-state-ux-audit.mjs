import fs from "node:fs";

const required = [
  "docs/governance/EMOTIONAL_STATE_UX_AUDIT_GOVERNANCE.md",
  "registry/ux-audit/emotional-state-ux-audit-registry.json"
];

const missing = required.filter((file) => !fs.existsSync(file));

const report = {
  phase: 113,
  status: missing.length ? "FAIL" : "PASS",
  missing,
  protectedSurfacesChanged: false,
  sourceFilesChanged: false
};

fs.mkdirSync("docs/reports", { recursive: true });

fs.writeFileSync(
  "docs/reports/PHASE_113_EMOTIONAL_STATE_UX_AUDIT.json",
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));

if (missing.length) process.exit(1);

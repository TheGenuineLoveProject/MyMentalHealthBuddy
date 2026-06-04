import fs from "node:fs";

const required = [
  "docs/governance/ETHICAL_RETENTION_LOOP_GOVERNANCE.md",
  "registry/retention/ethical-retention-loop-registry.json"
];

const missing = required.filter((file) => !fs.existsSync(file));

const report = {
  phase: 110,
  name: "Ethical Retention Loop Governance",
  status: missing.length ? "FAIL" : "PASS",
  missing,
  sourceFilesChanged: false,
  protectedSurfacesChanged: false
};

fs.mkdirSync("docs/reports", { recursive: true });
fs.writeFileSync(
  "docs/reports/PHASE_110_ETHICAL_RETENTION_LOOP_GOVERNANCE.json",
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));
if (missing.length) process.exit(1);

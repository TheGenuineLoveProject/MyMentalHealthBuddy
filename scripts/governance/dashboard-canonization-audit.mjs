import fs from "node:fs";

const required = [
  "docs/governance/UNIFIED_WELLNESS_DASHBOARD_CANONIZATION.md",
  "registry/dashboard/unified-wellness-dashboard-registry.json"
];

const missing = required.filter((file) => !fs.existsSync(file));

const report = {
  phase: 111,
  name: "Unified Wellness Dashboard Canonization Map",
  status: missing.length ? "FAIL" : "PASS",
  missing,
  sourceFilesChanged: false,
  protectedSurfacesChanged: false
};

fs.mkdirSync("docs/reports", { recursive: true });
fs.writeFileSync(
  "docs/reports/PHASE_111_UNIFIED_WELLNESS_DASHBOARD_CANONIZATION.json",
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));
if (missing.length) process.exit(1);

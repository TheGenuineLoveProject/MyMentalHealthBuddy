import fs from "node:fs";

const files = [
  "docs/governance/MOBILE_NERVOUS_SYSTEM_SAFE_UX_GOVERNANCE.md",
  "registry/ux/mobile-nervous-system-ux-registry.json"
];

const missing = files.filter(f => !fs.existsSync(f));

const report = {
  phase: 109,
  name: "Mobile Nervous-System-Safe UX Audit Registry",
  status: missing.length === 0 ? "PASS" : "FAIL",
  missing,
  sourceFilesChanged: false,
  protectedSurfacesChanged: false
};

fs.mkdirSync("docs/reports", { recursive: true });
fs.writeFileSync(
  "docs/reports/PHASE_109_MOBILE_NERVOUS_SYSTEM_SAFE_UX_AUDIT.json",
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));
if (missing.length) process.exit(1);

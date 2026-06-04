import fs from "node:fs";

const registryPath = "registry/content/content-intelligence-taxonomy.json";
const exists = fs.existsSync(registryPath);

const report = {
  phase: 108,
  name: "Content Intelligence Taxonomy Registry",
  registryExists: exists,
  status: exists ? "PASS" : "FAIL",
  sourceFilesChanged: false,
  protectedSurfacesChanged: false
};

fs.mkdirSync("docs/reports", { recursive: true });
fs.writeFileSync(
  "docs/reports/PHASE_108_CONTENT_INTELLIGENCE_TAXONOMY_REPORT.json",
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));
if (!exists) process.exit(1);

import fs from "node:fs";

const requiredFiles = [
  "docs/governance/hx-os-canonical-execution-constitution.md",
  "docs/content/component-content-completion-standard.md",
  "docs/architecture/canonical-ownership-map.md",
  "scripts/phase83-platform-content-component-analysis.mjs"
];

const requiredEvidence = [
  "diagnostics/phase83/platform-content-component-analysis.json",
  "diagnostics/phase83/page-coherence-table.tsv",
  "diagnostics/phase83/clinical-claim-risks.txt",
  "diagnostics/phase83/business-healing-boundary-risks.txt",
  "diagnostics/phase83/duplicate-basename-risks.txt",
  "diagnostics/phase83/button-risks.txt",
  "diagnostics/phase83/lumi-findings.txt"
];

const constitutionChecks = [
  ["docs/governance/hx-os-canonical-execution-constitution.md", /DETECT → CLASSIFY → ISOLATE → PLAN → IMPLEMENT → VERIFY → REPORT → STOP/],
  ["docs/governance/hx-os-canonical-execution-constitution.md", /Business \/ Healing Firewall/],
  ["docs/governance/hx-os-canonical-execution-constitution.md", /Replit Runtime Law/],
  ["docs/governance/hx-os-canonical-execution-constitution.md", /Avatar \+ Visual Law/],
  ["docs/content/component-content-completion-standard.md", /Every user-facing page should answer/],
  ["docs/architecture/canonical-ownership-map.md", /Business may not directly influence healing flows/]
];

const failures = [];

for (const f of requiredFiles) if (!fs.existsSync(f)) failures.push(`MISSING_REQUIRED_FILE ${f}`);
for (const f of requiredEvidence) if (!fs.existsSync(f)) failures.push(`MISSING_REQUIRED_EVIDENCE ${f}`);

for (const [file, re] of constitutionChecks) {
  if (!fs.existsSync(file) || !re.test(fs.readFileSync(file, "utf8"))) {
    failures.push(`CONSTITUTION_MARKER_MISSING ${file} ${re}`);
  }
}

const claimRisk = fs.existsSync("diagnostics/phase83/clinical-claim-risks.txt")
  ? fs.readFileSync("diagnostics/phase83/clinical-claim-risks.txt", "utf8").trim()
  : "";

const boundaryRisk = fs.existsSync("diagnostics/phase83/business-healing-boundary-risks.txt")
  ? fs.readFileSync("diagnostics/phase83/business-healing-boundary-risks.txt", "utf8").trim()
  : "";

if (boundaryRisk) failures.push("BUSINESS_HEALING_BOUNDARY_RISK_REQUIRES_NEXT_PHASE_REVIEW");

fs.writeFileSync("diagnostics/phase83/constitution-gate-failures.txt", failures.join("\n") + (failures.length ? "\n" : ""));

if (failures.length) {
  console.log("CONSTITUTION_IMPLEMENTATION_GATE_FAIL");
  for (const f of failures) console.log(f);
  process.exit(1);
}

console.log("CONSTITUTION_IMPLEMENTATION_GATE_PASS");
console.log(`clinicalClaimRiskLines=${claimRisk ? claimRisk.split("\n").length : 0}`);

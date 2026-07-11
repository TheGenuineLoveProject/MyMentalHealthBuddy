#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";

const checks = [
  {
    id: "governance_docs",
    label: "Governance documentation",
    script: "scripts/governance/verify-governance-docs.mjs",
  },
  {
    id: "registry_integrity",
    label: "Governance registry integrity",
    script: "scripts/governance/verify-governance-registry-integrity.mjs",
  },
{
  id: "registry_schema",
  label: "Registry schema contracts",
  script: "scripts/governance/verify-registry-schemas.mjs",
},
  {
    id: "registry_reconciliation",
    label: "Registry/repository reconciliation",
    script: "scripts/governance/audit-registry-repository-reconciliation.mjs",
  },
  {
    id: "domain_separation",
    label: "Domain separation",
    script: "scripts/governance/verify-domain-separation.mjs",
  },
  {
    id: "clinical_safety",
    label: "Clinical-safety taxonomy",
    script: "scripts/governance/verify-clinical-safety-taxonomy.mjs",
  },
];

const results = [];
let failed = false;

console.log("========================================");
console.log("PEOS GOVERNANCE RELEASE GATE START");
console.log("========================================");

for (const check of checks) {
  if (!fs.existsSync(check.script)) {
    console.error(`FAIL ${check.id}: missing ${check.script}`);
    results.push({
      id: check.id,
      label: check.label,
      status: "FAIL",
      reason: "missing verifier",
    });
    failed = true;
    continue;
  }

  console.log(`\n--- ${check.label} ---`);

  const result = spawnSync(process.execPath, [check.script], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(`FAIL ${check.id}: ${result.error.message}`);
    results.push({
      id: check.id,
      label: check.label,
      status: "FAIL",
      reason: result.error.message,
    });
    failed = true;
    continue;
  }

  if (result.status !== 0) {
    console.error(`FAIL ${check.id}: exit code ${result.status}`);
    results.push({
      id: check.id,
      label: check.label,
      status: "FAIL",
      reason: `exit code ${result.status}`,
    });
    failed = true;
    continue;
  }

  console.log(`PASS ${check.id}`);
  results.push({
    id: check.id,
    label: check.label,
    status: "PASS",
  });
}

console.log("\n========================================");
console.log("PEOS GOVERNANCE RELEASE GATE SUMMARY");
console.log("========================================");

for (const result of results) {
  console.log(`${result.status} ${result.id}: ${result.label}`);
}

const passed = results.filter((result) => result.status === "PASS").length;
const total = checks.length;
const score = Math.round((passed / total) * 100);

console.log(`Governance checks passed: ${passed}/${total}`);
console.log(`Governance readiness score: ${score}%`);

if (failed || passed !== total) {
  console.error("PEOS_GOVERNANCE_RELEASE_VERIFY_FAIL");
  process.exit(1);
}

console.log("PEOS_GOVERNANCE_RELEASE_VERIFY_PASS");

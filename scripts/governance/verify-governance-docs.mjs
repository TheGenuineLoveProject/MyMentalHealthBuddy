#!/usr/bin/env node
import fs from "node:fs";

const required = [
  "docs/governance/PLATFORM_CONSTITUTION.md",
  "docs/governance/DOMAIN_RULES.md",
  "docs/governance/QUALITY_GATES.md",
  "docs/governance/ARCHITECTURE_DECISIONS.md",
  "docs/governance/EXECUTION_ORDER.md",
  "docs/programs/adaptive-human-development/CIOS_V10_ADAPTIVE_HUMAN_DEVELOPMENT_PROGRAM.md",
  "platform/registry/assets.json",
  "platform/registry/prompts.json",
  "platform/registry/routes.json",
  "platform/registry/components.json",
  "platform/registry/capabilities.json"
];

let failed = false;

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL missing governance file: ${file}`);
    failed = true;
  } else {
    console.log(`PASS governance file exists: ${file}`);
  }
}

if (failed) {
  console.error("GOVERNANCE_DOCS_VERIFY_FAIL");
  process.exit(1);
}

console.log("GOVERNANCE_DOCS_VERIFY_PASS");

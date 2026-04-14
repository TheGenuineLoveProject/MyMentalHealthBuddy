#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const KERNEL_ROOT = resolve("prompt-os-kernel");

const REQUIRED_FILES = [
  "governance/domain-router.md",
  "governance/execution-protocol.md",
  "governance/quality-gates.md",
  "governance/MASTER_STRATEGY.md",
  "engines/business-command-engine.md",
  "schemas/promptspec.schema.json",
  "scripts/verify-platform-kernel.mjs",
  "install.sh",
];

const REQUIRED_DOMAINS = [
  "HEALING_DOMAIN",
  "BUSINESS_DOMAIN",
  "PLATFORM_DOMAIN",
  "DESIGN_DOMAIN",
  "RESEARCH_DOMAIN",
  "CROSS_DOMAIN",
];

let passed = 0;
let failed = 0;
const failures = [];

function check(label, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    failures.push(label);
    console.log(`  ✗ ${label}`);
  }
}

console.log("Prompt-OS v8.0 Kernel Verification\n");

console.log("File checks:");
for (const fp of REQUIRED_FILES) {
  const full = join(KERNEL_ROOT, fp);
  check(`${fp} exists`, existsSync(full));
  if (existsSync(full)) {
    check(`${fp} non-empty`, statSync(full).size > 50);
  }
}

console.log("\nSchema checks:");
const schemaPath = join(KERNEL_ROOT, "schemas/promptspec.schema.json");
if (existsSync(schemaPath)) {
  try {
    const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
    check("Schema valid JSON", true);
    check("Schema has $schema", !!schema.$schema);
    check("Schema has required array", Array.isArray(schema.required));
    const domainEnum = schema.properties?.domain?.enum;
    if (domainEnum) {
      for (const d of REQUIRED_DOMAINS) {
        check(`Domain enum includes ${d}`, domainEnum.includes(d));
      }
    }
  } catch (e) {
    check("Schema valid JSON", false);
  }
}

console.log("\nDomain router checks:");
const routerContent = readFileSync(join(KERNEL_ROOT, "governance/domain-router.md"), "utf-8");
for (const d of REQUIRED_DOMAINS) {
  check(`Router defines ${d}`, routerContent.includes(d));
}

console.log("\nExecution protocol checks:");
const execContent = readFileSync(join(KERNEL_ROOT, "governance/execution-protocol.md"), "utf-8");
const REQUIRED_STATES = ["INTAKE", "CLASSIFICATION", "VALIDATION", "REASONING", "DESIGN", "VERIFICATION", "DECISION_RECORD", "EVOLUTION"];
for (const s of REQUIRED_STATES) {
  check(`Protocol defines ${s}`, execContent.includes(s));
}

console.log("\nQuality gate checks:");
const gatesContent = readFileSync(join(KERNEL_ROOT, "governance/quality-gates.md"), "utf-8");
const REQUIRED_GATES = ["BUILD_GATE", "ROUTE_GATE", "SCHEMA_GATE", "SAFETY_GATE", "DOMAIN_SEPARATION_GATE", "DESIGN_CONSISTENCY_GATE", "OBSERVABILITY_GATE", "ROLLBACK_GATE", "DUPLICATION_GATE"];
for (const g of REQUIRED_GATES) {
  check(`Gates defines ${g}`, gatesContent.includes(g));
}

console.log("\nPrompt modules:");
const promptsDir = join(KERNEL_ROOT, "prompts");
const modules = existsSync(promptsDir)
  ? readdirSync(promptsDir).filter((f) => f.endsWith(".json"))
  : [];
console.log(`  ${modules.length} prompt modules found`);

console.log(`\n${"═".repeat(50)}`);
console.log(`  Passed: ${passed}  Failed: ${failed}  Total: ${passed + failed}`);
if (failures.length > 0) {
  console.log(`  Failures: ${failures.join(", ")}`);
}
console.log(`${"═".repeat(50)}`);

process.exit(failed > 0 ? 1 : 0);

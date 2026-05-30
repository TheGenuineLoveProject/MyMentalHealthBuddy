// =============================================================================
// audit-registry-routes.mjs — registry-level duplicate route auditor.
//
// Complements the existing App.jsx auditor (scripts/audit-duplicate-routes.mjs,
// wired to `npm run audit:duplicates`). That one scans <Route> mounts; THIS one
// scans the data registry — client/src/content/routes.js plus every per-category
// module under client/src/content/routes/*.js — for duplicate `route` paths,
// route-count parity drift, and missing protected sentinels.
//
// Run: node scripts/audit-registry-routes.mjs
// Read-only. Exits non-zero on any duplicate / parity / sentinel regression.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import {
  collectRoutes,
  findDuplicates,
  countBy,
  validateSentinels,
  categoryDrift,
  selfCheck,
} from "./lib/route-registry.mjs";

const BASELINE = "docs/governance/reports/route-manifest.baseline.json";

const routes = collectRoutes();
const duplicates = findDuplicates(routes);
const sentinelViolations = validateSentinels(routes);
const parseError = selfCheck(routes);
const byCategory = countBy(routes, "category");

let baseline = null;
if (fs.existsSync(BASELINE)) {
  baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
}
const drift = baseline ? categoryDrift(byCategory, baseline.byCategory) : [];

console.log("");
console.log("=== Registry Duplicate Route Audit ===");
console.log("");
console.log(`registry sources : ${path.basename("routes.js")} + routes/*.js`);
console.log(`total routes     : ${routes.length}`);
if (baseline) console.log(`baseline routes  : ${baseline.total}`);
console.log("");

const failures = [];

if (duplicates.length) {
  failures.push(`${duplicates.length} duplicate route group(s)`);
  for (const [p, v] of duplicates) {
    console.log(
      `DUPLICATE  ${p} (${v.length}x) -> ${v.map((e) => `${e.sourceFile}:${e.line}`).join(", ")}`,
    );
  }
} else {
  console.log("PASS no duplicate routes detected across registry");
}

if (sentinelViolations.length) {
  failures.push(`sentinel violation(s): ${sentinelViolations.join("; ")}`);
  console.log(`FAIL sentinel violations: ${sentinelViolations.join("; ")}`);
} else {
  console.log("PASS all protected sentinels present + invariants hold");
}

if (baseline && routes.length !== baseline.total) {
  failures.push(`parity drift: ${routes.length} vs baseline ${baseline.total}`);
  console.log(`FAIL parity drift: ${routes.length} vs baseline ${baseline.total}`);
} else if (baseline) {
  console.log("PASS route count parity matches baseline");
}

if (drift.length) {
  failures.push(`category drift: ${drift.join(", ")}`);
  console.log(`FAIL category parity drift: ${drift.join(", ")}`);
} else if (baseline) {
  console.log("PASS category parity matches baseline");
}

if (parseError) {
  failures.push(parseError);
  console.log(`FAIL ${parseError}`);
} else {
  console.log("PASS parser self-check (block-parse == line-count)");
}

console.log("");
if (failures.length) {
  console.error("AUDIT FAIL: " + failures.join("; "));
  process.exit(1);
}
console.log("AUDIT PASS: registry route integrity holds");

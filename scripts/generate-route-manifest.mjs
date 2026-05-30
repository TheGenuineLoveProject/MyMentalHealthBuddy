// =============================================================================
// generate-route-manifest.mjs — route manifest snapshot generator.
//
// Wired to `npm run routes:manifest`. Produces a governance snapshot of the
// entire route registry (routes.js + per-category modules), writes:
//   - docs/governance/reports/route-manifest.json        (current snapshot)
//   - docs/governance/reports/route-manifest.baseline.json (locked baseline)
//   - docs/governance/reports/route-integrity-report.md   (human report)
//
// It also runs registry integrity checks (no duplicate paths, count parity vs
// the locked baseline, protected sentinels present) and exits non-zero on any
// regression. Read-only against source — never mutates routes.
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

const REPORT_DIR = "docs/governance/reports";
const MANIFEST = path.join(REPORT_DIR, "route-manifest.json");
const BASELINE = path.join(REPORT_DIR, "route-manifest.baseline.json");
const REPORT_MD = path.join(REPORT_DIR, "route-integrity-report.md");

fs.mkdirSync(REPORT_DIR, { recursive: true });

const routes = collectRoutes();
const duplicates = findDuplicates(routes);
const sentinelViolations = validateSentinels(routes);
const parseError = selfCheck(routes);
const byCategory = countBy(routes, "category");
const bySource = countBy(routes, "sourceFile");

const snapshot = {
  generatedAt: new Date().toISOString(),
  total: routes.length,
  byCategory,
  bySource,
  routes: routes
    .map((r) => ({
      route: r.route,
      category: r.category,
      aliasOf: r.aliasOf,
      component: r.component,
      protected: r.protected,
      isAuthPage: r.isAuthPage,
      sourceFile: r.sourceFile,
    }))
    .sort((a, b) => a.route.localeCompare(b.route)),
};

fs.writeFileSync(MANIFEST, JSON.stringify(snapshot, null, 2) + "\n");

// First run locks the baseline; later runs compare against it.
let baseline = null;
if (!fs.existsSync(BASELINE)) {
  baseline = { total: snapshot.total, byCategory: snapshot.byCategory };
  fs.writeFileSync(BASELINE, JSON.stringify(baseline, null, 2) + "\n");
  console.log(`Baseline locked at ${baseline.total} routes -> ${BASELINE}`);
} else {
  baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
}

const drift = baseline ? categoryDrift(byCategory, baseline.byCategory) : [];

const failures = [];
if (parseError) {
  failures.push(parseError);
}
if (duplicates.length) {
  failures.push(`${duplicates.length} duplicate route path(s)`);
}
if (sentinelViolations.length) {
  failures.push(`sentinel violation(s): ${sentinelViolations.join("; ")}`);
}
if (baseline && snapshot.total !== baseline.total) {
  failures.push(
    `route count parity drift: ${snapshot.total} now vs ${baseline.total} baseline`,
  );
}
if (drift.length) {
  failures.push(`category parity drift: ${drift.join(", ")}`);
}

const md = [
  "# Route Integrity Report",
  "",
  `_Generated: ${snapshot.generatedAt}_`,
  "",
  `- **Total routes:** ${snapshot.total}`,
  `- **Baseline:** ${baseline ? baseline.total : "n/a"}`,
  `- **Duplicates:** ${duplicates.length}`,
  `- **Sentinel violations:** ${sentinelViolations.length}`,
  `- **Category drift:** ${drift.length}`,
  `- **Parser self-check:** ${parseError ? "FAIL" : "PASS"}`,
  `- **Status:** ${failures.length ? "FAIL" : "PASS"}`,
  ...(failures.length ? ["", "### Failures", ...failures.map((f) => `- ${f}`)] : []),
  "",
  "## Routes by category",
  "",
  "| category | count |",
  "| --- | ---: |",
  ...Object.entries(byCategory)
    .sort()
    .map(([c, n]) => `| ${c} | ${n} |`),
  "",
  "## Routes by source file",
  "",
  "| source | count |",
  "| --- | ---: |",
  ...Object.entries(bySource)
    .sort()
    .map(([s, n]) => `| ${s} | ${n} |`),
  "",
  "## Duplicate paths",
  "",
  duplicates.length
    ? duplicates
        .map(
          ([p, v]) =>
            `- \`${p}\` x${v.length} (${v.map((e) => e.sourceFile).join(", ")})`,
        )
        .join("\n")
    : "_None — registry is duplicate-free._",
  "",
].join("\n");

fs.writeFileSync(REPORT_MD, md + "\n");

console.log("=== Route Manifest Snapshot ===");
console.log(`total routes : ${snapshot.total}`);
console.log(`duplicates   : ${duplicates.length}`);
console.log(`sentinels    : ${sentinelViolations.length ? "VIOLATION " + sentinelViolations.join("; ") : "all valid"}`);
console.log(`category     : ${drift.length ? "DRIFT " + drift.join(", ") : "parity holds"}`);
console.log(`self-check   : ${parseError ? "FAIL " + parseError : "PASS"}`);
console.log(`written      : ${MANIFEST}, ${REPORT_MD}`);

if (failures.length) {
  console.error("FAIL route manifest integrity: " + failures.join("; "));
  process.exit(1);
}
console.log("PASS route manifest integrity");

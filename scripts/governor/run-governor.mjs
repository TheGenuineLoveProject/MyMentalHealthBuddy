import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Only static, local checks belong here. Never load application modules.
const root = fileURLToPath(new URL("../../", import.meta.url));
process.chdir(root);
if (process.argv.length > 2) {
  console.error("governor accepts no arguments");
  process.exit(1);
}
const checks = [
  ["registry schemas", "scripts/governance/verify-registry-schemas.mjs"],
  ["API contract", "scripts/governance/verify-api-contract-lock.mjs"],
  ["prompt registry semantics", "scripts/governance/audit-registry-semantics.mjs", "--no-write"],
  ["runtime and archive boundaries", "scripts/governor/verify-boundaries.mjs"],
  ["refactor report", "scripts/governor/refactor-report.mjs"],
];
// Preflight the entire chain so an absent checker cannot go unnoticed.
for (const [, script] of checks) {
  if (!fs.existsSync(path.join(root, script)) || !fs.lstatSync(path.join(root, script)).isFile()) {
    throw new Error(`Missing governor check: ${script}`);
  }
}
let failures = 0;
for (const [label, script, ...args] of checks) {
  console.log(`\n=== GOVERNOR: ${label} ===`);
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root, stdio: "inherit",
    // Static checks need no credentials or provider configuration.
    env: { PATH: process.env.PATH || "", CI: "true" },
  });
  if (result.error || result.signal || result.status !== 0) {
    console.error(`FAIL governor check: ${label}`);
    failures++;
  }
}
console.log(`\nGOVERNOR ${failures ? "FAIL" : "PASS"} (${failures} failed checks)`);
process.exitCode = failures ? 1 : 0;
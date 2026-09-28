import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
process.chdir(root);
const failures = [];
const fail = (message) => failures.push(message);
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (pkg.type !== "module") fail("package type must be module");
if (pkg.main !== "server/app.mjs") fail("main must be server/app.mjs");
if (pkg.scripts?.start !== "node server/app.mjs") fail("start must run node server/app.mjs");
if (!["node server/app.mjs", "exec node server/app.mjs"].includes(pkg.scripts?.dev)) {
  fail("dev must run node server/app.mjs (optional shell exec)");
}
for (const file of [
  "server/app.mjs", "server/routes/ai.mjs", "server/routes/auth.mjs",
  "server/routes/session-boundary.mjs", "server/security/csrf.mjs",
]) {
  if (!fs.lstatSync(file).isFile()) fail(`Required regular file: ${file}`);
}
const runtimeDirectories = [
  "server/routes", "server/middleware", "server/security", "server/services", "server/utils",
];
function walk(directory) {
  if (!fs.lstatSync(directory).isDirectory()) throw new Error(`Not a directory: ${directory}`);
  const files = [];
  for (const name of fs.readdirSync(directory).sort()) {
    const file = `${directory}/${name}`;
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error(`Symlink refused: ${file}`);
    if (stat.isDirectory()) files.push(...walk(file));
    else if (stat.isFile()) files.push(file);
    else throw new Error(`Unsupported input: ${file}`);
  }
  return files;
}
const runtimeFiles = walk("server");
for (const dir of runtimeDirectories) {
  if (!fs.lstatSync(dir).isDirectory()) fail(`Missing runtime directory: ${dir}`);
}
for (const file of runtimeFiles) {
  if (path.basename(file).includes(".bak") || /\.backup(?:$|\.)/.test(file)) {
    fail(`Runtime backup: ${file}`);
  }
  if (file.endsWith(".ts") && runtimeDirectories.some((dir) => file.startsWith(`${dir}/`))) {
    fail(`TypeScript in governed runtime: ${file}`);
    if (fs.existsSync(file.slice(0, -3) + ".mjs")) fail(`Mixed runtime twin: ${file}`);
  }
}
// Git inventory avoids traversing ignored private qualification/evidence trees.
// Tracked files remain checked even if a later ignore rule matches them.
const inventory = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
  cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
  env: { PATH: process.env.PATH || "" },
});
if (inventory.error || inventory.status !== 0) throw new Error("Cannot enumerate source tree");
const allowedZones = [".archive/", "reports/", "backups/", "_quarantine/", "node_modules/", ".git/", "attached_assets/"];
for (const file of [...new Set(inventory.stdout.split("\0").filter(Boolean))].sort()) {
  if (path.basename(file).includes(".bak") && !allowedZones.some((zone) => file.startsWith(zone))) {
    fail(`Backup outside archive zones: ${file}`);
  }
}
for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(`RUNTIME_ARCHIVE_BOUNDARIES ${failures.length ? "FAIL" : "PASS"} (${failures.length} findings)`);
process.exitCode = failures.length ? 1 : 0;
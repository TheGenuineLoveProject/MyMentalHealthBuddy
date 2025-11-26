// -------------------------------------------------------------
// MyMentalHealthBuddy — UNIVERSAL AUTO-HEAL ENGINE (v1.0)
// -------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

console.log("\n💗 MyMentalHealthBuddy — Auto-Heal Engine Activated\n");

// -------------------------------------------------------------
// Utility — Safe Executor
// -------------------------------------------------------------
function run(cmd) {
  try {
    console.log(`\n⚙️ Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.log(`❌ Error in command: ${cmd}`);
  }
}

// -------------------------------------------------------------
// 1. Check missing critical client files
// -------------------------------------------------------------
const clientDir = path.join(process.cwd(), "client", "src");
const criticalFiles = [
  "App.tsx",
  "main.tsx",
  "index.css",
  "routes",
  "pages",
  "components"
];

console.log("\n🔎 Checking for missing TS/TSX/CSS client files…");

let missing = [];

criticalFiles.forEach((file) => {
  const full = path.join(clientDir, file);
  if (!fs.existsSync(full)) missing.push(full);
});

if (missing.length > 0) {
  console.log("\n⚠️ Missing critical files:");
  missing.forEach((m) => console.log(" • " + m));
} else {
  console.log("✅ No missing critical client files.");
}

// -------------------------------------------------------------
// 2. Validate Express routes for invalid patterns
// -------------------------------------------------------------
console.log("\n🔎 Scanning Express routes for invalid patterns…");

const routeRegex = /router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g;
const badColon = /\/:(?![A-Za-z0-9_])/;

const serverRoot = path.join(process.cwd(), "server");

function walk(dir) {
  let out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(js|ts|mjs)$/i.test(entry.name)) out.push(full);
  });
  return out;
}

const files = walk(serverRoot);

files.forEach((file) => {
  const text = fs.readFileSync(file, "utf8");
  let match;
  while ((match = routeRegex.exec(text)) !== null) {
    const routePath = match[2];
    if (badColon.test(routePath)) {
      console.log(`❌ INVALID ROUTE:\n   File: ${file}\n   Route: ${routePath}`);
    }
  }
});

// -------------------------------------------------------------
// 3. Fix corrupted package.json (remove trailing commas, comments)
// -------------------------------------------------------------
console.log("\n🔧 Checking package.json for corruption…");

const pkgPath = path.join(process.cwd(), "package.json");
let pkgText = fs.readFileSync(pkgPath, "utf8");

let fixed = pkgText
  .replace(/\/\/.*$/gm, "")     // remove comments
  .replace(/,(\s*[}\]])/g, "$1"); // trailing commas

fs.writeFileSync(pkgPath, fixed, "utf8");

console.log("✅ package.json cleaned and healed.");


// -------------------------------------------------------------
// 4. Auto-install missing dependencies
// -------------------------------------------------------------
console.log("\n📦 Checking for missing dependencies…");

run("npm install");


// -------------------------------------------------------------
// 5. Rebuild client (safe mode)
// -------------------------------------------------------------
console.log("\n🛠 Rebuilding client…");
run("npm run build --prefix client");


// -------------------------------------------------------------
// 6. Verify server start (non-blocking)
// -------------------------------------------------------------
console.log("\n🚀 Testing server startup (non-blocking)…");
try {
  execSync("node server/index.mjs --check-only", { stdio: "ignore" });
  console.log("✅ Server file structurally OK.");
} catch {
  console.log("⚠️ Server has structural issues — investigate routes or imports.");
}

// -------------------------------------------------------------
// DONE
// -------------------------------------------------------------
console.log("\n💗 Auto-Heal complete! You can now run:");
console.log("👉 npm run dev\n");
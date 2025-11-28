// scripts/ensure-tools.mjs
// Maria's Self-Healing + Guardian Tool Factory 💛
// Ensures our core helper scripts exist and carry your intention of
// protection, honesty, and self-love.

import fs from "fs";
import path from "path";

const scriptsDir = path.join(process.cwd(), "scripts");

// Make sure /scripts exists
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir);
  console.log("📁 Created scripts/ folder");
}

// Helper to create a script only if missing
function ensureScript(filename, contents) {
  const fullPath = path.join(scriptsDir, filename);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Found: ${filename}`);
    return;
  }
  fs.writeFileSync(fullPath, contents.trimStart() + "\n");
  console.log(`✨ Created: ${filename}`);
}

// 1) permanent-fix.mjs — “big heal” script
ensureScript(
  "permanent-fix.mjs",
  `// permanent-fix.mjs
import { execSync } from "child_process";
import fs from "fs";

console.log("💛 Running Permanent Heal for MyMentalHealthBuddy…");

// Kill stray Node processes (gently ignore errors)
try {
  execSync("killall node || true");
  console.log("✔ Node processes cleaned");
} catch {}

// Validate root package.json
try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✔ Root package.json is valid JSON");
} catch (err) {
  console.error("❌ Root package.json invalid:", err.message);
  console.error("   Open package.json and look for missing commas, quotes, or braces.");
}

console.log("✨ Permanent heal finished. You are doing enough, Maria.");
`
);

// 2) clean-port.mjs — make sure port 5000 is free
ensureScript(
  "clean-port.mjs",
  `// clean-port.mjs
import { execSync } from "child_process";

console.log("🧹 Cleaning any Node process that might be using port 5000…");

try {
  execSync("killall node || true");
  console.log("✔ Port 5000 cleaned");
} catch (err) {
  console.error("❌ Could not clean port:", err.message);
}

console.log("✨ Done. It is safe to start the server.");
`
);

// 3) check-package-json.mjs — simple JSON sanity check at root
ensureScript(
  "check-package-json.mjs",
  `// check-package-json.mjs
import fs from "fs";

try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✔ package.json is valid JSON.");
} catch (err) {
  console.error("❌ package.json is NOT valid JSON:", err.message);
  console.error("   Fix that file before running build/start.");
  process.exitCode = 1;
}
`
);

// 4) guardian-heart.mjs — your “touch”: reminders + health check
ensureScript(
  "guardian-heart.mjs",
  `// guardian-heart.mjs
// Maria's Guardian: gently protects with honesty and self-love.

import fs from "fs";

console.log("💛 MyMentalHealthBuddy Guardian — for Maria and every human.");

const messages = [
  "You are not broken. You are learning.",
  "Your feelings are real and allowed.",
  "Honesty with yourself is healing, not punishment.",
  "This platform exists to support, not judge.",
  "You are allowed to rest while building something beautiful."
];

for (const m of messages) {
  console.log(" •", m);
}

// Show basic project info if available
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("\\nProject:", pkg.name, "v" + pkg.version);
} catch {}

// Optional health check
const url = process.env.HEALTH_URL
  || "https://my-mental-health-buddy.replit.app/api/health";

console.log("\\nChecking API health at", url, "…");

try {
  const res = await fetch(url);
  const json = await res.json();
  console.log("✔ API health:", JSON.stringify(json));
} catch (err) {
  console.log("⚠ Could not reach API right now. That is okay. You are still safe.");
}

console.log("\\nRemember: You are not behind. You are healing while you build. 💛");
`
);

console.log("🌈 Tool check complete. Core helpers + Guardian are all present.");
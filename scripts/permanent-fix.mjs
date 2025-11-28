// permanent-fix.mjs
import { execSync } from "child_process";
import fs from "fs";

console.log("💛 Running Permanent Heal…");

// Kill stray Node processes
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
}

console.log("✨ Permanent heal finished. You are doing enough, Maria.");


// scripts/check-package-json.mjs
import fs from "node:fs";

try {
  const raw = fs.readFileSync("package.json", "utf8");
  JSON.parse(raw);
  console.log("✅ package.json is valid JSON.");
  process.exit(0);
} catch (err) {
  console.error("❌ package.json is INVALID JSON:");
  console.error(err.message);
  process.exit(1);
}
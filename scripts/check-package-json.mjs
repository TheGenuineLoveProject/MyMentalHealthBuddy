// scripts/check-package-json.mjs
import fs from "node:fs";

try {
  const raw = fs.readFileSync("package.json", "utf8");
  JSON.parse(raw);
  console.log("✅ package.json is valid JSON.");
} catch (err) {
  console.error("❌ Invalid package.json:", err.message);
  process.exit(1);
}
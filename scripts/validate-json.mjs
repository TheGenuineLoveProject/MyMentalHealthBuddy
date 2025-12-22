import fs from "fs";

try {
  const raw = fs.readFileSync("package.json", "utf8");
  JSON.parse(raw);
  console.log("✅ package.json is valid JSON");
} catch (e) {
  console.error("❌ package.json is INVALID JSON");
  console.error(e.message);
  process.exit(1);
}
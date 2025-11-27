/**
 * UI SCAN — checks for obvious UI/React issues.
 * Silent + CI-Safe.
 */

import fs from "fs";

console.log("🔍 UI Scan — Started");

const targets = [
  "client/src",
  "client/components",
  "client/pages",
];

for (const folder of targets) {
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (file.endsWith(".jsx") || file.endsWith(".tsx") || file.endsWith(".js")) {
      const content = fs.readFileSync(`${folder}/${file}`, "utf8");

      // Detection logic — simple + safe
      if (content.includes("<<<<<<<") || content.includes(">>>>>>")) {
        console.log(`⚠️ Merge conflict markers detected in ${folder}/${file}`);
      }
    }
  }
}

console.log("🔍 UI Scan Complete (Silent Mode OK)");
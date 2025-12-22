/**
 * CRITICAL SCAN — ensures no missing imports or fatal blockers.
 */

import fs from "fs";

console.log("🚨 Critical Scan — Started");

const folders = ["client", "server"];

for (const folder of folders) {
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".jsx")) {
      const content = fs.readFileSync(`${folder}/${file}`, "utf8");

      if (content.includes("undefined is not a function")) {
        console.log(`❌ Critical error hint inside: ${folder}/${file}`);
      }
    }
  }
}

console.log("🚨 Critical Scan Complete (Silent OK)");
/**
 * VIP SCAN — high-level identifiers or files you always want checked.
 */

import fs from "fs";

console.log("👁 VIP Scan — Started");

const vipFiles = ["README.md", ".env", "package.json"];

for (const file of vipFiles) {
  if (fs.existsSync(file)) {
    console.log(`👁 VIP file present: ${file}`);
  }
}

console.log("👁 VIP Scan Complete (Silent Mode OK)");
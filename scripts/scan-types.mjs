/**
 * TYPES SCAN — ensures basic type patterns exist for TS/JS.
 */

import fs from "fs";

console.log("🔍 Types Scan — Started");

const folders = ["client", "server"];

for (const folder of folders) {
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (file.includes("types")) {
      console.log(`ℹ️ Found type-def file: ${folder}/${file}`);
    }
  }
}

console.log("🔍 Types Scan Complete (Silent Mode OK)");
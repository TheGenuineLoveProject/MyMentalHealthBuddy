// automation/scanErrors.mjs
// v1.1 — Professional Edition (Safe, Non-Destructive)

import fs from "node:fs";
import path from "node:path";
import {
  assertNotProduction,
  logSection
} from "./automationCore.mjs";

// Safety guard
assertNotProduction();

logSection("Error Scanner v1.1 (Safe Professional Edition)");

// FOLDERS TO SCAN (Your real application code)
const TARGET_FOLDERS = [
  "client/src",
  "server",
  "scripts"
];

// FOLDERS TO IGNORE
const IGNORE_FOLDERS = [
  "scripts",
  "node_modules",
  "automation",
  "archive_DO_NOT_DELETE",
  "attached_assets",
  "safe_backups",
  "content_output",
  ".replit_backups"
];

// ACCEPTED CODE FILE EXTENSIONS
const CODE_EXTENSIONS = [
  ".js", ".jsx",
  ".ts", ".tsx",
  ".mjs", ".cjs",
  ".json"
];

function isCodeFile(file) {
  return CODE_EXTENSIONS.some(ext => file.endsWith(ext));
}

function shouldIgnore(fullPath) {
  return IGNORE_FOLDERS.some(folder => fullPath.includes(folder));
}

function getAllFiles(dir) {
  let results = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    // ignore entire ignored folders
    if (shouldIgnore(full)) continue;

    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(full));
    } else if (entry.isFile() && isCodeFile(entry.name)) {
      results.push(full);
    }
  }

  return results;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];

  if (content.trim().length === 0) issues.push("⚠️ Empty file");

  const openBrace = (content.match(/\{/g) || []).length;
  const closeBrace = (content.match(/\}/g) || []).length;
  if (openBrace !== closeBrace) issues.push("⚠️ Mismatched { } braces");

  const openPar = (content.match(/\(/g) || []).length;
  const closePar = (content.match(/\)/g) || []).length;
  if (openPar !== closePar) issues.push("⚠️ Mismatched ( ) parentheses");

  const openBr = (content.match(/\[/g) || []).length;
  const closeBr = (content.match(/]/g) || []).length;
  if (openBr !== closeBr) issues.push("⚠️ Mismatched [ ] brackets");

  if (/TODO|FIXME/gi.test(content)) issues.push("ℹ️ Contains TODO/FIXME comments");

  return issues;
}

let totalFiles = 0;
let flaggedFiles = 0;

for (const folder of TARGET_FOLDERS) {
  const folderPath = path.join(process.cwd(), folder);
  logSection(`Scanning folder: ${folder}`);

  const files = getAllFiles(folderPath);
  totalFiles += files.length;

  for (const file of files) {
    const issues = scanFile(file);
    if (issues.length > 0) {
      flaggedFiles++;
      console.log(`\nFile: ${file}`);
      issues.forEach(issue => console.log("  -", issue));
    }
  }
}

logSection("Error Scan Summary");
console.log("Total scanned:", totalFiles);
console.log("Files with issues:", flaggedFiles);
console.log("Scan complete. No files changed.");
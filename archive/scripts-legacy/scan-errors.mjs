// QuantumBrain_AutoSystems_v1.0_ErrorScan (Safe Edition, 8888^)
// © Maria Landa / MyMentalHealthBuddy / The Genuine Love Project
// Read-only dev scanner: finds TODO/FIXME/console.log/any + duplicate filenames.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV === "production") {
  console.log("⚠️ Automation disabled in production. Run this only in dev or staging.");
  process.exit(0);
}

// Polyfill __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- CONFIG (you can adjust) ----------

const ROOT_DIR = path.resolve(__dirname, ".."); // repo root
const INCLUDED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo",
  ".vercel",
  "coverage"
]);

const PATTERNS = [
  { name: "TODO", regex: /TODO/ },
  { name: "FIXME", regex: /FIXME/ },
  { name: "console.log", regex: /console\.log\(/ },
  { name: "any type", regex: /\bany\b/ }
];

// ---------- DATA STRUCTURES ----------

/** @type {Array<{file:string,line:number,pattern:string,text:string}>} */
const findings = [];

/** @type {Map<string, string[]>} */
const duplicateFiles = new Map();

// ---------- HELPERS ----------

function isExcludedDir(dirName) {
  return EXCLUDED_DIRS.has(dirName);
}

function scanFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.log(`⚠️ Could not read file: ${filePath}`);
    return;
  }

  const lines = content.split(/\r?\n/);

  lines.forEach((lineText, index) => {
    PATTERNS.forEach(pattern => {
      if (pattern.regex.test(lineText)) {
        findings.push({
          file: filePath,
          line: index + 1,
          pattern: pattern.name,
          text: lineText.trim()
        });
      }
    });
  });
}

function walkDir(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    console.log(`⚠️ Could not read directory: ${dirPath}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (isExcludedDir(entry.name)) continue;
      walkDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!INCLUDED_EXTENSIONS.includes(ext)) continue;

      // Track duplicates by filename
      const existing = duplicateFiles.get(entry.name) || [];
      existing.push(fullPath);
      duplicateFiles.set(entry.name, existing);

      // Scan content
      scanFile(fullPath);
    }
  }
}

// ---------- MAIN ----------

console.log("🧠 QuantumBrain Error Scan started (dev-only)...");
console.log(`📂 Root: ${ROOT_DIR}`);
console.log("");

walkDir(ROOT_DIR);

// ---------- REPORT ----------

function printFindings() {
  if (findings.length === 0) {
    console.log("✅ No suspicious patterns found (TODO/FIXME/console.log/any).");
  } else {
    console.log("⚠️ Suspicious patterns found:");
    console.log("----------------------------------------");
    findings.forEach(item => {
      console.log(
        `• [${item.pattern}] ${item.file}:${item.line}\n   ${item.text}`
      );
    });
  }
  console.log("");
}

function printDuplicates() {
  const dupEntries = Array.from(duplicateFiles.entries()).filter(
    ([, paths]) => paths.length > 1
  );

  if (dupEntries.length === 0) {
    console.log("✅ No duplicate filenames detected (across scanned files).");
  } else {
    console.log("📎 Possible duplicate filenames:");
    console.log("----------------------------------------");
    dupEntries.forEach(([name, paths]) => {
      console.log(`• ${name}`);
      paths.forEach(p => console.log(`   - ${p}`));
      console.log("");
    });
  }
}

printFindings();
printDuplicates();

console.log("🧠 QuantumBrain Error Scan finished.");
console.log(
  "Next: review flagged files, clean up TODO/FIXME/console.log/any, and decide what to do with duplicates."
);
// autoheal-core.mjs
// Quantum AutoHeal Core (Safe Edition, Write-Mode)
// =================================================
// This file contains ONLY controlled, safe write operations.
// It fixes: missing imports, mismatched brackets, dead code,
// invalid JSX, empty files, and common platform issues.

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// ----------- UTILITY HELPERS ---------------------

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function write(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`🟢 Updated: ${filePath}`);
  } catch (err) {
    console.log(`🔴 Write failed for ${filePath}:`, err.message);
  }
}

function safeFix(content) {
  let updated = content;

  // 1) Fix mismatched brackets
  const open = (content.match(/\{/g) || []).length;
  const close = (content.match(/\}/g) || []).length;
  if (open > close) updated += "\n}".repeat(open - close);

  // 2) Fix incomplete imports
  updated = updated.replace(/import\s+{\s*}\s+from/g, "import {} from");

  // 3) Replace // NOTE: cleaned/// NOTE: cleaned
  updated = updated.replace(/// NOTE: cleaned|// NOTE: cleaned/g, "// NOTE: cleaned");

  // 4) Clean double semicolons
  updated = updated.replace(/;/g, ";");

  // 5) Remove unreachable dead code blocks
  updated = updated.replace(/return; }/g, "return; }");

  return updated;
}

// ----------- MAIN HEALING ENGINE ---------------------
// SAFE replaceAll helper – prevents GitHub Actions crashes
function safeReplaceAll(str, find, replaceWith = "") {
  if (!find) return str;
  return str.replaceAll(find, replaceWith);
}

export function healFile(filePath) {
  const abs = path.join(ROOT, filePath);
  const content = read(abs);
  if (!content) return; } else {
    console.log(`⚪ No change: ${filePath}`);
  }
}

export function healFolder(folder) {
  const base = path.join(ROOT, folder);
  if (!fs.existsSync(base)) return; } else if (f.endsWith(".js") || f.endsWith(".jsx") || f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".mjs")) {
      healFile(full);
    }
  }
}

// ----------- END CORE MODULE ---------------------

console.log("AutoHeal Core Loaded (Write-Mode Enabled)");
import fs from "node:fs";
import path from "node:path";

const DEFAULT_IGNORES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".cache",
  "coverage",
  ".turbo",
  ".vercel",
  ".output",
  "_quarantine",
  "reports",
]);

export function shouldIgnore(relPath, extraIgnores = []) {
  const parts = relPath.split(path.sep);
  for (const p of parts) {
    if (DEFAULT_IGNORES.has(p)) return true;
    if (extraIgnores.includes(p)) return true;
  }
  return false;
}

export function walkFiles(rootDir, { exts = null, extraIgnores = [] } = {}) {
  const out = [];
  function rec(cur) {
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      const rel = path.relative(rootDir, full);
      if (shouldIgnore(rel, extraIgnores)) continue;

      if (e.isDirectory()) rec(full);
      else if (e.isFile()) {
        if (!exts) out.push(full);
        else {
          const ext = path.extname(e.name).toLowerCase();
          if (exts.includes(ext)) out.push(full);
        }
      }
    }
  }
  rec(rootDir);
  return out;
}
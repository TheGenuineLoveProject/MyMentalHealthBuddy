// scripts/analyze-project.mjs
// Run with: node scripts/analyze-project.mjs
// It will print a JSON report you can copy-paste into ChatGPT.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

// Folders we don't want to scan deeply
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".config",
  ".replit_backups",
  ".rollback",
  "dist",
  "build",
  ".next",
  "out"
]);

const allFiles = [];

// Recursively collect all file paths
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(root, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(fullPath);
    } else if (entry.isFile()) {
      allFiles.push(relPath);
    }
  }
}

walk(root);

// Group by base filename to find duplicates (e.g. many "index.ts")
const byBase = new Map();
for (const f of allFiles) {
  const base = path.basename(f);
  if (!byBase.has(base)) byBase.set(base, []);
  byBase.get(base).push(f);
}

const duplicates = [];
for (const [file, paths] of byBase.entries()) {
  if (paths.length > 1) {
    duplicates.push({ file, count: paths.length, paths });
  }
}

// Helper: does a specific path exist?
const hasFile = (p) => fs.existsSync(path.join(root, p));

// Identify likely server + client entry files
const serverEntries = allFiles.filter((f) =>
  /^server\/index\.(t|j)sx?$/.test(f) || /^server\/index\.(mjs|cjs)$/.test(f)
);

const rootEntries = allFiles.filter((f) =>
  /^index\.(t|j)sx?$/.test(f) || /^index\.(mjs|cjs)$/.test(f)
);

const clientRoots = allFiles.filter((f) =>
  /^client\/src\/main\.(t|j)sx?$/.test(f)
);

// Build summary report
const summary = {
  importantFiles: {
    ".replit": hasFile(".replit"),
    "package.json": hasFile("package.json"),
    "tsconfig.json": hasFile("tsconfig.json"),
    "client/vite.config.ts": hasFile("client/vite.config.ts"),
    "server/index.ts": hasFile("server/index.ts"),
    "server/index.mjs": hasFile("server/index.mjs")
  },
  totalFiles: allFiles.length,
  serverEntries,
  rootEntries,
  clientRoots,
  duplicatesSortedByCount: duplicates
    .sort((a, b) => b.count - a.count)
    .slice(0, 50), // top 50 duplicate names
  sampleServerFiles: allFiles.filter((f) => f.startsWith("server/")).slice(0, 120),
  sampleClientFiles: allFiles.filter((f) => f.startsWith("client/")).slice(0, 120)
};

// Pretty-print JSON so you can copy it
console.log(JSON.stringify(summary, null, 2));
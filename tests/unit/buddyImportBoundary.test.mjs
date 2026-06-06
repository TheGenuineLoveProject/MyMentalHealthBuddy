import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

const ACTIVE_DIRS = [
  "client/src",
  "server",
  "shared",
  "tests",
  "scripts",
];

const FORBIDDEN_IMPORT_SEGMENTS = [
  "/production-backups/",
  "/backups/",
  "/archives/",
  "/archive/",
  "/_quarantine/",
  "/static-export/",
  "/diagnostics/",
  "/logs/",
  "/node_modules/",
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const normalized = full.split(path.sep).join("/");

    if (FORBIDDEN_IMPORT_SEGMENTS.some((segment) => normalized.includes(segment))) {
      continue;
    }

    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }

    if (/\.(js|jsx|ts|tsx|mjs)$/.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function extractImports(source) {
  const matches = [];
  const patterns = [
    /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g,
    /export\s+[^'"]+\s+from\s+["']([^"']+)["']/g,
    /import\(\s*["']([^"']+)["']\s*\)/g,
    /require\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) {
      matches.push(match[1]);
    }
  }

  return matches;
}

function isLocalImport(importPath) {
  return (
    importPath.startsWith(".") ||
    importPath.startsWith("/") ||
    importPath.startsWith("@/") ||
    importPath.startsWith("@shared/") ||
    importPath.startsWith("@assets/")
  );
}

function resolveAlias(importPath) {
  if (importPath.startsWith("@/")) return path.join(ROOT, "client/src", importPath.slice(2));
  if (importPath.startsWith("@shared/")) return path.join(ROOT, "shared", importPath.slice("@shared/".length));
  if (importPath.startsWith("@assets/")) return path.join(ROOT, "client/src/assets", importPath.slice("@assets/".length));
  if (importPath.startsWith("/")) return path.join(ROOT, importPath.slice(1));
  return null;
}

test("active source files must not import archived, diagnostic, backup, or quarantined systems", () => {
  const files = ACTIVE_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
  const violations = [];

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const imports = extractImports(source);

    for (const importPath of imports) {
      if (!isLocalImport(importPath)) continue;

      const aliased = resolveAlias(importPath);
      const resolved = aliased || path.resolve(path.dirname(file), importPath);
      const normalized = resolved.split(path.sep).join("/");

      for (const forbidden of FORBIDDEN_IMPORT_SEGMENTS) {
        if (normalized.includes(forbidden)) {
          violations.push(`${path.relative(ROOT, file)} imports ${importPath}`);
        }
      }
    }
  }

  assert.deepEqual(violations, []);
});

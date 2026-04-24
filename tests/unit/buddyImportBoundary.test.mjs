import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

const BUDDY_ENGINE_FILES = [
  "client/src/components/avatar/BuddyAvatar.tsx",
  "client/src/components/avatar/BuddyPanel.tsx",
  "client/src/lib/avatarState.ts",
  "client/src/lib/buddyTelemetry.ts",
  "server/routes/buddy.mjs",
  "server/ai/aiTelemetry.mjs",
];

// v2.12.1 fail-safe-by-default: entire server/ai/ subtree forbidden,
// with explicit override list for files that legitimately belong to the
// Buddy Engine telemetry contract but live in server/ai/.
const FORBIDDEN_IMPORT_TARGETS = [
  "server/routes/ai.mjs",
  "server/routes/ai.healing.mjs",
  "server/routes/ai.business.mjs",
  "server/routes/ai-dashboard.mjs",
  "server/ai/",
  "client/src/pages/Start.tsx",
];
const FORBIDDEN_TARGET_OVERRIDES = [
  "server/ai/aiTelemetry.mjs",
];

function aliasResolve(importPath) {
  if (importPath.startsWith("@/")) return path.join("client/src", importPath.slice(2));
  if (importPath.startsWith("@shared/")) return path.join("shared", importPath.slice(8));
  if (importPath.startsWith("@assets/")) return path.join("attached_assets", importPath.slice(8));
  return null;
}

function resolveImport(importPath, fromFileRel) {
  if (
    importPath.startsWith("node:") ||
    (!importPath.startsWith(".") &&
      !importPath.startsWith("/") &&
      !importPath.startsWith("@/") &&
      !importPath.startsWith("@shared/") &&
      !importPath.startsWith("@assets/"))
  ) {
    return null;
  }
  let projectPath;
  const aliased = aliasResolve(importPath);
  if (aliased !== null) projectPath = aliased;
  else projectPath = path.normalize(path.join(path.dirname(fromFileRel), importPath));

  const candidates = [
    projectPath,
    `${projectPath}.ts`,
    `${projectPath}.tsx`,
    `${projectPath}.mjs`,
    `${projectPath}.js`,
    `${projectPath}.css`,
    path.join(projectPath, "index.ts"),
    path.join(projectPath, "index.tsx"),
    path.join(projectPath, "index.mjs"),
    path.join(projectPath, "index.js"),
  ];
  for (const c of candidates) {
    if (exists(c)) return c;
  }
  return projectPath;
}

function isForbidden(resolvedRel) {
  if (!resolvedRel) return false;
  const normalized = resolvedRel.replace(/\\/g, "/");
  for (const target of FORBIDDEN_IMPORT_TARGETS) {
    if (target.endsWith("/")) {
      if (normalized === target.slice(0, -1) || normalized.startsWith(target)) return target;
    } else if (normalized === target) return target;
  }
  return false;
}

function extractImports(src) {
  let s = src.replace(/\/\*[\s\S]*?\*\//g, "");
  s = s.replace(/^[^"'\n]*?\/\/.*$/gm, (m) => m.replace(/\/\/.*$/, ""));
  const imports = new Set();
  for (const m of s.matchAll(/^\s*import\b[^"';]*?["']([^"']+)["']/gm)) imports.add(m[1]);
  for (const m of s.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) imports.add(m[1]);
  for (const m of s.matchAll(/\brequire\s*\(\s*["']([^"']+)["']\s*\)/g)) imports.add(m[1]);
  for (const m of s.matchAll(/^\s*export\b[^"';]*?\bfrom\s*["']([^"']+)["']/gm)) imports.add(m[1]);
  return [...imports];
}

describe("Buddy Engine v2.12 — strict-protected file import boundary", () => {
  it("PASS: tests are running without setup.mjs error", () => {
    expect(true).toBe(true);
  });

  describe("Buddy Engine source files all exist", () => {
    for (const f of BUDDY_ENGINE_FILES) {
      it(`${f} exists`, () => {
        expect(exists(f)).toBe(true);
      });
    }
  });

  describe("Each Buddy Engine source file imports zero forbidden targets", () => {
    for (const buddyFile of BUDDY_ENGINE_FILES) {
      it(`${buddyFile} respects the boundary`, () => {
        const src = read(buddyFile);
        const importPaths = extractImports(src);
        const violations = [];
        for (const importPath of importPaths) {
          const resolved = resolveImport(importPath, buddyFile);
          const forbidden = isForbidden(resolved);
          if (forbidden) {
            violations.push(\`"\${importPath}" → \${resolved} (forbidden by "\${forbidden}")\`);
          }
        }
        expect(violations).toEqual([]);
      });
    }
  });
});

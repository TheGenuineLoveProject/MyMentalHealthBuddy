#!/usr/bin/env node
// scripts/check-buddy-import-boundary.mjs
//
// MMHB Buddy Engine v2.12 — strict-protected file import boundary guard.
//
// Sibling to the v2.7 / v2.8 / v2.9 / v2.10 / v2.11 guards. Joined into the
// same pre-test gate via scripts/check-contract-routes.sh.
//
// Why this guard exists:
//
//   The MMHB project goal explicitly states the Buddy Engine MUST NOT couple
//   itself to the strict-protected files:
//     - /api/ai/chat handlers (server/routes/ai*.mjs)
//     - the orchestrator / provider / memory / profile / summary / crisis-
//       classifier logic in server/ai/
//     - the /start page internals (client/src/pages/Start.tsx)
//
//   Currently this rule is enforced ONLY by convention and code review.
//   A contributor could add `import { processChat } from "../ai/orchestrator"`
//   to a Buddy Engine file, TypeScript would happily resolve it, every other
//   guard would still pass, and the Buddy Engine would silently start
//   depending on the strict-protected internals. Future changes to those
//   internals (which the project rules say must be allowed) would then
//   silently leak through into Buddy surfaces, breaking the entire
//   architectural separation.
//
//   This guard locks the boundary at the source level. For each Buddy Engine
//   source file, every direct import (static, dynamic, require) is parsed,
//   resolved against the project's path aliases (@/, @shared/, @assets/) and
//   relative-path rules, and matched against a hardcoded forbidden allowlist.
//
//   Scope: DIRECT imports only. Transitive analysis is out of scope (would
//   require a real module graph). The architectural answer for transitive
//   safety is the facade pattern (e.g., server/routes/buddy.mjs uses
//   server/engine/crisisDetection.mjs as a facade rather than importing
//   server/ai/crisisClassifier.mjs directly).
//
// Run manually:
//   node scripts/check-buddy-import-boundary.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

const failures = [];
function fail(msg, hint = "") {
  failures.push(`  ✗ ${msg}${hint ? `\n      ${hint}` : ""}`);
}

// ---------------------------------------------------------------------------
// BUDDY ENGINE SURFACES — files whose imports we audit.
// These files are the "boundary-respecting side" — they MUST NOT import
// from any FORBIDDEN_IMPORT_TARGETS path below.
// ---------------------------------------------------------------------------
const BUDDY_ENGINE_FILES = [
  "client/src/components/avatar/BuddyAvatar.tsx",
  "client/src/components/avatar/BuddyPanel.tsx",
  "client/src/lib/avatarState.ts",
  "client/src/lib/buddyTelemetry.ts",
  "server/routes/buddy.mjs",
  "server/ai/aiTelemetry.mjs",
];

// ---------------------------------------------------------------------------
// FORBIDDEN IMPORT TARGETS — the strict-protected side.
// Each entry is a project-relative path string. After resolving an import
// to its actual on-disk file (with extension probing), we check whether the
// resolved path EXACTLY equals any of these, OR whether it lives under a
// forbidden directory (the trailing-slash entries).
//
// FAIL-SAFE-BY-DEFAULT (v2.12.1 — architect-recommended): the entire
// `server/ai/` subtree is forbidden by default. Any future file added to
// `server/ai/` is automatically blocked from being imported by Buddy
// Engine surfaces. Files that legitimately belong to the Buddy Engine
// telemetry contract but physically live in `server/ai/` are listed in
// FORBIDDEN_TARGET_OVERRIDES below as explicit exceptions.
// ---------------------------------------------------------------------------
const FORBIDDEN_IMPORT_TARGETS = [
  // /api/ai/chat route handlers (each one explicitly listed because
  // server/routes/ also contains buddy.mjs which IS a Buddy Engine surface,
  // so subtree match would be over-broad here).
  "server/routes/ai.mjs",
  "server/routes/ai.healing.mjs",
  "server/routes/ai.business.mjs",
  "server/routes/ai-dashboard.mjs",

  // Entire orchestrator / provider / memory / profile / summary / crisis /
  // safety / system-prompts subtree. Subtree match is fail-safe-by-default:
  // new files default to forbidden, not silently allowed.
  "server/ai/",

  // /start page internals
  "client/src/pages/Start.tsx",
];

// FORBIDDEN_TARGET_OVERRIDES — files that match a forbidden subtree above
// but ARE legitimately part of the Buddy Engine and must stay importable.
// Adding a new override here is a deliberate, reviewable act.
const FORBIDDEN_TARGET_OVERRIDES = [
  // aiTelemetry.mjs is the server-side counterpart to buddyTelemetry.ts.
  // It lives in server/ai/ for proximity to its consumer (the orchestrator
  // logs Buddy events through it) but is architecturally part of the Buddy
  // Engine telemetry contract.
  "server/ai/aiTelemetry.mjs",
];

// ---------------------------------------------------------------------------
// Path alias map (from client/tsconfig.json)
// ---------------------------------------------------------------------------
function aliasResolve(importPath) {
  if (importPath.startsWith("@/")) {
    return path.join("client/src", importPath.slice(2));
  }
  if (importPath.startsWith("@shared/")) {
    return path.join("shared", importPath.slice(8));
  }
  if (importPath.startsWith("@assets/")) {
    return path.join("attached_assets", importPath.slice(8));
  }
  return null;
}

// Resolve an import string to a project-relative path (or null if external/builtin).
function resolveImport(importPath, fromFileRel) {
  // External package or Node builtin — not a project file, can't violate
  // the boundary by itself.
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
  if (aliased !== null) {
    projectPath = aliased;
  } else if (importPath.startsWith(".") || importPath.startsWith("/")) {
    const fromDir = path.dirname(fromFileRel);
    projectPath = path.normalize(path.join(fromDir, importPath));
  } else {
    return null;
  }

  // Probe for the actual file with extension + index.* candidates.
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
  // Couldn't resolve — return the bare projectPath so the boundary check
  // still has something to test against. Failing to resolve is itself a
  // potential issue but is out of scope for this guard.
  return projectPath;
}

// Match a resolved import path against the forbidden list. Override list
// is checked FIRST: if a path matches an explicit override, it is allowed
// even if it would otherwise match a forbidden subtree.
function isForbidden(resolvedRel) {
  if (!resolvedRel) return false;
  const normalized = resolvedRel.replace(/\\/g, "/"); // windows safety

  // Explicit override — allowed regardless of subtree forbidden match.
  for (const ov of FORBIDDEN_TARGET_OVERRIDES) {
    if (normalized === ov) return false;
  }

  for (const target of FORBIDDEN_IMPORT_TARGETS) {
    if (target.endsWith("/")) {
      // Subtree match
      if (normalized === target.slice(0, -1) || normalized.startsWith(target)) {
        return target;
      }
    } else if (normalized === target) {
      return target;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Import scanner — extracts every import path from a source file.
// Strips line + block comments first to avoid matching commented-out imports
// or import strings inside JSDoc.
// ---------------------------------------------------------------------------
function extractImports(src) {
  // Strip /* ... */ block comments
  let s = src.replace(/\/\*[\s\S]*?\*\//g, "");
  // Strip // line comments
  s = s.replace(/^[^"'\n]*?\/\/.*$/gm, (m) => {
    // Be careful not to strip URLs inside strings — only strip if no quote
    // appears before the //. The regex's leading [^"'] negation already
    // guards against the simple `"http://"` case for single-line literals;
    // multi-line concerns don't apply because /* */ already removed.
    return m.replace(/\/\/.*$/, "");
  });

  const imports = new Set();
  // Static: import ... from "X"  AND  import "X"
  for (const m of s.matchAll(
    /^\s*import\b[^"';]*?["']([^"']+)["']/gm,
  )) {
    imports.add(m[1]);
  }
  // Dynamic: import("X")
  for (const m of s.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    imports.add(m[1]);
  }
  // CommonJS: require("X")
  for (const m of s.matchAll(/\brequire\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    imports.add(m[1]);
  }
  // Re-export: export ... from "X"
  for (const m of s.matchAll(
    /^\s*export\b[^"';]*?\bfrom\s*["']([^"']+)["']/gm,
  )) {
    imports.add(m[1]);
  }
  return [...imports];
}

// ---------------------------------------------------------------------------
// Audit each Buddy Engine source file
// ---------------------------------------------------------------------------
let totalImportsScanned = 0;

for (const buddyFile of BUDDY_ENGINE_FILES) {
  if (!exists(buddyFile)) {
    fail(
      `Buddy Engine source file not found: ${buddyFile}`,
      `Either the file was renamed/deleted or BUDDY_ENGINE_FILES in scripts/check-buddy-import-boundary.mjs is stale. If the file moved, update both this guard and the Vitest mirror.`,
    );
    continue;
  }
  const src = read(buddyFile);
  const importPaths = extractImports(src);
  totalImportsScanned += importPaths.length;

  for (const importPath of importPaths) {
    const resolved = resolveImport(importPath, buddyFile);
    const forbidden = isForbidden(resolved);
    if (forbidden) {
      fail(
        `${buddyFile} imports forbidden strict-protected file: "${importPath}" → ${resolved}`,
        `The Buddy Engine MUST NOT import from "${forbidden}". This boundary is the architectural separation between Buddy Engine and the strict-protected /api/ai/chat + orchestrator/provider/memory/profile/summary/crisis logic + /start page internals. Use the facade pattern instead (e.g., server/engine/crisisDetection.mjs is the approved facade for crisis-detection semantics) or move the shared logic into a Buddy-Engine-side module.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("BUDDY_IMPORT_BOUNDARY_VIOLATIONS:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `PASS: Buddy v2.12 strict-protected file import boundary intact (${BUDDY_ENGINE_FILES.length} Buddy Engine source files audited, ${totalImportsScanned} direct imports scanned, ${FORBIDDEN_IMPORT_TARGETS.length} forbidden targets enforced).`,
);

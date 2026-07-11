#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const OUTPUT =
  "artifacts/governance/registry-candidate-inventory.json";

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".cache",
  ".vite",
  "tmp",
  "artifacts",
]);

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
]);

const ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".ico",
  ".avif",
  ".mp3",
  ".wav",
  ".m4a",
  ".mp4",
  ".webm",
  ".pdf",
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function relativePath(value) {
  return toPosix(path.relative(ROOT, value));
}

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
  })) {
    if (IGNORE_DIRS.has(entry.name)) continue;

    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(absolute, output);
      continue;
    }

    if (entry.isFile()) {
      output.push(absolute);
    }
  }

  return output;
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b),
  );
}

function safeGit(...args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function normalizeRoute(route) {
  if (!route) return null;

  const cleaned = route
    .trim()
    .replace(/\s+/g, "")
    .replace(/\/{2,}/g, "/");

  if (!cleaned.startsWith("/")) return null;
  if (cleaned.length > 240) return null;
  if (
    cleaned.includes("${") ||
    cleaned.includes("://") ||
    cleaned.includes("<")
  ) {
    return null;
  }

  return cleaned;
}

const allFiles = walk(ROOT);
const sourceFiles = allFiles.filter((file) =>
  SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()),
);

const clientSourceFiles = sourceFiles.filter((file) =>
  relativePath(file).startsWith("client/src/"),
);

const serverSourceFiles = sourceFiles.filter((file) =>
  relativePath(file).startsWith("server/"),
);

/*
 * React component candidates
 *
 * Conservative rule:
 * - source file is inside client/src
 * - filename begins with an uppercase character
 * - JSX/TSX/JS/TS extension
 */
const componentCandidates = clientSourceFiles
  .filter((file) => {
    const extension = path.extname(file).toLowerCase();
    const basename = path.basename(file, extension);

    return (
      [".jsx", ".tsx", ".js", ".ts"].includes(extension) &&
      /^[A-Z]/.test(basename)
    );
  })
  .map((file) => {
    const extension = path.extname(file);
    const basename = path.basename(file, extension);

    return {
      candidateId: basename,
      componentName: basename,
      implementationPath: relativePath(file),
      source: "repository_discovery",
      approvalStatus: "unreviewed",
    };
  });

/*
 * Client route candidates
 *
 * Detects common React Router forms:
 *   path="/example"
 *   path: "/example"
 *   path = "/example"
 */
const clientRouteMap = new Map();

const clientRoutePatterns = [
  /\bpath\s*=\s*["'`]([^"'`]+)["'`]/g,
  /\bpath\s*:\s*["'`]([^"'`]+)["'`]/g,
];

for (const file of clientSourceFiles) {
  const content = readText(file);

  for (const pattern of clientRoutePatterns) {
    for (const match of content.matchAll(pattern)) {
      const route = normalizeRoute(match[1]);
      if (!route) continue;

      const key = `CLIENT:${route}`;

      if (!clientRouteMap.has(key)) {
        clientRouteMap.set(key, {
          candidateId: key,
          layer: "client",
          method: null,
          route,
          implementationPaths: [],
          source: "repository_discovery",
          approvalStatus: "unreviewed",
        });
      }

      clientRouteMap
        .get(key)
        .implementationPaths.push(relativePath(file));
    }
  }
}

/*
 * Server route candidates
 *
 * Detects common Express-style forms:
 *   app.get("/api/example")
 *   router.post("/example")
 *   app.use("/api/example")
 */
const serverRouteMap = new Map();

const serverRoutePattern =
  /\b(?:app|router)\s*\.\s*(get|post|put|patch|delete|use|options|head)\s*\(\s*["'`]([^"'`]+)["'`]/gi;

for (const file of serverSourceFiles) {
  const content = readText(file);

  for (const match of content.matchAll(serverRoutePattern)) {
    const method = match[1].toUpperCase();
    const route = normalizeRoute(match[2]);

    if (!route) continue;

    const key = `SERVER:${method}:${route}`;

    if (!serverRouteMap.has(key)) {
      serverRouteMap.set(key, {
        candidateId: key,
        layer: "server",
        method,
        route,
        implementationPaths: [],
        source: "repository_discovery",
        approvalStatus: "unreviewed",
      });
    }

    serverRouteMap
      .get(key)
      .implementationPaths.push(relativePath(file));
  }
}

/*
 * Asset candidates
 *
 * Limited to application-owned locations.
 */
const assetRoots = [
  "client/public",
  "client/src/assets",
  "public",
  "assets",
];

const assetCandidates = [];

for (const root of assetRoots) {
  const absoluteRoot = path.join(ROOT, root);

  for (const file of walk(absoluteRoot)) {
    const extension = path.extname(file).toLowerCase();
    if (!ASSET_EXTENSIONS.has(extension)) continue;

    const stats = fs.statSync(file);

    assetCandidates.push({
      candidateId: relativePath(file),
      implementationPath: relativePath(file),
      extension,
      bytes: stats.size,
      source: "repository_discovery",
      approvalStatus: "unreviewed",
    });
  }
}

/*
 * Prompt candidates
 *
 * This is intentionally conservative. It discovers likely prompt-bearing
 * files but does not assert that each file contains a production prompt.
 */
const promptCandidates = sourceFiles
  .filter((file) => {
    const relative = relativePath(file).toLowerCase();
    const basename = path.basename(file).toLowerCase();

    if (
      relative.includes("/prompt") ||
      basename.includes("prompt")
    ) {
      return true;
    }

    const content = readText(file);

    return (
      /\bsystemPrompt\b/.test(content) ||
      /\bpromptTemplate\b/.test(content) ||
      /\bSYSTEM_PROMPT\b/.test(content)
    );
  })
  .map((file) => ({
    candidateId: relativePath(file),
    implementationPath: relativePath(file),
    discoveryReason: "prompt_filename_or_symbol",
    source: "repository_discovery",
    approvalStatus: "unreviewed",
  }));

/*
 * Declared capabilities
 *
 * Preserve the current declarations without claiming implementation
 * coverage.
 */
let declaredCapabilities = [];

const capabilityRegistry =
  "platform/registry/capabilities.json";

if (fs.existsSync(capabilityRegistry)) {
  try {
    const parsed = JSON.parse(
      fs.readFileSync(capabilityRegistry, "utf8"),
    );

    if (Array.isArray(parsed.capabilities)) {
      declaredCapabilities = parsed.capabilities.map((id) => ({
        capabilityId: id,
        implementationStatus: "unmapped",
        implementationPaths: [],
        routeIds: [],
        measurementIds: [],
        approvalStatus: "declared_only",
      }));
    }
  } catch (error) {
    console.error(
      `FAIL unable to parse ${capabilityRegistry}: ${error.message}`,
    );
    process.exit(1);
  }
}

const clientRoutes = [...clientRouteMap.values()].map((record) => ({
  ...record,
  implementationPaths: uniqueSorted(
    record.implementationPaths,
  ),
}));

const serverRoutes = [...serverRouteMap.values()].map((record) => ({
  ...record,
  implementationPaths: uniqueSorted(
    record.implementationPaths,
  ),
}));

const artifact = {
  schemaVersion: "1.0.0",
  artifactType: "registry_candidate_inventory",
  status: "CANDIDATE_REVIEW_REQUIRED",
  authoritative: false,
  generatedAt: new Date().toISOString(),
  repository: {
    // Store a portable repository-relative identity. Never embed the
    // developer's absolute home/workspace path in generated evidence.
    root: ".",
    branch: safeGit("branch", "--show-current"),
    commit: safeGit("rev-parse", "HEAD"),
    workingTreeClean:
      safeGit("status", "--porcelain") === "",
  },
  safetyRules: [
    "This artifact does not modify authoritative registries.",
    "Discovery does not prove runtime reachability.",
    "Every candidate requires validation before approval.",
    "Do not calculate production completion from unreviewed candidates.",
    "Do not infer diagnoses or clinical conclusions from capability mappings.",
  ],
  summary: {
    sourceFilesEvaluated: sourceFiles.length,
    clientRouteCandidates: clientRoutes.length,
    serverRouteCandidates: serverRoutes.length,
    componentCandidates: componentCandidates.length,
    assetCandidates: assetCandidates.length,
    promptFileCandidates: promptCandidates.length,
    declaredCapabilities: declaredCapabilities.length,
  },
  candidates: {
    clientRoutes,
    serverRoutes,
    components: componentCandidates.sort((a, b) =>
      a.implementationPath.localeCompare(
        b.implementationPath,
      ),
    ),
    assets: assetCandidates.sort((a, b) =>
      a.implementationPath.localeCompare(
        b.implementationPath,
      ),
    ),
    promptFiles: promptCandidates.sort((a, b) =>
      a.implementationPath.localeCompare(
        b.implementationPath,
      ),
    ),
    capabilities: declaredCapabilities,
  },
};

fs.mkdirSync(path.dirname(OUTPUT), {
  recursive: true,
});

fs.writeFileSync(
  OUTPUT,
  `${JSON.stringify(artifact, null, 2)}\n`,
);

console.log("==========================================");
console.log("REGISTRY CANDIDATE INVENTORY SUMMARY");
console.log("==========================================");
console.log(
  `Source files evaluated: ${artifact.summary.sourceFilesEvaluated}`,
);
console.log(
  `Client route candidates: ${artifact.summary.clientRouteCandidates}`,
);
console.log(
  `Server route candidates: ${artifact.summary.serverRouteCandidates}`,
);
console.log(
  `Component candidates: ${artifact.summary.componentCandidates}`,
);
console.log(
  `Asset candidates: ${artifact.summary.assetCandidates}`,
);
console.log(
  `Prompt file candidates: ${artifact.summary.promptFileCandidates}`,
);
console.log(
  `Declared capabilities: ${artifact.summary.declaredCapabilities}`,
);
console.log(`Status: ${artifact.status}`);
console.log(`Output: ${OUTPUT}`);
console.log("REGISTRY_CANDIDATE_INVENTORY_GENERATE_PASS");

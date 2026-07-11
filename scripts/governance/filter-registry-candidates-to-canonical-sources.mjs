#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

const INPUT =
  "artifacts/governance/registry-candidate-inventory.json";

const DIAGNOSTIC_INPUT =
  "artifacts/governance/registry-candidate-precision-diagnostic.json";

const OUTPUT =
  "artifacts/governance/registry-candidate-inventory.canonical-filtered.json";

const REVIEW_OUTPUT =
  "artifacts/governance/registry-candidate-filter-review.json";

const CANONICAL_PREFIXES = [
  "client/src/",
  "client/public/",
  "server/",
  "shared/",
];

const EXACT_ALLOWED_FILES = new Set([
  "client/src/App.jsx",
  "client/src/App.tsx",
  "client/src/main.jsx",
  "client/src/main.tsx",
  "server/app.mjs",
  "server/index.mjs",
]);

const EXCLUDED_SEGMENTS = new Set([
  ".git",
  ".cache",
  ".config",
  ".hx-backups",
  ".next",
  ".output",
  ".turbo",
  ".vercel",
  "artifacts",
  "archive",
  "archived",
  "backup",
  "backups",
  "build",
  "coverage",
  "deprecated",
  "dist",
  "docs",
  "examples",
  "fixtures",
  "generated",
  "legacy",
  "node_modules",
  "playground",
  "production-backups",
  "samples",
  "snapshots",
  "stories",
  "temp",
  "tests",
  "tmp",
]);

const EXCLUDED_FILE_PATTERN =
  /(?:^|\/)(?:__tests__|test|tests|spec|specs|fixtures|stories)(?:\/|$)|\.(?:test|spec|stories?)\.[cm]?[jt]sx?$|\.(?:bak|backup|old|orig|rej|tmp)$/i;

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}

function posix(value) {
  return String(value || "")
    .replaceAll("\\", "/")
    .replace(/^\.\/+/, "");
}

function runGit(args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
  } catch (error) {
    fail(`git ${args.join(" ")}: ${error.message}`);
  }
}

function readJson(file) {
  if (!fs.existsSync(file)) {
    fail(`required file missing: ${file}`);
  }

  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), {
    recursive: true,
  });

  fs.writeFileSync(
    file,
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

function extractPaths(value, output = new Set()) {
  if (typeof value === "string") {
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      extractPaths(item, output);
    }

    return output;
  }

  if (!value || typeof value !== "object") {
    return output;
  }

  const pathKeys = new Set([
    "path",
    "file",
    "source",
    "module",
    "sourceFile",
    "sourcePath",
    "filePath",
    "modulePath",
    "assetPath",
    "componentPath",
    "implementation",
    "implementationPath",
    "runtimePath",
    "entrypoint",
  ]);

  const pathArrayKeys = new Set([
    "paths",
    "files",
    "sources",
    "modules",
    "sourceFiles",
    "sourcePaths",
    "filePaths",
    "implementationPaths",
    "runtimePaths",
    "entrypoints",
  ]);

  for (const [key, nested] of Object.entries(value)) {
    if (
      pathKeys.has(key) &&
      typeof nested === "string"
    ) {
      output.add(posix(nested));
      continue;
    }

    if (
      pathArrayKeys.has(key) &&
      Array.isArray(nested)
    ) {
      for (const item of nested) {
        if (typeof item === "string") {
          output.add(posix(item));
        } else {
          extractPaths(item, output);
        }
      }

      continue;
    }

    extractPaths(nested, output);
  }

  return output;
}

function isCanonicalPath(file) {
  const normalized = posix(file);

  if (!normalized) {
    return false;
  }

  if (EXACT_ALLOWED_FILES.has(normalized)) {
    return true;
  }

  return CANONICAL_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix),
  );
}

function hasExcludedSegment(file) {
  const normalized = posix(file);
  const segments = normalized.split("/");

  return segments.some((segment) =>
    EXCLUDED_SEGMENTS.has(segment.toLowerCase()),
  );
}

function pathDecision(file, trackedFiles) {
  const normalized = posix(file);

  if (!normalized) {
    return {
      accepted: false,
      reason: "empty_path",
    };
  }

  if (!trackedFiles.has(normalized)) {
    return {
      accepted: false,
      reason: "untracked",
    };
  }

  if (!isCanonicalPath(normalized)) {
    return {
      accepted: false,
      reason: "outside_canonical_roots",
    };
  }

  if (hasExcludedSegment(normalized)) {
    return {
      accepted: false,
      reason: "excluded_directory_class",
    };
  }

  if (EXCLUDED_FILE_PATTERN.test(normalized)) {
    return {
      accepted: false,
      reason: "excluded_file_class",
    };
  }

  return {
    accepted: true,
    reason: "canonical_tracked_source",
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function candidateIdentity(groupName, candidate) {
  const paths = [...extractPaths(candidate)]
    .map(posix)
    .sort();

  const identifier =
    candidate?.id ??
    candidate?.identifier ??
    candidate?.name ??
    candidate?.route ??
    candidate?.path ??
    candidate?.method ??
    "";

  const method = candidate?.method ?? "";
  const route =
    candidate?.route ??
    candidate?.routePath ??
    candidate?.url ??
    "";

  return JSON.stringify({
    groupName,
    identifier,
    method,
    route,
    paths,
  });
}

function countCandidates(groups) {
  const result = {};

  for (const [name, values] of Object.entries(groups)) {
    result[name] = Array.isArray(values)
      ? values.length
      : 0;
  }

  return result;
}

const artifact = readJson(INPUT);
const diagnostic = readJson(DIAGNOSTIC_INPUT);

if (
  artifact.artifactType !==
  "registry_candidate_inventory"
) {
  fail(
    `unexpected input artifact type: ${artifact.artifactType}`,
  );
}

if (
  diagnostic.artifactType !==
  "registry_candidate_precision_diagnostic"
) {
  fail(
    `unexpected diagnostic artifact type: ${diagnostic.artifactType}`,
  );
}

const trackedFiles = new Set(
  runGit(["ls-files"])
    .split("\n")
    .map((value) => posix(value.trim()))
    .filter(Boolean),
);

const sourceGroups =
  artifact.candidates &&
  typeof artifact.candidates === "object"
    ? artifact.candidates
    : {};

const filteredGroups = {};
const rejectedGroups = {};
const groupStats = {};

for (const [groupName, candidatesValue] of Object.entries(
  sourceGroups,
)) {
  const candidates = Array.isArray(candidatesValue)
    ? candidatesValue
    : [];

  const accepted = [];
  const rejected = [];
  const seen = new Set();

  for (const candidate of candidates) {
    const paths = [...extractPaths(candidate)]
      .map(posix)
      .filter(Boolean);

    // Capabilities can be declared concepts and may not have
    // implementation paths yet. Preserve them for later mapping.
    const isCapabilityGroup =
      groupName.toLowerCase().includes("capabil");

    if (paths.length === 0) {
      if (isCapabilityGroup) {
        const identity = candidateIdentity(
          groupName,
          candidate,
        );

        if (!seen.has(identity)) {
          seen.add(identity);
          accepted.push(clone(candidate));
        }

        continue;
      }

      rejected.push({
        candidate: clone(candidate),
        reasons: ["no_detectable_implementation_path"],
        paths: [],
      });

      continue;
    }

    const decisions = paths.map((file) => ({
      file,
      ...pathDecision(file, trackedFiles),
    }));

    const acceptedPaths = decisions
      .filter((decision) => decision.accepted)
      .map((decision) => decision.file);

    const rejectedPaths = decisions.filter(
      (decision) => !decision.accepted,
    );

    if (acceptedPaths.length === 0) {
      rejected.push({
        candidate: clone(candidate),
        reasons: [
          ...new Set(
            rejectedPaths.map(
              (decision) => decision.reason,
            ),
          ),
        ],
        paths: decisions,
      });

      continue;
    }

    const retained = clone(candidate);

    retained._canonicalFilter = {
      acceptedImplementationPaths: [
        ...new Set(acceptedPaths),
      ].sort(),
      rejectedImplementationPaths:
        rejectedPaths.sort((a, b) =>
          a.file.localeCompare(b.file),
        ),
      evidenceStatus:
        rejectedPaths.length === 0
          ? "CANONICAL_TRACKED"
          : "CANONICAL_TRACKED_WITH_REJECTED_REFERENCES",
    };

    const identity = candidateIdentity(
      groupName,
      retained,
    );

    if (seen.has(identity)) {
      rejected.push({
        candidate: retained,
        reasons: ["duplicate_candidate_identity"],
        paths: decisions,
      });

      continue;
    }

    seen.add(identity);
    accepted.push(retained);
  }

  filteredGroups[groupName] = accepted;
  rejectedGroups[groupName] = rejected;

  groupStats[groupName] = {
    inputCandidates: candidates.length,
    acceptedCandidates: accepted.length,
    rejectedCandidates: rejected.length,
    reduction:
      candidates.length - accepted.length,
    reductionPercent:
      candidates.length === 0
        ? 0
        : Number(
            (
              ((candidates.length -
                accepted.length) /
                candidates.length) *
              100
            ).toFixed(2),
          ),
  };
}

const inputCounts = countCandidates(sourceGroups);
const filteredCounts = countCandidates(filteredGroups);

const filteredArtifact = {
  schemaVersion: "1.0.0",
  artifactType:
    "registry_candidate_inventory_canonical_filtered",
  status: "FILTERED_REVIEW_REQUIRED",
  authoritative: false,
  generatedAt: new Date().toISOString(),
  sourceArtifact: INPUT,
  diagnosticArtifact: DIAGNOSTIC_INPUT,
  repository: {
    branch: runGit(["branch", "--show-current"]),
    commit: runGit(["rev-parse", "HEAD"]),
    trackedFileCount: trackedFiles.size,
  },
  policy: {
    sourceBoundary: "git_tracked_files_only",
    canonicalPrefixes: CANONICAL_PREFIXES,
    exactAllowedFiles: [...EXACT_ALLOWED_FILES].sort(),
    excludedDirectorySegments: [
      ...EXCLUDED_SEGMENTS,
    ].sort(),
    excludesTests: true,
    excludesBackups: true,
    excludesGeneratedOutputs: true,
    modifiesAuthoritativeRegistries: false,
  },
  summary: {
    inputCounts,
    filteredCounts,
    groupStats,
  },
  candidates: filteredGroups,
  decision: {
    status:
      "BLOCK_REGISTRY_IMPORT_PENDING_RUNTIME_VALIDATION",
    reason:
      "Canonical filtering reduces discovery noise but does not prove runtime mounting, reachability, ownership, safety approval, or production use.",
    nextPhase:
      "Validate canonical route declarations and mounted runtime routes.",
  },
};

const reviewArtifact = {
  schemaVersion: "1.0.0",
  artifactType:
    "registry_candidate_filter_review",
  status: "MANUAL_REVIEW_REQUIRED",
  authoritative: false,
  generatedAt:
    filteredArtifact.generatedAt,
  sourceArtifact: INPUT,
  filteredArtifact: OUTPUT,
  summary: {
    inputCounts,
    filteredCounts,
    groupStats,
  },
  rejectedCandidates: rejectedGroups,
};

writeJson(OUTPUT, filteredArtifact);
writeJson(REVIEW_OUTPUT, reviewArtifact);

console.log(
  "==============================================",
);
console.log(
  "CANONICAL REGISTRY CANDIDATE FILTER SUMMARY",
);
console.log(
  "==============================================",
);

for (const [groupName, stats] of Object.entries(
  groupStats,
)) {
  console.log(
    `${groupName}: input=${stats.inputCandidates}, accepted=${stats.acceptedCandidates}, rejected=${stats.rejectedCandidates}, reduction=${stats.reductionPercent}%`,
  );
}

console.log(
  "\nAuthoritative registries modified: NO",
);

console.log(
  "Decision:",
  filteredArtifact.decision.status,
);

console.log("Filtered output:", OUTPUT);
console.log("Review output:", REVIEW_OUTPUT);

console.log(
  "REGISTRY_CANONICAL_CANDIDATE_FILTER_PASS",
);

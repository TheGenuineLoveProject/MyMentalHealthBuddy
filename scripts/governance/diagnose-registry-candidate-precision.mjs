#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

const INPUT =
  "artifacts/governance/registry-candidate-inventory.json";

const OUTPUT =
  "artifacts/governance/registry-candidate-precision-diagnostic.json";

function toPosix(value) {
  return value.split(path.sep).join("/");
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
    console.error(
      `FAIL git ${args.join(" ")}:`,
      error.message,
    );
    process.exit(1);
  }
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function mapToSortedRecords(map, limit = null) {
  const records = [...map.entries()]
    .map(([key, count]) => ({
      key,
      count,
    }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.key.localeCompare(b.key),
    );

  return limit ? records.slice(0, limit) : records;
}

function topDirectory(filePath, depth = 3) {
  const parts = toPosix(filePath)
    .split("/")
    .filter(Boolean);

  return parts.slice(0, depth).join("/") || ".";
}

function candidatePaths(candidate) {
  const values = [];

  if (typeof candidate?.implementationPath === "string") {
    values.push(candidate.implementationPath);
  }

  if (Array.isArray(candidate?.implementationPaths)) {
    values.push(...candidate.implementationPaths);
  }

  return values
    .filter((value) => typeof value === "string")
    .map(toPosix);
}

function classifyPath(filePath) {
  const normalized = toPosix(filePath).toLowerCase();

  const classifications = [];

  const rules = [
    [
      "backup",
      /(^|\/)(backup|backups|bak|old|previous|copy|copies)(\/|$)|\.(bak|backup|old)(\.|$)|backup[-_.]/,
    ],
    [
      "test",
      /(^|\/)(__tests__|tests?|specs?|test-utils|fixtures?)(\/|$)|\.(test|spec)\.[cm]?[jt]sx?$/,
    ],
    [
      "story",
      /(^|\/)stories(\/|$)|\.stories?\.[cm]?[jt]sx?$/,
    ],
    [
      "archive",
      /(^|\/)(archive|archived|deprecated|legacy)(\/|$)/,
    ],
    [
      "generated",
      /(^|\/)(generated|codegen|dist|build|coverage|artifacts?|tmp|temp)(\/|$)/,
    ],
    [
      "example",
      /(^|\/)(examples?|samples?|demos?|playground)(\/|$)/,
    ],
    [
      "migration",
      /(^|\/)(migrations?|drizzle)(\/|$)/,
    ],
    [
      "script",
      /(^|\/)scripts(\/|$)/,
    ],
    [
      "documentation",
      /(^|\/)docs?(\/|$)|\.mdx?$/,
    ],
  ];

  for (const [classification, pattern] of rules) {
    if (pattern.test(normalized)) {
      classifications.push(classification);
    }
  }

  if (classifications.length === 0) {
    classifications.push("unclassified");
  }

  return classifications;
}

if (!fs.existsSync(INPUT)) {
  console.error("FAIL candidate inventory missing:", INPUT);
  process.exit(1);
}

let artifact;

try {
  artifact = JSON.parse(
    fs.readFileSync(INPUT, "utf8"),
  );
} catch (error) {
  console.error(
    "FAIL candidate inventory is not valid JSON:",
    error.message,
  );
  process.exit(1);
}

if (
  artifact.artifactType !==
  "registry_candidate_inventory"
) {
  console.error(
    "FAIL unexpected artifact type:",
    artifact.artifactType,
  );
  process.exit(1);
}

const trackedFiles = runGit(["ls-files"])
  .split("\n")
  .map((value) => value.trim())
  .filter(Boolean)
  .map(toPosix);

const trackedSet = new Set(trackedFiles);

const trackedSourceExtensions =
  /\.(?:js|jsx|mjs|cjs|ts|tsx)$/i;

const trackedSourceFiles = trackedFiles.filter((file) =>
  trackedSourceExtensions.test(file),
);

const groups = {
  clientRoutes:
    artifact.candidates?.clientRoutes || [],
  serverRoutes:
    artifact.candidates?.serverRoutes || [],
  components:
    artifact.candidates?.components || [],
  assets:
    artifact.candidates?.assets || [],
  promptFiles:
    artifact.candidates?.promptFiles || [],
  capabilities:
    artifact.candidates?.capabilities || [],
};

const pathFrequency = new Map();
const directoryFrequency = new Map();
const classificationFrequency = new Map();
const groupDiagnostics = {};
const allDiscoveredPaths = new Set();
const untrackedCandidatePaths = new Set();

for (const [groupName, candidates] of Object.entries(groups)) {
  const groupDirectoryFrequency = new Map();
  const groupClassificationFrequency = new Map();
  const groupPaths = new Set();
  const groupUntracked = new Set();

  for (const candidate of candidates) {
    for (const filePath of candidatePaths(candidate)) {
      groupPaths.add(filePath);
      allDiscoveredPaths.add(filePath);

      increment(pathFrequency, filePath);
      increment(
        directoryFrequency,
        topDirectory(filePath),
      );
      increment(
        groupDirectoryFrequency,
        topDirectory(filePath),
      );

      for (const classification of classifyPath(filePath)) {
        increment(
          classificationFrequency,
          classification,
        );
        increment(
          groupClassificationFrequency,
          classification,
        );
      }

      if (!trackedSet.has(filePath)) {
        groupUntracked.add(filePath);
        untrackedCandidatePaths.add(filePath);
      }
    }
  }

  groupDiagnostics[groupName] = {
    candidateCount: candidates.length,
    uniqueImplementationPathCount: groupPaths.size,
    untrackedImplementationPathCount:
      groupUntracked.size,
    topDirectories: mapToSortedRecords(
      groupDirectoryFrequency,
      30,
    ),
    pathClassifications: mapToSortedRecords(
      groupClassificationFrequency,
    ),
    untrackedImplementationPathExamples: [
      ...groupUntracked,
    ]
      .sort()
      .slice(0, 100),
  };
}

function routeKey(candidate) {
  const layer =
    candidate.layer ||
    (candidate.method ? "server" : "client");

  const method = candidate.method || "NONE";
  const route = candidate.route || "UNKNOWN";

  return `${layer}:${method}:${route}`;
}

const allRouteCandidates = [
  ...groups.clientRoutes,
  ...groups.serverRoutes,
];

const routeFrequency = new Map();
const routePathFanout = new Map();

for (const candidate of allRouteCandidates) {
  const key = routeKey(candidate);

  increment(routeFrequency, key);

  const paths = candidatePaths(candidate);
  routePathFanout.set(
    key,
    Math.max(
      routePathFanout.get(key) || 0,
      paths.length,
    ),
  );
}

const duplicatedRouteKeys = mapToSortedRecords(
  new Map(
    [...routeFrequency.entries()].filter(
      ([, count]) => count > 1,
    ),
  ),
);

const highFanoutRoutes = [...routePathFanout.entries()]
  .filter(([, pathCount]) => pathCount > 3)
  .map(([key, pathCount]) => ({
    key,
    pathCount,
  }))
  .sort(
    (a, b) =>
      b.pathCount - a.pathCount ||
      a.key.localeCompare(b.key),
  )
  .slice(0, 100);

const canonicalRoots = [
  "client/src/",
  "server/",
  "shared/",
];

const outsideCanonicalRoots = [
  ...allDiscoveredPaths,
]
  .filter(
    (file) =>
      !canonicalRoots.some((root) =>
        file.startsWith(root),
      ),
  )
  .sort();

const suspiciousPathRecords = [
  ...allDiscoveredPaths,
]
  .map((file) => ({
    file,
    classifications: classifyPath(file),
    tracked: trackedSet.has(file),
  }))
  .filter(
    (record) =>
      !record.classifications.includes(
        "unclassified",
      ) ||
      !record.tracked,
  )
  .sort((a, b) => a.file.localeCompare(b.file));

const diagnostic = {
  schemaVersion: "1.0.0",
  artifactType:
    "registry_candidate_precision_diagnostic",
  status: "DIAGNOSTIC_REVIEW_REQUIRED",
  authoritative: false,
  generatedAt: new Date().toISOString(),
  sourceArtifact: INPUT,
  repository: {
    branch: runGit(["branch", "--show-current"]),
    commit: runGit(["rev-parse", "HEAD"]),
    trackedFileCount: trackedFiles.length,
    trackedSourceFileCount:
      trackedSourceFiles.length,
  },
  discoveryComparison: {
    scannerReportedSourceFiles:
      artifact.summary?.sourceFilesEvaluated ??
      null,
    gitTrackedSourceFiles:
      trackedSourceFiles.length,
    sourceFileInflation:
      typeof artifact.summary
        ?.sourceFilesEvaluated === "number"
        ? artifact.summary.sourceFilesEvaluated -
          trackedSourceFiles.length
        : null,
    uniqueCandidateImplementationPaths:
      allDiscoveredPaths.size,
    untrackedCandidateImplementationPaths:
      untrackedCandidatePaths.size,
    candidatePathsOutsideCanonicalRoots:
      outsideCanonicalRoots.length,
  },
  groupDiagnostics,
  aggregate: {
    topDirectories: mapToSortedRecords(
      directoryFrequency,
      50,
    ),
    pathClassifications: mapToSortedRecords(
      classificationFrequency,
    ),
    mostRepeatedImplementationPaths:
      mapToSortedRecords(
        new Map(
          [...pathFrequency.entries()].filter(
            ([, count]) => count > 1,
          ),
        ),
        100,
      ),
    duplicatedRouteKeys,
    highFanoutRoutes,
    outsideCanonicalRootExamples:
      outsideCanonicalRoots.slice(0, 200),
    suspiciousPathExamples:
      suspiciousPathRecords.slice(0, 300),
  },
  decision: {
    status: "BLOCK_REGISTRY_IMPORT",
    reasons: [
      "Candidate counts exceed previously verified platform inventory.",
      "Repository discovery precision has not been established.",
      "Candidate existence does not prove runtime reachability.",
      "Authoritative registries must remain unchanged until canonical candidates are validated.",
    ],
    nextRequiredEvidence: [
      "Tracked-versus-untracked source comparison",
      "Candidate concentration by repository directory",
      "Backup, test, archive, generated, and example-file prevalence",
      "Duplicate and high-fanout route analysis",
      "Canonical application root confirmation",
    ],
  },
};

fs.writeFileSync(
  OUTPUT,
  `${JSON.stringify(diagnostic, null, 2)}\n`,
);

console.log("==========================================");
console.log("REGISTRY CANDIDATE PRECISION DIAGNOSTIC");
console.log("==========================================");
console.log(
  "Scanner-reported source files:",
  diagnostic.discoveryComparison
    .scannerReportedSourceFiles,
);
console.log(
  "Git-tracked source files:",
  diagnostic.discoveryComparison
    .gitTrackedSourceFiles,
);
console.log(
  "Source-file inflation:",
  diagnostic.discoveryComparison
    .sourceFileInflation,
);
console.log(
  "Unique candidate implementation paths:",
  diagnostic.discoveryComparison
    .uniqueCandidateImplementationPaths,
);
console.log(
  "Untracked candidate implementation paths:",
  diagnostic.discoveryComparison
    .untrackedCandidateImplementationPaths,
);
console.log(
  "Paths outside canonical roots:",
  diagnostic.discoveryComparison
    .candidatePathsOutsideCanonicalRoots,
);

console.log("\n--- candidate groups ---");

for (const [groupName, group] of Object.entries(
  groupDiagnostics,
)) {
  console.log(
    `${groupName}: candidates=${group.candidateCount}, paths=${group.uniqueImplementationPathCount}, untracked=${group.untrackedImplementationPathCount}`,
  );
}

console.log("\n--- path classifications ---");

for (const record of diagnostic.aggregate
  .pathClassifications) {
  console.log(`${record.key}: ${record.count}`);
}

console.log("\n--- highest-volume directories ---");

for (const record of diagnostic.aggregate
  .topDirectories.slice(0, 25)) {
  console.log(`${record.key}: ${record.count}`);
}

console.log(
  "\nDuplicate route keys:",
  diagnostic.aggregate.duplicatedRouteKeys.length,
);

console.log(
  "High-fanout routes:",
  diagnostic.aggregate.highFanoutRoutes.length,
);

console.log("Status:", diagnostic.status);
console.log("Decision:", diagnostic.decision.status);
console.log("Output:", OUTPUT);
console.log(
  "REGISTRY_CANDIDATE_PRECISION_DIAGNOSTIC_PASS",
);

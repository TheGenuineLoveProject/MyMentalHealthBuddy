import fs from "node:fs";
import { spawnSync } from "node:child_process";

const ADVISORY_ID = "GHSA-qwww-vcr4-c8h2";

const POLICY_SOURCE_PATH = "scripts/security/ci-production-audit-gate.mjs";

const EXACT_RSC_PATTERNS = [
  /unstable_[A-Za-z0-9_]*(?:RSC|rsc)/i,
  /react-server-dom-(?:webpack|vite|turbopack)/i,
  /createCallServer/i,
  /\bcallServer\b/,
  /decodeReply/i,
  /decodeAction/i,
  /decodeFormState/i,
  /createFromFetch/i,
  /createFromReadableStream/i,
];

const RSC_EXECUTION_PATTERNS = [
  /["']use server["']/i,
  /\bserverComponents\b/i,
  /\bserverActions\b/i,
  /\breact-server\b/i,
];

const SOURCE_EXTENSIONS =
  /\.(?:js|jsx|mjs|cjs|ts|tsx|json)$/i;

const EXCLUDED_SEGMENTS = new Set([
  "node_modules",
  ".git",
  ".local",
  "dist",
  "build",
  "coverage",
]);

function deny(reason, details = {}) {
  console.error("SECURITY_AUDIT_GATE=DENY");
  console.error(`SECURITY_AUDIT_REASON=${reason}`);

  for (const [key, value] of Object.entries(details)) {
    console.error(`${key}=${value}`);
  }

  process.exit(1);
}

function allow(reason, details = {}) {
  console.log("SECURITY_AUDIT_GATE=ALLOW");
  console.log(`SECURITY_AUDIT_REASON=${reason}`);

  for (const [key, value] of Object.entries(details)) {
    console.log(`${key}=${value}`);
  }

  process.exit(0);
}

function parseArgs(argv) {
  const result = {
    auditJson: null,
  };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--audit-json") {
      const value = argv[++i];

      if (!value) {
        deny("MISSING_AUDIT_JSON_PATH");
      }

      result.auditJson = value;
      continue;
    }

    deny("UNKNOWN_ARGUMENT", {
      ARGUMENT: argv[i],
    });
  }

  return result;
}

function loadAudit(path) {
  if (path) {
    try {
      return JSON.parse(
        fs.readFileSync(path, "utf8")
      );
    } catch {
      deny("INVALID_AUDIT_JSON");
    }
  }

  const result = spawnSync(
    "npm",
    [
      "audit",
      "--omit=dev",
      "--audit-level=high",
      "--json",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    }
  );

  if (![0, 1].includes(result.status)) {
    deny("NPM_AUDIT_EXECUTION_FAILURE", {
      AUDIT_EXIT_CODE:
        result.status === null
          ? "NULL"
          : result.status,
    });
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    deny("NPM_AUDIT_RETURNED_INVALID_JSON");
  }
}

function trackedFiles() {
  const result = spawnSync(
    "git",
    ["ls-files", "-z"],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    }
  );

  if (result.status !== 0) {
    deny("GIT_LS_FILES_FAILURE");
  }

  return result.stdout
    .split("\0")
    .filter(Boolean);
}

function eligible(path) {
  if (path === POLICY_SOURCE_PATH) {
    return false;
  }

  if (!SOURCE_EXTENSIONS.test(path)) {
    return false;
  }

  if (
    path.split("/")
      .some(part =>
        EXCLUDED_SEGMENTS.has(part)
      )
  ) {
    return false;
  }

  if (
    path.includes(".test.") ||
    path.includes(".spec.") ||
    path.includes(".stories.") ||
    path.includes("__tests__/")
  ) {
    return false;
  }

  return true;
}

function proveRscGuard() {
  let exactApiSignals = 0;
  let executionSignals = 0;

  for (const path of trackedFiles()) {
    if (!eligible(path)) {
      continue;
    }

    let data;

    try {
      data = fs.readFileSync(path, "utf8");
    } catch {
      deny("TRACKED_SOURCE_READ_FAILURE", {
        FILE: path,
      });
    }

    for (const regex of EXACT_RSC_PATTERNS) {
      regex.lastIndex = 0;

      if (regex.test(data)) {
        exactApiSignals++;
      }
    }

    for (const regex of RSC_EXECUTION_PATTERNS) {
      regex.lastIndex = 0;

      if (regex.test(data)) {
        executionSignals++;
      }
    }
  }

  return {
    pass:
      exactApiSignals === 0 &&
      executionSignals === 0,
    exactApiSignals,
    executionSignals,
  };
}

function validateAudit(audit) {
  if (
    !audit ||
    typeof audit !== "object" ||
    !audit.vulnerabilities ||
    typeof audit.vulnerabilities !== "object"
  ) {
    deny("AUDIT_SCHEMA_UNEXPECTED");
  }
}

function matchesTargetAdvisory(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  return [
    entry.url,
    entry.title,
    entry.name,
    entry.source,
  ]
    .filter(v =>
      v !== null &&
      v !== undefined
    )
    .map(String)
    .join(" ")
    .includes(ADVISORY_ID);
}

function leavesFor(
  audit,
  packageName,
  stack = []
) {
  if (stack.includes(packageName)) {
    deny("VULNERABILITY_GRAPH_CYCLE", {
      PACKAGE: packageName,
    });
  }

  const vulnerability =
    audit.vulnerabilities[packageName];

  if (
    !vulnerability ||
    typeof vulnerability !== "object"
  ) {
    deny("MISSING_VULNERABILITY_NODE", {
      PACKAGE: packageName,
    });
  }

  if (!Array.isArray(vulnerability.via)) {
    deny("VULNERABILITY_VIA_SCHEMA_UNEXPECTED", {
      PACKAGE: packageName,
    });
  }

  const leaves = [];

  for (const via of vulnerability.via) {
    if (typeof via === "string") {
      leaves.push(
        ...leavesFor(
          audit,
          via,
          [...stack, packageName]
        )
      );

      continue;
    }

    if (via && typeof via === "object") {
      leaves.push(via);
      continue;
    }

    deny("VULNERABILITY_VIA_ENTRY_UNEXPECTED", {
      PACKAGE: packageName,
    });
  }

  return leaves;
}

const args = parseArgs(
  process.argv.slice(2)
);

const audit = loadAudit(
  args.auditJson
);

validateAudit(audit);

const severe =
  new Set(["high", "critical"]);

const qualifying = Object.entries(
  audit.vulnerabilities
).filter(([, vulnerability]) =>
  severe.has(
    String(
      vulnerability?.severity || ""
    ).toLowerCase()
  )
);

if (qualifying.length === 0) {
  allow("NO_HIGH_OR_CRITICAL_FINDINGS", {
    HIGH_CRITICAL_PACKAGE_COUNT: 0,
  });
}

const permittedPackages =
  new Set([
    "react-router",
    "react-router-dom",
  ]);

let nonRouterPackages = 0;
let matchingLeaves = 0;
let unrelatedLeaves = 0;
let severeLeaves = 0;

for (const [packageName] of qualifying) {
  if (!permittedPackages.has(packageName)) {
    nonRouterPackages++;
  }

  const leaves =
    leavesFor(audit, packageName);

  if (leaves.length === 0) {
    deny(
      "HIGH_CRITICAL_FINDING_HAS_NO_CAUSAL_ADVISORY",
      {
        PACKAGE: packageName,
      }
    );
  }

  for (const advisory of leaves) {
    const severity =
      String(
        advisory?.severity || ""
      ).toLowerCase();

    if (!severe.has(severity)) {
      continue;
    }

    severeLeaves++;

    if (matchesTargetAdvisory(advisory)) {
      matchingLeaves++;
    } else {
      unrelatedLeaves++;
    }
  }
}

if (nonRouterPackages > 0) {
  deny(
    "NON_ROUTER_HIGH_CRITICAL_FINDING_PRESENT",
    {
      HIGH_CRITICAL_NON_ROUTER_PACKAGE_COUNT:
        nonRouterPackages,
    }
  );
}

if (severeLeaves === 0) {
  deny(
    "NO_HIGH_CRITICAL_CAUSAL_LEAF_ADVISORY"
  );
}

if (matchingLeaves === 0) {
  deny("TARGET_ADVISORY_NOT_PROVEN");
}

if (unrelatedLeaves > 0) {
  deny(
    "UNRELATED_HIGH_CRITICAL_ADVISORY_PRESENT",
    {
      UNRELATED_HIGH_CRITICAL_ADVISORY_COUNT:
        unrelatedLeaves,
    }
  );
}

const guard = proveRscGuard();

console.log(
  `RSC_EXACT_API_SIGNAL_COUNT=${guard.exactApiSignals}`
);

console.log(
  `RSC_EXECUTION_SIGNAL_COUNT=${guard.executionSignals}`
);

if (!guard.pass) {
  deny(
    "RSC_REACHABILITY_GUARD_NOT_PASS"
  );
}

allow(
  "EXACT_ROUTER_ADVISORY_ONLY_AND_RSC_GUARD_PASS",
  {
    EXCEPTION_ADVISORY: ADVISORY_ID,
    HIGH_CRITICAL_PACKAGE_COUNT:
      qualifying.length,
    HIGH_CRITICAL_LEAF_ADVISORY_COUNT:
      severeLeaves,
  }
);

#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const REPORT_PATH =
  "artifacts/governance/registry-repository-reconciliation.json";

const REGISTRY_CONTRACTS = [
  {
    file: "platform/registry/assets.json",
    kind: "policy_placeholder",
    expectedStatus: "registry_placeholder",
    requiredKeys: ["version", "status", "rule"],
  },
  {
    file: "platform/registry/prompts.json",
    kind: "policy_placeholder",
    expectedStatus: "registry_placeholder",
    requiredKeys: ["version", "status", "rule"],
  },
  {
    file: "platform/registry/routes.json",
    kind: "policy_placeholder",
    expectedStatus: "registry_placeholder",
    requiredKeys: ["version", "status", "rule"],
  },
  {
    file: "platform/registry/components.json",
    kind: "policy_placeholder",
    expectedStatus: "registry_placeholder",
    requiredKeys: ["version", "status", "rule"],
  },
  {
    file: "platform/registry/capabilities.json",
    kind: "string_catalog",
    collectionKey: "capabilities",
    requiredKeys: ["version", "capabilities"],
    minimumRecords: 1,
  },
];

function readJson(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return {
      ok: false,
      error: `missing registry: ${relativePath}`,
    };
  }

  try {
    return {
      ok: true,
      data: JSON.parse(fs.readFileSync(absolutePath, "utf8")),
    };
  } catch (error) {
    return {
      ok: false,
      error: `invalid JSON in ${relativePath}: ${error.message}`,
    };
  }
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRequiredKeys(document, contract) {
  const failures = [];

  if (
    !document ||
    typeof document !== "object" ||
    Array.isArray(document)
  ) {
    failures.push("top-level value must be an object");
    return failures;
  }

  for (const key of contract.requiredKeys || []) {
    if (!Object.prototype.hasOwnProperty.call(document, key)) {
      failures.push(`missing required key "${key}"`);
    }
  }

  return failures;
}

function validatePolicyPlaceholder(document, contract) {
  const failures = validateRequiredKeys(document, contract);

  if (!nonEmptyString(document.version)) {
    failures.push('key "version" must be a non-empty string');
  }

  if (document.status !== contract.expectedStatus) {
    failures.push(
      `key "status" must equal "${contract.expectedStatus}"`,
    );
  }

  if (!nonEmptyString(document.rule)) {
    failures.push('key "rule" must be a non-empty string');
  }

  return {
    failures,
    recordCount: 0,
    repositoryReferencesDeclared: false,
    result:
      failures.length === 0
        ? "POLICY_PLACEHOLDER_PASS"
        : "POLICY_PLACEHOLDER_FAIL",
  };
}

function validateStringCatalog(document, contract) {
  const failures = validateRequiredKeys(document, contract);
  const warnings = [];

  if (!nonEmptyString(document.version)) {
    failures.push('key "version" must be a non-empty string');
  }

  const collection = document[contract.collectionKey];

  if (!Array.isArray(collection)) {
    failures.push(
      `key "${contract.collectionKey}" must be an array`,
    );

    return {
      failures,
      warnings,
      recordCount: 0,
      repositoryReferencesDeclared: false,
      result: "CATALOG_FAIL",
      duplicates: [],
    };
  }

  if (collection.length < (contract.minimumRecords || 0)) {
    failures.push(
      `key "${contract.collectionKey}" must contain at least ` +
        `${contract.minimumRecords} record(s)`,
    );
  }

  const normalized = [];
  const duplicates = [];
  const seen = new Map();

  collection.forEach((entry, index) => {
    if (!nonEmptyString(entry)) {
      failures.push(
        `${contract.collectionKey}[${index}] must be a non-empty string`,
      );
      return;
    }

    const value = entry.trim();
    const key = value.toLowerCase();

    if (!/^[a-z][a-z0-9_]*$/.test(value)) {
      warnings.push(
        `${contract.collectionKey}[${index}] is not snake_case: ${value}`,
      );
    }

    if (seen.has(key)) {
      duplicates.push({
        value,
        firstIndex: seen.get(key),
        duplicateIndex: index,
      });
    } else {
      seen.set(key, index);
    }

    normalized.push(value);
  });

  if (duplicates.length > 0) {
    failures.push(
      `${duplicates.length} duplicate catalog identifier(s) found`,
    );
  }

  return {
    failures,
    warnings,
    recordCount: normalized.length,
    repositoryReferencesDeclared: false,
    result:
      failures.length === 0
        ? "CATALOG_PASS"
        : "CATALOG_FAIL",
    duplicates,
  };
}

const startedAt = new Date().toISOString();

const report = {
  schemaVersion: "2.0.0",
  audit: "registry-contract-classification-and-reconciliation",
  startedAt,
  completedAt: null,
  repositoryRoot: ROOT,
  registryContracts: [],
  failures: [],
  warnings: [],
  repositoryBackedRegistryCount: 0,
  repositoryReferencesEvaluated: 0,
  existingReferences: [],
  missingReferences: [],
  repositoryReconciliationStatus: "NOT_DECLARED",
  summary: {},
  notes: [
    "Placeholder policy registries are validated as policy declarations.",
    "String catalogs are validated for type, identity format, and duplicates.",
    "Repository reconciliation is not claimed unless an authoritative repository-backed registry exists.",
    "Candidate inventory artifacts are diagnostic and non-authoritative.",
  ],
};

console.log("================================================");
console.log("REGISTRY CONTRACT CLASSIFICATION START");
console.log("================================================");

for (const contract of REGISTRY_CONTRACTS) {
  console.log(`\n--- ${contract.file} ---`);
  console.log(`INFO contract kind: ${contract.kind}`);

  const readResult = readJson(contract.file);

  if (!readResult.ok) {
    console.error(`FAIL ${readResult.error}`);

    report.failures.push({
      file: contract.file,
      error: readResult.error,
    });

    report.registryContracts.push({
      file: contract.file,
      kind: contract.kind,
      status: "READ_FAIL",
      failures: [readResult.error],
    });

    continue;
  }

  let result;

  if (contract.kind === "policy_placeholder") {
    result = validatePolicyPlaceholder(
      readResult.data,
      contract,
    );
  } else if (contract.kind === "string_catalog") {
    result = validateStringCatalog(
      readResult.data,
      contract,
    );
  } else {
    result = {
      failures: [`unsupported registry contract kind: ${contract.kind}`],
      warnings: [],
      recordCount: 0,
      repositoryReferencesDeclared: false,
      result: "UNSUPPORTED_CONTRACT",
    };
  }

  const contractReport = {
    file: contract.file,
    kind: contract.kind,
    status: result.result,
    recordCount: result.recordCount,
    repositoryReferencesDeclared:
      result.repositoryReferencesDeclared,
    failures: result.failures || [],
    warnings: result.warnings || [],
    duplicates: result.duplicates || [],
  };

  report.registryContracts.push(contractReport);

  for (const warning of contractReport.warnings) {
    report.warnings.push({
      file: contract.file,
      warning,
    });
  }

  if (contractReport.failures.length > 0) {
    for (const failure of contractReport.failures) {
      console.error(`FAIL ${failure}`);

      report.failures.push({
        file: contract.file,
        error: failure,
      });
    }
  } else {
    console.log(`PASS ${contractReport.status}`);
    console.log(
      `INFO records evaluated: ${contractReport.recordCount}`,
    );
  }
}

report.completedAt = new Date().toISOString();

report.summary = {
  registriesExpected: REGISTRY_CONTRACTS.length,
  registriesEvaluated: report.registryContracts.length,
  policyPlaceholderRegistries:
    report.registryContracts.filter(
      (entry) => entry.kind === "policy_placeholder",
    ).length,
  catalogRegistries:
    report.registryContracts.filter(
      (entry) => entry.kind === "string_catalog",
    ).length,
  repositoryBackedRegistries:
    report.repositoryBackedRegistryCount,
  repositoryReferencesEvaluated:
    report.repositoryReferencesEvaluated,
  failures: report.failures.length,
  warnings: report.warnings.length,
};

fs.mkdirSync(
  path.dirname(path.resolve(ROOT, REPORT_PATH)),
  { recursive: true },
);

fs.writeFileSync(
  path.resolve(ROOT, REPORT_PATH),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log("\n================================================");
console.log("REGISTRY CONTRACT CLASSIFICATION SUMMARY");
console.log("================================================");
console.log(
  `Registries expected: ${report.summary.registriesExpected}`,
);
console.log(
  `Registries evaluated: ${report.summary.registriesEvaluated}`,
);
console.log(
  `Policy placeholders: ${report.summary.policyPlaceholderRegistries}`,
);
console.log(
  `Catalog registries: ${report.summary.catalogRegistries}`,
);
console.log(
  `Repository-backed registries: ${report.summary.repositoryBackedRegistries}`,
);
console.log(
  `Repository references evaluated: ${report.summary.repositoryReferencesEvaluated}`,
);
console.log(
  `Repository reconciliation: ${report.repositoryReconciliationStatus}`,
);
console.log(`Warnings: ${report.summary.warnings}`);
console.log(`Failures: ${report.summary.failures}`);
console.log(`Evidence report: ${REPORT_PATH}`);

if (report.failures.length > 0) {
  console.error("REGISTRY_CONTRACT_CLASSIFICATION_FAIL");
  process.exit(1);
}

console.log("REGISTRY_POLICY_AND_CATALOG_VERIFY_PASS");
console.log("REPOSITORY_RECONCILIATION_NOT_DECLARED");

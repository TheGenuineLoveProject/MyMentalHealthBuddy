#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const registryFiles = [
  "platform/registry/assets.json",
  "platform/registry/prompts.json",
  "platform/registry/routes.json",
  "platform/registry/components.json",
  "platform/registry/capabilities.json",
];

const candidateCollectionKeys = [
  "items",
  "entries",
  "records",
  "assets",
  "prompts",
  "routes",
  "components",
  "capabilities",
];

const candidateIdentityKeys = [
  "id",
  "key",
  "name",
  "slug",
  "path",
  "route",
  "capabilityId",
  "componentId",
  "promptId",
  "assetId",
];

const failures = [];
const warnings = [];
const reports = [];

function describeType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function getCollection(document) {
  if (Array.isArray(document)) {
    return {
      source: "$",
      records: document,
    };
  }

  if (!document || typeof document !== "object") {
    return {
      source: null,
      records: [],
    };
  }

  for (const key of candidateCollectionKeys) {
    if (Array.isArray(document[key])) {
      return {
        source: `$.${key}`,
        records: document[key],
      };
    }
  }

  const arrayEntries = Object.entries(document).filter(([, value]) =>
    Array.isArray(value),
  );

  if (arrayEntries.length === 1) {
    return {
      source: `$.${arrayEntries[0][0]}`,
      records: arrayEntries[0][1],
    };
  }

  return {
    source: null,
    records: [],
  };
}

function findIdentity(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }

  for (const key of candidateIdentityKeys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return {
        key,
        value: value.trim(),
      };
    }
  }

  return null;
}

function inspectString(value, location, file) {
  if (value.includes("\0")) {
    failures.push(`${file}: null byte found at ${location}`);
  }

  if (value.includes("../") || value.includes("..\\")) {
    warnings.push(`${file}: path traversal-like value at ${location}`);
  }

  if (
    /^\/(?!\/)/.test(value) &&
    !location.toLowerCase().includes("route") &&
    !location.toLowerCase().includes("path")
  ) {
    warnings.push(`${file}: absolute-path-like value at ${location}`);
  }
}

function walk(value, location, file, depth = 0) {
  if (depth > 20) {
    warnings.push(`${file}: inspection depth exceeded at ${location}`);
    return;
  }

  if (typeof value === "string") {
    inspectString(value, location, file);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      walk(entry, `${location}[${index}]`, file, depth + 1),
    );
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      walk(entry, `${location}.${key}`, file, depth + 1);
    }
  }
}

for (const file of registryFiles) {
  console.log(`\n--- auditing ${file} ---`);

  if (!fs.existsSync(file)) {
    failures.push(`${file}: missing`);
    console.error(`FAIL missing registry: ${file}`);
    continue;
  }

  let document;

  try {
    document = JSON.parse(fs.readFileSync(file, "utf8"));
    console.log(`PASS valid JSON: ${file}`);
  } catch (error) {
    failures.push(`${file}: invalid JSON: ${error.message}`);
    console.error(`FAIL invalid JSON: ${file}`);
    continue;
  }

  const topLevelType = describeType(document);
  const topLevelKeys =
    document && typeof document === "object" && !Array.isArray(document)
      ? Object.keys(document).sort()
      : [];

  const collection = getCollection(document);
  const records = collection.records;
  const duplicateMap = new Map();
  const duplicateIdentities = [];
  const missingIdentities = [];

  records.forEach((record, index) => {
    const identity = findIdentity(record);

    if (!identity) {
      missingIdentities.push(index);
      return;
    }

    const normalized = `${identity.key}:${identity.value}`.toLowerCase();

    if (duplicateMap.has(normalized)) {
      duplicateIdentities.push({
        identity: `${identity.key}:${identity.value}`,
        firstIndex: duplicateMap.get(normalized),
        duplicateIndex: index,
      });
    } else {
      duplicateMap.set(normalized, index);
    }
  });

  walk(document, "$", file);

  const report = {
    file,
    fileName: path.basename(file),
    topLevelType,
    topLevelKeys,
    collectionLocation: collection.source,
    recordCount: records.length,
    duplicateIdentities,
    missingIdentityCount: missingIdentities.length,
    missingIdentityIndexes: missingIdentities.slice(0, 20),
  };

  reports.push(report);

  console.log(`PASS top-level type: ${topLevelType}`);
  console.log(
    `INFO top-level keys: ${
      topLevelKeys.length > 0 ? topLevelKeys.join(", ") : "(none)"
    }`,
  );
  console.log(
    `INFO collection location: ${collection.source ?? "(not automatically detected)"}`,
  );
  console.log(`INFO record count: ${records.length}`);

  if (duplicateIdentities.length > 0) {
    failures.push(
      `${file}: ${duplicateIdentities.length} duplicate registry identities`,
    );

    for (const duplicate of duplicateIdentities) {
      console.error(
        `FAIL duplicate ${duplicate.identity} at indexes ` +
          `${duplicate.firstIndex} and ${duplicate.duplicateIndex}`,
      );
    }
  } else {
    console.log("PASS no duplicate identities detected");
  }

  if (missingIdentities.length > 0) {
    warnings.push(
      `${file}: ${missingIdentities.length} records have no recognized identity field`,
    );
    console.warn(
      `WARN records without recognized identity: ${missingIdentities.length}`,
    );
  } else if (records.length > 0) {
    console.log("PASS recognized identity found for every detected record");
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  auditVersion: "1.0.0",
  registryCount: registryFiles.length,
  reports,
  warnings,
  failures,
  status: failures.length === 0 ? "PASS" : "FAIL",
};

fs.mkdirSync("tmp/governance", { recursive: true });
fs.writeFileSync(
  "tmp/governance/registry-semantic-audit.json",
  `${JSON.stringify(output, null, 2)}\n`,
);

console.log("\n========================================");
console.log("REGISTRY SEMANTIC AUDIT SUMMARY");
console.log("========================================");
console.log(`Registry files evaluated: ${registryFiles.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Failures: ${failures.length}`);
console.log(
  "Artifact: tmp/governance/registry-semantic-audit.json",
);

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  console.error("REGISTRY_SEMANTIC_AUDIT_FAIL");
  process.exit(1);
}

console.log("REGISTRY_SEMANTIC_AUDIT_PASS");

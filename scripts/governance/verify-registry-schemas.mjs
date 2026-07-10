#!/usr/bin/env node

import fs from "node:fs";

const manifestFile =
  "platform/schemas/registry/manifest.json";

const failures = [];
const successes = [];

function actualType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (Number.isInteger(value)) return "integer";
  if (typeof value === "number") return "number";
  return typeof value;
}

function typeMatches(value, expectedType) {
  const found = actualType(value);

  if (expectedType === "number") {
    return found === "number" || found === "integer";
  }

  return found === expectedType;
}

function validate(value, schema, location, file) {
  if (!schema || typeof schema !== "object") {
    return;
  }

  if (Array.isArray(schema.anyOf)) {
    const optionResults = schema.anyOf.map((option) => {
      const localFailures = [];
      const originalLength = failures.length;

      validate(value, option, location, file);

      while (failures.length > originalLength) {
        localFailures.push(failures.pop());
      }

      return localFailures;
    });

    const passingOption = optionResults.find(
      (result) => result.length === 0,
    );

    if (!passingOption) {
      failures.push(
        `${file}: ${location} does not match any allowed schema`,
      );
    }

    return;
  }

  if (schema.type && !typeMatches(value, schema.type)) {
    failures.push(
      `${file}: ${location} expected ${schema.type}, ` +
        `found ${actualType(value)}`,
    );
    return;
  }

  if (
    schema.type === "object" &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const required = Array.isArray(schema.required)
      ? schema.required
      : [];

    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        failures.push(
          `${file}: ${location} missing required key "${key}"`,
        );
      }
    }

    const properties =
      schema.properties &&
      typeof schema.properties === "object"
        ? schema.properties
        : {};

    for (const [key, propertySchema] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        validate(
          value[key],
          propertySchema,
          `${location}.${key}`,
          file,
        );
      }
    }
  }

  if (schema.type === "array" && Array.isArray(value)) {
    if (schema.items && typeof schema.items === "object") {
      value.forEach((entry, index) => {
        validate(
          entry,
          schema.items,
          `${location}[${index}]`,
          file,
        );
      });
    }
  }
}

if (!fs.existsSync(manifestFile)) {
  console.error(`FAIL missing manifest: ${manifestFile}`);
  process.exit(1);
}

let manifest;

try {
  manifest = JSON.parse(
    fs.readFileSync(manifestFile, "utf8"),
  );
} catch (error) {
  console.error(
    `FAIL invalid schema manifest: ${error.message}`,
  );
  process.exit(1);
}

if (!Array.isArray(manifest.schemas)) {
  console.error("FAIL manifest.schemas must be an array");
  process.exit(1);
}

for (const entry of manifest.schemas) {
  const registryFile = entry.registryFile;
  const schemaFile = entry.schemaFile;

  console.log(`\n--- validating ${registryFile} ---`);

  if (!fs.existsSync(registryFile)) {
    failures.push(`${registryFile}: registry missing`);
    continue;
  }

  if (!fs.existsSync(schemaFile)) {
    failures.push(`${schemaFile}: schema missing`);
    continue;
  }

  let registry;
  let schema;

  try {
    registry = JSON.parse(
      fs.readFileSync(registryFile, "utf8"),
    );
  } catch (error) {
    failures.push(
      `${registryFile}: invalid JSON: ${error.message}`,
    );
    continue;
  }

  try {
    schema = JSON.parse(
      fs.readFileSync(schemaFile, "utf8"),
    );
  } catch (error) {
    failures.push(
      `${schemaFile}: invalid JSON: ${error.message}`,
    );
    continue;
  }

  const failureCountBefore = failures.length;

  validate(registry, schema, "$", registryFile);

  if (failures.length === failureCountBefore) {
    successes.push(registryFile);
    console.log(
      `PASS registry matches generated schema: ${registryFile}`,
    );
  }
}

console.log("\n========================================");
console.log("REGISTRY SCHEMA VERIFICATION SUMMARY");
console.log("========================================");
console.log(`Schemas evaluated: ${manifest.schemas.length}`);
console.log(`Registries passed: ${successes.length}`);
console.log(`Failures: ${failures.length}`);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  console.error("REGISTRY_SCHEMA_VERIFY_FAIL");
  process.exit(1);
}

console.log("REGISTRY_SCHEMA_VERIFY_PASS");

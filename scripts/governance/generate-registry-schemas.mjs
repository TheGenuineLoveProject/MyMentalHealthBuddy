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

const schemaDirectory = "platform/schemas/registry";
const generatedSchemas = [];

function valueType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";

  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return Number.isInteger(value) ? "integer" : "number";
    case "boolean":
      return "boolean";
    case "object":
      return "object";
    default:
      return null;
  }
}

function uniqueSchemas(schemas) {
  const seen = new Set();
  const result = [];

  for (const schema of schemas) {
    const normalized = JSON.stringify(schema);

    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(schema);
    }
  }

  return result;
}

function inferArraySchema(values, depth) {
  if (values.length === 0) {
    return {
      type: "array",
      items: {},
    };
  }

  const itemSchemas = uniqueSchemas(
    values.map((value) => inferSchema(value, depth + 1)),
  );

  if (itemSchemas.length === 1) {
    return {
      type: "array",
      items: itemSchemas[0],
    };
  }

  return {
    type: "array",
    items: {
      anyOf: itemSchemas,
    },
  };
}

function inferObjectSchema(value, depth) {
  const properties = {};
  const required = [];

  for (const [key, entry] of Object.entries(value)) {
    properties[key] = inferSchema(entry, depth + 1);
    required.push(key);
  }

  return {
    type: "object",
    properties,
    required,
    additionalProperties: true,
  };
}

function inferSchema(value, depth = 0) {
  if (depth > 25) {
    return {};
  }

  const type = valueType(value);

  if (type === "array") {
    return inferArraySchema(value, depth);
  }

  if (type === "object") {
    return inferObjectSchema(value, depth);
  }

  if (type === "null") {
    return {
      type: "null",
    };
  }

  if (type) {
    return {
      type,
    };
  }

  return {};
}

function schemaTitle(file) {
  return path
    .basename(file, ".json")
    .split(/[-_]/g)
    .map((segment) =>
      segment.length > 0
        ? `${segment[0].toUpperCase()}${segment.slice(1)}`
        : segment,
    )
    .join(" ");
}

fs.mkdirSync(schemaDirectory, {
  recursive: true,
});

for (const registryFile of registryFiles) {
  console.log(`\n--- generating schema for ${registryFile} ---`);

  if (!fs.existsSync(registryFile)) {
    throw new Error(`Missing registry file: ${registryFile}`);
  }

  let document;

  try {
    document = JSON.parse(
      fs.readFileSync(registryFile, "utf8"),
    );
  } catch (error) {
    throw new Error(
      `Invalid JSON in ${registryFile}: ${error.message}`,
    );
  }

  const registryName = path.basename(registryFile, ".json");
  const outputFile =
    `${schemaDirectory}/${registryName}.schema.json`;

  const inferred = inferSchema(document);

  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://www.mymentalhealthbuddy.com/schemas/registry/${registryName}.schema.json`,
    title: `${schemaTitle(registryFile)} Registry`,
    description:
      `Generated structural compatibility schema for ${registryFile}. ` +
      "This schema preserves the currently observed registry shape and " +
      "does not by itself verify repository references or business meaning.",
    ...inferred,
    "x-registry-source": registryFile,
    "x-generation-mode": "observed-structure-compatible",
    "x-schema-version": "1.0.0",
  };

  fs.writeFileSync(
    outputFile,
    `${JSON.stringify(schema, null, 2)}\n`,
  );

  generatedSchemas.push({
    registryFile,
    schemaFile: outputFile,
    topLevelType: inferred.type ?? "unconstrained",
  });

  console.log(`PASS generated schema: ${outputFile}`);
  console.log(
    `INFO observed top-level type: ${inferred.type ?? "unconstrained"}`,
  );
}

const manifest = {
  schemaVersion: "1.0.0",
  generationMode: "observed-structure-compatible",
  generatedAt: new Date().toISOString(),
  schemas: generatedSchemas,
};

fs.writeFileSync(
  `${schemaDirectory}/manifest.json`,
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log("\n========================================");
console.log("REGISTRY SCHEMA GENERATION SUMMARY");
console.log("========================================");
console.log(`Schemas generated: ${generatedSchemas.length}`);
console.log(
  `Manifest: ${schemaDirectory}/manifest.json`,
);
console.log("REGISTRY_SCHEMA_GENERATION_PASS");

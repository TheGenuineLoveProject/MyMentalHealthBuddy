#!/usr/bin/env bash
set -e

echo "Scanning locked contract routes for duplicate method+path registrations..."

node - <<'NODE'
import fs from "fs";

const manifestPath = "docs/ROUTE_MANIFEST.json";

if (!fs.existsSync(manifestPath)) {
  console.error("ROUTE_MANIFEST.json missing");
  process.exit(1);
}

const routes = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const seen = new Set();
const duplicates = [];

for (const r of routes) {
  const key = `${r.method} ${r.path}`;
  if (seen.has(key)) {
    duplicates.push(key);
  } else {
    seen.add(key);
  }
}

if (duplicates.length > 0) {
  console.error("DUPLICATE_CONTRACT_ROUTES:");
  console.error(duplicates.join("\n"));
  process.exit(1);
}

console.log("NO_DUPLICATE_CONTRACT_ROUTES");
NODE

echo "PASS: locked contract route registry is unique"

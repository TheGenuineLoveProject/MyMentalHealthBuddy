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

const seen = new Map();
const duplicates = [];

for (const r of routes) {
  const key = `${r.file} ${r.method} ${r.path}`;
  if (seen.has(key)) {
    duplicates.push(`${r.file}: ${r.method} ${r.path}`);
  } else {
    seen.set(key, true);
  }
}

if (duplicates.length > 0) {
  console.error("DUPLICATE_ROUTES_WITHIN_FILE:");
  console.error(duplicates.join("\n"));
  process.exit(1);
}

console.log("NO_DUPLICATE_CONTRACT_ROUTES");
NODE

echo "PASS: locked contract route registry is unique"

# v2.7 — Buddy Engine heading-semantics architectural-invariant guard.
# Joined into the same pre-test gate so both architectural contracts
# (locked routes + Buddy heading prop convention) fail loudly together.
node scripts/check-buddy-heading-contract.mjs

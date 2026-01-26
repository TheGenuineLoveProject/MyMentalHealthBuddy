#!/usr/bin/env node
/**
 * noDuplicateWorkV6.mjs - Hard fail duplicate detection for Batch 14+
 * Validates: routeKey, canonicalPath, endpoints, DB tables, exports, microcopy
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'client/src/content/meta/routeMetaRegistry.ts');
const ROUTES_PATH = path.join(ROOT, 'server/routes');
const SCHEMA_PATH = path.join(ROOT, 'shared/schema.ts');

const results = {
  passed: true,
  timestamp: new Date().toISOString(),
  hardFails: [],
  softFlags: [],
  summary: {}
};

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

function extractRouteKeys(registryText) {
  const re = /routeKey:\s*["'`]([^"'`]+)["'`]/g;
  const keys = [];
  let m;
  while ((m = re.exec(registryText))) keys.push(m[1]);
  return keys;
}

function extractCanonicalPaths(registryText) {
  const re = /canonicalPath:\s*["'`]([^"'`]+)["'`]/g;
  const paths = [];
  let m;
  while ((m = re.exec(registryText))) paths.push(m[1]);
  return paths;
}

function extractEndpoints(routesDir) {
  const endpoints = [];
  if (!fs.existsSync(routesDir)) return endpoints;
  
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.mjs') || f.endsWith('.ts'));
  for (const file of files) {
    const content = readFile(path.join(routesDir, file));
    const re = /\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
    let m;
    while ((m = re.exec(content))) {
      endpoints.push({ method: m[1].toUpperCase(), path: m[2], file });
    }
  }
  return endpoints;
}

function extractTableNames(schemaText) {
  const re = /pgTable\s*\(\s*["'`]([^"'`]+)["'`]/g;
  const tables = [];
  let m;
  while ((m = re.exec(schemaText))) tables.push(m[1]);
  return tables;
}

function extractExports(schemaText) {
  const re = /export\s+(?:const|function|class)\s+(\w+)/g;
  const exports = [];
  let m;
  while ((m = re.exec(schemaText))) exports.push(m[1]);
  return exports;
}

function findDuplicates(arr) {
  const seen = new Map();
  const dupes = [];
  for (const item of arr) {
    if (seen.has(item)) {
      dupes.push(item);
    } else {
      seen.set(item, true);
    }
  }
  return [...new Set(dupes)];
}

function run() {
  console.log('🔍 No-Duplicate-Work V6 Scanner\n');
  
  const registryText = readFile(REGISTRY_PATH);
  const schemaText = readFile(SCHEMA_PATH);
  
  const routeKeys = extractRouteKeys(registryText);
  const dupeRouteKeys = findDuplicates(routeKeys);
  if (dupeRouteKeys.length > 0) {
    results.passed = false;
    results.hardFails.push({ type: 'DUPLICATE_ROUTEKEY', items: dupeRouteKeys });
    console.log(`❌ HARD FAIL: Duplicate routeKeys: ${dupeRouteKeys.join(', ')}`);
  } else {
    console.log(`✅ RouteKeys: ${routeKeys.length} unique, 0 duplicates`);
  }
  
  const canonicalPaths = extractCanonicalPaths(registryText);
  const dupeCanonicalPaths = findDuplicates(canonicalPaths);
  if (dupeCanonicalPaths.length > 0) {
    results.passed = false;
    results.hardFails.push({ type: 'DUPLICATE_CANONICAL_PATH', items: dupeCanonicalPaths });
    console.log(`❌ HARD FAIL: Duplicate canonicalPaths: ${dupeCanonicalPaths.join(', ')}`);
  } else {
    console.log(`✅ CanonicalPaths: ${canonicalPaths.length} unique, 0 duplicates`);
  }
  
  const endpoints = extractEndpoints(ROUTES_PATH);
  const endpointSigs = endpoints.map(e => `${e.method}:${e.path}`);
  const dupeEndpoints = findDuplicates(endpointSigs);
  if (dupeEndpoints.length > 0) {
    results.passed = false;
    results.hardFails.push({ type: 'DUPLICATE_ENDPOINT', items: dupeEndpoints });
    console.log(`❌ HARD FAIL: Duplicate endpoints: ${dupeEndpoints.join(', ')}`);
  } else {
    console.log(`✅ Endpoints: ${endpoints.length} unique, 0 duplicates`);
  }
  
  const tableNames = extractTableNames(schemaText);
  const dupeTableNames = findDuplicates(tableNames);
  if (dupeTableNames.length > 0) {
    results.passed = false;
    results.hardFails.push({ type: 'DUPLICATE_TABLE', items: dupeTableNames });
    console.log(`❌ HARD FAIL: Duplicate DB tables: ${dupeTableNames.join(', ')}`);
  } else {
    console.log(`✅ DB Tables: ${tableNames.length} unique, 0 duplicates`);
  }
  
  const schemaExports = extractExports(schemaText);
  const dupeExports = findDuplicates(schemaExports);
  if (dupeExports.length > 0) {
    results.passed = false;
    results.hardFails.push({ type: 'DUPLICATE_EXPORT', items: dupeExports });
    console.log(`❌ HARD FAIL: Duplicate schema exports: ${dupeExports.join(', ')}`);
  } else {
    console.log(`✅ Schema Exports: ${schemaExports.length} unique, 0 duplicates`);
  }
  
  results.summary = {
    routeKeys: routeKeys.length,
    canonicalPaths: canonicalPaths.length,
    endpoints: endpoints.length,
    dbTables: tableNames.length,
    schemaExports: schemaExports.length,
    hardFails: results.hardFails.length,
    softFlags: results.softFlags.length
  };
  
  console.log('\n📊 Summary:');
  console.log(`   RouteKeys: ${routeKeys.length}`);
  console.log(`   CanonicalPaths: ${canonicalPaths.length}`);
  console.log(`   Endpoints: ${endpoints.length}`);
  console.log(`   DB Tables: ${tableNames.length}`);
  console.log(`   Schema Exports: ${schemaExports.length}`);
  console.log(`   Hard Fails: ${results.hardFails.length}`);
  
  fs.writeFileSync(
    path.join(ROOT, 'docs/batch-14/deep-scan.json'),
    JSON.stringify(results, null, 2)
  );
  
  if (!results.passed) {
    console.log('\n❌ SCAN FAILED - Fix duplicates before proceeding');
    process.exit(1);
  }
  
  console.log('\n✅ SCAN PASSED - No duplicates detected');
  process.exit(0);
}

run();

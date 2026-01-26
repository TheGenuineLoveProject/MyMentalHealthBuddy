#!/usr/bin/env node
/**
 * scan-collisions.mjs - Detect competing implementations of the same feature
 * Catches duplicate work even when files aren't exact duplicates
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./_lib_walk.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "reports", "collisions");
const OUT_JSON = path.join(OUT_DIR, "latest.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function extractLikelyRouteStrings(text) {
  // Simple heuristic: catches app.get("/x"), router.post("/x"), etc.
  const re = /\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]\s*,/gi;
  const found = [];
  let m;
  while ((m = re.exec(text))) {
    found.push({ method: m[1].toUpperCase(), path: m[2] });
  }
  return found;
}

function extractLikelyTableNames(text) {
  // catches pgTable("users"), mysqlTable("users"), sqliteTable("users"), etc.
  const re = /(pgTable|mysqlTable|sqliteTable)\s*\(\s*["'`]([^"'`]+)["'`]\s*,/gi;
  const found = [];
  let m;
  while ((m = re.exec(text))) found.push(m[2]);
  return found;
}

function main() {
  ensureDir(OUT_DIR);

  const files = walkFiles(ROOT, { exts: [".ts", ".tsx", ".js", ".jsx", ".mjs"] });

  const routes = new Map();   // key: METHOD path -> [file]
  const tables = new Map();   // key: tableName -> [file]

  for (const f of files) {
    let text;
    try { text = fs.readFileSync(f, "utf8"); } catch { continue; }
    const rel = path.relative(ROOT, f);

    for (const r of extractLikelyRouteStrings(text)) {
      const key = `${r.method} ${r.path}`;
      if (!routes.has(key)) routes.set(key, []);
      routes.get(key).push(rel);
    }
    for (const t of extractLikelyTableNames(text)) {
      if (!tables.has(t)) tables.set(t, []);
      tables.get(t).push(rel);
    }
  }

  const routeCollisions = [...routes.entries()]
    .filter(([, list]) => list.length >= 2)
    .map(([key, files]) => ({ key, files: files.sort() }))
    .sort((a, b) => b.files.length - a.files.length);

  const tableCollisions = [...tables.entries()]
    .filter(([, list]) => list.length >= 2)
    .map(([name, files]) => ({ name, files: files.sort() }))
    .sort((a, b) => b.files.length - a.files.length);

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      scannedFiles: files.length,
      routeCollisions: routeCollisions.length,
      tableCollisions: tableCollisions.length,
    },
    routeCollisions,
    tableCollisions,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  console.log("scan-collisions:", report.totals);
  if (routeCollisions.length || tableCollisions.length) {
    console.log("scan-collisions: FAIL (collisions detected).");
    process.exitCode = 2;
  } else {
    console.log("scan-collisions: PASS.");
  }
}

main();
const SCAN_DIRS = ['server', 'client/src'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
const IGNORE_DIRS = ['node_modules', 'dist', 'build', '.git', 'coverage'];

const results = {
  endpoints: new Map(),
  authMiddlewares: [],
  stripeHandlers: [],
  openaiWrappers: [],
  schemaDefinitions: [],
  adminDashboards: [],
  collisions: [],
  timestamp: new Date().toISOString()
};

const PATTERNS = {
  endpoint: /(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi,
  authMiddleware: /(?:auth|authenticate|requireAuth|isAuthenticated|checkAuth)/gi,
  stripeWebhook: /(?:stripe\.webhooks|webhook.*stripe|handleStripeWebhook)/gi,
  openaiClient: /(?:new\s+OpenAI|openai\.chat|createChatCompletion|OpenAIApi)/gi,
  schema: /(?:pgTable|createTable|defineTable)\s*\(\s*["'`](\w+)["'`]/gi,
  adminDashboard: /(?:AdminDashboard|admin.*dashboard|dashboard.*admin)/gi
};

async function* walkDir(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (IGNORE_DIRS.includes(entry.name)) continue;
      
      if (entry.isDirectory()) {
        yield* walkDir(fullPath);
      } else if (entry.isFile() && EXTENSIONS.includes(extname(entry.name))) {
        yield fullPath;
      }
    }
  } catch (e) {
    // Skip inaccessible
  }
}

async function scanFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Scan for endpoints
    let match;
    const endpointRegex = /(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
    while ((match = endpointRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      const key = `${method} ${path}`;
      
      if (!results.endpoints.has(key)) {
        results.endpoints.set(key, []);
      }
      results.endpoints.get(key).push(filePath);
    }
    
    // Scan for auth middlewares
    if (PATTERNS.authMiddleware.test(content) && 
        (content.includes('export') || content.includes('module.exports')) &&
        filePath.includes('middleware')) {
      results.authMiddlewares.push(filePath);
    }
    
    // Scan for Stripe webhooks
    if (PATTERNS.stripeWebhook.test(content) && 
        (content.includes('export') || content.includes('module.exports'))) {
      results.stripeHandlers.push(filePath);
    }
    
    // Scan for OpenAI wrappers
    if (PATTERNS.openaiClient.test(content) && 
        (content.includes('export') || content.includes('module.exports')) &&
        !filePath.includes('node_modules')) {
      results.openaiWrappers.push(filePath);
    }
    
    // Scan for schema definitions
    const schemaRegex = /(?:pgTable|createTable)\s*\(\s*["'`](\w+)["'`]/gi;
    while ((match = schemaRegex.exec(content)) !== null) {
      results.schemaDefinitions.push({ table: match[1], file: filePath });
    }
    
    // Scan for admin dashboards
    if (PATTERNS.adminDashboard.test(content) && 
        filePath.includes('client') &&
        (content.includes('export') || content.includes('function'))) {
      results.adminDashboards.push(filePath);
    }
  } catch (e) {
    // Skip unreadable
  }
}

function detectCollisions() {
  // Endpoint collisions
  for (const [endpoint, files] of results.endpoints) {
    if (files.length > 1) {
      results.collisions.push({
        type: 'endpoint',
        name: endpoint,
        files,
        severity: 'high',
        suggestion: 'Consolidate to single route handler'
      });
    }
  }
  
  // Auth middleware collisions
  if (results.authMiddlewares.length > 1) {
    results.collisions.push({
      type: 'auth-middleware',
      name: 'Multiple auth middlewares',
      files: results.authMiddlewares,
      severity: 'medium',
      suggestion: 'Use single auth middleware, re-export from one location'
    });
  }
  
  // Stripe handler collisions
  if (results.stripeHandlers.length > 1) {
    results.collisions.push({
      type: 'stripe-webhook',
      name: 'Multiple Stripe webhook handlers',
      files: results.stripeHandlers,
      severity: 'high',
      suggestion: 'Consolidate to single webhook handler'
    });
  }
  
  // OpenAI wrapper collisions
  if (results.openaiWrappers.length > 1) {
    results.collisions.push({
      type: 'openai-wrapper',
      name: 'Multiple OpenAI client wrappers',
      files: results.openaiWrappers,
      severity: 'medium',
      suggestion: 'Use single AI client wrapper'
    });
  }
  
  // Schema collisions (same table defined multiple times)
  const tableMap = new Map();
  for (const { table, file } of results.schemaDefinitions) {
    if (!tableMap.has(table)) {
      tableMap.set(table, []);
    }
    tableMap.get(table).push(file);
  }
  
  for (const [table, files] of tableMap) {
    if (files.length > 1) {
      results.collisions.push({
        type: 'schema',
        name: `Table: ${table}`,
        files,
        severity: 'critical',
        suggestion: 'Single schema definition in shared/schema.ts'
      });
    }
  }
  
  // Admin dashboard collisions
  if (results.adminDashboards.length > 1) {
    results.collisions.push({
      type: 'admin-dashboard',
      name: 'Multiple admin dashboards',
      files: results.adminDashboards,
      severity: 'low',
      suggestion: 'May be intentional if different admin sections'
    });
  }
}

function generateMarkdown() {
  const lines = [
    '# Collision Scan Report',
    '',
    `**Timestamp**: ${results.timestamp}`,
    '',
    '## Summary',
    '',
    '| Type | Count |',
    '|------|-------|',
    `| Unique Endpoints | ${results.endpoints.size} |`,
    `| Auth Middlewares | ${results.authMiddlewares.length} |`,
    `| Stripe Handlers | ${results.stripeHandlers.length} |`,
    `| OpenAI Wrappers | ${results.openaiWrappers.length} |`,
    `| Schema Tables | ${results.schemaDefinitions.length} |`,
    `| Admin Dashboards | ${results.adminDashboards.length} |`,
    `| **Collisions Found** | ${results.collisions.length} |`,
    ''
  ];
  
  if (results.collisions.length > 0) {
    lines.push('## Collisions', '');
    
    for (const collision of results.collisions) {
      lines.push(
        `### ${collision.type}: ${collision.name}`,
        `**Severity**: ${collision.severity}`,
        '',
        'Files:',
        ...collision.files.map(f => `- \`${f}\``),
        '',
        `**Suggestion**: ${collision.suggestion}`,
        ''
      );
    }
  } else {
    lines.push('## No Collisions Detected', '', 'All implementations appear unique.');
  }
  
  lines.push('---', '', '_Generated by scan-collisions.mjs_');
  
  return lines.join('\n');
}

async function main() {
  console.log('🔍 Scanning for collisions...');
  
  for (const scanDir of SCAN_DIRS) {
    if (!existsSync(scanDir)) continue;
    for await (const filePath of walkDir(scanDir)) {
      await scanFile(filePath);
    }
  }
  
  detectCollisions();
  
  await mkdir('docs/duplicates', { recursive: true });
  
  const markdown = generateMarkdown();
  await writeFile('docs/duplicates/collisions-latest.md', markdown);
  
  const jsonOutput = {
    endpoints: Object.fromEntries(results.endpoints),
    authMiddlewares: results.authMiddlewares,
    stripeHandlers: results.stripeHandlers,
    openaiWrappers: results.openaiWrappers,
    schemaDefinitions: results.schemaDefinitions,
    adminDashboards: results.adminDashboards,
    collisions: results.collisions,
    timestamp: results.timestamp
  };
  await writeFile('docs/duplicates/collisions-latest.json', JSON.stringify(jsonOutput, null, 2));
  
  console.log(`✅ Collision scan complete`);
  console.log(`   Endpoints: ${results.endpoints.size}`);
  console.log(`   Collisions: ${results.collisions.length}`);
  
  if (results.collisions.length > 0) {
    console.log('\n⚠️  Collisions detected! Review docs/duplicates/collisions-latest.md');
  }
}

main().catch(console.error);

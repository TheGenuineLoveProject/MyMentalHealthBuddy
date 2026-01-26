#!/usr/bin/env node
/**
 * scan-architecture.mjs - Generate architecture registry maps
 * Maps endpoints, UI routes, and DB schema
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const results = {
  endpoints: [],
  uiRoutes: [],
  dbTables: [],
  timestamp: new Date().toISOString()
};

async function scanServerRoutes() {
  const routeFiles = [
    'server/routes.ts',
    'server/routes.mjs',
    'server/routes/index.mjs'
  ];
  
  for (const file of routeFiles) {
    if (!existsSync(file)) continue;
    
    try {
      const content = await readFile(file, 'utf-8');
      const regex = /(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        results.endpoints.push({
          method: match[1].toUpperCase(),
          path: match[2],
          file
        });
      }
    } catch (e) {
      // Skip
    }
  }
  
  // Scan routes directory
  if (existsSync('server/routes')) {
    const files = await readdir('server/routes');
    for (const file of files) {
      if (!file.endsWith('.mjs') && !file.endsWith('.ts')) continue;
      
      try {
        const filePath = join('server/routes', file);
        const content = await readFile(filePath, 'utf-8');
        const regex = /(?:router)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
        let match;
        
        while ((match = regex.exec(content)) !== null) {
          results.endpoints.push({
            method: match[1].toUpperCase(),
            path: match[2],
            file: filePath
          });
        }
      } catch (e) {
        // Skip
      }
    }
  }
}

async function scanUIRoutes() {
  const routeFiles = [
    'client/src/App.tsx',
    'client/src/App.jsx',
    'client/src/routes.tsx',
    'client/src/content/routes.js'
  ];
  
  for (const file of routeFiles) {
    if (!existsSync(file)) continue;
    
    try {
      const content = await readFile(file, 'utf-8');
      
      // Wouter Route pattern
      const routeRegex = /<Route\s+path=["'`]([^"'`]+)["'`]/gi;
      let match;
      
      while ((match = routeRegex.exec(content)) !== null) {
        results.uiRoutes.push({
          path: match[1],
          file
        });
      }
      
      // Route registry pattern
      const registryRegex = /routeKey:\s*["'`]([^"'`]+)["'`]/gi;
      while ((match = registryRegex.exec(content)) !== null) {
        results.uiRoutes.push({
          path: match[1],
          file,
          type: 'registry'
        });
      }
    } catch (e) {
      // Skip
    }
  }
}

async function scanDBSchema() {
  const schemaFiles = [
    'shared/schema.ts',
    'shared/schema.mjs',
    'server/db/schema.mjs'
  ];
  
  for (const file of schemaFiles) {
    if (!existsSync(file)) continue;
    
    try {
      const content = await readFile(file, 'utf-8');
      const regex = /(?:pgTable|createTable)\s*\(\s*["'`](\w+)["'`]/gi;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        results.dbTables.push({
          table: match[1],
          file
        });
      }
    } catch (e) {
      // Skip
    }
  }
}

async function writeRegistryFiles() {
  await mkdir('docs/registry', { recursive: true });
  
  // endpoints.md
  const endpointsMd = [
    '# API Endpoints Registry',
    '',
    `_Generated: ${results.timestamp}_`,
    '',
    '| Method | Path | File |',
    '|--------|------|------|',
    ...results.endpoints.map(e => `| ${e.method} | \`${e.path}\` | \`${e.file}\` |`),
    ''
  ].join('\n');
  await writeFile('docs/registry/endpoints.md', endpointsMd);
  
  // ui-routes.md
  const uiRoutesMd = [
    '# UI Routes Registry',
    '',
    `_Generated: ${results.timestamp}_`,
    '',
    '| Path | File | Type |',
    '|------|------|------|',
    ...results.uiRoutes.map(r => `| \`${r.path}\` | \`${r.file}\` | ${r.type || 'route'} |`),
    ''
  ].join('\n');
  await writeFile('docs/registry/ui-routes.md', uiRoutesMd);
  
  // db-schema.md
  const dbSchemaMd = [
    '# Database Schema Registry',
    '',
    `_Generated: ${results.timestamp}_`,
    '',
    '| Table | File |',
    '|-------|------|',
    ...results.dbTables.map(t => `| \`${t.table}\` | \`${t.file}\` |`),
    ''
  ].join('\n');
  await writeFile('docs/registry/db-schema.md', dbSchemaMd);
}

async function main() {
  console.log('🏗️  Scanning architecture...');
  
  await scanServerRoutes();
  await scanUIRoutes();
  await scanDBSchema();
  
  await writeRegistryFiles();
  
  console.log(`✅ Architecture scan complete`);
  console.log(`   Endpoints: ${results.endpoints.length}`);
  console.log(`   UI Routes: ${results.uiRoutes.length}`);
  console.log(`   DB Tables: ${results.dbTables.length}`);
}

main().catch(console.error);

#!/usr/bin/env node
/**
 * Route Collision Validator
 * Ensures no duplicate route handlers exist in the codebase
 * Run: npm run validate:routes
 */

import fs from 'fs';
import path from 'path';

const ROUTE_PATTERNS = [
  /app\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/g,
  /router\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/g,
];

const SERVER_FILES = [
  'server/dev.mjs',
  'server/index.mjs',
  'server/routes/',
];

function scanFile(filePath) {
  const routes = [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const pattern of ROUTE_PATTERNS) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(content)) !== null) {
        routes.push({
          method: match[1].toUpperCase(),
          path: match[2],
          file: filePath,
          line: content.substring(0, match.index).split('\\n').length,
        });
      }
    }
  } catch (e) {
    // File doesn't exist or can't be read
  }
  return routes;
}

function scanDirectory(dir) {
  const routes = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        routes.push(...scanDirectory(fullPath));
      } else if (entry.name.endsWith('.mjs') || entry.name.endsWith('.ts')) {
        routes.push(...scanFile(fullPath));
      }
    }
  } catch (e) {
    // Directory doesn't exist
  }
  return routes;
}

function findCollisions(routes) {
  const byEndpoint = {};
  for (const route of routes) {
    const key = \`\${route.method} \${route.path}\`;
    if (!byEndpoint[key]) {
      byEndpoint[key] = [];
    }
    byEndpoint[key].push(route);
  }
  
  const collisions = [];
  for (const [endpoint, handlers] of Object.entries(byEndpoint)) {
    if (handlers.length > 1) {
      // Filter out expected dev/prod duplicates
      const uniqueFiles = [...new Set(handlers.map(h => h.file))];
      const isDevProdDupe = uniqueFiles.length === 2 && 
        uniqueFiles.includes('server/dev.mjs') && 
        uniqueFiles.includes('server/index.mjs');
      
      if (!isDevProdDupe) {
        collisions.push({ endpoint, handlers });
      }
    }
  }
  return collisions;
}

function main() {
  console.log('🔍 Scanning routes for collisions...');
  
  let allRoutes = [];
  
  for (const target of SERVER_FILES) {
    if (target.endsWith('/')) {
      allRoutes.push(...scanDirectory(target));
    } else {
      allRoutes.push(...scanFile(target));
    }
  }
  
  console.log(\`Found \${allRoutes.length} route handlers\`);
  
  const collisions = findCollisions(allRoutes);
  
  if (collisions.length === 0) {
    console.log('✅ No route collisions detected');
    process.exit(0);
  } else {
    console.error(\`❌ Found \${collisions.length} route collision(s):\`);
    for (const { endpoint, handlers } of collisions) {
      console.error(\`\\n  \${endpoint}:\`);
      for (const h of handlers) {
        console.error(\`    - \${h.file}:\${h.line}\`);
      }
    }
    process.exit(1);
  }
}

main();

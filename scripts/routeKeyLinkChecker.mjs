#!/usr/bin/env node
/**
 * RouteKey Link Checker (P135)
 * Validates all internal links use valid routeKeys
 */

import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log('\n🔗 RouteKey Link Checker');
console.log('─'.repeat(50));

// Load routes
let routes = [];
try {
  const routesPath = path.join(process.cwd(), 'client/src/content/routes.js');
  const content = fs.readFileSync(routesPath, 'utf-8');
  
  // Extract routeKeys from routes.js
  const routeKeyMatches = content.match(/routeKey:\s*['"]([^'"]+)['"]/g) || [];
  routes = routeKeyMatches.map(m => m.match(/routeKey:\s*['"]([^'"]+)['"]/)[1]);
  
  console.log(`  ${COLORS.blue}ℹ${COLORS.reset} Loaded ${routes.length} routeKeys from routes.js`);
} catch (err) {
  console.log(`  ${COLORS.red}✗${COLORS.reset} Could not load routes.js: ${err.message}`);
  process.exit(1);
}

// Scan for internal links in JSX/TSX files
const clientDir = path.join(process.cwd(), 'client/src');
const issues = [];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      // Check for Link components with hardcoded paths
      const linkMatch = line.match(/<Link[^>]*to=["']([^"']+)["']/);
      if (linkMatch) {
        const toPath = linkMatch[1];
        // Skip external links and dynamic routes
        if (toPath.startsWith('/') && !toPath.includes('${') && !toPath.includes(':')) {
          // Check if this path matches a routeKey pattern
          const isRouteKey = routes.some(rk => {
            const routePath = '/' + rk.replace(/_/g, '-').toLowerCase();
            return toPath === routePath || toPath.startsWith(routePath + '/');
          });
          
          // Check for obvious hardcoded paths that should use routeKey
          if (!isRouteKey && !toPath.match(/^\/(api|healthz|assets)/)) {
            issues.push({
              file: filePath.replace(process.cwd(), ''),
              line: idx + 1,
              path: toPath,
              suggestion: 'Consider using routeKey-based navigation'
            });
          }
        }
      }
      
      // Check for navigate() with hardcoded paths
      const navigateMatch = line.match(/navigate\(['"]([^'"]+)['"]\)/);
      if (navigateMatch) {
        const navPath = navigateMatch[1];
        if (navPath.startsWith('/') && !navPath.includes('${')) {
          issues.push({
            file: filePath.replace(process.cwd(), ''),
            line: idx + 1,
            path: navPath,
            type: 'navigate',
            suggestion: 'Consider using routeKey-based navigation'
          });
        }
      }
    });
  } catch (err) {
    // Skip unreadable files
  }
}

function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(jsx?|tsx?)$/.test(entry.name)) {
        scanFile(fullPath);
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
}

scanDirectory(clientDir);

console.log('─'.repeat(50));

if (issues.length === 0) {
  console.log(`${COLORS.green}✅ No broken or suspicious links found${COLORS.reset}\n`);
  process.exit(0);
} else {
  console.log(`${COLORS.yellow}Found ${issues.length} potential link issues:${COLORS.reset}\n`);
  
  issues.slice(0, 20).forEach(issue => {
    console.log(`  ${COLORS.yellow}!${COLORS.reset} ${issue.file}:${issue.line}`);
    console.log(`    Path: ${issue.path}`);
    console.log(`    ${issue.suggestion}\n`);
  });
  
  if (issues.length > 20) {
    console.log(`  ... and ${issues.length - 20} more\n`);
  }
  
  // Write full report
  const reportPath = 'docs/batch-9/link-audit.json';
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), issues }, null, 2));
  console.log(`Full report written to ${reportPath}\n`);
  
  process.exit(0); // Warning only, don't fail
}

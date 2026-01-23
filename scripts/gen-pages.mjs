#!/usr/bin/env node
/**
 * @generated
 * ============================================================================
 * Page Generator Script
 * ============================================================================
 * 
 * Generates physical page files from route configuration.
 * 
 * Usage:
 *   node scripts/gen-pages.mjs --mode=all
 *   node scripts/gen-pages.mjs --mode=landing
 *   node scripts/gen-pages.mjs --mode=category --category="Wellness & Healing Tools"
 *   node scripts/gen-pages.mjs --mode=range --from=A --to=C
 *   node scripts/gen-pages.mjs --mode=all --force
 * 
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const GENERATED_DIR = path.join(ROOT, 'client/src/pages/generated');
const REPORTS_DIR = path.join(ROOT, 'reports');
const BACKUPS_DIR = path.join(REPORTS_DIR, 'backups');
const ROUTES_FILE = path.join(ROOT, 'client/src/content/routes.js');

const GENERATED_MARKER = '// @generated';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { mode: 'all', force: false };
  
  for (const arg of args) {
    if (arg.startsWith('--mode=')) {
      parsed.mode = arg.split('=')[1];
    } else if (arg.startsWith('--category=')) {
      parsed.category = arg.split('=').slice(1).join('=').replace(/^["']|["']$/g, '');
    } else if (arg.startsWith('--from=')) {
      parsed.from = arg.split('=')[1];
    } else if (arg.startsWith('--to=')) {
      parsed.to = arg.split('=')[1];
    } else if (arg === '--force') {
      parsed.force = true;
    }
  }
  
  return parsed;
}

async function loadRoutes() {
  const routesModule = await import(ROUTES_FILE);
  return {
    routes: routesModule.routes || [],
    listRoutesByCategory: routesModule.listRoutesByCategory,
    getRouteConfig: routesModule.getRouteConfig
  };
}

async function loadCategoryOrder() {
  const categoryOrderFile = path.join(ROOT, 'content/categoryOrder.js');
  const module = await import(categoryOrderFile);
  return {
    CATEGORY_ORDER: module.CATEGORY_ORDER,
    getCategoriesInRange: module.getCategoriesInRange,
    getCategoryByLetter: module.getCategoryByLetter
  };
}

function routeToFilename(route) {
  if (route === '/') return 'index.jsx';
  if (route === '/404') return '404.jsx';
  
  const normalized = route
    .replace(/^\//, '')
    .replace(/\//g, '-')
    .replace(/:/g, '')
    .replace(/\[(\w+)\]/g, '[$1]');
  
  if (normalized.includes('[')) {
    return `${normalized}.jsx`;
  }
  
  return `${normalized}.jsx`;
}

function generatePageContent(route, config, isAlias = false, canonicalRoute = null) {
  const lines = [GENERATED_MARKER];
  
  if (isAlias && canonicalRoute) {
    lines.push(`/**`);
    lines.push(` * Alias page for ${route}`);
    lines.push(` * Canonical: ${canonicalRoute}`);
    lines.push(` */`);
    lines.push(``);
    lines.push(`import AutopilotPage from '../_autopilot.jsx';`);
    lines.push(``);
    lines.push(`export default function AliasPage() {`);
    lines.push(`  return <AutopilotPage />;`);
    lines.push(`}`);
  } else {
    lines.push(`/**`);
    lines.push(` * Generated page for ${route}`);
    lines.push(` * Category: ${config?.category || 'unknown'}`);
    lines.push(` * Title: ${config?.title || config?.pageLabel || 'Untitled'}`);
    lines.push(` */`);
    lines.push(``);
    lines.push(`import AutopilotPage from '../_autopilot.jsx';`);
    lines.push(``);
    lines.push(`export default function GeneratedPage() {`);
    lines.push(`  return <AutopilotPage />;`);
    lines.push(`}`);
  }
  
  return lines.join('\n') + '\n';
}

function generate404Page() {
  return `${GENERATED_MARKER}
/**
 * 404 Not Found Page
 */

import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      background: '#faf9f7',
      color: '#3a3a3a'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        fontFamily: 'Playfair Display, serif',
        color: '#2f5d5d',
        marginBottom: '1rem'
      }}>
        404
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
        This page could not be found.
      </p>
      <Link href="/" style={{
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)',
        color: 'white',
        borderRadius: '0.5rem',
        textDecoration: 'none'
      }}>
        Return Home
      </Link>
    </div>
  );
}
`;
}

function generateDynamicStub(pattern, paramName) {
  return `${GENERATED_MARKER}
/**
 * Dynamic route stub for ${pattern}
 * Parameter: ${paramName}
 */

import { useRoute } from 'wouter';
import AutopilotPage from '../_autopilot.jsx';

export default function DynamicPage() {
  const [, params] = useRoute('${pattern}');
  const ${paramName} = params?.${paramName};
  
  return <AutopilotPage dynamicParam={${paramName}} />;
}
`;
}

function canOverwrite(filePath, force) {
  if (!fs.existsSync(filePath)) return true;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(GENERATED_MARKER)) return true;
  
  if (force) {
    const backupPath = path.join(BACKUPS_DIR, `${path.basename(filePath)}.${Date.now()}.bak`);
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    fs.copyFileSync(filePath, backupPath);
    console.log(`  Backed up to ${path.relative(ROOT, backupPath)}`);
    return true;
  }
  
  return false;
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function normalizeConfig(config) {
  const normalized = {
    route: config.route,
    category: config.category,
    pageLabel: config.pageLabel,
    title: config.title,
    description: config.description,
    aliasOf: config.aliasOf || null,
    protected: config.protected || false,
    adminOnly: config.adminOnly || false
  };
  return JSON.stringify(normalized, Object.keys(normalized).sort(), 2);
}

async function main() {
  const args = parseArgs();
  console.log(`\n🌱 Genuine Love Page Generator`);
  console.log(`   Mode: ${args.mode}`);
  if (args.category) console.log(`   Category: ${args.category}`);
  if (args.from && args.to) console.log(`   Range: ${args.from} → ${args.to}`);
  if (args.force) console.log(`   Force: enabled`);
  console.log('');
  
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  
  const { routes, listRoutesByCategory } = await loadRoutes();
  const { CATEGORY_ORDER, getCategoriesInRange, getCategoryByLetter } = await loadCategoryOrder();
  
  let filteredRoutes = [...routes];
  
  if (args.mode === 'landing') {
    filteredRoutes = routes.filter(r => 
      r.category === 'landing' || 
      r.category === 'Landing' ||
      r.category === 'Landing & Marketing'
    );
  } else if (args.mode === 'category' && args.category) {
    filteredRoutes = routes.filter(r => 
      r.category?.toLowerCase() === args.category.toLowerCase()
    );
  } else if (args.mode === 'range' && args.from && args.to) {
    const categoriesInRange = getCategoriesInRange(args.from, args.to);
    const categoryNames = categoriesInRange.map(c => c.category.toLowerCase());
    filteredRoutes = routes.filter(r => 
      categoryNames.includes(r.category?.toLowerCase())
    );
  }
  
  const stats = { generated: 0, skipped: 0, errors: 0 };
  const manifest = {};
  const perRouteHashes = {};
  const configSnapshot = [];
  
  for (const route of filteredRoutes) {
    const routePath = route.route;
    const filename = routeToFilename(routePath);
    const filePath = path.join(GENERATED_DIR, filename);
    
    configSnapshot.push({
      route: routePath,
      category: route.category,
      title: route.title || route.pageLabel,
      aliasOf: route.aliasOf || null
    });
    
    perRouteHashes[routePath] = sha256(normalizeConfig(route));
    
    if (!canOverwrite(filePath, args.force)) {
      console.log(`  ⏭️  Skipped (manual): ${filename}`);
      stats.skipped++;
      continue;
    }
    
    try {
      const isAlias = !!route.aliasOf;
      const content = generatePageContent(routePath, route, isAlias, route.aliasOf);
      
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Generated: ${filename}`);
      
      manifest[routePath] = {
        file: `generated/${filename}`,
        category: route.category,
        title: route.title || route.pageLabel,
        aliasOf: route.aliasOf || null
      };
      
      stats.generated++;
    } catch (err) {
      console.error(`  ❌ Error: ${filename} - ${err.message}`);
      stats.errors++;
    }
  }
  
  if (args.mode === 'all' || args.mode === 'landing') {
    const notFoundPath = path.join(GENERATED_DIR, '404.jsx');
    if (canOverwrite(notFoundPath, args.force)) {
      fs.writeFileSync(notFoundPath, generate404Page(), 'utf-8');
      console.log(`  ✅ Generated: 404.jsx`);
      manifest['/404'] = { file: 'generated/404.jsx', category: 'system', title: 'Not Found' };
      stats.generated++;
    }
  }
  
  const dynamicRoutes = routes.filter(r => r.route.includes(':') || r.route.includes('['));
  for (const route of dynamicRoutes) {
    const paramMatch = route.route.match(/:(\w+)|\[(\w+)\]/);
    if (paramMatch) {
      const paramName = paramMatch[1] || paramMatch[2];
      const filename = routeToFilename(route.route);
      const filePath = path.join(GENERATED_DIR, filename);
      
      if (canOverwrite(filePath, args.force)) {
        fs.writeFileSync(filePath, generateDynamicStub(route.route, paramName), 'utf-8');
        console.log(`  ✅ Generated dynamic: ${filename}`);
        manifest[route.route] = { 
          file: `generated/${filename}`, 
          category: route.category, 
          title: route.title || route.pageLabel,
          dynamic: true,
          param: paramName
        };
        stats.generated++;
      }
    }
  }
  
  configSnapshot.sort((a, b) => a.route.localeCompare(b.route));
  const manifestJson = JSON.stringify(manifest, Object.keys(manifest).sort(), 2);
  const configJson = JSON.stringify(configSnapshot, null, 2);
  const perRouteJson = JSON.stringify(perRouteHashes, Object.keys(perRouteHashes).sort(), 2);
  
  fs.writeFileSync(path.join(REPORTS_DIR, 'routes.generated.json'), manifestJson);
  fs.writeFileSync(path.join(REPORTS_DIR, 'routes.generated.sha256'), sha256(manifestJson));
  fs.writeFileSync(path.join(REPORTS_DIR, 'routes.config.snapshot.json'), configJson);
  fs.writeFileSync(path.join(REPORTS_DIR, 'routes.config.sha256'), sha256(configJson));
  fs.writeFileSync(path.join(REPORTS_DIR, 'routes.perRoute.sha256.json'), perRouteJson);
  
  console.log('');
  console.log(`📊 Summary:`);
  console.log(`   Generated: ${stats.generated}`);
  console.log(`   Skipped:   ${stats.skipped}`);
  console.log(`   Errors:    ${stats.errors}`);
  console.log('');
  console.log(`📁 Outputs written to reports/`);
  console.log('');
  
  if (stats.errors > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

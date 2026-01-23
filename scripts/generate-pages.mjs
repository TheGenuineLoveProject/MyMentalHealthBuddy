#!/usr/bin/env node
/**
 * ============================================================================
 * GENERATE-PAGES.MJS - Page Generator with Landing/Category/Range/All Mode Support
 * ============================================================================
 * 
 * Generates page files from routes.js configuration.
 * 
 * Usage:
 *   node scripts/generate-pages.mjs --mode=landing                         (Landing routes only)
 *   node scripts/generate-pages.mjs --mode=category --category="X"         (Category X only)
 *   node scripts/generate-pages.mjs --mode=range --from=A --to=C           (Categories A through C)
 *   node scripts/generate-pages.mjs --mode=all                             (All 119+ routes)
 *   node scripts/generate-pages.mjs                                        (defaults to landing)
 * 
 * Safety Rules:
 *   - Files without "// @generated" header are NEVER overwritten (manual pages)
 *   - All generated files include "// @generated" header
 *   - Idempotent: running twice produces same result, skips manual pages
 * 
 * Output:
 *   - Generated page files in client/src/pages/generated/
 *   - Manifest file at reports/routes.generated.json
 * 
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  CATEGORY_ORDER,
  ORDERED_LETTERS,
  getCategoriesInRange,
  getCategoryByLetter,
  isValidLetter
} from '../content/categoryOrder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Generated file marker
const GENERATED_MARKER = '// @generated';

// Manifest output paths
const REPORTS_DIR = path.join(ROOT, 'reports');
const MANIFEST_PATH = path.join(REPORTS_DIR, 'routes.generated.json');
const HASH_PATH = path.join(REPORTS_DIR, 'routes.generated.sha256');
const CONFIG_SNAPSHOT_PATH = path.join(REPORTS_DIR, 'routes.config.snapshot.json');
const CONFIG_HASH_PATH = path.join(REPORTS_DIR, 'routes.config.sha256');

// ============================================================================
// PARSE COMMAND LINE ARGUMENTS
// ============================================================================

const args = process.argv.slice(2);
const modeArg = args.find(arg => arg.startsWith('--mode='));
const categoryArg = args.find(arg => arg.startsWith('--category='));
const fromArg = args.find(arg => arg.startsWith('--from='));
const toArg = args.find(arg => arg.startsWith('--to='));

const mode = modeArg ? modeArg.split('=')[1] : 'landing';
const category = categoryArg ? categoryArg.split('=')[1].replace(/^["']|["']$/g, '') : null;
const fromLetter = fromArg ? fromArg.split('=')[1].toUpperCase() : null;
const toLetter = toArg ? toArg.split('=')[1].toUpperCase() : null;

// Validate mode
if (!['landing', 'category', 'range', 'all'].includes(mode)) {
  console.error(`❌ Invalid mode: ${mode}. Use --mode=landing, --mode=category, --mode=range, or --mode=all`);
  process.exit(1);
}

// Validate category requirement for category mode
if (mode === 'category' && !category) {
  console.error(`❌ Category mode requires --category="<Category Name>"`);
  console.error(`   Example: node scripts/generate-pages.mjs --mode=category --category="wellness"`);
  process.exit(1);
}

// Validate range mode requirements
if (mode === 'range') {
  if (!fromLetter || !toLetter) {
    console.error(`❌ Range mode requires --from=<Letter> and --to=<Letter>`);
    console.error(`   Example: node scripts/generate-pages.mjs --mode=range --from=A --to=C`);
    console.error(`\n📋 Available letters:`);
    for (const { letter, category: cat } of CATEGORY_ORDER) {
      console.error(`   ${letter} = ${cat}`);
    }
    process.exit(1);
  }
  
  if (!isValidLetter(fromLetter)) {
    console.error(`❌ Invalid --from letter: "${fromLetter}"`);
    console.error(`   Valid letters: ${ORDERED_LETTERS.join(', ')}`);
    process.exit(1);
  }
  
  if (!isValidLetter(toLetter)) {
    console.error(`❌ Invalid --to letter: "${toLetter}"`);
    console.error(`   Valid letters: ${ORDERED_LETTERS.join(', ')}`);
    process.exit(1);
  }
  
  const fromIndex = ORDERED_LETTERS.indexOf(fromLetter);
  const toIndex = ORDERED_LETTERS.indexOf(toLetter);
  
  if (fromIndex > toIndex) {
    console.error(`❌ Invalid range: --from=${fromLetter} must be <= --to=${toLetter}`);
    console.error(`   ${fromLetter} (index ${fromIndex}) comes after ${toLetter} (index ${toIndex})`);
    process.exit(1);
  }
}

console.log(`\n🌱 Page Generator - Mode: ${mode.toUpperCase()}`);
if (category) {
  console.log(`📂 Category: "${category}"`);
}
if (mode === 'range') {
  console.log(`📊 Range: ${fromLetter} → ${toLetter}`);
}
console.log('');

// ============================================================================
// SAFETY TRACKING & MANIFEST DATA
// ============================================================================

const safetyStats = {
  created: [],
  updated: [],
  skipped: []
};

const manifestRoutes = [];

// ============================================================================
// LANDING ROUTES DEFINITION
// ============================================================================

const LANDING_ROUTES = {
  static: ['/', '/healing', '/pricing', '/landing', '/original-home'],
  aliases: [
    { route: '/home', canonical: '/' },
    { route: '/welcome', canonical: '/' }
  ]
};

// ============================================================================
// PAGE TEMPLATES (with @generated header)
// ============================================================================

const createStaticPageTemplate = (route, pageLabel) => {
  const componentName = route === '/' 
    ? 'HomePage' 
    : `${route.replace(/\//g, '').replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page`;
  
  return `${GENERATED_MARKER}
/**
 * Auto-generated page for route: ${route}
 * Generated by: scripts/generate-pages.mjs
 * DO NOT EDIT - Changes will be overwritten on regeneration
 */
import ConfigRoute from '../pages/_autopilot.jsx';

export default function ${componentName}() {
  return <ConfigRoute route="${route}" />;
}
`;
};

const createAliasRedirectTemplate = (aliasRoute, canonicalRoute) => {
  const componentName = aliasRoute.replace(/\//g, '').replace(/-/g, ' ').split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Redirect';
  
  return `${GENERATED_MARKER}
/**
 * Server-side redirect for alias route: ${aliasRoute} → ${canonicalRoute}
 * Generated by: scripts/generate-pages.mjs
 * 
 * This page implements a permanent (301) server-side redirect.
 * The redirect is handled by Express middleware before this component loads.
 * This file exists for documentation and fallback purposes.
 */

export function getServerSideProps() {
  return {
    redirect: {
      destination: '${canonicalRoute}',
      permanent: true
    }
  };
}

export default function ${componentName}() {
  return null;
}
`;
};

const createDynamicPageTemplate = (route, paramName) => {
  const baseName = route.split('/').filter(p => !p.startsWith(':')).pop() || 'dynamic';
  const componentName = baseName.charAt(0).toUpperCase() + baseName.slice(1) + 'Page';
  
  return `${GENERATED_MARKER}
/**
 * Auto-generated dynamic page for route: ${route}
 * Parameter: ${paramName}
 * Generated by: scripts/generate-pages.mjs
 */
import { useParams } from 'wouter';
import ConfigRoute from '../pages/_autopilot.jsx';

export default function ${componentName}() {
  const params = useParams();
  return <ConfigRoute route="${route}" params={params} />;
}
`;
};

const create404Template = () => {
  return `${GENERATED_MARKER}
/**
 * 404 Not Found Page
 * Generated by: scripts/generate-pages.mjs
 */
import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
      <div className="text-center px-6">
        <h1 className="text-6xl font-serif text-[#2f5d5d] mb-4">404</h1>
        <h2 className="text-2xl font-serif text-[#3a3a3a] mb-6">
          This page doesn't exist yet
        </h2>
        <p className="text-lg text-[#3a3a3a]/70 mb-8 max-w-md mx-auto">
          Perhaps you were looking for something else. 
          Let's guide you back to a gentle space.
        </p>
        <Link href="/">
          <a className="inline-block px-6 py-3 bg-[#8fbf9f] text-white rounded-lg hover:bg-[#7aa98a] transition-colors">
            Return Home
          </a>
        </Link>
      </div>
    </div>
  );
}
`;
};

// ============================================================================
// FILE OPERATIONS WITH SAFETY CHECK
// ============================================================================

const PAGES_DIR = path.join(ROOT, 'client', 'src', 'pages', 'generated');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function routeToFilePath(route) {
  if (route === '/') return 'index.jsx';
  return route.slice(1).replace(/\//g, '-') + '.jsx';
}

function canOverwrite(filePath) {
  if (!fs.existsSync(filePath)) {
    return { allowed: true, reason: 'new' };
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(GENERATED_MARKER)) {
      return { allowed: true, reason: 'generated' };
    }
    return { allowed: false, reason: 'manual' };
  } catch (err) {
    return { allowed: false, reason: 'error', error: err.message };
  }
}

function safeWritePageFile(route, content) {
  const fileName = routeToFilePath(route);
  const filePath = path.join(PAGES_DIR, fileName);
  const relPath = path.relative(ROOT, filePath);
  
  const check = canOverwrite(filePath);
  
  if (!check.allowed) {
    console.log(`   ⏭️  SKIP (manual): ${relPath}`);
    safetyStats.skipped.push({ route, file: relPath, reason: check.reason });
    return { skipped: true, file: relPath };
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  if (check.reason === 'new') {
    safetyStats.created.push({ route, file: relPath });
  } else {
    safetyStats.updated.push({ route, file: relPath });
  }
  
  return { skipped: false, file: relPath, action: check.reason === 'new' ? 'created' : 'updated' };
}

function safeWriteFile(filePath, content) {
  const relPath = path.relative(ROOT, filePath);
  
  const check = canOverwrite(filePath);
  
  if (!check.allowed) {
    console.log(`   ⏭️  SKIP (manual): ${relPath}`);
    safetyStats.skipped.push({ route: '404', file: relPath, reason: check.reason });
    return { skipped: true, file: relPath };
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  if (check.reason === 'new') {
    safetyStats.created.push({ route: '404', file: relPath });
  } else {
    safetyStats.updated.push({ route: '404', file: relPath });
  }
  
  return { skipped: false, file: relPath, action: check.reason === 'new' ? 'created' : 'updated' };
}

// ============================================================================
// LOAD ROUTES FROM CONFIG
// ============================================================================

async function loadRoutes() {
  try {
    const routesModule = await import(path.join(ROOT, 'client', 'src', 'content', 'routes.js'));
    const routes = routesModule.routes || routesModule.default?.routes || [];
    if (!Array.isArray(routes) || routes.length === 0) {
      throw new Error('No routes found in routes.js');
    }
    return routes;
  } catch (err) {
    console.error(`❌ Failed to load routes.js: ${err.message}`);
    process.exit(1);
  }
}

// ============================================================================
// LANDING MODE GENERATION
// ============================================================================

function generateLandingPages() {
  const report = {
    static: [],
    aliases: [],
    errors: [],
    selectedCategories: ['Landing']
  };

  ensureDir(PAGES_DIR);

  console.log('📄 Generating static landing pages...');
  for (const route of LANDING_ROUTES.static) {
    try {
      const pageLabel = route === '/' ? 'Home' : route.slice(1).replace(/-/g, ' ');
      const content = createStaticPageTemplate(route, pageLabel);
      const result = safeWritePageFile(route, content);
      if (!result.skipped) {
        report.static.push({ route, file: result.file, action: result.action });
        console.log(`   ✓ ${route} → ${result.file} (${result.action})`);
      }
      manifestRoutes.push({
        route,
        category: 'Landing',
        pageFile: result.file,
        kind: 'static',
        canonical: null
      });
    } catch (err) {
      report.errors.push({ route, error: err.message });
      console.error(`   ✗ ${route}: ${err.message}`);
    }
  }

  console.log('\n🔄 Generating alias redirect pages...');
  for (const alias of LANDING_ROUTES.aliases) {
    try {
      const content = createAliasRedirectTemplate(alias.route, alias.canonical);
      const result = safeWritePageFile(alias.route, content);
      if (!result.skipped) {
        report.aliases.push({ 
          route: alias.route, 
          canonical: alias.canonical,
          file: result.file,
          action: result.action
        });
        console.log(`   ✓ ${alias.route} → ${alias.canonical} (${result.action})`);
      }
      manifestRoutes.push({
        route: alias.route,
        category: 'Landing',
        pageFile: result.file,
        kind: 'aliasRedirect',
        canonical: alias.canonical
      });
    } catch (err) {
      report.errors.push({ route: alias.route, error: err.message });
      console.error(`   ✗ ${alias.route}: ${err.message}`);
    }
  }

  return report;
}

// ============================================================================
// CATEGORY MODE GENERATION
// ============================================================================

async function generateCategoryPages(targetCategory) {
  const report = {
    category: targetCategory,
    static: [],
    dynamic: [],
    aliases: [],
    errors: [],
    selectedCategories: [targetCategory]
  };

  ensureDir(PAGES_DIR);

  const routes = await loadRoutes();
  
  const availableCategories = [...new Set(routes.map(r => r.category).filter(Boolean))];
  const categoryRoutes = routes.filter(r => r.category === targetCategory && !r.aliasOf);
  
  if (categoryRoutes.length === 0) {
    console.error(`❌ No routes found for category: "${targetCategory}"`);
    console.error(`\n📋 Available categories:`);
    for (const cat of availableCategories.sort()) {
      console.error(`   • ${cat}`);
    }
    process.exit(1);
  }

  console.log(`📊 Found ${categoryRoutes.length} routes in category "${targetCategory}"\n`);

  const categoryCanonicalRoutes = new Set(categoryRoutes.map(r => r.route));
  const categoryAliases = routes.filter(r => r.aliasOf && categoryCanonicalRoutes.has(r.aliasOf));

  console.log('📄 Generating static pages...');
  const staticRoutes = categoryRoutes.filter(r => !r.route.includes(':'));
  for (const routeConfig of staticRoutes) {
    try {
      const content = createStaticPageTemplate(routeConfig.route, routeConfig.pageLabel);
      const result = safeWritePageFile(routeConfig.route, content);
      if (!result.skipped) {
        report.static.push({ route: routeConfig.route, file: result.file, action: result.action });
        console.log(`   ✓ ${routeConfig.route} (${result.action})`);
      }
      manifestRoutes.push({
        route: routeConfig.route,
        category: routeConfig.category,
        pageFile: result.file,
        kind: 'static',
        canonical: null
      });
    } catch (err) {
      report.errors.push({ route: routeConfig.route, error: err.message });
      console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
    }
  }

  const dynamicRoutes = categoryRoutes.filter(r => r.route.includes(':'));
  if (dynamicRoutes.length > 0) {
    console.log('\n🔀 Generating dynamic page stubs...');
    for (const routeConfig of dynamicRoutes) {
      try {
        const paramMatch = routeConfig.route.match(/:(\w+)/);
        const paramName = paramMatch ? paramMatch[1] : 'id';
        const content = createDynamicPageTemplate(routeConfig.route, paramName);
        const result = safeWritePageFile(routeConfig.route.replace(/:\w+/g, '[param]'), content);
        if (!result.skipped) {
          report.dynamic.push({ route: routeConfig.route, file: result.file, action: result.action });
          console.log(`   ✓ ${routeConfig.route} (${result.action})`);
        }
        manifestRoutes.push({
          route: routeConfig.route,
          category: routeConfig.category,
          pageFile: result.file,
          kind: 'dynamic',
          canonical: null
        });
      } catch (err) {
        report.errors.push({ route: routeConfig.route, error: err.message });
        console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
      }
    }
  }

  if (categoryAliases.length > 0) {
    console.log('\n🔄 Generating alias redirect pages...');
    for (const routeConfig of categoryAliases) {
      try {
        const content = createAliasRedirectTemplate(routeConfig.route, routeConfig.aliasOf);
        const result = safeWritePageFile(routeConfig.route, content);
        if (!result.skipped) {
          report.aliases.push({ 
            route: routeConfig.route, 
            canonical: routeConfig.aliasOf,
            file: result.file,
            action: result.action
          });
          console.log(`   ✓ ${routeConfig.route} → ${routeConfig.aliasOf} (${result.action})`);
        }
        manifestRoutes.push({
          route: routeConfig.route,
          category: routeConfig.category || 'alias',
          pageFile: result.file,
          kind: 'aliasRedirect',
          canonical: routeConfig.aliasOf
        });
      } catch (err) {
        report.errors.push({ route: routeConfig.route, error: err.message });
        console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
      }
    }
  }

  return report;
}

// ============================================================================
// RANGE MODE GENERATION
// ============================================================================

async function generateRangePages(from, to) {
  const report = {
    range: { from, to },
    categories: [],
    static: [],
    dynamic: [],
    aliases: [],
    errors: [],
    selectedCategories: []
  };

  ensureDir(PAGES_DIR);

  // Use shared category order module
  const selectedCategoryEntries = getCategoriesInRange(from, to);
  const selectedCategories = selectedCategoryEntries.map(c => c.category);
  report.selectedCategories = selectedCategories;

  console.log('📋 Selected categories:');
  for (const { letter, category: cat } of selectedCategoryEntries) {
    console.log(`   ${letter} = ${cat}`);
    report.categories.push({ letter, category: cat });
  }
  console.log('');

  const routes = await loadRoutes();
  
  // Match routes by category (case-insensitive partial match for flexibility)
  const categorySet = new Set(selectedCategories.map(c => c.toLowerCase()));
  const categoryRoutes = routes.filter(r => {
    if (!r.category || r.aliasOf) return false;
    return categorySet.has(r.category.toLowerCase());
  });

  console.log(`📊 Found ${categoryRoutes.length} routes across ${selectedCategories.length} categories\n`);

  const categoryCanonicalRoutes = new Set(categoryRoutes.map(r => r.route));
  const categoryAliases = routes.filter(r => r.aliasOf && categoryCanonicalRoutes.has(r.aliasOf));

  console.log('📄 Generating static pages...');
  const staticRoutes = categoryRoutes.filter(r => !r.route.includes(':'));
  for (const routeConfig of staticRoutes) {
    try {
      const content = createStaticPageTemplate(routeConfig.route, routeConfig.pageLabel);
      const result = safeWritePageFile(routeConfig.route, content);
      if (!result.skipped) {
        report.static.push({ route: routeConfig.route, file: result.file, action: result.action, category: routeConfig.category });
        console.log(`   ✓ ${routeConfig.route} [${routeConfig.category}] (${result.action})`);
      }
      manifestRoutes.push({
        route: routeConfig.route,
        category: routeConfig.category,
        pageFile: result.file,
        kind: 'static',
        canonical: null
      });
    } catch (err) {
      report.errors.push({ route: routeConfig.route, error: err.message });
      console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
    }
  }

  const dynamicRoutes = categoryRoutes.filter(r => r.route.includes(':'));
  if (dynamicRoutes.length > 0) {
    console.log('\n🔀 Generating dynamic page stubs...');
    for (const routeConfig of dynamicRoutes) {
      try {
        const paramMatch = routeConfig.route.match(/:(\w+)/);
        const paramName = paramMatch ? paramMatch[1] : 'id';
        const content = createDynamicPageTemplate(routeConfig.route, paramName);
        const result = safeWritePageFile(routeConfig.route.replace(/:\w+/g, '[param]'), content);
        if (!result.skipped) {
          report.dynamic.push({ route: routeConfig.route, file: result.file, action: result.action, category: routeConfig.category });
          console.log(`   ✓ ${routeConfig.route} [${routeConfig.category}] (${result.action})`);
        }
        manifestRoutes.push({
          route: routeConfig.route,
          category: routeConfig.category,
          pageFile: result.file,
          kind: 'dynamic',
          canonical: null
        });
      } catch (err) {
        report.errors.push({ route: routeConfig.route, error: err.message });
        console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
      }
    }
  }

  if (categoryAliases.length > 0) {
    console.log('\n🔄 Generating alias redirect pages...');
    for (const routeConfig of categoryAliases) {
      try {
        const content = createAliasRedirectTemplate(routeConfig.route, routeConfig.aliasOf);
        const result = safeWritePageFile(routeConfig.route, content);
        if (!result.skipped) {
          report.aliases.push({ 
            route: routeConfig.route, 
            canonical: routeConfig.aliasOf,
            file: result.file,
            action: result.action
          });
          console.log(`   ✓ ${routeConfig.route} → ${routeConfig.aliasOf} (${result.action})`);
        }
        manifestRoutes.push({
          route: routeConfig.route,
          category: routeConfig.category || 'alias',
          pageFile: result.file,
          kind: 'aliasRedirect',
          canonical: routeConfig.aliasOf
        });
      } catch (err) {
        report.errors.push({ route: routeConfig.route, error: err.message });
        console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
      }
    }
  }

  return report;
}

// ============================================================================
// ALL MODE GENERATION
// ============================================================================

async function generateAllPages() {
  const report = {
    static: [],
    dynamic: [],
    aliases: [],
    special: [],
    errors: [],
    selectedCategories: CATEGORY_ORDER.map(c => c.category)
  };

  ensureDir(PAGES_DIR);

  const routes = await loadRoutes();

  console.log(`📊 Found ${routes.length} routes in configuration\n`);

  console.log('📄 Generating static pages...');
  const staticRoutes = routes.filter(r => !r.aliasOf && !r.route.includes(':'));
  for (const routeConfig of staticRoutes) {
    try {
      const content = createStaticPageTemplate(routeConfig.route, routeConfig.pageLabel);
      const result = safeWritePageFile(routeConfig.route, content);
      if (!result.skipped) {
        report.static.push({ route: routeConfig.route, file: result.file, action: result.action });
        console.log(`   ✓ ${routeConfig.route} (${result.action})`);
      }
      manifestRoutes.push({
        route: routeConfig.route,
        category: routeConfig.category,
        pageFile: result.file,
        kind: 'static',
        canonical: null
      });
    } catch (err) {
      report.errors.push({ route: routeConfig.route, error: err.message });
      console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
    }
  }

  console.log('\n🔀 Generating dynamic page stubs...');
  const dynamicRoutes = routes.filter(r => r.route.includes(':'));
  for (const routeConfig of dynamicRoutes) {
    try {
      const paramMatch = routeConfig.route.match(/:(\w+)/);
      const paramName = paramMatch ? paramMatch[1] : 'id';
      const content = createDynamicPageTemplate(routeConfig.route, paramName);
      const result = safeWritePageFile(routeConfig.route.replace(/:\w+/g, '[param]'), content);
      if (!result.skipped) {
        report.dynamic.push({ route: routeConfig.route, file: result.file, action: result.action });
        console.log(`   ✓ ${routeConfig.route} (${result.action})`);
      }
      manifestRoutes.push({
        route: routeConfig.route,
        category: routeConfig.category,
        pageFile: result.file,
        kind: 'dynamic',
        canonical: null
      });
    } catch (err) {
      report.errors.push({ route: routeConfig.route, error: err.message });
      console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
    }
  }

  console.log('\n🔄 Generating alias redirect pages...');
  const aliasRoutes = routes.filter(r => r.aliasOf);
  for (const routeConfig of aliasRoutes) {
    try {
      const content = createAliasRedirectTemplate(routeConfig.route, routeConfig.aliasOf);
      const result = safeWritePageFile(routeConfig.route, content);
      if (!result.skipped) {
        report.aliases.push({ 
          route: routeConfig.route, 
          canonical: routeConfig.aliasOf,
          file: result.file,
          action: result.action
        });
        console.log(`   ✓ ${routeConfig.route} → ${routeConfig.aliasOf} (${result.action})`);
      }
      manifestRoutes.push({
        route: routeConfig.route,
        category: routeConfig.category || 'alias',
        pageFile: result.file,
        kind: 'aliasRedirect',
        canonical: routeConfig.aliasOf
      });
    } catch (err) {
      report.errors.push({ route: routeConfig.route, error: err.message });
      console.error(`   ✗ ${routeConfig.route}: ${err.message}`);
    }
  }

  console.log('\n📛 Generating 404 page...');
  try {
    const content = create404Template();
    const filePath = path.join(PAGES_DIR, '404.jsx');
    const result = safeWriteFile(filePath, content);
    if (!result.skipped) {
      report.special.push({ route: '404', file: result.file, action: result.action });
      console.log(`   ✓ 404.jsx (${result.action})`);
    }
    manifestRoutes.push({
      route: '/404',
      category: 'System & Utility',
      pageFile: result.file,
      kind: 'notFound',
      canonical: null
    });
  } catch (err) {
    report.errors.push({ route: '404', error: err.message });
    console.error(`   ✗ 404: ${err.message}`);
  }

  return report;
}

// ============================================================================
// MANIFEST GENERATION
// ============================================================================

function writeManifest(report) {
  ensureDir(REPORTS_DIR);

  // Build manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    mode,
    category: category || null,
    from: fromLetter || null,
    to: toLetter || null,
    selectedCategories: report.selectedCategories || [],
    counts: {
      created: safetyStats.created.length,
      updated: safetyStats.updated.length,
      skippedManual: safetyStats.skipped.length,
      aliasRedirects: manifestRoutes.filter(r => r.kind === 'aliasRedirect').length,
      totalWritten: safetyStats.created.length + safetyStats.updated.length
    },
    files: {
      created: safetyStats.created.map(f => f.file).sort(),
      updated: safetyStats.updated.map(f => f.file).sort(),
      skippedManual: safetyStats.skipped.map(f => f.file).sort(),
      aliasRedirects: manifestRoutes.filter(r => r.kind === 'aliasRedirect').map(r => r.pageFile).sort()
    },
    routes: manifestRoutes.sort((a, b) => a.route.localeCompare(b.route))
  };

  const manifestJson = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(MANIFEST_PATH, manifestJson, 'utf8');
  console.log(`\n📄 Manifest written: ${path.relative(ROOT, MANIFEST_PATH)}`);

  // Write sha256 hash of manifest for CI drift detection
  const hash = crypto.createHash('sha256').update(manifestJson).digest('hex');
  fs.writeFileSync(HASH_PATH, hash + '\n', 'utf8');
  console.log(`🔐 Hash written: ${path.relative(ROOT, HASH_PATH)}`);
}

// ============================================================================
// CONFIG SNAPSHOT GENERATION (Stable/Deterministic)
// ============================================================================

async function writeConfigSnapshot() {
  ensureDir(REPORTS_DIR);

  // Load routes from config
  const routes = await loadRoutes();

  /**
   * Stable stringify: sorts object keys for deterministic output.
   * Handles nested objects and arrays consistently.
   */
  function stableStringify(obj) {
    return JSON.stringify(obj, (key, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value).sort().reduce((sorted, k) => {
          sorted[k] = value[k];
          return sorted;
        }, {});
      }
      return value;
    });
  }

  /**
   * Compute sha256 hash of an object using stable stringification.
   */
  function computeRouteHash(routeEntry) {
    const stableJson = stableStringify(routeEntry);
    return crypto.createHash('sha256').update(stableJson).digest('hex');
  }

  // Build stable routes index with only deterministic fields
  const routesIndex = routes.map(routeConfig => {
    // Normalize undefined to null for consistent output
    const normalize = (val) => (val === undefined ? null : val);

    // Detect if route is a pattern (has :param)
    const pattern = routeConfig.route.includes(':') ? routeConfig.route : null;

    // Count sections and modules if present
    const sectionsCount = Array.isArray(routeConfig.sections) ? routeConfig.sections.length : 0;
    const modulesCount = Array.isArray(routeConfig.modules) ? routeConfig.modules.length : 0;

    // Build hero object if present
    let hero = null;
    if (routeConfig.hero) {
      hero = {
        title: normalize(routeConfig.hero.title),
        subtitle: normalize(routeConfig.hero.subtitle),
        primaryCta: routeConfig.hero.primaryCta ? {
          label: normalize(routeConfig.hero.primaryCta.label),
          href: normalize(routeConfig.hero.primaryCta.href)
        } : null,
        secondaryCta: routeConfig.hero.secondaryCta ? {
          label: normalize(routeConfig.hero.secondaryCta.label),
          href: normalize(routeConfig.hero.secondaryCta.href)
        } : null
      };
    }

    // Build route entry without hash first
    const routeEntry = {
      route: routeConfig.route,
      category: normalize(routeConfig.category),
      aliasOf: normalize(routeConfig.aliasOf),
      pattern,
      title: normalize(routeConfig.title || routeConfig.pageLabel),
      description: normalize(routeConfig.description),
      hero,
      sectionsCount,
      modulesCount
    };

    // Compute per-route hash
    const routeHash = computeRouteHash(routeEntry);

    // Return entry with hash included
    return {
      ...routeEntry,
      routeHash
    };
  });

  // Sort by route ascending for deterministic output
  routesIndex.sort((a, b) => a.route.localeCompare(b.route));

  // Build routeHashes map for fast lookup
  const routeHashes = {};
  for (const entry of routesIndex) {
    routeHashes[entry.route] = entry.routeHash;
  }

  // Build canonical snapshot
  const snapshot = {
    categoryOrder: CATEGORY_ORDER,
    routeHashes,
    routesIndex
  };

  // Write snapshot with stable formatting
  const snapshotJson = JSON.stringify(snapshot, null, 2);

  // Compute snapshot hash
  const snapshotHashValue = crypto.createHash('sha256').update(snapshotJson).digest('hex');

  // Add snapshotHash to the final output for convenience
  const snapshotWithHash = {
    snapshotHash: snapshotHashValue,
    categoryOrder: CATEGORY_ORDER,
    routeHashes,
    routesIndex
  };

  const finalSnapshotJson = JSON.stringify(snapshotWithHash, null, 2);
  fs.writeFileSync(CONFIG_SNAPSHOT_PATH, finalSnapshotJson, 'utf8');

  // Write sha256 hash file (of the final JSON bytes)
  const fileHash = crypto.createHash('sha256').update(finalSnapshotJson).digest('hex');
  fs.writeFileSync(CONFIG_HASH_PATH, fileHash + '\n', 'utf8');

  console.log(`📸 Config snapshot written: ${path.relative(ROOT, CONFIG_SNAPSHOT_PATH)}`);
  console.log(`🔐 Config hash written: ${path.relative(ROOT, CONFIG_HASH_PATH)}`);
  console.log(`   Routes: ${routesIndex.length}, Route hashes: ${Object.keys(routeHashes).length}`);
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

async function printReport(report, mode, extras = {}) {
  console.log('\n' + '═'.repeat(60));
  console.log('📋 GENERATOR REPORT');
  console.log('═'.repeat(60));
  
  console.log(`\nMode: ${mode.toUpperCase()}`);
  if (extras.category) {
    console.log(`Category: "${extras.category}"`);
  }
  if (extras.range) {
    console.log(`Range: ${extras.range.from} → ${extras.range.to}`);
  }
  console.log(`Output Directory: client/src/pages/generated/\n`);

  if (mode === 'range' && report.categories) {
    console.log('📋 Selected Categories:');
    for (const cat of report.categories) {
      console.log(`   ${cat.letter} = ${cat.category}`);
    }
    console.log('');
  }

  if (mode === 'landing') {
    console.log('📄 Static Landing Pages:');
    for (const item of report.static) {
      console.log(`   • ${item.route} → ${item.file} (${item.action})`);
    }
    
    if (report.aliases.length > 0) {
      console.log('\n🔄 Alias Redirects:');
      for (const item of report.aliases) {
        console.log(`   • ${item.route} → ${item.canonical} (${item.action})`);
      }
    }
  } else if (mode === 'category' || mode === 'range') {
    console.log('📄 Static Pages:');
    for (const item of report.static) {
      const catLabel = item.category ? ` [${item.category}]` : '';
      console.log(`   • ${item.route}${catLabel} → ${item.file} (${item.action})`);
    }
    
    if (report.dynamic.length > 0) {
      console.log('\n🔀 Dynamic Stubs:');
      for (const item of report.dynamic) {
        const catLabel = item.category ? ` [${item.category}]` : '';
        console.log(`   • ${item.route}${catLabel} → ${item.file} (${item.action})`);
      }
    }
    
    if (report.aliases.length > 0) {
      console.log('\n🔄 Alias Redirects:');
      for (const item of report.aliases) {
        console.log(`   • ${item.route} → ${item.canonical} (${item.action})`);
      }
    }
  } else {
    console.log(`📄 Static Pages: ${report.static.length}`);
    console.log(`🔀 Dynamic Stubs: ${report.dynamic.length}`);
    console.log(`🔄 Alias Redirects: ${report.aliases.length}`);
    console.log(`📛 Special Pages: ${report.special.length}`);
  }

  // SAFETY REPORT
  console.log('\n' + '═'.repeat(60));
  console.log('🛡️  SAFETY REPORT');
  console.log('═'.repeat(60));
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✨ Created (new files):    ${safetyStats.created.length}`);
  console.log(`   🔄 Updated (@generated):   ${safetyStats.updated.length}`);
  console.log(`   ⏭️  Skipped (manual):       ${safetyStats.skipped.length}`);

  if (safetyStats.created.length > 0) {
    console.log('\n✨ Created files:');
    for (const item of safetyStats.created) {
      console.log(`   • ${item.file}`);
    }
  }

  if (safetyStats.updated.length > 0) {
    console.log('\n🔄 Updated files (had @generated):');
    for (const item of safetyStats.updated) {
      console.log(`   • ${item.file}`);
    }
  }

  if (safetyStats.skipped.length > 0) {
    console.log('\n⏭️  Skipped manual files (no @generated):');
    for (const item of safetyStats.skipped) {
      console.log(`   • ${item.file}`);
    }
  }

  if (report.errors.length > 0) {
    console.log(`\n❌ Errors: ${report.errors.length}`);
    for (const err of report.errors) {
      console.log(`   • ${err.route}: ${err.error}`);
    }
  }

  const total = safetyStats.created.length + safetyStats.updated.length;
  
  console.log('\n' + '─'.repeat(60));
  console.log(`✅ Total files written: ${total}`);
  console.log(`⏭️  Total files skipped: ${safetyStats.skipped.length}`);
  console.log(`❌ Errors: ${report.errors.length}`);
  console.log('─'.repeat(60) + '\n');

  // Write manifest
  writeManifest(report);

  // Write config snapshot (stable/deterministic)
  await writeConfigSnapshot();

  if (report.errors.length > 0) {
    process.exit(1);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  let report;
  
  if (mode === 'landing') {
    report = generateLandingPages();
    await printReport(report, mode);
  } else if (mode === 'category') {
    report = await generateCategoryPages(category);
    await printReport(report, mode, { category });
  } else if (mode === 'range') {
    report = await generateRangePages(fromLetter, toLetter);
    await printReport(report, mode, { range: { from: fromLetter, to: toLetter } });
  } else {
    report = await generateAllPages();
    await printReport(report, mode);
  }

  console.log('🎉 Page generation complete!\n');
}

main().catch(err => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * print-routes-diff.mjs
 * Reads reports/routes.diff.json and prints a PR-ready Markdown comment or
 * GitHub Actions annotations to stdout.
 * 
 * Usage:
 *   node scripts/print-routes-diff.mjs [options]
 * 
 * Options:
 *   --file=<path>       Path to diff JSON (default: reports/routes.diff.json)
 *   --max=<n>           Limit items per section (default: 10)
 *   --format=md|gha     Output format (default: md)
 *   --title="..."       Custom title (default: "Route manifest drift detected")
 *   --ci                Force --format=gha unless explicitly set
 *   --top=<n>           Number of top changes to show (default: 5)
 *   --topMode=...       Priority mode: hash|title|category|mixed (default: mixed)
 * 
 * Exit codes:
 *   0 - Clean (no drift or file missing)
 *   2 - Drift detected
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================

function parseArgs(argv) {
  const args = {
    file: 'reports/routes.diff.json',
    max: 10,
    format: 'md',
    title: 'Route manifest drift detected',
    ci: false,
    formatExplicit: false,
    top: 5,
    topMode: 'mixed'
  };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--file=')) {
      args.file = arg.slice(7);
    } else if (arg.startsWith('--max=')) {
      const val = parseInt(arg.slice(6), 10);
      if (!isNaN(val) && val > 0) {
        args.max = val;
      }
    } else if (arg.startsWith('--format=')) {
      const fmt = arg.slice(9).toLowerCase();
      if (fmt === 'md' || fmt === 'gha') {
        args.format = fmt;
        args.formatExplicit = true;
      }
    } else if (arg.startsWith('--title=')) {
      args.title = arg.slice(8).replace(/^["']|["']$/g, '');
    } else if (arg === '--ci') {
      args.ci = true;
    } else if (arg.startsWith('--top=')) {
      const val = parseInt(arg.slice(6), 10);
      if (!isNaN(val) && val > 0) {
        args.top = val;
      }
    } else if (arg.startsWith('--topMode=')) {
      const mode = arg.slice(10).toLowerCase();
      if (['hash', 'title', 'category', 'mixed'].includes(mode)) {
        args.topMode = mode;
      }
    }
  }

  // --ci forces gha unless --format was explicitly set
  if (args.ci && !args.formatExplicit) {
    args.format = 'gha';
  }

  return args;
}

// ============================================================================
// UTILITIES
// ============================================================================

function truncateList(items, max) {
  if (items.length <= max) {
    return { shown: items, remaining: 0 };
  }
  return {
    shown: items.slice(0, max),
    remaining: items.length - max
  };
}

function sortByRoute(items) {
  return [...items].sort((a, b) => {
    const routeA = typeof a === 'string' ? a : a.route;
    const routeB = typeof b === 'string' ? b : b.route;
    return routeA.localeCompare(routeB);
  });
}

function getRoute(item) {
  return typeof item === 'string' ? item : item.route;
}

// ============================================================================
// FORMATTERS
// ============================================================================

function formatAddedItem(item) {
  const route = typeof item === 'string' ? item : item.route;
  const category = typeof item === 'object' ? item.category : null;
  return category ? `+ ${route} (${category})` : `+ ${route}`;
}

function formatRemovedItem(item) {
  const route = typeof item === 'string' ? item : item.route;
  const category = typeof item === 'object' ? item.category : null;
  return category ? `- ${route} (${category})` : `- ${route}`;
}

function formatTitleChanged(item) {
  return `~ ${item.route}: "${item.fromTitle}" → "${item.toTitle}"`;
}

function formatCategoryChanged(item) {
  return `~ ${item.route}: "${item.fromCategory}" → "${item.toCategory}"`;
}

function formatHashChanged(item) {
  return `~ ${item.route} (content changed)`;
}

// ============================================================================
// TOP CHANGES SECTION
// ============================================================================

function buildTopChanges(diffData, topCount, topMode) {
  const seen = new Set();
  const result = [];

  const buckets = {
    title: sortByRoute(diffData.titleChanged || []).map(item => ({
      route: item.route,
      formatted: formatTitleChanged(item)
    })),
    category: sortByRoute(diffData.categoryChanged || []).map(item => ({
      route: item.route,
      formatted: formatCategoryChanged(item)
    })),
    hash: sortByRoute(diffData.hashChanged || []).map(item => ({
      route: item.route,
      formatted: formatHashChanged(item)
    })),
    added: sortByRoute(diffData.added || []).map(item => ({
      route: getRoute(item),
      formatted: formatAddedItem(item)
    })),
    removed: sortByRoute(diffData.removed || []).map(item => ({
      route: getRoute(item),
      formatted: formatRemovedItem(item)
    }))
  };

  function addFromBucket(bucketName) {
    const bucket = buckets[bucketName];
    for (const item of bucket) {
      if (result.length >= topCount) return;
      if (!seen.has(item.route)) {
        seen.add(item.route);
        result.push(item.formatted);
      }
    }
  }

  switch (topMode) {
    case 'hash':
      addFromBucket('hash');
      addFromBucket('title');
      addFromBucket('category');
      addFromBucket('added');
      addFromBucket('removed');
      break;
    case 'title':
      addFromBucket('title');
      addFromBucket('category');
      addFromBucket('hash');
      addFromBucket('added');
      addFromBucket('removed');
      break;
    case 'category':
      addFromBucket('category');
      addFromBucket('title');
      addFromBucket('hash');
      addFromBucket('added');
      addFromBucket('removed');
      break;
    case 'mixed':
    default:
      // Interleave: title, category, hash, added, removed
      const order = ['title', 'category', 'hash', 'added', 'removed'];
      const indices = { title: 0, category: 0, hash: 0, added: 0, removed: 0 };
      
      while (result.length < topCount) {
        let added = false;
        for (const bucketName of order) {
          if (result.length >= topCount) break;
          const bucket = buckets[bucketName];
          while (indices[bucketName] < bucket.length) {
            const item = bucket[indices[bucketName]];
            indices[bucketName]++;
            if (!seen.has(item.route)) {
              seen.add(item.route);
              result.push(item.formatted);
              added = true;
              break;
            }
          }
        }
        if (!added) break; // No more items
      }
      break;
  }

  return result;
}

// ============================================================================
// MARKDOWN GENERATION
// ============================================================================

function renderSection(title, items, formatter, max) {
  if (!items || items.length === 0) return '';

  const sorted = sortByRoute(items);
  const { shown, remaining } = truncateList(sorted, max);
  const lines = [
    `### ${title}`,
    ''
  ];

  for (const item of shown) {
    lines.push(formatter(item));
  }

  if (remaining > 0) {
    lines.push(`…and ${remaining} more`);
  }

  lines.push('');
  return lines.join('\n');
}

function generateMarkdown(diffData, max, topCount, topMode) {
  const lines = [];

  lines.push('## Route Manifest Drift Detected');
  lines.push('');

  const summary = diffData.summary || {};
  lines.push('**Summary:**');
  lines.push(`- Added: ${summary.added || 0}`);
  lines.push(`- Removed: ${summary.removed || 0}`);
  lines.push(`- Title Changed: ${summary.titleChanged || 0}`);
  lines.push(`- Category Changed: ${summary.categoryChanged || 0}`);
  lines.push(`- Other Changes (hash): ${summary.hashChanged || 0}`);
  lines.push('');

  if (diffData.recommendedCommand) {
    lines.push('**To fix:**');
    lines.push('```bash');
    lines.push(diffData.recommendedCommand);
    lines.push('```');
    lines.push('');
  }

  // Top changes section
  const topChanges = buildTopChanges(diffData, topCount, topMode);
  if (topChanges.length > 0) {
    lines.push(`### Top changes (${topChanges.length})`);
    lines.push('');
    for (const change of topChanges) {
      lines.push(change);
    }
    lines.push('');
  }

  const addedSection = renderSection('Added Routes', diffData.added, formatAddedItem, max);
  const removedSection = renderSection('Removed Routes', diffData.removed, formatRemovedItem, max);
  const titleSection = renderSection('Title Changes', diffData.titleChanged, formatTitleChanged, max);
  const categorySection = renderSection('Category Changes', diffData.categoryChanged, formatCategoryChanged, max);
  const hashSection = renderSection('Other Changes', diffData.hashChanged, formatHashChanged, max);

  if (addedSection) lines.push(addedSection);
  if (removedSection) lines.push(removedSection);
  if (titleSection) lines.push(titleSection);
  if (categorySection) lines.push(categorySection);
  if (hashSection) lines.push(hashSection);

  return lines.join('\n').trim();
}

// ============================================================================
// GITHUB ACTIONS ANNOTATION GENERATION
// ============================================================================

function ghaEscape(str) {
  return String(str).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function generateGhaClean() {
  return '::notice title=Routes::Routes manifest clean';
}

function generateGhaDrift(diffData, max, title, topCount, topMode) {
  const lines = [];
  const summary = diffData.summary || {};
  const cmd = diffData.recommendedCommand || 'npm run gen:pages:all && npm run verify:routes';

  // Main error line
  lines.push(`::error title=Routes::${ghaEscape(title)}. Run: ${ghaEscape(cmd)}`);

  // Top changes notice
  const topChanges = buildTopChanges(diffData, topCount, topMode);
  if (topChanges.length > 0) {
    const maxNoticeItems = 3;
    const truncated = topChanges.length > maxNoticeItems;
    const shownItems = truncated ? topChanges.slice(0, maxNoticeItems) : topChanges;
    let topNotice = shownItems.join(' | ');
    if (truncated) {
      topNotice += ' | …';
    }
    lines.push(`::notice title=Routes::Top changes: ${ghaEscape(topNotice)}`);
  }

  // Summary warning
  const summaryParts = [];
  summaryParts.push(`Added: ${summary.added || 0}`);
  summaryParts.push(`Removed: ${summary.removed || 0}`);
  summaryParts.push(`Title changed: ${summary.titleChanged || 0}`);
  summaryParts.push(`Category changed: ${summary.categoryChanged || 0}`);
  summaryParts.push(`Hash changed: ${summary.hashChanged || 0}`);
  lines.push(`::warning title=Routes::${summaryParts.join(', ')}`);

  // Per-route warnings
  const sections = [
    { items: diffData.added, formatter: formatAddedItem },
    { items: diffData.removed, formatter: formatRemovedItem },
    { items: diffData.titleChanged, formatter: formatTitleChanged },
    { items: diffData.categoryChanged, formatter: formatCategoryChanged },
    { items: diffData.hashChanged, formatter: formatHashChanged }
  ];

  for (const section of sections) {
    if (!section.items || section.items.length === 0) continue;
    const sorted = sortByRoute(section.items);
    const { shown, remaining } = truncateList(sorted, max);

    for (const item of shown) {
      const formatted = section.formatter(item);
      lines.push(`::warning title=Routes::${ghaEscape(formatted)}`);
    }

    if (remaining > 0) {
      lines.push(`::warning title=Routes::…and ${remaining} more`);
    }
  }

  return lines.join('\n');
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = parseArgs(process.argv);
  const diffPath = path.resolve(args.file);

  // File missing
  if (!fs.existsSync(diffPath)) {
    if (args.format === 'gha') {
      console.log(generateGhaClean());
    } else {
      console.log('✅ Routes manifest clean (no reports/routes.diff.json found).');
    }
    process.exit(0);
  }

  // Read diff file
  let diffData;
  try {
    const content = fs.readFileSync(diffPath, 'utf-8');
    diffData = JSON.parse(content);
  } catch (err) {
    console.error(`Error reading diff file: ${err.message}`);
    process.exit(1);
  }

  // Status clean
  if (diffData.status === 'clean') {
    if (args.format === 'gha') {
      console.log(generateGhaClean());
    } else {
      console.log('✅ Routes manifest is clean. No drift detected.');
    }
    process.exit(0);
  }

  // Status drift
  if (diffData.status === 'drift') {
    if (args.format === 'gha') {
      console.log(generateGhaDrift(diffData, args.max, args.title, args.top, args.topMode));
    } else {
      console.log(generateMarkdown(diffData, args.max, args.top, args.topMode));
    }
    process.exit(2);
  }

  // Unknown status
  if (args.format === 'gha') {
    console.log(generateGhaClean());
  } else {
    console.log('✅ Routes manifest status unknown. Assuming clean.');
  }
  process.exit(0);
}

main();

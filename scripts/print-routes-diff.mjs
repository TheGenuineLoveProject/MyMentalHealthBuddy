#!/usr/bin/env node
/**
 * print-routes-diff.mjs
 * Reads reports/routes.diff.json and prints a PR-ready Markdown comment to stdout.
 * 
 * Usage:
 *   node scripts/print-routes-diff.mjs [--file=<path>] [--max=<n>]
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
    max: 10
  };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--file=')) {
      args.file = arg.slice(7);
    } else if (arg.startsWith('--max=')) {
      const val = parseInt(arg.slice(6), 10);
      if (!isNaN(val) && val > 0) {
        args.max = val;
      }
    }
  }

  return args;
}

// ============================================================================
// MARKDOWN GENERATION
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
  return `~ ${item.route} (hash changed)`;
}

function renderSection(title, items, formatter, max) {
  if (!items || items.length === 0) return '';

  const sorted = [...items].sort((a, b) => {
    const routeA = typeof a === 'string' ? a : a.route;
    const routeB = typeof b === 'string' ? b : b.route;
    return routeA.localeCompare(routeB);
  });

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

function generateMarkdown(diffData, max) {
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
// MAIN
// ============================================================================

function main() {
  const args = parseArgs(process.argv);
  const diffPath = path.resolve(args.file);

  if (!fs.existsSync(diffPath)) {
    console.log('✅ Routes manifest clean (no reports/routes.diff.json found).');
    process.exit(0);
  }

  let diffData;
  try {
    const content = fs.readFileSync(diffPath, 'utf-8');
    diffData = JSON.parse(content);
  } catch (err) {
    console.error(`Error reading diff file: ${err.message}`);
    process.exit(1);
  }

  if (diffData.status === 'clean') {
    console.log('✅ Routes manifest is clean. No drift detected.');
    process.exit(0);
  }

  if (diffData.status === 'drift') {
    const markdown = generateMarkdown(diffData, args.max);
    console.log(markdown);
    process.exit(2);
  }

  console.log('✅ Routes manifest status unknown. Assuming clean.');
  process.exit(0);
}

main();

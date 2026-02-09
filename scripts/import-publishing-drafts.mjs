import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const REGISTRY_PATH = path.join(ROOT, 'content/publishing/publishingRegistry.json');
const PACK_DIR = path.join(ROOT, 'content/publishing/drafts');

const PACK_FILES = [
  'socialPack_v2_1.json',
  'blogPack_v2_1.json',
  'newsletterPack_v2_1.json',
];

const ALLOWED_CTAS = ['/newsletter', '/blog', '/tools', '/pricing', '/crisis', '/journal', '/reflection', '/about'];
const PILLARS_PATH = path.join(ROOT, 'content/publishing/pillars.json');

console.log('── Import Publishing Drafts ──\n');

let registry;
try {
  registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
} catch {
  console.error('  ✗ Cannot read publishingRegistry.json');
  process.exit(1);
}

let pillars;
try {
  pillars = JSON.parse(fs.readFileSync(PILLARS_PATH, 'utf8'));
} catch {
  console.error('  ✗ Cannot read pillars.json');
  process.exit(1);
}

const validPillarKeys = new Set(pillars.map(p => p.key));
const existingIds = new Set(registry.map(r => r.id));

let inserted = 0;
let skipped = 0;
let errors = 0;

for (const file of PACK_FILES) {
  const filePath = path.join(PACK_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ Pack file missing: ${file}`);
    continue;
  }

  let pack;
  try {
    pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`  ✗ Invalid JSON in ${file}: ${e.message}`);
    errors++;
    continue;
  }

  for (const item of pack) {
    if (!item.id || !item.type || !item.pillar || !item.primaryCta || !item.status) {
      console.error(`  ✗ Missing required fields in ${file}: ${item.id || 'unknown'}`);
      errors++;
      continue;
    }

    if (!validPillarKeys.has(item.pillar)) {
      console.error(`  ✗ Invalid pillar "${item.pillar}" in ${item.id}`);
      errors++;
      continue;
    }

    if (!ALLOWED_CTAS.includes(item.primaryCta)) {
      console.error(`  ✗ Invalid CTA "${item.primaryCta}" in ${item.id}`);
      errors++;
      continue;
    }

    if (existingIds.has(item.id)) {
      skipped++;
      continue;
    }

    const registryEntry = {
      id: item.id,
      type: item.type,
      pillar: item.pillar,
      title: item.title || item.captions?.instagram?.substring(0, 60) || 'Untitled',
      slug: item.slug || item.id,
      status: item.status,
      primaryCta: item.primaryCta,
      createdAt: item.createdAt || new Date().toISOString(),
      owner: 'admin',
      sourceFile: `content/publishing/drafts/${file}`,
      notes: `Imported from v2.1 ${item.type} pack`
    };

    registry.push(registryEntry);
    existingIds.add(item.id);
    inserted++;
  }
}

if (errors > 0) {
  console.log(`\n  ✗ ${errors} validation error(s) found\n`);
  console.log('══════════════════════════════════════');
  console.log('IMPORT_DRAFTS: FAIL');
  console.log('══════════════════════════════════════');
  process.exit(1);
}

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');

console.log(`  ✓ Inserted ${inserted} new entries`);
console.log(`  ✓ Skipped ${skipped} existing entries`);
console.log(`  ✓ Registry now has ${registry.length} total entries\n`);
console.log('══════════════════════════════════════');
console.log(`IMPORT_DRAFTS: PASS (inserted ${inserted}, skipped ${skipped})`);
console.log('══════════════════════════════════════');

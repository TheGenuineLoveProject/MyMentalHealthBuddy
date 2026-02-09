import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PACK_DIR = path.join(ROOT, 'content/publishing/drafts');
const PILLARS_PATH = path.join(ROOT, 'content/publishing/pillars.json');

const PACK_FILES = [
  'socialPack_v2_1.json',
  'blogPack_v2_1.json',
  'newsletterPack_v2_1.json',
];

const ALLOWED_CTAS = ['/newsletter', '/blog', '/tools', '/pricing', '/crisis', '/journal', '/reflection', '/about'];
const ALLOWED_TYPES = ['social', 'blog', 'newsletter'];
const ALLOWED_STATUSES = ['draft', 'approved', 'posted', 'archived'];

const FORBIDDEN_PHRASES = [
  /\bcure\b/i,
  /\bdiagnos(?:e|is|tic)\b/i,
  /\bprescrib(?:e|ed)\b/i,
  /\bwill\s+heal\s+you\b/i,
  /\bguaranteed\s+results?\b/i,
  /\bguaranteed\s+healing\b/i,
  /\bguaranteed\s+transformation\b/i,
  /\btherapy\s+replacement\b/i,
  /\bmedical\s+advice\b/i,
  /\byou\s+must\b/i,
  /\byou\s+should\b/i,
  /\blast\s+chance\b/i,
  /\bact\s+now\b/i,
  /\bhurry\b/i,
  /\bdon['']t\s+miss\b/i,
  /\btoday\s+only\b/i,
  /\blimited\s+time\b/i,
  /\bbefore\s+it['']s\s+too\s+late\b/i,
  /\bstop\s+making\s+excuses\b/i,
  /\bwhat['']s\s+wrong\s+with\s+you\b/i,
];

const NEGATION_CONTEXT = /\bnot\b|\bnever\b|\bavoid\b|\bdon['']t\b|\bwon['']t\b|\bcannot\b|\bcan['']t\b|\bwithout\b|\bisn['']t\b|\baren['']t\b|\bis\s+not\b/i;
const DISCLAIMER_CONTEXT = /educational|does not replace|not a substitute|not a replacement|professional|this is not|what we are not|what this isn/i;

console.log('── Draft Packs Validation ──\n');

let pillars;
try {
  pillars = JSON.parse(fs.readFileSync(PILLARS_PATH, 'utf8'));
} catch {
  console.error('  ✗ Cannot read pillars.json');
  process.exit(1);
}

const validPillarKeys = new Set(pillars.map(p => p.key));
let passed = true;
let totalDrafts = 0;
let violations = [];

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
    passed = false;
    continue;
  }

  if (!Array.isArray(pack)) {
    console.error(`  ✗ ${file} is not an array`);
    passed = false;
    continue;
  }

  const ids = new Set();

  for (const item of pack) {
    totalDrafts++;

    if (!item.id) {
      violations.push(`${file}: missing id`);
      continue;
    }

    if (ids.has(item.id)) {
      violations.push(`${file}: duplicate id "${item.id}"`);
    }
    ids.add(item.id);

    if (!ALLOWED_TYPES.includes(item.type)) {
      violations.push(`${item.id}: invalid type "${item.type}"`);
    }

    if (!validPillarKeys.has(item.pillar)) {
      violations.push(`${item.id}: invalid pillar "${item.pillar}"`);
    }

    if (!ALLOWED_CTAS.includes(item.primaryCta)) {
      violations.push(`${item.id}: invalid CTA "${item.primaryCta}"`);
    }

    if (!ALLOWED_STATUSES.includes(item.status)) {
      violations.push(`${item.id}: invalid status "${item.status}"`);
    }

    if (!item.captions || !item.captions.instagram || !item.captions.x || !item.captions.tiktok || !item.captions.youtubeShorts) {
      violations.push(`${item.id}: missing captions (need instagram, x, tiktok, youtubeShorts)`);
    }

    if ((item.type === 'blog' || item.type === 'newsletter') && !item.draftMarkdown) {
      violations.push(`${item.id}: blog/newsletter missing draftMarkdown`);
    }

    if (!item.safetyNote) {
      violations.push(`${item.id}: missing safetyNote`);
    }

    if (!item.createdAt) {
      violations.push(`${item.id}: missing createdAt`);
    }

    const textToScan = [
      item.captions?.instagram || '',
      item.captions?.x || '',
      item.captions?.tiktok || '',
      item.captions?.youtubeShorts || '',
      item.draftMarkdown || '',
    ].join('\n');

    const lines = textToScan.split('\n');
    for (const line of lines) {
      if (NEGATION_CONTEXT.test(line)) continue;
      if (DISCLAIMER_CONTEXT.test(line)) continue;

      for (const pattern of FORBIDDEN_PHRASES) {
        if (pattern.test(line)) {
          violations.push(`${item.id}: forbidden phrase "${line.trim().substring(0, 60)}" matches ${pattern}`);
          break;
        }
      }
    }
  }
}

if (violations.length > 0) {
  passed = false;
  for (const v of violations) {
    console.log(`  ✗ ${v}`);
  }
}

if (passed) {
  console.log(`  ✓ All ${totalDrafts} drafts conform to schema`);
  console.log(`  ✓ All pillar keys valid`);
  console.log(`  ✓ All CTA paths allowed`);
  console.log(`  ✓ No forbidden phrases detected`);
}

console.log('');
console.log('══════════════════════════════════════');
console.log(`DRAFT_PACKS_VALIDATE: ${passed ? 'PASS' : 'FAIL'}`);
console.log('══════════════════════════════════════');

if (!passed) process.exit(1);

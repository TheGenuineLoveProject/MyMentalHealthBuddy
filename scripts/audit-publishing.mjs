import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = true;
let warnings = 0;
let errors = 0;

function log(type, msg) {
  const prefix = type === 'PASS' ? '  ✓' : type === 'FAIL' ? '  ✗' : '  ⚠';
  console.log(`${prefix} ${msg}`);
  if (type === 'FAIL') { errors++; passed = false; }
  if (type === 'WARN') { warnings++; }
}

function section(name) {
  console.log(`\n── ${name} ──`);
}

const FORBIDDEN_PATTERNS = [
  { pattern: /don['']t miss/i, label: 'urgency: "don\'t miss"' },
  { pattern: /last chance/i, label: 'urgency: "last chance"' },
  { pattern: /limited time/i, label: 'urgency: "limited time"' },
  { pattern: /act now/i, label: 'urgency: "act now"' },
  { pattern: /hurry/i, label: 'urgency: "hurry"' },
  { pattern: /today only/i, label: 'urgency: "today only"' },
  { pattern: /before it['']s too late/i, label: 'urgency: "before it\'s too late"' },
  { pattern: /you should be/i, label: 'guilt: "you should be"' },
  { pattern: /you must /i, label: 'guilt: "you must"' },
  { pattern: /stop making excuses/i, label: 'guilt: "stop making excuses"' },
  { pattern: /what['']s wrong with you/i, label: 'shame: "what\'s wrong with you"' },
  { pattern: /(?<!no app can )cure(?:s|d)? (?:your|the|any)/i, label: 'medical: "cure"' },
  { pattern: /(?<!cannot |can't |won't )diagnos/i, label: 'medical: "diagnose"' },
  { pattern: /prescri(?:be|ption)/i, label: 'medical: "prescribe"' },
  { pattern: /guaranteed? healing/i, label: 'medical: "guaranteed healing"' },
  { pattern: /will heal you/i, label: 'medical: "will heal you"' },
  { pattern: /you can['']t do this without/i, label: 'dependency: "you can\'t do this without"' },
  { pattern: /you need us/i, label: 'dependency: "you need us"' },
];

const ALLOWED_INTERNAL_LINKS = [
  '/blog', '/newsletter', '/crisis', '/journal', '/reflection',
  '/tools', '/about', '/pricing',
];

const REQUIRED_FRONTMATTER = ['title', 'slug', 'pillar', 'publishDate', 'summary', 'tags'];
const VALID_PILLARS = ['Orientation', 'Reflection', 'Integration'];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim());
      }
      fm[key] = value;
    }
  }
  return fm;
}

function scanForbiddenLanguage(content, filepath) {
  let clean = true;
  const lines = content.split('\n');

  let inNeverSection = false;
  const contextualLines = lines.map(line => {
    const trimmed = line.trim().toLowerCase();
    if (/^###?\s/.test(trimmed) && /never|avoid|don['']t|not to|disallowed|what (it|we) (do|are) not/i.test(trimmed)) {
      inNeverSection = true;
      return { line, skip: true };
    }
    if (/^###?\s/.test(trimmed)) {
      inNeverSection = false;
    }
    if (inNeverSection && (trimmed.startsWith('- ') || trimmed.startsWith('| '))) {
      return { line, skip: true };
    }
    return { line, skip: false };
  });

  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    for (const { line, skip } of contextualLines) {
      if (skip) continue;
      const trimmed = line.trim().toLowerCase();
      if (/words we avoid|disallowed|never use|language.*(avoid|not)/i.test(trimmed)) continue;
      if (/not "/.test(trimmed) && pattern.test(line)) continue;
      if (/cannot |can't |won't |will not |not .*to |unable to |not equipped/i.test(trimmed) && pattern.test(line)) continue;
      if (pattern.test(line)) {
        log('FAIL', `${filepath}: forbidden language detected — ${label}`);
        clean = false;
        break;
      }
    }
  }
  return clean;
}

function scanInternalLinks(content, filepath) {
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;
  let clean = true;
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    const href = match[2];
    if (href.startsWith('http://') || href.startsWith('https://')) continue;
    if (href.startsWith('#')) continue;
    const route = href.split('?')[0].split('#')[0];
    const isAllowed = ALLOWED_INTERNAL_LINKS.some(a => route === a || route.startsWith(a + '/'));
    if (!isAllowed) {
      log('WARN', `${filepath}: internal link "${route}" not in allowed CTA list`);
      clean = false;
    }
  }
  return clean;
}

section('Blog Index vs Posts');
const indexPath = path.join(ROOT, 'content/blog/index.json');
const postsDir = path.join(ROOT, 'content/blog/posts');

if (!fs.existsSync(indexPath)) {
  log('FAIL', 'content/blog/index.json not found');
} else {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  log('PASS', `Blog index loaded: ${index.length} entries`);

  for (const entry of index) {
    const postPath = path.join(postsDir, `${entry.slug}.md`);
    if (!fs.existsSync(postPath)) {
      log('FAIL', `Missing post file for index entry: ${entry.slug}`);
    } else {
      log('PASS', `Post file exists: ${entry.slug}.md`);
    }

    if (!VALID_PILLARS.includes(entry.pillar)) {
      log('FAIL', `Invalid pillar "${entry.pillar}" in index entry: ${entry.slug}`);
    }
  }

  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of postFiles) {
    const slug = file.replace('.md', '');
    if (!index.find(e => e.slug === slug)) {
      log('WARN', `Post file ${file} exists but is not in index.json`);
    }
  }
}

section('Blog Post Frontmatter');
if (fs.existsSync(postsDir)) {
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of postFiles) {
    const filepath = path.join(postsDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      log('FAIL', `${file}: missing frontmatter`);
      continue;
    }
    for (const key of REQUIRED_FRONTMATTER) {
      if (!fm[key]) {
        log('FAIL', `${file}: missing required frontmatter field "${key}"`);
      }
    }
    if (fm.pillar && !VALID_PILLARS.includes(fm.pillar)) {
      log('FAIL', `${file}: invalid pillar "${fm.pillar}"`);
    }
    log('PASS', `${file}: frontmatter valid`);
  }
}

section('Forbidden Language Scan (Blog)');
if (fs.existsSync(postsDir)) {
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of postFiles) {
    const filepath = path.join(postsDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    if (scanForbiddenLanguage(content, `blog/${file}`)) {
      log('PASS', `${file}: no forbidden language`);
    }
  }
}

section('Forbidden Language Scan (Newsletter)');
const newsletterDir = path.join(ROOT, 'content/newsletter');
if (fs.existsSync(newsletterDir)) {
  const nlFiles = fs.readdirSync(newsletterDir).filter(f => f.endsWith('.md') || f.endsWith('.json'));
  for (const file of nlFiles) {
    const filepath = path.join(newsletterDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    if (scanForbiddenLanguage(content, `newsletter/${file}`)) {
      log('PASS', `${file}: no forbidden language`);
    }
  }
}

section('Internal Link Audit (Blog)');
if (fs.existsSync(postsDir)) {
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of postFiles) {
    const filepath = path.join(postsDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    if (scanInternalLinks(content, `blog/${file}`)) {
      log('PASS', `${file}: all links allowed`);
    }
  }
}

section('Internal Link Audit (Newsletter)');
if (fs.existsSync(newsletterDir)) {
  const nlFiles = fs.readdirSync(newsletterDir).filter(f => f.endsWith('.md'));
  for (const file of nlFiles) {
    const filepath = path.join(newsletterDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    if (scanInternalLinks(content, `newsletter/${file}`)) {
      log('PASS', `${file}: all links allowed`);
    }
  }
}

section('Newsletter Template Checks');
const requiredNlFiles = ['weekly-template.md', 'welcome-template.md', 'crisis-safe-footer.md', 'newsletter-style-guide.md'];
for (const file of requiredNlFiles) {
  const filepath = path.join(newsletterDir, file);
  if (!fs.existsSync(filepath)) {
    log('FAIL', `Missing newsletter template: ${file}`);
  } else {
    log('PASS', `Newsletter template exists: ${file}`);
  }
}

const crisisFooterPath = path.join(newsletterDir, 'crisis-safe-footer.md');
if (fs.existsSync(crisisFooterPath)) {
  const footer = fs.readFileSync(crisisFooterPath, 'utf8');
  if (/988/i.test(footer) && /741741/i.test(footer) && /unsubscribe/i.test(footer)) {
    log('PASS', 'Crisis-safe footer contains crisis numbers and unsubscribe');
  } else {
    log('FAIL', 'Crisis-safe footer missing crisis numbers or unsubscribe');
  }
}

const optionalityPatterns = [/optional/i, /whenever/i, /if you['']d like/i, /when you['']re ready/i, /at your pace/i, /no (pressure|obligation)/i, /you can/i, /free to/i];
for (const file of ['weekly-template.md', 'welcome-template.md']) {
  const filepath = path.join(newsletterDir, file);
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, 'utf8');
    const hasOptionality = optionalityPatterns.some(p => p.test(content));
    if (hasOptionality) {
      log('PASS', `${file}: contains optionality language`);
    } else {
      log('FAIL', `${file}: missing optionality language`);
    }
    if (/crisis|988|741741/i.test(content)) {
      log('PASS', `${file}: references crisis support`);
    } else {
      log('WARN', `${file}: does not reference crisis support directly (footer should cover this)`);
    }
  }
}

section('Pillar Balance Check');
if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const counts = {};
  for (const entry of index) {
    counts[entry.pillar] = (counts[entry.pillar] || 0) + 1;
  }
  const minCount = Math.min(...VALID_PILLARS.map(p => counts[p] || 0));
  const maxCount = Math.max(...VALID_PILLARS.map(p => counts[p] || 0));
  for (const p of VALID_PILLARS) {
    const c = counts[p] || 0;
    if (c === 0) {
      log('FAIL', `Pillar "${p}" has no blog posts`);
    } else {
      log('PASS', `Pillar "${p}": ${c} post(s)`);
    }
  }
  if (minCount > 0 && maxCount - minCount <= 1) {
    log('PASS', `Pillar balance: ${VALID_PILLARS.map(p => `${p}=${counts[p]||0}`).join(', ')}`);
  } else if (minCount > 0) {
    log('WARN', `Pillar imbalance: ${VALID_PILLARS.map(p => `${p}=${counts[p]||0}`).join(', ')} — consider adding more to underrepresented pillars`);
  }
}

section('Narrative Spine');
const spinePath = path.join(ROOT, 'docs/NARRATIVE_SPINE.md');
if (!fs.existsSync(spinePath)) {
  log('FAIL', 'docs/NARRATIVE_SPINE.md not found');
} else {
  const spine = fs.readFileSync(spinePath, 'utf8');
  const checks = [
    ['Three Content Pillars', /Orientation.*Reflection.*Integration/s],
    ['Tone rules', /Tone Guide|tone rules/i],
    ['Allowed CTAs', /Allowed CTAs/i],
    ['Publish Checklist', /Publish Checklist/i],
  ];
  for (const [name, pattern] of checks) {
    if (pattern.test(spine)) {
      log('PASS', `Narrative Spine contains: ${name}`);
    } else {
      log('FAIL', `Narrative Spine missing: ${name}`);
    }
  }
}

console.log('\n══════════════════════════════════════');
if (passed && warnings === 0) {
  console.log('PUBLISHING_AUDIT: PASS');
} else if (passed) {
  console.log(`PUBLISHING_AUDIT: PASS (with ${warnings} warning(s))`);
} else {
  console.log(`PUBLISHING_AUDIT: FAIL (${errors} error(s), ${warnings} warning(s))`);
}
console.log('══════════════════════════════════════\n');

process.exit(passed ? 0 : 1);

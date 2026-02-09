#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const FORBIDDEN = [
  { pattern: /\bcures?\s+(?:your|the|any)/i, label: 'medical: "cure"' },
  { pattern: /\btreat(?:s|ment)?\s+(?:your|the|any|mental)/i, label: 'medical: "treat"' },
  { pattern: /\bdiagnos(?:e|is|tic)/i, label: 'medical: "diagnose"' },
  { pattern: /\bprescri(?:be|ption)/i, label: 'medical: "prescribe"' },
  { pattern: /guaranteed?\s+(?:results?|healing|recovery)/i, label: 'medical: "guaranteed results"' },
  { pattern: /will\s+heal\s+you/i, label: 'medical: "will heal you"' },
  { pattern: /today\s+only/i, label: 'urgency: "today only"' },
  { pattern: /limited\s+time/i, label: 'urgency: "limited time"' },
  { pattern: /don['']t\s+miss/i, label: 'urgency: "don\'t miss"' },
  { pattern: /act\s+now/i, label: 'urgency: "act now"' },
  { pattern: /hurry/i, label: 'urgency: "hurry"' },
  { pattern: /last\s+chance/i, label: 'urgency: "last chance"' },
  { pattern: /before\s+it['']s\s+too\s+late/i, label: 'urgency: "before it\'s too late"' },
  { pattern: /what['']s\s+wrong\s+with\s+you/i, label: 'shame: "what\'s wrong with you"' },
  { pattern: /you\s+should\s+be\s+ashamed/i, label: 'shame' },
  { pattern: /stop\s+making\s+excuses/i, label: 'guilt: "stop making excuses"' },
  { pattern: /you\s+need\s+us/i, label: 'dependency: "you need us"' },
  { pattern: /you\s+can['']t\s+do\s+this\s+without/i, label: 'dependency' },
];

let passed = true;
let violations = [];

const STYLE_GUIDE_SKIP = /style[-_]?guide|never\s+use|words\s+we\s+avoid|disallowed|forbidden|don['']t\s+(say|use)|avoid\s+(these|using|words)|not\s+(allowed|permitted)|examples?\s+of\s+what\s+not/i;
const NEGATION_CONTEXT = /\bnot\b|\bnever\b|\bavoid\b|\bdon['']t\b|\bwon['']t\b|\bcannot\b|\bcan['']t\b|\bwithout\b|\bno\b|\bisn['']t\b|\baren['']t\b|\bis\s+not\b/i;
const LIST_HEADER = /^[-*•]\s|^#+\s|forbidden|claims|rules/i;

function scanContent(content, filepath) {
  if (/style[-_]?guide/i.test(filepath)) return;

  const lines = content.split('\n');
  for (const { pattern, label } of FORBIDDEN) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (STYLE_GUIDE_SKIP.test(trimmed)) continue;
      if (NEGATION_CONTEXT.test(trimmed)) continue;
      if (LIST_HEADER.test(trimmed) && i > 0 && STYLE_GUIDE_SKIP.test(lines[i-1]?.trim() || '')) continue;

      if (pattern.test(line)) {
        violations.push({ filepath, label, line: trimmed.substring(0, 80) });
        passed = false;
        break;
      }
    }
  }
}

function scanDir(dir, exts) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (exts.some(e => file.endsWith(e))) {
      scanContent(fs.readFileSync(path.join(dir, file), 'utf8'), path.relative(ROOT, path.join(dir, file)));
    }
  }
}

console.log('── Tone & Safety Audit ──\n');

scanDir(path.join(ROOT, 'content/blog/posts'), ['.md']);
scanDir(path.join(ROOT, 'content/newsletter'), ['.md', '.json']);
scanDir(path.join(ROOT, 'content/publishing/newsletter'), ['.json']);
scanDir(path.join(ROOT, 'content/publishing/templates'), ['.md']);

if (violations.length === 0) {
  console.log('  ✓ No forbidden language detected in publishing content');
} else {
  for (const v of violations) {
    console.log(`  ✗ ${v.filepath}: ${v.label}`);
    console.log(`    "${v.line}"`);
  }
}

console.log(`\n══════════════════════════════════════`);
console.log(passed ? 'TONE_AUDIT: PASS' : `TONE_AUDIT: FAIL (${violations.length} violation(s))`);
console.log('══════════════════════════════════════\n');
process.exit(passed ? 0 : 1);

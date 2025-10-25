/**
 * Idempotent fixer for known corruption patterns from your audit/screens.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = [
  'scripts',
  'server',
  'shared',
  'MyMentalHealthBuddy/server',
  'MyMentalHealthBuddy/src'
].map(p => path.join(ROOT, p)).filter(fs.existsSync);

const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json']);

const rules: [RegExp, string | ((...a:any[])=>string)][] = [
  [/\bchild_proces\"s\"/g, 'child_process'],
  [/\bnode:f\"s\"/g, 'node:fs'],
  [/\"\.j\.js\"s\"/g, '.js'],
  [/"\$\{([^}]+)\}"/g, (_m, g1) => '`' + '${' + g1 + '}' + '`'],
  [/\{\;/g, '{'],
  [/\}\;/g, '}'],
  [/;\s*0\./g, '* 0.']
];

function walk(dir: string, out: string[] = []) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(path.extname(n))) out.push(p);
  }
  return out;
}

let changed = 0;
for (const base of TARGETS) {
  for (const f of walk(base)) {
    const src = fs.readFileSync(f, 'utf8');
    let out = src;
    for (const [re, rep] of rules) out = out.replace(re, rep as any);
    if (out !== src) { fs.writeFileSync(f, out, 'utf8'); changed++; }
  }
}
console.log(JSON.stringify({ fixedFiles: changed }));
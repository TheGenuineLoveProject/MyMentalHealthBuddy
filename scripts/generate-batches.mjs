import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--start") out.start = Number(args[++i]);
    if (a === "--count") out.count = Number(args[++i]);
    if (a === "--name") out.name = String(args[++i]);
  }
  return out;
}

function item(n, title) {
  return `### ${n}. ❌ LOCKED — ${title}
- WHY:
- DONE MEANS:
  - [ ] 
- TOUCH POINTS:
- IMPLEMENTATION:
- VERIFY:
  - [ ] npm run preflight
  - [ ] npm run verify
- DUPLICATE-SAFETY:
  - preflight: reports/*/latest.json
- STATUS: ❌ LOCKED
`;
}

function main() {
  const { start = 301, count = 50, name = "" } = parseArgs();
  const end = start + count - 1;

  const dir = path.join(ROOT, "docs", "process-engine", "batches");
  ensureDir(dir);

  const fileName = name
    ? `process-${name}.md`
    : `process-${start}-${end}.md`;

  const filePath = path.join(dir, fileName);

  const header = `# PROCESS BATCH ${name ? name.toUpperCase() : `${start}-${end}`}
LOCKED — Do not start items until preflight PASS and batch is officially unlocked.
Generated: ${new Date().toISOString()}

RULES:
- Run "npm run preflight" before every process.
- If collisions/dupes exist: fix those FIRST.
- Mark ✅ DONE only when "npm run verify" passes.
- Keep one source of truth; consolidate duplicates.
`;

  const titles = [
    "Security hardening + headers + safe defaults",
    "Auth flow completion (signup/signin/reset) + session/JWT alignment",
    "Stripe billing tiers + webhook integrity + idempotency",
    "DB schema consolidation + migrations + seeds",
    "Admin health dashboard + telemetry + audit logs",
    "Content publishing system (blog) + SEO + sitemap",
    "Social scheduler tool (draft→approve→publish) + templates",
    "AI journaling/chat UX polish + safety guardrails + prompt versioning",
    "Performance budgets + lazy loading + caching",
    "Accessibility (WCAG AA) + reduced motion + keyboard nav",
  ];

  let body = "";
  for (let i = 0; i < count; i++) {
    const n = start + i;
    body += item(n, titles[i % titles.length]);
  }

  fs.writeFileSync(filePath, `${header}\n\n${body}`);
  console.log("Generated batch:", filePath);
}

main();
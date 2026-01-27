#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function arg(name, fallback=null){
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return process.argv[idx+1] ?? true;
}
const start = Number(arg("start", "1"));
const count = Number(arg("count", "50"));
const dryRun = process.argv.includes("--dry-run");

const REPORT_DIR = path.join(process.cwd(), "docs", "process-engine", "reports");
fs.mkdirSync(REPORT_DIR, { recursive: true });

const out = {
  generatedAt: new Date().toISOString(),
  start, count, dryRun,
  note: "This is the shell-backed NEXT50 runner stub. It prints the plan and exits. Wire it to your process catalog as you build.",
};

const file = path.join(REPORT_DIR, `next50_${start}_${start+count-1}_${dryRun ? "dryrun":"apply"}.json`);
fs.writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`NEXT50 plan written -> ${file}`);
console.log(`Mode: ${dryRun ? "DRY-RUN" : "APPLY"}`);
console.log(`Range: ${start}..${start+count-1}`);
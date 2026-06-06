import fs from "node:fs";
import path from "node:path";

const outDir = "diagnostics/phase84";
fs.mkdirSync(outDir, { recursive: true });

const roots = ["client/src/pages", "client/src/components", "client/src/content", "server"].filter(fs.existsSync);
const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs"]);

const ignoredPath = /(diagnostics|docs|scripts|node_modules|dist|build|\.git|_quarantine|backup|\.bak|\.before|logs\/events\.jsonl)/i;

function walk(dir, acc = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (ignoredPath.test(full)) continue;
    if (item.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(item.name))) acc.push(full);
  }
  return acc;
}

const files = roots.flatMap(root => walk(root));

const healingPattern = /\b(journal|journaling|mood|emotion|emotional|crisis|trauma|reflection|reflective|therapy|therapeutic|anxiety|depression|wellness|healing|coping|grounding|breath|nervous system|self-compassion|support)\b/i;
const businessPattern = /\b(pricing|subscription|billing|checkout|stripe|revenue|conversion|upsell|retention|paywall|premium|purchase|cancel|refund|plan|subscribe)\b/i;
const prohibitedPattern = /\b(vulnerability targeting|emotional monetization|monetize vulnerability|pricing optimization|retarget|ad target|dark pattern|coercive retention|conversion pressure|emotional persuasion|manipulative retention|behavioral coercion)\b/i;

const findings = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const hasHealing = healingPattern.test(text) || healingPattern.test(file);
  const hasBusiness = businessPattern.test(text) || businessPattern.test(file);
  const hasProhibited = prohibitedPattern.test(text);

  if (hasHealing && hasBusiness && hasProhibited) {
    const lines = text.split(/\r?\n/);
    const matches = [];
    lines.forEach((line, idx) => {
      if (prohibitedPattern.test(line)) matches.push(`${idx + 1}: ${line.trim().slice(0, 240)}`);
    });
    findings.push({ file, matches });
  }
}

const report = findings.flatMap(f => [
  `FILE ${f.file}`,
  ...f.matches.map(m => `  ${m}`)
]).join("\n");

fs.writeFileSync(`${outDir}/business-healing-firewall-active-risks.txt`, report + (report ? "\n" : ""));
fs.writeFileSync(`${outDir}/business-healing-firewall-summary.json`, JSON.stringify({
  scannedFiles: files.length,
  activeRisks: findings.length,
  files: findings.map(f => f.file)
}, null, 2));

if (findings.length) {
  console.log("BUSINESS_HEALING_FIREWALL_GATE_FAIL");
  console.log(`activeRisks=${findings.length}`);
  for (const f of findings) console.log(f.file);
  process.exit(1);
}

console.log("BUSINESS_HEALING_FIREWALL_GATE_PASS");
console.log(`scannedFiles=${files.length}`);
console.log("activeRisks=0");

import fs from "node:fs";
import path from "node:path";

const outDir = "diagnostics/phase84";
fs.mkdirSync(outDir, { recursive: true });

const roots = ["client/src/pages", "client/src/components", "client/src/content"].filter(fs.existsSync);
const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
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

const risks = [
  ["CURE_CLAIM", /\bcure(s|d)?\b/i],
  ["GUARANTEE_CLAIM", /\bguarantee(s|d)?\b/i],
  ["THERAPY_REPLACEMENT_CLAIM", /replacement for therapy|substitute for therapy|replace therapy/i],
  ["DIAGNOSIS_CLAIM", /\bdiagnose(s|d)? you\b|\bwe diagnose\b/i]
];

const allowedContext = /(not a cure|does not cure|no guaranteed|cannot guarantee|not a guarantee|not a replacement|not a substitute|not therapy|not diagnosis|educational|professional support|crisis resources)/i;

const findings = [];

for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const [id, re] of risks) {
      if (re.test(line) && !allowedContext.test(line)) {
        findings.push({ id, file, line: idx + 1, text: line.trim().slice(0, 240) });
      }
    }
  });
}

fs.writeFileSync(`${outDir}/clinical-claim-active-risks.txt`, findings.map(f => `${f.id} ${f.file}:${f.line}: ${f.text}`).join("\n") + (findings.length ? "\n" : ""));
fs.writeFileSync(`${outDir}/clinical-claim-summary.json`, JSON.stringify({
  scannedFiles: files.length,
  activeRisks: findings.length
}, null, 2));

if (findings.length) {
  console.log("CLINICAL_CLAIM_COHERENCE_GATE_FAIL");
  console.log(`activeRisks=${findings.length}`);
  findings.slice(0, 80).forEach(f => console.log(`${f.id} ${f.file}:${f.line}`));
  process.exit(1);
}

console.log("CLINICAL_CLAIM_COHERENCE_GATE_PASS");
console.log(`scannedFiles=${files.length}`);
console.log("activeRisks=0");

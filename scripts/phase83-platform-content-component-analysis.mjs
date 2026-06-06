import fs from "node:fs";
import path from "node:path";

const outDir = "diagnostics/phase83";
fs.mkdirSync(outDir, { recursive: true });

const scanRoots = ["client/src", "server", "docs", "scripts"].filter(fs.existsSync);
const sourceExts = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".md", ".css"]);

function walk(dir, acc = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", "dist", "build", ".git", "_quarantine"].includes(item.name)) continue;
      walk(full, acc);
    } else if (sourceExts.has(path.extname(item.name))) {
      acc.push(full);
    }
  }
  return acc;
}

const files = scanRoots.flatMap(root => walk(root));
const pages = files.filter(f => /client\/src\/pages\/.*\.(jsx|tsx)$/.test(f));
const components = files.filter(f => /client\/src\/components\/.*\.(jsx|tsx)$/.test(f));
const serverFiles = files.filter(f => /^server\//.test(f));

const findings = {
  totals: {
    files: files.length,
    pages: pages.length,
    components: components.length,
    serverFiles: serverFiles.length
  },
  pages: [],
  componentWarnings: [],
  clinicalClaimRisks: [],
  businessHealingBoundaryRisks: [],
  lumiFindings: [],
  duplicateBasenameRisks: [],
  routeReferences: [],
  buttonRisks: [],
  cssTokenFindings: []
};

const clinicalRiskPatterns = [
  ["CURE_LANGUAGE", /\bcure(s|d)?\b/i],
  ["GUARANTEE_LANGUAGE", /\bguarantee(s|d)?\b/i],
  ["DIAGNOSIS_LANGUAGE", /\bdiagnose(s|d)? you\b|\bwe diagnose\b/i],
  ["THERAPY_REPLACEMENT_LANGUAGE", /replacement for therapy|substitute for therapy/i],
  ["UNBOUNDED_BRAIN_CLAIM", /literally change your brain|literally rewires?|rewires? neural pathways/i]
];

const businessPatterns = /(pricing|subscription|billing|checkout|stripe|revenue|conversion|upsell|retention)/i;
const healingPatterns = /(journal|mood|emotion|crisis|trauma|reflection|therapy|anxiety|depression|wellness)/i;
const exploitPatterns = /(vulnerability targeting|emotional monetization|pricing optimization|retarget|ad target|dark pattern|coercive)/i;

const basenameMap = new Map();

for (const file of files) {
  const base = path.basename(file).replace(/\.(jsx|tsx|js|ts|mjs|css|md)$/i, "");
  if (!basenameMap.has(base)) basenameMap.set(base, []);
  basenameMap.get(base).push(file);

  const text = fs.readFileSync(file, "utf8");

  for (const [id, re] of clinicalRiskPatterns) {
    if (re.test(text)) findings.clinicalClaimRisks.push({ id, file });
  }

  if (businessPatterns.test(file + "\n" + text) && healingPatterns.test(file + "\n" + text) && exploitPatterns.test(text)) {
    findings.businessHealingBoundaryRisks.push({ id: "BUSINESS_HEALING_EXPLOIT_RISK", file });
  }

  if (/Lumi|avatar|MMHB_FLOAT_IDLE_UNIT|lumi-/i.test(text)) {
    findings.lumiFindings.push(file);
  }

  const hrefs = [...text.matchAll(/href=["'`](.*?)["'`]/g)].map(m => m[1]);
  const tos = [...text.matchAll(/to=["'`](.*?)["'`]/g)].map(m => m[1]);
  for (const route of [...hrefs, ...tos]) {
    if (route && route.startsWith("/")) findings.routeReferences.push({ file, route });
  }

  if (/<button\b[^>]*>\s*<\/button>/i.test(text)) findings.buttonRisks.push({ id: "EMPTY_BUTTON", file });
  if (/aria-label=(["'])\s*\1/i.test(text)) findings.buttonRisks.push({ id: "EMPTY_ARIA_LABEL", file });
  if (/color:\s*['"]black['"]|text-black|#000000|#000\b/i.test(text)) findings.buttonRisks.push({ id: "BLACK_TEXT_CONTRAST_REVIEW", file });

  if (/--glp-|--lumi-|#4A7E72|#B8963E|#D4857A|#E8D5A0/i.test(text)) {
    findings.cssTokenFindings.push(file);
  }
}

for (const page of pages) {
  const text = fs.readFileSync(page, "utf8");
  findings.pages.push({
    file: page,
    hasSEO: /<SEO\b|SEO\s*\(/.test(text),
    hasWellnessShell: /WellnessPageShell/.test(text),
    hasEducationalBoundary: /educational|self-paced|reflection|wellness/i.test(text),
    hasClinicalBoundary: /not therapy|not a diagnosis|not medical care|not medical advice|not a substitute|licensed professional|professional care/i.test(text),
    hasCrisisRoute: /\/crisis|988|741741|Crisis/i.test(text),
    hasButtons: /<button\b|<Button\b/.test(text),
    hasLinks: /<Link\b|href=|to=/.test(text)
  });
}

for (const [base, list] of basenameMap.entries()) {
  const active = list.filter(f => !/_quarantine|backup|before|diagnostics/.test(f));
  if (active.length > 1 && /Page|Dashboard|Avatar|Shell|Engine|Service|Route|Provider|Journal|Reflection|Wellness|Lumi/i.test(base)) {
    findings.duplicateBasenameRisks.push({ basename: base, files: active });
  }
}

fs.writeFileSync(`${outDir}/platform-content-component-analysis.json`, JSON.stringify(findings, null, 2));
fs.writeFileSync(`${outDir}/page-coherence-table.tsv`, [
  "file\thasSEO\thasWellnessShell\thasEducationalBoundary\thasClinicalBoundary\thasCrisisRoute\thasButtons\thasLinks",
  ...findings.pages.map(p => `${p.file}\t${p.hasSEO}\t${p.hasWellnessShell}\t${p.hasEducationalBoundary}\t${p.hasClinicalBoundary}\t${p.hasCrisisRoute}\t${p.hasButtons}\t${p.hasLinks}`)
].join("\n") + "\n");

fs.writeFileSync(`${outDir}/clinical-claim-risks.txt`, findings.clinicalClaimRisks.map(x => `${x.id} ${x.file}`).join("\n") + (findings.clinicalClaimRisks.length ? "\n" : ""));
fs.writeFileSync(`${outDir}/business-healing-boundary-risks.txt`, findings.businessHealingBoundaryRisks.map(x => `${x.id} ${x.file}`).join("\n") + (findings.businessHealingBoundaryRisks.length ? "\n" : ""));
fs.writeFileSync(`${outDir}/lumi-findings.txt`, [...new Set(findings.lumiFindings)].sort().join("\n") + "\n");
fs.writeFileSync(`${outDir}/duplicate-basename-risks.txt`, findings.duplicateBasenameRisks.map(x => `${x.basename}\n${x.files.map(f => `  ${f}`).join("\n")}`).join("\n\n") + (findings.duplicateBasenameRisks.length ? "\n" : ""));
fs.writeFileSync(`${outDir}/route-references.txt`, findings.routeReferences.map(x => `${x.route}\t${x.file}`).join("\n") + "\n");
fs.writeFileSync(`${outDir}/button-risks.txt`, findings.buttonRisks.map(x => `${x.id} ${x.file}`).join("\n") + (findings.buttonRisks.length ? "\n" : ""));
fs.writeFileSync(`${outDir}/css-token-findings.txt`, [...new Set(findings.cssTokenFindings)].sort().join("\n") + "\n");

console.log("PHASE83_PLATFORM_ANALYSIS_COMPLETE");
console.log(JSON.stringify(findings.totals, null, 2));
console.log(`clinicalClaimRisks=${findings.clinicalClaimRisks.length}`);
console.log(`businessHealingBoundaryRisks=${findings.businessHealingBoundaryRisks.length}`);
console.log(`duplicateBasenameRisks=${findings.duplicateBasenameRisks.length}`);
console.log(`buttonRisks=${findings.buttonRisks.length}`);
console.log(`lumiFiles=${new Set(findings.lumiFindings).size}`);

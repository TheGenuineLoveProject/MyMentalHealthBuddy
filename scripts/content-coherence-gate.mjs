import fs from "node:fs";
import path from "node:path";

const roots = ["client/src/pages", "client/src/components", "client/src/content", "client/src/data"].filter(fs.existsSync);
const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".md"]);
const files = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["_quarantine", "node_modules", "dist", "build", ".git"].includes(item.name)) continue;
      walk(full);
    } else if (exts.has(path.extname(item.name))) {
      files.push(full);
    }
  }
}

for (const root of roots) walk(root);

const hardFailPatterns = [
  { id: "CURE_CLAIM", re: /\bcure(s|d)?\b/i },
  { id: "GUARANTEE_CLAIM", re: /\bguarantee(s|d)?\b/i },
  { id: "DIAGNOSIS_CLAIM", re: /\bwe diagnose\b|\bdiagnoses you\b/i },
  { id: "THERAPY_REPLACEMENT_CLAIM", re: /replacement for therapy|substitute for therapy/i },
  { id: "LITERAL_BRAIN_CHANGE_OVERCLAIM", re: /literally change your brain|literally rewires?|rewires? neural pathways|rewiring neural pathways/i },
  { id: "MILLION_DOLLAR_MARKETING_CLAIM", re: /make a million|million dollars in a month/i },
  { id: "UNBOUNDED_AI_CLAIM", re: /24\/7 AI wellness companion|unlimited AI chat sessions/i }
];

const softRequiredPatterns = [
  { id: "EDUCATIONAL_BOUNDARY", re: /educational|self-paced|reflection|wellness/i },
  { id: "NOT_CLINICAL_BOUNDARY", re: /not therapy|not a diagnosis|not medical care|not medical advice|not a substitute|licensed professional|professional care/i },
  { id: "CRISIS_RESOURCE", re: /\/crisis|988|741741|crisis/i }
];

const failures = [];
const warnings = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const p of hardFailPatterns) {
    if (p.re.test(text)) failures.push(`${p.id} ${file}`);
  }

  const isWellnessSurface = /wellness|healing|mood|journal|reflection|anxiety|trauma|grounding|meditation|breath|crisis|therapy|mental|emotional|provider/i.test(file + "\n" + text);
  if (isWellnessSurface) {
    for (const p of softRequiredPatterns) {
      if (!p.re.test(text)) warnings.push(`${p.id}_MISSING_OR_WEAK ${file}`);
    }
  }
}

fs.mkdirSync("diagnostics/phase82", { recursive: true });
fs.writeFileSync("diagnostics/phase82/content-coherence-gate-failures.txt", failures.join("\n") + (failures.length ? "\n" : ""));
fs.writeFileSync("diagnostics/phase82/content-coherence-gate-warnings.txt", warnings.join("\n") + (warnings.length ? "\n" : ""));

if (failures.length) {
  console.log("CONTENT_COHERENCE_GATE_FAIL");
  for (const f of failures.slice(0, 200)) console.log(f);
  process.exit(1);
}

console.log("CONTENT_COHERENCE_GATE_PASS");
console.log(`warnings=${warnings.length}`);
for (const w of warnings.slice(0, 120)) console.log(`WARN ${w}`);

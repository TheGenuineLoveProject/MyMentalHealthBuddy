import fs from "node:fs";
import path from "node:path";

const OUT = process.env.PLATFORM_EVOLUTION_OUT || "diagnostics/platform-evolution";
fs.mkdirSync(OUT, { recursive: true });

const roots = ["client/src", "server", "shared", "scripts", "docs/architecture", "docs/governance"];
const artifactRoots = [".agents", ".archive", "_quarantine", "data", "diagnostics", "logs", "reports", "screenshots", "client/dist", "dist"];
const requiredFiles = [".replit", "package.json", "server/app.mjs", "client/src/App.jsx"];
const requiredGates = ["scripts/check-links.mjs", "scripts/phase100-service-worker-cache-gate.mjs", "scripts/journal-db-schema-gate.mjs"];
const textExts = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".json", ".md", ".css", ".html", ".sql"]);
const incompleteTerms = ["TODO", "FIXME", "stub", "placeholder", "coming soon", "not implemented", "wire this", "temporary", "mock"];

function exists(file) {
  return fs.existsSync(file);
}

function walk(dir, files = []) {
  if (!exists(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).split(path.sep).join("/");
    if (entry.isDirectory()) {
      if (!["node_modules", ".git", ".local"].includes(entry.name)) walk(rel, files);
    } else {
      files.push(rel);
    }
  }
  return files;
}

function read(file) {
  try { return fs.readFileSync(file, "utf8"); } catch { return ""; }
}

const sourceFiles = roots.flatMap((root) => walk(root));
const textFiles = sourceFiles.filter((file) => textExts.has(path.extname(file)));

const incompleteMarkers = [];
for (const file of textFiles) {
  read(file).split(/\r?\n/).forEach((line, index) => {
    const lower = line.toLowerCase();
    if (incompleteTerms.some((term) => lower.includes(term.toLowerCase()))) {
      incompleteMarkers.push({ file, line: index + 1, text: line.trim().slice(0, 220) });
    }
  });
}

const duplicateMap = new Map();
for (const file of sourceFiles) {
  const ext = path.extname(file);
  if (![".js", ".jsx", ".ts", ".tsx", ".mjs"].includes(ext)) continue;
  const base = path.basename(file, ext).toLowerCase();
  if (!duplicateMap.has(base)) duplicateMap.set(base, []);
  duplicateMap.get(base).push(file);
}

const duplicateFamilies = [...duplicateMap.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([basename, files]) => ({ basename, files: files.sort() }));

const artifactFiles = artifactRoots.flatMap((root) => walk(root));
const serverApp = read("server/app.mjs");
const clientApp = read("client/src/App.jsx");
const routes = [...clientApp.matchAll(/path=["'`]([^"'`]+)["'`]/g)].map((m) => m[1]).sort();

const report = {
  generatedAt: new Date().toISOString(),
  mode: "AUDIT_ONLY_NO_MUTATION",
  requiredFilesMissing: requiredFiles.filter((file) => !exists(file)),
  requiredGatesMissing: requiredGates.filter((file) => !exists(file)),
  runtimeContracts: {
    hasProcessEnvPort: serverApp.includes("process.env.PORT"),
    hasListen: /listen\s*\(/.test(serverApp),
    hasHealth: serverApp.includes("/api/health") || serverApp.includes("/health"),
    hasReady: serverApp.includes("/api/ready") || serverApp.includes("/ready"),
    hasMetrics: serverApp.includes("/metrics"),
  },
  summary: {
    sourceFiles: sourceFiles.length,
    routes: routes.length,
    incompleteMarkers: incompleteMarkers.length,
    duplicateFamilies: duplicateFamilies.length,
    artifactFiles: artifactFiles.length,
  },
  routes,
  incompleteMarkers: incompleteMarkers.slice(0, 300),
  duplicateFamilies: duplicateFamilies.slice(0, 100),
  artifactPollution: artifactFiles.slice(0, 100),
};

let risk = 0;
risk += report.requiredFilesMissing.length * 25;
risk += report.requiredGatesMissing.length * 20;
risk += report.summary.artifactFiles > 0 ? 25 : 0;
risk += report.summary.incompleteMarkers > 200 ? 25 : Math.ceil(report.summary.incompleteMarkers / 10);
risk += report.summary.duplicateFamilies > 50 ? 20 : Math.ceil(report.summary.duplicateFamilies / 5);
for (const value of Object.values(report.runtimeContracts)) if (!value) risk += 10;

report.riskScore = Math.min(risk, 100);
report.status = report.riskScore >= 70
  ? "HIGH_RISK_REQUIRES_BLOCKER_REDUCTION"
  : report.riskScore >= 35
    ? "MODERATE_RISK_CONTINUE_ONE_COMPONENT_AT_A_TIME"
    : "LOW_RISK_READY_FOR_NEXT_COMPONENT_GATE";

fs.writeFileSync(`${OUT}/platform-evolution-audit.json`, JSON.stringify(report, null, 2));
fs.writeFileSync(`${OUT}/platform-evolution-audit.md`, `# Platform Evolution Audit\n\nRisk Score: ${report.riskScore}\n\nStatus: ${report.status}\n`);

console.log("PLATFORM_EVOLUTION_AUDIT_COMPLETE");
console.log(`RISK_SCORE=${report.riskScore}`);
console.log(`STATUS=${report.status}`);
console.log(`SOURCE_FILES=${report.summary.sourceFiles}`);
console.log(`ROUTES=${report.summary.routes}`);
console.log(`INCOMPLETE_MARKERS=${report.summary.incompleteMarkers}`);
console.log(`DUPLICATE_FAMILIES=${report.summary.duplicateFamilies}`);
console.log(`ARTIFACT_FILES=${report.summary.artifactFiles}`);

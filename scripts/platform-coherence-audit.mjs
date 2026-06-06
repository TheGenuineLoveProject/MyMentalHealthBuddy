import fs from "node:fs";
import path from "node:path";

const roots = ["client/src", "server", "scripts", "docs", "tests"].filter((p) => fs.existsSync(p));
const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".md"]);
const files = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", "dist", "build", ".git", ".cache", ".local", "production-backups", "backups"].includes(item.name)) continue;
      walk(full);
    } else if (exts.has(path.extname(item.name))) {
      files.push(full);
    }
  }
}

for (const root of roots) walk(root);

const textByFile = new Map(files.map((file) => [file, fs.readFileSync(file, "utf8")]));

const checks = [
  {
    name: "business_healing_firewall_language",
    pass: [...textByFile.values()].some((t) => /healing data|business.*healing|protected data|emotional monetization|not.*advertising/i.test(t))
  },
  {
    name: "clinical_boundary_language",
    pass: [...textByFile.values()].some((t) => /not therapy|not diagnosis|not a replacement|emergency|988|licensed provider|human supervision/i.test(t))
  },
  {
    name: "lumi_official_motion_markers",
    pass: [...textByFile.values()].some((t) => /MMHB_FLOAT|LumiBrandAvatar|MMHBFloatAvatar|motion\.img|official-lumi|segmented/i.test(t))
  },
  {
    name: "content_outcome_language",
    pass: [...textByFile.values()].some((t) => /calm|clarity|guided reflection|emotional regulation|self-awareness|grounding|wellness support/i.test(t))
  },
  {
    name: "governance_or_zero_drift_markers",
    pass: [...textByFile.values()].some((t) => /zero.?drift|canonical ownership|verification.first|smallest safe|rollback/i.test(t))
  }
];

const duplicateBasenames = new Map();
for (const file of files) {
  const base = path.basename(file).replace(/\.(jsx|tsx|js|ts|mjs|md)$/i, "");
  duplicateBasenames.set(base, [...(duplicateBasenames.get(base) || []), file]);
}

const duplicateRisks = [...duplicateBasenames.entries()]
  .filter(([base, list]) => list.length > 1 && /auth|stripe|billing|payment|lumi|avatar|provider|clinical|journal|emotion|mood|dashboard|route|router|ai|orchestrator|engine|service|governance|firewall|coherence|visual/i.test(base))
  .map(([base, list]) => ({ base, count: list.length, files: list }));

const result = {
  scannedFiles: files.length,
  checks,
  failedChecks: checks.filter((c) => !c.pass).map((c) => c.name),
  duplicateRiskCount: duplicateRisks.length,
  duplicateRisks: duplicateRisks.slice(0, 100)
};

fs.mkdirSync("diagnostics/phase81", { recursive: true });
fs.writeFileSync("diagnostics/phase81/platform-coherence-audit.json", JSON.stringify(result, null, 2) + "\n");

console.log(`scannedFiles=${result.scannedFiles}`);
for (const check of checks) console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
console.log(`duplicateRiskCount=${result.duplicateRiskCount}`);

if (result.failedChecks.length) process.exitCode = 1;

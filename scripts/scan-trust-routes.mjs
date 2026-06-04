#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const APP = resolve(ROOT, "client/src/App.jsx");
const TRUST_DIR = resolve(ROOT, "client/src/pages/trust");
const REGISTRY = resolve(ROOT, "client/src/content/trust/trustRegistry.js");

const errors = [];
const warnings = [];
const pass = [];

function check(label, cond, detail = "") {
  if (cond) pass.push(`PASS  ${label}`);
  else errors.push(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
}

if (!existsSync(APP)) {
  errors.push(`FAIL  App.jsx not found at ${APP}`);
} else {
  const app = readFileSync(APP, "utf8");

  const trustRouteMatches = app.match(/path="\/trust"/g) || [];
  const aiRouteMatches = app.match(/path="\/ai-transparency"/g) || [];
  const trustImports =
    app.match(/import\([^)]*pages\/trust\/TrustCenterPage\.jsx[^)]*\)/g) || [];
  const aiImports =
    app.match(/import\([^)]*pages\/trust\/AITransparencyPage\.jsx[^)]*\)/g) ||
    [];
  const trustDecls =
    app.match(/const\s+TrustCenterPage\s*=\s*lazy/g) || [];
  const aiDecls =
    app.match(/const\s+AITransparencyPage\s*=\s*lazy/g) || [];

  check("/trust route present", trustRouteMatches.length >= 1);
  check(
    "/trust route not duplicated (excluding redirects)",
    trustRouteMatches.length === 1,
    `found ${trustRouteMatches.length}`,
  );
  check("/ai-transparency route present", aiRouteMatches.length === 1, `found ${aiRouteMatches.length}`);

  check("TrustCenterPage lazy import uses .jsx", trustImports.length === 1, `found ${trustImports.length}`);
  check("AITransparencyPage lazy import uses .jsx", aiImports.length === 1, `found ${aiImports.length}`);

  check("TrustCenterPage declared exactly once", trustDecls.length === 1, `found ${trustDecls.length}`);
  check("AITransparencyPage declared exactly once", aiDecls.length === 1, `found ${aiDecls.length}`);

  if (/pages\/trust\/TrustCenterPage\.tsx/.test(app)) {
    errors.push("FAIL  App.jsx still references TrustCenterPage.tsx");
  } else {
    pass.push("PASS  No .tsx import for TrustCenterPage in App.jsx");
  }
  if (/pages\/trust\/AITransparencyPage\.tsx/.test(app)) {
    errors.push("FAIL  App.jsx still references AITransparencyPage.tsx");
  } else {
    pass.push("PASS  No .tsx import for AITransparencyPage in App.jsx");
  }
}

if (!existsSync(TRUST_DIR)) {
  errors.push(`FAIL  trust pages directory missing: ${TRUST_DIR}`);
} else {
  const files = readdirSync(TRUST_DIR);
  const tsxDupes = files.filter((f) => f.endsWith(".tsx"));
  check(
    "No .tsx duplicates in pages/trust/",
    tsxDupes.length === 0,
    `found ${tsxDupes.join(", ")}`,
  );
  check(
    "TrustCenterPage.jsx exists",
    files.includes("TrustCenterPage.jsx"),
  );
  check(
    "AITransparencyPage.jsx exists",
    files.includes("AITransparencyPage.jsx"),
  );
}

check(
  "trustRegistry.js exists",
  existsSync(REGISTRY),
);

const required = [
  "client/src/components/trust/TrustPageLayout.jsx",
  "client/src/components/trust/TrustSection.jsx",
];
for (const r of required) {
  check(`canonical component exists: ${r}`, existsSync(resolve(ROOT, r)));
}

const trustPagePaths = [
  ["TrustCenterPage", "client/src/pages/trust/TrustCenterPage.jsx"],
  ["AITransparencyPage", "client/src/pages/trust/AITransparencyPage.jsx"],
];
for (const [name, rel] of trustPagePaths) {
  const full = resolve(ROOT, rel);
  if (!existsSync(full)) {
    errors.push(`FAIL  ${name}: file missing at ${rel}`);
    continue;
  }
  const src = readFileSync(full, "utf8");

  check(
    `${name}: imports trustRegistry`,
    /from\s+['"][^'"]*content\/trust\/trustRegistry(\.js)?['"]/.test(src),
  );
  check(
    `${name}: imports Helmet from react-helmet-async`,
    /import\s*\{\s*Helmet\s*\}\s*from\s*['"]react-helmet-async['"]/.test(src),
  );
  check(
    `${name}: renders <Helmet>`,
    /<Helmet>/.test(src),
  );
  check(
    `${name}: sets <title>`,
    /<title>[\s\S]*?<\/title>/.test(src),
  );
  check(
    `${name}: sets meta description`,
    /<meta\s+name=["']description["']/.test(src),
  );
  check(
    `${name}: sets canonical link`,
    /<link\s+rel=["']canonical["']/.test(src),
  );
}

console.log("");
console.log("=== Phase 115 — Trust Route Governance Scan ===");
console.log("");
for (const p of pass) console.log("  " + p);
for (const w of warnings) console.log("  " + w);
for (const e of errors) console.log("  " + e);
console.log("");
console.log(`Summary: ${pass.length} pass, ${warnings.length} warn, ${errors.length} fail`);
console.log("");

process.exit(errors.length === 0 ? 0 : 1);

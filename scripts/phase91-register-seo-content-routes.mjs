import fs from "node:fs";
import path from "node:path";

const appPath = "client/src/App.jsx";
const outDir = "diagnostics/phase91";
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(appPath)) {
  console.error("FAIL: client/src/App.jsx not found");
  process.exit(1);
}

let source = fs.readFileSync(appPath, "utf8");
const original = source;

const candidates = [
  {
    name: "GlossaryPage",
    file: "client/src/pages/GlossaryPage.jsx",
    importPath: "./pages/GlossaryPage.jsx",
    route: "/glossary",
    intent: "SEO wellness terms and plain-language definitions",
  },
  {
    name: "WellnessGlossaryPage",
    file: "client/src/pages/WellnessGlossaryPage.jsx",
    importPath: "./pages/WellnessGlossaryPage.jsx",
    route: "/wellness-glossary",
    intent: "SEO wellness education glossary",
  },
  {
    name: "ResearchEvidencePage",
    file: "client/src/pages/ResearchEvidencePage.jsx",
    importPath: "./pages/ResearchEvidencePage.jsx",
    route: "/research-evidence",
    intent: "Trust and evidence credibility content",
  },
  {
    name: "ProfessionalResourcesPage",
    file: "client/src/pages/ProfessionalResourcesPage.jsx",
    importPath: "./pages/ProfessionalResourcesPage.jsx",
    route: "/professional-resources",
    intent: "Provider and professional credibility content",
  },
  {
    name: "HowToGuidesPage",
    file: "client/src/pages/HowToGuidesPage.jsx",
    importPath: "./pages/HowToGuidesPage.jsx",
    route: "/how-to-guides",
    intent: "Search-friendly practical wellness guide hub",
  },
  {
    name: "QAPage",
    file: "client/src/pages/QAPage.jsx",
    importPath: "./pages/QAPage.jsx",
    route: "/qa",
    intent: "Q&A educational search surface",
  },
  {
    name: "ExamplesPage",
    file: "client/src/pages/ExamplesPage.jsx",
    importPath: "./pages/ExamplesPage.jsx",
    route: "/examples",
    intent: "Examples and comprehension support",
  },
  {
    name: "HealthPage",
    file: "client/src/pages/HealthPage.jsx",
    importPath: "./pages/HealthPage.jsx",
    route: "/health",
    intent: "General wellness education route",
  },
  {
    name: "CalmingScenesPage",
    file: "client/src/pages/CalmingScenesPage.jsx",
    importPath: "./pages/CalmingScenesPage.jsx",
    route: "/calming-scenes",
    intent: "Calming visual wellness content",
  },
];

const eligible = candidates.filter((item) => fs.existsSync(item.file));
const missingFiles = candidates.filter((item) => !fs.existsSync(item.file));

const alreadyRegistered = [];
const addedImports = [];
const addedRoutes = [];

function hasLazyImport(name) {
  const re = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*(?:React\\.)?lazy\\s*\\(`);
  return re.test(source);
}

function hasRoute(route) {
  return source.includes(`path="${route}"`) || source.includes(`path='${route}'`);
}

function addImport(item) {
  if (hasLazyImport(item.name)) {
    return false;
  }

  const importLine = `const ${item.name} = lazy(() => import("${item.importPath}"));`;

  const lazyImportMatches = [...source.matchAll(/^const\s+\w+\s*=\s*lazy\(\(\)\s*=>\s*import\([^)]+\)\);?\s*$/gm)];
  if (lazyImportMatches.length > 0) {
    const last = lazyImportMatches[lazyImportMatches.length - 1];
    const insertAt = last.index + last[0].length;
    source = source.slice(0, insertAt) + `\n${importLine}` + source.slice(insertAt);
    addedImports.push(item.name);
    return true;
  }

  const reactImportMatch = source.match(/^import\s+.*?from\s+["']react["'];?\s*$/m);
  if (reactImportMatch) {
    const insertAt = reactImportMatch.index + reactImportMatch[0].length;
    source = source.slice(0, insertAt) + `\n${importLine}` + source.slice(insertAt);
    addedImports.push(item.name);
    return true;
  }

  throw new Error("No safe import anchor found in App.jsx");
}

function addRoute(item) {
  if (hasRoute(item.route)) {
    alreadyRegistered.push(item.route);
    return false;
  }

  const routeLine = `              <Route path="${item.route}" element={<${item.name} />} />`;

  const fallbackPatterns = [
    /^\s*<Route\s+path=["']\*["'][^>]*>/m,
    /^\s*<Route\s+path=["']\/\*["'][^>]*>/m,
  ];

  for (const pattern of fallbackPatterns) {
    const match = source.match(pattern);
    if (match && typeof match.index === "number") {
      source = source.slice(0, match.index) + `${routeLine}\n` + source.slice(match.index);
      addedRoutes.push(item.route);
      return true;
    }
  }

  const routesCloseIndex = source.lastIndexOf("</Routes>");
  if (routesCloseIndex !== -1) {
    source = source.slice(0, routesCloseIndex) + `${routeLine}\n` + source.slice(routesCloseIndex);
    addedRoutes.push(item.route);
    return true;
  }

  throw new Error("No safe route insertion anchor found in App.jsx");
}

for (const item of eligible) {
  addImport(item);
  addRoute(item);
}

if (source !== original) {
  fs.writeFileSync(appPath, source);
}

const summary = {
  generatedAt: new Date().toISOString(),
  candidates,
  eligible,
  missingFiles,
  addedImports,
  addedRoutes,
  alreadyRegistered,
  changed: source !== original,
};

fs.writeFileSync(`${outDir}/seo-route-registration-summary.json`, JSON.stringify(summary, null, 2));

const md = [
  "# Phase 91 SEO Content Route Registration",
  "",
  "## Objective",
  "Register already-built SEO/content pages only. No new feature expansion.",
  "",
  "## Added Routes",
  "",
  ...addedRoutes.map((route) => `- ${route}`),
  "",
  "## Added Imports",
  "",
  ...addedImports.map((name) => `- ${name}`),
  "",
  "## Already Registered",
  "",
  ...alreadyRegistered.map((route) => `- ${route}`),
  "",
  "## Missing Candidate Files",
  "",
  ...missingFiles.map((item) => `- ${item.file}`),
  "",
  "## Boundary",
  "- No duplicate cleanup",
  "- No visual redesign",
  "- No server route expansion",
  "- No monetization expansion",
].join("\n");

fs.writeFileSync(`${outDir}/seo-route-registration-summary.md`, md);
fs.writeFileSync("docs/architecture/PHASE91_SEO_CONTENT_ROUTE_REGISTRATION.md", md);

console.log(JSON.stringify(summary, null, 2));

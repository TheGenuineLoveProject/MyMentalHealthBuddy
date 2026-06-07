import fs from "node:fs";

const appPath = "client/src/App.jsx";
if (!fs.existsSync(appPath)) throw new Error("Missing client/src/App.jsx");

let src = fs.readFileSync(appPath, "utf8");
const original = src;

const requiredPages = [
  { name: "GlossaryPage", importPath: "./pages/GlossaryPage.jsx", route: "/glossary" },
  { name: "WellnessGlossaryPage", importPath: "./pages/WellnessGlossaryPage.jsx", route: "/wellness-glossary" },
  { name: "ResearchEvidencePage", importPath: "./pages/ResearchEvidencePage.jsx", route: "/research-evidence" },
  { name: "ProfessionalResourcesPage", importPath: "./pages/ProfessionalResourcesPage.jsx", route: "/professional-resources" },
  { name: "HowToGuidesPage", importPath: "./pages/HowToGuidesPage.jsx", route: "/how-to-guides" },
  { name: "QAPage", importPath: "./pages/QAPage.jsx", route: "/qa" },
  { name: "ExamplesPage", importPath: "./pages/ExamplesPage.jsx", route: "/examples" },
  { name: "HealthPage", importPath: "./pages/HealthPage.jsx", route: "/health" },
  { name: "CalmingScenesPage", importPath: "./pages/CalmingScenesPage.jsx", route: "/calming-scenes" },
];

const discoveryImport = 'import SEOContentDiscoveryRail from "./components/navigation/SEOContentDiscoveryRail.jsx";';

function insertAfterLastImport(text, line) {
  if (text.includes(line)) return text;
  const imports = [...text.matchAll(/^import .*?;$/gm)];
  if (!imports.length) throw new Error("No import block found");
  const last = imports[imports.length - 1];
  const idx = last.index + last[0].length;
  return `${text.slice(0, idx)}\n${line}${text.slice(idx)}`;
}

src = insertAfterLastImport(src, discoveryImport);

for (const page of requiredPages) {
  const lazyLine = `const ${page.name} = lazy(() => import("${page.importPath}"));`;
  const hasLazy = new RegExp(`(?:const|let|var)\\s+${page.name}\\s*=\\s*(?:React\\.)?lazy\\s*\\(`).test(src);
  if (!hasLazy) {
    const lazyImports = [...src.matchAll(/^const\s+\w+\s*=\s*lazy\(\(\)\s*=>\s*import\([^)]+\)\);?\s*$/gm)];
    if (lazyImports.length) {
      const last = lazyImports[lazyImports.length - 1];
      const idx = last.index + last[0].length;
      src = `${src.slice(0, idx)}\n${lazyLine}${src.slice(idx)}`;
    } else {
      src = insertAfterLastImport(src, lazyLine);
    }
  }
}

const routeLines = requiredPages
  .filter((page) => !src.includes(`path="${page.route}"`) && !src.includes(`path='${page.route}'`))
  .map((page) => `              <Route path="${page.route}" element={<${page.name} />} />`);

if (routeLines.length) {
  const wildcardRoute = src.match(/^\s*<Route\s+path=["']\*["'][^>]*>.*$/m);
  if (wildcardRoute?.index !== undefined) {
    src = `${src.slice(0, wildcardRoute.index)}${routeLines.join("\n")}\n${src.slice(wildcardRoute.index)}`;
  } else {
    const routesClose = src.lastIndexOf("</Routes>");
    if (routesClose === -1) throw new Error("No </Routes> anchor found");
    src = `${src.slice(0, routesClose)}${routeLines.join("\n")}\n${src.slice(routesClose)}`;
  }
}

if (!src.includes("<SEOContentDiscoveryRail />")) {
  const routesOpen = src.indexOf("<Routes");
  if (routesOpen !== -1) {
    src = `${src.slice(0, routesOpen)}<SEOContentDiscoveryRail />\n${src.slice(routesOpen)}`;
  } else {
    const routesClose = src.lastIndexOf("</Routes>");
    if (routesClose === -1) throw new Error("No Routes anchor found for discovery rail");
    const afterRoutes = routesClose + "</Routes>".length;
    src = `${src.slice(0, afterRoutes)}\n<SEOContentDiscoveryRail />${src.slice(afterRoutes)}`;
  }
}

fs.writeFileSync(appPath, src);

const summary = {
  changed: src !== original,
  requiredRoutes: requiredPages.map((page) => page.route),
  discoveryRailPresent: src.includes("<SEOContentDiscoveryRail />"),
  importPresent: src.includes(discoveryImport),
};

fs.writeFileSync("diagnostics/phase93c/app-repair-summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

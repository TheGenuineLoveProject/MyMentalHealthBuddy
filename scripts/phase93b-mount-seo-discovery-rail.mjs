import fs from "node:fs";

const appPath = "client/src/App.jsx";
if (!fs.existsSync(appPath)) throw new Error("Missing client/src/App.jsx");

let src = fs.readFileSync(appPath, "utf8");
const original = src;

const importLine = 'import SEOContentDiscoveryRail from "./components/navigation/SEOContentDiscoveryRail.jsx";';

if (!src.includes(importLine)) {
  const importMatches = [...src.matchAll(/^import .*?;$/gm)];
  if (!importMatches.length) throw new Error("No import block found in App.jsx");
  const lastImport = importMatches[importMatches.length - 1];
  const insertAt = lastImport.index + lastImport[0].length;
  src = `${src.slice(0, insertAt)}\n${importLine}${src.slice(insertAt)}`;
}

if (!src.includes("<SEOContentDiscoveryRail />")) {
  const closeCandidates = ["</BrowserRouter>", "</Router>"];
  let patched = false;

  for (const closing of closeCandidates) {
    const idx = src.lastIndexOf(closing);
    if (idx !== -1) {
      src = `${src.slice(0, idx)}      <SEOContentDiscoveryRail />\n${src.slice(idx)}`;
      patched = true;
      break;
    }
  }

  if (!patched) {
    const routesClose = src.lastIndexOf("</Routes>");
    if (routesClose !== -1) {
      const afterRoutes = routesClose + "</Routes>".length;
      src = `${src.slice(0, afterRoutes)}\n      <SEOContentDiscoveryRail />${src.slice(afterRoutes)}`;
      patched = true;
    }
  }

  if (!patched) throw new Error("No safe Router/Routes insertion point found for SEOContentDiscoveryRail");
}

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log("SEO_DISCOVERY_RAIL_MOUNTED");
} else {
  console.log("SEO_DISCOVERY_RAIL_ALREADY_PRESENT");
}

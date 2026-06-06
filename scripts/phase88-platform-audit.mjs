import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = "diagnostics/phase88";
fs.mkdirSync(OUT, { recursive: true });

const exists = (p) => fs.existsSync(p);
const read = (p) => exists(p) ? fs.readFileSync(p, "utf8") : "";
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

const skipDirs = new Set([
  ".git",
  "node_modules",
  "client/dist",
  "dist",
  ".cache",
  ".local/state",
]);

function shouldSkip(full) {
  const norm = rel(full);
  return [...skipDirs].some((d) => norm === d || norm.startsWith(`${d}/`));
}

function walk(dir, acc = []) {
  if (!exists(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (shouldSkip(full)) continue;
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function write(name, data) {
  fs.writeFileSync(path.join(OUT, name), data);
}

const allFiles = walk(ROOT);
const codeFiles = allFiles.filter((f) => /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(f));
const clientFiles = allFiles.filter((f) => rel(f).startsWith("client/src/"));
const pageFiles = clientFiles.filter((f) => /\/pages\/.*\.(jsx|tsx|js|ts)$/.test(rel(f)));
const componentFiles = clientFiles.filter((f) => /\/components\/.*\.(jsx|tsx|js|ts)$/.test(rel(f)));
const serverRouteFiles = allFiles.filter((f) => /^server\/routes\/.*\.mjs$/.test(rel(f)));
const styleFiles = allFiles.filter((f) => /\.(css|scss|sass)$/.test(f) && !shouldSkip(f));

const appFile = "client/src/App.jsx";
const appSource = read(appFile);
const serverApp = read("server/app.mjs");

const routeMatches = [...appSource.matchAll(/<Route\b[^>]*\bpath=["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
const lazyMatches = [...appSource.matchAll(/(?:lazy\(\s*\(\)\s*=>\s*import\(["'`]([^"'`]+)["'`]\)|import\(["'`]([^"'`]+)["'`]\))/g)]
  .map((m) => m[1] || m[2])
  .filter(Boolean);

const mountedServerRoutes = [...serverApp.matchAll(/app\.use\(\s*["'`]([^"'`]+)["'`]\s*,\s*([A-Za-z0-9_$]+)/g)]
  .map((m) => ({ path: m[1], handler: m[2] }));

const apiHandlersImported = [...serverApp.matchAll(/import\s+([A-Za-z0-9_$]+)\s+from\s+["'`](\.\/routes\/[^"'`]+)["'`]/g)]
  .map((m) => ({ handler: m[1], source: m[2] }));

const serverRouteBasenames = serverRouteFiles.map((f) => path.basename(f, ".mjs"));
const mountedRouteSources = new Set(apiHandlersImported
  .filter((imp) => mountedServerRoutes.some((mount) => mount.handler === imp.handler))
  .map((imp) => imp.source.replace("./routes/", "").replace(/\.mjs$/, "")));

const likelyUnmountedServerRoutes = serverRouteBasenames
  .filter((name) => !mountedRouteSources.has(name))
  .map((name) => `server/routes/${name}.mjs`);

const appReferencedText = appSource + "\n" + lazyMatches.join("\n");
const likelyOrphanPages = pageFiles.filter((file) => {
  const base = path.basename(file).replace(/\.(jsx|tsx|js|ts)$/, "");
  const relativeImport = rel(file).replace(/^client\/src\//, "./");
  return !appReferencedText.includes(base) && !appReferencedText.includes(relativeImport);
}).map(rel);

const duplicateGroups = new Map();
for (const file of [...pageFiles, ...componentFiles]) {
  const base = path.basename(file).replace(/\.(jsx|tsx|js|ts)$/, "");
  const key = `${path.dirname(rel(file)).replace(/^client\/src\//, "")}/${base}`.toLowerCase();
  if (!duplicateGroups.has(key)) duplicateGroups.set(key, []);
  duplicateGroups.get(key).push(rel(file));
}
const duplicateComponents = [...duplicateGroups.values()].filter((group) => group.length > 1);

const rootShadowDirs = ["src", "components", "pages", "api", "app"]
  .filter((d) => exists(d))
  .map((d) => {
    const files = walk(d).filter((f) => !shouldSkip(f));
    return { dir: d, files: files.length };
  });

const topLevelClutter = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => /\.(txt|log|bak|backup)$/.test(name) || name === "bundle-report.html" || /build.*\.log$/.test(name));

const markers = [
  "TODO",
  "FIXME",
  "stub",
  "placeholder",
  "coming soon",
  "not implemented",
  "wire this",
  "mock",
  "temporary",
  "dummy",
  "lorem",
  "ipsum",
];

const markerFindings = [];
for (const file of codeFiles.filter((f) => !rel(f).startsWith("diagnostics/"))) {
  const src = read(file);
  const lines = src.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    for (const marker of markers) {
      if (lower.includes(marker.toLowerCase())) {
        markerFindings.push(`${rel(file)}:${idx + 1}: ${line.trim().slice(0, 240)}`);
        break;
      }
    }
  });
}

const suspiciousButtons = [];
for (const file of clientFiles.filter((f) => /\.(jsx|tsx|js|ts)$/.test(f))) {
  const src = read(file);
  const buttonRegexes = [
    /<button\b([^>]*)>([\s\S]*?)<\/button>/g,
    /<Button\b([^>]*)>([\s\S]*?)<\/Button>/g,
  ];
  for (const regex of buttonRegexes) {
    let match;
    while ((match = regex.exec(src))) {
      const attrs = match[1] || "";
      const body = (match[2] || "").replace(/<[^>]+>/g, "").replace(/\{[^}]+\}/g, "").trim();
      const hasAria = /aria-label=/.test(attrs);
      const hasTitle = /title=/.test(attrs);
      if (!body && !hasAria && !hasTitle) {
        suspiciousButtons.push(`${rel(file)}: button lacks visible text/aria-label/title`);
      }
    }
  }
}

const officialPalette = new Set([
  "#4A7E72", "#B8963E", "#D4857A", "#E8D5A0",
  "#DDE7D5", "#C7D8BC", "#AFC6A1", "#90AF85",
  "#FFF9F2", "#F7F0E8", "#EFE5D7",
  "#FFD46B", "#F6C14B", "#E2AA2B",
  "#FFD6DA", "#F9BEC5",
  "#AEE9FF", "#77D8FF",
].map((c) => c.toLowerCase()));

const hexFindings = [];
for (const file of [...styleFiles, ...clientFiles.filter((f) => /\.(jsx|tsx|js|ts)$/.test(f))]) {
  const src = read(file);
  const matches = [...src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
  const offPalette = [...new Set(matches.filter((hex) => !officialPalette.has(hex.toLowerCase())))]
    .slice(0, 50);
  if (offPalette.length) {
    hexFindings.push(`${rel(file)} -> ${offPalette.join(", ")}`);
  }
}

const lumiFiles = allFiles.filter((f) => /lumi|avatar|MMHB_FLOAT_IDLE_UNIT/i.test(rel(f))).map(rel);
const lumiReferences = [];
for (const file of clientFiles.filter((f) => /\.(jsx|tsx|js|ts|css)$/.test(f))) {
  const src = read(file);
  if (/Lumi|avatar|MMHB_FLOAT_IDLE_UNIT|lumi-brand|lumi-presence/i.test(src)) {
    lumiReferences.push(rel(file));
  }
}

const routeRegistry = routeMatches.map((route) => route).sort();
const routeDuplicates = [...new Set(routeRegistry.filter((r, i, arr) => arr.indexOf(r) !== i))];

const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    allFiles: allFiles.length,
    codeFiles: codeFiles.length,
    clientFiles: clientFiles.length,
    pageFiles: pageFiles.length,
    componentFiles: componentFiles.length,
    frontendRoutesInApp: routeMatches.length,
    lazyImportsInApp: lazyMatches.length,
    serverRouteFiles: serverRouteFiles.length,
    mountedServerRoutes: mountedServerRoutes.length,
    likelyUnmountedServerRoutes: likelyUnmountedServerRoutes.length,
    likelyOrphanPages: likelyOrphanPages.length,
    duplicateComponentGroups: duplicateComponents.length,
    rootShadowDirs: rootShadowDirs.length,
    topLevelClutterFiles: topLevelClutter.length,
    markerFindings: markerFindings.length,
    suspiciousButtons: suspiciousButtons.length,
    offPaletteFiles: hexFindings.length,
    lumiFiles: lumiFiles.length,
    lumiReferences: lumiReferences.length,
    duplicateFrontendRoutes: routeDuplicates.length,
  },
  rootShadowDirs,
  mountedServerRoutes,
  likelyUnmountedServerRoutes,
  routeDuplicates,
  topLevelClutter,
};

write("platform-audit-summary.json", JSON.stringify(summary, null, 2));
write("frontend-routes.txt", routeRegistry.join("\n") + "\n");
write("frontend-route-duplicates.txt", routeDuplicates.join("\n") + "\n");
write("lazy-imports.txt", lazyMatches.sort().join("\n") + "\n");
write("server-route-files.txt", serverRouteFiles.map(rel).sort().join("\n") + "\n");
write("server-mounted-routes.json", JSON.stringify(mountedServerRoutes, null, 2));
write("likely-unmounted-server-routes.txt", likelyUnmountedServerRoutes.sort().join("\n") + "\n");
write("page-files.txt", pageFiles.map(rel).sort().join("\n") + "\n");
write("likely-orphan-pages.txt", likelyOrphanPages.sort().join("\n") + "\n");
write("duplicate-component-groups.txt", duplicateComponents.map((g) => g.join("\n")).join("\n---\n") + "\n");
write("root-shadow-directories.json", JSON.stringify(rootShadowDirs, null, 2));
write("top-level-clutter-files.txt", topLevelClutter.sort().join("\n") + "\n");
write("todo-placeholder-stub-findings.txt", markerFindings.sort().join("\n") + "\n");
write("button-label-risk-findings.txt", suspiciousButtons.sort().join("\n") + "\n");
write("off-palette-hex-findings.txt", hexFindings.sort().join("\n") + "\n");
write("lumi-files.txt", lumiFiles.sort().join("\n") + "\n");
write("lumi-references.txt", lumiReferences.sort().join("\n") + "\n");

const md = `# Phase 88 A-Z 360 Platform Audit

## Purpose
Create a verified, non-mutating audit of platform structure, components, content, routing, visual system, Lumi/avatar usage, duplicate risk, stale surfaces, and coherence gaps before the next implementation phase.

## Counts
- All files scanned: ${summary.counts.allFiles}
- Code files scanned: ${summary.counts.codeFiles}
- Client files: ${summary.counts.clientFiles}
- Page files: ${summary.counts.pageFiles}
- Component files: ${summary.counts.componentFiles}
- Frontend routes in App.jsx: ${summary.counts.frontendRoutesInApp}
- Lazy imports in App.jsx: ${summary.counts.lazyImportsInApp}
- Server route modules: ${summary.counts.serverRouteFiles}
- Mounted server routes: ${summary.counts.mountedServerRoutes}
- Likely unmounted server route modules: ${summary.counts.likelyUnmountedServerRoutes}
- Likely orphan frontend pages: ${summary.counts.likelyOrphanPages}
- Duplicate component/page groups: ${summary.counts.duplicateComponentGroups}
- Root shadow directories: ${summary.counts.rootShadowDirs}
- Top-level clutter files: ${summary.counts.topLevelClutterFiles}
- TODO/FIXME/stub/placeholder findings: ${summary.counts.markerFindings}
- Button visible-label risk findings: ${summary.counts.suspiciousButtons}
- Off-palette visual files: ${summary.counts.offPaletteFiles}
- Lumi/avatar files: ${summary.counts.lumiFiles}
- Lumi/avatar references: ${summary.counts.lumiReferences}
- Duplicate frontend route paths: ${summary.counts.duplicateFrontendRoutes}

## Priority Interpretation
P0: Any build, route, health, ready, or mounted API route failure.
P1: Built SEO/content pages that are still orphaned.
P2: Duplicate components and shadow root trees.
P3: Placeholder/stub content and incomplete user-facing journeys.
P4: Visual palette drift, button visibility risks, and Lumi/avatar consistency audits.

## Generated Evidence Files
- diagnostics/phase88/platform-audit-summary.json
- diagnostics/phase88/frontend-routes.txt
- diagnostics/phase88/frontend-route-duplicates.txt
- diagnostics/phase88/lazy-imports.txt
- diagnostics/phase88/server-route-files.txt
- diagnostics/phase88/server-mounted-routes.json
- diagnostics/phase88/likely-unmounted-server-routes.txt
- diagnostics/phase88/page-files.txt
- diagnostics/phase88/likely-orphan-pages.txt
- diagnostics/phase88/duplicate-component-groups.txt
- diagnostics/phase88/root-shadow-directories.json
- diagnostics/phase88/top-level-clutter-files.txt
- diagnostics/phase88/todo-placeholder-stub-findings.txt
- diagnostics/phase88/button-label-risk-findings.txt
- diagnostics/phase88/off-palette-hex-findings.txt
- diagnostics/phase88/lumi-files.txt
- diagnostics/phase88/lumi-references.txt
`;

write("PLATFORM_AUDIT_PHASE88.md", md);
fs.mkdirSync("docs/architecture", { recursive: true });
fs.writeFileSync("docs/architecture/PLATFORM_AUDIT_PHASE88.md", md);

console.log(JSON.stringify(summary, null, 2));

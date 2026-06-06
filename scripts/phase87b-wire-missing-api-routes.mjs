import fs from "node:fs";

const appPath = "server/app.mjs";

const routes = [
  {
    label: "gamification",
    file: "server/routes/gamification.mjs",
    importName: "gamificationRoutes",
    importLine: 'import gamificationRoutes from "./routes/gamification.mjs";',
    mountLine: 'app.use("/api/gamification", gamificationRoutes);',
    mountToken: '"/api/gamification"',
  },
  {
    label: "analytics-events",
    file: "server/routes/analytics-events.mjs",
    importName: "analyticsEventsRoutes",
    importLine: 'import analyticsEventsRoutes from "./routes/analytics-events.mjs";',
    mountLine: 'app.use("/api/analytics", analyticsEventsRoutes);',
    mountToken: '"/api/analytics"',
  },
  {
    label: "blog",
    file: "server/routes/blog.mjs",
    importName: "blogRoutes",
    importLine: 'import blogRoutes from "./routes/blog.mjs";',
    mountLine: 'app.use("/api/blog", blogRoutes);',
    mountToken: '"/api/blog"',
  },
];

if (!fs.existsSync(appPath)) throw new Error("MISSING server/app.mjs");

let app = fs.readFileSync(appPath, "utf8");
const original = app;

for (const route of routes) {
  if (!fs.existsSync(route.file)) {
    throw new Error(`MISSING ${route.file}`);
  }

  const source = fs.readFileSync(route.file, "utf8");
  if (!source.includes("export default")) {
    throw new Error(`NO_DEFAULT_EXPORT ${route.file}`);
  }
}

const importMatches = [...app.matchAll(/^import .*?;$/gm)];
if (!importMatches.length) {
  throw new Error("NO_IMPORT_BLOCK_FOUND");
}

const importsToAdd = routes
  .filter((route) => !app.includes(route.importLine))
  .map((route) => route.importLine);

if (importsToAdd.length) {
  const lastImport = importMatches[importMatches.length - 1];
  const insertAt = lastImport.index + lastImport[0].length;
  app = app.slice(0, insertAt) + "\n" + importsToAdd.join("\n") + app.slice(insertAt);
}

const mountsToAdd = routes
  .filter((route) => !app.includes(route.mountToken))
  .map((route) => route.mountLine);

if (mountsToAdd.length) {
  const fallbackPatterns = [
    /\n\s*app\.use\(\s*\(\s*req\s*,\s*res\s*,\s*next\s*\)\s*=>/m,
    /\n\s*app\.use\(\s*["']\*["']/m,
    /\n\s*app\.get\(\s*["']\*["']/m,
    /\n\s*app\.use\(\s*express\.static/m,
    /\n\s*const\s+PORT\s*=/m,
    /\n\s*app\.listen\(/m,
  ];

  let insertIndex = -1;
  for (const pattern of fallbackPatterns) {
    const match = pattern.exec(app);
    if (match) {
      insertIndex = match.index;
      break;
    }
  }

  if (insertIndex === -1) {
    const appUseMatches = [...app.matchAll(/^app\.use\(.*?;\s*$/gm)];
    if (!appUseMatches.length) throw new Error("NO_SAFE_MOUNT_INSERTION_POINT");
    const lastMount = appUseMatches[appUseMatches.length - 1];
    insertIndex = lastMount.index + lastMount[0].length;
  }

  const block = [
    "",
    "// Phase 87B: mounted previously orphaned API route modules.",
    ...mountsToAdd,
    "",
  ].join("\n");

  app = app.slice(0, insertIndex) + block + app.slice(insertIndex);
}

if (app === original) {
  console.log("NO_PATCH_NEEDED");
} else {
  fs.writeFileSync(appPath, app);
  console.log("PATCH_APPLIED");
}

for (const route of routes) {
  console.log(`${route.mountToken}=${app.includes(route.mountToken) ? "PRESENT" : "MISSING"}`);
}

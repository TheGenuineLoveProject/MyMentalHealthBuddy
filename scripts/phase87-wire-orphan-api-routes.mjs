import fs from "node:fs";

const appPath = "server/app.mjs";

const targets = [
  {
    label: "gamification",
    file: "server/routes/gamification.mjs",
    importName: "gamificationRoutes",
    importLine: 'import gamificationRoutes from "./routes/gamification.mjs";',
    mountPath: "/api/gamification",
  },
  {
    label: "analytics-events",
    file: "server/routes/analytics-events.mjs",
    importName: "analyticsEventsRoutes",
    importLine: 'import analyticsEventsRoutes from "./routes/analytics-events.mjs";',
    mountPath: "/api/analytics",
  },
  {
    label: "blog",
    file: "server/routes/blog.mjs",
    importName: "blogRoutes",
    importLine: 'import blogRoutes from "./routes/blog.mjs";',
    mountPath: "/api/blog",
  },
];

if (!fs.existsSync(appPath)) {
  throw new Error(`Missing ${appPath}`);
}

let app = fs.readFileSync(appPath, "utf8");
const original = app;

const missingFiles = targets.filter((target) => !fs.existsSync(target.file));
if (missingFiles.length) {
  throw new Error(`Missing route files: ${missingFiles.map((target) => target.file).join(", ")}`);
}

for (const target of targets) {
  const routeSource = fs.readFileSync(target.file, "utf8");
  if (!routeSource.includes("export default")) {
    throw new Error(`${target.file} does not expose an export default; refusing blind mount`);
  }
}

if (!/\bapp\s*=\s*express\s*\(|\bconst\s+app\s*=\s*express\s*\(|\blet\s+app\s*=\s*express\s*\(/.test(app)) {
  throw new Error("Could not verify Express app variable named app; refusing blind patch");
}

const importInsertions = [];
for (const target of targets) {
  if (!app.includes(target.importLine) && !new RegExp(`import\\s+${target.importName}\\s+from\\s+["']\\.\\/routes\\/`).test(app)) {
    importInsertions.push(target.importLine);
  }
}

if (importInsertions.length) {
  const importMatches = [...app.matchAll(/^import .*?;$/gm)];
  if (!importMatches.length) {
    throw new Error("No ESM import block found in server/app.mjs; refusing blind import insertion");
  }

  const lastImport = importMatches[importMatches.length - 1];
  const insertAt = lastImport.index + lastImport[0].length;
  app = `${app.slice(0, insertAt)}\n${importInsertions.join("\n")}${app.slice(insertAt)}`;
}

const mountLines = [];
for (const target of targets) {
  const mountRegex = new RegExp(`app\\.use\\(\\s*["']${target.mountPath.replace(/\//g, "\\/")}["']`);
  if (!mountRegex.test(app)) {
    mountLines.push(`app.use("${target.mountPath}", ${target.importName});`);
  }
}

if (mountLines.length) {
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
    const existingMounts = [...app.matchAll(/^app\.use\([^;]+;\s*$/gm)];
    if (!existingMounts.length) {
      throw new Error("Could not find safe mount insertion point; refusing blind patch");
    }
    const lastMount = existingMounts[existingMounts.length - 1];
    insertIndex = lastMount.index + lastMount[0].length;
  }

  const block = [
    "",
    "// Phase 87: mounted previously orphaned API route modules.",
    ...mountLines,
    "",
  ].join("\n");

  app = `${app.slice(0, insertIndex)}${block}${app.slice(insertIndex)}`;
}

if (app === original) {
  console.log("NO_PATCH_NEEDED");
} else {
  fs.writeFileSync(appPath, app);
  console.log("PATCH_APPLIED");
  for (const target of targets) {
    console.log(`${target.mountPath} -> ${target.file}`);
  }
}

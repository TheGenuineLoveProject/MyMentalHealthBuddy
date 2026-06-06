import fs from "node:fs";

const appPath = "server/app.mjs";

const imports = [
  'import gamificationRoutes from "./routes/gamification.mjs";',
  'import analyticsEventsRoutes from "./routes/analytics-events.mjs";',
  'import blogRoutes from "./routes/blog.mjs";',
];

const mounts = [
  'app.use("/api/gamification", gamificationRoutes);',
  'app.use("/api/analytics", analyticsEventsRoutes);',
  'app.use("/api/blog", blogRoutes);',
];

if (!fs.existsSync(appPath)) throw new Error("MISSING server/app.mjs");

for (const routeFile of [
  "server/routes/gamification.mjs",
  "server/routes/analytics-events.mjs",
  "server/routes/blog.mjs",
]) {
  if (!fs.existsSync(routeFile)) throw new Error(`MISSING ${routeFile}`);
  const src = fs.readFileSync(routeFile, "utf8");
  if (!src.includes("export default")) throw new Error(`NO_DEFAULT_EXPORT ${routeFile}`);
}

let src = fs.readFileSync(appPath, "utf8");

for (const line of imports) {
  src = src.replaceAll(`${line}\n`, "");
  src = src.replaceAll(`\n${line}`, "");
}

for (const line of mounts) {
  src = src.replaceAll(`${line}\n`, "");
  src = src.replaceAll(`\n${line}`, "");
}

src = src.replaceAll("// Phase 87: mounted previously orphaned API route modules.\n", "");
src = src.replaceAll("// Phase 87B: mounted previously orphaned API route modules.\n", "");
src = src.replaceAll("// Phase 87C: mounted previously orphaned API route modules.\n", "");

const importMatches = [...src.matchAll(/^import .*?;$/gm)];
if (!importMatches.length) throw new Error("NO_IMPORT_BLOCK_FOUND");

const lastImport = importMatches[importMatches.length - 1];
const importInsertAt = lastImport.index + lastImport[0].length;
src = `${src.slice(0, importInsertAt)}\n${imports.join("\n")}${src.slice(importInsertAt)}`;

const mountBlock = [
  "",
  "// Phase 87C: mounted previously orphaned API route modules.",
  ...mounts,
  "",
].join("\n");

const staticMatch = /\n\s*app\.use\(\s*express\.static\(/m.exec(src);
const catchAllMatch = /\n\s*app\.get\(\s*["']\*["']/m.exec(src);
const portMatch = /\n\s*const\s+PORT\s*=/m.exec(src);
const listenMatch = /\n\s*app\.listen\(/m.exec(src);

let mountInsertAt = -1;

if (staticMatch) mountInsertAt = staticMatch.index;
else if (catchAllMatch) mountInsertAt = catchAllMatch.index;
else if (portMatch) mountInsertAt = portMatch.index;
else if (listenMatch) mountInsertAt = listenMatch.index;

if (mountInsertAt === -1) throw new Error("NO_SAFE_MOUNT_INSERTION_POINT");

src = `${src.slice(0, mountInsertAt)}${mountBlock}${src.slice(mountInsertAt)}`;

fs.writeFileSync(appPath, src);

console.log("PHASE87C_REPAIR_APPLIED");
console.log("imports=PRESENT");
console.log("mounts=PRESENT");

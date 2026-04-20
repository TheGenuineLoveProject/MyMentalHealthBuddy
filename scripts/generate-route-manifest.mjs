import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROUTES_DIR = path.join(ROOT, "server", "routes");
const OUTPUT_FILE = path.join(ROOT, "docs", "ROUTE_MANIFEST.json");

const EXCLUDED_DIRS = new Set([
  "__backup",
  "node_modules",
  ".git"
]);

const EXCLUDED_FILE_PATTERNS = [
  /\.bak(\..*)?$/i,
  /\.backup(\..*)?$/i
];

const ROUTE_REGEX =
  /router\.(get|post|put|patch|delete)\s*\(\s*["'`](.*?)["'`]/g;

function shouldSkipFile(fileName) {
  return EXCLUDED_FILE_PATTERNS.some((rx) => rx.test(fileName));
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        files = files.concat(walk(fullPath));
      }
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".mjs") &&
      !shouldSkipFile(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractRoutes(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const routes = [];
  let match;

  while ((match = ROUTE_REGEX.exec(source)) !== null) {
    routes.push({
      method: match[1].toUpperCase(),
      path: match[2],
      file: path.relative(ROOT, filePath).replace(/\\/g, "/")
    });
  }

  return routes;
}

function main() {
  if (!fs.existsSync(ROUTES_DIR)) {
    throw new Error(`Missing routes directory: ${ROUTES_DIR}`);
  }

  const files = walk(ROUTES_DIR);
  let routes = [];

  for (const file of files) {
    routes = routes.concat(extractRoutes(file));
  }

  routes.sort((a, b) => {
    const left = `${a.method} ${a.path} ${a.file}`;
    const right = `${b.method} ${b.path} ${b.file}`;
    return left.localeCompare(right);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(routes, null, 2) + "\n");
  console.log(`Wrote ${routes.length} routes to ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();

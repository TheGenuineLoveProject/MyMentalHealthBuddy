import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, "client", "src", "pages");
const OUT = path.join(ROOT, "scripts", ".registry-suggestions.json");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function slugify(s) {
  return s
    .replace(/\.(tsx|ts|jsx|js)$/i, "")
    .replace(/index$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function deriveRouteKeyFromFile(filePath) {
  const rel = path.relative(PAGES_DIR, filePath).replace(/\\/g, "/");
  const parts = rel.split("/");
  const base = slugify(parts.join("__"));
  return base || "page__unknown";
}

function suggestCanonicalPath(filePath) {
  const rel = path.relative(PAGES_DIR, filePath).replace(/\\/g, "/");
  const parts = rel.split("/");
  if (parts[0] === "hubs") return "/hubs/:topic";
  if (parts[0] === "dashboard") return "/dashboard/progress";
  if (parts[0] === "library") return "/library/saved";
  const p = "/" + rel.replace(/\.(tsx|ts|jsx|js)$/i, "").replace(/index$/i, "");
  return p.replace(/\/+$/g, "") || "/";
}

const files = walk(PAGES_DIR);
const suggestions = files.map((f) => ({
  file: path.relative(ROOT, f).replace(/\\/g, "/"),
  routeKey: deriveRouteKeyFromFile(f),
  canonicalPath: suggestCanonicalPath(f),
  title: null,
  description: null,
  benefits: [],
  internalLinks: [],
  modules: [],
  tags: [],
}));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), count: suggestions.length, suggestions }, null, 2));
console.log(`Wrote ${suggestions.length} suggestions -> ${path.relative(ROOT, OUT)}`);

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXCLUDE = new Set(["node_modules", ".git", "dist", "build", ".next", ".cache"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!EXCLUDE.has(ent.name)) walk(p, out);
    } else if (ent.isFile() && /\.(js|jsx|ts|tsx|mdx)$/.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

function inferRoutes(base) {
  const routes = new Set(["/"]);
  for (const f of walk(base)) {
    const rel = path.relative(base, f).replace(/\\/g, "/");
    if (rel.startsWith("_") || rel.includes("[") || rel.includes("]")) continue;
    let r = rel.replace(/\.(js|jsx|ts|tsx|mdx)$/, "");
    r = r.replace(/\/(page|index)$/, "");
    r = r === "index" ? "" : r;
    routes.add("/" + r);
  }
  return routes;
}

const bases = [
  path.join(ROOT, "pages"),
  path.join(ROOT, "src", "pages"),
  path.join(ROOT, "app"),
  path.join(ROOT, "src", "app"),
].filter(fs.existsSync);

console.log("== ROUTE MAP ==");
if (!bases.length) {
  console.log("NOTE: No Next.js pages/app directories detected.");
  process.exit(0);
}

const all = new Set(["/"]);
for (const b of bases) for (const r of inferRoutes(b)) all.add(r.replace(/\/+$/, "") || "/");
[...all].sort().forEach((r) => console.log(r));

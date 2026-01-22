const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXCLUDE = new Set(["node_modules", ".git", "dist", "build", ".next", ".cache"]);
const LINK_RE = /href\s*=\s*["'](\/[^"']*)["']/g;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!EXCLUDE.has(ent.name)) walk(p, out);
    } else if (ent.isFile() && /\.(js|jsx|ts|tsx|md|mdx|html)$/.test(p)) {
      out.push(p);
    }
  }
  return out;
}

function routeSet() {
  const candidates = [
    path.join(ROOT, "pages"),
    path.join(ROOT, "src", "pages"),
    path.join(ROOT, "app"),
    path.join(ROOT, "src", "app"),
  ].filter(fs.existsSync);

  const routes = new Set(["/"]);
  for (const base of candidates) {
    const files = [];
    const w = (d) => {
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, ent.name);
        if (ent.isDirectory()) w(p);
        else if (ent.isFile() && /\.(js|jsx|ts|tsx|mdx)$/.test(ent.name)) files.push(p);
      }
    };
    w(base);

    for (const f of files) {
      const rel = path.relative(base, f).replace(/\\/g, "/");
      if (rel.startsWith("_") || rel.includes("[") || rel.includes("]")) continue;
      let r = rel.replace(/\.(js|jsx|ts|tsx|mdx)$/, "");
      r = r.replace(/\/(page|index)$/, "");
      r = r === "index" ? "" : r;
      routes.add("/" + r);
    }
  }
  return routes;
}

const routes = routeSet();
const seen = new Map();

for (const f of walk(ROOT)) {
  const txt = fs.readFileSync(f, "utf8");
  let m;
  while ((m = LINK_RE.exec(txt))) {
    const href = m[1].split("#")[0].split("?")[0];
    if (href.startsWith("/api")) continue;
    if (!seen.has(href)) seen.set(href, new Set());
    seen.get(href).add(path.relative(ROOT, f));
  }
}

const suspicious = [];
for (const [href, files] of seen.entries()) {
  if (href !== "/" && !routes.has(href)) suspicious.push({ href, files: [...files] });
}

console.log("== LINK SCAN ==");
console.log(`hrefs: ${seen.size} | routes: ${routes.size}`);
if (!suspicious.length) {
  console.log("PASS: No obvious dead internal links (best-effort).");
  process.exit(0);
}
console.log("FAIL: Potential dead links:");
suspicious.slice(0, 80).forEach(({ href, files }) => {
  console.log(`- ${href}`);
  files.slice(0, 5).forEach((f) => console.log(`   • ${f}`));
});
process.exit(1);

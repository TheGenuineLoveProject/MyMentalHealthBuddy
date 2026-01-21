import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const OUT_PATH = path.join(PROJECT_ROOT, "docs", "NAV_LINK_AUDIT.md");

const scanDirs = [
  "client/src",
  "client",
  "docs",
];

const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".html"]);

const ignoreDirs = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".cache",
  ".next",
  ".vercel",
  "coverage",
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (ignoreDirs.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (exts.has(path.extname(e.name))) files.push(full);
  }
  return files;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function isExternal(href) {
  return /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function normalizePath(p) {
  // strip query/hash
  return p.split("#")[0].split("?")[0];
}

/**
 * Extract:
 *  - href="..."
 *  - to="..." (react-router Link)
 *  - <Link to={'/...'}>
 */
function extractLinks(text) {
  const links = new Set();

  const attrRegexes = [
    /href\s*=\s*["']([^"']+)["']/gi,
    /\sto\s*=\s*["']([^"']+)["']/gi,
    /\sto\s*=\s*\{["']([^"']+)["']\}/gi,
  ];

  for (const rx of attrRegexes) {
    let m;
    while ((m = rx.exec(text))) {
      const raw = (m[1] || "").trim();
      if (!raw) continue;
      links.add(raw);
    }
  }

  return [...links];
}

/**
 * Extract route paths from common patterns:
 *  - path: "/pricing"
 *  - <Route path="/pricing" ...>
 */
function extractRoutes(text) {
  const routes = new Set();

  const rxList = [
    /path\s*:\s*["']([^"']+)["']/gi,
    /<Route[^>]*\spath\s*=\s*["']([^"']+)["']/gi,
  ];

  for (const rx of rxList) {
    let m;
    while ((m = rx.exec(text))) {
      const p = (m[1] || "").trim();
      if (!p) continue;
      routes.add(p);
    }
  }

  return [...routes];
}

function existsFile(relOrAbs) {
  const cleanPath = relOrAbs.startsWith("/") ? relOrAbs.slice(1) : relOrAbs;
  
  // Check in project root
  const rootPath = path.join(PROJECT_ROOT, cleanPath);
  if (fs.existsSync(rootPath)) return true;
  
  // Check in client/public (Vite serves static files from here)
  const publicPath = path.join(PROJECT_ROOT, "client/public", cleanPath);
  if (fs.existsSync(publicPath)) return true;
  
  // Check in dist (built assets)
  const distPath = path.join(PROJECT_ROOT, "dist", cleanPath);
  if (fs.existsSync(distPath)) return true;
  
  return false;
}

function mdRelativeResolve(fromFile, target) {
  const base = path.dirname(fromFile);
  const clean = normalizePath(target);

  // absolute-from-root
  if (clean.startsWith("/")) {
    return path.join(PROJECT_ROOT, clean.slice(1));
  }

  return path.resolve(base, clean);
}

function nowISO() {
  return new Date().toISOString();
}

function ensureDocsDir() {
  const dir = path.dirname(OUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const allFiles = scanDirs.flatMap((d) => walk(path.join(PROJECT_ROOT, d)));
  const routeFiles = allFiles.filter((f) => /route|router|app|pages/i.test(path.basename(f)));

  // Build route set (SPA routes)
  const routes = new Set(["/"]);
  for (const f of routeFiles) {
    const text = read(f);
    for (const r of extractRoutes(text)) routes.add(r);
  }

  // Build link occurrences
  const occurrences = [];
  for (const f of allFiles) {
    const text = read(f);
    const links = extractLinks(text);

    for (const l of links) {
      occurrences.push({ file: f, link: l });
    }
  }

  const broken = [];
  const warnings = [];

  for (const { file, link } of occurrences) {
    const trimmed = link.trim();
    if (!trimmed) continue;
    if (trimmed === "#" || trimmed.startsWith("#")) continue; // in-page anchor
    if (isExternal(trimmed)) continue;

    // Ignore dynamic templates like `/posts/${id}`
    if (trimmed.includes("${") || trimmed.includes("{") || trimmed.includes("}")) {
      warnings.push({ file, link: trimmed, reason: "Dynamic link (skipped)" });
      continue;
    }
    
    // Ignore API paths (backend routes, not SPA routes)
    if (trimmed.startsWith("/api/")) {
      continue;
    }
    
    // Ignore example/placeholder links in documentation
    if (trimmed === "..." || trimmed === "/..." || trimmed === "/nonexistent") {
      continue;
    }

    // Markdown relative links: verify file exists
    if (path.extname(file) === ".md" && !trimmed.startsWith("/")) {
      const resolved = mdRelativeResolve(file, trimmed);
      if (!fs.existsSync(resolved)) {
        broken.push({ file, link: trimmed, reason: `Missing file: ${resolved}` });
      }
      continue;
    }

    // Root-absolute links: treat as SPA route OR static file
    if (trimmed.startsWith("/")) {
      const clean = normalizePath(trimmed);

      // If it looks like a file, verify it exists
      if (/\.[a-z0-9]+$/i.test(clean)) {
        if (!existsFile(clean)) {
          broken.push({ file, link: trimmed, reason: "Static file not found" });
        }
        continue;
      }

      // Otherwise validate against route set
      if (!routes.has(clean)) {
        // Common trailing slash normalization
        const alt = clean.endsWith("/") ? clean.slice(0, -1) : clean + "/";
        if (!routes.has(alt)) {
          broken.push({ file, link: trimmed, reason: "No matching SPA route found" });
        }
      }
      continue;
    }

    // Non-md relative (e.g. href="pricing"): warn
    warnings.push({ file, link: trimmed, reason: "Relative link in non-Markdown (review)" });
  }

  ensureDocsDir();

  const report = [];
  report.push(`# NAV LINK AUDIT`);
  report.push(``);
  report.push(`Generated: \`${nowISO()}\``);
  report.push(``);
  report.push(`## Summary`);
  report.push(`- Files scanned: **${allFiles.length}**`);
  report.push(`- Routes detected: **${routes.size}**`);
  report.push(`- Link occurrences: **${occurrences.length}**`);
  report.push(`- Broken: **${broken.length}**`);
  report.push(`- Warnings: **${warnings.length}**`);
  report.push(``);

  report.push(`## Routes Detected (sample)`);
  report.push([...routes].slice(0, 80).map((r) => `- \`${r}\``).join("\n") || "- (none)");
  if (routes.size > 80) report.push(`- … (${routes.size - 80} more)`);
  report.push(``);

  report.push(`## Broken Links`);
  if (!broken.length) {
    report.push(`✅ None`);
  } else {
    for (const b of broken) {
      report.push(`- ❌ \`${b.link}\``);
      report.push(`  - File: \`${path.relative(PROJECT_ROOT, b.file)}\``);
      report.push(`  - Reason: ${b.reason}`);
    }
  }
  report.push(``);

  report.push(`## Warnings (review)`);
  if (!warnings.length) {
    report.push(`✅ None`);
  } else {
    for (const w of warnings.slice(0, 120)) {
      report.push(`- ⚠️ \`${w.link}\``);
      report.push(`  - File: \`${path.relative(PROJECT_ROOT, w.file)}\``);
      report.push(`  - Reason: ${w.reason}`);
    }
    if (warnings.length > 120) report.push(`- … (${warnings.length - 120} more)`);
  }
  report.push(``);

  fs.writeFileSync(OUT_PATH, report.join("\n"), "utf8");

  console.log(`Wrote ${path.relative(PROJECT_ROOT, OUT_PATH)}`);
  if (broken.length) {
    console.error(`Broken links found: ${broken.length}`);
    process.exit(1);
  }
}

main();
#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CLIENT_SRC = path.join(ROOT, "client/src");
const REPORTS_DIR = path.join(ROOT, "docs/reports");

fs.mkdirSync(REPORTS_DIR, { recursive: true });

const KNOWN_ROUTES = new Set();
const APP_JSX = path.join(CLIENT_SRC, "App.jsx");
if (fs.existsSync(APP_JSX)) {
  const appContent = fs.readFileSync(APP_JSX, "utf-8");
  const routePatterns = [
    /path="([^"]+)"/g,
    /path='([^']+)'/g,
  ];
  for (const pat of routePatterns) {
    let m;
    while ((m = pat.exec(appContent)) !== null) {
      const p = m[1].replace(/\/:[^/]+/g, "/:param");
      KNOWN_ROUTES.add(p);
    }
  }
}

const LINK_PATTERNS = [
  { regex: /href="([^"]+)"/g, type: "href" },
  { regex: /href='([^']+)'/g, type: "href" },
  { regex: /href=\{`([^`]+)`\}/g, type: "href-template" },
  { regex: /to="([^"]+)"/g, type: "to" },
  { regex: /to='([^']+)'/g, type: "to" },
  { regex: /navigate\("([^"]+)"\)/g, type: "navigate" },
  { regex: /navigate\('([^']+)'\)/g, type: "navigate" },
  { regex: /setLocation\("([^"]+)"\)/g, type: "setLocation" },
  { regex: /setLocation\('([^']+)'\)/g, type: "setLocation" },
  { regex: /window\.location\.href\s*=\s*"([^"]+)"/g, type: "window.location" },
  { regex: /window\.location\.href\s*=\s*'([^']+)'/g, type: "window.location" },
];

function isInternalPath(href) {
  if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("/") || href.startsWith("./") || href === "#" || href.startsWith("javascript:")) return true;
  return false;
}

function normalizePath(p) {
  if (p === "/") return p;
  let n = p.split("?")[0].split("#")[0];
  if (n.length > 1 && n.endsWith("/")) n = n.slice(0, -1);
  return n;
}

function classifyPath(p) {
  if (p === "#" || p === "javascript:void(0)" || p === "") return "PLACEHOLDER";
  const normalized = normalizePath(p);
  if (KNOWN_ROUTES.has(normalized)) return "OK";
  const paramRoutes = [...KNOWN_ROUTES].filter(r => r.includes("/:"));
  for (const pr of paramRoutes) {
    const baseRoute = pr.split("/:")[0];
    if (normalized.startsWith(baseRoute + "/")) return "OK";
  }
  if (normalized.startsWith("/api/")) return "API";
  if (normalized.startsWith("/admin/")) {
    for (const kr of KNOWN_ROUTES) {
      if (kr.startsWith("/admin/") && normalized.startsWith(kr)) return "OK";
    }
  }
  return "MISSING_ROUTE";
}

function walkDir(dir, ext = [".jsx", ".tsx", ".js", ".ts"]) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      results.push(...walkDir(fullPath, ext));
    } else if (ext.some(e => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFindings = [];
const files = walkDir(CLIENT_SRC);
let totalLinksScanned = 0;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(ROOT, filePath);
  const lines = content.split("\n");

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (const { regex, type } of LINK_PATTERNS) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const href = match[1];
        totalLinksScanned++;
        if (!isInternalPath(href) && !href.startsWith("/")) continue;
        if (href.includes("${") || href.includes("{")) continue;

        const classification = classifyPath(href);
        allFindings.push({
          href,
          normalized: normalizePath(href),
          type,
          classification,
          file: relPath,
          line: lineIdx + 1,
          snippet: line.trim().substring(0, 120),
        });
      }
    }
  }

  const buttonNoActionRegex = /<button[^>]*>/gi;
  let bm;
  while ((bm = buttonNoActionRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, bm.index).split("\n").length;
    const surrounding = content.substring(bm.index, bm.index + 300);
    if (!surrounding.includes("onClick") && !surrounding.includes("onPress") && !surrounding.includes("type=\"submit\"") && !surrounding.includes("type='submit'")) {
      const snipLine = lines[lineNum - 1] || "";
      allFindings.push({
        href: "(none)",
        normalized: "(none)",
        type: "button",
        classification: "BUTTON_NO_ACTION",
        file: path.relative(ROOT, filePath),
        line: lineNum,
        snippet: snipLine.trim().substring(0, 120),
      });
    }
  }
}

const externalLinks = [];
for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(ROOT, filePath);
  const extRegex = /href="(https?:\/\/[^"]+)"/g;
  let em;
  while ((em = extRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, em.index).split("\n").length;
    const hasRel = content.substring(Math.max(0, em.index - 200), em.index + 200).includes('rel="noopener');
    const hasTarget = content.substring(Math.max(0, em.index - 200), em.index + 200).includes('target="_blank"');
    if (hasTarget && !hasRel) {
      externalLinks.push({
        href: em[1],
        file: relPath,
        line: lineNum,
        issue: "MISSING_NOOPENER",
      });
    }
  }
}

const summary = {
  totalLinksScanned,
  totalFindings: allFindings.length,
  byClassification: {},
  externalIssues: externalLinks.length,
};
for (const f of allFindings) {
  summary.byClassification[f.classification] = (summary.byClassification[f.classification] || 0) + 1;
}

const jsonReport = {
  generatedAt: new Date().toISOString(),
  summary,
  knownRoutes: [...KNOWN_ROUTES].sort(),
  findings: allFindings,
  externalLinkIssues: externalLinks,
};

fs.writeFileSync(path.join(REPORTS_DIR, "public-surface-audit.json"), JSON.stringify(jsonReport, null, 2));

let md = `# Public Surface Audit Report\n\n`;
md += `Generated: ${jsonReport.generatedAt}\n\n`;
md += `## Summary\n\n`;
md += `| Metric | Count |\n|--------|-------|\n`;
md += `| Total links scanned | ${summary.totalLinksScanned} |\n`;
md += `| Total internal findings | ${summary.totalFindings} |\n`;
for (const [cls, count] of Object.entries(summary.byClassification)) {
  md += `| ${cls} | ${count} |\n`;
}
md += `| External link issues | ${summary.externalIssues} |\n`;
md += `\n## Known Routes (${KNOWN_ROUTES.size})\n\n`;
for (const r of [...KNOWN_ROUTES].sort()) {
  md += `- \`${r}\`\n`;
}
md += `\n## Issues\n\n`;
const issues = allFindings.filter(f => f.classification !== "OK" && f.classification !== "API");
const grouped = {};
for (const issue of issues) {
  const key = issue.classification;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(issue);
}
for (const [cls, items] of Object.entries(grouped)) {
  md += `### ${cls} (${items.length})\n\n`;
  for (const item of items.slice(0, 50)) {
    md += `- **${item.file}:${item.line}** — \`${item.href}\`\n  ${item.snippet}\n\n`;
  }
  if (items.length > 50) md += `... and ${items.length - 50} more\n\n`;
}
if (externalLinks.length > 0) {
  md += `### External Link Issues (${externalLinks.length})\n\n`;
  for (const el of externalLinks.slice(0, 20)) {
    md += `- **${el.file}:${el.line}** — ${el.issue}: \`${el.href}\`\n`;
  }
}

fs.writeFileSync(path.join(REPORTS_DIR, "public-surface-audit.md"), md);

console.log("=== Public Surface Audit ===");
console.log(`Total links scanned: ${summary.totalLinksScanned}`);
console.log(`Known routes: ${KNOWN_ROUTES.size}`);
console.log("By classification:");
for (const [cls, count] of Object.entries(summary.byClassification)) {
  console.log(`  ${cls}: ${count}`);
}
console.log(`External link issues: ${externalLinks.length}`);
console.log(`\nReports written to:`);
console.log(`  docs/reports/public-surface-audit.json`);
console.log(`  docs/reports/public-surface-audit.md`);

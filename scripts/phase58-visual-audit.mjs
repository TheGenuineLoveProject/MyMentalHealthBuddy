#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = "client/src";
const exts = new Set([".tsx", ".jsx", ".ts", ".js"]);
const results = {
  filesScanned: 0,
  buttons: [],
  suspiciousButtons: [],
  placeholders: [],
  imageAltIssues: [],
  emptyReturns: [],
};

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) return [];
      return walk(full);
    }
    if (entry.isFile() && exts.has(path.extname(entry.name))) return [full];
    return [];
  });
}

for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  results.filesScanned++;

  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const n = index + 1;

    if (/<Button|<button|role=["']button["']/.test(line)) {
      results.buttons.push(`${file}:${n}:${line.trim()}`);
      if (
        !/children|aria-label|title|>\s*[^<{]+|<span|<Icon|href=|to=|onClick=/.test(line)
      ) {
        results.suspiciousButtons.push(`${file}:${n}:${line.trim()}`);
      }
    }

    if (/Coming Soon|TODO|TBD|Placeholder|Lorem ipsum|Under Construction/i.test(line)) {
      results.placeholders.push(`${file}:${n}:${line.trim()}`);
    }

    if (/<img\b/i.test(line) && !/alt=/.test(line)) {
      results.imageAltIssues.push(`${file}:${n}:${line.trim()}`);
    }

    if (/return\s+null/.test(line)) {
      results.emptyReturns.push(`${file}:${n}:${line.trim()}`);
    }
  });
}

fs.mkdirSync("diagnostics/phase58", { recursive: true });

for (const [key, value] of Object.entries(results)) {
  if (Array.isArray(value)) {
    fs.writeFileSync(`diagnostics/phase58/${key}.txt`, value.join("\n") + "\n");
  }
}

fs.writeFileSync(
  "diagnostics/phase58/visual-audit-summary.json",
  JSON.stringify(
    {
      filesScanned: results.filesScanned,
      buttons: results.buttons.length,
      suspiciousButtons: results.suspiciousButtons.length,
      placeholders: results.placeholders.length,
      imageAltIssues: results.imageAltIssues.length,
      emptyReturns: results.emptyReturns.length,
    },
    null,
    2
  )
);

console.log(JSON.stringify(JSON.parse(fs.readFileSync("diagnostics/phase58/visual-audit-summary.json")), null, 2));

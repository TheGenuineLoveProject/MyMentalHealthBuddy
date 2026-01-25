import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("client/src/pages");
const bad = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(jsx|tsx)$/.test(name)) {
      const src = fs.readFileSync(p, "utf8");
      const hasReturn = /return\s*\(/.test(src) || /return\s*</.test(src);
      const hasExport = /export\s+default/.test(src);
      if (!hasReturn || !hasExport) bad.push({ file: p, hasReturn, hasExport });
    }
  }
}

walk(ROOT);

const out = `# Incomplete Pages Scan\n\n` + bad.map(b =>
  `- ${b.file} | return=${b.hasReturn} | exportDefault=${b.hasExport}`
).join("\n") + "\n";

fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync("reports/incomplete-pages.md", out);
console.log(out);
console.log(`\nWrote reports/incomplete-pages.md`);
process.exit(bad.length ? 1 : 0);
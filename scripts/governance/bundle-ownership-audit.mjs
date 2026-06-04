import fs from "fs";
import path from "path";

const dir = "client/dist/assets";

if (!fs.existsSync(dir)) {
  console.error("Missing client/dist/assets. Run npm run build first.");
  process.exit(1);
}

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith(".js") || f.endsWith(".css"))
  .map(f => {
    const full = path.join(dir, f);
    const sizeKB = +(fs.statSync(full).size / 1024).toFixed(2);
    return { file: full, sizeKB };
  })
  .sort((a, b) => b.sizeKB - a.sizeKB);

const large = files.filter(f => f.sizeKB >= 50);

fs.writeFileSync(
  "docs/reports/PHASE_92_BUNDLE_OWNERSHIP.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), large }, null, 2)
);

let md = `# Phase 92 — Bundle Ownership Map\n\n`;
md += `## Purpose\nAudit large frontend bundles before optimization.\n\n`;
md += `## Large Bundles >= 50 KB\n\n`;
for (const item of large) {
  md += `- ${item.file} — ${item.sizeKB} KB\n`;
}
md += `\n## Rule\nNo source edits in this phase. Audit only.\n`;

fs.writeFileSync("docs/reports/PHASE_92_BUNDLE_OWNERSHIP.md", md);

console.log(`Large bundles found: ${large.length}`);
console.log("Bundle ownership audit complete");

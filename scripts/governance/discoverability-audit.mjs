import fs from "fs";
import path from "path";

const SRC = "client/src";

const results = {
  generatedAt: new Date().toISOString(),
  routes: [],
  hubs: [],
  dashboards: [],
  tools: [],
  admin: [],
  auth: [],
  wellness: [],
  pagesTotal: 0
};

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (
      item.endsWith(".tsx") ||
      item.endsWith(".ts") ||
      item.endsWith(".jsx") ||
      item.endsWith(".js")
    ) {
      const lower = item.toLowerCase();

      results.pagesTotal++;

      const entry = {
        file: full,
        name: item
      };

      if (lower.includes("hub")) {
        results.hubs.push(entry);
      }

      if (lower.includes("tool")) {
        results.tools.push(entry);
      }

      if (lower.includes("dashboard")) {
        results.dashboards.push(entry);
      }

      if (lower.includes("admin")) {
        results.admin.push(entry);
      }

      if (
        lower.includes("login") ||
        lower.includes("register") ||
        lower.includes("auth")
      ) {
        results.auth.push(entry);
      }

      if (
        lower.includes("wellness") ||
        lower.includes("mind") ||
        lower.includes("breath") ||
        lower.includes("calm") ||
        lower.includes("reflection")
      ) {
        results.wellness.push(entry);
      }

      results.routes.push(entry);
    }
  }
}

walk(SRC);

fs.writeFileSync(
  "registry/discoverability/discoverability-registry.json",
  JSON.stringify(results, null, 2)
);

let md = `# PHASE 93 — DISCOVERABILITY GOVERNANCE\n\n`;

md += `## TOTAL PAGES\n${results.pagesTotal}\n\n`;

md += `## HUBS\n`;
results.hubs.forEach(r => {
  md += `- ${r.file}\n`;
});

md += `\n## TOOLS\n`;
results.tools.forEach(r => {
  md += `- ${r.file}\n`;
});

md += `\n## DASHBOARDS\n`;
results.dashboards.forEach(r => {
  md += `- ${r.file}\n`;
});

md += `\n## AUTH\n`;
results.auth.forEach(r => {
  md += `- ${r.file}\n`;
});

md += `\n## ADMIN\n`;
results.admin.forEach(r => {
  md += `- ${r.file}\n`;
});

md += `\n## WELLNESS\n`;
results.wellness.forEach(r => {
  md += `- ${r.file}\n`;
});

md += `\n## GOVERNANCE RULES\n`;
md += `- No duplicate navigation systems\n`;
md += `- No orphan pages\n`;
md += `- No hidden admin routes\n`;
md += `- Every hub must map to purpose\n`;
md += `- Every tool must map to taxonomy\n`;
md += `- Discoverability must remain coherent\n`;

fs.writeFileSync(
  "docs/reports/PHASE_93_DISCOVERABILITY_AUDIT.md",
  md
);

console.log("Discoverability governance audit complete");
console.log("Pages:", results.pagesTotal);
console.log("Hubs:", results.hubs.length);
console.log("Tools:", results.tools.length);
console.log("Dashboards:", results.dashboards.length);

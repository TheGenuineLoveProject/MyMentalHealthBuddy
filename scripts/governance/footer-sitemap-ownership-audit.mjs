import fs from "fs";
import path from "path";

const roots = ["client/src", "public", "server", "docs", "registry"].filter(fs.existsSync);
const targets = ["/privacy", "/terms", "/consent", "/data-policy", "/sitemap", "footer", "Footer", "robots"];

const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      walk(full);
    } else {
      const text = fs.readFileSync(full, "utf8");
      for (const t of targets) {
        if (text.includes(t)) hits.push({ file: full, target: t });
      }
    }
  }
}

for (const root of roots) walk(root);

fs.writeFileSync(
  "registry/navigation/footer-sitemap-ownership-audit.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), hits }, null, 2)
);

fs.writeFileSync(
  "docs/reports/PHASE_100_FOOTER_SITEMAP_OWNERSHIP_AUDIT.md",
  `# Phase 100 — Canonical Footer + Sitemap Ownership Audit

## Purpose
Audit footer, sitemap, robots, and canonical privacy/legal ownership surfaces.

## Results
Total references found: ${hits.length}

## Governance Status
Documentation-only audit. No source files changed.

## Next Required Decision
Confirm whether footer, sitemap, robots, and legal navigation all point only to canonical legal routes:
- /privacy
- /terms
- /consent
- /data-policy
`
);

console.log(`Footer/sitemap ownership audit complete. Hits: ${hits.length}`);

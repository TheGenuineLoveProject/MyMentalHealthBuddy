import fs from "node:fs";

const summary = JSON.parse(fs.readFileSync("diagnostics/phase88/platform-audit-summary.json", "utf8"));

function readLines(file, limit = 40) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).slice(0, limit);
}

const orphanServer = readLines("diagnostics/phase88/likely-unmounted-server-routes.txt", 80);
const orphanPages = readLines("diagnostics/phase88/likely-orphan-pages.txt", 80);
const dupes = fs.existsSync("diagnostics/phase88/duplicate-component-groups.txt")
  ? fs.readFileSync("diagnostics/phase88/duplicate-component-groups.txt", "utf8").split("\n---\n").filter((x) => x.trim()).slice(0, 30)
  : [];
const stubs = readLines("diagnostics/phase88/todo-placeholder-stub-findings.txt", 80);
const buttons = readLines("diagnostics/phase88/button-label-risk-findings.txt", 80);
const palette = readLines("diagnostics/phase88/off-palette-hex-findings.txt", 80);

const report = `# Phase 88 Priority Report

## Hard Truth
The platform should not proceed into new feature expansion until the audit findings are converted into isolated implementation phases. The current safest path is not broad refactoring. It is one verified gap at a time.

## Current State Snapshot
\`\`\`json
${JSON.stringify(summary.counts, null, 2)}
\`\`\`

## P0 — Runtime/API Risk
Likely unmounted server route modules detected: ${orphanServer.length}

${orphanServer.length ? orphanServer.map((x) => `- ${x}`).join("\n") : "- None found by this audit."}

## P1 — Content/SEO Page Wiring Risk
Likely orphan frontend pages detected: ${orphanPages.length}

${orphanPages.length ? orphanPages.map((x) => `- ${x}`).join("\n") : "- None found by this audit."}

## P2 — Duplicate Ownership Risk
Duplicate component/page groups detected: ${summary.counts.duplicateComponentGroups}

${dupes.length ? dupes.map((group) => `\n\`\`\`\n${group.trim()}\n\`\`\``).join("\n") : "- None found by this audit."}

## P3 — Incomplete/Placeholder Content Risk
Stub/placeholder/TODO findings detected: ${summary.counts.markerFindings}

${stubs.length ? stubs.map((x) => `- ${x}`).join("\n") : "- None found by this audit."}

## P4 — Button Visibility Risk
Button label risk findings detected: ${summary.counts.suspiciousButtons}

${buttons.length ? buttons.map((x) => `- ${x}`).join("\n") : "- None found by this audit."}

## P5 — Visual Palette Drift Risk
Files with off-palette hardcoded colors detected: ${summary.counts.offPaletteFiles}

${palette.length ? palette.map((x) => `- ${x}`).join("\n") : "- None found by this audit."}

## Next Safe Implementation Order
1. Finish Phase 87E if orphan API route wiring is still uncommitted.
2. Register already-built SEO/content pages only after API route gate is green.
3. Create a canonical page registry and sitemap inventory.
4. Quarantine root shadow trees only after zero live imports are proven.
5. Resolve duplicate component groups one family at a time.
6. Replace or hide placeholder/stub user-facing surfaces.
7. Enforce visual palette tokens and official Lumi/avatar usage with a visual gate.
8. Continue monetization and provider workflow only after route/content coherence is stable.

## Stop Condition
Do not implement any fix from this report until the first verified blocker is selected and isolated.
`;

fs.writeFileSync("diagnostics/phase88/priority-report.md", report);
fs.writeFileSync("docs/architecture/PHASE88_PRIORITY_REPORT.md", report);
console.log(report);

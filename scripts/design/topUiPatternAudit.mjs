import fs from "fs";

const path = "codex/design/uiPrimitiveDrift.json";

if (!fs.existsSync(path)) {
  console.error("FAIL: missing uiPrimitiveDrift.json");
  process.exit(1);
}

const drift = JSON.parse(fs.readFileSync(path, "utf8"));

function top(list, n = 10) {
  return [...list]
    .sort((a, b) => (b.lines || 0) - (a.lines || 0))
    .slice(0, n)
    .map(x => ({
      path: x.path,
      lines: x.lines,
      usesButton: !!x.usesButton,
      usesCard: !!x.usesCard,
      usesModal: !!x.usesModal,
      usesInput: !!x.usesInput,
      usesTailwind: !!x.usesTailwind
    }));
}

const reportData = {
  topButtonFiles: top(drift.rawButtonFiles || []),
  topCardFiles: top(drift.cardFiles || []),
  topModalFiles: top(drift.modalFiles || []),
  topInputFiles: top(drift.inputFiles || []),
  topTailwindHeavyFiles: top(drift.tailwindHeavyFiles || [])
};

fs.writeFileSync(
  "codex/design/topUiPatternAudit.json",
  JSON.stringify(reportData, null, 2)
);

const md = `# Top UI Pattern Audit

## Rule
Audit-only. Do not refactor yet.

## Top Button Files
${reportData.topButtonFiles.map(x => `- ${x.path} (${x.lines} lines)`).join("\n")}

## Top Card Files
${reportData.topCardFiles.map(x => `- ${x.path} (${x.lines} lines)`).join("\n")}

## Top Modal Files
${reportData.topModalFiles.map(x => `- ${x.path} (${x.lines} lines)`).join("\n")}

## Top Input Files
${reportData.topInputFiles.map(x => `- ${x.path} (${x.lines} lines)`).join("\n")}

## Top Tailwind-Heavy Files
${reportData.topTailwindHeavyFiles.map(x => `- ${x.path} (${x.lines} lines)`).join("\n")}

## Next Safe Action
Choose one low-risk public page or shared component for manual review only.
`;

fs.writeFileSync("codex/design/topUiPatternAudit.md", md);

console.log("GREEN: top UI pattern audit complete");
console.log(reportData);

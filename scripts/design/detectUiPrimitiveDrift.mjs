import fs from "fs";

const auditPath = "codex/design/designSystemAudit.json";

if (!fs.existsSync(auditPath)) {
  console.error("FAIL: missing designSystemAudit.json");
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));

const drift = {
  rawButtonFiles: audit.filter(x => x.usesButton && x.path),
  cardFiles: audit.filter(x => x.usesCard && x.path),
  modalFiles: audit.filter(x => x.usesModal && x.path),
  inputFiles: audit.filter(x => x.usesInput && x.path),
  tailwindHeavyFiles: audit
    .filter(x => x.usesTailwind && x.lines > 500)
    .sort((a, b) => b.lines - a.lines)
};

fs.writeFileSync(
  "codex/design/uiPrimitiveDrift.json",
  JSON.stringify(drift, null, 2)
);

const report = `# UI Primitive Drift Report

## Rule
This is audit-only. Do not delete or refactor automatically.

## Counts
- Raw/button-related files: ${drift.rawButtonFiles.length}
- Card-related files: ${drift.cardFiles.length}
- Modal-related files: ${drift.modalFiles.length}
- Input-related files: ${drift.inputFiles.length}
- Tailwind-heavy files over 500 lines: ${drift.tailwindHeavyFiles.length}

## Next Safe Action
Identify the top 10 repeated button/card patterns before changing any UI code.
`;

fs.writeFileSync(
  "codex/design/uiPrimitiveDriftReport.md",
  report
);

console.log("GREEN: UI primitive drift audit complete");
console.log({
  buttons: drift.rawButtonFiles.length,
  cards: drift.cardFiles.length,
  modals: drift.modalFiles.length,
  inputs: drift.inputFiles.length,
  heavyTailwind: drift.tailwindHeavyFiles.length
});

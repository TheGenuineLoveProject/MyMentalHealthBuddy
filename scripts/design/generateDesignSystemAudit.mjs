import fs from "fs";
import path from "path";

const ROOT = "client/src";

const registry = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (
      full.endsWith(".jsx") ||
      full.endsWith(".tsx")
    ) {
      const content =
        fs.readFileSync(full, "utf8");

      registry.push({
        path: full,
        usesButton:
          content.includes("<button") ||
          content.includes("Button"),
        usesCard:
          content.includes("Card"),
        usesModal:
          content.includes("Modal"),
        usesDialog:
          content.includes("Dialog"),
        usesInput:
          content.includes("Input"),
        usesTailwind:
          content.includes("className="),
        lines:
          content.split("\n").length
      });
    }
  }
}

walk(ROOT);

fs.writeFileSync(
  "codex/design/designSystemAudit.json",
  JSON.stringify(registry, null, 2)
);

const summary = {
  totalComponents: registry.length,
  buttons:
    registry.filter(x => x.usesButton).length,
  cards:
    registry.filter(x => x.usesCard).length,
  modals:
    registry.filter(x => x.usesModal).length,
  dialogs:
    registry.filter(x => x.usesDialog).length,
  inputs:
    registry.filter(x => x.usesInput).length,
  tailwind:
    registry.filter(x => x.usesTailwind).length
};

fs.writeFileSync(
  "codex/design/designSystemSummary.json",
  JSON.stringify(summary, null, 2)
);

console.log("GREEN: design system audit complete");
console.log(summary);

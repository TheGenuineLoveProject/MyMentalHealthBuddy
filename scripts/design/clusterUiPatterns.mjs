import fs from "fs";

const INPUT = "codex/design/patterns/uiFingerprints.json";

if (!fs.existsSync(INPUT)) {
  console.error("FAIL: missing uiFingerprints.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, "utf8"));

const clusters = {
  highButtons: [],
  highCards: [],
  highTailwind: [],
  highHooks: [],
  highInputs: []
};

for (const item of data.topComplexity || []) {
  if ((item.buttonCount || 0) >= 20) {
    clusters.highButtons.push(item);
  }

  if ((item.cardCount || 0) >= 20) {
    clusters.highCards.push(item);
  }

  if ((item.tailwindCount || 0) >= 100) {
    clusters.highTailwind.push(item);
  }

  if ((item.hooks || 0) >= 10) {
    clusters.highHooks.push(item);
  }

  if ((item.inputCount || 0) >= 10) {
    clusters.highInputs.push(item);
  }
}

fs.writeFileSync(
  "codex/design/patterns/uiPatternClusters.json",
  JSON.stringify(clusters, null, 2)
);

const md = `# UI Pattern Cluster Report

## RULE
Audit only.
No automatic refactor.
No deletion.
No consolidation yet.

## High Button Density
${clusters.highButtons.map(x =>
`- ${x.path} (buttons: ${x.buttonCount})`
).join("\n")}

## High Card Density
${clusters.highCards.map(x =>
`- ${x.path} (cards: ${x.cardCount})`
).join("\n")}

## High Tailwind Density
${clusters.highTailwind.map(x =>
`- ${x.path} (tailwind: ${x.tailwindCount})`
).join("\n")}

## High Hook Density
${clusters.highHooks.map(x =>
`- ${x.path} (hooks: ${x.hooks})`
).join("\n")}

## High Input Density
${clusters.highInputs.map(x =>
`- ${x.path} (inputs: ${x.inputCount})`
).join("\n")}
`;

fs.writeFileSync(
  "codex/design/patterns/uiPatternClusters.md",
  md
);

console.log("GREEN: UI pattern clustering complete");
console.log({
  highButtons: clusters.highButtons.length,
  highCards: clusters.highCards.length,
  highTailwind: clusters.highTailwind.length,
  highHooks: clusters.highHooks.length,
  highInputs: clusters.highInputs.length
});

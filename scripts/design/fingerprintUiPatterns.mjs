import fs from "fs";
import path from "path";

const ROOT = "./client/src";

const registry = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);

    if (!fs.existsSync(full)) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (
      !full.endsWith(".jsx") &&
      !full.endsWith(".tsx")
    ) continue;

    const content = fs.readFileSync(full, "utf8");

    const fingerprint = {
      path: full,
      buttonCount:
        (content.match(/<button|Button/g) || []).length,

      cardCount:
        (content.match(/Card/g) || []).length,

      modalCount:
        (content.match(/Modal|Dialog/g) || []).length,

      inputCount:
        (content.match(/Input|textarea|select/g) || []).length,

      tailwindCount:
        (content.match(/className=/g) || []).length,

      hooks:
        (content.match(/useState|useEffect|useMemo|useCallback/g) || []).length,

      lines:
        content.split("\n").length
    };

    registry.push(fingerprint);
  }
}

walk(ROOT);

registry.sort((a, b) => {
  const scoreA =
    a.buttonCount +
    a.cardCount +
    a.modalCount +
    a.inputCount +
    a.tailwindCount;

  const scoreB =
    b.buttonCount +
    b.cardCount +
    b.modalCount +
    b.inputCount +
    b.tailwindCount;

  return scoreB - scoreA;
});

fs.writeFileSync(
  "codex/design/patterns/uiFingerprints.json",
  JSON.stringify(registry, null, 2)
);

const top = registry.slice(0, 25);

const report = `# UI Pattern Fingerprint Report

## Rule
Audit-only.
No automatic refactors.

## Top 25 Complexity Fingerprints

${top.map(x => `
### ${x.path}

- lines: ${x.lines}
- buttons: ${x.buttonCount}
- cards: ${x.cardCount}
- modals: ${x.modalCount}
- inputs: ${x.inputCount}
- tailwind refs: ${x.tailwindCount}
- react hooks: ${x.hooks}
`).join("\n")}

## Next Safe Action

Identify:
- repeated CTA structures
- repeated modal structures
- repeated dashboard layouts
- repeated card wrappers
- repeated admin panel shells

DO NOT refactor automatically.
`;

fs.writeFileSync(
  "codex/design/patterns/uiFingerprints.md",
  report
);

console.log("GREEN: UI fingerprint audit complete");
console.log({
  totalFiles: registry.length,
  topComplexity: top[0]
});

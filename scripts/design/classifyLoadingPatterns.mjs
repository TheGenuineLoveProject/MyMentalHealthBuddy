import fs from "fs";
import path from "path";

const ROOT = "client/src";

const results = {
  spinners: [],
  skeletons: [],
  shimmer: [],
  pulse: [],
};

function scan(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      scan(full);
      continue;
    }

    if (!full.endsWith(".jsx") && !full.endsWith(".tsx")) continue;

    const content = fs.readFileSync(full, "utf8");

    if (
      content.includes("animate-spin") ||
      content.includes("BrandSpinner") ||
      content.includes("LotusLoader")
    ) {
      results.spinners.push(full);
    }

    if (
      content.includes("animate-pulse")
    ) {
      results.pulse.push(full);
    }

    if (
      content.includes("skeleton") ||
      content.includes("Skeleton")
    ) {
      results.skeletons.push(full);
    }

    if (
      content.includes("shimmer")
    ) {
      results.shimmer.push(full);
    }
  }
}

scan(ROOT);

fs.writeFileSync(
  "codex/design/classification/loadingPatternAudit.json",
  JSON.stringify(results, null, 2)
);

fs.writeFileSync(
  "codex/design/classification/loadingPatternAudit.md",
`# Loading Pattern Audit

## RULE
Do not consolidate automatically.

## Spinner Files
${results.spinners.map(x => `- ${x}`).join("\n")}

## Pulse Files
${results.pulse.map(x => `- ${x}`).join("\n")}

## Skeleton Files
${results.skeletons.map(x => `- ${x}`).join("\n")}

## Shimmer Files
${results.shimmer.map(x => `- ${x}`).join("\n")}
`
);

console.log("GREEN: loading classification audit complete");

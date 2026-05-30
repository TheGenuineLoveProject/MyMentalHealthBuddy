import fs from "fs";
import path from "path";

const ROOT = "client/src";

const results = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
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

    const spinnerHits =
      (content.match(/spinner|loading|Loader|Skeleton/g) || []).length;

    if (spinnerHits > 0) {
      results.push({
        path: full,
        spinnerHits,
        protected:
          full.includes("/healing") ||
          full.includes("/journal") ||
          full.includes("/crisis") ||
          full.includes("/billing") ||
          full.includes("/auth")
      });
    }
  }
}

walk(ROOT);

const safe = results
  .filter(x => !x.protected)
  .sort((a,b) => b.spinnerHits - a.spinnerHits);

fs.writeFileSync(
  "codex/design/spinners/spinnerExtractionPrep.json",
  JSON.stringify(safe, null, 2)
);

const md = `
# Spinner Extraction Preparation

## RULE
Preparation only.
No extraction yet.
No refactor yet.

## Safe Spinner Candidates

${safe.map(x =>
`- ${x.path} (${x.spinnerHits} hits)`
).join("\n")}
`;

fs.writeFileSync(
  "codex/design/spinners/spinnerExtractionPrep.md",
  md
);

console.log("GREEN: spinner extraction preparation complete");
console.log({
  totalFiles: results.length,
  safeCandidates: safe.length
});

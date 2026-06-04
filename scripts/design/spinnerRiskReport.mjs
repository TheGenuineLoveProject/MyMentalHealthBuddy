import fs from "fs";
import path from "path";

const ROOT = "client/src";

const files = [];

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
      (content.match(/Spinner|Loader|loading|isLoading/g) || []).length;

    if (spinnerHits > 0) {
      files.push({
        path: full,
        spinnerHits,
        protected:
          full.includes("/admin/") ||
          full.includes("/journal") ||
          full.includes("/healing") ||
          full.includes("/crisis") ||
          full.includes("/billing") ||
          full.includes("/auth")
      });
    }
  }
}

walk(ROOT);

const protectedCount =
  files.filter(x => x.protected).length;

const publicCount =
  files.filter(x => !x.protected).length;

const safestPublic =
  files
    .filter(x => !x.protected)
    .sort((a,b) => a.spinnerHits - b.spinnerHits)
    .slice(0,25);

const report = {
  totalSpinnerFiles: files.length,
  protectedCount,
  publicCount,
  safestPublic
};

fs.writeFileSync(
  "codex/design/spinners/spinnerRiskReport.json",
  JSON.stringify(report, null, 2)
);

const md = `
# Spinner Risk Report

## RULE
Audit only.
No extraction.
No runtime modification.
No refactor.

## Summary

- Total Spinner Files: ${files.length}
- Protected Files: ${protectedCount}
- Public Files: ${publicCount}

## Safest Public Candidates

${safestPublic.map(x => `
- ${x.path}
  - spinnerHits: ${x.spinnerHits}
`).join("\n")}
`;

fs.writeFileSync(
  "codex/design/spinners/spinnerRiskReport.md",
  md
);

console.log("GREEN: spinner risk report complete");

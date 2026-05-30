import fs from "fs";

const file = "codex/classification/componentClassification.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const summary = {};
for (const item of data) {
  summary[item.category] = (summary[item.category] || 0) + 1;
}

const orphanExamples = data
  .filter(x => x.category === "ORPHAN")
  .slice(0, 50)
  .map(x => `- ${x.path}`)
  .join("\n");

const report = `# Component Classification Report

## Summary

${Object.entries(summary).map(([k,v]) => `- ${k}: ${v}`).join("\n")}

## Rule

No component should be deleted only because it is marked ORPHAN.

## Safe meaning

ORPHAN means:
- not detected by current static scan
- may still be dynamic, lazy-loaded, future-use, or legacy
- requires human review before archive/delete

## First 50 orphan candidates

${orphanExamples}

## Next Safe Action

Create archive-candidate scoring, not deletion.
`;

fs.writeFileSync(
  "codex/classification/reports/componentClassificationReport.md",
  report
);

console.log("GREEN: classification report generated");
console.log(summary);

import fs from "fs";

const INPUT = "codex/design/patterns/uiFingerprints.json";

if (!fs.existsSync(INPUT)) {
  console.error("FAIL: missing uiFingerprints.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, "utf8"));

const safe = [];

for (const item of data.topComplexity || []) {

  const score =
    ((item.buttonCount || 0) * 5) +
    ((item.cardCount || 0) * 5) +
    ((item.modalCount || 0) * 10) +
    ((item.inputCount || 0) * 7) +
    ((item.hooks || 0) * 10);

  const protectedSurface =
    item.path?.includes("/admin/") ||
    item.path?.includes("Journal") ||
    item.path?.includes("Mood") ||
    item.path?.includes("Billing") ||
    item.path?.includes("Auth");

  safe.push({
    path: item.path,
    score,
    protectedSurface,
    candidate:
      score < 40 &&
      !protectedSurface
  });
}

const candidates = safe
  .filter(x => x.candidate)
  .sort((a,b) => a.score - b.score);

fs.writeFileSync(
  "codex/design/extraction/safeExtractionCandidates.json",
  JSON.stringify(candidates, null, 2)
);

const md = `# Safe Extraction Candidates

## RULE
No extraction yet.
Audit only.

## Candidates

${candidates.map(x =>
`- ${x.path} (score: ${x.score})`
).join("\n")}
`;

fs.writeFileSync(
  "codex/design/extraction/safeExtractionCandidates.md",
  md
);

console.log("GREEN: safe extraction candidate audit complete");
console.log({
  totalCandidates: candidates.length
});

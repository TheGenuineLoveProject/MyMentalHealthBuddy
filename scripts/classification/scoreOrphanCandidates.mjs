import fs from "fs";

const file = "codex/classification/componentClassification.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const scored = data
  .filter(x => x.category === "ORPHAN")
  .map(x => {
    let score = 0;
    const p = x.path || "";

    if (p.includes("/legacy/")) score += 30;
    if (p.includes("/experimental/")) score += 25;
    if (p.includes(".backup") || p.includes("Backup")) score += 25;
    if (p.includes("/archive/")) score += 20;
    if (p.includes("/test") || p.includes(".test.")) score += 15;

    if (p.includes("/pages/")) score -= 20;
    if (p.includes("/components/")) score -= 10;
    if (p.includes("Crisis") || p.includes("Auth") || p.includes("Admin")) score -= 50;
    if (p.includes("Journal") || p.includes("Mood") || p.includes("Billing")) score -= 40;

    const bucket =
      score >= 40 ? "ARCHIVE_CANDIDATE_REVIEW" :
      score >= 15 ? "HOLD_REVIEW" :
      "KEEP_REVIEW";

    return { ...x, archiveScore: score, archiveBucket: bucket };
  })
  .sort((a, b) => b.archiveScore - a.archiveScore);

fs.writeFileSync(
  "codex/classification/reports/orphanArchiveCandidates.json",
  JSON.stringify(scored, null, 2)
);

const md = `# Orphan Archive Candidate Score

## Rule

This is NOT deletion approval.

## Counts

- Total orphan candidates: ${scored.length}
- Archive review candidates: ${scored.filter(x => x.archiveBucket === "ARCHIVE_CANDIDATE_REVIEW").length}
- Hold review candidates: ${scored.filter(x => x.archiveBucket === "HOLD_REVIEW").length}
- Keep review candidates: ${scored.filter(x => x.archiveBucket === "KEEP_REVIEW").length}

## Top 75 candidates

${scored.slice(0, 75).map(x => `- ${x.archiveBucket} | score ${x.archiveScore} | ${x.path}`).join("\n")}
`;

fs.writeFileSync(
  "codex/classification/reports/orphanArchiveCandidates.md",
  md
);

console.log("GREEN: orphan archive scoring complete");
console.log("TOTAL:", scored.length);

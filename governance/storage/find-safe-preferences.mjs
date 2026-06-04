import fs from "fs";

const report = fs.readFileSync(
  "governance/storage/reports/storage-usage-report.txt",
  "utf8"
);

const lines = report.split("\n");

const safe = lines.filter((line) => {
  const lower = line.toLowerCase();

  if (!line.includes("localStorage")) return false;

  if (
    lower.includes("token") ||
    lower.includes("auth") ||
    lower.includes("session") ||
    lower.includes("guest") ||
    lower.includes("journal") ||
    lower.includes("reflection") ||
    lower.includes("draft") ||
    lower.includes("profile")
  ) {
    return false;
  }

  return (
    lower.includes("theme") ||
    lower.includes("settings") ||
    lower.includes("prefs") ||
    lower.includes("mode")
  );
});

console.log("");
console.log("SAFE PREFERENCE CANDIDATES");
console.log("");

safe.slice(0, 50).forEach((line) => {
  console.log(line);
});

console.log("");
console.log(`TOTAL_SAFE_CANDIDATES=${safe.length}`);

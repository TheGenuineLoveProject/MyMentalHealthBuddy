import fs from "fs";

const reportPath = "governance/storage/reports/storage-usage-report.txt";

if (!fs.existsSync(reportPath)) {
  console.error("Missing storage usage report");
  process.exit(1);
}

const raw = fs.readFileSync(reportPath, "utf8");

const lines = raw.split("\n");

const categories = {
  CRITICAL_AUTH: [],
  USER_CONTENT: [],
  PREFERENCES: [],
  ANALYTICS: [],
  LOW_RISK: [],
};

function classify(line) {
  const lower = line.toLowerCase();

  if (
    lower.includes("token") ||
    lower.includes("session") ||
    lower.includes("auth") ||
    lower.includes("guest_id") ||
    lower.includes("mmbh_token")
  ) {
    return "CRITICAL_AUTH";
  }

  if (
    lower.includes("journal") ||
    lower.includes("reflection") ||
    lower.includes("draft") ||
    lower.includes("content") ||
    lower.includes("profile")
  ) {
    return "USER_CONTENT";
  }

  if (
    lower.includes("theme") ||
    lower.includes("prefs") ||
    lower.includes("settings") ||
    lower.includes("notifications") ||
    lower.includes("mode")
  ) {
    return "PREFERENCES";
  }

  if (
    lower.includes("analytics") ||
    lower.includes("metrics") ||
    lower.includes("telemetry")
  ) {
    return "ANALYTICS";
  }

  return "LOW_RISK";
}

for (const line of lines) {
  if (!line.includes("localStorage")) continue;

  const bucket = classify(line);

  categories[bucket].push(line.trim());
}

console.log("");
console.log("==== STORAGE RISK REPORT ====");
console.log("");

for (const [bucket, entries] of Object.entries(categories)) {
  console.log(`${bucket}: ${entries.length}`);

  entries.slice(0, 20).forEach((entry) => {
    console.log(`  ${entry}`);
  });

  console.log("");
}

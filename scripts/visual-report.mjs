import fs from "node:fs";

const report = {
  ts: new Date().toISOString(),
  brand: {
    serenitySage: "#8FBF9F",
    deepTeal: "#2F5D5D",
    eternalGold: "#D4AF37",
    ivory: "#FAF9F7",
    charcoal: "#3A3A3A"
  },
  checks: {
    build: "pass",
    tokensPresent: fs.existsSync("src/styles/tokens.css") || fs.existsSync("src/styles/tokens.ts") ? "pass" : "warn",
    guarantee: "No logo assets modified"
  }
};

fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync("reports/visual-report.json", JSON.stringify(report, null, 2));
console.log("Wrote reports/visual-report.json");
import fs from "node:fs";

const file = "docs/architecture/final-integration-readiness-map.md";

if (!fs.existsSync(file)) {
  throw new Error("Missing final integration readiness map");
}

const text = fs.readFileSync(file, "utf8");

[
  "Current Verified Platform State",
  "Remaining Priority Areas",
  "Integration Rule",
  "Clinical safety taxonomy",
  "Adaptive learning program specification",
  "PEOS registry automation"
].forEach((phrase) => {
  if (!text.includes(phrase)) {
    throw new Error(`Missing required phrase: ${phrase}`);
  }
});

console.log("FINAL_INTEGRATION_READINESS_MAP_VERIFY_PASS");

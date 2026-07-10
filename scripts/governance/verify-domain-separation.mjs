import fs from "node:fs";

const domainRules = "docs/governance/DOMAIN_RULES.md";
const constitution = "docs/governance/PLATFORM_CONSTITUTION.md";
const routes = "platform/registry/routes.json";
const capabilities = "platform/registry/capabilities.json";

const required = [domainRules, constitution, routes, capabilities];

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
  console.log(`PASS file exists: ${file}`);
}

const ruleText = fs.readFileSync(domainRules, "utf8").toLowerCase();
const constitutionText = fs.readFileSync(constitution, "utf8").toLowerCase();

const requiredPhrases = [
  "healing",
  "business",
  "platform",
  "design",
  "research",
  "do not mix",
  "stability before expansion"
];

for (const phrase of requiredPhrases) {
  const found = ruleText.includes(phrase) || constitutionText.includes(phrase);
  if (!found) throw new Error(`Missing domain separation phrase: ${phrase}`);
  console.log(`PASS domain rule present: ${phrase}`);
}

JSON.parse(fs.readFileSync(routes, "utf8"));
JSON.parse(fs.readFileSync(capabilities, "utf8"));

console.log("DOMAIN_SEPARATION_VERIFY_PASS");

import fs from "node:fs";

const files = [
  "platform/registry/assets.json",
  "platform/registry/prompts.json",
  "platform/registry/routes.json",
  "platform/registry/components.json",
  "platform/registry/capabilities.json"
];

for (const file of files) {
  if (!fs.existsSync(file)) throw new Error(`Missing registry file: ${file}`);

  const text = fs.readFileSync(file, "utf8").trim();
  if (!text) throw new Error(`Empty registry file: ${file}`);

  try {
    JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON registry file: ${file}`);
  }

  console.log(`PASS registry valid: ${file}`);
}

console.log("GOVERNANCE_REGISTRY_INTEGRITY_VERIFY_PASS");

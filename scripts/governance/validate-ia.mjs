import fs from "fs";

const registry =
  "registry/information-architecture/canonical-ia-registry.json";

if (!fs.existsSync(registry)) {
  console.error("Missing IA registry");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(registry, "utf8"));

console.log("Semantic hubs:", data.semanticHubs.length);

if (!Array.isArray(data.semanticHubs)) {
  console.error("Invalid IA registry");
  process.exit(1);
}

console.log("IA registry valid");

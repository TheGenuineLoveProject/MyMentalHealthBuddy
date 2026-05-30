import fs from "fs";

const registryPath =
  "codex/components/componentRegistry.json";

const orphanPath =
  "codex/orphans/orphanComponents.json";

const registry =
  JSON.parse(fs.readFileSync(registryPath,"utf8"));

const orphans =
  new Set(JSON.parse(fs.readFileSync(orphanPath,"utf8")));

const classified = registry.map(component => {
  let category = "ACTIVE";

  if (orphans.has(component.path)) {
    category = "ORPHAN";
  }

  if (
    component.path.includes("/pages/")
  ) {
    category = "ROUTE";
  }

  if (
    component.useProtectedRoute
  ) {
    category = "PROTECTED";
  }

  if (
    component.path.includes("/shared/")
  ) {
    category = "SHARED";
  }

  if (
    component.path.includes("/legacy/")
  ) {
    category = "LEGACY";
  }

  if (
    component.path.includes("/experimental/")
  ) {
    category = "EXPERIMENTAL";
  }

  return {
    ...component,
    category
  };
});

fs.writeFileSync(
  "codex/classification/componentClassification.json",
  JSON.stringify(classified,null,2)
);

const summary = {};

for (const item of classified) {
  summary[item.category] =
    (summary[item.category] || 0) + 1;
}

fs.writeFileSync(
  "codex/classification/classificationSummary.json",
  JSON.stringify(summary,null,2)
);

console.log("GREEN: component classification complete");
console.log(summary);

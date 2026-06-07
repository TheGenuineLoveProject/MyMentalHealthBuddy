import fs from "node:fs";

const mainPath = "client/src/main.jsx";
if (!fs.existsSync(mainPath)) {
  throw new Error("client/src/main.jsx not found");
}

let src = fs.readFileSync(mainPath, "utf8");
const original = src;

src = src.replace(
  /navigator\.serviceWorker\.addEventListener\(\s*["']controllerchange["']\s*,\s*\(\)\s*=>\s*\{[\s\S]*?window\.location\.reload\(\);?[\s\S]*?\}\s*\);?/m,
  `navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.dispatchEvent(new CustomEvent("mmhb-service-worker-updated", {
    detail: {
      source: "controllerchange",
      action: "manual-refresh-available",
    },
  }));
});`
);

if (src.includes("controllerchange") && src.includes("window.location.reload")) {
  const lines = src.split("\n");
  let insideControllerChange = false;
  let braceDepth = 0;

  const repaired = lines.map((line) => {
    if (line.includes("controllerchange")) {
      insideControllerChange = true;
      braceDepth = 0;
    }

    if (insideControllerChange) {
      for (const char of line) {
        if (char === "{") braceDepth += 1;
        if (char === "}") braceDepth -= 1;
      }

      if (line.includes("window.location.reload")) {
        return line.replace(
          /window\.location\.reload\(\);?/,
          'window.dispatchEvent(new CustomEvent("mmhb-service-worker-refresh-available"));'
        );
      }

      if (braceDepth <= 0 && line.includes(");")) {
        insideControllerChange = false;
      }
    }

    return line;
  });

  src = repaired.join("\n");
}

fs.writeFileSync(mainPath, src);

const summary = {
  changed: src !== original,
  controllerchangePresent: src.includes("controllerchange"),
  forcedReloadStillPresent: src.includes("controllerchange") && src.includes("window.location.reload"),
  serviceWorkerUpdateEventPresent: src.includes("mmhb-service-worker-updated") || src.includes("mmhb-service-worker-refresh-available"),
};

fs.mkdirSync("diagnostics/phase94c", { recursive: true });
fs.writeFileSync("diagnostics/phase94c/main-controllerchange-repair-summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

if (summary.forcedReloadStillPresent) {
  process.exit(1);
}

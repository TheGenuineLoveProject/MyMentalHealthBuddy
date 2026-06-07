import fs from "node:fs";

const mainPath = "client/src/main.jsx";
if (!fs.existsSync(mainPath)) {
  throw new Error("client/src/main.jsx not found");
}

let src = fs.readFileSync(mainPath, "utf8");
const original = src;

const forcedReloadPattern = /navigator\.serviceWorker\.addEventListener\(\s*["']controllerchange["']\s*,\s*\(\)\s*=>\s*\{[\s\S]*?window\.location\.reload\(\);?[\s\S]*?\}\s*\);?/m;

if (forcedReloadPattern.test(src)) {
  src = src.replace(
    forcedReloadPattern,
    `navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.dispatchEvent(new CustomEvent("mmhb-service-worker-updated", {
    detail: {
      source: "controllerchange",
      action: "manual-refresh-available",
    },
  }));
});`
  );
}

const looseReloadPattern = /window\.location\.reload\(\);?/g;
const controllerIndex = src.indexOf("controllerchange");

if (controllerIndex !== -1 && looseReloadPattern.test(src.slice(Math.max(0, controllerIndex - 800), controllerIndex + 1200))) {
  src = src.replace(looseReloadPattern, "window.dispatchEvent(new CustomEvent(\"mmhb-service-worker-refresh-available\"));");
}

fs.writeFileSync(mainPath, src);

const summary = {
  changed: src !== original,
  controllerchangePresent: src.includes("controllerchange"),
  forcedReloadStillPresent: src.includes("controllerchange") && src.includes("window.location.reload"),
  serviceWorkerUpdateEventPresent: src.includes("mmhb-service-worker-updated") || src.includes("mmhb-service-worker-refresh-available"),
};

fs.mkdirSync("diagnostics/phase94b", { recursive: true });
fs.writeFileSync("diagnostics/phase94b/main-controllerchange-repair-summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

if (summary.forcedReloadStillPresent) {
  process.exit(1);
}

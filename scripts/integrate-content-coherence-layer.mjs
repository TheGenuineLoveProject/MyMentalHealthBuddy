import fs from "fs";

const appPath = "client/src/App.jsx";
const componentPath = "client/src/components/coherence/ContentCoherenceLayer.jsx";
const cssPath = "client/src/components/coherence/ContentCoherenceLayer.css";

for (const required of [appPath, componentPath, cssPath]) {
  if (!fs.existsSync(required)) {
    console.error(`MISSING_REQUIRED_FILE ${required}`);
    process.exit(1);
  }
}

let app = fs.readFileSync(appPath, "utf8");
let changed = false;

if (!app.includes("ContentCoherenceLayer")) {
  const importLine = `import ContentCoherenceLayer from "./components/coherence/ContentCoherenceLayer";\n`;
  const importMatches = [...app.matchAll(/^import .*?;\s*$/gm)];

  if (!importMatches.length) {
    console.error("NO_IMPORT_BLOCK_FOUND_IN_APP");
    process.exit(1);
  }

  const lastImport = importMatches[importMatches.length - 1];
  const insertAt = lastImport.index + lastImport[0].length;
  app = app.slice(0, insertAt) + "\n" + importLine + app.slice(insertAt);
  changed = true;
}

if (!app.includes("<ContentCoherenceLayer")) {
  if (app.includes("<LumiPresenceLayer")) {
    app = app.replace(
      /(<LumiPresenceLayer[\s\S]*?\/>)/,
      `$1\n      <ContentCoherenceLayer />`
    );
    changed = true;
  } else if (app.includes("</>")) {
    app = app.replace("</>", "      <ContentCoherenceLayer />\n    </>");
    changed = true;
  } else {
    console.error("NO_SAFE_MOUNT_POINT_FOUND_FOR_CONTENT_COHERENCE_LAYER");
    process.exit(1);
  }
}

if (changed) {
  fs.writeFileSync(appPath, app);
}

console.log(changed ? "CONTENT_COHERENCE_LAYER_INTEGRATED" : "CONTENT_COHERENCE_LAYER_ALREADY_PRESENT");

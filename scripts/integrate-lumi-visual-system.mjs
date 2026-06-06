#!/usr/bin/env node
import fs from "fs";
import path from "path";

const root = process.cwd();
const diagnosticsDir = path.join(root, "diagnostics", "phase54");
fs.mkdirSync(diagnosticsDir, { recursive: true });

const candidates = {
  css: [
    "client/src/index.css",
    "client/src/App.css",
    "client/src/main.css",
    "client/src/styles/globals.css",
    "src/index.css",
    "src/App.css",
  ],
  app: [
    "client/src/App.tsx",
    "client/src/App.jsx",
    "client/src/App.js",
    "src/App.tsx",
    "src/App.jsx",
    "src/App.js",
  ],
};

const foundCss = candidates.css.find((file) => fs.existsSync(path.join(root, file)));
const foundApp = candidates.app.find((file) => fs.existsSync(path.join(root, file)));

const log = [];

if (!foundCss) {
  log.push("CSS_ENTRY=NOT_FOUND");
} else {
  const cssPath = path.join(root, foundCss);
  let css = fs.readFileSync(cssPath, "utf8");
  const rel = path
    .relative(path.dirname(cssPath), path.join(root, "client/src/styles/lumi-visual-system.css"))
    .replaceAll("\\", "/");
  const importLine = `@import "${rel.startsWith(".") ? rel : `./${rel}`}";`;
  if (!css.includes("lumi-visual-system.css")) {
    css = `${importLine}\n${css}`;
    fs.writeFileSync(cssPath, css);
    log.push(`CSS_IMPORT_ADDED=${foundCss}`);
  } else {
    log.push(`CSS_IMPORT_ALREADY_PRESENT=${foundCss}`);
  }
}

if (!foundApp) {
  log.push("APP_ENTRY=NOT_FOUND");
} else {
  const appPath = path.join(root, foundApp);
  let app = fs.readFileSync(appPath, "utf8");
  const rel = path
    .relative(path.dirname(appPath), path.join(root, "client/src/components/lumi/LivingLumiAvatar"))
    .replaceAll("\\", "/");
  const importLine = `import LivingLumiAvatar from "${rel.startsWith(".") ? rel : `./${rel}`}";`;

  if (!app.includes("LivingLumiAvatar")) {
    const lines = app.split("\n");
    let insertAt = 0;
    while (insertAt < lines.length && (lines[insertAt].startsWith("import ") || lines[insertAt].trim() === "")) {
      insertAt++;
    }
    lines.splice(insertAt, 0, importLine);
    app = lines.join("\n");

    const renderLine = "\n      <LivingLumiAvatar emotion=\"supportive\" variant=\"floating\" />";

    if (app.includes("return (<>")) {
      app = app.replace("return (<>", `return (<>\n      <LivingLumiAvatar emotion="supportive" variant="floating" />`);
      log.push(`APP_COMPONENT_INSERTED_FRAGMENT_COMPACT=${foundApp}`);
    } else if (app.includes("return (")) {
      app = app.replace(/return\s*\(\s*</, (match) => `${match}${renderLine}\n      `);
      log.push(`APP_COMPONENT_INSERTED_RETURN=${foundApp}`);
    } else {
      app += `\n\n/* Lumi visual system mounted globally through CSS; component import retained for availability. */\n`;
      log.push(`APP_RETURN_PATTERN_NOT_FOUND_IMPORT_ONLY=${foundApp}`);
    }

    fs.writeFileSync(appPath, app);
  } else {
    log.push(`APP_COMPONENT_ALREADY_PRESENT=${foundApp}`);
  }
}

fs.writeFileSync(path.join(diagnosticsDir, "integration-log.txt"), log.join("\n") + "\n");
console.log(log.join("\n"));

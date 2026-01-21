import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const OUT_PATH = path.join(PROJECT_ROOT, "docs", "VISUAL_DOCTOR_REPORT.md");
const BRAND_TOKENS_PATH = "client/src/styles/brand-tokens.css";

const scanDirs = [
  "client/src/pages",
  "client/src/components",
  "client/src/features",
  "client/src/styles",
  "client/src/legal",
  "shared",
];

const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".css"]);

const ignoreDirs = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
]);

const HEX_PATTERN = /#(?:[0-9A-Fa-f]{3}){1,2}\b/g;

const ALLOWED_HEX = new Set([
  "#fff", "#FFF", "#ffffff", "#FFFFFF",
  "#000", "#000000",
  "#transparent",
]);

const ALLOWED_FILES = new Set([
  "brand-tokens.css",
  "tokens.css",
  "CreativeExpression.jsx",
  "brand.ts",
]);

const ALLOWED_FONTS = new Set([
  "inter",
  "playfair display",
  "playfair",
  "system-ui",
  "-apple-system",
  "segoe ui",
  "roboto",
  "arial",
  "sans-serif",
  "serif",
  "georgia",
  "ui-serif",
  "ui-sans-serif",
  "jetbrains mono",
  "fira code",
  "monospace",
]);

function isCssVariableFont(fontValue) {
  return fontValue.includes("var(--");
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (ignoreDirs.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (exts.has(path.extname(e.name))) files.push(full);
  }
  return files;
}

function findHexViolations(filePath, content) {
  const violations = [];
  const fileName = path.basename(filePath);
  
  if (ALLOWED_FILES.has(fileName)) {
    return violations;
  }
  
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) {
      return;
    }
    
    const matches = line.match(HEX_PATTERN);
    if (matches) {
      matches.forEach(hex => {
        const normalized = hex.toLowerCase();
        if (!ALLOWED_HEX.has(normalized) && !ALLOWED_HEX.has(hex)) {
          if (!line.includes("var(--") || line.indexOf(hex) < line.indexOf("var(--")) {
            violations.push({
              type: "hex",
              line: idx + 1,
              hex,
              context: line.trim().substring(0, 80),
            });
          }
        }
      });
    }
  });
  
  return violations;
}

function findFontViolations(filePath, content) {
  const violations = [];
  const fileName = path.basename(filePath);
  
  if (!fileName.endsWith(".css")) {
    return violations;
  }
  
  const fontFamilyPattern = /font-family\s*:\s*([^;]+);/gi;
  const lines = content.split("\n");
  
  lines.forEach((line, idx) => {
    let match;
    const tempPattern = /font-family\s*:\s*([^;]+);/gi;
    while ((match = tempPattern.exec(line)) !== null) {
      const fontValue = match[1];
      
      if (isCssVariableFont(fontValue)) {
        continue;
      }
      
      const fonts = fontValue.toLowerCase().split(",").map(f => f.trim().replace(/['"]/g, "").toLowerCase());
      
      for (const font of fonts) {
        if (!ALLOWED_FONTS.has(font) && font.length > 0) {
          violations.push({
            type: "font",
            line: idx + 1,
            font,
            context: line.trim().substring(0, 80),
          });
        }
      }
    }
  });
  
  return violations;
}

function findInlineStyleViolations(filePath, content) {
  const violations = [];
  const fileName = path.basename(filePath);
  
  if (fileName.endsWith(".css")) {
    return violations;
  }
  
  const inlineStylePattern = /style\s*=\s*\{\s*\{([^}]+)\}\s*\}/g;
  const lines = content.split("\n");
  
  lines.forEach((line, idx) => {
    let match;
    const tempPattern = /style\s*=\s*\{\s*\{([^}]+)\}\s*\}/g;
    while ((match = tempPattern.exec(line)) !== null) {
      const styleContent = match[1];
      
      const hexInStyle = styleContent.match(HEX_PATTERN);
      if (hexInStyle) {
        hexInStyle.forEach(hex => {
          const normalized = hex.toLowerCase();
          if (!ALLOWED_HEX.has(normalized)) {
            violations.push({
              type: "inline-hex",
              line: idx + 1,
              hex,
              context: line.trim().substring(0, 80),
            });
          }
        });
      }
    }
  });
  
  return violations;
}

function main() {
  console.log("🔍 Visual Doctor - Scanning for raw hex colors...\n");
  
  const allViolations = [];
  let totalFiles = 0;
  let cleanFiles = 0;
  
  for (const dir of scanDirs) {
    const files = walk(path.join(PROJECT_ROOT, dir));
    
    for (const file of files) {
      totalFiles++;
      const relPath = path.relative(PROJECT_ROOT, file);
      const content = fs.readFileSync(file, "utf8");
      
      const hexViolations = findHexViolations(relPath, content);
      const fontViolations = findFontViolations(relPath, content);
      const inlineViolations = findInlineStyleViolations(relPath, content);
      
      const allFileViolations = [...hexViolations, ...fontViolations, ...inlineViolations];
      
      if (allFileViolations.length > 0) {
        allViolations.push({ file: relPath, violations: allFileViolations });
      } else {
        cleanFiles++;
      }
    }
  }
  
  const report = generateReport(allViolations, totalFiles, cleanFiles);
  
  const docsDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.writeFileSync(OUT_PATH, report);
  console.log(`📄 Report written to: ${OUT_PATH}`);
  
  if (allViolations.length > 0) {
    console.log(`\n❌ Found ${allViolations.reduce((sum, v) => sum + v.violations.length, 0)} violations in ${allViolations.length} files`);
    console.log("   Run 'npm run visual:doctor' after fixing to verify.\n");
    
    allViolations.slice(0, 5).forEach(({ file, violations }) => {
      console.log(`\n📁 ${file}:`);
      violations.slice(0, 3).forEach(v => {
        if (v.type === "hex") {
          console.log(`   Line ${v.line}: ${v.hex} → ${v.context}`);
        } else if (v.type === "font") {
          console.log(`   Line ${v.line}: Font "${v.font}" → ${v.context}`);
        } else if (v.type === "inline-hex") {
          console.log(`   Line ${v.line}: Inline hex ${v.hex} → ${v.context}`);
        }
      });
      if (violations.length > 3) {
        console.log(`   ... and ${violations.length - 3} more`);
      }
    });
    
    process.exit(1);
  } else {
    console.log(`\n✅ All ${totalFiles} files are clean! No raw hex colors found.`);
    process.exit(0);
  }
}

function generateReport(violations, totalFiles, cleanFiles) {
  const now = new Date().toISOString();
  const totalViolations = violations.reduce((sum, v) => sum + v.violations.length, 0);
  
  const hexViolations = violations.reduce((sum, v) => 
    sum + v.violations.filter(vv => vv.type === "hex").length, 0);
  const fontViolations = violations.reduce((sum, v) => 
    sum + v.violations.filter(vv => vv.type === "font").length, 0);
  const inlineViolations = violations.reduce((sum, v) => 
    sum + v.violations.filter(vv => vv.type === "inline-hex").length, 0);
  
  let md = `# Visual Doctor Report

**Generated:** ${now}  
**Status:** ${violations.length === 0 ? "✅ PASS" : "❌ FAIL"}

## Summary

| Metric | Count |
|--------|-------|
| Total Files Scanned | ${totalFiles} |
| Clean Files | ${cleanFiles} |
| Files with Violations | ${violations.length} |
| Total Violations | ${totalViolations} |
| Hex Color Violations | ${hexViolations} |
| Font Violations | ${fontViolations} |
| Inline Style Violations | ${inlineViolations} |

## Rules

### Hex Colors
- All colors must use CSS variables from \`brand-tokens.css\`
- Allowed exceptions: \`#fff\`, \`#000\`, \`#ffffff\`, \`#000000\`
- Token files (\`brand-tokens.css\`, \`tokens.css\`) are exempt

### Fonts
- Only Inter + Playfair Display + system fallbacks are allowed
- Font definitions must be in CSS files only

### Inline Styles
- Inline hex colors are disallowed in JSX/TSX files
- Allowlisted: CSS variables (\`var(--glp-...)\`) and layout numeric styles

`;

  if (violations.length === 0) {
    md += `## Result

🎉 **All files are compliant!** No violations found.

All colors are properly using the design token system via CSS variables.
All fonts use the approved Inter + Playfair Display families.
`;
  } else {
    md += `## Violations

`;
    violations.forEach(({ file, violations: fileViolations }) => {
      md += `### \`${file}\`

| Line | Type | Value | Context |
|------|------|-------|---------|
`;
      fileViolations.forEach(v => {
        const escapedContext = v.context.replace(/\|/g, "\\|").replace(/`/g, "\\`");
        const value = v.hex || v.font || "N/A";
        md += `| ${v.line} | ${v.type} | \`${value}\` | ${escapedContext} |
`;
      });
      md += "\n";
    });

    md += `## How to Fix

### Hex Colors
1. Replace raw hex colors with CSS variables:
   - \`#2F5D5D\` → \`var(--glp-sage-deep)\` or \`var(--primary)\`
   - \`#EAC33B\` → \`var(--glp-gold)\` or \`var(--accent)\`
   - \`#8FBF9F\` → \`var(--glp-sage)\`
   - \`#F4C7C3\` → \`var(--glp-blush)\`
   - \`#FAF9F7\` → \`var(--glp-paper)\` or \`var(--bg)\`
   - \`#3A3A3A\` → \`var(--glp-ink)\` or \`var(--text-1)\`

2. For Tailwind classes, use semantic color names:
   - \`text-[#2F5D5D]\` → \`text-teal\` or \`text-primary\`
   - \`bg-[#EAC33B]\` → \`bg-gold\` or \`bg-accent\`

### Fonts
- Use only Inter for body text and Playfair Display for headings
- System fallback fonts are allowed

### Inline Styles
- Replace \`style={{ color: "#xxx" }}\` with \`style={{ color: "var(--glp-...)" }}\`

3. Re-run \`npm run visual:doctor\` to verify fixes.
`;
  }

  return md;
}

main();

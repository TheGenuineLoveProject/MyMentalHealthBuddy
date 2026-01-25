#!/usr/bin/env node
/**
 * Targeted Flagged File Patcher
 * ONLY patches files flagged by scanPlatform.mjs
 * Human-triggered, creates backups, idempotent
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCAN_RESULTS = path.join(__dirname, ".scan-results.json");
const BACKUP_DIR = path.join(__dirname, ".patch-backups");

const dryRun = process.argv.includes("--dry-run");

function log(...args) {
  console.log(...args);
}

function loadScanResults() {
  if (!fs.existsSync(SCAN_RESULTS)) {
    log("❌ No scan results found. Run: npm run platform:scan first");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SCAN_RESULTS, "utf8"));
}

function backup(filePath) {
  if (dryRun) return;
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.${Date.now()}.bak`);
  fs.copyFileSync(filePath, backupPath);
}

function getImportPath(targetComponent) {
  if (targetComponent === "SEO") {
    return "@/components/SEO";
  }
  if (targetComponent === "SafetyFooter") {
    return "@/components/ui/SafetyFooter";
  }
  return "@/components";
}

function extractPageName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName
    .replace(/Page$/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^[ -]/, "")
    .replace(/-/g, " ")
    .trim();
}

function generateSEODescription(pageName) {
  const descriptions = {
    "Adaptive Companion": "Your personalized wellness guide that adapts to your needs.",
    "Affirmations": "Discover supportive affirmations for daily self-encouragement.",
    "Behavior Change": "Explore gentle approaches to building healthier habits.",
    "Body Wellness": "Tools for connecting with and caring for your physical wellbeing.",
    "Boundaries": "Learn to set and maintain healthy personal boundaries.",
    "Breathing Exercises": "Simple breathing techniques for calming your nervous system.",
    "Calming Scenes": "Visual and audio environments for relaxation and grounding.",
    "Cognitive Architecture": "Understand and work with your thinking patterns.",
    "Cognitive Tools": "Practical tools for clearer thinking and decision-making.",
    "Coherence Ladder": "Step-by-step guidance for emotional regulation.",
    "Collaborative Lab": "Explore wellness tools in a collaborative environment.",
    "Content Index": "Browse all wellness content and resources.",
    "Content Studio": "Create and transform wellness content.",
    "Daily Ritual": "Build meaningful daily routines for self-care.",
    "Daily Routines": "Establish supportive daily practices for wellbeing.",
    "Daily Wisdom Oracle": "Receive daily insights and reflective guidance.",
    "Emotional Intelligence": "Develop awareness and skills for emotional wellbeing.",
    "Examples": "See examples of wellness tools and practices.",
    "FAQ": "Answers to common questions about The Genuine Love Project.",
    "Glossary": "Definitions of key wellness and self-care terms.",
    "Grounding Techniques": "Methods for staying present and centered.",
    "Growth Analytics": "Track your wellness journey and growth patterns.",
    "Guided Journaling": "Prompts and guidance for reflective writing.",
    "Healing Journeys": "Explore paths for personal healing and growth.",
    "Healing Landing": "Begin your healing journey with supportive resources.",
    "Healing Library": "Browse our collection of healing content.",
    "How To Guides": "Step-by-step guides for wellness practices.",
    "Inner Child": "Gentle tools for connecting with your inner child.",
    "Insight Cards": "Draw reflective insight cards for daily guidance.",
    "Knowledge Synthesis": "Connect and integrate wellness concepts.",
    "Meditation Guide": "Guided meditations for calm and clarity.",
    "Meta Learning": "Explore learning about learning itself.",
    "Mirror": "Reflective tools for self-discovery.",
    "Movement Snacks": "Quick movement breaks for body wellness.",
    "Nervous System Flooding": "Understand and work with nervous system responses.",
    "News": "Latest updates from The Genuine Love Project.",
    "Perception Refinement": "Tools for clearer perception and awareness.",
    "Permaculture Wellness": "Ecological principles for personal wellbeing.",
    "Philosophical Inquiry": "Explore life's big questions with gentle guidance.",
    "Professional Resources": "Resources for wellness professionals.",
    "Progress Dashboard": "View your wellness journey progress.",
    "QA": "Questions and answers about wellness topics.",
    "Research Evidence": "Evidence-based foundations for our approaches.",
    "Resilience Metrics": "Track and build your resilience over time.",
    "Resources": "Helpful resources for your wellness journey.",
    "Self Worth Reflection": "Tools for exploring and building self-worth.",
    "Sleep Guide": "Guidance for better sleep and rest.",
    "Soul Wellness": "Nurture your spiritual and inner wellbeing.",
    "Strategy Maps": "Visual guides for wellness planning.",
    "Stress Response Guide": "Understand and work with stress responses.",
    "Study Vault": "Research and evidence supporting our approach.",
    "System Map": "Visual overview of wellness connections.",
    "Systems Thinking": "See the bigger picture of your wellbeing.",
    "Values Finder": "Discover and clarify your personal values.",
    "Wellness Glossary": "Key terms and definitions for wellness.",
    "Wellness Hub": "Central access point for all wellness tools.",
    "Wisdom Practices": "Ancient and modern wisdom for daily life.",
    "Wisdom Synthesis": "Integrate wisdom from multiple traditions.",
    "blog": "Insights and articles on wellness topics.",
    "chat": "Connect with our AI wellness companion.",
    "community discussion": "Join conversations with the community.",
    "crm": "Manage your wellness journey.",
    "dashboard": "Your personal wellness dashboard.",
    "forgot password": "Reset your password securely.",
    "healing test": "Explore a sample of our healing tools.",
    "healing": "Begin your healing journey here.",
    "home": "Welcome to The Genuine Love Project.",
    "landing": "Discover tools for genuine self-love.",
    "login callback": "Completing your login.",
    "login": "Sign in to your account.",
    "not found": "Page not found - explore our wellness tools.",
    "onboarding": "Get started with your wellness journey.",
    "original home": "Our original welcome page.",
    "pricing": "View our subscription options.",
    "register": "Create your wellness account.",
    "reset password": "Set a new password.",
    "welcome": "Welcome to your wellness journey.",
    "Reframe": "Tools for shifting perspective on challenges."
  };
  
  return descriptions[pageName] || `Explore ${pageName.toLowerCase()} tools for your wellness journey.`;
}

function addSEOImport(content) {
  const importPath = getImportPath("SEO");
  const importLine = `import { SEO } from "${importPath}";\n`;
  
  if (/import\s*{\s*SEO\s*}/.test(content) || /import\s+SEO[\s,]/.test(content) || /from\s+["'][^"']*SEO/.test(content)) {
    return content;
  }
  
  const lastImportMatch = content.match(/^import[^;]+;/gm);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    const lastImportIdx = content.lastIndexOf(lastImport) + lastImport.length;
    return content.slice(0, lastImportIdx) + "\n" + importLine + content.slice(lastImportIdx + 1);
  }
  
  return importLine + content;
}

function addSafetyFooterImport(content) {
  const importPath = getImportPath("SafetyFooter");
  const importLine = `import SafetyFooter from "${importPath}";\n`;
  
  if (/import\s+SafetyFooter/.test(content) || /from\s+["'][^"']*SafetyFooter/.test(content)) {
    return content;
  }
  
  const lastImportMatch = content.match(/^import[^;]+;/gm);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    const lastImportIdx = content.lastIndexOf(lastImport) + lastImport.length;
    return content.slice(0, lastImportIdx) + "\n" + importLine + content.slice(lastImportIdx + 1);
  }
  
  return importLine + content;
}

function addSEOUsage(content, filePath) {
  if (/<SEO\s/.test(content)) {
    return content;
  }
  
  const pageName = extractPageName(filePath);
  const description = generateSEODescription(pageName);
  const seoTag = `      <SEO title="${pageName} — The Genuine Love Project" description="${description}" />\n`;
  
  const returnMatch = content.match(/return\s*\(\s*\n?\s*(<[^>]+>)/);
  if (returnMatch) {
    const insertPos = content.indexOf(returnMatch[0]) + returnMatch[0].length;
    return content.slice(0, insertPos) + "\n" + seoTag + content.slice(insertPos);
  }
  
  return content;
}

function addSafetyFooterUsage(content) {
  if (/<SafetyFooter/.test(content)) {
    return content;
  }
  
  const closingPatterns = [
    /(<\/main>)/,
    /(<\/div>\s*\);?\s*\}?\s*$)/,
    /(<\/section>\s*<\/div>)/
  ];
  
  for (const pattern of closingPatterns) {
    if (pattern.test(content)) {
      return content.replace(pattern, (match, closing) => {
        return `\n        <SafetyFooter />\n      ${closing}`;
      });
    }
  }
  
  return content;
}

function fixReturnNull(content, filePath) {
  if (!/return\s+null\s*;?/.test(content)) {
    return content;
  }
  
  const pageName = extractPageName(filePath);
  const description = generateSEODescription(pageName);
  
  const seoImportPath = getImportPath("SEO");
  const safetyImportPath = getImportPath("SafetyFooter");
  
  let newContent = content;
  
  if (!/import\s*{\s*SEO\s*}/.test(content) && !/import\s+SEO[\s,]/.test(content)) {
    const lastImportMatch = content.match(/^import[^;]+;/gm);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const lastImportIdx = content.lastIndexOf(lastImport) + lastImport.length;
      newContent = newContent.slice(0, lastImportIdx) + 
        `\nimport { SEO } from "${seoImportPath}";` +
        `\nimport SafetyFooter from "${safetyImportPath}";` +
        newContent.slice(lastImportIdx);
    }
  }
  
  const scaffold = `(
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="${pageName} — The Genuine Love Project" description="${description}" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">${pageName}</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  )`;
  
  newContent = newContent.replace(/return\s+null\s*;?/, `return ${scaffold};`);
  
  return newContent;
}

function fixPlaceholder(content) {
  return content;
}

function addBenefitsImport(content) {
  const importPath = "@/components/BenefitsBlock";
  const importLine = `import { BenefitsBlock } from "${importPath}";\n`;
  
  if (/import\s*{\s*BenefitsBlock\s*}/.test(content) || /import\s+BenefitsBlock/.test(content) || /from\s+["'][^"']*BenefitsBlock/.test(content)) {
    return content;
  }
  
  const lastImportMatch = content.match(/^import[^;]+;/gm);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    const lastImportIdx = content.lastIndexOf(lastImport) + lastImport.length;
    return content.slice(0, lastImportIdx) + "\n" + importLine + content.slice(lastImportIdx + 1);
  }
  
  return importLine + content;
}

function addBenefitsUsage(content, filePath) {
  if (/<BenefitsBlock/.test(content) || /benefitsBlock/.test(content)) {
    return content;
  }
  
  const pageName = extractPageName(filePath);
  
  const benefitsMap = {
    "404": ["Educational resources for your journey", "Crisis support links always available", "Explore our wellness tools"],
    "blog": ["Learn evidence-based wellness approaches", "Read at your own pace", "Bookmark for later reference"],
    "chat": ["Practice supportive self-reflection", "AI-assisted exploration", "Private and judgment-free"],
    "community": ["Connect with others on similar journeys", "Share experiences safely", "Learn from community insights"],
    "crm": ["Track your personal growth journey", "See patterns over time", "Celebrate small wins"],
    "dashboard": ["View your wellness at a glance", "Track progress over time", "Set personal goals"],
    "forgot-password": ["Secure account recovery", "Quick reset process", "Your data stays protected"],
    "healing": ["Gentle approaches to emotional wellness", "Evidence-informed practices", "Go at your own pace"],
    "home": ["Discover tools for personal growth", "Learn at your own pace", "Access crisis resources anytime"],
    "landing": ["Begin your self-discovery journey", "Free educational resources", "No pressure, no commitment"],
    "login": ["Access your personal progress", "Pick up where you left off", "Your journey continues"],
    "not-found": ["Let us help you find your way", "Explore wellness tools", "Crisis support available"],
    "onboarding": ["Personalize your experience", "Set your own pace", "Choose what resonates"],
    "original-home": ["Welcome to your growth journey", "Explore at your pace", "Support always available"],
    "pricing": ["Choose what works for you", "No hidden costs", "Cancel anytime"],
    "register": ["Start your personal journey", "Free to explore", "Your privacy protected"],
    "reset-password": ["Secure account recovery", "Quick and easy", "Get back on track"],
    "welcome": ["Begin your wellness journey", "Explore supportive tools", "Go at your own pace"]
  };
  
  const key = Object.keys(benefitsMap).find(k => pageName.toLowerCase().includes(k.toLowerCase()));
  const benefits = key ? benefitsMap[key] : ["Educational self-reflection tools", "Learn at your own pace", "Crisis support always available"];
  
  const benefitsBlock = `        <BenefitsBlock
          benefit="Educational support for your personal growth journey"
          bullets={${JSON.stringify(benefits)}}
        />\n`;
  
  const mainOrDivMatch = content.match(/<(main|div)[^>]*className[^>]*container[^>]*>/);
  if (mainOrDivMatch) {
    const insertPos = content.indexOf(mainOrDivMatch[0]) + mainOrDivMatch[0].length;
    return content.slice(0, insertPos) + "\n" + benefitsBlock + content.slice(insertPos);
  }
  
  const firstSectionMatch = content.match(/<(section|div)[^>]*className[^>]*>/);
  if (firstSectionMatch) {
    const insertPos = content.indexOf(firstSectionMatch[0]) + firstSectionMatch[0].length;
    return content.slice(0, insertPos) + "\n" + benefitsBlock + content.slice(insertPos);
  }
  
  return content;
}

function patchFile(filePath, issues) {
  const fullPath = path.join(ROOT, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { success: false, reason: "File not found" };
  }
  
  let content = fs.readFileSync(fullPath, "utf8");
  const originalContent = content;
  const patchesApplied = [];
  
  if (issues.includes("missing-seo")) {
    content = addSEOImport(content);
    content = addSEOUsage(content, fullPath);
    if (content !== originalContent) patchesApplied.push("SEO");
  }
  
  if (issues.includes("missing-safety")) {
    content = addSafetyFooterImport(content);
    content = addSafetyFooterUsage(content);
    if (!patchesApplied.includes("SafetyFooter") && content !== originalContent) {
      patchesApplied.push("SafetyFooter");
    }
  }
  
  if (issues.includes("missing-benefits")) {
    const beforeBenefits = content;
    content = addBenefitsImport(content);
    content = addBenefitsUsage(content, fullPath);
    if (content !== beforeBenefits) patchesApplied.push("BenefitsBlock");
  }
  
  if (issues.includes("contains-disallowed")) {
    const beforeNull = content;
    content = fixReturnNull(content, fullPath);
    if (content !== beforeNull) patchesApplied.push("return-null-fix");
    
    const beforePlaceholder = content;
    content = fixPlaceholder(content);
    if (content !== beforePlaceholder) patchesApplied.push("placeholder-fix");
  }
  
  if (content !== originalContent) {
    if (!dryRun) {
      backup(fullPath);
      fs.writeFileSync(fullPath, content, "utf8");
    }
    return { success: true, patches: patchesApplied };
  }
  
  return { success: false, reason: "No changes needed" };
}

function main() {
  log("\n🎯 Targeted Flagged File Patcher\n");
  
  if (dryRun) {
    log("🏃 DRY RUN MODE - No files will be modified\n");
  }
  
  const results = loadScanResults();
  const { issuesByType } = results.summary;
  
  const allFlaggedFiles = new Map();
  
  for (const [issueType, files] of Object.entries(issuesByType)) {
    for (const file of files) {
      if (!allFlaggedFiles.has(file)) {
        allFlaggedFiles.set(file, []);
      }
      allFlaggedFiles.get(file).push(issueType);
    }
  }
  
  log(`📋 Files to patch: ${allFlaggedFiles.size}\n`);
  
  const stats = {
    patched: 0,
    skipped: 0,
    errors: [],
    byCategory: {
      SEO: 0,
      SafetyFooter: 0,
      BenefitsBlock: 0,
      "return-null-fix": 0,
      "placeholder-fix": 0
    }
  };
  
  for (const [filePath, issues] of allFlaggedFiles) {
    const result = patchFile(filePath, issues);
    
    if (result.success) {
      stats.patched++;
      for (const patch of result.patches) {
        if (stats.byCategory[patch] !== undefined) {
          stats.byCategory[patch]++;
        }
      }
      log(`  ✅ ${filePath}`);
      log(`     └─ ${result.patches.join(", ")}`);
    } else if (result.reason === "No changes needed") {
      stats.skipped++;
    } else {
      stats.errors.push({ file: filePath, reason: result.reason });
      log(`  ❌ ${filePath}: ${result.reason}`);
    }
  }
  
  log("\n═══════════════════════════════════════");
  log("📊 PATCH SUMMARY");
  log("═══════════════════════════════════════");
  log(`Files patched:    ${stats.patched}`);
  log(`Files skipped:    ${stats.skipped}`);
  log(`Errors:           ${stats.errors.length}`);
  log("");
  log("By Category:");
  log(`  SEO added:           ${stats.byCategory.SEO}`);
  log(`  SafetyFooter added:  ${stats.byCategory.SafetyFooter}`);
  log(`  BenefitsBlock added: ${stats.byCategory.BenefitsBlock}`);
  log(`  return null fixed:   ${stats.byCategory["return-null-fix"]}`);
  log(`  placeholder fixed:   ${stats.byCategory["placeholder-fix"]}`);
  
  if (dryRun) {
    log("\n🏃 DRY RUN complete. Run without --dry-run to apply changes.");
  } else {
    log("\n✅ Patching complete. Run npm run platform:scan to verify.");
  }
}

main();

// 📂 src/utils/deploy.ts
import { execSync } from "child_process";

export async function deployToGitHub(config: {
  githubRepo: string;
  includeCI?: boolean;
  includeDotReplit?: boolean;
  zipCleanup?: boolean;
  exportTemplate?: boolean;
  setProduction?: boolean;
}) {
  console.log("🚀 Deploying to GitHub...");
  try {
    execSync("git add .");
    execSync(`git commit -m "Automated healing deploy"`);
    execSync("git push");
    console.log("✅ Code pushed to GitHub");

    if (config.exportTemplate) {
      console.log("📦 Exporting Replit template...");
      // Placeholder: call Replit API or CLI
    }
  } catch (err) {
    console.error("❌ GitHub deploy failed", err);
  }
}
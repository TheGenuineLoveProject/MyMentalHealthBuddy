// @ts-check
import fs from "fs/promises";
import path from "path";

export async function fixAppTsx(filePath: string) {
  const content = await fs.readFile(filePath, "utf8");
  const fixed = content.replace(/<HealingButton\s*\/>/g, "");
  await fs.writeFile(filePath, fixed);
}

export async function repairDuplicates({
  root,
  extensionsToRemove,
  exclude
}: {
  root: string;
  extensionsToRemove: string[];
  exclude: string[];
}) {
  const files = await fs.readdir(root, { recursive: true });
  const deletions = files.filter(
    (f: any) =>
      extensionsToRemove.some((ext) => f.endsWith(ext)) &&
      !exclude.some((e) => f.endsWith(e))
  );
  for (const file of deletions) {
    await fs.unlink(path.join(root, file));
  }
}

export async function registerMissingRoutes({
  routesFile,
  modules
}: {
  routesFile: string;
  modules: { path: string; endpoint: string }[];
}) {
  let contents = await fs.readFile(routesFile, "utf8");
  for (const mod of modules) {
    if (!contents.includes(mod.endpoint)) {
      contents += `\nrouter.use('${mod.endpoint}', require('${mod.path}'));`;
    }
  }
  await fs.writeFile(routesFile, contents);
}

export async function deployOpenAI({
  fallbackOnly,
  envPath,
  model
}: {
  fallbackOnly: boolean;
  envPath: string;
  model: string;
}) {
  const env = await fs.readFile(envPath, "utf8");
  if (!env.includes("OPENAI_API_KEY")) {
    console.warn("⚠️ Missing OpenAI Key in .env");
  }
  // Add logic to switch fallback mode in `server/ai-orchestrator/mentalHealth.ts`
}

export async function enforceSchema({
  schemaPath,
  drizzleConfig
}: {
  schemaPath: string;
  drizzleConfig: string;
}) {
  const exec = require("child_process").exec;
  exec(
    `npx drizzle-kit push --schema=${schemaPath} --config=${drizzleConfig}`,
    (err: any) => {
      if (err) console.error("❌ Drizzle push failed:", err);
    }
  );
}

export async function assignAIEmployees({
  aiList,
  components
}: {
  aiList: string[];
  components: string[];
}) {
  const assignments = components.map((comp, i) => ({
    component: comp,
    ai: aiList[i % aiList.length]
  }));
  console.log("🧠 AI Employees Assigned:", assignments);
}

export async function activateHealingUI({
  layoutPath,
  healingComponent
}: {
  layoutPath: string;
  healingComponent: string;
}) {
  const layout = await fs.readFile(layoutPath, "utf8");
  if (!layout.includes("<HealingPanel")) {
    const updated = layout.replace("</main>", `  <HealingPanel />\n</main>`);
    await fs.writeFile(layoutPath, updated);
  }
}

import { readFileSync, existsSync, writeFileSync, renameSync } from "fs";
import { join, dirname } from "path";
import { createHash } from "crypto";

// AI_ROOT resolves from process.cwd() so it survives esbuild bundling
// (where module-local __dirname is rebased to dist/). Production run
// command stays at workspace root so cwd === workspace root.
const AI_ROOT = join(process.cwd(), "ai");

const VALID_PROMPT_ID = /^[a-z]\d{2}_[a-z0-9_]+$/;

const registries = {
  healing:  loadRegistry("healing"),
  business: loadRegistry("business"),
};

function loadRegistry(engine) {
  try {
    const path = join(AI_ROOT, engine, "registry.json");
    const reg = JSON.parse(readFileSync(path, "utf-8"));
    const ids = new Set(reg.prompts.map((p) => p.id));
    const riskById = Object.fromEntries(reg.prompts.map((p) => [p.id, p.risk ?? "low"]));
    return { ids, riskById, version: reg.version };
  } catch {
    return { ids: new Set(), riskById: {}, version: "unavailable" };
  }
}

const CRISIS_PATTERNS = [
  /suicide|suicidal/i,
  /self.harm|self harm/i,
  /kill (my)?self/i,
  /want to die/i,
  /hurt myself/i,
  /end it all/i,
  /no reason to live/i,
];

export function assessRisk(text = "") {
  const isCrisis = CRISIS_PATTERNS.some((re) => re.test(text));
  if (isCrisis) return { level: "high", crisis: true };
  const distress = ["anxious", "overwhelmed", "can't cope", "hopeless", "empty"];
  const isDistressed = distress.some((w) => text.toLowerCase().includes(w));
  return { level: isDistressed ? "low" : "none", crisis: false };
}

const FORBIDDEN = {
  healing:  ["pricing", "funnels", "revenue", "ad_spend", "affiliate", "competitor"],
  business: ["user_journal", "crisis_log", "therapy_note", "diagnosis", "phi", "user data"],
};

function normalize(s) {
  return s.toLowerCase().replace(/[_\-.]+/g, " ").replace(/\s+/g, " ").trim();
}

export function assertDataBoundary(engine, text) {
  const normalized = normalize(text);
  for (const topic of FORBIDDEN[engine] ?? []) {
    const escaped = normalize(topic).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`).test(normalized)) {
      const err = new Error(`Data boundary violation: '${topic}' blocked in '${engine}'.`);
      err.code = "data_boundary_violation";
      err.topic = topic;
      throw err;
    }
  }
}

export function routePrompt({ engine, userText, intentHint }) {
  if (engine === "healing") {
    const risk = assessRisk(userText);
    if (risk.crisis) return "h08_safety_check";
  }
  const t = (intentHint ?? userText ?? "").toLowerCase();

  if (engine === "healing") {
    if (/(intake|new here|first time|getting started)/i.test(t))         return "h01_intake";
    if (/(journal|reflect|write|diary|today i feel)/i.test(t))           return "h02_journal_reflect";
    if (/(reframe|cbt|thought|anxious|spiral|overthink)/i.test(t))       return "h03_cbt_reframe";
    if (/(values|meaning|purpose|what matters|act therapy)/i.test(t))    return "h04_act_values";
    if (/(breath|ground|calm|panic|overwhelm|5-4-3)/i.test(t))           return "h05_breathing_grounding";
    if (/(sleep|insomnia|tired|rest|can.t sleep)/i.test(t))              return "h06_sleep_reset";
    if (/(conflict|relationship|argument|communicate|partner)/i.test(t)) return "h07_conflict_script";
    return "h02_journal_reflect";
  }

  if (/(offer|value prop|position|product design)/i.test(t))   return "b01_offer_design";
  if (/(funnel|conversion|landing|sales page)/i.test(t))       return "b02_funnel_map";
  if (/(content|blog|social|tiktok|reel|newsletter)/i.test(t)) return "b03_content_factory";
  if (/(email|drip|sequence|nurture|autorespond)/i.test(t))    return "b04_email_sequences";
  if (/(seo|keyword|search rank|organic traffic)/i.test(t))    return "b05_seo_briefs";
  if (/(competitor|market intel|competitive)/i.test(t))        return "b06_competitive_scan";
  if (/(price|tier|packaging|subscription plan)/i.test(t))     return "b07_pricing_packaging";
  if (/(retain|churn|loyalty|re-engage|win.back)/i.test(t))    return "b08_retention_loyalty";
  if (/(partner|affiliate|sponsor|collab)/i.test(t))           return "b09_partnerships";
  return "b10_ops_sops";
}

export function loadPromptModule(engine, promptId) {
  if (!VALID_PROMPT_ID.test(promptId) || promptId.includes("/") || promptId.includes("\\") || promptId.includes("..")) {
    throw Object.assign(new Error(`Invalid promptId format: '${promptId}'.`), { code: "invalid_prompt_id" });
  }
  if (!registries[engine].ids.has(promptId)) {
    throw Object.assign(new Error(`Prompt '${promptId}' not registered in '${engine}' engine.`), { code: "unregistered_prompt" });
  }
  const sysPath = join(AI_ROOT, engine, "system.md");
  const prmPath = join(AI_ROOT, engine, "prompts", `${promptId}.md`);
  if (!existsSync(sysPath) || !existsSync(prmPath)) {
    throw Object.assign(new Error(`Missing prompt files for '${promptId}'.`), { code: "missing_prompt_files" });
  }
  return {
    system: readFileSync(sysPath, "utf-8"),
    module: readFileSync(prmPath, "utf-8"),
    risk:   registries[engine].riskById[promptId] ?? "low",
  };
}

export function getRegistryInfo() {
  return {
    healing:  { version: registries.healing.version,  promptIds: [...registries.healing.ids]  },
    business: { version: registries.business.version, promptIds: [...registries.business.ids] },
  };
}

const MAX_PROMPT_BYTES = 50_000;

const ALLOWED_ENGINES = new Set(["healing", "business"]);

function resolvePromptPath(engine, promptId) {
  if (!ALLOWED_ENGINES.has(engine)) {
    throw Object.assign(new Error(`Invalid engine: '${engine}'.`), { code: "invalid_engine" });
  }
  if (promptId === "_system") {
    return join(AI_ROOT, engine, "system.md");
  }
  if (!VALID_PROMPT_ID.test(promptId) || promptId.includes("..") || promptId.includes("/") || promptId.includes("\\")) {
    throw Object.assign(new Error(`Invalid promptId format: '${promptId}'.`), { code: "invalid_prompt_id" });
  }
  if (!registries[engine]?.ids.has(promptId)) {
    throw Object.assign(new Error(`Prompt '${promptId}' not registered in '${engine}' engine.`), { code: "unregistered_prompt" });
  }
  return join(AI_ROOT, engine, "prompts", `${promptId}.md`);
}

export function readPromptSource(engine, promptId) {
  const path = resolvePromptPath(engine, promptId);
  if (!existsSync(path)) {
    throw Object.assign(new Error(`Prompt file missing for '${promptId}'.`), { code: "missing_prompt_files" });
  }
  const content = readFileSync(path, "utf-8");
  const sha256 = createHash("sha256").update(content).digest("hex");
  return { engine, promptId, content, sha256, bytes: Buffer.byteLength(content, "utf-8"), path };
}

export function writePromptSource(engine, promptId, content) {
  if (typeof content !== "string" || content.length === 0) {
    throw Object.assign(new Error("Prompt content must be a non-empty string."), { code: "empty_content" });
  }
  const bytes = Buffer.byteLength(content, "utf-8");
  if (bytes > MAX_PROMPT_BYTES) {
    throw Object.assign(new Error(`Prompt content exceeds ${MAX_PROMPT_BYTES} bytes.`), { code: "content_too_large" });
  }
  const path = resolvePromptPath(engine, promptId);
  let prevSha = null;
  if (existsSync(path)) {
    prevSha = createHash("sha256").update(readFileSync(path, "utf-8")).digest("hex");
  }
  const tmp = `${path}.tmp-${process.pid}-${Date.now()}`;
  writeFileSync(tmp, content, "utf-8");
  renameSync(tmp, path);
  const newSha = createHash("sha256").update(content).digest("hex");
  return { engine, promptId, prevSha, newSha, bytes, path };
}

export function listPromptIds(engine) {
  return [...(registries[engine]?.ids ?? [])];
}

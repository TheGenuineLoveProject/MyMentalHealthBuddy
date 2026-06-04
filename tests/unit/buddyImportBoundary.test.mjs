import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..", "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function normalizeRel(p) {
  return p.replace(/\\/g, "/");
}

const BUDDY_ENGINE_FILES = [
  "client/src/components/avatar/BuddyAvatar.tsx",
  "client/src/components/avatar/BuddyPanel.tsx",
  "client/src/lib/avatarState.ts",
  "client/src/lib/buddyTelemetry.ts",
  "server/routes/buddy.mjs",
  "server/ai/aiTelemetry.mjs",
];

const FORBIDDEN_IMPORT_TARGETS = [
  "server/routes/ai.mjs",
  "server/routes/ai.healing.mjs",
  "server/routes/ai.business.mjs",
  "server/routes/ai-dashboard.mjs",
  "server/ai/",
  "client/src/pages/Start.tsx",
];

const FORBIDDEN_TARGET_OVERRIDES = [
  "server/ai/aiTelemetry.mjs",
];

function aliasResolve(importPath) {
  if (importPath.startsWith("@/")) return path.join("client/src", importPath.slice(2));
  if (importPath.startsWith("@shared/")) return path.join("shared", importPath.slice(8));
  if (importPath.startsWith("@assets/")) return path.join("attached_assets", importPath.slice(8));
  return null;
}

function resolveImport(importPath, fromFileRel) {
  const isExternal =
    importPath.startsWith("node:") ||
    (!importPath.startsWith(".") &&
      !importPath.startsWith("/") &&
      !importPath.startsWith("@/") &&
      !importPath.startsWith("@shared/") &&
      !importPath.startsWith("@assets/"));

  if (isExternal) return null;

  let projectPath;
  const aliased = aliasResolve(importPath);

  if (aliased
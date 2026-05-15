/**
 * Phase 31 — Page Replacement Rollout Map.
 *
 * Tracks the migration of legacy Lumi imagery (raw PNG imports) over to
 * the canonical `OfficialLumi` registry component. This file is a
 * planning + audit surface only — it does NOT itself render Lumi or
 * mutate any page. Hosts consult `runReplacementAudit()` to know what
 * remains.
 *
 * The 11 entries here are deliberately a SUBSET of the 17 entries in
 * `lumiPagePlacementMap.ts`. The page map is the canonical placement
 * authority (covers crisis-support, error-state, etc.); the replacement
 * map is the rollout work-list (covers only legacy assets that need
 * swapping in).
 */

import type { LumiVariantId } from "./officialLumiRegistry";
import type { ReplacementEntry, ReplacementStatus } from "../types/lumiTypes";

const REPLACEMENT_ENTRIES = Object.freeze([
  Object.freeze({
    section: "Home Hero",
    oldAsset: "old-hero-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_SOFT_PRESENCE" as LumiVariantId,
    position: "hero",
    maxWidthPx: 320,
    status: "pending" as ReplacementStatus,
    notes: "CSS: .hero-lumi { width: min(42vw,340px); filter: drop-shadow(0 18px 30px rgba(126,144,110,0.16)); }",
  }),
  Object.freeze({
    section: "Calm Check-In",
    oldAsset: "check-in-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_MEDITATION" as LumiVariantId,
    position: "inline",
    maxWidthPx: 200,
    status: "pending" as ReplacementStatus,
  }),
  Object.freeze({
    section: "Breath Space",
    oldAsset: "breath-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_MEDITATION" as LumiVariantId,
    position: "hero",
    maxWidthPx: 280,
    status: "pending" as ReplacementStatus,
    notes: "Breath sync 7.1s cycle",
  }),
  Object.freeze({
    section: "Mood Space",
    oldAsset: "mood-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_EMOTION_ORB" as LumiVariantId,
    position: "hero",
    maxWidthPx: 260,
    status: "pending" as ReplacementStatus,
  }),
  Object.freeze({
    section: "Journal Sanctuary",
    oldAsset: "journal-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_COMPANION" as LumiVariantId,
    position: "inline",
    maxWidthPx: 180,
    status: "pending" as ReplacementStatus,
  }),
  Object.freeze({
    section: "Growth Journey",
    oldAsset: "growth-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_PATH" as LumiVariantId,
    position: "inline",
    maxWidthPx: 160,
    status: "pending" as ReplacementStatus,
    notes: "NO streak counters, NO percentage bars",
  }),
  Object.freeze({
    section: "Sleep Space",
    oldAsset: "sleep-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_CALM_FLOAT" as LumiVariantId,
    position: "hero",
    maxWidthPx: 280,
    status: "pending" as ReplacementStatus,
    notes: "Float 50% speed, lavender glow",
  }),
  Object.freeze({
    section: "Privacy / Safety",
    oldAsset: "privacy-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_HEART" as LumiVariantId,
    position: "hero",
    maxWidthPx: 260,
    status: "pending" as ReplacementStatus,
  }),
  Object.freeze({
    section: "Pricing / Pro",
    oldAsset: "pricing-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_HEART" as LumiVariantId,
    position: "inline",
    maxWidthPx: 120,
    status: "pending" as ReplacementStatus,
    notes: "Default NO Lumi. REMOVE if urgency language",
  }),
  Object.freeze({
    section: "Empty States",
    oldAsset: "empty-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_CALM_FLOAT" as LumiVariantId,
    position: "hero",
    maxWidthPx: 220,
    status: "pending" as ReplacementStatus,
  }),
  Object.freeze({
    section: "Success States",
    oldAsset: "success-lumi.png",
    newComponent: 'import { OfficialLumi } from "@/lumi-registry"',
    newVariant: "LUMI_HEART" as LumiVariantId,
    position: "inline",
    maxWidthPx: 140,
    status: "pending" as ReplacementStatus,
    notes: "NO confetti, NO bouncing, heart glow 0.08-0.15",
  }),
] as const);

if (REPLACEMENT_ENTRIES.length !== 11) {
  throw new Error(`[lumi-registry] REPLACEMENT_ENTRIES floor violated: expected 11, got ${REPLACEMENT_ENTRIES.length}.`);
}

/**
 * In-memory rollout state. Replacement progress is intentionally NOT
 * persisted across page loads — this is a planning surface, the page
 * placement map (`lumiPagePlacementMap.ts`) is the runtime authority.
 */
const liveStatus = new Map<string, ReplacementStatus>();
for (const e of REPLACEMENT_ENTRIES) liveStatus.set(e.section, e.status);

export const lumiPageReplacements: ReadonlyArray<ReplacementEntry> = REPLACEMENT_ENTRIES;

export function getReplacementStatus(section: string): ReplacementStatus | null {
  return liveStatus.get(section) ?? null;
}

export function markReplacementDone(section: string): boolean {
  if (!liveStatus.has(section)) return false;
  liveStatus.set(section, "done");
  return true;
}

export function markReplacementStatus(section: string, status: ReplacementStatus): boolean {
  if (!liveStatus.has(section)) return false;
  liveStatus.set(section, status);
  return true;
}

function withLiveStatus(): ReadonlyArray<ReplacementEntry> {
  return REPLACEMENT_ENTRIES.map((e) => ({ ...e, status: liveStatus.get(e.section) ?? e.status }));
}

export function getPendingReplacements(): ReadonlyArray<ReplacementEntry> {
  return withLiveStatus().filter((e) => e.status === "pending" || e.status === "in-progress");
}

export function getDoneReplacements(): ReadonlyArray<ReplacementEntry> {
  return withLiveStatus().filter((e) => e.status === "done");
}

export function getNextReplacement(): ReplacementEntry | null {
  const pending = withLiveStatus().filter((e) => e.status === "pending");
  return pending[0] ?? null;
}

export interface ReplacementAuditResult {
  readonly total: number;
  readonly done: number;
  readonly pending: number;
  readonly blocked: number;
  readonly inProgress: number;
  readonly progress: string;
  readonly percent: number;
  readonly nextUp: string | null;
}

export function runReplacementAudit(): ReplacementAuditResult {
  const live = withLiveStatus();
  let done = 0;
  let pending = 0;
  let blocked = 0;
  let inProgress = 0;
  for (const e of live) {
    if (e.status === "done") done += 1;
    else if (e.status === "pending") pending += 1;
    else if (e.status === "blocked") blocked += 1;
    else if (e.status === "in-progress") inProgress += 1;
  }
  const total = live.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const nextUp = getNextReplacement()?.section ?? null;
  return Object.freeze({
    total,
    done,
    pending,
    blocked,
    inProgress,
    progress: `${done}/${total}`,
    percent,
    nextUp,
  });
}

/**
 * Patterns used by repo-wide grep to find legacy raw-PNG references that
 * need migrating to `OfficialLumi`. Use with `getGrepCommand()` to print
 * a ready-to-run ripgrep invocation.
 */
export const OLD_AVATAR_GREP_PATTERNS: ReadonlyArray<string> = Object.freeze([
  "old-hero-lumi",
  "check-in-lumi",
  "breath-lumi",
  "mood-lumi",
  "journal-lumi",
  "growth-lumi",
  "sleep-lumi",
  "privacy-lumi",
  "pricing-lumi",
  "empty-lumi",
  "success-lumi",
  "mascot",
  "buddy-old",
  "avatar-legacy",
  "hero-bear",
  "green-bear",
] as const);

export function getGrepCommand(): string {
  const pattern = OLD_AVATAR_GREP_PATTERNS.join("|");
  return `rg -n --type ts --type tsx --type js --type jsx --type css --type html "${pattern}" client/`;
}

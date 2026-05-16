/**
 * Phase 23 (analysis-doc 8.3) — Cross-module integration smoke test.
 *
 * Closes the HIGH-priority gap from the platform-analysis recommendation
 * "8.3 Known Gaps to Close · No integration smoke test".
 *
 * Scope: pure contract assertions across modules. No React renderer, no
 * DOM, no Web Speech API, no live timers. Verifies that:
 *
 *   1. The ritual → scene → avatar end-to-end flow has a coherent type
 *      surface (every emotional state the avatar exposes resolves to a
 *      valid scene preset; every ritual key resolves to a valid scene +
 *      emotional state pairing).
 *   2. Cross-module governance contracts hold (no ritual closing text
 *      contains a forbidden voice phrase or boundary phrase; no boundary
 *      copy contains a forbidden boundary phrase; no scene preset fails
 *      its own audit).
 *   3. The cross-platform consistency module's verification surface
 *      matches the actual content of the avatar / scene / ritual modules
 *      (LUMI_EMOTIONAL_STATES count = avatar EMOTIONAL_STATES count;
 *      identity verification with truthful platform data passes 7/7;
 *      enforcement validation with a clean report has 0 critical fails).
 *   4. The ritual reducer reaches a terminal status from a normal play
 *      sequence (start → advance × N), and that terminal status resolves
 *      to a valid scene preset and avatar emotional state.
 *
 * Run from repo root:
 *   npx vitest run --config client/src/lumi-integration/tests/vitest.config.mjs
 */

import { describe, it, expect } from "vitest";

import {
  EMOTIONAL_STATES,
  type EmotionalState,
} from "../../avatar-life/types/avatarLifeTypes";

import {
  SCENE_STATES,
  resolvePreset,
  listPresets,
  type SceneState,
} from "../../lumi-scenes/runtime/ScenePresetEngine";
import { auditPreset as auditScenePreset } from "../../lumi-scenes/governance/presetSafetyRules";

import {
  RITUAL_KEYS,
  ritualReducer,
  isTerminalStatus,
  INITIAL_STATE,
  type RitualKey,
  type RitualState,
} from "../../lumi-rituals/runtime/RitualEngine";
import { listRituals, resolveRitual } from "../../lumi-rituals/runtime/ritualRegistry";
import {
  auditPreset as auditRitualPreset,
  containsForbiddenPhrase as ritualForbiddenPhrase,
} from "../../lumi-rituals/governance/ritualSafetyRules";

import {
  FORBIDDEN_PHRASES as VOICE_FORBIDDEN_PHRASES,
  containsForbiddenPhrase as voiceContainsForbidden,
} from "../../lumi-voice/governance/voiceSafetyRules";

import {
  listBoundaryCopy,
} from "../../lumi-boundaries/content/boundaryCopy";
import {
  containsForbiddenBoundaryPhrase,
} from "../../lumi-boundaries/governance/boundaryEnforcementRules";

import {
  LUMI_EMOTIONAL_STATES,
  LUMI_INTERACTION_PATTERNS,
  type LumiEmotionalState,
} from "../../lumi-consistency/tokens/lumiConsistencyTokens";
import { runIdentityVerification } from "../../lumi-consistency/runtime/identityVerificationSystem";
import { runEnforcementValidation } from "../../lumi-consistency/governance/crossPlatformEnforcementRules";

// ─── Frozen cross-module mapping tables (test-only) ──────────────────────────
//
// These tables encode the semantic equivalence between the avatar's
// `EmotionalState` union and the scene module's `SceneState` union. Both
// modules ship independently and use distinct names ("calmIdle" vs "calm",
// "peacefulJoy" vs "joySoft", "gentleConcern" vs "concernSoft", "welcoming"
// has no scene equivalent and falls back to "calm"). When the empty
// `lumi-bridge` module is implemented, this table will move into it.

const AVATAR_TO_SCENE: Readonly<Record<EmotionalState, SceneState>> = Object.freeze({
  calmIdle: "calm",
  grounding: "grounding",
  reflective: "reflective",
  sleepy: "sleepy",
  comforting: "comforting",
  peacefulJoy: "joySoft",
  gentleConcern: "concernSoft",
  welcoming: "calm",
});

const RITUAL_TO_SCENE: Readonly<Record<RitualKey, SceneState>> = Object.freeze({
  softArrival: "calm",
  oneBreathReset: "grounding",
  grounding54321: "grounding",
  gentleTransition: "reflective",
  holdingSpace: "concernSoft",
  sleepSoftener: "sleepy",
  tinyHope: "joySoft",
});

const RITUAL_TO_AVATAR: Readonly<Record<RitualKey, EmotionalState>> = Object.freeze({
  softArrival: "welcoming",
  oneBreathReset: "grounding",
  grounding54321: "grounding",
  gentleTransition: "reflective",
  holdingSpace: "gentleConcern",
  sleepSoftener: "sleepy",
  tinyHope: "peacefulJoy",
});

// Semantic equivalence between the lumi-consistency emotional vocabulary
// and the avatar emotional vocabulary. These two modules ship independent
// 8-state unions that share 5 names verbatim and rename 3:
//   consistency `joySoft`    ↔ avatar `peacefulJoy`
//   consistency `concernSoft` ↔ avatar `gentleConcern`
//   consistency `alert`       ↔ avatar `welcoming` (closest analogue —
//     consistency uses `alert` to mean "soft attention without alarm";
//     the avatar's `welcoming` is its analogue surface state).
// When semantic drift is introduced (a state added on one side without
// the other), this table breaks compile (Record exhaustiveness) or the
// per-key existence assertion fails. Count parity alone would not catch
// that.
const LUMI_TO_AVATAR: Readonly<Record<LumiEmotionalState, EmotionalState>> = Object.freeze({
  calmIdle: "calmIdle",
  comforting: "comforting",
  reflective: "reflective",
  sleepy: "sleepy",
  grounding: "grounding",
  joySoft: "peacefulJoy",
  concernSoft: "gentleConcern",
  alert: "welcoming",
});

// ─── 1. Type-surface alignment ───────────────────────────────────────────────

describe("Cross-module · type-surface alignment", () => {
  it("avatar EMOTIONAL_STATES has 8 entries", () => {
    expect(EMOTIONAL_STATES.length).toBe(8);
  });

  it("scene SCENE_STATES has 7 entries", () => {
    expect(SCENE_STATES.length).toBe(7);
  });

  it("LUMI_EMOTIONAL_STATES count matches avatar count", () => {
    expect(LUMI_EMOTIONAL_STATES.length).toBe(EMOTIONAL_STATES.length);
  });

  it("LUMI_INTERACTION_PATTERNS exposes 8 patterns", () => {
    expect(LUMI_INTERACTION_PATTERNS.length).toBe(8);
  });

  it("every LumiEmotionalState semantically maps to a valid avatar EmotionalState", () => {
    // Stronger than count parity: catches drift like "consistency added a
    // 9th state without an avatar equivalent" or "avatar renamed
    // welcoming → greeting and the bridge silently broke".
    for (const lumiState of LUMI_EMOTIONAL_STATES) {
      const avatarState = LUMI_TO_AVATAR[lumiState];
      expect(avatarState, `no avatar equivalent for lumi state "${lumiState}"`).toBeDefined();
      expect(EMOTIONAL_STATES.includes(avatarState)).toBe(true);
    }
  });

  it("every avatar EmotionalState maps to a valid SceneState", () => {
    for (const state of EMOTIONAL_STATES) {
      const scene = AVATAR_TO_SCENE[state];
      expect(SCENE_STATES.includes(scene)).toBe(true);
    }
  });

  it("every ritual key maps to a valid SceneState", () => {
    for (const key of RITUAL_KEYS) {
      const scene = RITUAL_TO_SCENE[key];
      expect(SCENE_STATES.includes(scene)).toBe(true);
    }
  });

  it("every ritual key maps to a valid avatar EmotionalState", () => {
    for (const key of RITUAL_KEYS) {
      const state = RITUAL_TO_AVATAR[key];
      expect(EMOTIONAL_STATES.includes(state)).toBe(true);
    }
  });
});

// ─── 2. Cross-module governance ──────────────────────────────────────────────

describe("Cross-module · governance contracts", () => {
  it("every shipped ritual passes its own audit", () => {
    for (const preset of listRituals()) {
      // auditRitualPreset throws on violation
      expect(() => auditRitualPreset(preset)).not.toThrow();
    }
  });

  it("every shipped scene preset passes its own audit", () => {
    for (const preset of listPresets()) {
      expect(() => auditScenePreset(preset)).not.toThrow();
    }
  });

  it("no ritual invitation or closing text contains a voice forbidden phrase", () => {
    for (const preset of listRituals()) {
      expect(voiceContainsForbidden(preset.invitationText)).toBe(false);
      expect(voiceContainsForbidden(preset.closing)).toBe(false);
    }
  });

  it("no ritual step copy contains a voice forbidden phrase", () => {
    for (const preset of listRituals()) {
      for (const step of preset.steps) {
        expect(voiceContainsForbidden(step.copy)).toBe(false);
        if (step.microCopy) {
          expect(voiceContainsForbidden(step.microCopy)).toBe(false);
        }
      }
    }
  });

  it("no ritual step copy trips the rituals' own forbidden phrase scanner", () => {
    for (const preset of listRituals()) {
      for (const step of preset.steps) {
        expect(ritualForbiddenPhrase(step.copy)).toBe(false);
      }
    }
  });

  it("no positive boundary copy line contains a forbidden boundary phrase", () => {
    // NOTE: `doesNot` entries intentionally quote forbidden phrases as
    // cautionary examples (e.g. "Say 'I love you' or use romantic
    // language."). We only scan the affirmative surfaces — name,
    // description, and `does` — for actual production language.
    for (const card of listBoundaryCopy()) {
      const lines = [card.name, card.description, ...card.does];
      for (const line of lines) {
        expect(containsForbiddenBoundaryPhrase(line)).toBe(false);
      }
    }
  });

  it("voice FORBIDDEN_PHRASES list is non-empty (smoke)", () => {
    expect(VOICE_FORBIDDEN_PHRASES.length).toBeGreaterThanOrEqual(23);
  });

  it("no ritual text contains a forbidden boundary phrase (cross-governance)", () => {
    // Belt-and-braces: a ritual whose copy drifted into boundary-violating
    // language (e.g. "trust me", "only I can help") would slip past the
    // rituals' own scanner because that scanner has a different word list.
    // This assertion enforces that ritual copy clears the boundary
    // module's stricter intimacy/dependency phrases as well.
    for (const preset of listRituals()) {
      const lines: string[] = [preset.invitationText, preset.closing];
      for (const step of preset.steps) {
        lines.push(step.copy);
        if (step.microCopy) lines.push(step.microCopy);
      }
      for (const line of lines) {
        expect(
          containsForbiddenBoundaryPhrase(line),
          `ritual "${preset.ritualKey}" contains a forbidden boundary phrase: "${line}"`,
        ).toBe(false);
      }
    }
  });
});

// ─── 3. lumi-consistency verification surface ────────────────────────────────

describe("Cross-module · lumi-consistency verification", () => {
  it("identity verification passes 7/7 with truthful platform data", () => {
    const report = runIdentityVerification("web", {
      identityName: "Lumi",
      identityRole: "companion",
      maxVolume: 0.4,
      autoplayAllowed: false,
      breathCycleMs: 7100,
      emotionalStateCount: LUMI_EMOTIONAL_STATES.length,
      interactionPatternCount: LUMI_INTERACTION_PATTERNS.length,
    });
    expect(report.passed).toBe(true);
    expect(report.complianceScore).toBe(100);
    expect(report.passedCount).toBe(7);
  });

  it("identity verification fails closed when name/role drift", () => {
    const report = runIdentityVerification("web", {
      identityName: "Buddy",
      identityRole: "friend",
      maxVolume: 0.4,
      autoplayAllowed: false,
      breathCycleMs: 7100,
      emotionalStateCount: LUMI_EMOTIONAL_STATES.length,
      interactionPatternCount: LUMI_INTERACTION_PATTERNS.length,
    });
    expect(report.passed).toBe(false);
    expect(report.complianceScore).toBeLessThan(100);
  });

  it("enforcement validation reports 0 critical failures with a clean report", () => {
    const report = runEnforcementValidation({
      platform: "web",
      identityName: "Lumi",
      identityRole: "companion",
      autoplayAllowed: false,
      maxVolume: 0.4,
      captionsAvailable: true,
      honorsReducedMotion: true,
      emotionalStateCount: LUMI_EMOTIONAL_STATES.length,
      interactionPatternCount: LUMI_INTERACTION_PATTERNS.length,
      crisisRouteAvailable: true,
      anyOptInDefaultsOn: false,
      anyForbiddenPhraseInCopy: false,
      toneMarkerCoverage: 0.9,
    });
    expect(report.criticalFailures).toBe(0);
    expect(report.passed).toBe(true);
  });

  it("enforcement validation flags missing captions as a critical failure", () => {
    const report = runEnforcementValidation({
      platform: "web",
      identityName: "Lumi",
      identityRole: "companion",
      autoplayAllowed: false,
      maxVolume: 0.4,
      captionsAvailable: false,
      crisisRouteAvailable: true,
    });
    expect(report.criticalFailures).toBeGreaterThan(0);
    expect(report.passed).toBe(false);
  });
});

// ─── 4. End-to-end ritual flow → scene + avatar resolution ───────────────────

function playToTerminal(key: RitualKey): RitualState {
  const preset = resolveRitual(key);
  let state: RitualState = ritualReducer(INITIAL_STATE, { type: "start" }, preset);
  // Soft cap on iterations to defend against an unintentional infinite loop.
  const maxAdvances = preset.steps.length + 4;
  let i = 0;
  while (!isTerminalStatus(state.status) && i < maxAdvances) {
    state = ritualReducer(state, { type: "advance" }, preset);
    i += 1;
  }
  return state;
}

describe("Cross-module · end-to-end ritual flow", () => {
  it("every ritual reaches a terminal status via start + advance sequence", () => {
    for (const key of RITUAL_KEYS) {
      const final = playToTerminal(key);
      expect(isTerminalStatus(final.status)).toBe(true);
    }
  });

  it("terminal ritual maps to a resolvable scene preset for every key", () => {
    for (const key of RITUAL_KEYS) {
      const final = playToTerminal(key);
      expect(isTerminalStatus(final.status)).toBe(true);
      const sceneKey = RITUAL_TO_SCENE[key];
      const preset = resolvePreset(sceneKey);
      expect(preset).toBeDefined();
      expect(preset.state).toBe(sceneKey);
      expect(() => auditScenePreset(preset)).not.toThrow();
    }
  });

  it("terminal ritual maps to a valid avatar EmotionalState for every key", () => {
    for (const key of RITUAL_KEYS) {
      const avatarState = RITUAL_TO_AVATAR[key];
      expect(EMOTIONAL_STATES.includes(avatarState)).toBe(true);
      // And the avatar state's scene equivalent passes audit too.
      const scene = AVATAR_TO_SCENE[avatarState];
      const preset = resolvePreset(scene);
      expect(() => auditScenePreset(preset)).not.toThrow();
    }
  });
});

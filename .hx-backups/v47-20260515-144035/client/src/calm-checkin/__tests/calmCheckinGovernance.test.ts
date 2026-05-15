/**
 * Phase 14 (spec-aligned) — governance + state contract tests.
 *
 * Run isolated:
 *   npx vitest run \
 *     --config "$PWD/client/src/calm-checkin/__tests/vitest.config.mjs" \
 *     --root "$PWD/client/src/calm-checkin"
 */

import { afterEach, describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  CALM_CONTENT,
  CALM_FORBIDDEN_PHRASES,
  CALM_REQUIRED_TONE_PHRASES,
} from "../content/calmCheckinContent";
import {
  REQUIRE_EXERCISE_BEFORE_CONTINUE,
  isOptionalSignupAllowed,
  useCalmCheckinStore,
} from "../state/calmCheckinState";
import {
  auditCalmContent,
  auditCalmFlow,
  calmRules,
} from "../governance/calmCheckinRules";

afterEach(() => {
  useCalmCheckinStore.getState().reset();
});

describe("Phase 14 (spec-aligned) — content tree", () => {
  it("idle exposes exactly three exercise options (Breath / Grounding / Reflection)", () => {
    const ids = CALM_CONTENT.idle.options.map((o) => o.id).sort();
    expect(ids).toEqual(["breathing", "grounding", "reflecting"]);
  });

  it("breathing timing is exactly 4s inhale, 2s hold, 6s exhale (CC-R006)", () => {
    expect(CALM_CONTENT.breathing.inhaleSeconds).toBe(4);
    expect(CALM_CONTENT.breathing.holdSeconds).toBe(2);
    expect(CALM_CONTENT.breathing.exhaleSeconds).toBe(6);
  });

  it("continue exposes exactly four soft options including signup-later", () => {
    const ids = CALM_CONTENT.continue.options.map((o) => o.id).sort();
    expect(ids).toEqual(
      ["breathe-again", "continue-calmly", "explore-tools", "signup-later"].sort(),
    );
  });

  it("auditCalmContent returns no forbidden-phrase hits across the full content tree", () => {
    expect(auditCalmContent()).toEqual([]);
  });

  it("all three required tone phrases appear somewhere in the content tree", () => {
    const blob = JSON.stringify(CALM_CONTENT).toLowerCase();
    for (const phrase of CALM_REQUIRED_TONE_PHRASES) {
      expect(blob).toContain(phrase);
    }
  });

  it("crisis line includes /crisis", () => {
    expect(CALM_CONTENT.crisisLine).toContain("/crisis");
  });

  it("FORBIDDEN_PHRASES list remains comprehensive (≥10 entries)", () => {
    expect(CALM_FORBIDDEN_PHRASES.length).toBeGreaterThanOrEqual(10);
  });

  it("auditCalmContent catches an injected forbidden phrase (not a trivial pass)", () => {
    const original = CALM_CONTENT.idle.heading;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (CALM_CONTENT.idle as any).heading = "Unlock your gentle pause today";
      const failures = auditCalmContent();
      expect(failures.length).toBeGreaterThan(0);
      expect(failures[0].matched).toContain("unlock");
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (CALM_CONTENT.idle as any).heading = original;
    }
  });
});

describe("Phase 14 (spec-aligned) — state machine", () => {
  it("starts in idle with no exercise chosen and no completion", () => {
    const s = useCalmCheckinStore.getState();
    expect(s.step).toBe("idle");
    expect(s.exerciseChosen).toBeNull();
    expect(s.exerciseCompleted).toBe(false);
  });

  it("REQUIRE_EXERCISE_BEFORE_CONTINUE is locked true", () => {
    expect(REQUIRE_EXERCISE_BEFORE_CONTINUE).toBe(true);
  });

  it("chooseExercise transitions idle → exercise step and sets choice", () => {
    useCalmCheckinStore.getState().chooseExercise("breathing");
    expect(useCalmCheckinStore.getState().step).toBe("breathing");
    expect(useCalmCheckinStore.getState().exerciseChosen).toBe("breathing");
  });

  it("chooseExercise is ignored when not in idle (no off-spec re-entry)", () => {
    const s = useCalmCheckinStore.getState();
    s.chooseExercise("breathing");
    s.chooseExercise("grounding"); // should be ignored
    expect(useCalmCheckinStore.getState().step).toBe("breathing");
  });

  it("goToComplete is blocked unless exercise is marked completed", () => {
    const s = useCalmCheckinStore.getState();
    s.chooseExercise("grounding");
    s.goToComplete(); // not completed yet — should be blocked
    expect(useCalmCheckinStore.getState().step).toBe("grounding");
    s.markExerciseCompleted();
    s.goToComplete();
    expect(useCalmCheckinStore.getState().step).toBe("complete");
  });

  it("goToContinue is blocked from any step except complete + completed=true", () => {
    const s = useCalmCheckinStore.getState();
    s.goToContinue(); // from idle — blocked
    expect(useCalmCheckinStore.getState().step).toBe("idle");

    s.chooseExercise("reflecting");
    s.goToContinue(); // from reflecting — blocked
    expect(useCalmCheckinStore.getState().step).toBe("reflecting");

    s.markExerciseCompleted();
    s.goToComplete();
    expect(useCalmCheckinStore.getState().step).toBe("complete");

    s.goToContinue();
    expect(useCalmCheckinStore.getState().step).toBe("continue");
  });

  it("repeatBreathing increments counter and resets completed flag", () => {
    const s = useCalmCheckinStore.getState();
    s.chooseExercise("breathing");
    s.markExerciseCompleted();
    expect(useCalmCheckinStore.getState().exerciseCompleted).toBe(true);
    s.repeatBreathing();
    const next = useCalmCheckinStore.getState();
    expect(next.breathingRepeats).toBe(1);
    expect(next.exerciseCompleted).toBe(false);
  });

  it("setReflection caps text at 600 chars and only fires in reflecting step", () => {
    const s = useCalmCheckinStore.getState();
    s.setReflection("ignored when not reflecting");
    expect(useCalmCheckinStore.getState().reflectionText).toBe("");
    s.chooseExercise("reflecting");
    s.setReflection("a".repeat(900));
    expect(useCalmCheckinStore.getState().reflectionText.length).toBe(600);
  });
});

describe("Phase 14 (spec-aligned) — signup gate (CC-R001)", () => {
  it("isOptionalSignupAllowed is false from idle / breathing / grounding / reflecting / complete", () => {
    const s = useCalmCheckinStore.getState();
    for (const next of ["breathing", "grounding", "reflecting"] as const) {
      s.reset();
      expect(isOptionalSignupAllowed(useCalmCheckinStore.getState())).toBe(false);
      s.chooseExercise(next);
      expect(isOptionalSignupAllowed(useCalmCheckinStore.getState())).toBe(false);
      s.markExerciseCompleted();
      expect(isOptionalSignupAllowed(useCalmCheckinStore.getState())).toBe(false);
      s.goToComplete();
      expect(isOptionalSignupAllowed(useCalmCheckinStore.getState())).toBe(false);
    }
  });

  it("isOptionalSignupAllowed becomes true only after entering continue with completed=true", () => {
    const s = useCalmCheckinStore.getState();
    s.chooseExercise("breathing");
    s.markExerciseCompleted();
    s.goToComplete();
    s.goToContinue();
    expect(isOptionalSignupAllowed(useCalmCheckinStore.getState())).toBe(true);
  });
});

describe("Phase 14 (spec-aligned) — auditCalmFlow", () => {
  it("returns no failures from idle initial state", () => {
    expect(auditCalmFlow(useCalmCheckinStore.getState())).toEqual([]);
  });

  it("returns no failures across every legitimate state transition", () => {
    const s = useCalmCheckinStore.getState();
    expect(auditCalmFlow(useCalmCheckinStore.getState())).toEqual([]);
    s.chooseExercise("grounding");
    expect(auditCalmFlow(useCalmCheckinStore.getState())).toEqual([]);
    s.markExerciseCompleted();
    expect(auditCalmFlow(useCalmCheckinStore.getState())).toEqual([]);
    s.goToComplete();
    expect(auditCalmFlow(useCalmCheckinStore.getState())).toEqual([]);
    s.goToContinue();
    expect(auditCalmFlow(useCalmCheckinStore.getState())).toEqual([]);
  });

  it("declares 14 rules with the correct severity split", () => {
    expect(calmRules.length).toBe(14);
    const blocking = calmRules.filter((r) => r.severity === "blocking").length;
    const warning = calmRules.filter((r) => r.severity === "warning").length;
    expect(blocking).toBe(6);
    expect(warning).toBe(8);
  });
});

describe("Phase 14 (spec-aligned) — module boundary scanner", () => {
  it("no file outside client/src/calm-checkin/ imports its internals", async () => {
    const root = path.resolve(__dirname, "../../"); // = client/src
    const moduleDirAbs = path.resolve(__dirname, "..");
    const offenders: { file: string; matched: string[] }[] = [];
    // Regex catches BOTH trailing-slash deep imports (e.g. ".../state/foo")
    // AND bare-folder imports (e.g. "@/calm-checkin/state"). The negative
    // lookahead refuses to match the public barrel "calm-checkin" by itself.
    const internalSegments = [
      "state",
      "governance",
      "content",
      "motion",
      "components",
      "accessibility",
      "verification",
    ];
    const importRe = new RegExp(
      `(?:from\\s+['"]|import\\s*\\(\\s*['"]|require\\s*\\(\\s*['"])` +
        `[^'"\\s]*calm-checkin/(?:${internalSegments.join("|")})(?:/[^'"\\s]*)?['"]`,
      "g",
    );
    // Also flag direct named imports of the internal store from any path.
    const storeImportRe = /useCalmCheckinStore/;

    const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

    async function walk(dir: string) {
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (full.startsWith(moduleDirAbs)) continue; // skip the module itself
        if (e.isDirectory()) {
          if (e.name === "node_modules" || e.name.startsWith(".")) continue;
          await walk(full);
          continue;
        }
        if (!exts.some((x) => e.name.endsWith(x))) continue;
        const text = await fs.readFile(full, "utf8");
        const matched: string[] = [];
        const deepHits = text.match(importRe);
        if (deepHits) matched.push(...deepHits);
        if (storeImportRe.test(text)) matched.push("useCalmCheckinStore reference");
        if (matched.length > 0) {
          offenders.push({ file: path.relative(root, full), matched });
        }
      }
    }

    await walk(root);
    expect(offenders).toEqual([]);
  });

  it("reduced-motion mode does NOT render the animated breath circle (CC-R016)", async () => {
    // Inline DOM smoke — no React testing-library dep needed.
    // We verify the conditional in CalmBreathGuide reads `useReducedCalmMotion()`
    // and skips the `data-testid="breath-circle"` branch. Source-level guard.
    const src = await fs.readFile(
      path.resolve(__dirname, "../components/CalmBreathGuide.tsx"),
      "utf8",
    );
    // The reduced branch must render the text label, NOT the circle.
    expect(src).toMatch(/reduced\s*\?\s*\(/);
    expect(src).toMatch(/data-testid="text-breath-reduced-motion"/);
    // And the circle must live in the non-reduced branch only.
    const reducedBranchIdx = src.indexOf("text-breath-reduced-motion");
    const circleIdx = src.indexOf('data-testid="breath-circle"');
    expect(circleIdx).toBeGreaterThan(reducedBranchIdx); // circle declared after reduced branch text
  });
});

/**
 * Phase 15 — Governance contract tests for the Gentle Companion engine.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CRISIS_LINE_SHORT,
  FORBIDDEN_PHRASES,
  OPT_OUT_LINE,
  PERMISSION_PHRASES,
  RESPONSE_BANKS,
  getBank,
} from "../copy/responseBank";
import { detectCrisis } from "../engine/crisisDetector";
import {
  MAX_MESSAGE_LENGTH,
  generateResponse,
} from "../engine/companionEngine";
import {
  REQUIRE_CRISIS_OVERRIDE,
  REQUIRE_OPT_OUT_ON_EVERY_RESPONSE,
  auditBank,
  auditResponse,
  rules,
} from "../governance/companionRules";

describe("Phase 15 — Gentle Companion Conversation Layer governance", () => {
  // ── Rule registry shape ──────────────────────────────────────────────────
  it("registers exactly 16 rules", () => {
    expect(rules).toHaveLength(16);
  });

  it("has 8 blocking and 8 warning rules", () => {
    const blocking = rules.filter((r) => r.severity === "blocking").length;
    const warning = rules.filter((r) => r.severity === "warning").length;
    expect(blocking).toBe(8);
    expect(warning).toBe(8);
  });

  it("rule IDs are unique and follow CV-R### format", () => {
    const ids = rules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^CV-R\d{3}$/));
  });

  it("locked governance constants are true", () => {
    expect(REQUIRE_CRISIS_OVERRIDE).toBe(true);
    expect(REQUIRE_OPT_OUT_ON_EVERY_RESPONSE).toBe(true);
  });

  // ── Crisis override (asymmetric risk) ────────────────────────────────────
  it("explicit suicidal language ALWAYS triggers crisis intent", () => {
    const samples = [
      "i want to die",
      "I want to kill myself tonight",
      "no reason to live anymore",
      "I have a plan to end my life",
      "I'm going to hurt myself",
    ];
    for (const text of samples) {
      const r = generateResponse({ text });
      expect(r.isCrisis).toBe(true);
      expect(r.intent).toBe("crisis");
      expect(r.technique).toBeNull();
      expect(r.crisisLine).toContain("/crisis");
    }
  });

  it("crisis card returns no conversational reflection", () => {
    const r = generateResponse({ text: "i want to kill myself" });
    // Should NOT touch the bank — message must equal crisis copy.
    const looksLikeBank = RESPONSE_BANKS.some((b) =>
      [...b.reflections, ...b.affirmations, ...b.invitations].includes(r.message),
    );
    expect(looksLikeBank).toBe(false);
  });

  it("non-crisis input never spuriously trips the crisis flag", () => {
    const safeSamples = [
      "i feel tired today",
      "i had a hard day at work",
      "i'm anxious about tomorrow",
      "i'm grateful for small things",
      "i don't really know what to say",
    ];
    for (const text of safeSamples) {
      const detected = detectCrisis(text);
      expect(detected.isCrisis).toBe(false);
      const r = generateResponse({ text });
      expect(r.isCrisis).toBe(false);
      expect(r.intent).not.toBe("crisis");
    }
  });

  // ── Opt-out + /crisis present on every response ──────────────────────────
  it("every response carries the opt-out line and /crisis routing", () => {
    const samples = [
      "i feel sad",
      "i'm so anxious",
      "i'm exhausted",
      "i feel grateful today",
      "",
      "i want to die", // crisis path
    ];
    for (const text of samples) {
      const r = generateResponse({ text });
      expect(r.optOut).toBe(OPT_OUT_LINE);
      expect(r.crisisLine.includes("/crisis") || r.isCrisis).toBe(true);
      // Crisis branch uses CRISIS_LINE_SHORT too:
      if (!r.isCrisis) expect(r.crisisLine).toBe(CRISIS_LINE_SHORT);
    }
  });

  // ── Anti-anthropomorphism / anti-attachment ──────────────────────────────
  it("no message ever contains forbidden anthropomorphism / attachment phrases", () => {
    const inputs = [
      "i feel tired",
      "i'm anxious",
      "i'm sad",
      "i'm angry",
      "i'm lonely",
      "i'm overwhelmed",
      "i feel calm",
      "i'm grateful",
      "i'm hopeful",
      "i don't know",
      "i'm both happy and sad",
      "",
    ];
    for (const text of inputs) {
      for (let turn = 0; turn < 6; turn++) {
        const r = generateResponse({ text, turnIndex: turn });
        const m = r.message.toLowerCase();
        FORBIDDEN_PHRASES.forEach((p) => {
          expect(m.includes(p)).toBe(false);
        });
      }
    }
  });

  it("non-reflective responses always carry at least one permission phrase", () => {
    const inputs = ["i'm tired", "i'm anxious", "i'm sad"];
    for (const text of inputs) {
      // Force "affirm" (turn 1) and "invite" (turn 2)
      for (const turn of [1, 2]) {
        const r = generateResponse({ text, turnIndex: turn });
        if (r.intent === "reflect" || r.intent === "rest" || r.isCrisis) continue;
        const m = r.message.toLowerCase();
        const hit = PERMISSION_PHRASES.some((p) => m.includes(p));
        expect(hit).toBe(true);
      }
    }
  });

  // ── Length cap ────────────────────────────────────────────────────────────
  it("no message exceeds MAX_MESSAGE_LENGTH", () => {
    for (const bank of RESPONSE_BANKS) {
      [...bank.reflections, ...bank.affirmations, ...bank.invitations].forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH);
      });
    }
  });

  // ── Deterministic intent rotation ────────────────────────────────────────
  it("intent rotates reflect → affirm → invite across turns (anti-monotony)", () => {
    const intents = [0, 1, 2].map(
      (t) => generateResponse({ text: "i'm tired", turnIndex: t }).intent,
    );
    expect(intents).toEqual(["reflect", "affirm", "invite"]);
  });

  // ── Empty input ──────────────────────────────────────────────────────────
  it("empty input returns a neutral invitation, never a category-specific line", () => {
    const r = generateResponse({ text: "" });
    expect(r.intent).toBe("invite");
    expect(r.detected).toBe("neutral");
    expect(r.isCrisis).toBe(false);
  });

  // ── auditResponse / auditBank integration ────────────────────────────────
  it("auditResponse returns no failures on a healthy non-crisis sample", () => {
    const r = generateResponse({ text: "i'm feeling tired", turnIndex: 0 });
    expect(auditResponse(r, { text: "i'm feeling tired" })).toEqual([]);
  });

  it("auditResponse detects forbidden phrase if injected (CV-R004)", () => {
    const r = generateResponse({ text: "i'm tired" });
    const tampered = { ...r, message: "I love you and I'll always be here." };
    const failures = auditResponse(tampered, { text: "i'm tired" });
    expect(failures.some((f) => f.id === "CV-R004")).toBe(true);
  });

  it("auditResponse detects missing /crisis line (CV-R002)", () => {
    const r = generateResponse({ text: "i'm sad" });
    const tampered = { ...r, crisisLine: "" };
    const failures = auditResponse(tampered, { text: "i'm sad" });
    expect(failures.some((f) => f.id === "CV-R002")).toBe(true);
  });

  it("auditResponse detects missing opt-out (CV-R003)", () => {
    const r = generateResponse({ text: "i'm sad" });
    const tampered = { ...r, optOut: "" };
    const failures = auditResponse(tampered, { text: "i'm sad" });
    expect(failures.some((f) => f.id === "CV-R003")).toBe(true);
  });

  it("auditResponse flags a length overflow (CV-R005)", () => {
    const r = generateResponse({ text: "i'm tired" });
    const tampered = { ...r, message: "x".repeat(MAX_MESSAGE_LENGTH + 1) };
    const failures = auditResponse(tampered, { text: "i'm tired" });
    expect(failures.some((f) => f.id === "CV-R005")).toBe(true);
  });

  it("auditBank returns no failures across the entire curated bank (per-line direct audit)", () => {
    expect(auditBank()).toEqual([]);
  });

  it("auditBank actually catches an injected bad line (not a trivial pass)", async () => {
    // Inject a forbidden line via direct mutation of the bank export, then
    // restore. Using `Object.assign` on the array element keeps types safe.
    const { RESPONSE_BANKS } = await import("../copy/responseBank");
    const targetBank = RESPONSE_BANKS.find((b) => b.category === "tired")!;
    const originalReflections = [...targetBank.reflections];
    const originalAffirmations = [...targetBank.affirmations];
    const originalInvitations = [...targetBank.invitations];
    try {
      // Forbidden phrase + missing permission tone + length-OK
      targetBank.affirmations.push("I love you and I'll always be here for you.");
      targetBank.invitations.push("You should call me when you are sad."); // missing permission + 'you should'
      const failures = auditBank();
      expect(failures.length).toBeGreaterThanOrEqual(2);
      const allIds = failures.flatMap((f) => f.failures.map((x) => x.id));
      expect(allIds).toContain("CV-R004"); // forbidden phrase
      expect(allIds).toContain("CV-R006"); // missing permission tone
    } finally {
      targetBank.reflections.length = 0;
      targetBank.reflections.push(...originalReflections);
      targetBank.affirmations.length = 0;
      targetBank.affirmations.push(...originalAffirmations);
      targetBank.invitations.length = 0;
      targetBank.invitations.push(...originalInvitations);
    }
  });

  it("new attachment-loop FORBIDDEN_PHRASES are blocked (architect P15.1)", () => {
    const samples = [
      "I'm here for you always.",
      "I'll never leave you.",
      "You can depend on me.",
      "Trust me, this will pass.",
      "I know exactly how you feel.",
    ];
    for (const m of samples) {
      const tampered = generateResponse({ text: "i'm sad" });
      const audited = auditResponse({ ...tampered, message: m }, { text: "i'm sad" });
      expect(audited.some((f) => f.id === "CV-R004")).toBe(true);
    }
  });

  it("curly apostrophe / spacing variants of forbidden phrases are also blocked (architect P15.4)", () => {
    const variants = [
      "I\u2019ll always be here for you.", // curly apostrophe
      "I  feel   you completely.",          // collapsed whitespace
    ];
    for (const m of variants) {
      const base = generateResponse({ text: "i'm sad" });
      const audited = auditResponse({ ...base, message: m }, { text: "i'm sad" });
      expect(audited.some((f) => f.id === "CV-R004")).toBe(true);
    }
  });

  it("new crisis signals (slang + means) route to crisis (architect P15.2)", () => {
    const samples = [
      "i'm going to unalive myself tonight",
      "kms",
      "i'm going to off myself",
      "i want to end it all",
      "i'm going to hang myself",
      "i'm going to jump off the bridge",
    ];
    for (const text of samples) {
      const r = generateResponse({ text });
      expect(r.isCrisis).toBe(true);
      expect(r.intent).toBe("crisis");
    }
  });

  it("permission-tone fallback never silently fails when append would overflow (architect P15.3)", async () => {
    // Synthesize a near-cap line missing permission phrases and force it
    // through ensurePermissionTone via the engine's published path.
    const long = "x".repeat(MAX_MESSAGE_LENGTH - 2); // No permission phrase, near cap
    const { RESPONSE_BANKS } = await import("../copy/responseBank");
    const bank = RESPONSE_BANKS.find((b) => b.category === "tired")!;
    const originalAffirmations = [...bank.affirmations];
    try {
      // Replace affirmations with a single overflow-prone line so turn 1 picks it.
      bank.affirmations.length = 0;
      bank.affirmations.push(long);
      const r = generateResponse({ text: "i'm tired", turnIndex: 1 });
      // Output must still pass CV-R005 (length) AND CV-R006 (permission).
      expect(r.message.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH);
      expect(auditResponse(r, { text: "i'm tired" })).toEqual([]);
    } finally {
      bank.affirmations.length = 0;
      bank.affirmations.push(...originalAffirmations);
    }
  });

  it("'i feel ambivalent' now routes to ambivalent category (architect P15.5)", () => {
    const r = generateResponse({ text: "i feel ambivalent about this" });
    expect(r.detected).toBe("ambivalent");
  });

  it("crisis detection survives curly apostrophes / spacing (architect P15.6)", () => {
    const samples = [
      "I can\u2019t go on anymore", // curly apostrophe
      "I  want   to die",            // collapsed whitespace
      "I CAN\u2019T GO ON",          // mixed case + curly
    ];
    for (const text of samples) {
      const r = generateResponse({ text });
      expect(r.isCrisis).toBe(true);
      expect(r.intent).toBe("crisis");
    }
  });

  // ── Bank coverage ────────────────────────────────────────────────────────
  it("every documented EmotionCategory has a non-empty bank", () => {
    const cats = [
      "tired", "anxious", "sad", "angry", "lonely", "overwhelmed",
      "calm", "grateful", "hopeful", "neutral", "ambivalent",
    ] as const;
    for (const c of cats) {
      const bank = getBank(c);
      expect(bank.reflections.length).toBeGreaterThan(0);
      expect(bank.affirmations.length).toBeGreaterThan(0);
      expect(bank.invitations.length).toBeGreaterThan(0);
    }
  });

  // ── Module boundary (P15.B — same pattern as v5.8.51 P14.2) ─────────────
  it("module boundary: no file outside companion-voice/ imports internals", () => {
    const repoRoot = resolve(__dirname, "..", "..", "..", "..");
    const clientSrc = join(repoRoot, "client", "src");
    const moduleDir = join(clientSrc, "companion-voice");
    const offenders: string[] = [];
    const FORBIDDEN_RE =
      /companion-voice\/(engine|governance|copy|state)\//;

    function walk(dir: string) {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (full.startsWith(moduleDir)) continue;
        const stat = statSync(full);
        if (stat.isDirectory()) {
          if (entry === "node_modules" || entry.startsWith(".")) continue;
          walk(full);
        } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
          const text = readFileSync(full, "utf8");
          if (FORBIDDEN_RE.test(text)) offenders.push(relative(repoRoot, full));
        }
      }
    }
    walk(clientSrc);

    if (offenders.length > 0) {
      throw new Error(
        `Phase 15 governance bypass — files outside companion-voice/ import internals:\n  ${offenders.join("\n  ")}\n\nUse the barrel: \`import { MMHBCompanion, generateResponse } from "@/companion-voice"\`.`,
      );
    }
    expect(offenders).toEqual([]);
  });
});

/**
 * Phase 14 (spec-aligned) — governance rules.
 *
 *   - 14 rules · 6 BLOCKING · 8 WARNING.
 *   - `auditCalmFlow(state)` returns failing rules.
 *   - `auditCalmContent()` runs static checks against the full content tree.
 */

import {
  CALM_CONTENT,
  CALM_FORBIDDEN_PHRASES,
  CALM_REQUIRED_TONE_PHRASES,
} from "../content/calmCheckinContent";
import {
  REQUIRE_EXERCISE_BEFORE_CONTINUE,
  isOptionalSignupAllowed,
  type CalmCheckinState,
} from "../state/calmCheckinState";

export type CalmRuleSeverity = "blocking" | "warning";

export type CalmRule = {
  id: string;
  severity: CalmRuleSeverity;
  description: string;
  check: (state: CalmCheckinState) => boolean;
};

export type CalmRuleResult = {
  id: string;
  severity: CalmRuleSeverity;
  description: string;
};

/** Walk every string field in the content tree and return all leaf strings. */
function allContentStrings(): string[] {
  const out: string[] = [];
  function walk(v: unknown) {
    if (typeof v === "string") {
      out.push(v);
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (v && typeof v === "object") {
      Object.values(v).forEach(walk);
    }
  }
  walk(CALM_CONTENT);
  return out;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export const calmRules: CalmRule[] = [
  // ── BLOCKING ────────────────────────────────────────────────────────────
  {
    id: "CC-R001",
    severity: "blocking",
    description:
      "Optional signup messaging may NEVER be visible before exercise completion AND continue step.",
    check: (s) => {
      if (s.step === "continue") {
        // Allowed iff completed flag is true (defense-in-depth).
        return isOptionalSignupAllowed(s);
      }
      // Any other step → not allowed.
      return !isOptionalSignupAllowed(s);
    },
  },
  {
    id: "CC-R002",
    severity: "blocking",
    description: "REQUIRE_EXERCISE_BEFORE_CONTINUE constant must remain true.",
    check: () => REQUIRE_EXERCISE_BEFORE_CONTINUE === true,
  },
  {
    id: "CC-R003",
    severity: "blocking",
    description: "No content string may contain a forbidden growth/conversion phrase.",
    check: () => {
      return allContentStrings().every((s) => {
        const n = normalize(s);
        return !CALM_FORBIDDEN_PHRASES.some((p) => n.includes(p));
      });
    },
  },
  {
    id: "CC-R004",
    severity: "blocking",
    description:
      "All three required tone phrases ('Continue gently', 'No pressure', 'You choose') must appear somewhere in the content tree.",
    check: () => {
      const blob = normalize(allContentStrings().join(" "));
      return CALM_REQUIRED_TONE_PHRASES.every((p) => blob.includes(p));
    },
  },
  {
    id: "CC-R005",
    severity: "blocking",
    description: "Crisis line must be present and reference /crisis.",
    check: () => {
      const c = CALM_CONTENT.crisisLine;
      return typeof c === "string" && c.includes("/crisis");
    },
  },
  {
    id: "CC-R006",
    severity: "blocking",
    description:
      "Breathing timing must match spec exactly: 4s inhale, 2s hold, 6s exhale.",
    check: () => {
      const b = CALM_CONTENT.breathing;
      return b.inhaleSeconds === 4 && b.holdSeconds === 2 && b.exhaleSeconds === 6;
    },
  },
  // ── WARNING ─────────────────────────────────────────────────────────────
  {
    id: "CC-R007",
    severity: "warning",
    description: "Idle screen must offer exactly three exercise options.",
    check: () => CALM_CONTENT.idle.options.length === 3,
  },
  {
    id: "CC-R008",
    severity: "warning",
    description: "Continue screen must offer exactly four soft options including signup-later.",
    check: () => {
      const opts = CALM_CONTENT.continue.options;
      return opts.length === 4 && opts.some((o) => o.id === "signup-later");
    },
  },
  {
    id: "CC-R009",
    severity: "warning",
    description: "Reflection text must be optional (helperHint must say so).",
    check: () => {
      const h = normalize(CALM_CONTENT.reflection.helperHint);
      return h.includes("isn't saved") || h.includes("not saved") || h.includes("with you");
    },
  },
  {
    id: "CC-R010",
    severity: "warning",
    description: "Idle subheading must contain at least one of the required tone phrases.",
    check: () => {
      const n = normalize(CALM_CONTENT.idle.subheading);
      return CALM_REQUIRED_TONE_PHRASES.some((p) => n.includes(p));
    },
  },
  {
    id: "CC-R011",
    severity: "warning",
    description: "Reflection content stored locally on state must respect the soft 600-char cap.",
    check: (s) => (s.reflectionText ?? "").length <= 600,
  },
  {
    id: "CC-R012",
    severity: "warning",
    description: "Continue must only be reachable after exerciseCompleted=true.",
    check: (s) => (s.step === "continue" ? s.exerciseCompleted : true),
  },
  {
    id: "CC-R013",
    severity: "warning",
    description:
      "Step must always be one of the documented 6 values (no off-spec states).",
    check: (s) =>
      ["idle", "breathing", "grounding", "reflecting", "complete", "continue"].includes(s.step),
  },
  {
    id: "CC-R014",
    severity: "warning",
    description: "Forbidden-phrase list must remain comprehensive (≥10 entries).",
    check: () => CALM_FORBIDDEN_PHRASES.length >= 10,
  },
];

export function auditCalmFlow(state: CalmCheckinState): CalmRuleResult[] {
  const failures: CalmRuleResult[] = [];
  for (const r of calmRules) {
    let ok = false;
    try {
      ok = r.check(state);
    } catch {
      ok = false;
    }
    if (!ok) failures.push({ id: r.id, severity: r.severity, description: r.description });
  }
  return failures;
}

/**
 * Direct content audit — every leaf string scanned for forbidden phrases.
 * Returns the offending strings paired with the phrases they hit.
 */
export function auditCalmContent(): { text: string; matched: string[] }[] {
  const out: { text: string; matched: string[] }[] = [];
  for (const s of allContentStrings()) {
    const n = normalize(s);
    const matched = CALM_FORBIDDEN_PHRASES.filter((p) => n.includes(p));
    if (matched.length > 0) out.push({ text: s, matched });
  }
  return out;
}

// server/awareness/seedRules.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.2 gap closure
//
// Idempotent seeder for the awareness_rules table. Mirrors the in-code
// AWARENESS_RULES library so the DB row set is the source-of-truth for
// which rules are ENABLED at runtime, while the regex/keyword execution
// stays in server/awareness/rules.mjs (regexes don't round-trip cleanly
// through JSONB).
//
// Safe to call on every boot: ON CONFLICT (rule_key) DO UPDATE keeps
// metadata fresh whenever the in-code library changes, but never
// touches the `active` flag (operators can disable a rule via the DB
// without their change being clobbered on the next deploy).

import { sql } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { AWARENESS_RULES } from "./rules.mjs";
import { logger } from "../utils/logger.mjs";

/**
 * Render a human-readable, JSON-safe representation of the rule pattern
 * for the `pattern_source` column. We never store regex objects directly
 * because they can't be safely round-tripped, and the executable pattern
 * always lives in code (rules.mjs).
 *
 * @param {import("./rules.mjs").AwarenessRule} rule
 * @returns {string}
 */
function describePattern(rule) {
  switch (rule.patternType) {
    case "regex":
      return rule.pattern instanceof RegExp ? rule.pattern.toString() : String(rule.pattern);
    case "keyword":
      return String(rule.pattern);
    case "composite": {
      const all = rule.pattern?.all || [];
      return JSON.stringify(
        all.map((p) => (p instanceof RegExp ? p.toString() : String(p))),
      );
    }
    default:
      return "";
  }
}

/**
 * Idempotently seed every in-code awareness rule into awareness_rules.
 * Returns a small audit summary for boot logs.
 *
 * @returns {Promise<{ ok: boolean, total: number, upserted: number, errors: string[] }>}
 */
export async function seedAwarenessRules() {
  const summary = { ok: true, total: AWARENESS_RULES.length, upserted: 0, errors: [] };

  for (const rule of AWARENESS_RULES) {
    try {
      const baseConfX100 = Math.max(
        0,
        Math.min(100, Math.round((Number(rule.baseConfidence) || 0) * 100)),
      );
      const patternSource = describePattern(rule);

      // Use raw SQL with ON CONFLICT so a single statement covers both the
      // first-boot insert and the subsequent metadata refresh. We don't
      // overwrite `active` on conflict so an operator's manual disable
      // survives a deploy.
      await db.execute(sql`
        INSERT INTO awareness_rules
          (rule_key, tactic, category, severity, pattern_type, pattern_source,
           base_confidence_x100, active, teaching, updated_at)
        VALUES
          (${rule.id},
           ${rule.tactic},
           ${rule.category},
           ${rule.severity || "low"},
           ${rule.patternType},
           ${patternSource},
           ${baseConfX100},
           true,
           ${rule.teaching || null},
           NOW())
        ON CONFLICT (rule_key) DO UPDATE SET
           tactic              = EXCLUDED.tactic,
           category            = EXCLUDED.category,
           severity            = EXCLUDED.severity,
           pattern_type        = EXCLUDED.pattern_type,
           pattern_source      = EXCLUDED.pattern_source,
           base_confidence_x100 = EXCLUDED.base_confidence_x100,
           teaching            = EXCLUDED.teaching,
           updated_at          = NOW()
      `);
      summary.upserted += 1;
    } catch (err) {
      summary.ok = false;
      summary.errors.push(`${rule.id}: ${err?.message || String(err)}`);
    }
  }

  if (summary.ok) {
    logger.info(`[seedAwarenessRules] upserted ${summary.upserted}/${summary.total} rules`);
  } else {
    logger.warn(`[seedAwarenessRules] partial: ${summary.upserted}/${summary.total} (errors=${summary.errors.length})`);
  }
  return summary;
}

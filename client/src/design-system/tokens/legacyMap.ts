/**
 * Phase 12 — Wave 1 reconciliation bridge.
 *
 * Maps 40 structural legacy v17 `--glp-*` color tokens (defined in
 * `client/src/index.css` and `client/src/styles/brand-tokens.css`) to the
 * closest Phase 12 semantic or palette token, plus a separate 4-entry
 * typography family map. Other legacy classes (spacing, z-index, font sizes,
 * tracking, weights) are intentionally out of scope for this Wave 1 bridge
 * and will get their own registries when surface migration demands. Enables future migration PRs to swap import paths or CSS
 * variable references without re-touching v5.8.21+ shipped surfaces.
 *
 * USAGE — TypeScript / TSX consumers:
 *   import { legacyMap } from '@/design-system/tokens/legacyMap';
 *   const sage = legacyMap['--glp-sage']; // → '#7BA483' (palette.primarySage)
 *
 * USAGE — analyzers / codemods:
 *   import { legacyMap, isDeprecatedLegacyToken } from '@/design-system/tokens/legacyMap';
 *   if (isDeprecatedLegacyToken(name)) console.warn(`legacy token ${name}`);
 *
 * NON-GOAL: this file does NOT redefine any CSS variables and does NOT modify
 * `index.css` / `brand-tokens.css`. Both legacy stylesheets continue to ship
 * as-is. This is a lookup-only registry consumed by future PRs.
 *
 * Locked 2026-05-13.
 */

import { palette, semantic, aura } from "./colors";

/** Lookup type for any legacy → Phase 12 mapping entry. */
export type LegacyMapEntry = {
  /** Resolved Phase 12 value (hex or rgba). */
  value: string;
  /** Where the value originates in the canonical token tree. */
  source:
    | `palette.${keyof typeof palette}`
    | `semantic.${keyof typeof semantic}`
    | `aura.${keyof typeof aura}`
    | "decorative-only"
    | "unmapped";
  /** Human-readable migration note. */
  note?: string;
};

/**
 * Bridge registry. Keys are the EXACT legacy CSS custom-property names as
 * they appear in `index.css` / `brand-tokens.css` (with the leading `--`).
 *
 * Coverage focus: structural color tokens. Typography / spacing / z-index
 * legacy tokens are tracked separately (see `legacyMapTypography` etc. below).
 */
export const legacyMap: Readonly<Record<string, LegacyMapEntry>> = {
  // === Core palette ============================================================
  "--glp-sage": { value: palette.primarySage, source: "palette.primarySage" },
  "--glp-sage-deep": { value: palette.deepForest, source: "palette.deepForest", note: "deep variant maps to deepForest, not a darker sage" },
  "--glp-ink": { value: palette.deepForest, source: "palette.deepForest" },
  "--glp-cream": { value: palette.warmCream, source: "palette.warmCream" },
  "--glp-paper": { value: palette.warmCream, source: "palette.warmCream" },
  "--glp-gold": { value: palette.eternalGold, source: "palette.eternalGold" },
  "--glp-blush": { value: palette.softBlush, source: "palette.softBlush" },
  "--glp-mist": { value: palette.mist, source: "palette.mist" },
  "--glp-white": { value: semantic.bgCard, source: "semantic.bgCard", note: "Phase 12 forbids pure white in cards — bridge to rgba(255,255,255,0.78)" },

  // === Surface / structural ====================================================
  "--glp-bg": { value: semantic.bgPage, source: "semantic.bgPage" },
  "--glp-surface": { value: semantic.bgCard, source: "semantic.bgCard" },
  "--glp-surface-2": { value: semantic.bgCardElevated, source: "semantic.bgCardElevated" },
  "--glp-border": { value: semantic.borderSubtle, source: "semantic.borderSubtle" },
  "--glp-accent": { value: semantic.accentPrimary, source: "semantic.accentPrimary" },
  "--glp-accent-foreground": { value: palette.deepForest, source: "palette.deepForest" },

  // === Text =====================================================================
  "--glp-text": { value: semantic.fgBody, source: "semantic.fgBody" },
  "--glp-text-primary": { value: semantic.fgHeading, source: "semantic.fgHeading" },
  "--glp-text-secondary": { value: semantic.fgBody, source: "semantic.fgBody" },
  "--glp-text-tertiary": { value: semantic.fgMuted, source: "semantic.fgMuted" },
  "--glp-text-muted": { value: semantic.fgMuted, source: "semantic.fgMuted" },
  "--glp-text-inverse": { value: semantic.fgInverse, source: "semantic.fgInverse" },
  "--glp-text-brand": { value: palette.primarySage, source: "palette.primarySage" },
  "--glp-text-accent": { value: palette.eternalGold, source: "palette.eternalGold" },
  "--glp-text-disabled": { value: semantic.fgMuted, source: "semantic.fgMuted", note: "Phase 12 disabled state uses blur(2px), not color desaturation" },

  // === Status ===================================================================
  "--glp-error": { value: palette.softBlush, source: "palette.softBlush", note: "warm semantic — never red on healing flows" },
  "--glp-warning": { value: palette.eternalGold, source: "palette.eternalGold" },
  "--glp-warning-light": { value: aura.warmth, source: "aura.warmth" },
  "--glp-warning-dark": { value: palette.eternalGold, source: "palette.eternalGold" },

  // === Aurora / decorative (intentionally unmapped) ============================
  "--glp-aurora-1": { value: aura.calm, source: "decorative-only", note: "ambient overlay — keep as legacy CSS var, no Phase 12 replacement needed" },
  "--glp-aurora-2": { value: aura.warmth, source: "decorative-only" },
  "--glp-aurora-3": { value: aura.care, source: "decorative-only" },
  "--glp-aurora-4": { value: aura.ground, source: "decorative-only" },
  "--glp-aurora-conic": { value: "", source: "decorative-only", note: "conic-gradient composition — keep CSS var as-is" },
  "--glp-aurora-glow": { value: "", source: "decorative-only" },
  "--glp-aurora-linear": { value: "", source: "decorative-only" },

  // === Off-palette legacies (no Phase 12 equivalent — flag for warm-up) ========
  "--glp-teal-50": { value: aura.calm, source: "unmapped", note: "teal scale predates Phase 12 — warm to sage in migration" },
  "--glp-teal-500": { value: palette.primarySage, source: "unmapped", note: "teal-500 deprecated — closest fallback is sage; flag in lint" },
  "--glp-teal-900": { value: palette.deepForest, source: "unmapped", note: "teal-900 deprecated — closest fallback is deepForest; flag in lint" },
  "--glp-violet": { value: aura.care, source: "unmapped", note: "empathy violet predates Phase 12 — keep on lavender-accented surfaces only" },
  "--glp-violet-dark": { value: aura.ground, source: "unmapped" },
} as const;

/**
 * Typography family tokens (separate registry to keep call sites narrow).
 * Phase 12 enforces ONE serif (Cormorant Garamond) + ONE sans-serif (DM Sans).
 */
export const legacyMapTypography: Readonly<Record<string, { value: string; note?: string }>> = {
  "--glp-font-display":
    { value: "'Cormorant Garamond', Georgia, serif", note: "Phase 12 heading family" },
  "--glp-font-heading":
    { value: "'Cormorant Garamond', Georgia, serif", note: "Phase 12 heading family" },
  "--glp-font-body":
    { value: "'DM Sans', system-ui, sans-serif", note: "Phase 12 body family — Inter REMOVED from fallback" },
  "--glp-font-mono":
    { value: "ui-monospace, Menlo, monospace", note: "monospace falls outside Phase 12 brand pair — only used in code/admin" },
} as const;

/** Returns true when `name` exists in the legacy registry. */
export function isLegacyToken(name: string): boolean {
  return name in legacyMap || name in legacyMapTypography;
}

/**
 * Returns true for tokens explicitly flagged as deprecated / unmapped — useful
 * for codemods or ESLint rules that warn on continued usage in NEW code.
 */
export function isDeprecatedLegacyToken(name: string): boolean {
  const entry = legacyMap[name];
  if (!entry) return false;
  return entry.source === "unmapped";
}

/** Resolves a legacy token to its Phase 12 value. Returns `undefined` if unknown. */
export function resolveLegacyToken(name: string): string | undefined {
  return legacyMap[name]?.value ?? legacyMapTypography[name]?.value;
}

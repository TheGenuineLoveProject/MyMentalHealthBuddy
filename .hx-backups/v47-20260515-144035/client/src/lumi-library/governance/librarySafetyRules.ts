/**
 * Phase 35 — Library safety contract.
 */

export interface LibrarySafetyRule {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly enforcement: "blocking" | "advisory";
}

export const LIBRARY_SAFETY_RULES: ReadonlyArray<LibrarySafetyRule> = Object.freeze([
  {
    id: "reading-level-grade-6",
    title: "Reading level ≤ Grade 6",
    detail: "All catalog descriptions and downloadable bodies reviewed for Flesch-Kincaid grade level ≤ 6.",
    enforcement: "advisory",
  },
  {
    id: "professional-care-disclaimer",
    title: "\"Not a replacement for professional care\" disclaimer on every download",
    detail: "`downloadItem` appends the disclaimer at the bottom of every payload. Removal requires editing `PROFESSIONAL_CARE_DISCLAIMER`.",
    enforcement: "blocking",
  },
  {
    id: "no-diagnostic-content",
    title: "No diagnostic content",
    detail: "No DSM/ICD criteria, no checklists that produce a diagnosis.",
    enforcement: "blocking",
  },
  {
    id: "no-medical-advice",
    title: "No medical advice",
    detail: "No medication recommendations, no dosing, no clinical thresholds.",
    enforcement: "blocking",
  },
  {
    id: "crisis-link-on-every-page",
    title: "Crisis resources link on every page",
    detail: "Disclaimer on every download includes the 988 pointer; host UI must surface a /crisis link in the footer.",
    enforcement: "blocking",
  },
  {
    id: "harmful-language-review",
    title: "Content reviewed for harmful language before inclusion",
    detail: "Adding to `LIBRARY_CATALOG` requires a content review pass against the harmful-language checklist.",
    enforcement: "advisory",
  },
]);

if (LIBRARY_SAFETY_RULES.length < 6) {
  throw new Error(
    `[lumi-library] LIBRARY_SAFETY_RULES floor breached: expected ≥6, got ${LIBRARY_SAFETY_RULES.length}`,
  );
}

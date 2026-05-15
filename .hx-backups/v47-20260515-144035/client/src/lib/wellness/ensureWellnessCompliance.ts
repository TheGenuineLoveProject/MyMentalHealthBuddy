export const WELLNESS_ROUTE_PATTERNS = [
  /\/wellness/i,
  /\/tools/i,
  /\/breathing/i,
  /\/grounding/i,
  /\/journal/i,
  /\/mood/i,
  /\/sleep/i,
  /\/self-care/i,
  /\/healing/i,
  /\/crisis/i,
  /\/safety/i,
  /\/resources/i,
  /\/hubs\//i,
  /\/paths\//i,
  /\/practices/i,
];

export const WELLNESS_KEYWORDS = [
  "wellness",
  "healing",
  "trauma",
  "self-care",
  "selfcare",
  "mindfulness",
  "nervous system",
  "grounding",
  "breathwork",
  "meditation",
  "anxiety",
  "stress",
  "emotional",
  "mental health",
];

export function isWellnessRoute(path: string): boolean {
  return WELLNESS_ROUTE_PATTERNS.some(pattern => pattern.test(path));
}

export function hasWellnessKeywords(content: string): boolean {
  const lower = content.toLowerCase();
  return WELLNESS_KEYWORDS.some(kw => lower.includes(kw));
}

export function hasSafetyFooter(source: string): boolean {
  return (
    source.includes("SafetyFooter") ||
    source.includes("safety-footer") ||
    source.includes("data-testid=\"wellness-safety-footer\"") ||
    source.includes("CrisisNotice") ||
    source.includes("SafetyDisclaimer")
  );
}

export function hasConsentRibbon(source: string): boolean {
  return (
    source.includes("ConsentRibbon") ||
    source.includes("consent-ribbon") ||
    source.includes("data-testid=\"wellness-consent-ribbon\"") ||
    source.includes("pause or stop") ||
    source.includes("your pace") ||
    source.includes("NotMedicalAdvice")
  );
}

export function hasBenefitsBlock(source: string): boolean {
  return (
    source.includes("BenefitsBlock") ||
    source.includes("benefits-block") ||
    source.includes("data-testid=\"wellness-benefits-block\"") ||
    source.includes("How this helps")
  );
}

export function hasCrisisLink(source: string): boolean {
  return (
    source.includes('href="/crisis"') ||
    source.includes("href='/crisis'") ||
    source.includes('to="/crisis"') ||
    source.includes("/crisis") ||
    source.includes("CrisisNotice") ||
    source.includes("link-crisis")
  );
}

export interface ComplianceResult {
  hasSafetyFooter: boolean;
  hasConsentRibbon: boolean;
  hasBenefitsBlock: boolean;
  hasCrisisLink: boolean;
  isCompliant: boolean;
  missing: string[];
}

export function checkCompliance(source: string): ComplianceResult {
  const result = {
    hasSafetyFooter: hasSafetyFooter(source),
    hasConsentRibbon: hasConsentRibbon(source),
    hasBenefitsBlock: hasBenefitsBlock(source),
    hasCrisisLink: hasCrisisLink(source),
    isCompliant: false,
    missing: [] as string[],
  };

  if (!result.hasSafetyFooter) result.missing.push("SafetyFooter");
  if (!result.hasConsentRibbon) result.missing.push("ConsentRibbon");
  if (!result.hasBenefitsBlock) result.missing.push("BenefitsBlock");
  if (!result.hasCrisisLink) result.missing.push("CrisisLink");

  result.isCompliant = result.missing.length === 0;
  return result;
}

export function suggestInsertionPoints(source: string): {
  safetyFooter: number;
  consentRibbon: number;
  benefitsBlock: number;
} {
  const lines = source.split("\n");
  let returnIdx = -1;
  let lastImportIdx = -1;
  let mainTagIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("import ")) lastImportIdx = i;
    if (line.includes("return (") || line.includes("return(")) returnIdx = i;
    if (line.includes("<main") || line.includes("<section") || line.includes("<div className=")) {
      if (mainTagIdx === -1) mainTagIdx = i;
    }
  }

  return {
    safetyFooter: returnIdx > 0 ? returnIdx + 5 : lines.length - 5,
    consentRibbon: mainTagIdx > 0 ? mainTagIdx + 1 : returnIdx + 2,
    benefitsBlock: mainTagIdx > 0 ? mainTagIdx + 2 : returnIdx + 3,
  };
}

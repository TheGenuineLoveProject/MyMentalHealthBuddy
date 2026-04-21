// shared/brand.ts
// Canonical Brand Source of Truth for: MyMentalHealthBuddy by The Genuine Love Project
// Keep this file small, stable, and referenced everywhere.
// NOTE: BRAND_HEX_ALLOWLIST MUST be *only hex strings* (your scanner expects this).
export const BRAND = {
    name: "MyMentalHealthBuddy",
    byline: "by The Genuine Love Project",
    fullName: "MyMentalHealthBuddy by The Genuine Love Project",
    tagline: "Live in Genuine Love",
    mission: "Helping people heal, grow, and align through everyday self-love and consciousness.",
    seo: {
        title: "MyMentalHealthBuddy by The Genuine Love Project — Live in Genuine Love",
        description: "AI-powered mental wellness platform for self-love, healing, and emotional growth — private, compassionate, available 24/7.",
    },
    colors: {
        // Core Brand (Serenity Sage family + paper + ink + gold accent)
        primary: "#8FBF9F", // Serenity Sage
        sage: "#8FBF9F",
        sageDark: "#5A9A6E",
        paper: "#FAF9F7",
        background: "#FAF9F7",
        ink: "#2D3748",
        text: "#2D3748",
        mist: "#F8FAFC",
        border: "#E5E7EB",
        // Accent
        gold: "#D4AF37",
        accent: "#D4AF37",
        // System (allowed but keep minimal)
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
    },
};
/**
 * Allowlist used by brand scanners / cleanup scripts to avoid false positives.
 * ONLY hex strings here. No objects.
 */
export const BRAND_HEX_ALLOWLIST = [
    BRAND.colors.primary,
    BRAND.colors.sage,
    BRAND.colors.sageDark,
    BRAND.colors.paper,
    BRAND.colors.background,
    BRAND.colors.ink,
    BRAND.colors.text,
    BRAND.colors.mist,
    BRAND.colors.border,
    BRAND.colors.gold,
    BRAND.colors.accent,
    BRAND.colors.success,
    BRAND.colors.warning,
    BRAND.colors.danger,
    BRAND.colors.info,
].map((x) => x.toUpperCase());
export const getBrandHex = (key) => BRAND.colors[key];

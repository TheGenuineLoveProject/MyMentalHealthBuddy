/**
 * =====================================================
 * THE GENUINE LOVE PROJECT - BRAND SYSTEM AS CODE
 * "One-of-a-kind worldwide" identity specification
 * =====================================================
 */

export const Brand = {
  name: "The Genuine Love Project",
  tagline: "Build genuine love. Practice real healing. Live aligned.",
  mission: "Empowering humanity to heal, grow, and thrive through AI-assisted mental wellness.",
  vision: "A world where everyone has access to compassionate, trauma-informed mental wellness support.",
  
  palette: {
    serenitySage: "#7BAE9D",
    sageDeep: "#5A9A7F",
    sageLight: "#A8D5BA",
    eternalGold: "#C9A227",
    midnightInk: "#0B0F14",
    pearl: "#F7F5F2",
    cream: "#FAF8F5",
    warmWhite: "#FEFDFB",
    coral: "#E07B67",
    lavender: "#B4A7D6",
  },
  
  typography: {
    heading: "Playfair Display",
    body: "Inter",
    accent: "Cormorant Garamond",
  },
  
  logo: {
    primary: "/brand/logo.png",
    mark: "/brand/logo-mark.png",
    wordmark: "/brand/logo-wordmark.png",
    favicon: "/brand/favicon.png",
  },
  
  gradients: {
    primary: "linear-gradient(135deg, #7BAE9D 0%, #5A9A7F 100%)",
    warm: "linear-gradient(135deg, #FAF8F5 0%, #F7F5F2 100%)",
    hero: "linear-gradient(180deg, #FEFDFB 0%, #E8F5E9 100%)",
  },
  
  shadows: {
    soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.1)",
    strong: "0 8px 32px rgba(0, 0, 0, 0.15)",
  },
};

export const SOCIAL_PLATFORMS = {
  youtube: { name: "YouTube", url: "", icon: "youtube", enabled: false },
  instagram: { name: "Instagram", url: "", icon: "instagram", enabled: false },
  tiktok: { name: "TikTok", url: "", icon: "tiktok", enabled: false },
  x: { name: "X (Twitter)", url: "", icon: "twitter", enabled: false },
  linkedin: { name: "LinkedIn", url: "", icon: "linkedin", enabled: false },
  facebook: { name: "Facebook", url: "", icon: "facebook", enabled: false },
  threads: { name: "Threads", url: "", icon: "threads", enabled: false },
  pinterest: { name: "Pinterest", url: "", icon: "pinterest", enabled: false },
  medium: { name: "Medium", url: "", icon: "medium", enabled: false },
  substack: { name: "Substack", url: "", icon: "substack", enabled: false },
  github: { name: "GitHub", url: "", icon: "github", enabled: false },
} as const;

export const CONTENT_PILLARS = [
  { id: "healing", name: "Healing & Recovery", description: "Trauma-informed tools for emotional healing" },
  { id: "growth", name: "Personal Growth", description: "Self-improvement and mindset development" },
  { id: "wisdom", name: "Wisdom & Philosophy", description: "Ancient and modern wisdom traditions" },
  { id: "connection", name: "Connection & Relationships", description: "Building meaningful bonds" },
  { id: "purpose", name: "Purpose & Meaning", description: "Finding your path and calling" },
] as const;

export const VOICE_GUIDELINES = {
  tone: ["Warm", "Compassionate", "Empowering", "Non-judgmental", "Hopeful"],
  avoid: ["Clinical jargon", "Medical claims", "Condescending language", "Fear-based messaging"],
  principles: [
    "Always trauma-informed and gentle",
    "Empowerment over dependence",
    "Evidence-based but accessible",
    "Privacy-first and consent-driven",
    "Crisis resources always available",
  ],
} as const;

export type BrandType = typeof Brand;
export type SocialPlatforms = typeof SOCIAL_PLATFORMS;
export type ContentPillars = typeof CONTENT_PILLARS;
export type VoiceGuidelines = typeof VOICE_GUIDELINES;
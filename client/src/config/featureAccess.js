export const PLAN_HIERARCHY = ["free", "starter", "pro", "elite"];

export const FEATURE_ACCESS = {
  aiChat: {
    requiredPlan: "free",
    freeLimit: 5,
    starterLimit: 25,
    proLimit: null,
    eliteLimit: null,
    label: "AI Wellness Chat",
    description: "Talk with your AI wellness companion",
    limitLabel: "daily sessions",
  },

  moodTracking: {
    requiredPlan: "free",
    label: "Mood Tracking",
    description: "Track and understand your emotional state",
  },

  journaling: {
    requiredPlan: "free",
    label: "Journaling",
    description: "Write freely in your private journal",
  },

  dailyReflection: {
    requiredPlan: "free",
    label: "Daily Reflection",
    description: "Gentle daily check-ins for self-awareness",
  },

  wisdom: {
    requiredPlan: "free",
    label: "Daily Wisdom",
    description: "Curated wisdom and daily reflections",
  },

  communityWall: {
    requiredPlan: "free",
    label: "Community Wall",
    description: "Share and receive anonymous affirmations",
  },

  crisisSupport: {
    requiredPlan: "free",
    label: "Crisis Support",
    description: "24/7 crisis resources and safety tools",
  },

  extendedAiChat: {
    requiredPlan: "starter",
    label: "Extended AI Chat",
    description: "25 AI chat sessions per day",
  },

  journalInsights: {
    requiredPlan: "starter",
    label: "Journal Insights",
    description: "AI-powered patterns in your journal entries",
  },

  guidedReflections: {
    requiredPlan: "starter",
    label: "Guided Reflections",
    description: "Structured reflection exercises for deeper self-awareness",
  },

  advancedInsights: {
    requiredPlan: "pro",
    label: "Advanced Insights",
    description: "Deeper analytics on your emotional patterns",
  },

  healingJourneys: {
    requiredPlan: "pro",
    label: "Healing Journeys",
    description: "Guided multi-step healing pathways",
  },

  contentStudio: {
    requiredPlan: "pro",
    label: "Content Studio",
    description: "Transform reflections into shareable content",
  },

  progressAnalytics: {
    requiredPlan: "pro",
    label: "Progress Analytics",
    description: "Track your growth over time with detailed analytics",
  },

  prioritySupport: {
    requiredPlan: "pro",
    label: "Priority Support",
    description: "Faster response times and dedicated support",
  },

  voiceAffirmations: {
    requiredPlan: "elite",
    label: "Voice Affirmations",
    description: "Personalized audio affirmations for daily practice",
  },

  oneOnOneOnboarding: {
    requiredPlan: "elite",
    label: "1-on-1 Onboarding",
    description: "Personalized onboarding session to set up your practice",
  },

  earlyAccess: {
    requiredPlan: "elite",
    label: "Early Access",
    description: "Be the first to try new features and tools",
  },

  eliteCommunity: {
    requiredPlan: "elite",
    label: "Elite Community",
    description: "Access to a private community of like-minded individuals",
  },
};

export function getFeature(key) {
  return FEATURE_ACCESS[key] || null;
}

export function getRequiredPlan(key) {
  return FEATURE_ACCESS[key]?.requiredPlan || "free";
}

export function isProFeature(key) {
  return FEATURE_ACCESS[key]?.requiredPlan === "pro";
}

export function isPaidFeature(key) {
  return FEATURE_ACCESS[key]?.requiredPlan !== "free";
}

export function canAccess(featureKey, userPlan = "free") {
  const feature = FEATURE_ACCESS[featureKey];
  if (!feature) return false;
  const userLevel = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredLevel = PLAN_HIERARCHY.indexOf(feature.requiredPlan);
  return userLevel >= requiredLevel;
}

export function getFreeFeatures() {
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => v.requiredPlan === "free")
    .map(([k, v]) => ({ key: k, ...v }));
}

export function getStarterFeatures() {
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => v.requiredPlan === "starter")
    .map(([k, v]) => ({ key: k, ...v }));
}

export function getProFeatures() {
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => v.requiredPlan === "pro")
    .map(([k, v]) => ({ key: k, ...v }));
}

export function getEliteFeatures() {
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => v.requiredPlan === "elite")
    .map(([k, v]) => ({ key: k, ...v }));
}

export function getFeaturesForPlan(plan) {
  const level = PLAN_HIERARCHY.indexOf(plan);
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => PLAN_HIERARCHY.indexOf(v.requiredPlan) <= level)
    .map(([k, v]) => ({ key: k, ...v }));
}

export const FEATURE_ACCESS = {
  aiChat: {
    requiredPlan: "free",
    freeLimit: 5,
    proLimit: null,
    label: "AI Wellness Chat",
    description: "Talk with your AI wellness companion",
    limitLabel: "daily sessions",
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

export function getFreeFeatures() {
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => v.requiredPlan === "free")
    .map(([k, v]) => ({ key: k, ...v }));
}

export function getProFeatures() {
  return Object.entries(FEATURE_ACCESS)
    .filter(([, v]) => v.requiredPlan === "pro")
    .map(([k, v]) => ({ key: k, ...v }));
}

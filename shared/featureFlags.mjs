export const FEATURE_FLAGS = {
  public: {
    newsletter: { enabled: true, status: "ready", label: "Newsletter", routes: ["/newsletter"] },
    blog: { enabled: true, status: "ready", label: "Blog", routes: ["/blog"] },
    tools: { enabled: true, status: "ready", label: "Wellness Tools", routes: ["/tools"] },
    pricing: { enabled: true, status: "ready", label: "Pricing", routes: ["/pricing"] },
    crisis: { enabled: true, status: "ready", label: "Crisis Support", routes: ["/crisis"] },
    community: { enabled: true, status: "beta", label: "Community", routes: ["/community"] },
    learn: { enabled: true, status: "ready", label: "Learning Hub", routes: ["/learn"] },
    mood: { enabled: true, status: "ready", label: "Mood Tracking", routes: ["/mood"] },
    journal: { enabled: true, status: "ready", label: "Journaling", routes: ["/journal"] },
    aiChat: { enabled: true, status: "ready", label: "AI Chat", routes: ["/chat", "/ai-chat"] },
    dashboard: { enabled: true, status: "ready", label: "Dashboard", routes: ["/dashboard"] },
    healingJourneys: { enabled: false, status: "wip", label: "Healing Journeys", routes: ["/healing-journeys"] },
    contentStudio: { enabled: false, status: "wip", label: "Content Studio", routes: ["/content-studio"] },
    studyVault: { enabled: false, status: "wip", label: "Study Vault", routes: ["/study-vault"] },
    atlas: { enabled: false, status: "wip", label: "Intellectual Atlas", routes: ["/atlas"] },
    strategyMaps: { enabled: false, status: "wip", label: "Strategy Maps", routes: ["/strategy-maps"] },
    collaborativeLab: { enabled: false, status: "wip", label: "Collaborative Lab", routes: ["/collaborative-lab"] },
    // Presence page (v5.8.59) — wires the four opt-in companion modules onto
    // a single /presence route. status:"wip" so non-admins don't see it until
    // a deploy intentionally flips status:"ready". Each per-section flag is
    // independently toggleable (no batch-enable) and defaults wip.
    presencePage: { enabled: false, status: "wip", label: "Presence Page", routes: ["/presence"] },
    presenceCircadian: { enabled: false, status: "wip", label: "Presence — Gentle Reminders" },
    presenceMemory: { enabled: false, status: "wip", label: "Presence — Soft Memory" },
    presenceRituals: { enabled: false, status: "wip", label: "Presence — Rituals" },
    presenceScenes: { enabled: false, status: "wip", label: "Presence — Ambient Scenes" },
    landingCalmCheckin: { enabled: false, status: "wip", label: "Landing — Calm Check-in Entry" },
  },
  admin: {
    socialPublishing: { enabled: true, status: "ready", label: "Social Publishing" },
    billingDashboard: { enabled: true, status: "ready", label: "Billing Dashboard" },
    featureFlags: { enabled: true, status: "ready", label: "Feature Flags" },
    healthDashboard: { enabled: true, status: "ready", label: "Health Dashboard" },
    publishingToday: { enabled: true, status: "ready", label: "Publishing Today" },
    narrativeDrafts: { enabled: true, status: "ready", label: "Narrative Drafts" },
    analytics: { enabled: true, status: "ready", label: "Analytics Dashboard" },
  },
};

export function isEnabled(flagName, userContext = {}) {
  const isAdmin = userContext.isAdmin || false;

  for (const [, group] of Object.entries(FEATURE_FLAGS)) {
    if (group[flagName]) {
      const flag = group[flagName];
      if (flag.status === "disabled") return false;
      if (flag.status === "wip") return isAdmin;
      return flag.enabled;
    }
  }

  return true;
}

export function getFlagStatus(flagName) {
  for (const [section, group] of Object.entries(FEATURE_FLAGS)) {
    if (group[flagName]) {
      return { ...group[flagName], section };
    }
  }
  return null;
}

export function getPublicFlags() {
  return FEATURE_FLAGS.public;
}

export function getAdminFlags() {
  return FEATURE_FLAGS.admin;
}

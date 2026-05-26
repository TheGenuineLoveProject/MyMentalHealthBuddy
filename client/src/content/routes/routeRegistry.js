export const NAV_GROUPS = {
  TRUST: "trust",
  HEALING: "healing",
  WELLNESS: "wellness",
  AWARENESS: "awareness",
  TOOLS: "tools",
  ACCOUNT: "account",
  GROWTH: "growth",
};

const SITE_ORIGIN = "https://mymentalhealthbuddy.com";

function canonical(path) {
  return `${SITE_ORIGIN}${path}`;
}

export const routeRegistry = {
  "/trust": {
    path: "/trust",
    title: "Trust Center | MyMentalHealthBuddy",
    description:
      "Our commitments to your privacy, safety, AI boundaries, and emotional wellbeing.",
    seoDescription:
      "MyMentalHealthBuddy Trust Center — transparency, privacy, safety, AI boundaries, human oversight, and crisis support commitments.",
    canonical: canonical("/trust"),
    category: "informational",
    navGroup: NAV_GROUPS.TRUST,
    indexable: true,
    emotionalIntent: "safety + reassurance",
    userGoal: "Verify the platform is safe, ethical, and trustworthy.",
    platformRole: "Public-facing trust contract.",
  },
  "/ai-transparency": {
    path: "/ai-transparency",
    title: "AI Transparency | MyMentalHealthBuddy",
    description:
      "How AI is used in MyMentalHealthBuddy — supervised, bounded, and never a replacement for human care.",
    seoDescription:
      "How MyMentalHealthBuddy uses AI responsibly — human supervision, limitations, non-clinical disclaimers, safety systems, ethical design, and user autonomy.",
    canonical: canonical("/ai-transparency"),
    category: "informational",
    navGroup: NAV_GROUPS.TRUST,
    indexable: true,
    emotionalIntent: "clarity + honesty",
    userGoal: "Understand exactly how AI is and isn't used.",
    platformRole: "Public-facing AI ethics disclosure.",
  },
  "/healing": {
    path: "/healing",
    title: "Healing | MyMentalHealthBuddy",
    description:
      "Gentle, trauma-informed healing practices for emotional recovery and growth.",
    seoDescription:
      "Trauma-informed healing tools — gentle reflection prompts, recovery practices, and compassionate guidance.",
    canonical: canonical("/healing"),
    category: "wellness",
    navGroup: NAV_GROUPS.HEALING,
    indexable: true,
    emotionalIntent: "gentle restoration",
    userGoal: "Find supportive practices for emotional recovery.",
    platformRole: "Primary healing surface.",
  },
  "/about": {
    path: "/about",
    title: "About | MyMentalHealthBuddy",
    description:
      "The mission of The Genuine Love Project — fostering self-love, healing, and emotional growth.",
    seoDescription:
      "MyMentalHealthBuddy by The Genuine Love Project — mission, values, and approach to accessible mental wellness.",
    canonical: canonical("/about"),
    category: "informational",
    navGroup: NAV_GROUPS.TRUST,
    indexable: true,
    emotionalIntent: "connection + context",
    userGoal: "Understand who is behind the platform.",
    platformRole: "Identity and mission surface.",
  },
  "/features": {
    path: "/features",
    title: "Features | MyMentalHealthBuddy",
    description:
      "Mood tracking, journaling, AI companion, hubs, and crisis routing — designed for emotional wellbeing.",
    seoDescription:
      "Explore MyMentalHealthBuddy features — mood tracking, journaling, AI companion, healing hubs, and 24/7 crisis support.",
    canonical: canonical("/features"),
    category: "informational",
    navGroup: NAV_GROUPS.AWARENESS,
    indexable: true,
    emotionalIntent: "discovery + agency",
    userGoal: "Learn what the platform offers.",
    platformRole: "Public capabilities overview.",
  },
  "/wellbeing": {
    path: "/wellbeing",
    title: "Wellbeing | MyMentalHealthBuddy",
    description:
      "Holistic emotional, mental, and relational wellbeing — supportive, never clinical.",
    seoDescription:
      "Holistic wellbeing resources — emotional regulation, relational health, and self-care practices.",
    canonical: canonical("/wellbeing"),
    category: "wellness",
    navGroup: NAV_GROUPS.WELLNESS,
    indexable: true,
    emotionalIntent: "balance + integration",
    userGoal: "Find resources for whole-person wellbeing.",
    platformRole: "Wellbeing umbrella surface (redirects to /healing).",
  },
  "/mental-wellness": {
    path: "/mental-wellness",
    title: "Mental Wellness | MyMentalHealthBuddy",
    description:
      "Mental wellness practices — reflection, regulation, and gentle growth.",
    seoDescription:
      "Mental wellness tools — reflection prompts, emotional regulation, and compassionate self-inquiry.",
    canonical: canonical("/mental-wellness"),
    category: "wellness",
    navGroup: NAV_GROUPS.WELLNESS,
    indexable: true,
    emotionalIntent: "calm + clarity",
    userGoal: "Build sustainable mental wellness habits.",
    platformRole: "Wellness alias surface (redirects to /healing).",
  },
  "/self-love": {
    path: "/self-love",
    title: "Self-Love | MyMentalHealthBuddy",
    description:
      "Cultivate compassion, acceptance, and care for yourself — the foundation of healing.",
    seoDescription:
      "Self-love practices — compassion, acceptance, and gentle self-care rooted in trauma-informed care.",
    canonical: canonical("/self-love"),
    category: "wellness",
    navGroup: NAV_GROUPS.HEALING,
    indexable: true,
    emotionalIntent: "compassion + acceptance",
    userGoal: "Practice kindness toward oneself.",
    platformRole: "Self-love practice surface.",
  },
  "/mindfulness": {
    path: "/mindfulness",
    title: "Mindfulness | MyMentalHealthBuddy",
    description:
      "Gentle mindfulness and meditation practices — present-moment awareness for emotional calm.",
    seoDescription:
      "Accessible mindfulness practices — grounding, present-moment awareness, and gentle meditation for emotional regulation.",
    canonical: canonical("/mindfulness"),
    category: "wellness",
    navGroup: NAV_GROUPS.WELLNESS,
    indexable: true,
    emotionalIntent: "presence + calm",
    userGoal: "Practice present-moment awareness for emotional regulation.",
    platformRole: "Mindfulness surface (body delegates to /meditation).",
  },
  "/growth": {
    path: "/growth",
    title: "Growth | MyMentalHealthBuddy",
    description:
      "Gentle growth practices — patience, perspective, and intentional reflection.",
    seoDescription:
      "Personal growth tools — patience-led reflection, perspective work, and intentional habit formation.",
    canonical: canonical("/growth"),
    category: "wellness",
    navGroup: NAV_GROUPS.GROWTH,
    indexable: true,
    emotionalIntent: "patience + becoming",
    userGoal: "Grow gently and sustainably.",
    platformRole: "Growth surface.",
  },
  "/journal": {
    path: "/journal",
    title: "Journal | MyMentalHealthBuddy",
    description:
      "Private, secure journaling for reflection, processing, and growth.",
    seoDescription:
      "Private journaling space — secure, AI-assisted reflection prompts to help you process emotions safely.",
    canonical: canonical("/journal"),
    category: "tool",
    navGroup: NAV_GROUPS.TOOLS,
    indexable: false,
    emotionalIntent: "expression + release",
    userGoal: "Reflect privately and safely.",
    platformRole: "Authenticated journaling tool.",
  },
  "/mood": {
    path: "/mood",
    title: "Mood Tracking | MyMentalHealthBuddy",
    description:
      "Track your moods gently over time to spot patterns and care for yourself.",
    seoDescription:
      "Gentle mood tracking — observe emotional patterns over time with compassion and zero judgment.",
    canonical: canonical("/mood"),
    category: "tool",
    navGroup: NAV_GROUPS.TOOLS,
    indexable: false,
    emotionalIntent: "awareness + non-judgment",
    userGoal: "Notice emotional patterns over time.",
    platformRole: "Authenticated mood tool.",
  },
  "/dashboard": {
    path: "/dashboard",
    title: "Dashboard | MyMentalHealthBuddy",
    description:
      "Your personal wellness overview — moods, journals, and gentle progress.",
    seoDescription:
      "Your wellness dashboard — moods, journals, reflections, and gentle progress at a glance.",
    canonical: canonical("/dashboard"),
    category: "account",
    navGroup: NAV_GROUPS.ACCOUNT,
    indexable: false,
    emotionalIntent: "orientation + agency",
    userGoal: "See personal wellness state at a glance.",
    platformRole: "Authenticated user home.",
  },
};

export function getRouteMeta(path) {
  return routeRegistry[path] || null;
}

export const routeRegistryList = Object.values(routeRegistry);

export default routeRegistry;

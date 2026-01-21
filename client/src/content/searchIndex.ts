export type SearchType = "Tool" | "Guide" | "Term" | "Q&A" | "News" | "Resource" | "Library" | "Definition"
  | "Support" | "Evidence" | "Update" | "Platform";

export interface SearchItem {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  path: string;
  type: SearchType;
  /** If true, only show when user is authenticated (RouteGuard routes). */
  protected?: boolean;
}

/**
 * IMPORTANT:
 * - Keep paths route-perfect to client/src/App.jsx.
 * - Avoid non-existent routes here (prevents broken-link drift when you render results).
 * - Keep language supportive/educational (no medical claims).
 */
export const searchIndex: SearchItem[] = [
  // Core hubs (public)
  {
    title: "Healing Library",
    description: "Your main index: browse guides, tools, definitions, support, and learning paths.",
    tags: ["library", "index", "start here", "browse"],
    path: "/healing-library",
    type: "Resource",
  },
  {
    title: "News & Updates",
    description: "Platform updates, new features, and fresh additions to the library.",
    tags: ["news", "updates", "announcements"],
    path: "/news",
    type: "News",
  },
  {
    title: "FAQ",
    description: "Frequently asked questions about the platform and how to use it.",
    tags: ["faq", "questions", "help"],
    path: "/faq",
    type: "Q&A",
  },
  {
    title: "Glossary",
    description: "A curated list of key terms and definitions used across the platform.",
    tags: ["glossary", "definitions", "terms", "vocabulary"],
    path: "/glossary",
    type: "Term",
  },
  {
    title: "Full Glossary (A–Z)",
    description: "Complete A–Z glossary of terms for deeper exploration and clarity.",
    tags: ["glossary", "a-z", "dictionary", "terms"],
    path: "/glossary-full",
    type: "Term",
  },
  {
    title: "Research Hub",
    description: "Evidence-informed learning: summaries, concepts, and educational context.",
    tags: ["research", "evidence", "learning"],
    path: "/research",
    type: "Resource",
  },
  {
    title: "Support",
    description: "Support options, guidance, and ways to get help when you need it.",
    tags: ["support", "help", "resources"],
    path: "/support",
    type: "Resource",
  },
  {
    title: "Professional Resources",
    description: "Find professional and community resources. Choose support that fits your needs.",
    tags: ["resources", "professional", "referrals", "support"],
    path: "/resources",
    type: "Resource",
  },

  // Calm & Reset (public tools)
  {
    title: "Breathing Exercises",
    description: "Guided breathing practices to help you steady and reset your attention.",
    tags: ["breathing", "calm", "regulate", "reset"],
    path: "/breathing",
    type: "Tool",
  },
  {
    title: "Grounding Techniques",
    description: "Practical grounding skills to help you feel more present and anchored.",
    tags: ["grounding", "present", "5-4-3-2-1", "reset"],
    path: "/grounding",
    type: "Tool",
  },
  {
    title: "Calming Scenes",
    description: "Peaceful visuals designed for quiet focus and decompression.",
    tags: ["calm", "scenes", "visual", "nature"],
    path: "/calming-scenes",
    type: "Tool",
  },
  {
    title: "Affirmations",
    description: "Supportive affirmations you can return to when you need steadiness and encouragement.",
    tags: ["affirmations", "encouragement", "mindset"],
    path: "/affirmations",
    type: "Tool",
  },
  {
    title: "Meditation",
    description: "Simple guided meditation practices for clarity, presence, and ease.",
    tags: ["meditation", "mindfulness", "practice"],
    path: "/meditation",
    type: "Tool",
  },
  {
    title: "Self-Care",
    description: "Gentle self-care ideas and routines you can adapt to your life.",
    tags: ["self-care", "routine", "wellbeing"],
    path: "/self-care",
    type: "Tool",
  },
  {
    title: "Sleep Guide",
    description: "Practical, evidence-informed habits for better rest and a calmer bedtime routine.",
    tags: ["sleep", "rest", "bedtime", "habits"],
    path: "/sleep-guide",
    type: "Guide",
  },
  {
    title: "Stress Response Guide",
    description: "Learn how stress shows up and explore healthy ways to respond.",
    tags: ["stress", "nervous system", "coping", "regulation"],
    path: "/stress-response",
    type: "Guide",
  },

  // Guides & learning (public)
  {
    title: "How-To Guides",
    description: "Step-by-step instructions for using tools and applying concepts.",
    tags: ["how-to", "instructions", "tutorials", "steps"],
    path: "/how-to-guides",
    type: "Guide",
  },
  {
    title: "Daily Routines",
    description: "Structured routines to help you build consistency without overwhelm.",
    tags: ["routines", "habits", "daily", "structure"],
    path: "/daily-routines",
    type: "Guide",
  },
  {
    title: "Cognitive Tools",
    description: "Thinking tools and skills for reframing, perspective, and problem-solving.",
    tags: ["cognitive", "reframe", "thinking", "skills"],
    path: "/cognitive-tools",
    type: "Tool",
  },
  {
    title: "Emotional Intelligence",
    description: "Learn skills for recognizing emotions, naming needs, and responding thoughtfully.",
    tags: ["emotions", "awareness", "communication", "skills"],
    path: "/emotional-intelligence",
    type: "Guide",
  },
  {
    title: "Wellness Hub",
    description: "A central place to explore your wellness library and recommended next steps.",
    tags: ["wellness", "hub", "overview"],
    path: "/wellness-hub",
    type: "Resource",
  },
  {
    title: "Healing Journeys",
    description: "Explore themed pathways—step-by-step directions for common growth goals.",
    tags: ["journeys", "pathways", "growth"],
    path: "/healing-journeys",
    type: "Guide",
  },
  {
    title: "Behavior Change",
    description: "Build habits using small steps, feedback loops, and consistency—without harshness.",
    tags: ["behavior", "habits", "change", "goals"],
    path: "/behavior-change",
    type: "Guide",
  },

  // Self-understanding (public)
  {
    title: "Inner Child",
    description: "Gentle reflection practices to explore younger parts of your story.",
    tags: ["inner child", "reflection", "self-understanding"],
    path: "/inner-child",
    type: "Guide",
  },
  {
    title: "Body Wellness",
    description: "Body-focused wellbeing content and practices for everyday support.",
    tags: ["body", "wellness", "care"],
    path: "/body-wellness",
    type: "Resource",
  },
  {
    title: "Soul Wellness",
    description: "Meaning, values, and reflective practices for deeper alignment.",
    tags: ["meaning", "values", "reflection"],
    path: "/soul-wellness",
    type: "Resource",
  },

  // Crisis (protected in your App.jsx)
  {
    title: "Crisis Resources",
    description: "Immediate resources and helplines if you need urgent support.",
    tags: ["crisis", "urgent", "help", "support"],
    path: "/crisis",
    type: "Resource",
    protected: true,
  },

  // Platform / protected core
  {
    title: "Today",
    description: "Your daily flow: a focused path for what to do next.",
    tags: ["today", "daily", "flow"],
    path: "/today",
    type: "Tool",
    protected: true,
  },
  {
    title: "Journal",
    description: "Private journaling space for reflection and tracking.",
    tags: ["journal", "writing", "reflection"],
    path: "/journal",
    type: "Tool",
    protected: true,
  },
  {
    title: "Community",
    description: "Shared reflections and community spaces.",
    tags: ["community", "connection", "sharing"],
    path: "/community",
    type: "Resource",
    protected: true,
  },
  {
    title: "Tools",
    description: "Browse platform tools and exercises.",
    tags: ["tools", "exercises", "practice"],
    path: "/tools",
    type: "Resource",
    protected: true,
  },
  {
    title: "Settings",
    description: "Manage your preferences, including display modes.",
    tags: ["settings", "preferences", "mode"],
    path: "/settings",
    type: "Resource",
    protected: true,
  },
  {
    title: "Dashboard",
    description: "Your overview: quick access to key areas and progress.",
    tags: ["dashboard", "overview"],
    path: "/dashboard",
    type: "Resource",
    protected: true,
  },
  {
    title: "Premium",
    description: "Premium features and upgrades.",
    tags: ["premium", "upgrade"],
    path: "/premium",
    type: "Resource",
    protected: true,
  },
  {
    title: "Upgrade",
    description: "Upgrade options and next steps.",
    tags: ["upgrade", "plans"],
    path: "/upgrade",
    type: "Resource",
    protected: true,
  },

  // Public business pages (SEO-friendly)
  {
    title: "Pricing",
    description: "Plans and what’s included.",
    tags: ["pricing", "plans", "subscription"],
    path: "/pricing",
    type: "Resource",
  },
  {
    title: "Blog",
    description: "Articles and updates from the platform.",
    tags: ["blog", "articles", "writing"],
    path: "/blog",
    type: "News",
  },
];

// SEARCH_INDEX uses the SearchItem interface defined above

export const SEARCH_INDEX: SearchItem[] = [
  // ---- Library hub ----
  {
    id: "library-healing",
    title: "Healing Library",
    description: "The main index — start here to find tools, guides, definitions, and support.",
    path: "/healing-library",
    type: "Library",
    tags: ["index", "start here", "library", "browse"],
  },
  {
    id: "library-wellness-hub",
    title: "Wellness Hub",
    description: "A curated hub of supportive content and practices.",
    path: "/wellness-hub",
    type: "Library",
    tags: ["hub", "wellness", "browse"],
  },

  // ---- Tools: calm & reset ----
  {
    id: "tool-breathing",
    title: "Breathing",
    description: "Follow calming breath patterns you can use anytime.",
    path: "/breathing",
    type: "Tool",
    tags: ["calm", "breath", "reset", "stress"],
  },
  {
    id: "tool-grounding",
    title: "Grounding",
    description: "Simple sensory practices to reconnect with the present moment.",
    path: "/grounding",
    type: "Tool",
    tags: ["present", "calm", "anxiety", "senses"],
  },
  {
    id: "tool-calming-scenes",
    title: "Calming Scenes",
    description: "Soothing visuals designed for a gentle pause.",
    path: "/calming-scenes",
    type: "Tool",
    tags: ["calm", "visual", "rest", "low-stim"],
  },
  {
    id: "tool-affirmations",
    title: "Affirmations",
    description: "Supportive statements to reinforce your intention and self-talk.",
    path: "/affirmations",
    type: "Tool",
    tags: ["mindset", "self-talk", "confidence"],
  },
  {
    id: "tool-meditation",
    title: "Meditation Guide",
    description: "A simple meditation flow for focus and ease.",
    path: "/meditation",
    type: "Tool",
    tags: ["focus", "calm", "practice"],
  },
  {
    id: "tool-self-care",
    title: "Self-Care Toolkit",
    description: "Practical self-care ideas organized by needs and energy level.",
    path: "/self-care",
    type: "Tool",
    tags: ["habits", "rest", "care", "routine"],
  },
  {
    id: "tool-sleep-guide",
    title: "Sleep Guide",
    description: "Supportive steps to wind down and protect your sleep routine.",
    path: "/sleep-guide",
    type: "Tool",
    tags: ["sleep", "night", "rest", "routine"],
  },
  {
    id: "tool-stress-response",
    title: "Stress Response Guide",
    description: "Understand your stress response and choose a grounded next step.",
    path: "/stress-response",
    type: "Tool",
    tags: ["stress", "nervous system", "coping", "reset"],
  },

  // ---- Guides / skills ----
  {
    id: "guide-how-to",
    title: "How-To Guides",
    description: "Step-by-step instructions for applying tools in real life.",
    path: "/how-to-guides",
    type: "Guide",
    tags: ["steps", "examples", "practice", "learning"],
  },
  {
    id: "guide-daily-routines",
    title: "Daily Routines",
    description: "Simple routines that build stability and momentum.",
    path: "/daily-routines",
    type: "Guide",
    tags: ["routine", "habits", "consistency"],
  },
  {
    id: "guide-cognitive-tools",
    title: "Cognitive Tools",
    description: "Thinking tools to reduce overwhelm and increase clarity.",
    path: "/cognitive-tools",
    type: "Guide",
    tags: ["thinking", "clarity", "reframe", "skills"],
  },
  {
    id: "guide-emotional-intelligence",
    title: "Emotional Intelligence",
    description: "Recognize emotions, understand needs, and respond with care.",
    path: "/emotional-intelligence",
    type: "Guide",
    tags: ["emotions", "awareness", "skills"],
  },
  {
    id: "guide-healing-journeys",
    title: "Healing Journeys",
    description: "A guided pathway through themes and growth areas.",
    path: "/healing-journeys",
    type: "Guide",
    tags: ["journey", "path", "growth"],
  },
  {
    id: "guide-behavior-change",
    title: "Behavior Change",
    description: "Practical frameworks for changing habits over time.",
    path: "/behavior-change",
    type: "Guide",
    tags: ["habits", "change", "behavior", "consistency"],
  },

  // ---- Self-understanding ----
  {
    id: "guide-inner-child",
    title: "Inner Child",
    description: "Gentle reflection prompts for needs, safety, and self-compassion.",
    path: "/inner-child",
    type: "Guide",
    tags: ["reflection", "compassion", "needs"],
  },
  {
    id: "guide-body-wellness",
    title: "Body Wellness",
    description: "Supportive habits for energy, recovery, and sustainable strength.",
    path: "/body-wellness",
    type: "Guide",
    tags: ["body", "energy", "habits"],
  },
  {
    id: "guide-soul-wellness",
    title: "Soul Wellness",
    description: "Meaning, values, and grounded purpose — explored gently.",
    path: "/soul-wellness",
    type: "Guide",
    tags: ["values", "meaning", "purpose"],
  },

  // ---- Definitions ----
  {
    id: "def-glossary",
    title: "Glossary",
    description: "Curated definitions with plain-language explanations and examples.",
    path: "/glossary",
    type: "Definition",
    tags: ["terms", "definitions", "learn"],
  },
  {
    id: "def-glossary-full",
    title: "Glossary (Full A–Z)",
    description: "Complete A–Z definitions list for deep lookup.",
    path: "/glossary-full",
    type: "Definition",
    tags: ["A-Z", "terms", "definitions"],
  },

  // ---- Support ----
  {
    id: "support",
    title: "Support",
    description: "Help options, guidance, and next steps for getting support.",
    path: "/support",
    type: "Support",
    tags: ["help", "support", "resources"],
  },
  {
    id: "support-crisis",
    title: "Crisis Resources",
    description: "If you feel unsafe or in immediate danger, start here.",
    path: "/crisis",
    type: "Support",
    tags: ["urgent", "safety", "help now"],
    protected: true, // your App.jsx shows /crisis guarded
  },
  {
    id: "support-resources",
    title: "Professional Resources",
    description: "Find reputable professional support and referral pathways.",
    path: "/resources",
    type: "Support",
    tags: ["referrals", "professional", "directory"],
  },

  // ---- Evidence ----
  {
    id: "evidence-research",
    title: "Research & Evidence",
    description: "Educational, evidence-informed summaries and context.",
    path: "/research",
    type: "Evidence",
    tags: ["evidence", "research", "learn"],
  },

  // ---- Updates ----
  {
    id: "updates-news",
    title: "News / Updates",
    description: "Platform updates, improvements, and announcements.",
    path: "/news",
    type: "Update",
    tags: ["news", "updates", "release notes"],
  },
  {
    id: "updates-blog",
    title: "Blog",
    description: "Articles and insights — browse posts by topic.",
    path: "/blog",
    type: "Update",
    tags: ["blog", "articles", "read"],
  },

  // ---- Platform (guarded) ----
  {
    id: "platform-today",
    title: "Today",
    description: "Your daily flow — start here for a guided experience.",
    path: "/today",
    type: "Platform",
    tags: ["daily", "flow", "start"],
    protected: true,
  },
  {
    id: "platform-dashboard",
    title: "Dashboard",
    description: "Your overview — progress, tools, and next steps.",
    path: "/dashboard",
    type: "Platform",
    tags: ["overview", "progress", "account"],
    protected: true,
  },
  {
    id: "platform-journal",
    title: "Journal",
    description: "Reflect and track insights over time.",
    path: "/journal",
    type: "Platform",
    tags: ["journal", "reflection", "write"],
    protected: true,
  },
  {
    id: "platform-tools",
    title: "Tools",
    description: "Your toolkit — guided practices and structured tools.",
    path: "/tools",
    type: "Platform",
    tags: ["tools", "practice", "workflows"],
    protected: true,
  },
  {
    id: "platform-community",
    title: "Community",
    description: "Shared reflections and connection (sign-in required).",
    path: "/community",
    type: "Platform",
    tags: ["community", "shared", "connection"],
    protected: true,
  },
  {
    id: "platform-settings",
    title: "Settings",
    description: "Adjust your preferences, including display modes.",
    path: "/settings",
    type: "Platform",
    tags: ["settings", "preferences", "mode"],
    protected: true,
  },
  {
    id: "platform-premium",
    title: "Premium",
    description: "Premium features and membership benefits.",
    path: "/premium",
    type: "Platform",
    tags: ["premium", "membership", "features"],
    protected: true,
  },
  {
    id: "platform-upgrade",
    title: "Upgrade",
    description: "Upgrade your plan and unlock premium features.",
    path: "/upgrade",
    type: "Platform",
    tags: ["upgrade", "pricing", "premium"],
    protected: true,
  },

  // ---- Extra: high-value protected tools/pages you have ----
  { id: "platform-mood", title: "Mood", description: "Track and reflect on mood patterns.", path: "/mood", type: "Platform", tags: ["mood", "tracking"], protected: true },
  { id: "platform-state", title: "State", description: "Explore your current state and patterns.", path: "/state", type: "Platform", tags: ["state", "patterns"], protected: true },
  { id: "platform-chat", title: "AI Chat", description: "Guided conversation and support tools.", path: "/chat", type: "Platform", tags: ["chat", "ai"], protected: true },
  { id: "platform-analytics", title: "Analytics", description: "Insights and growth tracking.", path: "/analytics", type: "Platform", tags: ["analytics", "progress"], protected: true },

  // ---- Big “map” pages (guarded) ----
  { id: "platform-ritual", title: "Daily Ritual", description: "A guided daily ritual experience.", path: "/ritual", type: "Platform", tags: ["ritual", "daily"], protected: true },
  { id: "platform-wisdom", title: "Wisdom Tools", description: "Wisdom-centered tools and prompts.", path: "/wisdom", type: "Platform", tags: ["wisdom", "tools"], protected: true },
  { id: "platform-advanced", title: "Advanced Tools", description: "Advanced-level tools and frameworks.", path: "/advanced", type: "Platform", tags: ["advanced", "tools"], protected: true },
  { id: "platform-mastery", title: "Mastery Tools", description: "Deep practice modules for mastery.", path: "/mastery", type: "Platform", tags: ["mastery", "practice"], protected: true },
  { id: "platform-atlas", title: "Atlas", description: "Your map of tools, insights, and journeys.", path: "/atlas", type: "Platform", tags: ["atlas", "map"], protected: true },
  { id: "platform-strategy", title: "Strategy Maps", description: "Strategy maps for goals and growth.", path: "/strategy-maps", type: "Platform", tags: ["strategy", "maps"], protected: true },
  { id: "platform-lab", title: "Collaborative Lab", description: "Collaborative tools and shared work.", path: "/collaborative-lab", type: "Platform", tags: ["collaboration", "lab"], protected: true },
  { id: "platform-resilience", title: "Resilience Metrics", description: "Track resilience-related habits and signals.", path: "/resilience", type: "Platform", tags: ["resilience", "metrics"], protected: true },

  // ---- Knowledge / learning cluster (guarded) ----
  { id: "platform-companion", title: "Adaptive Companion", description: "A guided companion experience.", path: "/companion", type: "Platform", tags: ["companion", "guided"], protected: true },
  { id: "platform-knowledge-synth", title: "Knowledge Synthesis", description: "Synthesize ideas into clear frameworks.", path: "/knowledge-synthesis", type: "Platform", tags: ["knowledge", "synthesis"], protected: true },
  { id: "platform-wisdom-practices", title: "Wisdom Practices", description: "Practice sets rooted in wisdom frameworks.", path: "/wisdom-practices", type: "Platform", tags: ["wisdom", "practice"], protected: true },
  { id: "platform-growth-analytics", title: "Growth Analytics", description: "Measure and reflect on growth signals.", path: "/growth-analytics", type: "Platform", tags: ["growth", "analytics"], protected: true },
  { id: "platform-guided-journaling", title: "Guided Journaling", description: "Guided journaling prompts and templates.", path: "/guided-journaling", type: "Platform", tags: ["journal", "prompts"], protected: true },
  { id: "platform-insight-cards", title: "Insight Cards", description: "Card-based insights and reflection prompts.", path: "/insight-cards", type: "Platform", tags: ["cards", "insights"], protected: true },
  { id: "platform-progress", title: "Progress", description: "Track progress over time and review wins.", path: "/progress", type: "Platform", tags: ["progress", "tracking"], protected: true },
  { id: "platform-wisdom-synthesis", title: "Wisdom Synthesis", description: "Synthesize wisdom into actionable steps.", path: "/wisdom-synthesis", type: "Platform", tags: ["wisdom", "synthesis"], protected: true },
  { id: "platform-cog-arch", title: "Cognitive Architecture", description: "Frameworks for thinking and mental models.", path: "/cognitive-architecture", type: "Platform", tags: ["cognition", "models"], protected: true },
  { id: "platform-philo", title: "Philosophical Inquiry", description: "Inquiry prompts for meaning and clarity.", path: "/philosophical-inquiry", type: "Platform", tags: ["inquiry", "meaning"], protected: true },
  { id: "platform-systems", title: "Systems Thinking", description: "See patterns and systems with clarity.", path: "/systems-thinking", type: "Platform", tags: ["systems", "patterns"], protected: true },
  { id: "platform-meta", title: "Meta Learning", description: "Learn how to learn — refine your approach.", path: "/meta-learning", type: "Platform", tags: ["learning", "meta"], protected: true },

  // ---- Content/admin cluster (guarded) ----
  { id: "platform-content-studio", title: "Content Studio", description: "Create and manage content modules.", path: "/content-studio", type: "Platform", tags: ["content", "studio"], protected: true },
  { id: "platform-study-vault", title: "Study Vault", description: "Save and revisit key learnings.", path: "/study-vault", type: "Platform", tags: ["study", "vault"], protected: true },
  { id: "platform-elite-tools", title: "Elite Tools", description: "Advanced toolset for deep work.", path: "/elite-tools", type: "Platform", tags: ["elite", "advanced"], protected: true },
  { id: "platform-admin", title: "Admin", description: "Administrative dashboard (restricted).", path: "/admin", type: "Platform", tags: ["admin", "restricted"], protected: true },
  { id: "platform-content-admin", title: "Content Admin", description: "Content administration dashboard (restricted).", path: "/content-admin", type: "Platform", tags: ["admin", "content"], protected: true },

  // ---- Public essentials (orientation + trust) ----
  { id: "public-faq", title: "FAQ", description: "Answers to common questions about the platform.", path: "/faq", type: "Support", tags: ["faq", "help", "questions"] },
  { id: "public-pricing", title: "Pricing", description: "Plans and what you get — simple and transparent.", path: "/pricing", type: "Update", tags: ["pricing", "plans"] },
  { id: "public-legal", title: "Legal", description: "Legal and policy overview.", path: "/legal", type: "Update", tags: ["legal", "policy"] },
  { id: "public-terms", title: "Terms", description: "Terms of service.", path: "/terms", type: "Update", tags: ["terms"] },
  { id: "public-privacy", title: "Privacy", description: "Privacy policy and data handling.", path: "/privacy", type: "Update", tags: ["privacy"] },
  { id: "public-disclaimer", title: "Disclaimer", description: "Important disclaimer and content boundaries.", path: "/disclaimer", type: "Update", tags: ["disclaimer"] },
  { id: "public-ethics", title: "Ethics", description: "Ethical principles and commitments.", path: "/ethics", type: "Update", tags: ["ethics"] },

  // ---- Auth entry points (public) ----
  { id: "auth-login", title: "Login", description: "Sign in to your account.", path: "/login", type: "Platform", tags: ["login", "sign in"] },
  { id: "auth-register", title: "Register", description: "Create a new account.", path: "/register", type: "Platform", tags: ["register", "sign up"] },
  { id: "auth-forgot", title: "Forgot Password", description: "Reset your password if you can’t sign in.", path: "/forgot-password", type: "Platform", tags: ["password", "reset"] },
  { id: "auth-reset", title: "Reset Password", description: "Choose a new password.", path: "/reset-password", type: "Platform", tags: ["password", "reset"] },
];

// Helpers for UI grouping + auth filtering
export function isProtectedPath(item: SearchItem): boolean {
  return Boolean(item.protected);
}

export function filterSearchIndex(opts: { isAuthed: boolean }): SearchItem[] {
  if (opts.isAuthed) return SEARCH_INDEX;
  return SEARCH_INDEX.filter((i) => !i.protected);
}

export function groupByType(items: SearchItem[]): Record<SearchType, SearchItem[]> {
  return items.reduce((acc, item) => {
    (acc[item.type] ||= []).push(item);
    return acc;
  }, {} as Record<SearchType, SearchItem[]>);
}
/** Small helpers for better matching without dependencies */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/[-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]+/gu, "");
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Search API:
 * - Set includeProtected=false for logged-out users.
 * - Limit defaults to 12.
 */
export function searchContent(
  query: string,
  opts?: { limit?: number; includeProtected?: boolean }
): SearchItem[] {
  const limit = opts?.limit ?? 12;
  const includeProtected = opts?.includeProtected ?? false;

  const q = normalize(query);
  if (!q) return [];

  const qTokens = tokenize(q);

  const pool = includeProtected
    ? searchIndex
    : searchIndex.filter((i) => !i.protected);

  const scored = pool
    .map((item) => {
      const title = normalize(item.title);
      const desc = normalize(item.description);
      const tags = item.tags.map(normalize);

      // base signals
      let score = 0;
      if (title.includes(q)) score += 30;
      if (desc.includes(q)) score += 15;
      if (tags.some((t) => t.includes(q))) score += 20;

      // token signals (helps partial matches like "sleep", "ground")
      for (const t of qTokens) {
        if (t.length < 2) continue;
        if (title.includes(t)) score += 6;
        if (desc.includes(t)) score += 3;
        if (tags.some((x) => x.includes(t))) score += 4;
        if (item.path.includes(t)) score += 1;
      }

      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);

  return scored;
}
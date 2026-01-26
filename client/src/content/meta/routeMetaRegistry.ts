// client/src/content/meta/routeMetaRegistry.ts

export type ModuleKey = "mi" | "nlp" | "12practices";

export type InternalLink = {
  label: string;
  routeKey: string; // <-- routeKey ONLY (no raw paths)
};

export type RouteMeta = {
  routeKey: string;
  canonicalPath: string; // <-- single source of truth for URL
  title: string;
  description: string;
  benefits: string[];
  internalLinks: InternalLink[];
  modules: ModuleKey[]; // opt-in modules
};

function titleizeFromRouteKey(routeKey: string) {
  const cleaned = String(routeKey || "")
    .replace(/^home$/, "home")
    .replace(/__+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\bparam\b/gi, "")
    .trim();

  const base = cleaned || "The Genuine Love Project";
  return base
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferPathFromRouteKey(routeKey: string) {
  const key = String(routeKey || "").trim();
  if (!key || key === "home") return "/";

  // convert routeKey back into path:
  // hubs__anxiety -> /hubs/anxiety
  // blog__param_slug -> /blog/:slug
  const path = key
    .split("__")
    .filter(Boolean)
    .map((seg) => seg.replace(/^param_/, ":"))
    .join("/");

  return "/" + path;
}

function safeDefaultMeta(routeKey: string): RouteMeta {
  const pretty = titleizeFromRouteKey(routeKey);
  return {
    routeKey,
    canonicalPath: inferPathFromRouteKey(routeKey),
    title: pretty,
    description: "Supportive, evidence-informed tools — one small step at a time.",
    benefits: [
      "Choose one tiny, doable next step (no pressure).",
      "Turn insight into a simple plan you can repeat.",
      "Use calm tools that support self-awareness and regulation.",
    ],
    internalLinks: [],
    modules: [],
  };
}

/**
 * ✅ SINGLE SOURCE OF TRUTH
 * Add only special routes here.
 * Everything else gets a safe non-repetitive default.
 */
const REGISTRY: Record<string, Partial<RouteMeta>> = {
  // ═══════════════════════════════════════════════════════════════════
  // CORE TOOLS
  // ═══════════════════════════════════════════════════════════════════
  tools: {
    canonicalPath: "/tools",
    title: "Wellness Tools",
    description: "Simple, evidence-informed tools for emotional regulation and self-discovery.",
    benefits: [
      "Choose from grounding, journaling, breathwork, and more.",
      "Each tool takes 2-5 minutes — fit into any day.",
      "Build skills at your own pace, no pressure.",
    ],
    internalLinks: [
      { label: "Try: Reframe Tool", routeKey: "tools__reframe" },
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Explore: Anxiety Hub", routeKey: "hubs__anxiety" },
    ],
    modules: ["mi"],
  },

  tools__reframe: {
    canonicalPath: "/tools/reframe",
    title: "Reframe Tool",
    description: "Turn a hard moment into a kinder, steadier next step.",
    benefits: [
      "Name the thought → name the feeling → choose a balanced alternative.",
      "Reduce spirals with a short, structured flow.",
      "Leave with one tiny step you can do today.",
    ],
    modules: ["mi", "nlp"],
    internalLinks: [
      { label: "Next: Grounding", routeKey: "grounding" },
      { label: "Explore: 12 Practices", routeKey: "paths__12-practices" },
    ],
  },

  grounding: {
    canonicalPath: "/grounding",
    title: "Grounding Practices",
    description: "Simple techniques to bring you back to the present moment.",
    benefits: [
      "Use 5-4-3-2-1 senses to anchor yourself quickly.",
      "Calm your nervous system in under 2 minutes.",
      "Build a go-to toolkit for moments of overwhelm.",
    ],
    modules: ["mi"],
    internalLinks: [
      { label: "Next: Breathwork", routeKey: "hubs__breathwork" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
      { label: "Explore: Anxiety Hub", routeKey: "hubs__anxiety" },
    ],
  },

  breathing: {
    canonicalPath: "/breathing",
    title: "Breathing Exercises",
    description: "Guided breathwork for calm, focus, and emotional regulation.",
    benefits: [
      "Use box breathing, 4-7-8, and other proven techniques.",
      "Regulate your nervous system in 60 seconds.",
      "Build a daily micro-practice for lasting calm.",
    ],
    modules: ["mi"],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Explore: Body-Mind Hub", routeKey: "hubs__body-mind" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATHS
  // ═══════════════════════════════════════════════════════════════════
  "paths__12-practices": {
    canonicalPath: "/paths/12-practices",
    title: "12 Practices: Mind-Body-Soul Growth",
    description: "A modern, gentle 12-step-inspired path for sustainable growth.",
    benefits: [
      "Build inner stability through daily practice (not perfection).",
      "Use reflection + tiny actions to change patterns over time.",
      "Stay grounded in values, compassion, and accountability.",
    ],
    modules: ["12practices", "mi", "nlp"],
    internalLinks: [
      { label: "Start: Tiny Step", routeKey: "tools__reframe" },
      { label: "Support: Anxiety Hub", routeKey: "hubs__anxiety" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // HUBS - Emotional Support
  // ═══════════════════════════════════════════════════════════════════
  hubs: {
    canonicalPath: "/hubs",
    title: "Wellness Hubs",
    description: "Curated collections of tools, insights, and practices for specific challenges.",
    benefits: [
      "Find focused support for anxiety, boundaries, grief, and more.",
      "Each hub combines tools, prompts, and gentle guidance.",
      "Start anywhere — there's no wrong door.",
    ],
    internalLinks: [
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
      { label: "Boundaries Hub", routeKey: "hubs__boundaries" },
      { label: "Self-Worth Hub", routeKey: "hubs__self-worth" },
    ],
  },

  hubs__anxiety: {
    canonicalPath: "/hubs/anxiety",
    title: "Anxiety Support Hub",
    description: "Build calm skills: grounding, reframing, breathwork, and tiny steps you can actually do.",
    benefits: [
      "Reduce overwhelm with 2-minute nervous system resets.",
      "Name patterns gently and choose one next step.",
      "Practice thought-balancing without judging yourself.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
      { label: "Try: Breathwork", routeKey: "breathing" },
    ],
    modules: ["mi", "nlp"],
  },

  hubs__boundaries: {
    canonicalPath: "/hubs/boundaries",
    title: "Boundaries Hub",
    description: "Learn to set and maintain healthy boundaries with compassion.",
    benefits: [
      "Identify where you need boundaries without guilt.",
      "Practice saying no with kindness and clarity.",
      "Build scripts for difficult conversations.",
    ],
    internalLinks: [
      { label: "Try: Values Finder", routeKey: "tools__values" },
      { label: "Communication Hub", routeKey: "hubs__communication" },
      { label: "Self-Worth Hub", routeKey: "hubs__self-worth" },
    ],
    modules: ["mi", "nlp"],
  },

  "hubs__self-worth": {
    canonicalPath: "/hubs/self-worth",
    title: "Self-Worth Hub",
    description: "Rebuild your relationship with yourself through gentle, evidence-based practices.",
    benefits: [
      "Challenge inner critic patterns with compassion.",
      "Build a foundation of self-respect and self-trust.",
      "Practice daily affirmations that actually feel true.",
    ],
    internalLinks: [
      { label: "Try: Reframe Tool", routeKey: "tools__reframe" },
      { label: "Confidence Hub", routeKey: "hubs__confidence" },
      { label: "Boundaries Hub", routeKey: "hubs__boundaries" },
    ],
    modules: ["mi", "nlp"],
  },

  hubs__confidence: {
    canonicalPath: "/hubs/confidence",
    title: "Confidence Hub",
    description: "Build authentic confidence through small wins and self-compassion.",
    benefits: [
      "Identify your existing strengths and past wins.",
      "Take tiny brave actions to expand your comfort zone.",
      "Replace perfectionism with 'good enough' progress.",
    ],
    internalLinks: [
      { label: "Self-Worth Hub", routeKey: "hubs__self-worth" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
      { label: "Habits Hub", routeKey: "hubs__habits" },
    ],
    modules: ["mi"],
  },

  hubs__communication: {
    canonicalPath: "/hubs/communication",
    title: "Communication Hub",
    description: "Express yourself clearly and listen deeply with practical tools.",
    benefits: [
      "Use 'I' statements and nonviolent communication basics.",
      "Prepare for difficult conversations with scripts.",
      "Build active listening skills for deeper connection.",
    ],
    internalLinks: [
      { label: "Boundaries Hub", routeKey: "hubs__boundaries" },
      { label: "Relationships Hub", routeKey: "hubs__relationships" },
      { label: "Emotional Intelligence", routeKey: "hubs__emotional-intelligence" },
    ],
    modules: ["mi", "nlp"],
  },

  "hubs__emotional-intelligence": {
    canonicalPath: "/hubs/emotional-intelligence",
    title: "Emotional Intelligence Hub",
    description: "Develop awareness, regulation, and empathy for yourself and others.",
    benefits: [
      "Name emotions with precision (beyond just 'fine' or 'bad').",
      "Understand what triggers you and why.",
      "Respond thoughtfully instead of reacting impulsively.",
    ],
    internalLinks: [
      { label: "Try: State Tracker", routeKey: "tools__state-tracker" },
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
      { label: "Communication Hub", routeKey: "hubs__communication" },
    ],
    modules: ["mi"],
  },

  hubs__grief: {
    canonicalPath: "/hubs/grief",
    title: "Grief Support Hub",
    description: "Navigate loss with compassion, ritual, and gentle practices.",
    benefits: [
      "Honor your grief without rushing the process.",
      "Use journaling and reflection to process feelings.",
      "Find tiny rituals that bring comfort and meaning.",
    ],
    internalLinks: [
      { label: "Try: Journaling", routeKey: "guided-journaling" },
      { label: "Healing Journey Hub", routeKey: "hubs__healing-journey" },
      { label: "Self-Care Toolkit", routeKey: "self-care-toolkit" },
    ],
    modules: ["mi"],
  },

  "hubs__healing-journey": {
    canonicalPath: "/hubs/healing-journey",
    title: "Healing Journey Hub",
    description: "A gentle path through trauma recovery and emotional healing.",
    benefits: [
      "Move at your own pace — healing isn't linear.",
      "Use grounding and regulation as your foundation.",
      "Build safety and stability before going deeper.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Grief Hub", routeKey: "hubs__grief" },
      { label: "12 Practices Path", routeKey: "paths__12-practices" },
    ],
    modules: ["mi", "12practices"],
  },

  hubs__habits: {
    canonicalPath: "/hubs/habits",
    title: "Habits Hub",
    description: "Build sustainable habits through tiny steps and self-compassion.",
    benefits: [
      "Start with 2-minute habits that stick.",
      "Stack new behaviors onto existing routines.",
      "Celebrate progress, not perfection.",
    ],
    internalLinks: [
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Focus Hub", routeKey: "hubs__focus" },
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
    ],
    modules: ["mi"],
  },

  "hubs__daily-practice": {
    canonicalPath: "/hubs/daily-practice",
    title: "Daily Practice Hub",
    description: "Simple morning and evening routines for consistent self-care.",
    benefits: [
      "Build a 5-minute morning ritual that fits your life.",
      "Wind down with evening reflection practices.",
      "Track streaks without pressure or shame.",
    ],
    internalLinks: [
      { label: "Habits Hub", routeKey: "hubs__habits" },
      { label: "Gratitude Hub", routeKey: "hubs__gratitude" },
      { label: "Try: Journaling", routeKey: "guided-journaling" },
    ],
    modules: ["mi"],
  },

  hubs__gratitude: {
    canonicalPath: "/hubs/gratitude",
    title: "Gratitude Hub",
    description: "Cultivate appreciation and positivity through simple daily practices.",
    benefits: [
      "Notice small moments of goodness each day.",
      "Shift focus from what's missing to what's present.",
      "Build resilience through grateful reflection.",
    ],
    internalLinks: [
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Try: Journaling", routeKey: "guided-journaling" },
      { label: "Mindfulness Hub", routeKey: "hubs__mindfulness" },
    ],
    modules: ["mi"],
  },

  hubs__forgiveness: {
    canonicalPath: "/hubs/forgiveness",
    title: "Forgiveness Hub",
    description: "Release resentment and find peace through compassionate practices.",
    benefits: [
      "Understand forgiveness as freedom, not approval.",
      "Work through anger and hurt at your own pace.",
      "Practice self-forgiveness with kindness.",
    ],
    internalLinks: [
      { label: "Grief Hub", routeKey: "hubs__grief" },
      { label: "Healing Journey", routeKey: "hubs__healing-journey" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
    ],
    modules: ["mi", "nlp"],
  },

  hubs__focus: {
    canonicalPath: "/hubs/focus",
    title: "Focus Hub",
    description: "Build concentration and reduce distractions with proven techniques.",
    benefits: [
      "Use pomodoro and time-blocking for deep work.",
      "Reduce digital distractions mindfully.",
      "Build focus in 5-minute increments.",
    ],
    internalLinks: [
      { label: "Habits Hub", routeKey: "hubs__habits" },
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
      { label: "Try: Breathwork", routeKey: "breathing" },
    ],
    modules: ["mi"],
  },

  "hubs__energy-management": {
    canonicalPath: "/hubs/energy-management",
    title: "Energy Management Hub",
    description: "Optimize your energy cycles for sustainable productivity and rest.",
    benefits: [
      "Identify your peak energy times and protect them.",
      "Balance output with intentional recovery.",
      "Prevent burnout with energy audits.",
    ],
    internalLinks: [
      { label: "Focus Hub", routeKey: "hubs__focus" },
      { label: "Self-Care Toolkit", routeKey: "self-care-toolkit" },
      { label: "Body-Mind Hub", routeKey: "hubs__body-mind" },
    ],
    modules: ["mi"],
  },

  "hubs__body-mind": {
    canonicalPath: "/hubs/body-mind",
    title: "Body-Mind Hub",
    description: "Connect physical sensations with emotional awareness.",
    benefits: [
      "Notice where you hold stress in your body.",
      "Use somatic practices for emotional release.",
      "Build interoception — sensing your internal state.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Try: Breathwork", routeKey: "breathing" },
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
    ],
    modules: ["mi"],
  },

  hubs__breathwork: {
    canonicalPath: "/hubs/breathwork",
    title: "Breathwork Hub",
    description: "Master breathing techniques for calm, energy, and focus.",
    benefits: [
      "Learn box breathing, 4-7-8, and physiological sigh.",
      "Use breath to shift your nervous system state.",
      "Build a daily breathwork micro-practice.",
    ],
    internalLinks: [
      { label: "Try: Breathing", routeKey: "breathing" },
      { label: "Body-Mind Hub", routeKey: "hubs__body-mind" },
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
    ],
    modules: ["mi"],
  },

  hubs__creativity: {
    canonicalPath: "/hubs/creativity",
    title: "Creativity Hub",
    description: "Unlock creative expression for healing and self-discovery.",
    benefits: [
      "Use art, writing, and play as emotional outlets.",
      "Overcome creative blocks with gentle prompts.",
      "Build a regular creative practice without pressure.",
    ],
    internalLinks: [
      { label: "Try: Journaling", routeKey: "guided-journaling" },
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Focus Hub", routeKey: "hubs__focus" },
    ],
    modules: ["mi"],
  },

  hubs__acceptance: {
    canonicalPath: "/hubs/acceptance",
    title: "Acceptance Hub",
    description: "Practice radical acceptance and letting go of what you can't control.",
    benefits: [
      "Distinguish between acceptance and approval.",
      "Release resistance to reduce suffering.",
      "Find peace with uncertainty and imperfection.",
    ],
    internalLinks: [
      { label: "Grief Hub", routeKey: "hubs__grief" },
      { label: "Healing Journey", routeKey: "hubs__healing-journey" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
    ],
    modules: ["mi", "nlp"],
  },

  "hubs__coping-skills": {
    canonicalPath: "/hubs/coping-skills",
    title: "Coping Skills Hub",
    description: "Build a personalized toolkit for handling life's challenges.",
    benefits: [
      "Identify healthy vs. unhealthy coping patterns.",
      "Build a diverse toolkit for different situations.",
      "Replace harmful habits with supportive alternatives.",
    ],
    internalLinks: [
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Self-Care Toolkit", routeKey: "self-care-toolkit" },
    ],
    modules: ["mi"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // JOURNALING & REFLECTION
  // ═══════════════════════════════════════════════════════════════════
  "guided-journaling": {
    canonicalPath: "/guided-journaling",
    title: "Guided Journaling",
    description: "Structured prompts for self-reflection and emotional processing.",
    benefits: [
      "Use MI-informed prompts that guide without leading.",
      "Process emotions through written reflection.",
      "Build self-awareness with daily check-ins.",
    ],
    internalLinks: [
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Gratitude Hub", routeKey: "hubs__gratitude" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
    ],
    modules: ["mi"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SELF-CARE
  // ═══════════════════════════════════════════════════════════════════
  "self-care-toolkit": {
    canonicalPath: "/self-care-toolkit",
    title: "Self-Care Toolkit",
    description: "Personalized self-care practices for body, mind, and spirit.",
    benefits: [
      "Build a toolkit that fits your actual life.",
      "Balance physical, emotional, and social self-care.",
      "Use checklists and trackers to stay consistent.",
    ],
    internalLinks: [
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
      { label: "Coping Skills Hub", routeKey: "hubs__coping-skills" },
    ],
    modules: ["mi"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // RELATIONSHIPS
  // ═══════════════════════════════════════════════════════════════════
  hubs__relationships: {
    canonicalPath: "/hubs/relationships",
    title: "Relationships Hub",
    description: "Build healthier connections with yourself and others.",
    benefits: [
      "Identify relationship patterns and attachment styles.",
      "Set boundaries with compassion and clarity.",
      "Communicate needs without blame or criticism.",
    ],
    internalLinks: [
      { label: "Boundaries Hub", routeKey: "hubs__boundaries" },
      { label: "Communication Hub", routeKey: "hubs__communication" },
      { label: "Self-Worth Hub", routeKey: "hubs__self-worth" },
    ],
    modules: ["mi", "nlp"],
  },

  hubs__mindfulness: {
    canonicalPath: "/hubs/mindfulness",
    title: "Mindfulness Hub",
    description: "Present-moment awareness practices for calm and clarity.",
    benefits: [
      "Start with 1-minute mindfulness exercises.",
      "Build awareness without judgment.",
      "Use mindfulness to reduce reactivity.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Body-Mind Hub", routeKey: "hubs__body-mind" },
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
    ],
    modules: ["mi"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TOOLS - ADDITIONAL
  // ═══════════════════════════════════════════════════════════════════
  tools__values: {
    canonicalPath: "/tools/values",
    title: "Values Finder",
    description: "Discover and clarify your core values for authentic living.",
    benefits: [
      "Identify what matters most to you.",
      "Align daily choices with your values.",
      "Use values as a compass for decisions.",
    ],
    internalLinks: [
      { label: "Boundaries Hub", routeKey: "hubs__boundaries" },
      { label: "12 Practices Path", routeKey: "paths__12-practices" },
    ],
    modules: ["mi"],
  },

  "tools__state-tracker": {
    canonicalPath: "/tools/state-tracker",
    title: "State Tracker",
    description: "Monitor your emotional and energy states throughout the day.",
    benefits: [
      "Notice patterns in your mood and energy.",
      "Identify triggers and supports.",
      "Build awareness without judgment.",
    ],
    internalLinks: [
      { label: "Emotional Intelligence", routeKey: "hubs__emotional-intelligence" },
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
    ],
    modules: ["mi"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL HUBS - A→Z COMPLETE
  // ═══════════════════════════════════════════════════════════════════
  "hubs__inner-peace": {
    canonicalPath: "/hubs/inner-peace",
    title: "Inner Peace Hub",
    description: "Cultivate lasting calm through mindfulness, acceptance, and gentle practices.",
    benefits: [
      "Find stillness in small daily moments.",
      "Reduce inner conflict through acceptance practices.",
      "Build resilience against external chaos.",
    ],
    internalLinks: [
      { label: "Mindfulness Hub", routeKey: "hubs__mindfulness" },
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Acceptance Hub", routeKey: "hubs__acceptance" },
    ],
    modules: ["mi"],
  },

  "hubs__inner-work": {
    canonicalPath: "/hubs/inner-work",
    title: "Inner Work Hub",
    description: "Deep self-exploration for lasting personal transformation.",
    benefits: [
      "Explore shadow aspects with compassion.",
      "Integrate past experiences for healing.",
      "Build authentic self-understanding.",
    ],
    internalLinks: [
      { label: "Self-Discovery Hub", routeKey: "hubs__self-discovery" },
      { label: "Healing Journey", routeKey: "hubs__healing-journey" },
      { label: "12 Practices Path", routeKey: "paths__12-practices" },
    ],
    modules: ["mi", "12practices"],
  },

  hubs__journaling: {
    canonicalPath: "/hubs/journaling",
    title: "Journaling Hub",
    description: "Written reflection practices for self-discovery and emotional processing.",
    benefits: [
      "Process emotions through structured writing.",
      "Track patterns and progress over time.",
      "Use prompts that guide without leading.",
    ],
    internalLinks: [
      { label: "Try: Guided Journaling", routeKey: "guided-journaling" },
      { label: "Gratitude Hub", routeKey: "hubs__gratitude" },
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
    ],
    modules: ["mi"],
  },

  "hubs__life-purpose": {
    canonicalPath: "/hubs/life-purpose",
    title: "Life Purpose Hub",
    description: "Discover meaning and direction through values and vision work.",
    benefits: [
      "Clarify what matters most to you.",
      "Align daily actions with deeper purpose.",
      "Build a vision that energizes without pressure.",
    ],
    internalLinks: [
      { label: "Values Finder", routeKey: "tools__values" },
      { label: "Self-Discovery Hub", routeKey: "hubs__self-discovery" },
      { label: "Personal Growth Hub", routeKey: "hubs__personal-growth" },
    ],
    modules: ["mi"],
  },

  hubs__motivation: {
    canonicalPath: "/hubs/motivation",
    title: "Motivation Hub",
    description: "Sustainable motivation through intrinsic drives and tiny wins.",
    benefits: [
      "Understand what truly drives you.",
      "Build momentum with small achievable steps.",
      "Replace willpower with environment design.",
    ],
    internalLinks: [
      { label: "Habits Hub", routeKey: "hubs__habits" },
      { label: "Life Purpose Hub", routeKey: "hubs__life-purpose" },
      { label: "Confidence Hub", routeKey: "hubs__confidence" },
    ],
    modules: ["mi"],
  },

  "hubs__nervous-system": {
    canonicalPath: "/hubs/nervous-system",
    title: "Nervous System Hub",
    description: "Regulate your nervous system for calm, safety, and resilience.",
    benefits: [
      "Understand fight/flight/freeze responses.",
      "Use polyvagal-informed regulation tools.",
      "Build a wider window of tolerance.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Body-Mind Hub", routeKey: "hubs__body-mind" },
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
    ],
    modules: ["mi"],
  },

  "hubs__personal-growth": {
    canonicalPath: "/hubs/personal-growth",
    title: "Personal Growth Hub",
    description: "Continuous development through reflection, learning, and small steps.",
    benefits: [
      "Set growth goals that feel achievable.",
      "Learn from setbacks without shame.",
      "Celebrate progress, not perfection.",
    ],
    internalLinks: [
      { label: "Habits Hub", routeKey: "hubs__habits" },
      { label: "Self-Discovery Hub", routeKey: "hubs__self-discovery" },
      { label: "12 Practices Path", routeKey: "paths__12-practices" },
    ],
    modules: ["mi", "12practices"],
  },

  hubs__presence: {
    canonicalPath: "/hubs/presence",
    title: "Presence Hub",
    description: "Return to the present moment with grounding and awareness practices.",
    benefits: [
      "Anchor yourself in the here and now.",
      "Reduce rumination and future-worry.",
      "Find calm in sensory awareness.",
    ],
    internalLinks: [
      { label: "Mindfulness Hub", routeKey: "hubs__mindfulness" },
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Try: Breathwork", routeKey: "breathing" },
    ],
    modules: ["mi"],
  },

  hubs__resilience: {
    canonicalPath: "/hubs/resilience",
    title: "Resilience Hub",
    description: "Build the capacity to recover and adapt through challenges.",
    benefits: [
      "Develop flexible coping strategies.",
      "Build support networks and resources.",
      "Practice post-traumatic growth mindsets.",
    ],
    internalLinks: [
      { label: "Coping Skills Hub", routeKey: "hubs__coping-skills" },
      { label: "Healing Journey", routeKey: "hubs__healing-journey" },
      { label: "Confidence Hub", routeKey: "hubs__confidence" },
    ],
    modules: ["mi"],
  },

  "hubs__self-awareness": {
    canonicalPath: "/hubs/self-awareness",
    title: "Self-Awareness Hub",
    description: "Know yourself better through reflection and observation.",
    benefits: [
      "Notice patterns in thoughts and behaviors.",
      "Understand your triggers and needs.",
      "Build metacognitive skills with compassion.",
    ],
    internalLinks: [
      { label: "Emotional Intelligence", routeKey: "hubs__emotional-intelligence" },
      { label: "State Tracker", routeKey: "tools__state-tracker" },
      { label: "Try: Journaling", routeKey: "guided-journaling" },
    ],
    modules: ["mi"],
  },

  "hubs__self-care": {
    canonicalPath: "/hubs/self-care",
    title: "Self-Care Hub",
    description: "Holistic self-care practices for body, mind, and spirit.",
    benefits: [
      "Build sustainable self-care routines.",
      "Balance rest with productivity.",
      "Prioritize your wellbeing without guilt.",
    ],
    internalLinks: [
      { label: "Self-Care Toolkit", routeKey: "self-care-toolkit" },
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
    ],
    modules: ["mi"],
  },

  "hubs__self-compassion": {
    canonicalPath: "/hubs/self-compassion",
    title: "Self-Compassion Hub",
    description: "Treat yourself with the kindness you'd offer a good friend.",
    benefits: [
      "Replace self-criticism with self-kindness.",
      "Recognize common humanity in struggles.",
      "Practice mindful self-compassion daily.",
    ],
    internalLinks: [
      { label: "Self-Worth Hub", routeKey: "hubs__self-worth" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
      { label: "Forgiveness Hub", routeKey: "hubs__forgiveness" },
    ],
    modules: ["mi", "nlp"],
  },

  "hubs__self-discovery": {
    canonicalPath: "/hubs/self-discovery",
    title: "Self-Discovery Hub",
    description: "Explore who you are and who you want to become.",
    benefits: [
      "Uncover hidden strengths and values.",
      "Explore identity with curiosity, not judgment.",
      "Build authentic self-expression.",
    ],
    internalLinks: [
      { label: "Values Finder", routeKey: "tools__values" },
      { label: "Life Purpose Hub", routeKey: "hubs__life-purpose" },
      { label: "Inner Work Hub", routeKey: "hubs__inner-work" },
    ],
    modules: ["mi"],
  },

  hubs__sleep: {
    canonicalPath: "/hubs/sleep",
    title: "Sleep Hub",
    description: "Improve sleep quality with evidence-based practices.",
    benefits: [
      "Build a calming pre-sleep routine.",
      "Reduce sleep anxiety with gentle techniques.",
      "Track and improve your sleep patterns.",
    ],
    internalLinks: [
      { label: "Energy Hub", routeKey: "hubs__energy-management" },
      { label: "Try: Breathwork", routeKey: "breathing" },
      { label: "Self-Care Hub", routeKey: "hubs__self-care" },
    ],
    modules: ["mi"],
  },

  hubs__spirituality: {
    canonicalPath: "/hubs/spirituality",
    title: "Spirituality Hub",
    description: "Explore meaning, connection, and transcendence in your own way.",
    benefits: [
      "Connect with something larger than yourself.",
      "Explore spiritual practices without dogma.",
      "Find meaning in daily life and challenges.",
    ],
    internalLinks: [
      { label: "Life Purpose Hub", routeKey: "hubs__life-purpose" },
      { label: "Gratitude Hub", routeKey: "hubs__gratitude" },
      { label: "Inner Peace Hub", routeKey: "hubs__inner-peace" },
    ],
    modules: ["mi", "12practices"],
  },

  hubs__stress: {
    canonicalPath: "/hubs/stress",
    title: "Stress Hub",
    description: "Manage stress with regulation, reframing, and recovery practices.",
    benefits: [
      "Identify your stress triggers and signs.",
      "Use quick regulation techniques in the moment.",
      "Build long-term stress resilience.",
    ],
    internalLinks: [
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
      { label: "Nervous System Hub", routeKey: "hubs__nervous-system" },
      { label: "Try: Grounding", routeKey: "grounding" },
    ],
    modules: ["mi"],
  },

  hubs__thoughtwork: {
    canonicalPath: "/hubs/thoughtwork",
    title: "Thoughtwork Hub",
    description: "Work with your thoughts using CBT-informed techniques.",
    benefits: [
      "Identify cognitive distortions with compassion.",
      "Reframe unhelpful thought patterns.",
      "Build balanced, realistic thinking.",
    ],
    internalLinks: [
      { label: "Try: Reframe", routeKey: "tools__reframe" },
      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
      { label: "Self-Awareness Hub", routeKey: "hubs__self-awareness" },
    ],
    modules: ["mi", "nlp"],
  },

  "hubs__trauma-healing": {
    canonicalPath: "/hubs/trauma-healing",
    title: "Trauma Healing Hub",
    description: "Gentle, trauma-informed resources for healing at your own pace.",
    benefits: [
      "Build safety and stability as your foundation.",
      "Use grounding when overwhelmed.",
      "Honor your pace — healing isn't linear.",
    ],
    internalLinks: [
      { label: "Healing Journey", routeKey: "hubs__healing-journey" },
      { label: "Nervous System Hub", routeKey: "hubs__nervous-system" },
      { label: "Try: Grounding", routeKey: "grounding" },
    ],
    modules: ["mi"],
  },

  hubs__wisdom: {
    canonicalPath: "/hubs/wisdom",
    title: "Wisdom Hub",
    description: "Integrate knowledge, experience, and compassion for wise living.",
    benefits: [
      "Learn from diverse wisdom traditions.",
      "Apply insights to daily decisions.",
      "Cultivate perspective and patience.",
    ],
    internalLinks: [
      { label: "Wisdom Tools", routeKey: "wisdom" },
      { label: "Spirituality Hub", routeKey: "hubs__spirituality" },
      { label: "Life Purpose Hub", routeKey: "hubs__life-purpose" },
    ],
    modules: ["mi"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ADVANCED TOOLS & PAGES
  // ═══════════════════════════════════════════════════════════════════
  wisdom: {
    canonicalPath: "/wisdom",
    title: "Wisdom Tools",
    description: "Evidence-based wisdom practices and insights for deeper understanding.",
    benefits: [
      "Access curated wisdom from research and traditions.",
      "Apply insights through practical exercises.",
      "Build discernment and wise decision-making.",
    ],
    internalLinks: [
      { label: "Wisdom Hub", routeKey: "hubs__wisdom" },
      { label: "Daily Wisdom", routeKey: "daily-wisdom" },
      { label: "Study Vault", routeKey: "study-vault" },
    ],
    modules: ["mi"],
  },

  "daily-wisdom": {
    canonicalPath: "/daily-wisdom",
    title: "Daily Wisdom",
    description: "A daily dose of wisdom, reflection, and inspiration.",
    benefits: [
      "Start your day with a meaningful insight.",
      "Reflect on wisdom from diverse sources.",
      "Build a daily contemplation practice.",
    ],
    internalLinks: [
      { label: "Wisdom Tools", routeKey: "wisdom" },
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Gratitude Hub", routeKey: "hubs__gratitude" },
    ],
    modules: ["mi"],
  },

  "study-vault": {
    canonicalPath: "/study-vault",
    title: "Study Vault",
    description: "Evidence-based research summaries for informed wellness.",
    benefits: [
      "Access simplified research summaries.",
      "Understand the science behind practices.",
      "Make informed choices about your wellness.",
    ],
    internalLinks: [
      { label: "Wisdom Tools", routeKey: "wisdom" },
      { label: "Tools", routeKey: "tools" },
    ],
    modules: [],
  },

  advanced: {
    canonicalPath: "/advanced",
    title: "Advanced Tools",
    description: "Deep-dive tools for experienced practitioners.",
    benefits: [
      "Access sophisticated reflection frameworks.",
      "Explore metacognitive and contemplative practices.",
      "Build mastery through advanced techniques.",
    ],
    internalLinks: [
      { label: "Mastery Tools", routeKey: "mastery" },
      { label: "Wisdom Tools", routeKey: "wisdom" },
      { label: "12 Practices Path", routeKey: "paths__12-practices" },
    ],
    modules: ["mi", "nlp", "12practices"],
  },

  mastery: {
    canonicalPath: "/mastery",
    title: "Mastery Tools",
    description: "Excellence-oriented tools for peak personal development.",
    benefits: [
      "Refine your practice with precision tools.",
      "Track progress toward mastery goals.",
      "Integrate multiple domains of growth.",
    ],
    internalLinks: [
      { label: "Advanced Tools", routeKey: "advanced" },
      { label: "Personal Growth Hub", routeKey: "hubs__personal-growth" },
      { label: "12 Practices Path", routeKey: "paths__12-practices" },
    ],
    modules: ["mi", "12practices"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CORE PAGES
  // ═══════════════════════════════════════════════════════════════════
  home: {
    canonicalPath: "/",
    title: "The Genuine Love Project",
    description: "AI-powered mental wellness tools for self-love, healing, and emotional growth.",
    benefits: [
      "Access trauma-informed emotional support anytime.",
      "Build self-awareness with gentle, evidence-based tools.",
      "Grow at your own pace — no pressure, just support.",
    ],
    internalLinks: [
      { label: "Explore Tools", routeKey: "tools" },
      { label: "Start: Anxiety Hub", routeKey: "hubs__anxiety" },
      { label: "Browse Hubs", routeKey: "hubs" },
    ],
    modules: [],
  },

  dashboard: {
    canonicalPath: "/dashboard",
    title: "Your Dashboard",
    description: "Your personalized wellness dashboard with progress tracking.",
    benefits: [
      "See your streaks and recent activity.",
      "Access your favorite tools quickly.",
      "Track your wellness journey over time.",
    ],
    internalLinks: [
      { label: "Tools", routeKey: "tools" },
      { label: "Daily Practice Hub", routeKey: "hubs__daily-practice" },
      { label: "Self-Care Toolkit", routeKey: "self-care-toolkit" },
    ],
    modules: [],
  },

  crisis: {
    canonicalPath: "/crisis",
    title: "Crisis Resources",
    description: "Immediate support and crisis resources — you are not alone.",
    benefits: [
      "Access 24/7 crisis hotlines and text lines.",
      "Find local emergency resources.",
      "Get immediate grounding techniques.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
    ],
    modules: [],
  },
};

export function deriveRouteKeyFromPath(pathname: string) {
  const p = (pathname || "/").split("?")[0].split("#")[0].trim();
  const clean = p.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return "home";

  // "/hubs/self-worth" -> "hubs__self-worth"
  // "/blog/:slug" -> "blog__param_slug" (if you ever pass pattern paths)
  return clean
    .split("/")
    .filter(Boolean)
    .map((seg) => (seg.startsWith(":") ? seg.replace(":", "param_") : seg))
    .join("__");
}

export function getRouteMeta(routeKey: string): RouteMeta {
  const key = String(routeKey || "home").trim() || "home";
  const base = safeDefaultMeta(key);
  const override = REGISTRY[key] || {};

  // Ensure canonicalPath always exists (registry wins, otherwise inferred)
  const canonicalPath = override.canonicalPath || base.canonicalPath;

  return {
    ...base,
    ...override,
    routeKey: key,
    canonicalPath,
    benefits: override.benefits || base.benefits,
    internalLinks: override.internalLinks || base.internalLinks,
    modules: override.modules || base.modules,
  };
}

export function resolveRoutePath(routeKey: string) {
  return getRouteMeta(routeKey).canonicalPath;
}

/**
 * For UI blocks that want ready-to-use hrefs.
 */
export function resolveInternalLinks(routeKey: string) {
  const meta = getRouteMeta(routeKey);
  return (meta.internalLinks || []).map((l) => ({
    ...l,
    href: resolveRoutePath(l.routeKey),
  }));
}

/**
 * Get enabled modules for a route (registry-driven).
 */
export function getEnabledModules(routeKey: string): ModuleKey[] {
  return getRouteMeta(routeKey).modules || [];
}

/**
 * Registry-driven module content. UI renders from this.
 * Add more content here over time; no page duplication.
 */
export function getModuleContent(moduleKey: ModuleKey) {
  if (moduleKey === "mi") {
    return {
      title: "Motivational Interviewing",
      subtitle: "Choose one tiny step you can actually do.",
      sliders: [
        { id: "importance", label: "Importance", hint: "How much this matters to you (right now)?" },
        { id: "confidence", label: "Confidence", hint: "How sure you feel you can do a tiny step?" },
        { id: "readiness", label: "Readiness", hint: "How ready you feel to take one step today?" },
      ],
      tinySteps: [
        "Do 2 minutes of slow breathing.",
        "Write one sentence: 'Right now I feel...'",
        "Choose the smallest next action (30 seconds).",
      ],
      affirmations: [
        "Small steps count.",
        "I can be gentle and still be strong.",
        "One kind action is enough for today.",
      ],
    };
  }

  if (moduleKey === "nlp") {
    return {
      title: "NLP Reframe",
      subtitle: "Shift language → shift meaning → shift action.",
      frames: [
        { id: "and", label: "Add an 'and'", example: "This is hard... and I can take one small step." },
        { id: "yet", label: "Add 'yet'", example: "I can't do it... yet." },
        { id: "choice", label: "Choice language", example: "I choose to practice one calming skill." },
      ],
    };
  }

  // 12practices
  return {
    title: "12 Practices",
    subtitle: "A gentle path of daily practice (not perfection).",
    steps: [
      "Pause + breathe",
      "Name the moment",
      "Choose a tiny step",
      "Reflect with compassion",
      "Repeat tomorrow",
    ],
  };
}
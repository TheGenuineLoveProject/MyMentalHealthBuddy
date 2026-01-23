// /pages/_autopilot.jsx
import React from "react";
import PageTemplate from "../components/PageTemplate.jsx";
import { getRouteConfig } from "../content/routes.js";

export default function AutopilotPage({ routeOverride }) {
  const path =
    routeOverride ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const config = getRouteConfig(path);
  return <PageTemplate config={config} />;
}
// /content/routes.js
// Config-driven autopilot: every route renders from this file.
// Keep per-route copy lightweight; templates generate warm, grounded defaults.

const BRAND = {
  sage: "#8fbf9f",
  rose: "#f4c7c3",
  teal: "#2f5d5d",
  white: "#faf9f7",
  charcoal: "#3a3a3a",
  gold: "#eac33b",
};

const DEFAULT_MODULES = [
  {
    icon: "/icons/icon1.svg",
    title: "Breathe + return",
    text: "A small reset that helps your body soften and your mind re-open.",
  },
  {
    icon: "/icons/icon2.svg",
    title: "Name what’s real",
    text: "Gentle language for emotions—so clarity grows without pressure.",
  },
  {
    icon: "/icons/icon3.svg",
    title: "One next step",
    text: "Choose a practice that respects your capacity today.",
  },
];

function titleFromRoute(route) {
  if (route === "/") return "The Genuine Love Project";
  const clean = route
    .replace(/^\/+/, "")
    .replace(/\/+/g, " / ")
    .replace(/[-_]/g, " ")
    .trim();
  return clean
    .split(" ")
    .map((w) => (w.toLowerCase() === "ai" ? "AI" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function buildBase({ route, category, pageLabel, description, heroTitle, heroCopy, primaryCta, secondaryCta }) {
  const title = pageLabel || titleFromRoute(route);
  const desc =
    description ||
    "A warm, grounded, evidence-based space for healing—built to support emotional safety, clarity, and steady progress.";

  const ht = heroTitle || title;
  const hc =
    heroCopy ||
    "Take a slow breath. Nothing to prove. Choose one small step that supports your nervous system—and your life.";

  return {
    route,
    category,
    title,
    description: desc,
    heroTitle: ht,
    heroCopy: hc,
    primaryCta: primaryCta || { label: "Begin gently", href: "/healing" },
    secondaryCta: secondaryCta || { label: "Explore the tools", href: "/wellness" },
    modules: DEFAULT_MODULES,
    sections: [
      {
        eyebrow: "A gentle promise",
        title: "No shame. No pressure.",
        subtitle: "This platform is designed for emotional safety—steady, supportive, and practical.",
        variant: "glow",
        bullets: [
          "Soft, clear language—never harsh motivation.",
          "Calm design with space to breathe.",
          "Motion is subtle and optional (reduced-motion safe).",
        ],
      },
      {
        eyebrow: "How it works",
        title: "Regulate → Understand → Rebuild",
        subtitle: "Start small. Track what matters. Build trust with yourself—one compassionate interaction at a time.",
        variant: "pattern",
        cards: [
          { title: "Regulate", text: "Soothe the body first—breath, grounding, micro-practices." },
          { title: "Understand", text: "Name feelings, notice patterns, and build emotional literacy." },
          { title: "Rebuild", text: "Choose routines that fit real life—gentle, sustainable change." },
        ],
        cta: { label: "Start with a practice", href: "/breathing" },
      },
    ],
    meta: {
      themeColor: BRAND.white,
      ogImage: "/logo.svg",
    },
  };
}

// Route registry (ALL 119).
// Keep these as “stubs + categories”; refine copy later route-by-route.
const ROUTE_INDEX = [
  // Landing & Marketing (7)
  { route: "/", category: "Landing", pageLabel: "The Genuine Love Project", primaryCta: { label: "Begin your healing journey", href: "/healing" }, secondaryCta: { label: "Explore the platform", href: "/landing" } },
  { route: "/home", category: "Landing", aliasOf: "/" },
  { route: "/welcome", category: "Landing", aliasOf: "/" },
  { route: "/original-home", category: "Landing", pageLabel: "Original Home", description: "The original home experience—kept for continuity while the new sacred landing evolves.", primaryCta: { label: "Go to the new home", href: "/" }, secondaryCta: { label: "Start a daily ritual", href: "/today" } },
  { route: "/healing", category: "Landing", pageLabel: "Healing", heroTitle: "Start with safety. Build from there.", heroCopy: "A simple, nervous-system-friendly path: regulate → understand → re-pattern. Small practices. Real results.", primaryCta: { label: "Begin a calming practice", href: "/breathing" }, secondaryCta: { label: "Explore the Wellness Hub", href: "/wellness" } },
  { route: "/pricing", category: "Landing", pageLabel: "Pricing", heroTitle: "Choose what supports you—gently.", heroCopy: "No pressure. No countdown timers. Just clear options and a calm invitation to start.", primaryCta: { label: "Start free", href: "/register" }, secondaryCta: { label: "See what’s included", href: "#plans" } },
  { route: "/landing", category: "Landing", pageLabel: "Marketing Landing", heroTitle: "A calm place to begin again.", heroCopy: "Tools for regulation, insight, and steady growth—delivered with warmth and clarity.", primaryCta: { label: "Explore healing tools", href: "/wellness" }, secondaryCta: { label: "See pricing", href: "/pricing" } },

  // Authentication (6)
  { route: "/login", category: "Authentication", pageLabel: "Login", heroTitle: "Welcome back.", heroCopy: "Sign in when you’re ready. We’ll keep it simple and calm.", primaryCta: { label: "Sign in", href: "/login" }, secondaryCta: { label: "Create an account", href: "/register" } },
  { route: "/login/callback", category: "Authentication", pageLabel: "Login Callback", heroTitle: "Finishing sign-in…", heroCopy: "One moment—bringing you back safely.", primaryCta: { label: "Continue", href: "/dashboard" }, secondaryCta: { label: "Back to home", href: "/" } },
  { route: "/register", category: "Authentication", pageLabel: "Register", heroTitle: "Create your space.", heroCopy: "A gentle start. You can go slowly and adjust anytime.", primaryCta: { label: "Create account", href: "/register" }, secondaryCta: { label: "Already have one?", href: "/login" } },
  { route: "/forgot-password", category: "Authentication", pageLabel: "Forgot Password", heroTitle: "Let’s reset—gently.", heroCopy: "We’ll help you regain access without friction.", primaryCta: { label: "Send reset link", href: "/forgot-password" }, secondaryCta: { label: "Back to login", href: "/login" } },
  { route: "/reset-password", category: "Authentication", pageLabel: "Reset Password", heroTitle: "Choose a new password.", heroCopy: "Small steps. You’re doing fine.", primaryCta: { label: "Save password", href: "/reset-password" }, secondaryCta: { label: "Back to login", href: "/login" } },
  { route: "/onboarding", category: "Authentication", pageLabel: "Onboarding", heroTitle: "Set your pace.", heroCopy: "We’ll personalize gently—based on what supports you.", primaryCta: { label: "Continue onboarding", href: "/onboarding" }, secondaryCta: { label: "Skip for now", href: "/dashboard" } },

  // Dashboard & Core (10)
  { route: "/dashboard", category: "Dashboard", pageLabel: "Dashboard", heroTitle: "Your calm dashboard.", heroCopy: "A simple overview—what matters today, without overwhelm.", primaryCta: { label: "Go to Today", href: "/today" }, secondaryCta: { label: "Open Journal", href: "/journal" } },
  { route: "/crm", category: "Dashboard", pageLabel: "CRM", heroTitle: "Care + coordination.", heroCopy: "A practical space for organization—kept clean and steady.", primaryCta: { label: "Open CRM", href: "/crm" }, secondaryCta: { label: "Back to dashboard", href: "/dashboard" } },
  { route: "/today", category: "Dashboard", pageLabel: "Daily Ritual", heroTitle: "One gentle ritual.", heroCopy: "A short sequence to regulate, reflect, and return to steadiness.", primaryCta: { label: "Start the ritual", href: "/today" }, secondaryCta: { label: "Breathing first", href: "/breathing" } },
  { route: "/mood", category: "Dashboard", pageLabel: "Mood Tracker", heroTitle: "Track with kindness.", heroCopy: "Notice patterns without judgment—data as care, not critique.", primaryCta: { label: "Log mood", href: "/mood" }, secondaryCta: { label: "View analytics", href: "/analytics" } },
  { route: "/state", category: "Dashboard", pageLabel: "State Tracker", heroTitle: "Your nervous system state.", heroCopy: "A clearer read on activation, safety, and steadiness—over time.", primaryCta: { label: "Log state", href: "/state" }, secondaryCta: { label: "Ground first", href: "/grounding" } },
  { route: "/journal", category: "Dashboard", pageLabel: "Journal", heroTitle: "Write softly. Learn honestly.", heroCopy: "Prompts that support insight with emotional safety—clear, gentle, evidence-based.", primaryCta: { label: "Start journaling", href: "/journal" }, secondaryCta: { label: "Guided journaling", href: "/guided-journaling" } },
  { route: "/analytics", category: "Dashboard", pageLabel: "Analytics", heroTitle: "Patterns, not pressure.", heroCopy: "See trends in a supportive way—so you can choose what helps.", primaryCta: { label: "View insights", href: "/analytics" }, secondaryCta: { label: "Progress view", href: "/progress" } },
  { route: "/progress", category: "Dashboard", pageLabel: "Progress", heroTitle: "Progress that feels safe.", heroCopy: "Steady change is allowed to be slow—and still be real.", primaryCta: { label: "View progress", href: "/progress" }, secondaryCta: { label: "Daily ritual", href: "/today" } },
  { route: "/growth-analytics", category: "Dashboard", pageLabel: "Growth Analytics", heroTitle: "Growth, made visible.", heroCopy: "Track what supports you—without turning life into a performance.", primaryCta: { label: "Open growth analytics", href: "/growth-analytics" }, secondaryCta: { label: "Back to analytics", href: "/analytics" } },
  { route: "/guided-journaling", category: "Dashboard", pageLabel: "Guided Journaling", heroTitle: "Guidance, not judgment.", heroCopy: "Prompts that help you name, soften, and move forward gently.", primaryCta: { label: "Start guided journaling", href: "/guided-journaling" }, secondaryCta: { label: "Open journal", href: "/journal" } },

  // AI & Chat (3)
  { route: "/chat", category: "AI", pageLabel: "AI Chat", heroTitle: "A calm companion.", heroCopy: "Supportive reflection with clear boundaries and gentle pacing.", primaryCta: { label: "Start chat", href: "/chat" }, secondaryCta: { label: "Crisis resources", href: "/crisis" } },
  { route: "/crisis", category: "AI", pageLabel: "Crisis Resources", heroTitle: "You deserve immediate support.", heroCopy: "If you’re in danger or feel unable to stay safe, please reach out to local emergency services or a crisis hotline now.", primaryCta: { label: "View resources", href: "/crisis" }, secondaryCta: { label: "Back to chat", href: "/chat" } },
  { route: "/companion", category: "AI", pageLabel: "Adaptive Companion", heroTitle: "Support that adapts gently.", heroCopy: "A steadier experience that meets you where you are—without urgency.", primaryCta: { label: "Begin", href: "/companion" }, secondaryCta: { label: "Wellness hub", href: "/wellness" } },

  // Wellness & Healing Tools (24)
  { route: "/wellness", category: "Wellness", pageLabel: "Wellness Hub" },
  { route: "/wellness-hub", category: "Wellness", pageLabel: "Wellness Hub (Full)" },
  { route: "/healing-library", category: "Wellness", pageLabel: "Healing Library" },
  { route: "/calming-scenes", category: "Wellness", pageLabel: "Calming Scenes" },
  { route: "/breathing", category: "Wellness", pageLabel: "Breathing Exercises" },
  { route: "/grounding", category: "Wellness", pageLabel: "Grounding Techniques" },
  { route: "/affirmations", category: "Wellness", pageLabel: "Affirmations" },
  { route: "/meditation", category: "Wellness", pageLabel: "Meditation Guide" },
  { route: "/self-care", category: "Wellness", pageLabel: "Self-Care Toolkit" },
  { route: "/emotional-intelligence", category: "Wellness", pageLabel: "Emotional Intelligence" },
  { route: "/sleep-guide", category: "Wellness", pageLabel: "Sleep Guide" },
  { route: "/stress-response", category: "Wellness", pageLabel: "Stress Response Guide" },
  { route: "/inner-child", category: "Wellness", pageLabel: "Inner Child Healing" },
  { route: "/body-wellness", category: "Wellness", pageLabel: "Body Wellness" },
  { route: "/soul-wellness", category: "Wellness", pageLabel: "Soul Wellness" },
  { route: "/healing-journeys", category: "Wellness", pageLabel: "Healing Journeys" },
  { route: "/behavior-change", category: "Wellness", pageLabel: "Behavior Change" },
  { route: "/daily-routines", category: "Wellness", pageLabel: "Daily Routines" },
  { route: "/cognitive-tools", category: "Wellness", pageLabel: "Cognitive Tools" },
  { route: "/mirror", category: "Wellness", pageLabel: "Mirror" },
  { route: "/ritual", category: "Wellness", pageLabel: "Daily Ritual" },
  { route: "/wisdom", category: "Wellness", pageLabel: "Wisdom Tools" },
  { route: "/wisdom-practices", category: "Wellness", pageLabel: "Wisdom Practices" },
  { route: "/wisdom-synthesis", category: "Wellness", pageLabel: "Wisdom Synthesis" },

  // Advanced & Mastery (14)
  { route: "/tools", category: "Advanced", pageLabel: "Tools" },
  { route: "/advanced", category: "Advanced", pageLabel: "Advanced Tools" },
  { route: "/mastery", category: "Advanced", pageLabel: "Mastery Tools" },
  { route: "/elite-tools", category: "Advanced", pageLabel: "Elite Tools" },
  { route: "/atlas", category: "Advanced", pageLabel: "Atlas" },
  { route: "/strategy-maps", category: "Advanced", pageLabel: "Strategy Maps" },
  { route: "/collaborative-lab", category: "Advanced", pageLabel: "Collaborative Lab" },
  { route: "/resilience", category: "Advanced", pageLabel: "Resilience Metrics" },
  { route: "/knowledge-synthesis", category: "Advanced", pageLabel: "Knowledge Synthesis" },
  { route: "/cognitive-architecture", category: "Advanced", pageLabel: "Cognitive Architecture" },
  { route: "/philosophical-inquiry", category: "Advanced", pageLabel: "Philosophical Inquiry" },
  { route: "/systems-thinking", category: "Advanced", pageLabel: "Systems Thinking" },
  { route: "/meta-learning", category: "Advanced", pageLabel: "Meta Learning" },
  { route: "/daily-wisdom", category: "Advanced", pageLabel: "Daily Wisdom Oracle" },

  // Content & Learning (13)
  { route: "/blog", category: "Content", pageLabel: "Blog" },
  { route: "/blog/:slug", category: "Content", pageLabel: "Blog Post", isDynamic: true },
  { route: "/write", category: "Content", pageLabel: "Blog Editor" },
  { route: "/content-index", category: "Content", pageLabel: "Content Index" },
  { route: "/content-studio", category: "Content", pageLabel: "Content Studio" },
  { route: "/study-vault", category: "Content", pageLabel: "Study Vault" },
  { route: "/research", category: "Content", pageLabel: "Research Evidence" },
  { route: "/how-to-guides", category: "Content", pageLabel: "How-To Guides" },
  { route: "/glossary", category: "Content", pageLabel: "Wellness Glossary" },
  { route: "/glossary-full", category: "Content", pageLabel: "Full Glossary" },
  { route: "/insight-cards", category: "Content", pageLabel: "Insight Cards" },
  { route: "/news", category: "Content", pageLabel: "News" },
  { route: "/examples", category: "Content", pageLabel: "Examples" },

  // Community & Social (3)
  { route: "/social", category: "Community", pageLabel: "Social Hub" },
  { route: "/community", category: "Community", pageLabel: "Community" },
  { route: "/community/discussion/:id", category: "Community", pageLabel: "Discussion Thread", isDynamic: true },

  // Support & Resources (5)
  { route: "/faq", category: "Support", pageLabel: "FAQ" },
  { route: "/resources", category: "Support", pageLabel: "Professional Resources" },
  { route: "/support", category: "Support", pageLabel: "Support" },
  { route: "/professional-resources", category: "Support", pageLabel: "Resources" },
  { route: "/qa", category: "Support", pageLabel: "Q&A" },

  // Legal & Policy (5)
  { route: "/terms", category: "Legal", pageLabel: "Terms of Service" },
  { route: "/privacy", category: "Legal", pageLabel: "Privacy Policy" },
  { route: "/legal", category: "Legal", pageLabel: "Legal" },
  { route: "/ethics", category: "Legal", pageLabel: "Ethics" },
  { route: "/disclaimer", category: "Legal", pageLabel: "Disclaimer" },

  // Account & Settings (6)
  { route: "/settings", category: "Account", pageLabel: "Settings" },
  { route: "/premium", category: "Account", pageLabel: "Premium Features" },
  { route: "/upgrade", category: "Account", pageLabel: "Upgrade" },
  { route: "/account/profile", category: "Account", pageLabel: "Profile" },
  { route: "/account/billing", category: "Account", pageLabel: "Billing" },
  { route: "/account/settings", category: "Account", pageLabel: "Account Settings" },

  // Admin (3)
  { route: "/admin", category: "Admin", pageLabel: "Admin Dashboard" },
  { route: "/content-admin", category: "Admin", pageLabel: "Content Admin" },
  { route: "/control", category: "Admin", pageLabel: "Control Dashboard" },

  // System & Utility (7)
  { route: "/health", category: "System", pageLabel: "Health Check" },
  { route: "/publishing", category: "System", pageLabel: "Publishing" },
  { route: "/design-system", category: "System", pageLabel: "Design System" },
  { route: "/wireframes", category: "System", pageLabel: "Wireframes" },
  { route: "/design-dashboard", category: "System", pageLabel: "Design Dashboard" },
  { route: "/safety", category: "System", pageLabel: "Safety" },
  { route: "/*", category: "System", pageLabel: "Not Found" },
];

// Build full configs + keep aliases
export const routes = ROUTE_INDEX.map((r) => {
  if (r.aliasOf) {
    return { route: r.route, aliasOf: r.aliasOf, category: r.category, title: titleFromRoute(r.route) };
  }
  return buildBase(r);
});

export function getRouteConfig(pathname) {
  // 1) direct match
  const exact = routes.find((r) => r.route === pathname);
  if (exact?.aliasOf) return getRouteConfig(exact.aliasOf);
  if (exact && exact.route !== "/*") return exact;

  // 2) dynamic patterns: /blog/:slug, /community/discussion/:id
  const dyn = ROUTE_INDEX.find((r) => r.isDynamic && matchDynamic(r.route, pathname));
  if (dyn) {
    const base = buildBase({
      route: pathname,
      category: dyn.category,
      pageLabel: dyn.pageLabel,
      heroTitle: dyn.pageLabel,
      heroCopy: "A calm, readable page—built for clarity and comfort.",
      primaryCta: { label: "Back to home", href: "/" },
      secondaryCta: { label: "Explore the library", href: "/healing-library" },
    });

    // Add dynamic-friendly section
    base.sections.unshift({
      eyebrow: "You’re here",
      title: titleFromRoute(pathname),
      subtitle: "If anything feels like too much, take a breath and come back to the smallest next step.",
      variant: "glow",
      bullets: ["Read slowly.", "Save what helps.", "Leave what doesn’t."],
    });

    return base;
  }

  // 3) fallback 404
  const notFound = routes.find((r) => r.route === "/*");
  return buildBase({
    route: pathname,
    category: notFound?.category || "System",
    pageLabel: "Not Found",
    heroTitle: "We couldn’t find that page.",
    heroCopy: "It happens. Let’s bring you back somewhere steady.",
    primaryCta: { label: "Go home", href: "/" },
    secondaryCta: { label: "Wellness hub", href: "/wellness" },
  });
}

function matchDynamic(pattern, pathname) {
  // pattern like "/blog/:slug"
  const p = pattern.split("/").filter(Boolean);
  const a = pathname.split("/").filter(Boolean);
  if (p.length !== a.length) return false;
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) continue;
    if (p[i] !== a[i]) return false;
  }
  return true;
}
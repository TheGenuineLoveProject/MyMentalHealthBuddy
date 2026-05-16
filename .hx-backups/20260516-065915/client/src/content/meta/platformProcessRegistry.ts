export type ProcessKey =
  | "onboarding"
  | "progress"
  | "saved"
  | "streaks"
  | "notifications"
  | "search"
  | "recommendations"
  | "accessibility"
  | "privacy"
  | "security"
  | "support"
  | "billing"
  | "referrals"
  | "analytics"
  | "contentOps"
  | "quality"
  | "performance"
  | "errorHandling"
  | "trust"
  | "community"
  | "personalization"
  | "export"
  | "adminOps"
  | "helpCenter"
  | "seoOps"
  | "experiments"
  | "integrations"
  | "compliance"
  | "antiSpam"
  | "rateLimits"
  | "dataRetention"
  | "backup"
  | "i18n"
  | "designSystem"
  | "routesHealth"
  | "legal";

export type ProcessMeta = {
  key: ProcessKey;
  title: string;
  purpose: string;
  userBenefit: string[];
  implementation: {
    status: "planned" | "inProgress" | "done";
    owner?: "product" | "engineering" | "legal" | "content" | "ops";
    notes?: string;
  };
  guardrails: string[];
};

export const PROCESS_REGISTRY: Record<ProcessKey, ProcessMeta> = {
  onboarding: {
    key: "onboarding",
    title: "Onboarding that feels safe + clear",
    purpose: "Help users start in under 60 seconds with the right first step.",
    userBenefit: ["Less overwhelm", "Faster progress", "Personalized next step"],
    implementation: { status: "done", owner: "product" },
    guardrails: ["No medical promises", "18+ only", "Always show safety footer"],
  },
  progress: {
    key: "progress",
    title: "Progress tracking (gentle, not shaming)",
    purpose: "Track small wins and habits in a non-judgmental way.",
    userBenefit: ["Motivation", "Clarity", "Consistency"],
    implementation: { status: "done", owner: "product" },
    guardrails: ["No shame language", "Opt-out available"],
  },
  saved: {
    key: "saved",
    title: "Saved tools + favorites",
    purpose: "Let users save what helps and return easily.",
    userBenefit: ["Quick access", "Personal library", "Repeat what works"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Respect privacy", "Local-first where possible"],
  },
  streaks: {
    key: "streaks",
    title: "Streaks (kind, optional)",
    purpose: "Encourage gentle consistency without guilt.",
    userBenefit: ["Momentum", "Small daily wins"],
    implementation: { status: "done", owner: "product" },
    guardrails: ["Streaks never punish", "Always offer reset with kindness"],
  },
  notifications: {
    key: "notifications",
    title: "Reminders (opt-in)",
    purpose: "Support routines with optional reminders.",
    userBenefit: ["Better follow-through", "Less forgetting"],
    implementation: { status: "planned", owner: "engineering" },
    guardrails: ["Opt-in only", "Easy disable", "No manipulative urgency"],
  },
  search: {
    key: "search",
    title: "Search tools + hubs",
    purpose: "Find exactly what you need in 1-2 taps.",
    userBenefit: ["Speed", "Less friction", "Better discovery"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["No sensitive inference", "No tracking without consent"],
  },
  recommendations: {
    key: "recommendations",
    title: "Next-best-step recommendations",
    purpose: "Suggest helpful routes using internalLinks + tags.",
    userBenefit: ["Better outcomes", "Guided journey"],
    implementation: { status: "done", owner: "product" },
    guardrails: ["Explain why a suggestion appears", "No medical claims"],
  },
  accessibility: {
    key: "accessibility",
    title: "Accessibility (WCAG AA habits)",
    purpose: "Make the platform usable for everyone.",
    userBenefit: ["Clarity", "Comfort", "Inclusion"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Keyboard nav", "Contrast", "Alt text where relevant"],
  },
  privacy: {
    key: "privacy",
    title: "Privacy-first defaults",
    purpose: "Minimize collection and be transparent.",
    userBenefit: ["Trust", "Safety", "Control"],
    implementation: { status: "done", owner: "legal" },
    guardrails: ["Least data needed", "Clear disclosures", "User controls"],
  },
  security: {
    key: "security",
    title: "Security basics (no drama)",
    purpose: "Protect accounts and data.",
    userBenefit: ["Safety", "Reliability"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["No secrets in repo", "Rate limits", "Sanitize inputs"],
  },
  support: {
    key: "support",
    title: "Support flow + escalation",
    purpose: "Help users get unstuck fast.",
    userBenefit: ["Less frustration", "Faster help"],
    implementation: { status: "done", owner: "ops" },
    guardrails: ["Crisis guidance visible", "No clinical triage by AI"],
  },
  billing: {
    key: "billing",
    title: "Clean billing tiers + upgrades",
    purpose: "Monetization that feels fair and clear.",
    userBenefit: ["Choice", "Transparency"],
    implementation: { status: "done", owner: "ops" },
    guardrails: ["Clear pricing", "No bait-and-switch"],
  },
  referrals: {
    key: "referrals",
    title: "Referrals (invite a friend gently)",
    purpose: "Ethical growth loop.",
    userBenefit: ["Community support", "Shared journey"],
    implementation: { status: "inProgress", owner: "product" },
    guardrails: ["No spam", "Opt-out", "No guilt language"],
  },
  analytics: {
    key: "analytics",
    title: "Analytics (minimal + consent)",
    purpose: "Measure what helps without violating trust.",
    userBenefit: ["Better product", "Improved tools"],
    implementation: { status: "done", owner: "ops" },
    guardrails: ["Consent where required", "No sensitive content logging"],
  },
  contentOps: {
    key: "contentOps",
    title: "Content ops (anti-duplication)",
    purpose: "Ship new content via registries, not copy/paste pages.",
    userBenefit: ["Consistency", "Quality"],
    implementation: { status: "done", owner: "content" },
    guardrails: ["No plagiarism", "Brand tone consistency"],
  },
  quality: {
    key: "quality",
    title: "Quality gates (scan + build)",
    purpose: "Prevent regressions.",
    userBenefit: ["Stability", "Trust"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Build must pass", "Scan must pass"],
  },
  performance: {
    key: "performance",
    title: "Performance budgets",
    purpose: "Fast load and smooth UX.",
    userBenefit: ["Less friction", "Better retention"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Avoid heavy deps", "Lazy load when needed"],
  },
  errorHandling: {
    key: "errorHandling",
    title: "Human-friendly errors",
    purpose: "No blank screens; always a safe fallback.",
    userBenefit: ["Clarity", "Less anxiety"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Never expose secrets", "Provide next action"],
  },
  trust: {
    key: "trust",
    title: "Trust center + disclaimers",
    purpose: "Clear boundaries + safe positioning.",
    userBenefit: ["Confidence", "Safety"],
    implementation: { status: "done", owner: "legal" },
    guardrails: ["Not therapy", "Not medical advice", "18+ only"],
  },
  community: {
    key: "community",
    title: "Community (optional, safe)",
    purpose: "Shared growth with guardrails.",
    userBenefit: ["Belonging", "Support"],
    implementation: { status: "planned", owner: "ops" },
    guardrails: ["Moderation", "No crisis substitution"],
  },
  personalization: {
    key: "personalization",
    title: "Personalization (explainable)",
    purpose: "Tailor next steps using user choices.",
    userBenefit: ["Relevance", "Less noise"],
    implementation: { status: "done", owner: "product" },
    guardrails: ["User controls", "Explain why"],
  },
  export: {
    key: "export",
    title: "Export your notes",
    purpose: "Give users their data.",
    userBenefit: ["Ownership", "Portability"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["No accidental leakage", "Explicit user action"],
  },
  adminOps: {
    key: "adminOps",
    title: "Admin operations",
    purpose: "Health dashboard + metrics + flags.",
    userBenefit: ["Stability", "Faster fixes"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["No PII leaks", "Role protected"],
  },
  helpCenter: {
    key: "helpCenter",
    title: "Help center",
    purpose: "Answers without friction.",
    userBenefit: ["Self-serve help", "Less confusion"],
    implementation: { status: "done", owner: "content" },
    guardrails: ["Clear, beginner-friendly"],
  },
  seoOps: {
    key: "seoOps",
    title: "SEO ops (metadata + hubs)",
    purpose: "Make pages discoverable with consistent metadata.",
    userBenefit: ["Findable tools", "Better reach"],
    implementation: { status: "done", owner: "content" },
    guardrails: ["No keyword spam", "Honest language"],
  },
  experiments: {
    key: "experiments",
    title: "Experiments (safe toggles)",
    purpose: "Try improvements without breaking everything.",
    userBenefit: ["Faster improvement"],
    implementation: { status: "inProgress", owner: "engineering" },
    guardrails: ["Feature flags", "Rollback"],
  },
  integrations: {
    key: "integrations",
    title: "Integrations (careful)",
    purpose: "Connect external services safely.",
    userBenefit: ["Convenience"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Consent", "Least privilege"],
  },
  compliance: {
    key: "compliance",
    title: "Compliance posture",
    purpose: "Clear policies + safe boundaries.",
    userBenefit: ["Trust", "Legitimacy"],
    implementation: { status: "done", owner: "legal" },
    guardrails: ["Accurate legal pages", "No medical claims"],
  },
  antiSpam: {
    key: "antiSpam",
    title: "Anti-spam & abuse controls",
    purpose: "Protect community + referrals.",
    userBenefit: ["Safety", "Trust"],
    implementation: { status: "done", owner: "ops" },
    guardrails: ["Rate limits", "Moderation"],
  },
  rateLimits: {
    key: "rateLimits",
    title: "Rate limiting",
    purpose: "Protect endpoints + uptime.",
    userBenefit: ["Reliability"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Graceful errors", "No lockout traps"],
  },
  dataRetention: {
    key: "dataRetention",
    title: "Data retention rules",
    purpose: "Don't keep data forever by default.",
    userBenefit: ["Privacy", "Control"],
    implementation: { status: "inProgress", owner: "legal" },
    guardrails: ["Clear retention policy"],
  },
  backup: {
    key: "backup",
    title: "Backups + restore",
    purpose: "Recover from mistakes.",
    userBenefit: ["Safety", "Resilience"],
    implementation: { status: "done", owner: "ops" },
    guardrails: ["Secure backups", "Test restore"],
  },
  i18n: {
    key: "i18n",
    title: "Internationalization readiness",
    purpose: "Prepare for multilingual support.",
    userBenefit: ["Broader access"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["No hardcoded strings in key areas"],
  },
  designSystem: {
    key: "designSystem",
    title: "Design system consistency",
    purpose: "Reusable components and spacing rules.",
    userBenefit: ["Calm UI", "Less confusion"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Avoid one-off styles", "Keep tokens consistent"],
  },
  routesHealth: {
    key: "routesHealth",
    title: "Route health scanner",
    purpose: "Scan incomplete routes & missing meta.",
    userBenefit: ["No broken pages", "Better quality"],
    implementation: { status: "done", owner: "engineering" },
    guardrails: ["Human-triggered only"],
  },
  legal: {
    key: "legal",
    title: "Legal pages + boundaries",
    purpose: "Clear disclaimers and terms.",
    userBenefit: ["Trust", "Clarity"],
    implementation: { status: "done", owner: "legal" },
    guardrails: ["No medical/therapy claims", "Accurate policies"],
  },
};

export function getProcessStats() {
  const processes = Object.values(PROCESS_REGISTRY);
  const done = processes.filter(p => p.implementation.status === "done").length;
  const inProgress = processes.filter(p => p.implementation.status === "inProgress").length;
  const planned = processes.filter(p => p.implementation.status === "planned").length;
  
  return {
    done,
    inProgress,
    planned,
    total: processes.length,
    percentComplete: Math.round((done / processes.length) * 100)
  };
}

export function getProcessesByStatus(status: "planned" | "inProgress" | "done") {
  return Object.values(PROCESS_REGISTRY).filter(p => p.implementation.status === status);
}

export function getProcessesByOwner(owner: "product" | "engineering" | "legal" | "content" | "ops") {
  return Object.values(PROCESS_REGISTRY).filter(p => p.implementation.owner === owner);
}

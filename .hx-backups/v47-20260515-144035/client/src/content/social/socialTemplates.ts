/**
 * Social Media Content Templates
 * Pre-built templates for wellness content across platforms
 * Safe language, trauma-informed, educational focus
 */

export interface SocialTemplate {
  id: string;
  platform: "twitter" | "instagram" | "linkedin" | "tiktok" | "pinterest";
  category: "affirmation" | "prompt" | "tip" | "quote" | "carousel" | "reel";
  title: string;
  template: string;
  hashtags: string[];
  characterLimit: number;
  bestPractices: string[];
}

export const SOCIAL_TEMPLATES: SocialTemplate[] = [
  {
    id: "twitter-affirmation",
    platform: "twitter",
    category: "affirmation",
    title: "Daily Affirmation Thread",
    template: `1/ Today's gentle reminder:

[AFFIRMATION]

You don't have to have it all figured out. 🧡

2/ Why this matters:

[EXPLANATION - 1-2 sentences]

3/ Try this today:

[MICRO-ACTION]

You're doing better than you think. 💫`,
    hashtags: ["mentalhealth", "selfcare", "healing", "affirmation", "wellness"],
    characterLimit: 280,
    bestPractices: [
      "Use numbered threads for engagement",
      "End with encouragement, not pressure",
      "Include one actionable step"
    ]
  },
  {
    id: "twitter-prompt",
    platform: "twitter",
    category: "prompt",
    title: "Reflection Prompt",
    template: `Gentle prompt for today:

"[REFLECTION QUESTION]"

No right answer. Just notice what comes up. 🌿

Reply with one word that describes how you're feeling.`,
    hashtags: ["reflection", "mentalhealth", "innerwork", "selfawareness"],
    characterLimit: 280,
    bestPractices: [
      "Invite engagement without pressure",
      "Keep questions open-ended",
      "Use emojis sparingly but warmly"
    ]
  },
  {
    id: "instagram-carousel",
    platform: "instagram",
    category: "carousel",
    title: "Educational Carousel (5 slides)",
    template: `SLIDE 1 (Hook):
[BOLD STATEMENT OR QUESTION]

SLIDE 2 (Context):
Here's what many people don't know:
[INSIGHT]

SLIDE 3 (The Shift):
Instead of [OLD WAY]...
Try [NEW WAY]

SLIDE 4 (How-To):
3 gentle steps:
1. [STEP 1]
2. [STEP 2]
3. [STEP 3]

SLIDE 5 (CTA):
Save this for later 💫
Share with someone who needs it 🧡

Caption:
[BRIEF SUMMARY + QUESTION]

.
.
.
[HASHTAGS - up to 30]`,
    hashtags: ["mentalhealtheducation", "healingjourney", "selfcaretips", "traumainformed", "anxietyrelief", "emotionalwellness", "innerwork", "personalgrowth"],
    characterLimit: 2200,
    bestPractices: [
      "First slide must stop the scroll",
      "Use consistent design/colors",
      "End with clear call-to-action",
      "Caption should add value, not repeat slides"
    ]
  },
  {
    id: "instagram-affirmation",
    platform: "instagram",
    category: "affirmation",
    title: "Quote Card + Caption",
    template: `[QUOTE IMAGE TEXT]:
"[AFFIRMATION OR QUOTE]"

[CAPTION]:
[EXPAND ON THE QUOTE - 2-3 sentences]

Sometimes we just need this reminder.

What's one thing you're proud of today, even if it feels small? 💬

#[HASHTAGS]`,
    hashtags: ["affirmation", "selfcompassion", "healingquotes", "mentalhealthmatters", "youmatter"],
    characterLimit: 2200,
    bestPractices: [
      "Quote should be readable at small size",
      "Caption adds personal touch",
      "End with engagement question"
    ]
  },
  {
    id: "linkedin-tip",
    platform: "linkedin",
    category: "tip",
    title: "Professional Wellness Tip",
    template: `[HOOK - relatable professional scenario]

---

Here's what I've learned:

[KEY INSIGHT - 2-3 sentences]

3 things that actually help:

1️⃣ [TIP 1 - specific and actionable]

2️⃣ [TIP 2 - specific and actionable]

3️⃣ [TIP 3 - specific and actionable]

---

The bottom line:
[TAKEAWAY - 1 sentence]

What strategies have worked for you? 👇

#WellnessAtWork #Leadership #MentalHealthMatters #ProfessionalDevelopment`,
    hashtags: ["wellnessatwork", "leadership", "mentalhealthmatters", "professionaldevelopment", "burnoutprevention"],
    characterLimit: 3000,
    bestPractices: [
      "Open with relatable hook",
      "Use line breaks for readability",
      "Keep professional but human",
      "End with engagement question"
    ]
  },
  {
    id: "tiktok-reel",
    platform: "tiktok",
    category: "reel",
    title: "Educational Reel Script",
    template: `[HOOK - 0-3 sec]:
"POV: [RELATABLE SCENARIO]"

[PROBLEM - 3-8 sec]:
"If you've ever felt [FEELING]..."

[SHIFT - 8-15 sec]:
"Here's what actually helps:"

[TIP 1 - 15-25 sec]:
[VISUAL DEMO OR EXPLANATION]

[TIP 2 - 25-35 sec]:
[VISUAL DEMO OR EXPLANATION]

[CTA - 35-45 sec]:
"Follow for more [TOPIC] tips"
"Save this for later"

---
Caption:
[BRIEF HOOK + HASHTAGS]`,
    hashtags: ["mentalhealth", "therapy", "selfcare", "healingtiktok", "anxietytips"],
    characterLimit: 150,
    bestPractices: [
      "Hook must grab in first 3 seconds",
      "Speak directly to camera",
      "Use trending sounds when appropriate",
      "Keep under 60 seconds for best reach"
    ]
  },
  {
    id: "pinterest-pin",
    platform: "pinterest",
    category: "tip",
    title: "Infographic Pin",
    template: `[PIN TITLE - keyword rich]:
[NUMBER] [TOPIC] Tips for [BENEFIT]

[PIN DESCRIPTION - 100+ words]:
Looking for [TOPIC] strategies that actually work?

This pin covers:
✓ [POINT 1]
✓ [POINT 2]
✓ [POINT 3]

Whether you're just starting your [TOPIC] journey or looking for new tools, these evidence-based approaches can help.

Save this pin and come back whenever you need a reminder.

[LINK to full article/resource]

#[KEYWORDS as hashtags]`,
    hashtags: ["selfcare", "mentalhealth", "wellness", "personalgrowth", "mindfulness"],
    characterLimit: 500,
    bestPractices: [
      "Use vertical 2:3 aspect ratio",
      "Include text overlay on image",
      "Keyword-rich title and description",
      "Link to valuable resource"
    ]
  }
];

export function getTemplatesByPlatform(platform: SocialTemplate["platform"]): SocialTemplate[] {
  return SOCIAL_TEMPLATES.filter(t => t.platform === platform);
}

export function getTemplatesByCategory(category: SocialTemplate["category"]): SocialTemplate[] {
  return SOCIAL_TEMPLATES.filter(t => t.category === category);
}

export function getRandomTemplate(): SocialTemplate {
  return SOCIAL_TEMPLATES[Math.floor(Math.random() * SOCIAL_TEMPLATES.length)];
}

export const PLATFORM_INFO = {
  twitter: { name: "Twitter/X", icon: "🐦", color: "sky" },
  instagram: { name: "Instagram", icon: "📸", color: "pink" },
  linkedin: { name: "LinkedIn", icon: "💼", color: "blue" },
  tiktok: { name: "TikTok", icon: "🎵", color: "purple" },
  pinterest: { name: "Pinterest", icon: "📌", color: "red" }
};

export const WELLNESS_HASHTAGS = {
  core: ["mentalhealth", "selfcare", "healing", "wellness", "mindfulness"],
  emotional: ["emotionalwellness", "innerwork", "selfcompassion", "anxietyrelief"],
  growth: ["personalgrowth", "selfimprovement", "growthmindset", "motivation"],
  healing: ["healingjourney", "traumahealing", "recovery", "therapytips"],
  professional: ["wellnessatwork", "burnoutprevention", "worklifebalance", "leadership"]
};

import { Router } from "express";

const router = Router();

// ===== CONTENT FRAMEWORKS =====
router.get("/frameworks", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "hero-journey",
        name: "Hero's Journey Framework",
        description: "Joseph Campbell's monomyth structure for transformative content",
        stages: [
          { stage: 1, name: "Ordinary World", content: "Show the reader's current struggle or limitation" },
          { stage: 2, name: "Call to Adventure", content: "Present the opportunity for change" },
          { stage: 3, name: "Refusal of the Call", content: "Acknowledge fears and objections" },
          { stage: 4, name: "Meeting the Mentor", content: "Introduce guidance (you/your content)" },
          { stage: 5, name: "Crossing the Threshold", content: "First steps into new territory" },
          { stage: 6, name: "Tests & Allies", content: "Challenges and resources along the way" },
          { stage: 7, name: "Approach to the Cave", content: "Preparing for the main challenge" },
          { stage: 8, name: "Ordeal", content: "The central transformation moment" },
          { stage: 9, name: "Reward", content: "What they gain from the journey" },
          { stage: 10, name: "The Road Back", content: "Integration and application" },
          { stage: 11, name: "Resurrection", content: "Final test and complete transformation" },
          { stage: 12, name: "Return with Elixir", content: "Sharing the wisdom with others" }
        ],
        bestFor: ["Personal transformation stories", "Course launches", "Brand narratives"]
      },
      {
        id: "pas",
        name: "Problem-Agitate-Solve",
        description: "Classic copywriting framework for persuasive content",
        structure: [
          { section: "Problem", description: "Identify the specific pain point", example: "You've tried every productivity system but still feel overwhelmed..." },
          { section: "Agitate", description: "Intensify the emotional impact", example: "This constant chaos isn't just frustrating—it's costing you relationships, opportunities, and your peace of mind..." },
          { section: "Solve", description: "Present your solution", example: "There's a simpler approach that works with your brain, not against it..." }
        ],
        bestFor: ["Sales pages", "Email sequences", "Ad copy"]
      },
      {
        id: "aida",
        name: "AIDA Framework",
        description: "Attention-Interest-Desire-Action sequence",
        structure: [
          { section: "Attention", description: "Hook that stops the scroll", techniques: ["Bold claim", "Surprising statistic", "Provocative question"] },
          { section: "Interest", description: "Build curiosity and relevance", techniques: ["Tell a story", "Present data", "Share insights"] },
          { section: "Desire", description: "Create emotional connection", techniques: ["Benefits over features", "Social proof", "Future pacing"] },
          { section: "Action", description: "Clear next step", techniques: ["Single CTA", "Urgency/scarcity", "Risk reversal"] }
        ],
        bestFor: ["Landing pages", "Social posts", "Email marketing"]
      },
      {
        id: "storytelling-spine",
        name: "Storytelling Spine",
        description: "Pixar's narrative structure",
        template: [
          "Once upon a time there was...",
          "Every day...",
          "One day...",
          "Because of that...",
          "Because of that...",
          "Until finally...",
          "And ever since then..."
        ],
        bestFor: ["Brand stories", "Case studies", "Social content"]
      }
    ]
  });
});

// ===== CONTENT TYPES =====
router.get("/types", (req, res) => {
  res.json({
    success: true,
    data: {
      educational: [
        {
          type: "How-To Guide",
          structure: ["Problem statement", "Prerequisites", "Step-by-step instructions", "Pro tips", "Common mistakes", "Next steps"],
          lengthRange: "1500-3000 words"
        },
        {
          type: "Ultimate Guide",
          structure: ["Introduction", "Table of contents", "Core concepts", "Deep dives", "Case studies", "Resources", "FAQ"],
          lengthRange: "5000-10000 words"
        },
        {
          type: "Listicle",
          structure: ["Hook", "Numbered items with explanations", "Action steps per item", "Summary"],
          lengthRange: "800-2000 words"
        },
        {
          type: "Case Study",
          structure: ["Challenge", "Solution", "Implementation", "Results", "Key learnings"],
          lengthRange: "1000-2500 words"
        }
      ],
      promotional: [
        {
          type: "Sales Page",
          structure: ["Headline", "Problem", "Solution intro", "Features/Benefits", "Social proof", "Offer", "Guarantee", "CTA"],
          keyElements: ["Multiple CTAs", "Testimonials", "FAQ section"]
        },
        {
          type: "Email Sequence",
          structure: ["Welcome email", "Value email", "Story email", "Social proof email", "Offer email", "Urgency email"],
          timing: "Daily or every 2 days"
        },
        {
          type: "Launch Sequence",
          structure: ["Seed phase", "Launch phase", "Open cart", "Cart close"],
          duration: "7-14 days"
        }
      ],
      social: [
        {
          type: "Thread",
          structure: ["Hook tweet", "3-10 value tweets", "Summary tweet", "CTA tweet"],
          platform: "X/Twitter"
        },
        {
          type: "Carousel",
          structure: ["Cover slide", "Problem slide", "Solution slides", "CTA slide"],
          platform: "LinkedIn/Instagram"
        },
        {
          type: "Short-Form Video",
          structure: ["Hook (0-3s)", "Promise (3-7s)", "Content (7-50s)", "CTA (last 10s)"],
          platform: "TikTok/Reels/Shorts"
        }
      ]
    }
  });
});

// ===== HEADLINE FORMULAS =====
router.get("/headlines", (req, res) => {
  res.json({
    success: true,
    data: {
      formulas: [
        { name: "How to [Desired Result] Without [Pain Point]", example: "How to Build a 6-Figure Business Without Sacrificing Family Time" },
        { name: "[Number] Ways to [Desired Result]", example: "7 Ways to Double Your Productivity This Week" },
        { name: "The [Adjective] Guide to [Topic]", example: "The Complete Guide to Morning Routines" },
        { name: "Why [Common Belief] is Wrong (And What to Do Instead)", example: "Why Hustle Culture is Killing Your Dreams (And What to Do Instead)" },
        { name: "How I [Achieved Result] in [Timeframe]", example: "How I Learned Spanish in 90 Days" },
        { name: "The [Number] Mistakes [Audience] Makes About [Topic]", example: "The 5 Mistakes New Meditators Make (And How to Avoid Them)" },
        { name: "What [Expert/Successful Person] Knows About [Topic] That You Don't", example: "What Olympians Know About Discipline That You Don't" },
        { name: "[Number] [Adjective] Lessons From [Source]", example: "10 Powerful Lessons From Ancient Stoic Philosophy" }
      ],
      powerWords: {
        curiosity: ["Secret", "Hidden", "Little-known", "Underground", "Insider"],
        urgency: ["Now", "Today", "Immediately", "Before", "Finally"],
        exclusivity: ["Elite", "Private", "Members-only", "Invitation", "VIP"],
        transformation: ["Revolutionary", "Game-changing", "Breakthrough", "Ultimate", "Definitive"],
        ease: ["Simple", "Easy", "Effortless", "Quick", "Instant"]
      }
    }
  });
});

// ===== HOOKS & OPENERS =====
router.get("/hooks", (req, res) => {
  res.json({
    success: true,
    data: {
      hookTypes: [
        {
          type: "Contrarian Hook",
          description: "Challenge conventional wisdom",
          examples: [
            "Forget everything you've heard about [topic]...",
            "Most advice about [topic] is completely backwards...",
            "What if everything you believed about [topic] was wrong?"
          ]
        },
        {
          type: "Story Hook",
          description: "Open with a compelling narrative moment",
          examples: [
            "I was sitting in my car, tears streaming down my face, when...",
            "The email that changed everything arrived at 3:47 AM...",
            "Nobody told me this would happen when I started..."
          ]
        },
        {
          type: "Question Hook",
          description: "Engage with a thought-provoking question",
          examples: [
            "What would you do if you knew you couldn't fail?",
            "Have you ever wondered why some people seem to have it all figured out?",
            "What's the one thing stopping you from [desired result]?"
          ]
        },
        {
          type: "Statistic Hook",
          description: "Lead with surprising data",
          examples: [
            "95% of people who try [thing] fail. Here's why you won't...",
            "[Number] people do [thing] every day. Most of them get it wrong...",
            "Studies show that [surprising fact]. Here's what it means for you..."
          ]
        },
        {
          type: "Declaration Hook",
          description: "Make a bold statement",
          examples: [
            "This is the most important thing you'll read today.",
            "In the next 5 minutes, I'm going to show you...",
            "Warning: This post will challenge everything you think you know..."
          ]
        }
      ],
      videoHooks: [
        "Stop scrolling if you want to [benefit]...",
        "This one thing changed my life...",
        "I need to tell you something...",
        "You're doing it wrong, and here's why...",
        "POV: You finally discover [solution]..."
      ]
    }
  });
});

// ===== CONTENT REPURPOSING =====
router.get("/repurpose", (req, res) => {
  res.json({
    success: true,
    data: {
      pillarContentModel: {
        description: "Create one major piece of content and repurpose into multiple formats",
        example: {
          pillar: "60-minute podcast episode on habit formation",
          derivatives: [
            { format: "Blog post", content: "Full transcript with headers and images" },
            { format: "YouTube video", content: "Video version with visual aids" },
            { format: "Twitter thread", content: "10 key insights" },
            { format: "Instagram carousel", content: "5 main takeaways" },
            { format: "Email sequence", content: "3-part series diving deeper" },
            { format: "Short-form videos", content: "5-10 clips for TikTok/Reels" },
            { format: "Quote graphics", content: "Shareable quotes from episode" },
            { format: "Newsletter edition", content: "Summarized learnings" }
          ]
        }
      },
      repurposingMatrix: [
        { original: "Long-form blog post", repurpose: ["Thread", "Carousel", "Email", "Video script", "Podcast talking points"] },
        { original: "Podcast episode", repurpose: ["Blog post", "Audiogram", "Quote graphics", "YouTube", "Clips"] },
        { original: "Video content", repurpose: ["Blog post", "Short clips", "Audiogram", "GIFs", "Quotes"] },
        { original: "Webinar", repurpose: ["Course module", "Blog series", "Email sequence", "Social clips", "Lead magnet"] }
      ],
      contentBatching: {
        steps: [
          { step: 1, action: "Plan 1 month of pillar content (4 major pieces)" },
          { step: 2, action: "Batch record/write all pillar content in 1-2 days" },
          { step: 3, action: "Create repurposing templates for each derivative format" },
          { step: 4, action: "Batch process all derivatives in dedicated sessions" },
          { step: 5, action: "Schedule everything using a content calendar" }
        ]
      }
    }
  });
});

// ===== CALLS TO ACTION =====
router.get("/ctas", (req, res) => {
  res.json({
    success: true,
    data: {
      ctaFormulas: [
        { type: "Direct", template: "Get [Product/Service] Now", example: "Get The Course Now" },
        { type: "Value-Focused", template: "Start [Benefit] Today", example: "Start Building Wealth Today" },
        { type: "Low-Commitment", template: "Learn More About [Topic]", example: "Learn More About Our Method" },
        { type: "Social Proof", template: "Join [Number]+ [Audience]", example: "Join 10,000+ Creators" },
        { type: "Urgency", template: "[Action] Before [Deadline]", example: "Enroll Before Midnight" },
        { type: "Curiosity", template: "Discover [Hidden/Secret] [Benefit]", example: "Discover The Secret to Effortless Focus" },
        { type: "Personal", template: "Send Me [Resource]", example: "Send Me The Free Guide" },
        { type: "Transformation", template: "Transform Your [Area] in [Time]", example: "Transform Your Morning in 7 Days" }
      ],
      buttonTextPsychology: {
        "Start" : "Implies beginning of a journey, low commitment",
        "Get" : "Direct, implies receiving value",
        "Claim" : "Creates sense of ownership and urgency",
        "Discover" : "Appeals to curiosity",
        "Join" : "Creates community belonging",
        "Unlock" : "Implies exclusive access",
        "Try" : "Low commitment, reduces friction",
        "Yes" : "Affirmative, implies agreement"
      }
    }
  });
});

// ===== ALL CONTENT DATA =====
router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { id: "frameworks", name: "Content Frameworks", endpoint: "/api/universal-content/frameworks" },
        { id: "types", name: "Content Types", endpoint: "/api/universal-content/types" },
        { id: "headlines", name: "Headline Formulas", endpoint: "/api/universal-content/headlines" },
        { id: "hooks", name: "Hooks & Openers", endpoint: "/api/universal-content/hooks" },
        { id: "repurpose", name: "Repurposing Strategies", endpoint: "/api/universal-content/repurpose" },
        { id: "ctas", name: "Calls to Action", endpoint: "/api/universal-content/ctas" }
      ],
      contentCreationProcess: {
        steps: [
          "Define your audience and their pain points",
          "Choose the right content format for your message",
          "Select a framework that fits your goal",
          "Write a compelling hook that stops the scroll",
          "Deliver massive value in the body",
          "End with a clear, single call to action"
        ]
      }
    }
  });
});

export default router;

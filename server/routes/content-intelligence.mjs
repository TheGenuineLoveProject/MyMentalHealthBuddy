import { Router } from "express";

const router = Router();

// Content Frameworks - 15 proven structures
const CONTENT_FRAMEWORKS = [
  { id: "aida", name: "AIDA", structure: ["Attention", "Interest", "Desire", "Action"], bestFor: ["Sales copy", "Landing pages", "Ads"], description: "Classic persuasion framework that guides reader through buying journey" },
  { id: "pas", name: "PAS", structure: ["Problem", "Agitation", "Solution"], bestFor: ["Email marketing", "Blog posts", "Sales pages"], description: "Connect with pain points before offering relief" },
  { id: "before-after-bridge", name: "Before-After-Bridge", structure: ["Before (current state)", "After (desired state)", "Bridge (how to get there)"], bestFor: ["Testimonials", "Case studies", "Product descriptions"], description: "Paint transformation journey" },
  { id: "story-spine", name: "Story Spine", structure: ["Once upon a time", "Every day", "But one day", "Because of that", "Until finally", "And ever since"], bestFor: ["Brand stories", "Personal narratives", "Video scripts"], description: "Universal storytelling structure" },
  { id: "hero-journey", name: "Hero's Journey", structure: ["Ordinary World", "Call to Adventure", "Refusal", "Mentor", "Crossing Threshold", "Tests", "Ordeal", "Reward", "Return"], bestFor: ["Long-form content", "Brand narratives", "Course design"], description: "Epic narrative arc for deep engagement" },
  { id: "inverted-pyramid", name: "Inverted Pyramid", structure: ["Most important info", "Important details", "Background/context"], bestFor: ["News articles", "Press releases", "Quick updates"], description: "Lead with the key point" },
  { id: "listicle", name: "Numbered List", structure: ["Hook headline", "Numbered items", "Brief descriptions", "CTA"], bestFor: ["Social media", "Blog posts", "Newsletters"], description: "Scannable, shareable content format" },
  { id: "how-to", name: "How-To Guide", structure: ["Introduction", "Materials/Prerequisites", "Step-by-step instructions", "Tips", "Conclusion"], bestFor: ["Tutorials", "Guides", "Educational content"], description: "Practical instructional format" },
  { id: "comparison", name: "Comparison", structure: ["Context", "Option A analysis", "Option B analysis", "Verdict", "Recommendation"], bestFor: ["Product reviews", "Decision guides", "Analysis pieces"], description: "Help readers make informed choices" },
  { id: "case-study", name: "Case Study", structure: ["Challenge", "Solution", "Implementation", "Results", "Learnings"], bestFor: ["B2B marketing", "Portfolio", "Testimonials"], description: "Prove value through real examples" },
  { id: "faq", name: "FAQ Format", structure: ["Questions from audience", "Clear answers", "Related resources"], bestFor: ["Support content", "Product pages", "SEO"], description: "Address common questions directly" },
  { id: "ultimate-guide", name: "Ultimate Guide", structure: ["Comprehensive overview", "Detailed sections", "Expert insights", "Resources"], bestFor: ["Pillar content", "SEO", "Authority building"], description: "Definitive resource on a topic" },
  { id: "thought-leadership", name: "Thought Leadership", structure: ["Contrarian take", "Evidence", "Implications", "Vision"], bestFor: ["LinkedIn", "Industry publications", "Keynotes"], description: "Position as industry expert" },
  { id: "interview", name: "Interview Format", structure: ["Introduction", "Q&A", "Key insights", "Conclusion"], bestFor: ["Podcasts", "Blog posts", "Videos"], description: "Leverage others' expertise and audience" },
  { id: "roundup", name: "Expert Roundup", structure: ["Question/theme", "Expert responses", "Synthesis", "Takeaways"], bestFor: ["Blog posts", "Ebooks", "Newsletters"], description: "Aggregate expert perspectives" }
];

// Platform Adaptations - 12 major platforms
const PLATFORM_ADAPTATIONS = [
  { id: "linkedin", name: "LinkedIn", tone: "Professional, insightful", length: "1300-1900 characters optimal", format: ["Hook in first line", "Line breaks for readability", "Personal insight", "Clear CTA"], bestContent: ["Thought leadership", "Career insights", "Industry analysis"] },
  { id: "twitter", name: "Twitter/X", tone: "Concise, punchy, conversational", length: "280 characters or thread", format: ["Strong hook", "Thread structure for depth", "Visuals boost engagement"], bestContent: ["Quick insights", "Hot takes", "Threads for depth"] },
  { id: "instagram", name: "Instagram", tone: "Visual, authentic, lifestyle", length: "2200 characters max, 125-150 visible", format: ["Caption hook", "Value or story", "Hashtags (5-10 relevant)", "CTA"], bestContent: ["Behind-the-scenes", "Tips carousels", "Reels for reach"] },
  { id: "tiktok", name: "TikTok", tone: "Casual, entertaining, trend-aware", length: "15-60 seconds optimal", format: ["Hook in 1-3 seconds", "Fast pacing", "Trending sounds", "Clear value"], bestContent: ["Educational quick tips", "Trends", "Authentic moments"] },
  { id: "youtube", name: "YouTube", tone: "Educational, entertaining, thorough", length: "8-15 minutes for engagement", format: ["Hook in first 30 seconds", "Clear structure", "Retention tactics", "End screen CTA"], bestContent: ["Tutorials", "Vlogs", "Reviews", "Long-form education"] },
  { id: "newsletter", name: "Email Newsletter", tone: "Personal, valuable, consistent", length: "200-500 words ideal", format: ["Subject line crucial", "Personal opener", "Single focus", "Clear CTA"], bestContent: ["Curated insights", "Personal stories", "Exclusive tips"] },
  { id: "blog", name: "Blog Post", tone: "Informative, SEO-aware, valuable", length: "1500-2500 words for SEO", format: ["H2/H3 structure", "Scannable", "Internal/external links", "Meta optimized"], bestContent: ["How-tos", "Guides", "Analysis", "Listicles"] },
  { id: "podcast", name: "Podcast", tone: "Conversational, in-depth, personal", length: "20-60 minutes typical", format: ["Strong intro hook", "Clear segments", "Guest interactions", "Call to action"], bestContent: ["Interviews", "Deep dives", "Commentary"] },
  { id: "pinterest", name: "Pinterest", tone: "Inspirational, actionable, visual", length: "500 characters description", format: ["Vertical images", "Text overlay", "SEO keywords", "Rich pins"], bestContent: ["How-tos", "Infographics", "Quotes", "Tutorials"] },
  { id: "medium", name: "Medium", tone: "Thoughtful, narrative, in-depth", length: "1000-2000 words", format: ["Strong headline", "Subheadings", "Personal voice", "Publication submission"], bestContent: ["Personal essays", "Industry analysis", "Stories"] },
  { id: "substack", name: "Substack", tone: "Personal, authoritative, consistent", length: "Varies by niche", format: ["Regular schedule", "Personal voice", "Community building", "Paid tiers"], bestContent: ["Deep analysis", "Personal insights", "Niche expertise"] },
  { id: "threads", name: "Threads", tone: "Conversational, community-focused", length: "500 characters", format: ["Conversational", "Reply engagement", "Cross-posting from IG"], bestContent: ["Quick thoughts", "Discussions", "Community building"] }
];

// Voice Guidelines - 10 brand voice dimensions
const VOICE_DIMENSIONS = [
  { id: "formal-casual", name: "Formality", spectrum: ["Formal/Professional", "Casual/Conversational"], questions: ["Are we in a boardroom or coffee shop?", "Do we use contractions?", "How do we address the reader?"] },
  { id: "serious-playful", name: "Tone", spectrum: ["Serious/Authoritative", "Playful/Humorous"], questions: ["Do we use humor?", "Is our subject matter inherently serious?", "What emotions do we want to evoke?"] },
  { id: "matter-of-fact-enthusiastic", name: "Energy", spectrum: ["Matter-of-fact/Reserved", "Enthusiastic/Passionate"], questions: ["How excited are we about topics?", "Do we use exclamation points?", "What's our energy level?"] },
  { id: "complex-simple", name: "Complexity", spectrum: ["Complex/Technical", "Simple/Accessible"], questions: ["What's our audience's expertise level?", "Do we use jargon?", "How do we explain concepts?"] },
  { id: "traditional-innovative", name: "Innovation", spectrum: ["Traditional/Classic", "Innovative/Cutting-edge"], questions: ["Are we preserving tradition or pushing boundaries?", "How do we position relative to competitors?"] },
  { id: "institutional-personal", name: "Personality", spectrum: ["Institutional/Corporate", "Personal/Individual"], questions: ["Do we say 'we' or 'I'?", "How much personality shows?", "Is there a distinct voice?"] },
  { id: "distant-intimate", name: "Distance", spectrum: ["Distant/Objective", "Intimate/Personal"], questions: ["How much do we share personally?", "Do we create emotional connection?", "What's our relationship with reader?"] },
  { id: "concise-expansive", name: "Verbosity", spectrum: ["Concise/Minimal", "Expansive/Detailed"], questions: ["Do we use short or long sentences?", "How much detail do we include?", "What's our word economy?"] },
  { id: "humble-confident", name: "Confidence", spectrum: ["Humble/Self-deprecating", "Confident/Assertive"], questions: ["How do we claim expertise?", "Do we acknowledge uncertainty?", "How do we handle disagreement?"] },
  { id: "neutral-opinionated", name: "Stance", spectrum: ["Neutral/Objective", "Opinionated/Advocacy"], questions: ["Do we take positions?", "How do we handle controversy?", "Are we advocates or reporters?"] }
];

// Routes
router.get("/frameworks", (_req, res) => {
  res.json({ success: true, data: CONTENT_FRAMEWORKS });
});

router.get("/frameworks/:id", (req, res) => {
  const framework = CONTENT_FRAMEWORKS.find(f => f.id === req.params.id);
  if (!framework) {
    return res.status(404).json({ success: false, error: "Framework not found" });
  }
  res.json({ success: true, data: framework });
});

router.get("/platforms", (_req, res) => {
  res.json({ success: true, data: PLATFORM_ADAPTATIONS });
});

router.get("/platforms/:id", (req, res) => {
  const platform = PLATFORM_ADAPTATIONS.find(p => p.id === req.params.id);
  if (!platform) {
    return res.status(404).json({ success: false, error: "Platform not found" });
  }
  res.json({ success: true, data: platform });
});

router.get("/voice-dimensions", (_req, res) => {
  res.json({ success: true, data: VOICE_DIMENSIONS });
});

router.get("/content-strategy", (_req, res) => {
  const today = new Date();
  const frameworkIndex = today.getDate() % CONTENT_FRAMEWORKS.length;
  const platformIndex = today.getDay(); // Different platform each day of week
  
  res.json({
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      suggestedFramework: CONTENT_FRAMEWORKS[frameworkIndex],
      platformFocus: PLATFORM_ADAPTATIONS[platformIndex % PLATFORM_ADAPTATIONS.length],
      prompt: `Create content using the ${CONTENT_FRAMEWORKS[frameworkIndex].name} framework optimized for ${PLATFORM_ADAPTATIONS[platformIndex % PLATFORM_ADAPTATIONS.length].name}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "content-intelligence", status: "operational", timestamp: new Date().toISOString() });
});

export default router;

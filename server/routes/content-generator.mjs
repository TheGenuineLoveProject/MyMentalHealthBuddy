import { Router } from "express";

const router = Router();

function generateBlogPost(input) {
  return {
    format: "blog",
    title: `${input.title || "Untitled"} | The Genuine Love Project`,
    content: input.content,
    metaDescription: input.content.substring(0, 155) + "...",
    seoKeywords: extractKeywords(input.content),
    wordCount: input.content.split(/\s+/).length
  };
}

function generateNewsletter(input) {
  const lines = input.content.split("\n").filter(l => l.trim());
  return {
    format: "newsletter",
    subject: `✨ ${input.title || "This Week's Reflection"}`,
    preview: lines[0]?.substring(0, 80) || "",
    greeting: "Hello, beautiful soul",
    body: input.content,
    callToAction: "What's one thing this sparked for you? Reply and let me know.",
    footer: "With genuine love,\nThe Genuine Love Project"
  };
}

function generateTwitterThread(input) {
  const sentences = input.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const tweets = [];
  tweets.push(`🧵 ${input.title || "A thread on healing"}\n\nLet me share something important...`);
  sentences.slice(0, 8).forEach((sentence, i) => {
    const cleaned = sentence.trim();
    if (cleaned.length > 10 && cleaned.length < 260) {
      tweets.push(`${i + 1}/ ${cleaned}`);
    }
  });
  tweets.push(`That's the thread.\n\nIf this resonated, save it for later.\n\nFollow @GenuineLoveProj for more on healing, growth, and genuine self-love. 💚`);
  return { format: "twitter_thread", tweets, tweetCount: tweets.length };
}

function generateLinkedInPost(input) {
  return {
    format: "linkedin",
    hook: `${input.title || "Here's what I've learned about healing"}`,
    body: `${input.content.substring(0, 1000)}\n\nWhat's your experience with this? I'd love to hear your perspective in the comments.`,
    hashtags: ["#mentalhealth", "#healing", "#personalgrowth", "#wellness", "#selflove"],
    callToAction: "Save this post if it resonated. Share with someone who needs it."
  };
}

function generateInstagramCarousel(input) {
  const points = input.content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 7);
  return {
    format: "instagram_carousel",
    slide1: { type: "cover", text: input.title || "A Gentle Reminder", designNote: "Use brand colors, serif font" },
    slides: points.map((point, i) => ({ slide: i + 2, text: point.trim(), designNote: "One point per slide, large text" })),
    finalSlide: { type: "cta", text: "Save this for later ✨\nFollow @genuineloveproject for more", designNote: "Include logo" },
    caption: `${input.content.substring(0, 200)}...\n\n.\n.\n.\n#healing #mentalhealth #selflove #therapy #wellness #growth #mindfulness #selfcare`,
    slideCount: points.length + 2
  };
}

function generateInstagramReelScript(input) {
  return {
    format: "instagram_reel",
    hook: `"${input.title || "This changed how I think about healing"}..."`,
    duration: "30-60 seconds",
    script: [
      { timing: "0-3s", action: "HOOK", text: `Open with: "${input.title}"` },
      { timing: "3-10s", action: "CONTEXT", text: "Share why this matters" },
      { timing: "10-25s", action: "MAIN POINT", text: input.content.substring(0, 200) },
      { timing: "25-30s", action: "CTA", text: "Follow for more healing insights" }
    ],
    audio: "Trending audio or calm background music",
    hashtags: "#healingjourney #mentalhealth #therapy #wellness"
  };
}

function generateYouTubeShortScript(input) {
  return {
    format: "youtube_short",
    title: input.title || "A perspective on healing",
    duration: "under 60 seconds",
    script: [
      { section: "hook", timing: "0-3s", text: `Here's something about ${input.title?.toLowerCase() || "healing"} most people don't realize...` },
      { section: "content", timing: "3-45s", text: input.content.substring(0, 300) },
      { section: "cta", timing: "45-60s", text: "Subscribe for more on genuine self-love and healing." }
    ],
    thumbnail: `Text overlay: "${input.title}" with contemplative imagery`
  };
}

function generatePinterestPin(input) {
  return {
    format: "pinterest",
    title: input.title || "Healing Wisdom",
    description: `${input.content.substring(0, 200)}... | The Genuine Love Project | Mental Wellness | Healing Journey | Self Love Tips`,
    boardSuggestions: ["Mental Health", "Self Care", "Healing", "Personal Growth", "Wellness"],
    designSpec: {
      ratio: "2:3 vertical",
      style: "Minimalist, calm colors, serif typography",
      elements: ["Quote or key takeaway", "Brand logo", "Website URL"]
    },
    altText: `Graphic with text: ${input.title}`
  };
}

function generateTikTokScript(input) {
  return {
    format: "tiktok",
    hook: `POV: You finally understand ${input.title?.toLowerCase() || "this about yourself"}`,
    duration: "15-60 seconds",
    script: [
      { timing: "0-3s", text: "Hook with relatable statement or question" },
      { timing: "3-20s", text: input.content.substring(0, 150) },
      { timing: "20-30s", text: "Takeaway or gentle challenge" }
    ],
    trendTips: "Use trending sounds. Keep it authentic and conversational.",
    hashtags: "#therapy #mentalhealth #healing #fyp #selflove"
  };
}

function generateQuoteCard(input) {
  const sentences = input.content.split(/[.!?]+/).filter(s => s.trim().length > 20 && s.trim().length < 120);
  const bestQuote = sentences[0] || input.title || "Healing is not linear.";
  return {
    format: "quote_card",
    quote: bestQuote.trim(),
    attribution: "— The Genuine Love Project",
    designSpec: {
      background: "Soft gradient or minimal texture",
      typography: "Serif for quote, sans-serif for attribution",
      size: "1080x1080 for Instagram, 1200x628 for Twitter/LinkedIn"
    },
    usage: ["Instagram feed", "Twitter", "LinkedIn", "Pinterest", "Email signature"]
  };
}

function extractKeywords(content) {
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const frequency = {};
  words.forEach(w => { frequency[w] = (frequency[w] || 0) + 1; });
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

router.post("/generate", (req, res) => {
  const { title, content, formats } = req.body || {};
  
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ ok: false, error: "Content is required and must be a string" });
  }
  
  if (content.trim().length < 50) {
    return res.status(400).json({ ok: false, error: "Content must be at least 50 characters", currentLength: content.trim().length });
  }
  
  const input = { title: (title && typeof title === 'string') ? title : "Untitled", content: content.trim() };
  const allFormats = ["blog", "newsletter", "twitter", "linkedin", "instagram_carousel", "instagram_reel", "youtube_short", "pinterest", "tiktok", "quote_card"];
  
  let selectedFormats = allFormats;
  if (formats && Array.isArray(formats) && formats.length > 0) {
    const validFormats = formats.filter(f => allFormats.includes(f));
    const invalidFormats = formats.filter(f => !allFormats.includes(f));
    if (invalidFormats.length > 0) {
      return res.status(400).json({ ok: false, error: "Invalid format(s) requested", invalidFormats, validFormats: allFormats });
    }
    selectedFormats = validFormats;
  }
  
  const outputs = {};
  
  if (selectedFormats.includes("blog")) outputs.blog = generateBlogPost(input);
  if (selectedFormats.includes("newsletter")) outputs.newsletter = generateNewsletter(input);
  if (selectedFormats.includes("twitter")) outputs.twitter = generateTwitterThread(input);
  if (selectedFormats.includes("linkedin")) outputs.linkedin = generateLinkedInPost(input);
  if (selectedFormats.includes("instagram_carousel")) outputs.instagram_carousel = generateInstagramCarousel(input);
  if (selectedFormats.includes("instagram_reel")) outputs.instagram_reel = generateInstagramReelScript(input);
  if (selectedFormats.includes("youtube_short")) outputs.youtube_short = generateYouTubeShortScript(input);
  if (selectedFormats.includes("pinterest")) outputs.pinterest = generatePinterestPin(input);
  if (selectedFormats.includes("tiktok")) outputs.tiktok = generateTikTokScript(input);
  if (selectedFormats.includes("quote_card")) outputs.quote_card = generateQuoteCard(input);
  
  res.json({
    ok: true,
    input: { title: input.title, contentLength: content.length },
    outputCount: Object.keys(outputs).length,
    outputs
  });
});

router.get("/formats", (req, res) => {
  res.json({
    ok: true,
    formats: [
      { id: "blog", name: "Blog Post", description: "SEO-optimized article format" },
      { id: "newsletter", name: "Newsletter", description: "Email newsletter version" },
      { id: "twitter", name: "Twitter/X Thread", description: "Thread format for X/Twitter" },
      { id: "linkedin", name: "LinkedIn Post", description: "Professional network post" },
      { id: "instagram_carousel", name: "Instagram Carousel", description: "Multi-slide Instagram post" },
      { id: "instagram_reel", name: "Instagram Reel Script", description: "Short-form video script" },
      { id: "youtube_short", name: "YouTube Short Script", description: "Under 60 second video" },
      { id: "pinterest", name: "Pinterest Pin", description: "Pin with description" },
      { id: "tiktok", name: "TikTok Script", description: "TikTok video script" },
      { id: "quote_card", name: "Quote Card", description: "Shareable quote graphic" }
    ]
  });
});

const drafts = [];

router.get("/drafts", (req, res) => {
  res.json({ ok: true, drafts });
});

router.post("/drafts", (req, res) => {
  const { title, sourceContent, outputs } = req.body || {};
  
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ ok: false, error: "Title is required" });
  }
  if (!sourceContent || typeof sourceContent !== 'string') {
    return res.status(400).json({ ok: false, error: "Source content is required" });
  }
  
  const draft = {
    id: `draft-${Date.now()}`,
    title,
    sourceContent,
    outputs: outputs || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  drafts.push(draft);
  
  res.json({ ok: true, draft });
});

export default router;

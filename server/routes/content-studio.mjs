import { Router } from "express";

const router = Router();

function extractKeywords(text) {
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "and", "but", "if", "or", "because", "until", "while", "this", "that", "these", "those", "what", "which", "who", "whom", "whose", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves"]);
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freq = {};
  words.filter(w => !stopWords.has(w)).forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word]) => word);
}

const PODCAST_TEMPLATES = {
  solo: {
    name: "Solo Episode",
    structure: [
      { segment: "Hook", duration: "30s-1min", description: "Compelling question or statement" },
      { segment: "Intro", duration: "1-2min", description: "Welcome, theme introduction" },
      { segment: "Main Content", duration: "15-25min", description: "Core teaching with 3-5 key points" },
      { segment: "Story/Example", duration: "3-5min", description: "Personal anecdote or case study" },
      { segment: "Actionable Takeaway", duration: "2-3min", description: "Specific steps listener can take" },
      { segment: "Outro", duration: "1min", description: "Recap, CTA, preview next episode" }
    ]
  },
  interview: {
    name: "Interview Episode",
    structure: [
      { segment: "Teaser", duration: "30s", description: "Best quote from interview" },
      { segment: "Host Intro", duration: "1min", description: "Welcome, guest introduction" },
      { segment: "Guest Story", duration: "5-7min", description: "Origin story, how they got here" },
      { segment: "Core Discussion", duration: "20-30min", description: "Main topic exploration" },
      { segment: "Rapid Fire", duration: "3-5min", description: "Quick questions, lighter tone" },
      { segment: "Final Question", duration: "2-3min", description: "Best advice or key insight" },
      { segment: "Outro", duration: "1min", description: "Where to find guest, next week preview" }
    ]
  }
};

const YOUTUBE_TEMPLATES = {
  educational: {
    name: "Educational Video",
    structure: [
      { segment: "Hook", duration: "0-15s", description: "Pattern interrupt, bold statement" },
      { segment: "Problem", duration: "15-60s", description: "Identify pain point/question" },
      { segment: "Credibility", duration: "30-45s", description: "Why should they listen to you" },
      { segment: "Content Preview", duration: "15-30s", description: "What they'll learn" },
      { segment: "Main Teaching", duration: "5-15min", description: "3-7 key points with examples" },
      { segment: "Summary", duration: "30-60s", description: "Recap main points" },
      { segment: "CTA", duration: "15-30s", description: "Like, subscribe, comment, next video" }
    ]
  },
  shortForm: {
    name: "YouTube Shorts",
    duration: "60 seconds max",
    structure: [
      { segment: "Hook", duration: "0-3s", description: "Immediate attention grab" },
      { segment: "One Big Idea", duration: "3-45s", description: "Single powerful concept" },
      { segment: "Payoff", duration: "45-60s", description: "Key insight or surprising conclusion" }
    ]
  }
};

const BOOK_OUTLINE_TEMPLATE = {
  nonfiction: {
    name: "Non-Fiction Book Structure",
    sections: [
      { section: "Front Matter", elements: ["Title Page", "Dedication", "Foreword", "Introduction"] },
      { section: "Part I: Foundation", description: "Establish the problem and your approach", suggestedChapters: 3 },
      { section: "Part II: Core Content", description: "Main teaching, methodology, framework", suggestedChapters: 5 },
      { section: "Part III: Application", description: "Case studies, examples, implementation", suggestedChapters: 3 },
      { section: "Part IV: Integration", description: "Putting it all together, next steps", suggestedChapters: 2 },
      { section: "Back Matter", elements: ["Conclusion", "Resources", "Acknowledgments", "About Author", "Index"] }
    ],
    chapterStructure: [
      "Opening hook/story",
      "Main concept introduction",
      "Supporting evidence/research",
      "Practical examples",
      "Exercises or reflection questions",
      "Chapter summary",
      "Transition to next chapter"
    ]
  }
};

const COURSE_TEMPLATE = {
  structure: {
    name: "Online Course Structure",
    modules: [
      { module: 1, name: "Foundation", description: "Core concepts and mindset shifts", lessons: 3 },
      { module: 2, name: "Core Skill 1", description: "First major skill area", lessons: 4 },
      { module: 3, name: "Core Skill 2", description: "Second major skill area", lessons: 4 },
      { module: 4, name: "Core Skill 3", description: "Third major skill area", lessons: 4 },
      { module: 5, name: "Integration", description: "Putting it all together", lessons: 3 },
      { module: 6, name: "Advanced/Bonus", description: "Extra content for committed students", lessons: 2 }
    ],
    lessonStructure: [
      { element: "Learning Objective", description: "What student will be able to do" },
      { element: "Video Content", duration: "5-15 minutes", description: "Core teaching" },
      { element: "Written Summary", description: "Key points in text form" },
      { element: "Exercise/Worksheet", description: "Practical application" },
      { element: "Quiz/Check-in", description: "Verify understanding" }
    ]
  }
};

const PRESENTATION_TEMPLATES = {
  ted: {
    name: "TED-Style Talk",
    duration: "12-18 minutes",
    structure: [
      { phase: "Hook", duration: "1min", description: "Story, question, or bold statement" },
      { phase: "Context", duration: "2min", description: "Why this matters now" },
      { phase: "One Big Idea", duration: "1min", description: "The central thesis" },
      { phase: "Journey", duration: "8-12min", description: "3 supporting points with stories" },
      { phase: "Call to Action", duration: "1-2min", description: "What audience should do" },
      { phase: "Memorable Close", duration: "30s", description: "Circle back to opening, end strong" }
    ]
  },
  keynote: {
    name: "Keynote Presentation",
    duration: "30-45 minutes",
    structure: [
      { phase: "Opening", duration: "3-5min", description: "Attention, credibility, preview" },
      { phase: "Body Point 1", duration: "8-10min", description: "First major theme" },
      { phase: "Body Point 2", duration: "8-10min", description: "Second major theme" },
      { phase: "Body Point 3", duration: "8-10min", description: "Third major theme" },
      { phase: "Q&A", duration: "5-10min", description: "Audience interaction" },
      { phase: "Close", duration: "2-3min", description: "Summary and call to action" }
    ]
  }
};

function generatePodcastScript(input) {
  const template = PODCAST_TEMPLATES[input.type || "solo"];
  return {
    format: "podcast",
    type: input.type || "solo",
    title: input.title,
    template: template,
    script: {
      hook: `"${input.content.split('.')[0]}..."`,
      mainPoints: input.content.split('.').filter(s => s.trim().length > 20).slice(0, 5).map((point, i) => ({
        point: i + 1,
        content: point.trim()
      })),
      callToAction: "If this episode resonated with you, take a screenshot and share it on social media. Tag @GenuineLoveProject so I can thank you personally."
    }
  };
}

function generateYouTubeScript(input) {
  const isShort = input.format === "short";
  const template = isShort ? YOUTUBE_TEMPLATES.shortForm : YOUTUBE_TEMPLATES.educational;
  const content = input.content;
  
  return {
    format: isShort ? "youtube_short" : "youtube_video",
    title: input.title,
    template: template,
    script: {
      hook: `HOOK: "${content.split('.')[0]}"`,
      thumbnail: {
        text: input.title?.substring(0, 30) || "Untitled",
        expression: "curious/excited",
        style: "bold text, high contrast"
      },
      mainContent: content.split('.').filter(s => s.trim().length > 20).slice(0, isShort ? 2 : 7).map((point, i) => ({
        timestamp: isShort ? `${i * 15}s` : `${i * 2}:00`,
        point: point.trim()
      })),
      endScreen: {
        cta: "If you found this helpful, smash that like button and subscribe for more",
        suggested: "Watch this video next for [related topic]"
      }
    },
    seo: {
      keywords: extractKeywords(content),
      tags: ["healing", "self-improvement", "mental health", "wellness", "personal growth"]
    }
  };
}

function generateBookOutline(input) {
  const chapters = input.content.split('.').filter(s => s.trim().length > 30).slice(0, 12);
  
  return {
    format: "book_outline",
    title: input.title,
    subtitle: `A Guide to ${input.title}`,
    template: BOOK_OUTLINE_TEMPLATE.nonfiction,
    outline: {
      introduction: {
        hook: chapters[0]?.trim() || "Opening hook",
        problem: "The challenge readers face",
        promise: "What this book will deliver",
        preview: "Overview of book structure"
      },
      chapters: chapters.map((chapter, i) => ({
        number: i + 1,
        title: `Chapter ${i + 1}`,
        mainIdea: chapter.trim(),
        subpoints: 3,
        estimatedLength: "15-20 pages"
      })),
      conclusion: {
        summary: "Key takeaways",
        callToAction: "Next steps for reader",
        resources: "Where to go for more"
      }
    },
    publishing: {
      estimatedWordCount: chapters.length * 5000,
      estimatedPages: chapters.length * 15,
      targetAudience: "Personal development enthusiasts"
    }
  };
}

function generateCourseOutline(input) {
  const lessons = input.content.split('.').filter(s => s.trim().length > 20).slice(0, 20);
  const modulesCount = Math.ceil(lessons.length / 4);
  
  return {
    format: "course_outline",
    title: input.title,
    template: COURSE_TEMPLATE,
    structure: {
      totalModules: modulesCount,
      totalLessons: lessons.length,
      estimatedDuration: `${lessons.length * 15} minutes`,
      modules: Array.from({ length: modulesCount }, (_, i) => ({
        module: i + 1,
        title: `Module ${i + 1}`,
        lessons: lessons.slice(i * 4, (i + 1) * 4).map((lesson, j) => ({
          lesson: j + 1,
          title: lesson.trim().substring(0, 50),
          duration: "10-15 min",
          hasWorksheet: true
        }))
      }))
    },
    deliverables: {
      videos: lessons.length,
      worksheets: lessons.length,
      quizzes: modulesCount,
      bonusMaterials: 3
    }
  };
}

function generatePresentation(input) {
  const template = PRESENTATION_TEMPLATES[input.type || "ted"];
  const points = input.content.split('.').filter(s => s.trim().length > 20).slice(0, 5);
  
  return {
    format: "presentation",
    type: input.type || "ted",
    title: input.title,
    template: template,
    slides: [
      { slide: 1, type: "title", content: input.title },
      { slide: 2, type: "hook", content: points[0]?.trim() || "Opening hook" },
      ...points.slice(1).map((point, i) => ({
        slide: i + 3,
        type: "content",
        headline: `Key Point ${i + 1}`,
        content: point.trim()
      })),
      { slide: points.length + 3, type: "summary", content: "Key Takeaways" },
      { slide: points.length + 4, type: "cta", content: "Your Next Step" }
    ],
    speakerNotes: {
      openingStory: "Personal anecdote that connects to theme",
      transitions: "Smooth bridges between sections",
      closingMoment: "Powerful ending that circles back"
    }
  };
}

router.post("/generate/podcast", (req, res) => {
  const { title, content, type } = req.body;
  if (!content) return res.status(400).json({ success: false, error: "Content is required" });
  res.json({ success: true, data: generatePodcastScript({ title, content, type }) });
});

router.post("/generate/youtube", (req, res) => {
  const { title, content, format } = req.body;
  if (!content) return res.status(400).json({ success: false, error: "Content is required" });
  res.json({ success: true, data: generateYouTubeScript({ title, content, format }) });
});

router.post("/generate/book", (req, res) => {
  const { title, content } = req.body;
  if (!content) return res.status(400).json({ success: false, error: "Content is required" });
  res.json({ success: true, data: generateBookOutline({ title, content }) });
});

router.post("/generate/course", (req, res) => {
  const { title, content } = req.body;
  if (!content) return res.status(400).json({ success: false, error: "Content is required" });
  res.json({ success: true, data: generateCourseOutline({ title, content }) });
});

router.post("/generate/presentation", (req, res) => {
  const { title, content, type } = req.body;
  if (!content) return res.status(400).json({ success: false, error: "Content is required" });
  res.json({ success: true, data: generatePresentation({ title, content, type }) });
});

router.get("/templates/podcast", (_req, res) => {
  res.json({ success: true, data: PODCAST_TEMPLATES });
});

router.get("/templates/youtube", (_req, res) => {
  res.json({ success: true, data: YOUTUBE_TEMPLATES });
});

router.get("/templates/book", (_req, res) => {
  res.json({ success: true, data: BOOK_OUTLINE_TEMPLATE });
});

router.get("/templates/course", (_req, res) => {
  res.json({ success: true, data: COURSE_TEMPLATE });
});

router.get("/templates/presentation", (_req, res) => {
  res.json({ success: true, data: PRESENTATION_TEMPLATES });
});

router.get("/templates/all", (_req, res) => {
  res.json({
    success: true,
    data: {
      podcast: PODCAST_TEMPLATES,
      youtube: YOUTUBE_TEMPLATES,
      book: BOOK_OUTLINE_TEMPLATE,
      course: COURSE_TEMPLATE,
      presentation: PRESENTATION_TEMPLATES
    }
  });
});

export default router;

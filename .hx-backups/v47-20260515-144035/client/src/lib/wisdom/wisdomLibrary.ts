export interface WisdomEntry {
  id: string;
  category: "philosophy" | "psychology" | "systems" | "spirituality" | "science";
  tradition: string;
  insight: string;
  question: string;
  source?: string;
}

export const WISDOM_LIBRARY: WisdomEntry[] = [
  {
    id: "stoic-1",
    category: "philosophy",
    tradition: "Stoicism",
    insight: "We suffer more in imagination than in reality.",
    question: "What fear in your mind has not yet materialized in your life?",
    source: "Seneca"
  },
  {
    id: "buddhist-1",
    category: "spirituality",
    tradition: "Buddhism",
    insight: "Pain is inevitable; suffering is optional.",
    question: "Where might you be adding story to sensation?",
    source: "Attributed"
  },
  {
    id: "cbt-1",
    category: "psychology",
    tradition: "Cognitive Science",
    insight: "The map is not the territory; thoughts are not facts.",
    question: "Which thought have you been treating as absolute truth?",
    source: "Alfred Korzybski"
  },
  {
    id: "systems-1",
    category: "systems",
    tradition: "Systems Thinking",
    insight: "Every system is perfectly designed to get the results it gets.",
    question: "What results are your current patterns producing?",
    source: "W. Edwards Deming"
  },
  {
    id: "neuro-1",
    category: "science",
    tradition: "Neuroscience",
    insight: "The brain cannot distinguish between real and vividly imagined experiences.",
    question: "What version of events are you rehearsing in your mind?",
    source: "Neuroplasticity Research"
  },
  {
    id: "existential-1",
    category: "philosophy",
    tradition: "Existentialism",
    insight: "You are not your thoughts; you are the awareness noticing them.",
    question: "If you are the observer, who is being observed?",
    source: "Eckhart Tolle"
  },
  {
    id: "polyvagal-1",
    category: "science",
    tradition: "Polyvagal Theory",
    insight: "Safety is not the absence of threat; it's the presence of connection.",
    question: "Where in your body do you feel safety? Where do you feel alert?",
    source: "Stephen Porges"
  },
  {
    id: "act-1",
    category: "psychology",
    tradition: "ACT Therapy",
    insight: "Struggle with emotions often increases their intensity.",
    question: "What would happen if you made room for this feeling instead of fighting it?",
    source: "Steven Hayes"
  },
  {
    id: "tao-1",
    category: "spirituality",
    tradition: "Taoism",
    insight: "By letting go, it all gets done.",
    question: "What are you holding too tightly?",
    source: "Tao Te Ching"
  },
  {
    id: "ifs-1",
    category: "psychology",
    tradition: "Internal Family Systems",
    insight: "Every part of you has a positive intention, even the ones that hurt.",
    question: "What is this difficult feeling trying to protect you from?",
    source: "Richard Schwartz"
  },
  {
    id: "somatic-1",
    category: "science",
    tradition: "Somatic Psychology",
    insight: "The body keeps the score of every experience.",
    question: "Where do you carry today's tension? Where do you carry old tension?",
    source: "Bessel van der Kolk"
  },
  {
    id: "logotherapy-1",
    category: "psychology",
    tradition: "Logotherapy",
    insight: "Those who have a 'why' to live can bear almost any 'how'.",
    question: "What meaning can you find in this difficult moment?",
    source: "Viktor Frankl"
  },
  {
    id: "attachment-1",
    category: "psychology",
    tradition: "Attachment Theory",
    insight: "We repeat in relationship what we didn't repair in origin.",
    question: "What patterns from your past are showing up in your present?",
    source: "John Bowlby"
  },
  {
    id: "zen-1",
    category: "spirituality",
    tradition: "Zen Buddhism",
    insight: "Before enlightenment: chop wood, carry water. After enlightenment: chop wood, carry water.",
    question: "How might ordinary moments contain everything you're seeking?",
    source: "Zen Proverb"
  },
  {
    id: "complexity-1",
    category: "systems",
    tradition: "Complexity Science",
    insight: "In complex systems, small changes can create large effects.",
    question: "What tiny shift could create unexpected ripples in your life?",
    source: "Santa Fe Institute"
  },
  {
    id: "jungian-1",
    category: "psychology",
    tradition: "Depth Psychology",
    insight: "What you resist persists; what you look at transforms.",
    question: "What are you avoiding looking at directly?",
    source: "Carl Jung"
  },
];

export function getRandomWisdom(seed?: number): WisdomEntry {
  const idx = seed !== undefined
    ? Math.abs(seed) % WISDOM_LIBRARY.length
    : Math.floor(Math.random() * WISDOM_LIBRARY.length);
  return WISDOM_LIBRARY[idx];
}

export function getWisdomByCategory(category: WisdomEntry["category"]): WisdomEntry[] {
  return WISDOM_LIBRARY.filter(w => w.category === category);
}

export function getDailyWisdom(): WisdomEntry {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return WISDOM_LIBRARY[dayOfYear % WISDOM_LIBRARY.length];
}

export interface WisdomTradition {
  id: string;
  name: string;
  origin: string;
  era: string;
  coreInsight: string;
  keyFigures: string[];
  questions: string[];
  practices: string[];
}

export const WISDOM_TRADITIONS: WisdomTradition[] = [
  {
    id: "stoicism",
    name: "Stoicism",
    origin: "Ancient Greece/Rome",
    era: "3rd century BCE - 2nd century CE",
    coreInsight: "Focus only on what you can control; accept with equanimity what you cannot.",
    keyFigures: ["Marcus Aurelius", "Epictetus", "Seneca"],
    questions: [
      "What is within my control in this situation?",
      "What would I advise a friend in this circumstance?",
      "What is the worst that could happen, and could I survive it?",
      "Am I upset by the event itself, or by my judgment of the event?",
      "What would my ideal self do here?"
    ],
    practices: ["Morning reflection", "Evening review", "Negative visualization", "View from above"]
  },
  {
    id: "zen",
    name: "Zen Buddhism",
    origin: "China/Japan",
    era: "6th century CE - present",
    coreInsight: "Direct experience of reality, beyond conceptual thinking. The path is the goal.",
    keyFigures: ["Bodhidharma", "Dogen", "Thich Nhat Hanh"],
    questions: [
      "What is this moment, before I label it?",
      "Who is the one asking this question?",
      "What was your original face before your parents were born?",
      "If not now, when?",
      "What remains when you stop seeking?"
    ],
    practices: ["Zazen (sitting meditation)", "Kinhin (walking meditation)", "Koan contemplation", "Mindful breathing"]
  },
  {
    id: "vedanta",
    name: "Advaita Vedanta",
    origin: "India",
    era: "8th century CE - present",
    coreInsight: "The individual self (Atman) and universal consciousness (Brahman) are one.",
    keyFigures: ["Adi Shankara", "Ramana Maharshi", "Nisargadatta Maharaj"],
    questions: [
      "Who am I beyond my thoughts and emotions?",
      "To whom do these thoughts appear?",
      "What remains constant through all experiences?",
      "What is aware of awareness itself?",
      "If I am not my body or mind, what am I?"
    ],
    practices: ["Self-inquiry (Atma Vichara)", "Witness practice", "Neti neti (not this, not this)", "Abidance as awareness"]
  },
  {
    id: "taoism",
    name: "Taoism",
    origin: "China",
    era: "6th century BCE - present",
    coreInsight: "Align with the natural flow of existence. Wu wei — effortless action through non-resistance.",
    keyFigures: ["Laozi", "Zhuangzi", "Liezi"],
    questions: [
      "What would happen if I stopped pushing?",
      "How is nature already solving this problem?",
      "Where am I forcing instead of flowing?",
      "What is the softest response to this hardness?",
      "What would effortless action look like here?"
    ],
    practices: ["Wu wei contemplation", "Nature immersion", "Yin-yang balance inquiry", "Spontaneity practice"]
  },
  {
    id: "existentialism",
    name: "Existentialism",
    origin: "Europe",
    era: "19th-20th century",
    coreInsight: "Existence precedes essence. You create meaning through authentic choice.",
    keyFigures: ["Kierkegaard", "Sartre", "Camus", "de Beauvoir"],
    questions: [
      "What am I choosing by not choosing?",
      "What would I do if I fully accepted my freedom?",
      "What meaning am I creating through my actions today?",
      "Am I living authentically or playing a role?",
      "What would I regret not doing with my finite time?"
    ],
    practices: ["Radical honesty", "Choice awareness", "Confronting mortality", "Authentic action"]
  },
  {
    id: "sufism",
    name: "Sufism",
    origin: "Middle East/Persia",
    era: "8th century CE - present",
    coreInsight: "The heart is the seat of divine knowledge. Love is the path to truth.",
    keyFigures: ["Rumi", "Hafiz", "Ibn Arabi", "Al-Ghazali"],
    questions: [
      "What is my heart trying to tell me?",
      "Where is love calling me to go?",
      "What am I longing for beneath the longing?",
      "How can I see the Beloved in this difficulty?",
      "What would it mean to polish the mirror of my heart?"
    ],
    practices: ["Heart meditation", "Sacred poetry contemplation", "Remembrance (dhikr)", "Devotional practice"]
  },
  {
    id: "indigenous",
    name: "Indigenous Wisdom",
    origin: "Global",
    era: "Timeless",
    coreInsight: "All beings are interconnected. We are part of nature, not separate from it.",
    keyFigures: ["Various traditions", "Oral lineages", "Elder teachings"],
    questions: [
      "How will this choice affect seven generations forward?",
      "What are my ancestors asking of me?",
      "How am I relating to the land I stand on?",
      "What does reciprocity look like in this situation?",
      "What wisdom does this challenge carry?"
    ],
    practices: ["Gratitude practice", "Connection to land", "Honoring cycles", "Community wisdom circles"]
  },
  {
    id: "psychology",
    name: "Depth Psychology",
    origin: "Europe/Global",
    era: "20th century - present",
    coreInsight: "The unconscious shapes behavior. Integration of shadow leads to wholeness.",
    keyFigures: ["Jung", "Freud", "Hillman", "Marie-Louise von Franz"],
    questions: [
      "What am I projecting onto others?",
      "What aspect of myself am I rejecting?",
      "What is my shadow trying to teach me?",
      "What archetype is active in my life now?",
      "What dream images want my attention?"
    ],
    practices: ["Dream journaling", "Active imagination", "Shadow work", "Symbolic exploration"]
  },
  {
    id: "buddhism",
    name: "Core Buddhism",
    origin: "India",
    era: "5th century BCE - present",
    coreInsight: "Suffering arises from attachment. Liberation comes through seeing clearly.",
    keyFigures: ["Gautama Buddha", "Nagarjuna", "Thich Nhat Hanh", "Pema Chödrön"],
    questions: [
      "What am I clinging to that causes suffering?",
      "What is arising right now, and is it permanent?",
      "Where am I resisting what is?",
      "What would compassion look like — for myself and others?",
      "What is the middle way in this situation?"
    ],
    practices: ["Vipassana meditation", "Loving-kindness practice", "Impermanence contemplation", "Noble truths reflection"]
  },
  {
    id: "phenomenology",
    name: "Phenomenology",
    origin: "Germany",
    era: "20th century",
    coreInsight: "Return to direct experience. Bracket assumptions to see what truly appears.",
    keyFigures: ["Husserl", "Heidegger", "Merleau-Ponty"],
    questions: [
      "What am I actually experiencing right now, before interpretation?",
      "What assumptions am I bringing to this perception?",
      "How does this feel in my body, specifically?",
      "What is the lived quality of this moment?",
      "What would I notice if I saw this for the first time?"
    ],
    practices: ["Epoché (bracketing)", "Embodied awareness", "Description without interpretation", "First-person inquiry"]
  },
  {
    id: "systems",
    name: "Systems Thinking",
    origin: "Global/Scientific",
    era: "20th century - present",
    coreInsight: "Everything is connected. Patterns repeat across scales. Emergence creates novelty.",
    keyFigures: ["Bateson", "Meadows", "Capra", "Senge"],
    questions: [
      "What larger system is this pattern part of?",
      "What feedback loops are at play here?",
      "What would shift if I changed my relationship to the system?",
      "Where is leverage in this situation?",
      "What is trying to emerge?"
    ],
    practices: ["Causal loop mapping", "Perspective taking", "Leverage point identification", "Emergence awareness"]
  },
  {
    id: "contemplative",
    name: "Christian Contemplative",
    origin: "Middle East/Europe",
    era: "4th century CE - present",
    coreInsight: "Stillness reveals the divine within. Kenosis — self-emptying — opens to grace.",
    keyFigures: ["Meister Eckhart", "Thomas Merton", "Julian of Norwich", "Richard Rohr"],
    questions: [
      "Where is the sacred in this ordinary moment?",
      "What am I being invited to release?",
      "How is grace appearing in this difficulty?",
      "What would it mean to fully trust the process?",
      "What is the still, small voice saying?"
    ],
    practices: ["Centering prayer", "Lectio Divina", "Examen", "Contemplative silence"]
  }
];

export interface AtlasPath {
  id: string;
  traditionId: string;
  startedAt: string;
  progress: number[];
  reflections: { questionIndex: number; response: string; timestamp: string }[];
  completed: boolean;
}

export function getTradition(id: string): WisdomTradition | undefined {
  return WISDOM_TRADITIONS.find(t => t.id === id);
}

export function getRandomTradition(): WisdomTradition {
  return WISDOM_TRADITIONS[Math.floor(Math.random() * WISDOM_TRADITIONS.length)];
}

export function getDailyTradition(): WisdomTradition {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return WISDOM_TRADITIONS[dayOfYear % WISDOM_TRADITIONS.length];
}

export function saveAtlasPath(path: AtlasPath): void {
  const key = "glp_atlas_paths";
  const existing: AtlasPath[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  const idx = existing.findIndex(p => p.id === path.id);
  if (idx >= 0) {
    existing[idx] = path;
  } else {
    existing.unshift(path);
  }
  try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 50))); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getAtlasPaths(): AtlasPath[] {
  return ((()=>{try{return JSON.parse(localStorage.getItem("glp_atlas_paths") || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}

export function createAtlasPath(traditionId: string): AtlasPath {
  return {
    id: `path_${Date.now()}`,
    traditionId,
    startedAt: new Date().toISOString(),
    progress: [],
    reflections: [],
    completed: false
  };
}

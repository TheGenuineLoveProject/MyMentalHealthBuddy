// server/routes/wisdom-traditions.mjs
// Comprehensive wisdom traditions and ancient knowledge API

import express from "express";
const router = express.Router();

const WISDOM_TRADITIONS = [
  {
    id: "stoicism",
    name: "Stoicism",
    origin: "Ancient Greece/Rome",
    founders: ["Zeno of Citium", "Marcus Aurelius", "Epictetus", "Seneca"],
    corePrinciples: [
      "Focus on what you can control",
      "Virtue is the highest good",
      "Accept fate with equanimity",
      "Live according to nature and reason"
    ],
    practices: ["Morning reflection", "Evening review", "Negative visualization", "View from above"],
    keyTexts: ["Meditations", "Letters from a Stoic", "Enchiridion", "Discourses"]
  },
  {
    id: "buddhism",
    name: "Buddhism",
    origin: "Ancient India",
    founders: ["Siddhartha Gautama (Buddha)"],
    corePrinciples: [
      "Four Noble Truths",
      "Eightfold Path",
      "Impermanence (Anicca)",
      "Non-self (Anatta)",
      "Suffering (Dukkha)"
    ],
    practices: ["Meditation", "Mindfulness", "Compassion cultivation", "Ethical conduct"],
    keyTexts: ["Dhammapada", "Heart Sutra", "Tibetan Book of the Dead"]
  },
  {
    id: "taoism",
    name: "Taoism",
    origin: "Ancient China",
    founders: ["Laozi", "Zhuangzi"],
    corePrinciples: [
      "Wu Wei (non-action/effortless action)",
      "Harmony with nature",
      "Simplicity and spontaneity",
      "Balance of yin and yang"
    ],
    practices: ["Tai Chi", "Qigong", "Nature contemplation", "Non-striving"],
    keyTexts: ["Tao Te Ching", "Zhuangzi", "I Ching"]
  },
  {
    id: "vedanta",
    name: "Vedanta",
    origin: "Ancient India",
    founders: ["Adi Shankara", "Ramana Maharshi"],
    corePrinciples: [
      "Brahman (ultimate reality)",
      "Atman (true self)",
      "Maya (illusion)",
      "Moksha (liberation)"
    ],
    practices: ["Self-inquiry", "Jnana yoga", "Meditation on 'I am'", "Study of scriptures"],
    keyTexts: ["Upanishads", "Bhagavad Gita", "Brahma Sutras"]
  },
  {
    id: "sufism",
    name: "Sufism",
    origin: "Islamic mysticism",
    founders: ["Rumi", "Ibn Arabi", "Al-Ghazali"],
    corePrinciples: [
      "Divine love",
      "Union with the Beloved",
      "Ego annihilation (fana)",
      "Spiritual stations (maqamat)"
    ],
    practices: ["Dhikr (remembrance)", "Whirling", "Poetry", "Music (sama)"],
    keyTexts: ["Masnavi", "Conference of the Birds", "The Alchemy of Happiness"]
  },
  {
    id: "kabbalah",
    name: "Kabbalah",
    origin: "Jewish mysticism",
    founders: ["Isaac Luria", "Moses de León"],
    corePrinciples: [
      "Tree of Life (Sefirot)",
      "Ein Sof (Infinite)",
      "Tikkun (repair)",
      "Divine sparks"
    ],
    practices: ["Meditation on Hebrew letters", "Prayer", "Study", "Ethical living"],
    keyTexts: ["Zohar", "Sefer Yetzirah", "Tree of Life"]
  }
];

const PERENNIAL_TRUTHS = [
  {
    id: "unity",
    name: "Unity of Being",
    description: "All existence is ultimately one interconnected reality",
    traditions: ["Vedanta", "Sufism", "Buddhism", "Taoism"]
  },
  {
    id: "ego-transcendence",
    name: "Ego Transcendence",
    description: "True freedom comes from transcending the separate self",
    traditions: ["Buddhism", "Vedanta", "Christian mysticism", "Sufism"]
  },
  {
    id: "present-moment",
    name: "Present Moment Awareness",
    description: "Reality can only be accessed in the eternal now",
    traditions: ["Zen", "Eckhart", "Stoicism", "Taoism"]
  },
  {
    id: "compassion",
    name: "Universal Compassion",
    description: "Love and compassion are the highest expressions of wisdom",
    traditions: ["Buddhism", "Christianity", "Sufism", "Judaism"]
  },
  {
    id: "inner-transformation",
    name: "Inner Transformation",
    description: "Outer change follows inner transformation",
    traditions: ["All traditions"]
  }
];

const MEDITATION_LINEAGES = [
  {
    id: "vipassana",
    name: "Vipassana",
    tradition: "Theravada Buddhism",
    focus: "Insight into impermanence through body scanning",
    techniques: ["Body scanning", "Breath awareness", "Noting"]
  },
  {
    id: "zen",
    name: "Zen/Chan",
    tradition: "Mahayana Buddhism",
    focus: "Direct pointing to mind's true nature",
    techniques: ["Zazen", "Koan practice", "Walking meditation"]
  },
  {
    id: "dzogchen",
    name: "Dzogchen",
    tradition: "Tibetan Buddhism",
    focus: "Recognition of rigpa (pure awareness)",
    techniques: ["Sky gazing", "Direct introduction", "Trekchö"]
  },
  {
    id: "tm",
    name: "Transcendental Meditation",
    tradition: "Vedic",
    focus: "Effortless transcending using mantras",
    techniques: ["Mantra meditation", "Effortless awareness"]
  },
  {
    id: "centering-prayer",
    name: "Centering Prayer",
    tradition: "Christian mysticism",
    focus: "Resting in God's presence",
    techniques: ["Sacred word", "Surrender", "Consent to divine presence"]
  }
];

const ARCHETYPAL_WISDOM = [
  {
    id: "hero",
    name: "The Hero",
    description: "Journey of transformation through challenge",
    wisdom: "Growth requires leaving comfort zones",
    shadow: "Arrogance, recklessness"
  },
  {
    id: "sage",
    name: "The Sage",
    description: "Seeker and keeper of truth",
    wisdom: "Truth sets us free",
    shadow: "Disconnection from feeling, ivory tower"
  },
  {
    id: "caregiver",
    name: "The Caregiver",
    description: "Nurturing and protecting others",
    wisdom: "Love is the greatest power",
    shadow: "Martyrdom, enabling"
  },
  {
    id: "magician",
    name: "The Magician",
    description: "Transforming reality through vision",
    wisdom: "Consciousness shapes reality",
    shadow: "Manipulation, trickery"
  },
  {
    id: "ruler",
    name: "The Ruler",
    description: "Creating order and taking responsibility",
    wisdom: "Leadership serves the whole",
    shadow: "Tyranny, rigidity"
  }
];

router.get("/traditions", (req, res) => {
  res.json({ success: true, data: WISDOM_TRADITIONS });
});

router.get("/perennial-truths", (req, res) => {
  res.json({ success: true, data: PERENNIAL_TRUTHS });
});

router.get("/meditation-lineages", (req, res) => {
  res.json({ success: true, data: MEDITATION_LINEAGES });
});

router.get("/archetypes", (req, res) => {
  res.json({ success: true, data: ARCHETYPAL_WISDOM });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      wisdomTraditions: WISDOM_TRADITIONS,
      perennialTruths: PERENNIAL_TRUTHS,
      meditationLineages: MEDITATION_LINEAGES,
      archetypalWisdom: ARCHETYPAL_WISDOM
    }
  });
});

export default router;

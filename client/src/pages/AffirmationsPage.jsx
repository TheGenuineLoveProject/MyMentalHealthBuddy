import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Sparkles, RefreshCw, Copy, Check, Star, Sun, Shield, Flower2 } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

const affirmationCategories = [
  {
    id: "self-love",
    name: "Self-Love",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    affirmations: [
      "I am worthy of love exactly as I am",
      "I treat myself with kindness and compassion",
      "My self-worth is not determined by others' opinions",
      "I honor my needs and set healthy boundaries",
      "I am learning to love myself more each day",
      "I deserve happiness and peace",
      "I am enough, just as I am",
      "My feelings are valid and important",
      "I choose to speak to myself with gentleness",
      "I am my own best friend"
    ]
  },
  {
    id: "healing",
    name: "Healing",
    icon: Flower2,
    color: "from-emerald-400 to-teal-500",
    affirmations: [
      "Healing is a journey, not a destination",
      "I am brave for facing my pain",
      "Every day, I am getting stronger",
      "I release what no longer serves me",
      "My past does not define my future",
      "I am resilient and capable of healing",
      "I give myself permission to heal at my own pace",
      "I am transforming my wounds into wisdom",
      "I am not broken; I am healing",
      "Each small step forward matters"
    ]
  },
  {
    id: "peace",
    name: "Inner Peace",
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    affirmations: [
      "I choose peace over perfection",
      "I release anxiety and embrace calm",
      "I am safe in this present moment",
      "I trust the timing of my life",
      "I breathe in peace and exhale worry",
      "Stillness lives within me",
      "I let go of what I cannot control",
      "Peace flows through me with each breath",
      "I am grounded, centered, and calm",
      "I choose tranquility over chaos"
    ]
  },
  {
    id: "strength",
    name: "Strength",
    icon: Shield,
    color: "from-indigo-400 to-purple-500",
    affirmations: [
      "I am stronger than my challenges",
      "I have survived 100% of my hardest days",
      "My strength grows from my struggles",
      "I am capable of handling whatever comes",
      "I trust my inner wisdom and resilience",
      "I face my fears with courage",
      "Every challenge is an opportunity to grow",
      "I am powerful beyond measure",
      "I believe in my ability to overcome",
      "My spirit is unbreakable"
    ]
  },
  {
    id: "gratitude",
    name: "Gratitude",
    icon: Star,
    color: "from-yellow-400 to-amber-500",
    affirmations: [
      "I am grateful for this moment",
      "I appreciate the small blessings in my life",
      "Gratitude opens doors to abundance",
      "I choose to see the good around me",
      "My heart is full of appreciation",
      "I am thankful for my journey",
      "Every day brings new gifts to appreciate",
      "I find joy in simple things",
      "Gratitude transforms my perspective",
      "I am blessed in countless ways"
    ]
  }
];

function AffirmationCard({ affirmation, onNext, category }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(affirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${category.color} p-8 md:p-12 text-white text-center shadow-xl`}>
      <category.icon className="h-12 w-12 mx-auto mb-6 opacity-80" />
      
      <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
        "{affirmation}"
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          data-testid="button-copy-affirmation"
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${liked ? "bg-white text-rose-500" : "bg-white/20 hover:bg-white/30"}`}
          data-testid="button-like-affirmation"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          {liked ? "Saved" : "Save"}
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          data-testid="button-next-affirmation"
        >
          <RefreshCw className="h-5 w-5" />
          Next
        </button>
      </div>
    </div>
  );
}

export default function AffirmationsPage() {
  const [selectedCategory, setSelectedCategory] = useState(affirmationCategories[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dailyAffirmation, setDailyAffirmation] = useState("");

  useSEO({
    title: "Affirmations",
    description: "Positive affirmations for self-love, healing, strength, and peace. Daily encouragement to nurture self-compassion and emotional wellbeing.",
  });

  useEffect(() => {
    const allAffirmations = affirmationCategories.flatMap(c => c.affirmations);
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyAffirmation(allAffirmations[dayOfYear % allAffirmations.length]);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedCategory.affirmations.length);
  };

  const currentAffirmation = selectedCategory.affirmations[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-6">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Affirmations Library</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Positive affirmations rewire your brain for self-love and resilience.
            Choose a category, speak these words aloud, and let them transform your inner dialogue.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 mb-12 text-center">
          <Star className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Today's Affirmation</p>
          <p className="text-xl font-medium text-slate-900 dark:text-white">"{dailyAffirmation}"</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {affirmationCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${
                selectedCategory.id === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
              data-testid={`button-category-${cat.id}`}
            >
              <cat.icon className="h-5 w-5" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mb-12">
          <AffirmationCard 
            affirmation={currentAffirmation} 
            onNext={handleNext}
            category={selectedCategory}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            All {selectedCategory.name} Affirmations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedCategory.affirmations.map((aff, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`text-left p-4 rounded-xl transition-all ${
                  currentIndex === idx
                    ? "bg-gradient-to-r " + selectedCategory.color + " text-white"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                data-testid={`button-affirmation-${idx}`}
              >
                "{aff}"
              </button>
            ))}
          </div>
        </div>

        <div className="bg-sky-50 dark:bg-sky-950/30 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">How to Use Affirmations</h2>
          <div className="grid md:grid-cols-3 gap-6 text-slate-600 dark:text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Speak Aloud</h3>
              <p className="text-sm">Saying affirmations out loud engages more brain regions and reinforces the message.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Feel the Words</h3>
              <p className="text-sm">Connect emotionally with each affirmation. Visualize it being true for you.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Practice Daily</h3>
              <p className="text-sm">Consistency creates new neural pathways. Morning and evening are ideal times.</p>
            </div>
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Self-Compassion", description: "Deepen your self-love practice", path: "/self-compassion" },
            { title: "Gratitude Practice", description: "Cultivate appreciation and joy", path: "/gratitude" },
            { title: "Journal Reflection", description: "Write about your affirmation journey", path: "/guided-journaling" },
          ]}
          title="Continue Your Journey"
        />

        <div className="text-center py-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Affirmations are a supportive practice, not a replacement for professional mental health care.
            Be gentle with yourself as you build new thought patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sun, Moon, Star, Sparkles, BookOpen, RefreshCw, Heart, Share2, Copy } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";

const WISDOM_CLARITY = {
  what: "Daily wisdom quotes from diverse traditions—Stoicism, Buddhism, psychology, philosophy—with reflection prompts.",
  who: "Anyone seeking perspective, inspiration, or a moment of contemplation in their day.",
  when: "Morning for intention-setting, during breaks for perspective, or evening for reflection.",
  why: "Wisdom traditions offer time-tested insights. Brief daily exposure gradually shifts how you see yourself and the world.",
  howSteps: [
    "Read today's wisdom quote slowly",
    "Notice your initial response—what resonates or challenges you?",
    "Write a brief reflection if you wish",
    "Save favorites to build your personal wisdom collection"
  ],
  whereLinkText: "Explore meditation",
  whereHref: "/meditation"
};

const WISDOM_EXAMPLES = [
  {
    level: "beginner",
    title: "Receiving today's wisdom",
    situation: "You're feeling stuck and need fresh perspective.",
    action: "Read the daily wisdom quote slowly. Let it sit with you rather than rushing past.",
    result: "A single insight can shift your entire day—'The obstacle is the way' might reframe your challenge."
  },
  {
    level: "intermediate",
    title: "Deepening with reflection",
    situation: "A quote resonates but you want to integrate it more deeply.",
    action: "Write a brief reflection: How does this apply to your life? What would change if you lived this truth?",
    result: "The wisdom moves from intellectual understanding to embodied knowing."
  },
  {
    level: "advanced",
    title: "Building a wisdom practice",
    situation: "You want wisdom to be more than occasional inspiration.",
    action: "Visit daily, save favorites, and review your collection weekly. Notice themes that keep appearing.",
    result: "Over time, you develop a personal philosophy—a collection of truths that guide your life."
  }
];

const STORAGE_KEY = "glp_daily_wisdom";

type WisdomEntry = {
  id: string;
  text: string;
  source: string;
  tradition: string;
  reflection: string;
  savedAt: string;
};

type Profile = {
  favorites: WisdomEntry[];
  reflections: Record<string, string>;
  streak: number;
  lastVisit: string;
};

const WISDOM_LIBRARY = [
  { text: "The obstacle is the way.", source: "Marcus Aurelius", tradition: "Stoicism", theme: "resilience" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", source: "Viktor Frankl", tradition: "Existentialism", theme: "agency" },
  { text: "The only true wisdom is in knowing you know nothing.", source: "Socrates", tradition: "Greek Philosophy", theme: "humility" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", source: "Aristotle", tradition: "Greek Philosophy", theme: "practice" },
  { text: "The mind is everything. What you think, you become.", source: "Buddha", tradition: "Buddhism", theme: "mindset" },
  { text: "Knowing others is intelligence; knowing yourself is true wisdom.", source: "Lao Tzu", tradition: "Taoism", theme: "self-awareness" },
  { text: "He who has a why to live can bear almost any how.", source: "Nietzsche", tradition: "Existentialism", theme: "purpose" },
  { text: "The wound is the place where the Light enters you.", source: "Rumi", tradition: "Sufism", theme: "healing" },
  { text: "In the middle of difficulty lies opportunity.", source: "Albert Einstein", tradition: "Modern Thought", theme: "perspective" },
  { text: "The privilege of a lifetime is to become who you truly are.", source: "Carl Jung", tradition: "Depth Psychology", theme: "authenticity" },
  { text: "What we achieve inwardly will change outer reality.", source: "Plutarch", tradition: "Greek Philosophy", theme: "inner-work" },
  { text: "The quieter you become, the more you can hear.", source: "Ram Dass", tradition: "Contemplative", theme: "stillness" },
  { text: "Pain is inevitable. Suffering is optional.", source: "Haruki Murakami", tradition: "Modern Wisdom", theme: "acceptance" },
  { text: "The only way out is through.", source: "Robert Frost", tradition: "Modern Thought", theme: "courage" },
  { text: "Everything that irritates us about others can lead us to an understanding of ourselves.", source: "Carl Jung", tradition: "Depth Psychology", theme: "projection" },
  { text: "Life shrinks or expands in proportion to one's courage.", source: "Anaïs Nin", tradition: "Modern Thought", theme: "courage" },
  { text: "The cave you fear to enter holds the treasure you seek.", source: "Joseph Campbell", tradition: "Mythology", theme: "shadow-work" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", source: "Ralph Waldo Emerson", tradition: "Transcendentalism", theme: "authenticity" },
  { text: "Act as if what you do makes a difference. It does.", source: "William James", tradition: "Pragmatism", theme: "agency" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", source: "Thich Nhat Hanh", tradition: "Buddhism", theme: "presence" },
  { text: "One cannot step twice into the same river.", source: "Heraclitus", tradition: "Greek Philosophy", theme: "impermanence" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", source: "Ralph Waldo Emerson", tradition: "Transcendentalism", theme: "inner-resources" },
  { text: "The unexamined life is not worth living.", source: "Socrates", tradition: "Greek Philosophy", theme: "reflection" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", source: "Buddha", tradition: "Buddhism", theme: "presence" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", source: "Rumi", tradition: "Sufism", theme: "love" },
  { text: "We suffer more often in imagination than in reality.", source: "Seneca", tradition: "Stoicism", theme: "anxiety" },
  { text: "The soul becomes dyed with the color of its thoughts.", source: "Marcus Aurelius", tradition: "Stoicism", theme: "mindset" },
  { text: "No man is free who is not master of himself.", source: "Epictetus", tradition: "Stoicism", theme: "self-mastery" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", source: "Albert Camus", tradition: "Existentialism", theme: "resilience" },
  { text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", source: "John Milton", tradition: "Literature", theme: "perception" },
];

function uid() {
  return `dw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function getDayKey() {
  return new Date().toISOString().split("T")[0];
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { favorites: [], reflections: {}, streak: 0, lastVisit: "" };
  } catch {
    return { favorites: [], reflections: {}, streak: 0, lastVisit: "" };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function getTodaysWisdom() {
  const dayNum = Math.floor(Date.now() / 86400000);
  return WISDOM_LIBRARY[dayNum % WISDOM_LIBRARY.length];
}

export default function DailyWisdomOraclePage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [reflection, setReflection] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const todaysWisdom = useMemo(() => getTodaysWisdom(), []);
  const dayKey = getDayKey();

  useEffect(() => {
    if (profile.lastVisit !== dayKey) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = profile.lastVisit === yesterday ? profile.streak + 1 : 1;
      
      const updated = {
        ...profile,
        streak: newStreak,
        lastVisit: dayKey,
      };
      setProfile(updated);
      saveProfile(updated);
    }
  }, []);

  const saveReflection = () => {
    if (reflection.trim().length < 5) return;
    
    const updated = {
      ...profile,
      reflections: { ...profile.reflections, [dayKey]: reflection.trim() },
    };
    setProfile(updated);
    saveProfile(updated);
  };

  const addToFavorites = () => {
    const entry: WisdomEntry = {
      id: uid(),
      text: todaysWisdom.text,
      source: todaysWisdom.source,
      tradition: todaysWisdom.tradition,
      reflection: reflection.trim(),
      savedAt: new Date().toISOString(),
    };
    
    const updated = {
      ...profile,
      favorites: [entry, ...profile.favorites.filter(f => f.text !== todaysWisdom.text)].slice(0, 100),
    };
    setProfile(updated);
    saveProfile(updated);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`"${todaysWisdom.text}" — ${todaysWisdom.source}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFavorited = profile.favorites.some(f => f.text === todaysWisdom.text);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <header className="mb-8">
          <Link href="/atlas" className="inline-flex items-center gap-2 text-body-sm text-sage-600 hover:text-teal-700 mb-4 transition-colors" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container icon-xl icon-gradient-gold">
              <Sun className="h-7 w-7" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-title">
              Daily Wisdom Oracle
            </h1>
          </div>
          <p className="text-lead max-w-2xl">
            One piece of wisdom each day. Drawn from the world's great philosophical traditions.
          </p>
        </header>

        <BenefitsBlock
          benefit="Daily reflection and inspiration from world philosophical traditions"
          duration="2–5 minutes per day"
          control="Return whenever you're ready — no commitment required"
          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <ClarityCard {...WISDOM_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={WISDOM_EXAMPLES} 
          title="See how others use Daily Wisdom"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-3">
              <Star className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-gold-600" data-testid="text-streak">{profile.streak}</div>
            <p className="text-caption">Day Streak</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-3">
              <Heart className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-blush-600" data-testid="text-favorites">{profile.favorites.length}</div>
            <p className="text-caption">Saved Wisdom</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-reflections">{Object.keys(profile.reflections).length}</div>
            <p className="text-caption">Reflections</p>
          </div>
        </div>

        <div className="card-bordered bg-gradient-to-br from-gold-50 via-blush-50 to-sage-50 mb-8">
          <div className="text-center mb-6">
            <span className="text-eyebrow bg-gold-100 text-gold-700 px-3 py-1 rounded-full mb-4 inline-block">
              {todaysWisdom.tradition}
            </span>
            <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-4 text-teal-700">
              "{todaysWisdom.text}"
            </blockquote>
            <p className="text-body-base">— {todaysWisdom.source}</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={addToFavorites}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-medium ${isFavorited ? "bg-blush-100 text-blush-600 border border-blush-300" : "bg-white border border-sage-200 text-teal-600 hover:bg-sage-50"}`}
              data-testid="button-favorite"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-blush-500" : ""}`} />
              {isFavorited ? "Saved" : "Save"}
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl bg-white border border-sage-200 text-teal-600 hover:bg-sage-50 flex items-center gap-2 font-medium"
              data-testid="button-copy"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-body-sm font-semibold text-teal-600 mb-2">Your Reflection</h3>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What does this wisdom mean to you today? How might you apply it?"
              className="w-full h-24 p-4 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/50"
              data-testid="input-reflection"
            />
            <button
              onClick={saveReflection}
              disabled={reflection.trim().length < 5}
              className="mt-3 btn-premium px-6 py-2 disabled:opacity-50"
              data-testid="button-save-reflection"
            >
              Save Reflection
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-md text-teal">Wisdom Library</h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-body-sm text-sage-600 hover:text-teal-600 transition-colors"
            data-testid="button-toggle-library"
          >
            {showAll ? "Show Less" : `Show All ${WISDOM_LIBRARY.length}`}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {(showAll ? WISDOM_LIBRARY : WISDOM_LIBRARY.slice(0, 6)).map((w, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all ${w.text === todaysWisdom.text ? "bg-gold-50 border-gold-300" : "card-bordered"}`}
            >
              <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-600 mb-2 inline-block">
                {w.tradition}
              </span>
              <p className="text-body-sm italic text-teal-700 mb-2">"{w.text}"</p>
              <p className="text-caption">— {w.source}</p>
            </div>
          ))}
        </div>

        {profile.favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-heading-md text-teal mb-4">Your Saved Wisdom</h2>
            <div className="space-y-3">
              {profile.favorites.slice(0, 5).map((f) => (
                <div key={f.id} className="card-bordered">
                  <p className="text-body-sm italic text-teal-700 mb-2">"{f.text}"</p>
                  <p className="text-caption">— {f.source}</p>
                  {f.reflection && (
                    <p className="text-body-sm mt-2 p-2 rounded bg-sage-50 text-sage-600">
                      Your reflection: {f.reflection}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

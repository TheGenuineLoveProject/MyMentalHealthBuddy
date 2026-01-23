import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Sparkles, RefreshCw, Copy, Check, Star, Sun, Shield, Flower2, Brain, Zap, Compass, BookOpen, Moon, Target, Users } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";
import SafetyFooter from "../components/ui/SafetyFooter";

const affirmationCategories = [
  {
    id: "self-love",
    name: "Self-Love",
    icon: Heart,
    description: "Rewire your inner dialogue toward unconditional self-acceptance",
    researchNote: "Dr. Kristin Neff's research shows self-compassion is more strongly associated with mental health than self-esteem, without the downsides of narcissism.",
    affirmations: [
      "I am worthy of love exactly as I am, without earning or proving anything.",
      "My value is inherent—it was never about what I do, only who I am.",
      "I release the belief that I must be perfect to be loved.",
      "I am learning to parent myself with the tenderness I always deserved.",
      "Every part of me, even the wounded parts, deserves compassion.",
      "I am reclaiming the self-love that was always my birthright.",
      "I choose to speak to myself as I would to someone I deeply love.",
      "My relationship with myself sets the template for all other relationships.",
      "I am becoming the safe person I needed when I was younger.",
      "Self-love is not selfish—it is the foundation of genuine love for others.",
      "I stop apologizing for taking up space in this world.",
      "I deserve rest, joy, and love—not as rewards, but as rights."
    ]
  },
  {
    id: "healing",
    name: "Healing",
    icon: Flower2,
    description: "Honor your non-linear healing journey with patience and trust",
    researchNote: "Neuroplasticity research confirms the brain can rewire throughout life. Each practice of self-compassion literally creates new neural pathways.",
    affirmations: [
      "My healing is not linear, and that's exactly as it should be.",
      "I honor my body's timeline for releasing what it has carried.",
      "Every trigger is an invitation to heal something that's ready.",
      "I am not broken—I am a survivor adapting to what I survived.",
      "My wounds are not my identity; they are part of my story.",
      "I give myself permission to heal at the pace my nervous system needs.",
      "The fact that I am here, seeking healing, proves my resilience.",
      "I am transforming survival patterns into thriving patterns.",
      "Each small step forward is rewiring my brain toward healing.",
      "I am not going backward—I am integrating what I once had to split off.",
      "What I'm feeling now was always there—I'm finally safe enough to feel it.",
      "I trust that my system knows what needs to emerge and when."
    ]
  },
  {
    id: "peace",
    name: "Inner Peace",
    icon: Sun,
    description: "Cultivate nervous system calm and present-moment awareness",
    researchNote: "Polyvagal theory shows that true calm comes from a regulated nervous system. These affirmations help signal safety to your brain.",
    affirmations: [
      "Peace is not the absence of difficulty; it is the presence of Self.",
      "I am learning to find calm in the eye of the storm.",
      "My nervous system can return to safety; this is its natural state.",
      "I release the need to control outcomes to feel at peace.",
      "Stillness is not passivity—it is a powerful act of presence.",
      "I trust my body to guide me back to equilibrium.",
      "Each breath is an anchor to the present moment.",
      "Peace lives underneath the noise; I am learning to access it.",
      "I choose to respond from calm rather than react from fear.",
      "My peace is not dependent on external circumstances.",
      "I am safe in this moment. The past is over. The future is not yet.",
      "I breathe in calm and exhale what no longer serves me."
    ]
  },
  {
    id: "resilience",
    name: "Resilience",
    icon: Shield,
    description: "Recognize and honor the strength you've already demonstrated",
    researchNote: "Post-traumatic growth research shows that struggle often leads to profound positive change. Your challenges have built capacities you may not yet recognize.",
    affirmations: [
      "I have survived 100% of my worst days.",
      "My struggles have forged strength I am only beginning to recognize.",
      "I am more resilient than my fears tell me I am.",
      "Adversity has taught me lessons that ease never could.",
      "I bend without breaking; I fall and rise again.",
      "My capacity for challenge has expanded through what I've faced.",
      "I trust my ability to navigate whatever comes next.",
      "Resilience is not about being untouched—it's about recovering.",
      "I honor the courage it takes to keep going.",
      "Every difficulty I've overcome is proof of my inner strength.",
      "I am not defined by what happened to me, but by how I carry it forward.",
      "My survival is not luck—it is the result of my own will to live."
    ]
  },
  {
    id: "growth",
    name: "Growth",
    icon: Sparkles,
    description: "Embrace transformation as your natural state of being",
    researchNote: "Carol Dweck's growth mindset research shows that believing in your capacity to grow actually increases your capacity to grow.",
    affirmations: [
      "I am not who I was yesterday, and that is beautiful.",
      "Growth happens in the uncomfortable space between old and new.",
      "I release my attachment to who I was to become who I'm meant to be.",
      "Every ending creates space for a new beginning.",
      "I trust the unfolding of my own becoming.",
      "Discomfort is not a sign I'm failing—it's a sign I'm growing.",
      "I am becoming a version of myself I once couldn't imagine.",
      "My potential is not fixed; it expands with each step I take.",
      "I embrace the person I am becoming.",
      "Growth is my natural state when I create the conditions for it.",
      "I am both a work in progress and already complete.",
      "Each day I have the opportunity to become more fully myself."
    ]
  },
  {
    id: "boundaries",
    name: "Boundaries",
    icon: Target,
    description: "Reclaim your right to protect your peace and honor your needs",
    researchNote: "Research shows that healthy boundaries are associated with lower anxiety, depression, and burnout, and higher relationship satisfaction.",
    affirmations: [
      "My 'no' is a complete sentence that doesn't require justification.",
      "Boundaries are an act of self-love, not aggression.",
      "I can love someone and still protect my peace from them.",
      "Setting limits teaches others how to treat me.",
      "I am allowed to change my boundaries as I grow.",
      "Guilt after boundary-setting is an old pattern, not a truth.",
      "I choose relationships where my boundaries are respected.",
      "My needs matter, and I am allowed to honor them.",
      "Healthy boundaries create the safety love requires to flourish.",
      "I am learning that boundaries bring people closer, not further away.",
      "I don't owe anyone access to my energy, time, or body.",
      "Protecting my peace is not selfish—it is necessary."
    ]
  },
  {
    id: "worthiness",
    name: "Worthiness",
    icon: Star,
    description: "Reclaim your inherent value that was never meant to be earned",
    researchNote: "Brené Brown's research shows that worthiness is not earned through achievement—it is our birthright that must be claimed.",
    affirmations: [
      "I am worthy of good things, even on the days I don't feel it.",
      "My worthiness is not determined by productivity or achievement.",
      "I belong here. I matter. My existence has meaning.",
      "I release the conditions I placed on my own worthiness.",
      "I deserve rest, joy, and love—not as rewards, but as rights.",
      "My worth was established at birth and cannot be diminished.",
      "I am not 'too much' or 'not enough'—I am exactly right as I am.",
      "I reclaim my inherent value from those who made me doubt it.",
      "Worthiness is not something I become—it's something I already am.",
      "I stop apologizing for existing.",
      "I am allowed to take up space, have needs, and ask for what I want.",
      "My value is not negotiable, regardless of others' opinions."
    ]
  },
  {
    id: "nervous-system",
    name: "Nervous System",
    icon: Zap,
    description: "Speak directly to your autonomic nervous system with calming truths",
    researchNote: "Polyvagal theory explains how words and intentions can shift nervous system states. These affirmations help signal safety.",
    affirmations: [
      "I am safe in this moment. My body can relax.",
      "My nervous system is doing its best to protect me.",
      "I honor my body's survival responses without shame.",
      "I can feel activated and still be okay.",
      "My fight-flight-freeze response is not a flaw—it's protection.",
      "I am learning to expand my window of tolerance.",
      "I trust my body's wisdom to return to calm.",
      "I am rewiring my nervous system toward safety and connection.",
      "Each moment of calm builds my capacity for more calm.",
      "My reactions are not character flaws—they are adaptations.",
      "I am not my anxiety. I am the witness of my anxiety.",
      "I can soothe my own nervous system with breath, presence, and kindness."
    ]
  }
];

const affirmationPractices = [
  {
    title: "Speak Aloud with Presence",
    icon: BookOpen,
    description: "Speaking affirmations engages more brain regions than silent reading. Stand in front of a mirror, make eye contact with yourself, and speak slowly. Let the words land. Notice any resistance—it's just old programming meeting new truth."
  },
  {
    title: "Feel the Words in Your Body",
    icon: Heart,
    description: "Move beyond intellectual understanding to embodied experience. As you speak each affirmation, notice where you feel it in your body. Place a hand there. Breathe into that space. Affirmations work best when they're felt, not just thought."
  },
  {
    title: "Practice During State Shifts",
    icon: Moon,
    description: "The brain is most receptive to new beliefs during transition states—just waking, just before sleep, after meditation, or after exercise. These liminal moments offer greater neuroplasticity for rewiring."
  },
  {
    title: "Meet Resistance with Curiosity",
    icon: Brain,
    description: "If an affirmation feels false or triggers cynicism, that's valuable information. Ask: 'What part of me doesn't believe this?' That part needs compassion, not bypassing. You might start with: 'I am learning to believe that...'"
  }
];

const scienceOfAffirmations = {
  neuroplasticity: "Every thought creates neural pathways. Repeated thoughts strengthen those pathways. Affirmations are deliberate thought repetition that literally rewires brain structure toward more supportive patterns.",
  selfTalkResearch: "Research shows we have 12,000-60,000 thoughts per day, and 80% are negative, 95% are repetitive. Affirmations interrupt this pattern with intentional positive repetition.",
  embodiment: "Neuroscience shows that combining words with body awareness, emotion, and sensory experience creates stronger neural encoding than words alone.",
  timing: "Studies on self-affirmation theory show affirmations work best when tailored to personal values and practiced during receptive states rather than acute stress."
};

function AffirmationCard({ affirmation, onNext, category }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(affirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl p-8 md:p-12 text-center shadow-xl" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
      <category.icon className="h-12 w-12 mx-auto mb-6 opacity-80" />
      
      <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
        "{affirmation}"
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
          style={{ background: 'var(--glp-white-20)' }}
          data-testid="button-copy-affirmation"
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
          style={liked ? { background: 'white', color: 'var(--glp-blush)' } : { background: 'var(--glp-white-20)' }}
          data-testid="button-like-affirmation"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          {liked ? "Saved" : "Save"}
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
          style={{ background: 'var(--glp-white-20)' }}
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
    title: "Transformational Affirmations | The Genuine Love Project",
    description: "Evidence-based affirmations for self-love, healing, resilience, and nervous system regulation. Rewire your inner dialogue with words grounded in psychology research.",
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-rose-10) 50%, var(--glp-paper) 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-sage-deep)' }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-blush), var(--glp-sage))', color: 'var(--glp-paper)' }}>
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Transformational Affirmations</h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--glp-ink)', opacity: 0.75 }}>
            Not positive thinking platitudes—evidence-based statements designed to rewire neural pathways.
            Each affirmation is crafted to speak directly to your nervous system, inner critic, and wounded parts with the compassion they deserve.
          </p>
        </div>

        <div className="rounded-2xl p-6 mb-12 text-center" style={{ background: 'linear-gradient(135deg, var(--glp-gold-20), var(--glp-gold-10))', border: '1px solid var(--glp-gold-30)' }}>
          <Star className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--glp-gold)' }} />
          <p className="text-sm mb-2" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>Today's Affirmation</p>
          <p className="text-xl font-medium mb-3" style={{ color: 'var(--glp-sage-deep)' }}>"{dailyAffirmation}"</p>
          <p className="text-xs" style={{ color: 'var(--glp-gold-dark)' }}>Speak this aloud three times. Place your hand on your heart. Let it land.</p>
        </div>

        <div className="rounded-2xl p-6 mb-12 shadow-sm" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Choose Your Focus</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {affirmationCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
                className="flex items-center gap-2 px-5 py-3 rounded-full transition-all"
                style={selectedCategory.id === cat.id
                  ? { background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'white', boxShadow: '0 4px 12px var(--glp-overlay-30)' }
                  : { background: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' }}
                data-testid={`button-category-${cat.id}`}
              >
                <cat.icon className="h-5 w-5" />
                {cat.name}
              </button>
            ))}
          </div>
          <p className="text-center text-sm mt-4" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>
            {selectedCategory.description}
          </p>
        </div>

        <div className="mb-8">
          <AffirmationCard 
            affirmation={currentAffirmation} 
            onNext={handleNext}
            category={selectedCategory}
          />
        </div>

        <div className="rounded-2xl p-6 mb-12" style={{ background: 'var(--glp-teal-50)', border: '1px solid var(--glp-sage-30)' }}>
          <Brain className="h-5 w-5 mb-2" style={{ color: 'var(--glp-sage-deep)' }} />
          <p className="text-sm italic" style={{ color: 'var(--glp-sage-deep)' }}>
            <strong>Research Note:</strong> {selectedCategory.researchNote}
          </p>
        </div>

        <div className="rounded-2xl p-8 mb-12 shadow-sm" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>
            All {selectedCategory.name} Affirmations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedCategory.affirmations.map((aff, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="text-left p-4 rounded-xl transition-all"
                style={currentIndex === idx
                  ? { background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'white' }
                  : { background: 'var(--glp-sage-10)', color: 'var(--glp-ink)' }}
                data-testid={`button-affirmation-${idx}`}
              >
                "{aff}"
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-teal-50)', border: '1px solid var(--glp-sage-30)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>How to Practice Affirmations Effectively</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {affirmationPractices.map((practice, idx) => (
              <div key={idx} className="rounded-xl p-5" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ background: 'var(--glp-sage-20)' }}>
                    <practice.icon className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>{practice.title}</h3>
                </div>
                <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.75 }}>{practice.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'linear-gradient(135deg, var(--glp-rose-10), var(--glp-teal-50))' }}>
          <h2 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
            <Brain className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
            The Science of Affirmations
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Neuroplasticity</h3>
              <p style={{ color: 'var(--glp-ink)', opacity: 0.75 }}>{scienceOfAffirmations.neuroplasticity}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>The Self-Talk Statistics</h3>
              <p style={{ color: 'var(--glp-ink)', opacity: 0.75 }}>{scienceOfAffirmations.selfTalkResearch}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Embodiment Matters</h3>
              <p style={{ color: 'var(--glp-ink)', opacity: 0.75 }}>{scienceOfAffirmations.embodiment}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Timing & Personalization</h3>
              <p style={{ color: 'var(--glp-ink)', opacity: 0.75 }}>{scienceOfAffirmations.timing}</p>
            </div>
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Inner Child Healing", description: "Give your younger self the words they needed", path: "/inner-child" },
            { title: "Nervous System Tools", description: "Regulate your body to receive these truths", path: "/grounding-techniques" },
            { title: "Guided Journaling", description: "Explore what arises from your practice", path: "/guided-journaling" },
          ]}
          title="Deepen Your Practice"
        />

        <SafetyFooter variant="default" />
      </div>
    </div>
  );
}

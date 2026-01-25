import { useState } from "react";
import { Link } from "wouter";
import { 
  Library, Heart, Brain, Leaf, Sun, Moon, Wind,
  BookOpen, ArrowRight, Check, Sparkles, Shield,
  Activity, Eye, Waves, Flame, Mountain
} from "lucide-react";
import { BRAND } from "@shared/brand";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import StartHerePathways from "../components/StartHerePathways.jsx";
import { useSEO, createWebSiteSchema } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const HEALING_CATEGORIES = [
  { id: "all", label: "All Modalities", icon: Library },
  { id: "body", label: "Body", icon: Activity },
  { id: "mind", label: "Mind", icon: Brain },
  { id: "soul", label: "Soul", icon: Heart },
  { id: "integration", label: "Integration", icon: Sparkles }
];

const HEALING_MODALITIES = [
  {
    id: "somatic-healing",
    name: "Somatic Healing",
    category: "body",
    icon: Activity,
    description: "Trauma is stored in the body. Somatic practices help release tension, complete stress responses, and restore felt safety.",
    benefits: ["Releases stored tension", "Regulates nervous system", "Improves body awareness", "Reduces chronic pain"],
    practices: ["Body scanning", "Grounding exercises", "Breathwork", "Shaking/tremoring", "Progressive relaxation"],
    research: "Studies show somatic interventions reduce PTSD symptoms by 30-50% in clinical trials.",
    toolLink: "/wellness"
  },
  {
    id: "nervous-system",
    name: "Nervous System Regulation",
    category: "body",
    icon: Waves,
    description: "Learn to shift from fight-flight-freeze states to calm, connected presence through polyvagal-informed practices.",
    benefits: ["Reduces anxiety", "Improves stress resilience", "Enhances emotional regulation", "Supports sleep"],
    practices: ["Vagal toning", "Cold exposure", "Humming/singing", "Safe social engagement", "Co-regulation"],
    research: "Polyvagal theory informs trauma treatment worldwide with proven effectiveness.",
    toolLink: "/wellness"
  },
  {
    id: "mindfulness",
    name: "Mindfulness & Meditation",
    category: "mind",
    icon: Eye,
    description: "Train attention and awareness to reduce reactivity, increase presence, and cultivate inner peace.",
    benefits: ["Reduces rumination", "Increases focus", "Lowers cortisol", "Enhances emotional intelligence"],
    practices: ["Breath meditation", "Body scan", "Loving-kindness", "Mindful walking", "Open awareness"],
    research: "8 weeks of mindfulness practice physically changes brain structure in areas related to emotion regulation.",
    toolLink: "/tools"
  },
  {
    id: "cognitive-reframing",
    name: "Cognitive Reframing",
    category: "mind",
    icon: Brain,
    description: "Challenge and transform unhelpful thought patterns through evidence-based cognitive behavioral techniques.",
    benefits: ["Reduces negative thinking", "Builds cognitive flexibility", "Improves problem-solving", "Increases optimism"],
    practices: ["Thought records", "Cognitive defusion", "Reattribution", "Decatastrophizing", "Evidence examination"],
    research: "CBT is one of the most researched and effective treatments for depression and anxiety.",
    toolLink: "/tools"
  },
  {
    id: "narrative-healing",
    name: "Narrative Healing",
    category: "mind",
    icon: BookOpen,
    description: "Rewrite your story. How we narrate our experiences shapes meaning, identity, and possibilities for growth.",
    benefits: ["Creates meaning from difficulty", "Strengthens identity", "Processes emotions", "Builds resilience"],
    practices: ["Life story work", "Expressive writing", "Story reframing", "Hero's journey mapping", "Legacy letters"],
    research: "Pennebaker's research shows expressive writing improves physical and mental health outcomes.",
    toolLink: "/journal"
  },
  {
    id: "self-compassion",
    name: "Self-Compassion",
    category: "soul",
    icon: Heart,
    description: "Treat yourself with the same kindness you would offer a good friend. Self-compassion is the foundation of healing.",
    benefits: ["Reduces self-criticism", "Increases motivation", "Improves relationships", "Builds resilience"],
    practices: ["Self-compassion break", "Compassionate letter writing", "Common humanity reflection", "Mindful self-kindness"],
    research: "Kristin Neff's research shows self-compassion is more effective than self-esteem for wellbeing.",
    toolLink: "/tools"
  },
  {
    id: "meaning-making",
    name: "Meaning & Purpose",
    category: "soul",
    icon: Sparkles,
    description: "Discover what truly matters. Finding purpose and meaning provides direction and resilience in difficult times.",
    benefits: ["Increases life satisfaction", "Provides direction", "Builds motivation", "Reduces existential anxiety"],
    practices: ["Values clarification", "Purpose exploration", "Legacy visioning", "Contribution mapping", "Ikigai work"],
    research: "Viktor Frankl's logotherapy and modern research show meaning is central to psychological health.",
    toolLink: "/wisdom"
  },
  {
    id: "spiritual-connection",
    name: "Spiritual Connection",
    category: "soul",
    icon: Sun,
    description: "Connect with something larger than yourself, whether nature, community, art, or transcendent experience.",
    benefits: ["Reduces isolation", "Provides comfort", "Enhances awe", "Supports surrender"],
    practices: ["Nature immersion", "Gratitude practice", "Awe walks", "Sacred rituals", "Contemplative prayer"],
    research: "Spiritual practices correlate with lower depression, better coping, and increased life satisfaction.",
    toolLink: "/wisdom"
  },
  {
    id: "inner-parts",
    name: "Inner Parts Work",
    category: "integration",
    icon: Shield,
    description: "Understand and integrate different parts of yourself. Honor protective strategies while healing wounded aspects.",
    benefits: ["Reduces internal conflict", "Heals old wounds", "Increases self-understanding", "Builds wholeness"],
    practices: ["Parts mapping", "Self-dialogue", "Inner child work", "Protector appreciation", "Exile healing"],
    research: "Internal Family Systems (IFS) is now an evidence-based practice for trauma and other conditions.",
    toolLink: "/advanced"
  },
  {
    id: "integration",
    name: "Holistic Integration",
    category: "integration",
    icon: Mountain,
    description: "True healing integrates body, mind, and spirit. Create coherence across all dimensions of your being.",
    benefits: ["Creates wholeness", "Sustains growth", "Prevents relapse", "Builds authentic self"],
    practices: ["Daily rituals", "Mind-body practices", "Reflective journaling", "Community connection", "Nature bonding"],
    research: "Integrated approaches show better long-term outcomes than single-modality treatments.",
    toolLink: "/wellness"
  }
];

export default function HealingLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedModality, setExpandedModality] = useState(null);

  useSEO({
    title: "Healing Library",
    description: "Explore evidence-based healing modalities for mind, body, and soul. Discover somatic healing, mindfulness, cognitive therapy, and integrative wellness practices.",
    jsonLd: createWebSiteSchema(),
  });

  const filteredModalities = activeCategory === "all"
    ? HEALING_MODALITIES
    : HEALING_MODALITIES.filter(m => m.category === activeCategory);

  return (
  <WellnessPageShell
    title="HealingLibraryPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "Healing Library", path: "/healing-library" }]} />
        
        <div className="flex items-center gap-3 mb-2">
          <Library className="h-8 w-8" style={{ color: BRAND.colors.primary }} />
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
            Evidence-Based Healing Library
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Explore proven modalities for healing mind, body, and soul. Each approach is grounded in research and adapted for compassionate self-application.
        </p>
        
        <StartHerePathways />

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-100 dark:border-emerald-800/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <Leaf className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Healing is a Journey</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                There is no single path to wholeness. Different modalities resonate at different times. 
                Trust your intuition about what you need right now, and remember that small, consistent 
                practices create lasting change.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {HEALING_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              data-testid={`button-category-${cat.id}`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredModalities.map(modality => {
            const isExpanded = expandedModality === modality.id;
            return (
              <div
                key={modality.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all ${
                  isExpanded 
                    ? "border-emerald-300 dark:border-emerald-600 md:col-span-2" 
                    : "border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                      isExpanded 
                        ? "bg-emerald-100 dark:bg-emerald-900/40" 
                        : "bg-gray-50 dark:bg-gray-700"
                    }`}>
                      <modality.icon className={`h-6 w-6 ${
                        isExpanded 
                          ? "text-emerald-600 dark:text-emerald-400" 
                          : "text-gray-500 dark:text-gray-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {modality.name}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 capitalize">
                          {modality.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {modality.description}
                      </p>

                      {isExpanded && (
                        <div className="space-y-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Benefits</h4>
                            <div className="flex flex-wrap gap-2">
                              {modality.benefits.map((benefit, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                  <Check className="h-3 w-3" />
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Core Practices</h4>
                            <div className="flex flex-wrap gap-2">
                              {modality.practices.map((practice, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  {practice}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">Research Note</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {modality.research}
                            </p>
                          </div>

                          <Link
                            href={modality.toolLink}
                            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium transition-colors"
                            data-testid={`link-tool-${modality.id}`}
                          >
                            Explore related tools <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      )}

                      <button
                        onClick={() => setExpandedModality(isExpanded ? null : modality.id)}
                        className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        data-testid={`button-expand-${modality.id}`}
                      >
                        {isExpanded ? "Show less" : "Learn more"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link
            href="/resources"
            className="group bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-rose-100 dark:border-rose-800/30 hover:shadow-lg transition-all"
            data-testid="link-resources-cta"
          >
            <Heart className="h-8 w-8 text-rose-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Resources</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Find therapists, crisis support, and professional guidance.
            </p>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm group-hover:gap-2 transition-all">
              Explore <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/study-vault"
            className="group bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30 hover:shadow-lg transition-all"
            data-testid="link-study-vault-cta"
          >
            <BookOpen className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Study Vault</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Dive into research summaries and academic sources.
            </p>
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm group-hover:gap-2 transition-all">
              Explore <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/faq"
            className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30 hover:shadow-lg transition-all"
            data-testid="link-faq-cta"
          >
            <Flame className="h-8 w-8 text-amber-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">FAQ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Answers to common questions about healing and our platform.
            </p>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm group-hover:gap-2 transition-all">
              Explore <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <SafetyFooter variant="default" />
      </div>
    </div>
  </WellnessPageShell>
  );
}

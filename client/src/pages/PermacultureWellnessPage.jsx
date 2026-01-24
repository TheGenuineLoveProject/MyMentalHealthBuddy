import { useState } from "react";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { 
  Leaf, 
  Sun, 
  Droplets, 
  Wind,
  Mountain,
  Sprout,
  TreeDeciduous,
  Flower2,
  CircleDot,
  ArrowRight,
  CheckCircle,
  Heart,
  Users,
  Recycle,
  Eye,
  Clock,
  Layers
} from "lucide-react";

const PERMACULTURE_ETHICS = [
  {
    id: "earth-care",
    title: "Earth Care → Self Care",
    icon: Leaf,
    color: "var(--success)",
    principle: "Care for the Earth",
    translation: "Care for your body and nervous system",
    insight: "Just as healthy soil is the foundation of a thriving ecosystem, your physical and emotional wellbeing is the foundation of a thriving life.",
    practices: [
      "Nourish your body like you would fertile soil — with rest, nutrients, and gentle attention",
      "Protect your energy like you would protect a watershed — set boundaries around what enters",
      "Allow fallow periods — rest is not laziness, it's regeneration"
    ],
    affirmation: "I am the garden I tend. My wellbeing nourishes everything I touch."
  },
  {
    id: "people-care",
    title: "People Care → Relationship Ecology",
    icon: Users,
    color: "var(--primary)",
    principle: "Care for People",
    translation: "Cultivate nourishing connections",
    insight: "In nature, diversity creates resilience. Your relational ecosystem thrives when you cultivate varied, supportive connections — and prune what depletes you.",
    practices: [
      "Observe before intervening — understand relationship dynamics before trying to change them",
      "Stack functions — look for relationships that meet multiple needs (support, joy, growth)",
      "Honor edges — the most growth happens at the boundaries between different life areas"
    ],
    affirmation: "I cultivate relationships that nourish mutual growth."
  },
  {
    id: "fair-share",
    title: "Fair Share → Sustainable Giving",
    icon: Recycle,
    color: "var(--accent)",
    principle: "Return the Surplus",
    translation: "Give from overflow, not depletion",
    insight: "A healthy ecosystem doesn't give until it's empty — it gives from abundance. You cannot pour from an empty cup.",
    practices: [
      "Only give what you can regenerate — not what depletes your core reserves",
      "Notice when 'helping' becomes self-sacrifice disguised as virtue",
      "Trust that by filling yourself first, you have more to genuinely offer"
    ],
    affirmation: "I give from my overflow, not my reserves. Full cups pour freely."
  }
];

const DESIGN_PRINCIPLES = [
  {
    id: "observe",
    title: "Observe and Interact",
    icon: Eye,
    description: "Before making changes, observe patterns in your life, emotions, and relationships without judgment.",
    practice: "Spend one week simply noticing your emotional patterns without trying to fix them. What rhythms emerge?"
  },
  {
    id: "slow-solutions",
    title: "Use Slow & Small Solutions",
    icon: Clock,
    description: "Real change happens gradually. Sustainable healing is slow healing.",
    practice: "Choose one tiny practice you can sustain daily. A 2-minute check-in is better than an abandoned 30-minute routine."
  },
  {
    id: "yield",
    title: "Obtain a Yield",
    icon: Sprout,
    description: "Every healing practice should produce something nourishing — even if it's just a moment of peace.",
    practice: "After each wellness activity, ask: 'What did this give me?' Gratitude, calm, clarity, or simply a pause all count."
  },
  {
    id: "edges",
    title: "Use Edges & Value the Marginal",
    icon: Layers,
    description: "The edges of your comfort zone, between healing and growth, are where transformation happens.",
    practice: "Identify one 'edge' in your life — a boundary between who you are and who you're becoming. Tend it gently."
  },
  {
    id: "diversity",
    title: "Use & Value Diversity",
    icon: Flower2,
    description: "A resilient inner life, like a resilient ecosystem, contains many different ways of coping and growing.",
    practice: "Build a diverse toolkit: breath work, movement, journaling, connection, rest. Don't rely on just one."
  },
  {
    id: "integrate",
    title: "Integrate Rather Than Segregate",
    icon: CircleDot,
    description: "Your emotions, body, mind, and spirit aren't separate systems — they're one interconnected ecology.",
    practice: "When addressing a problem, ask: 'How does this affect my body? My thoughts? My relationships? My spirit?'"
  }
];

const SEASONAL_WISDOM = [
  {
    season: "Spring",
    icon: Sprout,
    color: "from-green-400 to-emerald-500",
    theme: "New Beginnings",
    wisdom: "Like seeds, new habits need warmth, moisture, and patience. Don't force growth — create conditions.",
    question: "What wants to emerge in me right now?"
  },
  {
    season: "Summer",
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    theme: "Full Expression",
    wisdom: "Summer is for expansion and visibility. What you've cultivated internally is ready to be shared.",
    question: "Where am I ready to shine more fully?"
  },
  {
    season: "Autumn",
    icon: TreeDeciduous,
    color: "from-orange-400 to-red-500",
    theme: "Release & Harvest",
    wisdom: "Trees release leaves not from scarcity but from wisdom. What are you ready to let go of?",
    question: "What has served its purpose and can now be released?"
  },
  {
    season: "Winter",
    icon: Mountain,
    color: "from-slate-400 to-blue-500",
    theme: "Rest & Reflection",
    wisdom: "Under the snow, roots deepen and seeds dream. Rest is not inactivity — it's underground work.",
    question: "What is gestating in my stillness?"
  }
];

export default function PermacultureWellnessPage() {
  const [activeEthic, setActiveEthic] = useState(null);
  const [activePrinciple, setActivePrinciple] = useState(null);
  const [completedPractices, setCompletedPractices] = useState({});
  const [selectedSeason, setSelectedSeason] = useState(null);

  const handlePracticeComplete = (id) => {
    setCompletedPractices(prev => ({ ...prev, [id]: true }));
  };

  const completedCount = Object.keys(completedPractices).length;

  return (
    <LayoutWrapper>
      <Hero
        title="Permaculture for the Soul"
        subtitle="Apply nature's design principles to your inner landscape — sustainable healing, rooted growth"
        variant="wellness"
        data-testid="hero-permaculture-wellness"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-intro">
                  Your inner world is an ecosystem
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4" data-testid="text-intro">
                  Permaculture teaches us to work <em>with</em> nature, not against it. The same principles that create 
                  thriving gardens can create thriving minds. Sustainable wellness isn't about forcing change — 
                  it's about creating conditions where healing happens naturally.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Ecological thinking
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    Sustainable healing
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Systems wisdom
                  </span>
                </div>
              </div>
            </div>
          </div>

          {completedCount > 0 && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" data-testid="progress-indicator">
              <Sprout className="w-5 h-5" />
              <span className="text-sm font-medium">
                {completedCount} practice{completedCount !== 1 ? 's' : ''} cultivated
              </span>
            </div>
          )}

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-ethics">
            <Heart className="w-5 h-5 text-emerald-500" />
            The Three Ethics — Applied to Self
          </h3>

          <div className="space-y-4 mb-12">
            {PERMACULTURE_ETHICS.map((ethic) => {
              const Icon = ethic.icon;
              const isActive = activeEthic === ethic.id;
              const isComplete = completedPractices[ethic.id];

              return (
                <div
                  key={ethic.id}
                  className={`rounded-2xl border transition-all ${
                    isActive 
                      ? "border-emerald-400 bg-[var(--surface-elevated)] shadow-lg" 
                      : "border-[var(--border-subtle)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
                  }`}
                  data-testid={`card-ethic-${ethic.id}`}
                >
                  <button
                    onClick={() => setActiveEthic(isActive ? null : ethic.id)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    aria-expanded={isActive}
                    data-testid={`button-toggle-${ethic.id}`}
                  >
                    <div 
                      className="p-3 rounded-xl flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30"
                    >
                      <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {ethic.principle}
                        </span>
                        {isComplete && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {ethic.title}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {ethic.translation}
                      </p>
                    </div>
                    <ArrowRight 
                      className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isActive ? "rotate-90" : ""}`} 
                    />
                  </button>

                  {isActive && (
                    <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" data-testid={`content-${ethic.id}`}>
                      <div className="h-px bg-[var(--border-subtle)]" />
                      
                      <p className="text-[var(--text-primary)] italic" data-testid={`text-insight-${ethic.id}`}>
                        {ethic.insight}
                      </p>

                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                        <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
                          <Sprout className="w-4 h-4" />
                          Practices
                        </h5>
                        <ul className="space-y-2">
                          {ethic.practices.map((practice, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[var(--text-primary)]" data-testid={`text-practice-${ethic.id}-${idx}`}>
                              <Leaf className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[var(--surface-tertiary)] rounded-xl p-4 border-l-4 border-emerald-500">
                        <p className="text-[var(--text-primary)] font-medium text-center" data-testid={`text-affirmation-${ethic.id}`}>
                          "{ethic.affirmation}"
                        </p>
                      </div>

                      <Button
                        onClick={() => handlePracticeComplete(ethic.id)}
                        variant="secondary"
                        className="w-full"
                        data-testid={`button-complete-${ethic.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        I've reflected on this
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-principles">
            <CircleDot className="w-5 h-5 text-amber-500" />
            Design Principles for Inner Life
          </h3>

          <CardGrid columns={2}>
            {DESIGN_PRINCIPLES.map((principle) => {
              const Icon = principle.icon;
              const isActive = activePrinciple === principle.id;
              
              return (
                <Card 
                  key={principle.id} 
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => setActivePrinciple(isActive ? null : principle.id)}
                  data-testid={`card-principle-${principle.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--text-primary)] mb-1" data-testid={`heading-principle-${principle.id}`}>
                        {principle.title}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]" data-testid={`text-description-${principle.id}`}>
                        {principle.description}
                      </p>
                      {isActive && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 animate-in fade-in" data-testid={`text-practice-${principle.id}`}>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            <strong>Try this:</strong> {principle.practice}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </CardGrid>

          <div className="mt-12 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] p-6" data-testid="section-seasons">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Seasonal Wisdom
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Nature moves in cycles, and so do you. What season does your inner world feel like right now?
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {SEASONAL_WISDOM.map((season) => {
                const Icon = season.icon;
                const isSelected = selectedSeason === season.season;
                
                return (
                  <button
                    key={season.season}
                    onClick={() => setSelectedSeason(isSelected ? null : season.season)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${season.color} text-white border-transparent shadow-md`
                        : "border-[var(--border-subtle)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
                    }`}
                    data-testid={`button-season-${season.season.toLowerCase()}`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? "text-white" : "text-[var(--text-muted)]"}`} />
                    <span className={`font-medium ${isSelected ? "text-white" : "text-[var(--text-primary)]"}`}>
                      {season.season}
                    </span>
                    <span className={`text-xs block mt-1 ${isSelected ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                      {season.theme}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedSeason && (
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] animate-in fade-in slide-in-from-top-2" data-testid="seasonal-wisdom-content">
                {(() => {
                  const season = SEASONAL_WISDOM.find(s => s.season === selectedSeason);
                  return (
                    <>
                      <p className="text-[var(--text-primary)] mb-3" data-testid="text-seasonal-wisdom">
                        {season.wisdom}
                      </p>
                      <p className="text-[var(--text-secondary)] italic" data-testid="text-seasonal-question">
                        Reflection: <strong>{season.question}</strong>
                      </p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800" data-testid="section-closing">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Remember
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300 mb-3">
              In permaculture, we don't fight the land — we learn its patterns and work with them. 
              The same is true for your inner world.
            </p>
            <p className="text-emerald-700 dark:text-emerald-300 font-medium text-center italic">
              "You don't need to conquer yourself. You need to cultivate yourself."
            </p>
          </div>
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  );
}

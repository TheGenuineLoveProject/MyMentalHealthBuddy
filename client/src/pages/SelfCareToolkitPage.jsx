import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Heart, Sun, Moon, Droplets, Utensils, Move, Users, Palette, BookOpen, Music, CheckCircle2, Phone, Shield } from "lucide-react";
import SafetyFooter from "../components/ui/SafetyFooter";
import SEO from "@/components/SEO";
import { Hero } from "@/components/ui";
import { useReadingLevel } from "@/context/ReadingLevelContext";
import Microcopy from "@/components/Microcopy";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const SELFCARE_CLARITY = {
  what: "Holistic self-care activities for your whole being—body, mind, heart, and soul—organized into six wellness dimensions.",
  who: "Anyone wanting to build sustainable self-care routines that support their unique needs.",
  when: "Daily for small acts of kindness, or when you notice you've been neglecting your own needs.",
  why: "Self-care isn't selfish—it's essential. You deserve the same care you give to others.",
  howSteps: [
    "Start with Quick Self-Care if you only have a few minutes",
    "Choose a category that calls to you today",
    "Try one activity and check it off when complete",
    "Notice how small acts of self-care affect your wellbeing"
  ],
  whereLinkText: "Explore breathing exercises",
  whereHref: "/breathing-exercises"
};

const SELFCARE_EXAMPLES = [
  {
    level: "beginner",
    title: "Starting with one small act",
    situation: "You feel overwhelmed and don't know where to start with self-care.",
    action: "Choose one Quick Self-Care activity like taking 5 deep breaths or drinking a glass of water.",
    result: "You realize self-care doesn't have to be complicated—even 1 minute can make a difference."
  },
  {
    level: "intermediate",
    title: "Building a balanced routine",
    situation: "You tend to focus on one type of self-care (like exercise) while neglecting others.",
    action: "Choose one activity from a category you usually skip—perhaps Emotional Care or Spiritual Care.",
    result: "You discover new ways to care for yourself and feel more balanced overall."
  },
  {
    level: "advanced",
    title: "Creating a sustainable practice",
    situation: "You want self-care to become a natural part of your daily life.",
    action: "Each day, intentionally choose activities from at least 2-3 different categories. Track what you complete.",
    result: "Over time, self-care becomes automatic rather than something you have to remember to do."
  }
];

const toolkitCategories = [
  {
    id: "physical",
    name: "Physical Care",
    icon: Move,
    description: "Nurture your body with movement, rest, and nourishment",
    activities: [
      { name: "Take a gentle walk outside", time: "15-30 min", benefit: "May help boost mood and energy" },
      { name: "Stretch your body slowly", time: "5-10 min", benefit: "May help release tension" },
      { name: "Take a warm bath or shower", time: "15-20 min", benefit: "May help relax muscles and mind" },
      { name: "Get 7-9 hours of sleep", time: "Overnight", benefit: "Supports body and brain restoration" },
      { name: "Dance to your favorite song", time: "3-5 min", benefit: "Some people find this releases endorphins" },
      { name: "Practice yoga or tai chi", time: "20-30 min", benefit: "May help balance body and mind" }
    ]
  },
  {
    id: "emotional",
    name: "Emotional Care",
    icon: Heart,
    description: "Honor your feelings and cultivate emotional wellness",
    activities: [
      { name: "Journal your thoughts and feelings", time: "10-15 min", benefit: "May help process emotions" },
      { name: "Have a good cry if needed", time: "As needed", benefit: "Some find this releases emotional tension" },
      { name: "Practice self-compassion phrases", time: "5 min", benefit: "May help soothe inner critic" },
      { name: "Set a boundary that protects your peace", time: "Varies", benefit: "Supports self-respect" },
      { name: "Watch something that makes you laugh", time: "20-60 min", benefit: "May help lift mood naturally" },
      { name: "Validate your own feelings out loud", time: "2 min", benefit: "Supports emotional awareness" }
    ]
  },
  {
    id: "social",
    name: "Social Care",
    icon: Users,
    description: "Connect with others and nurture meaningful relationships",
    activities: [
      { name: "Call or text someone you care about", time: "5-30 min", benefit: "May help strengthen bonds" },
      { name: "Schedule quality time with a friend", time: "1-2 hrs", benefit: "Supports deeper connection" },
      { name: "Join an online or local community group", time: "Varies", benefit: "May help create belonging" },
      { name: "Practice active listening with someone", time: "10-20 min", benefit: "May improve relationships" },
      { name: "Send a gratitude message to someone", time: "5 min", benefit: "Some find this spreads positivity" },
      { name: "Set healthy relationship boundaries", time: "Varies", benefit: "Helps protect your energy" }
    ]
  },
  {
    id: "mental",
    name: "Mental Care",
    icon: BookOpen,
    description: "Stimulate and rest your mind in healthy ways",
    activities: [
      { name: "Read something inspiring", time: "15-30 min", benefit: "May help expand perspective" },
      { name: "Learn something new and fun", time: "20-60 min", benefit: "Supports confidence building" },
      { name: "Take a complete break from screens", time: "1-2 hrs", benefit: "May reduce mental fatigue" },
      { name: "Do a puzzle or brain game", time: "15-30 min", benefit: "May help sharpen focus" },
      { name: "Practice mindfulness meditation", time: "5-15 min", benefit: "Some find this calms racing thoughts" },
      { name: "Organize one small area of your space", time: "15-30 min", benefit: "May create mental clarity" }
    ]
  },
  {
    id: "spiritual",
    name: "Spiritual Care",
    icon: Sparkles,
    description: "Connect with meaning, purpose, and something greater",
    activities: [
      { name: "Spend time in nature", time: "20-60 min", benefit: "Many find this grounds and inspires" },
      { name: "Practice gratitude reflection", time: "5-10 min", benefit: "May help shift perspective" },
      { name: "Meditate or pray", time: "10-20 min", benefit: "Some find this connects to inner peace" },
      { name: "Reflect on your values and purpose", time: "15-30 min", benefit: "May help clarify direction" },
      { name: "Do something creative without judgment", time: "20-60 min", benefit: "Supports self-expression" },
      { name: "Practice forgiveness (self or others)", time: "Varies", benefit: "Some find this releases heavy energy" }
    ]
  },
  {
    id: "sensory",
    name: "Sensory Care",
    icon: Music,
    description: "Soothe your senses with pleasant experiences",
    activities: [
      { name: "Listen to calming or uplifting music", time: "15-30 min", benefit: "May help regulate nervous system" },
      { name: "Light a scented candle or use aromatherapy", time: "Ongoing", benefit: "May create calm atmosphere" },
      { name: "Enjoy a favorite healthy snack mindfully", time: "10 min", benefit: "Supports grounding in pleasure" },
      { name: "Wrap yourself in a soft blanket", time: "As needed", benefit: "Some find this provides comfort" },
      { name: "Look at beautiful art or nature photos", time: "5-15 min", benefit: "May inspire and soothe" },
      { name: "Give yourself a hand or foot massage", time: "5-10 min", benefit: "May help release tension" }
    ]
  }
];

const quickSelfCare = [
  { name: "Take 5 deep breaths", icon: Droplets, time: "1 min" },
  { name: "Drink a glass of water", icon: Droplets, time: "1 min" },
  { name: "Step outside briefly", icon: Sun, time: "2 min" },
  { name: "Stretch your neck and shoulders", icon: Move, time: "2 min" },
  { name: "Say one kind thing to yourself", icon: Heart, time: "30 sec" },
  { name: "Look at something beautiful", icon: Palette, time: "1 min" }
];

const HERO_COPY = {
  beginner: {
    title: "Gentle tools for",
    titleHighlight: "self-care.",
    subtitle: "Small acts of kindness toward yourself can make a real difference. Pick what feels right for you today.",
    helperLine: "You can stop or skip anything at any time."
  },
  intermediate: {
    title: "Your personal",
    titleHighlight: "self-care toolkit.",
    subtitle: "Holistic self-care activities for your whole being—body, mind, heart, and soul. Some people find these helpful for daily wellbeing.",
    helperLine: "Take breaks whenever you need them."
  },
  advanced: {
    title: "Comprehensive",
    titleHighlight: "self-care practice.",
    subtitle: "Evidence-informed activities across six dimensions of wellness. Build a sustainable self-care routine that supports your unique needs.",
    helperLine: "These are self-care practices, not medical treatment."
  }
};

function ActivityCard({ activity, onToggle, isCompleted }) {
  return (
  <WellnessPageShell
    title="SelfCareToolkitPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
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

    <button
      onClick={onToggle}
      className="w-full text-left p-4 rounded-xl transition-all"
      style={{ 
        background: isCompleted ? 'var(--glp-sage-10)' : 'var(--glp-paper)',
        border: isCompleted ? '2px solid var(--glp-sage)' : '1px solid var(--glp-sage-15)'
      }}
      data-testid={`button-activity-${activity.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-start gap-3">
        <div 
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ 
            background: isCompleted ? 'var(--glp-sage)' : 'transparent',
            border: isCompleted ? 'none' : '2px solid var(--glp-sage-30)',
            color: 'white'
          }}
        >
          {isCompleted && <CheckCircle2 className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <h4 className="font-medium" style={{ color: 'var(--glp-sage-deep)' }}>
            {activity.name}
          </h4>
          <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: 'var(--glp-ink)' }}>
            <span>{activity.time}</span>
            <span>•</span>
            <span>{activity.benefit}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function SelfCareToolkitPage() {
  const [selectedCategory, setSelectedCategory] = useState(toolkitCategories[0]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const { readingLevel } = useReadingLevel();
  const heroCopy = HERO_COPY[readingLevel] || HERO_COPY.beginner;

  const toggleActivity = (activityName) => {
    setCompletedActivities(prev =>
      prev.includes(activityName) 
        ? prev.filter(a => a !== activityName) 
        : [...prev, activityName]
    );
  };

  const categoryCompleted = selectedCategory.activities.filter(a => 
    completedActivities.includes(a.name)
  ).length;

  return (
    <>
      <SEO 
        title="Self-Care Toolkit - The Genuine Love Project" 
        description="Holistic self-care activities for your whole being—body, mind, heart, and soul. Evidence-informed practices for daily wellbeing."
      />
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-gold-10) 100%)' }}>
        <Hero
          eyebrow="Wellness Practice"
          title={heroCopy.title}
          titleHighlight={heroCopy.titleHighlight}
          subtitle={heroCopy.subtitle}
          helperLine={heroCopy.helperLine}
        />

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <p className="text-center text-sm text-[var(--glp-ink)]/60 italic mb-8">
            <Microcopy slot="consent" seed="self-care-toolkit" as="span" />
          </p>
          
          <BenefitsBlock
            benefits={[
              "6 self-care categories for body, mind, heart, and soul",
              "Quick self-care activities under 5 minutes",
              "Track your daily self-care activities"
            ]}
            duration="5–30 min per activity"
            control="Pause or stop anytime—only do what feels safe"
            disclaimer="Educational wellness support—not therapy. If you need crisis help, visit"
            crisisLink="/crisis"
            variant="minimal"
            className="mb-8"
          />

          <ClarityCard {...SELFCARE_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={SELFCARE_EXAMPLES} 
            title="See how others approach self-care"
            className="mb-8"
          />

          <div className="rounded-2xl p-6 mb-12" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Quick Self-Care (Under 5 Minutes)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickSelfCare.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleActivity(item.name)}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{ 
                    background: completedActivities.includes(item.name) ? 'var(--glp-sage-10)' : 'var(--glp-sage-10)',
                    border: completedActivities.includes(item.name) ? '2px solid var(--glp-sage)' : '1px solid transparent'
                  }}
                  data-testid={`button-quick-${idx}`}
                >
                  <item.icon 
                    className="h-6 w-6 mx-auto mb-2" 
                    style={{ color: completedActivities.includes(item.name) ? 'var(--glp-sage)' : 'var(--glp-sage-30)' }}
                  />
                  <p 
                    className="text-sm"
                    style={{ color: completedActivities.includes(item.name) ? 'var(--glp-sage-deep)' : 'var(--glp-ink)' }}
                  >{item.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>{item.time}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {toolkitCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="p-4 rounded-xl text-center transition-all"
                style={{ 
                  background: selectedCategory.id === cat.id 
                    ? 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' 
                    : 'var(--glp-paper)',
                  color: selectedCategory.id === cat.id ? 'white' : 'var(--glp-ink)',
                  transform: selectedCategory.id === cat.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedCategory.id === cat.id ? '0 10px 30px var(--glp-sage-30)' : 'none',
                  border: selectedCategory.id === cat.id ? 'none' : '1px solid var(--glp-sage-15)'
                }}
                data-testid={`button-category-${cat.id}`}
              >
                <cat.icon 
                  className="h-8 w-8 mx-auto mb-2" 
                  style={{ color: selectedCategory.id === cat.id ? 'white' : 'var(--glp-sage-30)' }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: selectedCategory.id === cat.id ? 'white' : 'var(--glp-sage-deep)' }}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
                >
                  <selectedCategory.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{selectedCategory.name}</h2>
                  <p style={{ color: 'var(--glp-ink)' }}>{selectedCategory.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: 'var(--glp-sage)' }}>{categoryCompleted}</span>
                <span style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>/{selectedCategory.activities.length}</span>
                <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>completed</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedCategory.activities.map((activity, idx) => (
                <ActivityCard
                  key={idx}
                  activity={activity}
                  isCompleted={completedActivities.includes(activity.name)}
                  onToggle={() => toggleActivity(activity.name)}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 p-6 bg-[var(--glp-blush-50)] rounded-xl border border-[var(--glp-blush-100)]">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[var(--glp-sage-deep)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--glp-ink)]">
                  If you're in crisis or need immediate support
                </p>
                <p className="text-sm text-[var(--glp-ink)]/70 mt-1">
                  Call or text <strong>988</strong> (Suicide & Crisis Lifeline) or text <strong>HOME</strong> to <strong>741741</strong> (Crisis Text Line).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl p-8 text-center" style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-rose-20)' }}>
            <Heart className="h-10 w-10 mx-auto mb-4" style={{ color: 'var(--glp-blush)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Remember</h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Self-care isn't selfish—it's essential. Start with one small act of kindness toward yourself today.
              You deserve the same care you give to others.
            </p>
          </div>

          <div className="mt-8 p-4 bg-[var(--glp-sage-10)] rounded-lg text-center">
            <p className="text-sm text-[var(--glp-ink)]/70 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              These are self-care practices for general wellness, not medical treatment. Consult a healthcare provider for health concerns.
            </p>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </>
  </WellnessPageShell>
  );
}

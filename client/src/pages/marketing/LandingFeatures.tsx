import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Brain, 
  Shield,
  Sparkles,
  Users,
  Clock
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "AI Chat Companion",
    description: "Have meaningful conversations with a compassionate AI trained in trauma-informed approaches. Available 24/7, never judgmental.",
    color: "bg-teal-100 text-teal-600"
  },
  {
    icon: TrendingUp,
    title: "Mood & State Tracking",
    description: "Monitor your emotional patterns with intuitive tracking tools. Gain insights into what affects your wellbeing.",
    color: "bg-sage-100 text-sage-600"
  },
  {
    icon: BookOpen,
    title: "Guided Journaling",
    description: "Explore your thoughts with thoughtful prompts designed by mental health professionals. Process at your own pace.",
    color: "bg-gold-100 text-gold-600"
  },
  {
    icon: Heart,
    title: "Self-Care Toolkit",
    description: "Access breathing exercises, grounding techniques, affirmations, and calming scenes whenever you need support.",
    color: "bg-rose-100 text-rose-600"
  },
  {
    icon: Brain,
    title: "Cognitive Tools",
    description: "Reframe negative thoughts, identify patterns, and build healthier mental habits with structured exercises.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Shield,
    title: "Crisis Resources",
    description: "Immediate access to crisis hotlines (988, 741741) and grounding exercises when you need them most.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Sparkles,
    title: "Daily Wisdom",
    description: "Start each day with curated insights, affirmations, and gentle reminders to nurture your wellbeing.",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with others on similar journeys in a safe, moderated space. Share stories and find encouragement.",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Clock,
    title: "Progress Tracking",
    description: "Visualize your growth over time with streaks, milestones, and personalized insights into your healing journey.",
    color: "bg-emerald-100 text-emerald-600"
  }
];

export default function LandingFeatures() {
  return (
  <WellnessPageShell
    title="LandingFeatures"
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

    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sage-100 text-sage-700 text-sm font-medium mb-4">
            Comprehensive Wellness Tools
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
            Everything You Need to Heal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A complete toolkit designed with care by mental health professionals 
            and trauma-informed practitioners. Take what helps, leave what doesn't.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-sage-200 hover:shadow-lg transition-all duration-300"
                data-testid={`feature-card-${index}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            All tools are educational and supportive — not a replacement for professional care.
          </p>
        </div>
      </div>
    </section>
  </WellnessPageShell>
  );
}

import { Link } from "wouter";
import { ArrowLeft, Heart, Wind, Brain, Anchor, Sparkles, BookOpen, Sun, Moon, Shield, Users, Flower2, Library, Newspaper, HelpCircle, LifeBuoy, Palette, Activity, Microscope, Zap, Baby, MapPin, Target, Clock, RefreshCw, FileText, Lightbulb, MessageCircle, Compass } from "lucide-react";

const toolCategories = [
  {
    title: "Calm & Relaxation",
    description: "Find peace and reduce stress with these calming practices",
    color: "from-sky-400 to-blue-500",
    tools: [
      { name: "Calming Scenes", description: "Immersive nature environments for relaxation", href: "/calming-scenes", icon: Palette },
      { name: "Breathing Exercises", description: "Guided techniques to calm your nervous system", href: "/breathing", icon: Wind },
      { name: "Meditation Guide", description: "Step-by-step mindfulness practices", href: "/meditation", icon: Brain }
    ]
  },
  {
    title: "Emotional Support",
    description: "Tools to process and nurture your emotional wellbeing",
    color: "from-rose-400 to-pink-500",
    tools: [
      { name: "Grounding Techniques", description: "Anchor yourself in the present moment", href: "/grounding", icon: Anchor },
      { name: "Affirmations Library", description: "Positive statements for self-love and healing", href: "/affirmations", icon: Sparkles },
      { name: "Self-Care Toolkit", description: "Holistic activities for mind, body, and soul", href: "/self-care", icon: Heart }
    ]
  },
  {
    title: "Mind, Body & Soul",
    description: "Holistic approaches to complete wellbeing",
    color: "from-green-400 to-emerald-500",
    tools: [
      { name: "Body Wellness", description: "Somatic healing, movement, and nutrition", href: "/body-wellness", icon: Activity },
      { name: "Soul Wellness", description: "Meaning, purpose, and spiritual connection", href: "/soul-wellness", icon: Sparkles },
      { name: "Healing Journeys", description: "Structured multi-week transformation paths", href: "/healing-journeys", icon: MapPin }
    ]
  },
  {
    title: "Skills & Techniques",
    description: "Evidence-based methods for mental fitness",
    color: "from-amber-400 to-orange-500",
    tools: [
      { name: "Behavior Change", description: "Habit science and CBT techniques", href: "/behavior-change", icon: Target },
      { name: "Cognitive Tools", description: "Reframe thoughts and challenge patterns", href: "/cognitive-tools", icon: RefreshCw },
      { name: "Daily Routines", description: "Morning, midday, and evening protocols", href: "/daily-routines", icon: Clock }
    ]
  },
  {
    title: "Knowledge & Learning",
    description: "Understand yourself better with evidence-based resources",
    color: "from-indigo-400 to-purple-500",
    tools: [
      { name: "Content Library", description: "Browse all wellness content in one place", href: "/content-index", icon: Compass },
      { name: "Practical Examples", description: "Real scenarios with step-by-step solutions", href: "/examples", icon: Lightbulb },
      { name: "Q&A Center", description: "Answers to common wellness questions", href: "/qa", icon: MessageCircle },
      { name: "How-To Guides", description: "Step-by-step tool instructions", href: "/how-to-guides", icon: FileText },
      { name: "Research & Evidence", description: "The science behind healing practices", href: "/research", icon: Microscope },
      { name: "Wellness Glossary", description: "38 key terms with definitions", href: "/glossary-full", icon: BookOpen }
    ]
  },
  {
    title: "Support & Resources",
    description: "Get help when you need it most",
    color: "from-emerald-400 to-teal-500",
    tools: [
      { name: "FAQ", description: "Answers to common questions", href: "/faq", icon: HelpCircle },
      { name: "Professional Resources", description: "Find therapists and crisis support", href: "/resources", icon: Users },
      { name: "Support Center", description: "How to get the most from this platform", href: "/support", icon: LifeBuoy }
    ]
  }
];

const quickActions = [
  { name: "I need to calm down", href: "/breathing", icon: Wind, color: "bg-sky-500" },
  { name: "I'm feeling anxious", href: "/grounding", icon: Anchor, color: "bg-emerald-500" },
  { name: "I need encouragement", href: "/affirmations", icon: Sparkles, color: "bg-amber-500" },
  { name: "I want to meditate", href: "/meditation", icon: Moon, color: "bg-indigo-500" },
  { name: "I need self-care", href: "/self-care", icon: Heart, color: "bg-rose-500" },
  { name: "I'm in crisis", href: "/crisis", icon: Shield, color: "bg-red-500" }
];

const dailyPractices = [
  { time: "Morning", practice: "Start with intention setting meditation", href: "/meditation", icon: Sun },
  { time: "Midday", practice: "Take a breathing break", href: "/breathing", icon: Wind },
  { time: "Evening", practice: "Reflect with affirmations", href: "/affirmations", icon: Sparkles },
  { time: "Night", practice: "Wind down with calming scenes", href: "/calming-scenes", icon: Moon }
];

function ToolCard({ tool }) {
  return (
    <Link 
      href={tool.href}
      className="group flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 hover:shadow-lg transition-all hover:scale-102"
      data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
        <tool.icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
      </div>
      <div>
        <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
      </div>
    </Link>
  );
}

export default function WellnessHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 via-purple-500 to-indigo-500 text-white mb-6">
            <Flower2 className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Wellness Hub</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your central destination for healing, growth, and self-discovery. 
            Explore evidence-based tools designed to nurture your mind, body, and soul.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">How are you feeling? Quick access:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} text-white hover:opacity-90 transition-opacity`}
                data-testid={`link-quick-${action.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm font-medium text-center">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8 mb-12">
          {toolCategories.map((category, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white mb-4`}>
                <span className="font-medium">{category.title}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{category.description}</p>
              <div className="grid md:grid-cols-3 gap-4">
                {category.tools.map((tool, toolIdx) => (
                  <ToolCard key={toolIdx} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Suggested Daily Practice</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {dailyPractices.map((practice, idx) => (
              <Link
                key={idx}
                href={practice.href}
                className="group p-4 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-all"
                data-testid={`link-practice-${practice.time.toLowerCase()}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <practice.icon className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-slate-900 dark:text-white">{practice.time}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{practice.practice}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl p-8 mb-12">
          <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remember</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Healing is not linear. Every small step you take matters. You are worthy of love, 
            peace, and happiness—exactly as you are right now.
          </p>
        </div>

        <div className="text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            These tools support your wellness journey but are not a substitute for professional mental health care.
            If you're struggling, please reach out to a qualified professional.
          </p>
        </div>
      </div>
    </div>
  );
}

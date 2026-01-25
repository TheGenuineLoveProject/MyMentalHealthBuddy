import { Link } from "wouter";
import { ArrowLeft, Heart, Wind, Brain, Anchor, Sparkles, BookOpen, Sun, Moon, Shield, Users, Flower2, Library, Newspaper, HelpCircle, LifeBuoy, Palette, Activity, Microscope, Zap, Baby, MapPin, Target, Clock, RefreshCw, FileText, Lightbulb, MessageCircle, Compass } from "lucide-react";
import SafetyFooter from "../components/ui/SafetyFooter";

const toolCategories = [
  {
    title: "Calm & Relaxation",
    description: "Find peace and reduce stress with these calming practices",
    tools: [
      { name: "Calming Scenes", description: "Immersive nature environments for relaxation", href: "/calming-scenes", icon: Palette },
      { name: "Breathing Exercises", description: "Guided techniques to calm your nervous system", href: "/breathing", icon: Wind },
      { name: "Meditation Guide", description: "Step-by-step mindfulness practices", href: "/meditation", icon: Brain }
    ]
  },
  {
    title: "Emotional Support",
    description: "Tools to process and nurture your emotional wellbeing",
    tools: [
      { name: "Grounding Techniques", description: "Anchor yourself in the present moment", href: "/grounding", icon: Anchor },
      { name: "Affirmations Library", description: "Positive statements for self-love and healing", href: "/affirmations", icon: Sparkles },
      { name: "Self-Care Toolkit", description: "Holistic activities for mind, body, and soul", href: "/self-care", icon: Heart }
    ]
  },
  {
    title: "Mind, Body & Soul",
    description: "Holistic approaches to complete wellbeing",
    tools: [
      { name: "Body Wellness", description: "Somatic healing, movement, and nutrition", href: "/body-wellness", icon: Activity },
      { name: "Soul Wellness", description: "Meaning, purpose, and spiritual connection", href: "/soul-wellness", icon: Sparkles },
      { name: "Healing Journeys", description: "Structured multi-week transformation paths", href: "/healing-journeys", icon: MapPin }
    ]
  },
  {
    title: "Skills & Techniques",
    description: "Evidence-based methods for mental fitness",
    tools: [
      { name: "Behavior Change", description: "Habit science and CBT techniques", href: "/behavior-change", icon: Target },
      { name: "Cognitive Tools", description: "Reframe thoughts and challenge patterns", href: "/cognitive-tools", icon: RefreshCw },
      { name: "Daily Routines", description: "Morning, midday, and evening protocols", href: "/daily-routines", icon: Clock }
    ]
  },
  {
    title: "Knowledge & Learning",
    description: "Understand yourself better with evidence-based resources",
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
    tools: [
      { name: "FAQ", description: "Answers to common questions", href: "/faq", icon: HelpCircle },
      { name: "Professional Resources", description: "Find therapists and crisis support", href: "/resources", icon: Users },
      { name: "Support Center", description: "How to get the most from this platform", href: "/support", icon: LifeBuoy }
    ]
  }
];

const quickActions = [
  { name: "I need to calm down", href: "/breathing", icon: Wind },
  { name: "I'm feeling anxious", href: "/grounding", icon: Anchor },
  { name: "I need encouragement", href: "/affirmations", icon: Sparkles },
  { name: "I want to meditate", href: "/meditation", icon: Moon },
  { name: "I need self-care", href: "/self-care", icon: Heart },
  { name: "I'm in crisis", href: "/crisis", icon: Shield }
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
      className="group flex items-start gap-4 p-4 rounded-xl hover:shadow-lg transition-all hover:scale-102"
      style={{ background: 'var(--glp-paper)' }}
      data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="p-3 rounded-lg transition-colors"
        style={{ background: 'var(--glp-sage-10)' }}
      >
        <tool.icon className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
      </div>
      <div>
        <h4 className="font-medium transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
          {tool.name}
        </h4>
        <p className="text-sm" style={{ color: 'var(--glp-ink)' }}>{tool.description}</p>
      </div>
    </Link>
  );
}

export default function WellnessHubPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-teal-50) 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 transition-colors mb-8 hover:opacity-80" 
          style={{ color: 'var(--glp-sage)' }}
          data-testid="link-back-home"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
          >
            <Flower2 className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Wellness Hub</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
            Your central destination for healing, growth, and self-discovery. 
            Explore evidence-based tools designed to nurture your mind, body, and soul.
          </p>
        </div>

        <div className="rounded-2xl p-6 mb-12" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-15)' }}>
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--glp-sage-deep)' }}>How are you feeling? Quick access:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
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
            <div key={idx} className="rounded-2xl p-6 shadow-sm" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-4"
                style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
              >
                <span className="font-medium">{category.title}</span>
              </div>
              <p className="mb-6" style={{ color: 'var(--glp-ink)' }}>{category.description}</p>
              <div className="grid md:grid-cols-3 gap-4">
                {category.tools.map((tool, toolIdx) => (
                  <ToolCard key={toolIdx} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-gold-10)', border: '1px solid var(--glp-gold-30)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Suggested Daily Practice</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {dailyPractices.map((practice, idx) => (
              <Link
                key={idx}
                href={practice.href}
                className="group p-4 rounded-xl hover:shadow-md transition-all"
                style={{ background: 'var(--glp-paper)' }}
                data-testid={`link-practice-${practice.time.toLowerCase()}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <practice.icon className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
                  <span className="font-medium" style={{ color: 'var(--glp-sage-deep)' }}>{practice.time}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--glp-ink)' }}>{practice.practice}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-rose-20)' }}>
          <Heart className="h-10 w-10 mx-auto mb-4" style={{ color: 'var(--glp-blush)' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Remember</h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
            Healing is not linear. Every small step you take matters. You are worthy of love, 
            peace, and happiness—exactly as you are right now.
          </p>
        </div>

        <SafetyFooter variant="default" />
      </div>
    </div>
  );
}

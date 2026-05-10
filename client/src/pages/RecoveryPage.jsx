import { Link } from "wouter";
import { ArrowLeft, Heart, Shield, Leaf, Waves, Brain, Sparkles, ChevronRight, Phone, Users, AlertCircle, Clock, Compass } from 'lucide-react';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/SafetyFooter";

const RECOVERY_AREAS = [
  {
    id: "emotional",
    name: "Emotional Healing",
    icon: Heart,
    description: "Processing grief, loss, and emotional wounds with gentle self-compassion",
    tools: [
      { name: "Grief & Loss Support", href: "/journal", description: "Guided prompts for processing loss" },
      { name: "Emotional Release", href: "/breathing", description: "Breathwork for releasing stored emotions" },
      { name: "Self-Compassion Practice", href: "/self-care", description: "Learning to treat yourself with kindness" }
    ],
    color: "rose"
  },
  {
    id: "stress",
    name: "Stress Recovery",
    icon: Shield,
    description: "Rebuilding after burnout, chronic stress, or overwhelming periods",
    tools: [
      { name: "Nervous System Reset", href: "/breathing", description: "Calming breathing techniques" },
      { name: "Grounding Practices", href: "/grounding", description: "Returning to safety in your body" },
      { name: "Boundaries Work", href: "/boundaries", description: "Learning to protect your energy" }
    ],
    color: "sage"
  },
  {
    id: "trauma",
    name: "Trauma-Informed Healing",
    icon: Brain,
    description: "Gentle, research-backed approaches to processing difficult experiences",
    tools: [
      { name: "Polyvagal Exercises", href: "/breathing", description: "Nervous system regulation" },
      { name: "Safe Grounding", href: "/grounding", description: "Anchor to the present moment" },
      { name: "Pendulation Practice", href: "/meditation", description: "Moving between safety and challenge" }
    ],
    color: "indigo"
  },
  {
    id: "relationship",
    name: "Relationship Recovery",
    icon: Users,
    description: "Healing from difficult relationships and rebuilding trust",
    tools: [
      { name: "Boundary Setting", href: "/boundaries", description: "Learning healthy limits" },
      { name: "Self-Worth Reflection", href: "/self-worth-reflection", description: "Rebuilding your sense of value" },
      { name: "Trust Restoration", href: "/journal", description: "Journaling for relationship healing" }
    ],
    color: "amber"
  }
];

const GENTLE_PRACTICES = [
  { name: "5-4-3-2-1 Grounding", duration: "2-3 min", href: "/grounding", description: "Use your senses to anchor to now" },
  { name: "Butterfly Hug", duration: "1-2 min", href: "/self-care", description: "Cross arms, tap alternating shoulders gently" },
  { name: "Box Breathing", duration: "3-5 min", href: "/breathing", description: "4-4-4-4 pattern for calm" },
  { name: "Safe Place Visualization", duration: "5-10 min", href: "/meditation", description: "Create an internal sanctuary" },
  { name: "Body Scan", duration: "10-15 min", href: "/meditation", description: "Notice sensations without judgment" },
  { name: "Compassionate Touch", duration: "1-2 min", href: "/self-care", description: "Hand on heart, gentle pressure" }
];

const RECOVERY_PRINCIPLES = [
  { icon: Clock, title: "Pace Yourself", description: "Healing happens in its own time. There's no rush." },
  { icon: Shield, title: "Safety First", description: "Only explore what feels safe. You can always stop." },
  { icon: Heart, title: "Self-Compassion", description: "Treat yourself as you would a dear friend." },
  { icon: Compass, title: "Trust Your Wisdom", description: "Your body and mind know what they need." }
];

function RecoveryAreaCard({ area }) {
  const Icon = area.icon;
  
  const colorClasses = {
    rose: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800",
    sage: "from-sage-50 to-green-50 dark:from-sage-900/20 dark:to-green-900/20 border-sage-200 dark:border-sage-800",
    indigo: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800",
    amber: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800"
  };
  
  const iconColors = {
    rose: "text-rose-500",
    sage: "text-sage-500",
    indigo: "text-indigo-500",
    amber: "text-amber-500"
  };
  
  return (
    <div 
      className={`rounded-2xl bg-gradient-to-br ${colorClasses[area.color]} border p-6`}
      data-testid={`recovery-area-${area.id}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${iconColors[area.color]}`} />
        </div>
        <div>
          <h3 className="font-playfair text-lg text-slate-800 dark:text-slate-200">{area.name}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{area.description}</p>
      
      <div className="space-y-3">
        {area.tools.map((tool, idx) => (
          <Link key={idx} href={tool.href}>
            <div className="p-3 rounded-lg bg-white/60 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/30 cursor-pointer transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{tool.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function GentlePracticeCard({ practice }) {
  return (
    <Link href={practice.href}>
      <div 
        className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sage-300 dark:hover:border-sage-600 hover:shadow-md cursor-pointer transition-all"
        data-testid={`gentle-practice-${practice.name.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-slate-800 dark:text-slate-200">{practice.name}</h4>
          <span className="text-xs text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/30 px-2 py-1 rounded-full">
            {practice.duration}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{practice.description}</p>
      </div>
    </Link>
  );
}

export default function RecoveryPage() {
  useSEO({
    title: "Healing & Recovery Resources | The Genuine Love Project",
    description: "Gentle, trauma-informed resources for emotional healing, stress recovery, and rebuilding after difficult experiences."
  });
  
  return (
    <WellnessPageShell>
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-6 cursor-pointer" data-testid="back-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </span>
          </Link>
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 text-sm font-medium tracking-wider uppercase mb-3">
              <Leaf className="w-4 h-4" />
              Healing & Recovery
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl text-slate-800 dark:text-slate-100 mb-3">
              Gentle Paths to <span className="text-sage-600 dark:text-sage-400 italic">Healing</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Recovery is not about "getting over" things—it's about integrating experiences 
              and rebuilding your sense of safety and wholeness.
            </p>
          </header>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">A Gentle Reminder</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                These tools are educational wellness resources, not therapy. If you're experiencing significant distress, 
                please reach out to a mental health professional.{" "}
                <Link href="/crisis" className="underline font-medium">Crisis resources are available here.</Link>
              </p>
            </div>
          </div>
          
          <section className="mb-12">
            <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-sage-500" />
              Guiding Principles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RECOVERY_PRINCIPLES.map((principle, idx) => {
                const Icon = principle.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <Icon className="w-6 h-6 text-sage-500 mb-2" />
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">{principle.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{principle.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              Recovery Areas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {RECOVERY_AREAS.map(area => (
                <RecoveryAreaCard key={area.id} area={area} />
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Waves className="w-6 h-6 text-indigo-500" />
              Gentle Practices for Anytime
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GENTLE_PRACTICES.map((practice, idx) => (
                <GentlePracticeCard key={idx} practice={practice} />
              ))}
            </div>
          </section>
          
          <div className="bg-gradient-to-r from-sage-100 to-cream-100 dark:from-sage-900/30 dark:to-slate-800 rounded-2xl p-8 text-center mb-12">
            <Sparkles className="w-8 h-8 text-sage-600 dark:text-sage-400 mx-auto mb-4" />
            <h3 className="font-playfair text-xl text-slate-800 dark:text-slate-200 mb-2">
              You Are Healing
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-4">
              Even when it doesn't feel like it, every small step matters. 
              Your presence here is an act of courage.
            </p>
            <Link href="/crisis">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-sage-700 dark:text-sage-300 rounded-xl font-medium hover:shadow-md transition-all" data-testid="crisis-link">
                <Phone className="w-4 h-4" />
                Access Crisis Support
              </button>
            </Link>
          </div>
          
          <SafetyFooter />
        </div>
      </div>
    </WellnessPageShell>
  );
}

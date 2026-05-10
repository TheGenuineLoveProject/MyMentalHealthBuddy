import { Link } from "wouter";
import { MessageCircle, ArrowLeft, Heart, Sparkles, Brain, Sun, Cloud, Leaf, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const CONVERSATION_STARTERS = [
  {
    icon: Heart,
    title: "Emotional Check-in",
    prompt: "I'd like to talk about how I'm feeling",
    color: "blush"
  },
  {
    icon: Brain,
    title: "Process Thoughts",
    prompt: "Help me work through something on my mind",
    color: "teal"
  },
  {
    icon: Sun,
    title: "Find Gratitude",
    prompt: "Guide me through a gratitude practice",
    color: "gold"
  },
  {
    icon: Leaf,
    title: "Stress Relief",
    prompt: "I need help calming down",
    color: "sage"
  }
];

const FEATURES = [
  "Compassionate, judgment-free support",
  "Evidence-based therapeutic techniques",
  "Available 24/7 whenever you need",
  "Completely private and confidential"
];

export default function ChatEmpty() {
  useSEO({
    title: "Start AI Chat",
    description: "Begin a supportive conversation with our AI wellness companion for emotional guidance.",
    noIndex: true
  });

  return (
  <WellnessPageShell
    title="ChatEmpty"
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

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </header>

          <div className="text-center mb-12">
            <div className="icon-container icon-xl icon-gradient-teal mx-auto mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h1 className="text-display-lg text-teal mb-3" data-testid="text-page-title">Hello, friend</h1>
            <p className="text-lead max-w-xl mx-auto">
              I'm your AI companion, here to listen without judgment and support you on your wellness journey.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-heading-md text-teal text-center mb-6">How can I help you today?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {CONVERSATION_STARTERS.map((starter, i) => (
                <Link 
                  key={i} 
                  href="/chat"
                  className="card-bordered hover:shadow-md transition-shadow group cursor-pointer block"
                  data-testid={`starter-${i}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`icon-container icon-lg icon-soft-${starter.color}`}>
                      <starter.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-heading-sm text-teal group-hover:text-[var(--teal-600)] transition">{starter.title}</h3>
                      <p className="text-body-sm text-[var(--sage-500)]">{starter.prompt}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--sage-400)] group-hover:text-[var(--teal-500)] transition" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="card-glass mb-12">
            <div className="flex items-start gap-4">
              <div className="icon-container icon-lg icon-soft-gold flex-shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-heading-md text-teal mb-3">What makes me different</h3>
                <ul className="space-y-2">
                  {FEATURES.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-body-sm">
                      <Heart className="h-4 w-4 text-[var(--blush-500)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="text-center">
            <div className="card-bordered bg-[var(--sage-50)] inline-block">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-md icon-soft-teal">
                  <Cloud className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-body-sm font-medium">Feeling in crisis?</p>
                  <Link href="/crisis" className="text-[var(--teal-600)] hover:text-[var(--teal-700)] text-body-sm" data-testid="link-crisis">
                    Access immediate support resources →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center mt-12">
            <p className="text-caption flex items-center justify-center gap-1">
              <Heart className="h-4 w-4 text-[var(--blush-500)]" />
              Your conversations are always private and encrypted
            </p>
          </footer>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}

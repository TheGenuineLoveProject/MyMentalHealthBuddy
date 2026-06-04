import { useState } from "react";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { MIPromptCard } from "@/components/mi/MIPromptCard";
import { Brain, Heart, Shield, Sparkles, CheckCircle, ArrowRight, Activity, Phone, Hand, Volume2, Wind, Anchor, Zap } from 'lucide-react';
import { SEO } from "@/components/SEO";

const OVERWHELM_SIGNS = [
  "your body is in fight/flight",
  "your thoughts are fragmenting",
  "your system is trying to make sense too fast",
  "old trauma + insight + stress are stacking"
];

const CHILDHOOD_ADAPTATIONS = [
  "you weren't safe",
  "adults were unpredictable",
  "honesty got punished",
  "you had to read people to survive"
];

const WHO_YOU_ARE = [
  { text: "a trauma-adapted human", icon: Heart },
  { text: "with high pattern recognition", icon: Brain },
  { text: "and a nervous system trained for threat", icon: Activity },
  { text: "who never got relief or protection", icon: Shield }
];

const DYSREGULATION_LOOP = [
  "noticing patterns",
  "feeling them in your body",
  "trying to explain them morally or existentially",
  "getting overwhelmed",
  "questioning yourself"
];

const GROUNDING_STEPS = [
  {
    step: 1,
    instruction: "Put one hand on something solid (chair, bed, wall).",
    icon: Hand
  },
  {
    step: 2,
    instruction: "Name out loud:",
    details: [
      "one thing you can see",
      "one thing you can hear",
      "one thing you can feel physically"
    ],
    icon: Volume2
  },
  {
    step: 3,
    instruction: "Take one slow breath out (longer out than in).",
    icon: Wind
  }
];

export default function NervousSystemFloodingPage() {
  const [groundingStep, setGroundingStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});

  const handleCompleteStep = (step) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
    if (step < 3) {
      setGroundingStep(step + 1);
    }
  };

  const allStepsCompleted = Object.keys(completedSteps).length === 3;

  return (
  <WellnessPageShell
    title="NervousSystemFloodingPage"
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
      <SEO title="Nervous System Flooding — MyMentalHealthBuddy" description="Understand and work with nervous system responses." />


    <LayoutWrapper>
      <Hero
        title="Nervous System Flooding"
        subtitle="What you're feeling is not a revelation about who you are — it's your nervous system flooding"
        variant="wellness"
        data-testid="hero-flooding"
      />
      
      <SectionContainer>
        <BenefitsBlock
          benefit="Grounding, calm, and understanding what's happening in your body"
          duration="5–15 minutes"
          control="Go at your own pace — this is not a test"
          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />
      </SectionContainer>

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 mb-8" data-testid="section-intro">
            <p className="text-xl font-medium text-amber-800 dark:text-amber-200 mb-4">
              Hey. I'm going to slow this way down with you right now.
            </p>
            <p className="text-amber-700 dark:text-amber-300 mb-4">
              What you're feeling is not a revelation about who you are — it's your nervous system flooding.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Nothing mystical.", "Nothing ominous.", "Nothing broken."].map((text, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-sm font-medium"
                  data-testid={`badge-truth-${idx}`}
                >
                  {text}
                </span>
              ))}
            </div>
            <p className="mt-4 text-amber-800 dark:text-amber-200 font-medium">
              Just too much at once.
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 mb-8" data-testid="safety-note">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
                  When conversations get this intense and identity-fragmenting, you need live human support — 
                  not because you're weak, but because your system is overloaded.
                </p>
                <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
                  If you're in the U.S., you can call or text <strong>988</strong> right now. You don't have to be suicidal. 
                  You can say exactly what you just said:
                </p>
                <p className="text-sm text-rose-800 dark:text-rose-200 font-medium italic mb-2">
                  "I'm overwhelmed and disoriented and need help grounding."
                </p>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  They are trained for this exact state.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-whats-happening">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              First: what's happening right now
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              When someone asks:
            </p>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 mb-4">
              <p className="text-amber-800 dark:text-amber-200 italic">
                "What who why am I this way what the fuck"
              </p>
            </div>
            <p className="text-[var(--text-primary)] font-medium mb-4">
              That's a disorientation signal, not a philosophy question.
            </p>
            <p className="text-[var(--text-secondary)] mb-3">It usually means:</p>
            <div className="space-y-2 mb-4">
              {OVERWHELM_SIGNS.map((sign, idx) => (
                <div key={idx} className="flex items-center gap-2" data-testid={`sign-${idx}`}>
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[var(--text-primary)]">{sign}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700">
              <p className="text-violet-800 dark:text-violet-200 font-medium">
                This is overwhelm, not truth.
              </p>
              <p className="text-violet-700 dark:text-violet-300 mt-1">
                So before meaning, we need stability.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 mb-8" data-testid="section-grounding">
            <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <Anchor className="w-5 h-5" />
              Right now — do this with me (please)
            </h2>
            <p className="text-emerald-700 dark:text-emerald-300 mb-6">
              Not later. Now.
            </p>
            
            <div className="space-y-4">
              {GROUNDING_STEPS.map((item) => {
                const Icon = item.icon;
                const isCompleted = completedSteps[item.step];
                const isCurrent = groundingStep === item.step - 1 || groundingStep === 0;
                
                return (
                  <div 
                    key={item.step}
                    className={`p-4 rounded-xl transition-all ${
                      isCompleted 
                        ? "bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-400" 
                        : isCurrent 
                          ? "bg-white dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-600"
                          : "bg-white/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 opacity-60"
                    }`}
                    data-testid={`grounding-step-${item.step}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-emerald-200 dark:bg-emerald-800"}`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                          Step {item.step}: {item.instruction}
                        </p>
                        {item.details && (
                          <ul className="space-y-1 ml-4 mb-3">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="text-emerald-700 dark:text-emerald-300 text-sm">
                                • {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                        {!isCompleted && isCurrent && (
                          <Button
                            onClick={() => handleCompleteStep(item.step)}
                            variant="primary"
                            className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                            data-testid={`button-complete-step-${item.step}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            I did this
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {allStepsCompleted && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-center animate-in fade-in" data-testid="grounding-complete">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                  This is not symbolic. It tells your nervous system you are here and safe.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-simplest-truth">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              The simplest, truest answer (no jargon)
            </h2>
            <p className="text-lg text-[var(--text-primary)] font-medium mb-4">
              You are this way because you grew up in danger and had to adapt.
            </p>
            <p className="text-[var(--text-secondary)] mb-4">That's it.</p>
            
            <div className="space-y-2 mb-6">
              {[
                "Not because you're special.",
                "Not because you're cursed.",
                "Not because you \"see too much.\"",
                "Not because something is wrong with you."
              ].map((text, idx) => (
                <p key={idx} className="text-[var(--text-secondary)]">{text}</p>
              ))}
            </div>

            <p className="text-[var(--text-secondary)] mb-3">Because as a child:</p>
            <div className="space-y-2 mb-6">
              {CHILDHOOD_ADAPTATIONS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2" data-testid={`adaptation-${idx}`}>
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-[var(--text-primary)]">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500">
              <p className="text-violet-800 dark:text-violet-200 mb-2">Your brain learned:</p>
              <p className="text-violet-800 dark:text-violet-200 font-medium italic">
                "Scan everything. Understand everything. Stay ahead."
              </p>
              <p className="text-violet-700 dark:text-violet-300 mt-3">
                That adaptation kept you alive then. It's exhausting now.
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-who-you-are">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              WHO you are (grounded, accurate)
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">You are:</p>
            <div className="space-y-3 mb-4">
              {WHO_YOU_ARE.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-secondary)]" data-testid={`who-${idx}`}>
                    <Icon className="w-5 h-5 text-violet-500 flex-shrink-0" />
                    <span className="text-[var(--text-primary)]">{item.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                That's not an identity. That's a history.
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-experiencing">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              WHAT you are experiencing
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">Right now you're in a loop of:</p>
            <div className="space-y-2 mb-6">
              {DYSREGULATION_LOOP.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3" data-testid={`loop-${idx}`}>
                  <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xs font-medium text-violet-700 dark:text-violet-300">
                    {idx + 1}
                  </div>
                  <span className="text-[var(--text-primary)]">{item}</span>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700">
                <p className="text-rose-800 dark:text-rose-200 font-medium mb-1">
                  That loop feels like insight
                </p>
                <p className="text-rose-700 dark:text-rose-300 text-sm">
                  but it's actually dysregulation.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
                <p className="text-emerald-800 dark:text-emerald-200 font-medium mb-1">
                  Insight feels clear.
                </p>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  This feels panicked and fragmented.
                </p>
              </div>
            </div>
            <p className="text-[var(--text-primary)] font-medium mt-4 text-center">
              That's how we know the difference.
            </p>
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-why-intense">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              WHY it feels so intense
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">Because your system learned:</p>
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500 mb-4">
              <p className="text-violet-800 dark:text-violet-200 font-medium italic">
                "Understanding = safety"
              </p>
            </div>
            <p className="text-[var(--text-secondary)] mb-3">
              So when you feel unsafe now, your brain pushes:
            </p>
            <div className="space-y-2 mb-6">
              {["more analysis", "more meaning", "more self-questioning"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-violet-500" />
                  <span className="text-[var(--text-primary)]">{item}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                But analysis won't settle the body.
              </p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                Only regulation will.
              </p>
            </div>
          </div>

          <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-2xl border border-violet-200 dark:border-violet-800 mb-8" data-testid="section-sentence">
            <h2 className="text-xl font-semibold text-violet-800 dark:text-violet-200 mb-4">
              One sentence to hold onto
            </h2>
            <div className="p-4 rounded-xl bg-white dark:bg-violet-900/30 border-2 border-violet-300 dark:border-violet-600 text-center mb-4">
              <p className="text-xl font-bold text-violet-800 dark:text-violet-200">
                "I am overwhelmed right now — I do not need to define myself."
              </p>
            </div>
            <p className="text-violet-700 dark:text-violet-300 text-center">
              Say it. Even if you don't believe it yet.
            </p>
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-closing">
            <p className="text-[var(--text-secondary)] mb-4">
              I'm here, but I want to be responsible with you:
            </p>
            <p className="text-[var(--text-primary)] mb-4">
              I can help you ground, understand trauma patterns, and slow things down —
              I cannot be the only container when your system is this activated.
            </p>
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500 mb-4">
              <p className="text-violet-800 dark:text-violet-200 font-medium">
                You are not losing yourself.
              </p>
              <p className="text-violet-700 dark:text-violet-300">
                You are flooded.
              </p>
            </div>
            <p className="text-[var(--text-primary)] font-medium">
              Stay with me — but please also reach for live support right now if this continues to feel out of control.
            </p>
          </div>
        </div>
      </SectionContainer>

      <MIPromptCard context="general" className="mt-8 mb-6" />

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}

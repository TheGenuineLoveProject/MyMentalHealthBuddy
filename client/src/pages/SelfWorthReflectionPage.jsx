import { useState } from "react";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import { 
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
  Brain, 
  Heart, 
  Shield, 
  Sparkles,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Eye,
  Lightbulb,
  Activity,
  Phone,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const TRUTH_STATEMENTS = [
  {
    id: "meta-thinking",
    title: "Meta-thinking takes intelligence",
    icon: Brain,
    insight: "People who question themselves deeply, reflect on patterns of behavior, and care about integrity — that takes intelligence. The fact that you're examining your own thoughts is proof of a sophisticated mind.",
    deeperTruth: "What you're doing right now — thinking about thinking — is called meta-cognition. It's one of the highest forms of intelligence. People who lack awareness don't question themselves this way."
  },
  {
    id: "punished-for-noticing",
    title: "You were punished for understanding, not for being wrong",
    icon: Eye,
    insight: "When someone grows up being punished for noticing, understanding, and naming patterns, the brain learns a protective shortcut: 'If I'm hurting this much, maybe I'm stupid.' That belief is protective, not accurate.",
    deeperTruth: "You were not beaten because you were stupid. You were not punished because you were wrong. You were not silenced because you lacked understanding. You were punished because you understood too much in an unsafe environment."
  },
  {
    id: "stress-response",
    title: "Confusion is a stress response, not a measure",
    icon: Activity,
    insight: "When the nervous system is overloaded, even very intelligent people feel confused, scattered, foggy, and ashamed. You wouldn't call someone stupid for limping after being injured. Your mind is doing the same thing.",
    deeperTruth: "Right now your system is flooded. That's not a measure of intelligence — that's a stress response. The fog will lift when your nervous system feels safe again."
  },
  {
    id: "carrying-alone",
    title: "The problem isn't your mind",
    icon: Heart,
    insight: "The problem is that your mind has been carrying too much alone for too long. Overwhelm is not the same as incapacity.",
    deeperTruth: "This does not make you superior. It does not make you broken. It makes you someone whose nervous system learned to survive. And now it can learn something new."
  }
];

const CLEAR_GROUNDING_TRUTHS = [
  "You were not beaten because you were stupid",
  "You were not punished because you were wrong", 
  "You were not silenced because you lacked understanding",
  "You were punished because you understood too much in an unsafe environment"
];

const REFRAME_PRACTICES = [
  {
    old: "Am I stupid?",
    new: "I am overwhelmed, not unintelligent.",
    guidance: "Say it slowly. Even if you don't believe it yet.",
    primary: true
  },
  {
    old: "Why can't I figure this out?",
    new: "My nervous system is in protection mode. Clarity will return.",
    guidance: "Clarity requires calm. You can't think clearly while your body is bracing.",
    primary: false
  },
  {
    old: "Everyone else seems to handle things better.",
    new: "I'm carrying invisible weight. I don't know what others are carrying either.",
    guidance: "Comparison without context is always unfair — especially to yourself.",
    primary: false
  },
  {
    old: "I should know better by now.",
    new: "Healing isn't linear. Today I'm doing what I can.",
    guidance: "Knowledge and capacity are different things. You can know something and still struggle.",
    primary: false
  }
];

const SIGNS_OF_INTELLIGENCE = [
  { text: "Question themselves this deeply", icon: Brain },
  { text: "Reflect on patterns of behavior", icon: RefreshCw },
  { text: "Care about integrity and truth", icon: Shield },
  { text: "Try to understand why things happened", icon: Lightbulb },
  { text: "Worry about the impact of their words and actions", icon: MessageCircle }
];

const WHAT_I_SEE = [
  { text: "Perceptive", icon: Eye },
  { text: "Thoughtful", icon: Brain },
  { text: "Morally serious", icon: Shield },
  { text: "Emotionally intelligent", icon: Heart },
  { text: "Trying very hard to be accurate and good", icon: Sparkles }
];

export default function SelfWorthReflectionPage() {
  const [activeTruth, setActiveTruth] = useState(null);
  const [activeReframe, setActiveReframe] = useState(null);
  const [acknowledged, setAcknowledged] = useState({});
  const [currentFeeling, setCurrentFeeling] = useState(null);

  const handleAcknowledge = (id) => {
    setAcknowledged(prev => ({ ...prev, [id]: true }));
  };

  const acknowledgedCount = Object.keys(acknowledged).length;

  return (
  <WellnessPageShell
    title="SelfWorthReflectionPage"
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

    <LayoutWrapper>
      <Hero
        title="Self-Worth Reflection"
        subtitle="When self-doubt speaks loudly, let truth speak louder — you are not what your pain told you"
        variant="wellness"
        data-testid="hero-self-worth"
      />
      
      <SectionContainer>
        <BenefitsBlock
          benefit="Reframing self-doubt, reclaiming your intelligence, and gentle truth"
          duration="10–15 minutes"
          control="Take what helps — skip what doesn't fit"
          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />
      </SectionContainer>

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-2xl border border-violet-200 dark:border-violet-800 mb-8" data-testid="section-intro">
            <p className="text-2xl font-bold text-violet-800 dark:text-violet-200 mb-4" data-testid="text-answer">
              No. You are not stupid.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
              And I want to answer this in a way that really lands, not just comfort-talk.
            </p>
          </div>

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-why">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4" data-testid="heading-why">
              Why this question is coming up now
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              When someone grows up being punished for noticing, understanding, naming patterns, and telling the truth — 
              their brain learns a shortcut:
            </p>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 mb-4">
              <p className="text-amber-800 dark:text-amber-200 italic">
                "If I'm hurting this much, maybe I'm stupid."
              </p>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              That belief is protective, not accurate.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              It shifts blame away from the people who hurt you and puts it on you, because as a child that felt safer.
            </p>
            <p className="text-[var(--text-primary)] font-medium">
              So this question isn't really about intelligence. It's about self-doubt born from abuse.
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 mb-8" data-testid="safety-note">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
                  If at any point this conversation starts to feel too intense, confusing, or destabilizing, 
                  it's really important to loop in live human support — not because you're weak, but because 
                  what you went through was real.
                </p>
                <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
                  If you're in the U.S., you can call or text <strong>988</strong> for immediate, calm support. 
                  They are there for moments of emotional overload like this.
                </p>
                <p className="text-sm text-rose-800 dark:text-rose-200 font-medium">
                  You don't have to figure this out all at once. And you don't have to define yourself by a 
                  question that came from pain.
                </p>
              </div>
            </div>
          </div>

          {acknowledgedCount > 0 && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300" data-testid="progress-indicator">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">
                {acknowledgedCount} truth{acknowledgedCount !== 1 ? 's' : ''} acknowledged
              </span>
            </div>
          )}

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-people-who">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-signs">
              People who are stupid do not:
            </h3>
            <div className="space-y-3">
              {SIGNS_OF_INTELLIGENCE.map((sign, idx) => {
                const Icon = sign.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--surface-secondary)] flex items-center gap-3"
                    data-testid={`card-sign-${idx}`}
                  >
                    <Icon className="w-5 h-5 text-violet-500 flex-shrink-0" />
                    <span className="text-[var(--text-primary)]">{sign.text}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[var(--text-primary)] font-medium">
              What you're doing right now is meta-thinking — thinking about thinking. That takes intelligence.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 mb-10" data-testid="section-what-i-see">
            <h3 className="text-lg font-medium text-emerald-800 dark:text-emerald-200 mb-4" data-testid="heading-what-i-see">
              Let me reflect what I actually see
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300 mb-4">I see someone who is:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {WHAT_I_SEE.map((quality, idx) => {
                const Icon = quality.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-white/50 dark:bg-emerald-900/30 flex items-center gap-2"
                    data-testid={`card-quality-${idx}`}
                  >
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-emerald-800 dark:text-emerald-200">{quality.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-emerald-200 dark:border-emerald-700">
              <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                The problem is not your mind. It's that your mind has been carrying too much alone for too long.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-truths">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Truths to Remember
          </h3>

          <div className="space-y-4 mb-12">
            {TRUTH_STATEMENTS.map((truth) => {
              const Icon = truth.icon;
              const isActive = activeTruth === truth.id;
              const isAcknowledged = acknowledged[truth.id];

              return (
                <div
                  key={truth.id}
                  className={`rounded-2xl border transition-all ${
                    isActive 
                      ? "border-violet-400 bg-[var(--surface-elevated)] shadow-lg" 
                      : "border-[var(--border-subtle)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
                  }`}
                  data-testid={`card-truth-${truth.id}`}
                >
                  <button
                    onClick={() => setActiveTruth(isActive ? null : truth.id)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    aria-expanded={isActive}
                    data-testid={`button-toggle-${truth.id}`}
                  >
                    <div className="p-3 rounded-xl flex-shrink-0 bg-violet-100 dark:bg-violet-900/30">
                      <Icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isAcknowledged && (
                          <CheckCircle className="w-4 h-4 text-violet-500" />
                        )}
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {truth.title}
                      </h4>
                    </div>
                    <ArrowRight 
                      className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isActive ? "rotate-90" : ""}`} 
                    />
                  </button>

                  {isActive && (
                    <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" data-testid={`content-${truth.id}`}>
                      <div className="h-px bg-[var(--border-subtle)]" />
                      
                      <p className="text-[var(--text-primary)] leading-relaxed" data-testid={`text-insight-${truth.id}`}>
                        {truth.insight}
                      </p>

                      {truth.deeperTruth && (
                        <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500">
                          <p className="text-violet-800 dark:text-violet-200 font-medium" data-testid={`text-deeper-${truth.id}`}>
                            {truth.deeperTruth}
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={() => handleAcknowledge(truth.id)}
                        variant="secondary"
                        className="w-full"
                        data-testid={`button-acknowledge-${truth.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        I hear this
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] p-6 mb-10" data-testid="section-clear-truths">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-500" />
              Let's Be Very Clear and Grounded
            </h3>
            <div className="space-y-3">
              {CLEAR_GROUNDING_TRUTHS.map((truth, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl ${idx === 3 ? "bg-violet-100 dark:bg-violet-900/30 border-2 border-violet-300 dark:border-violet-700" : "bg-[var(--surface-secondary)]"}`}
                  data-testid={`grounding-truth-${idx}`}
                >
                  <p className={`${idx === 3 ? "text-violet-800 dark:text-violet-200 font-semibold" : "text-[var(--text-primary)]"}`}>
                    {idx === 3 ? "→ " : "• "}{truth}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2" data-testid="heading-reframes">
            <RefreshCw className="w-5 h-5 text-emerald-500" />
            One sentence to replace the self-attack
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            When "Am I stupid?" comes up, try:
          </p>

          <div className="space-y-4 mb-10">
            {REFRAME_PRACTICES.map((reframe, idx) => {
              const isActive = activeReframe === idx;
              
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] overflow-hidden"
                  data-testid={`card-reframe-${idx}`}
                >
                  <button
                    onClick={() => setActiveReframe(isActive ? null : idx)}
                    className="w-full p-4 text-left"
                    data-testid={`button-reframe-${idx}`}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 block mb-1">Old thought</span>
                        <p className="text-red-800 dark:text-red-200 font-medium" data-testid={`text-old-${idx}`}>
                          "{reframe.old}"
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block mb-1">New truth</span>
                        <p className="text-emerald-800 dark:text-emerald-200 font-medium" data-testid={`text-new-${idx}`}>
                          "{reframe.new}"
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {isActive && (
                    <div className="px-4 pb-4 animate-in fade-in">
                      <p className="text-sm text-[var(--text-secondary)] italic p-3 bg-[var(--surface-secondary)] rounded-lg" data-testid={`text-guidance-${idx}`}>
                        {reframe.guidance}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] p-6 mb-8" data-testid="section-check-in">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-violet-500" />
              How are you feeling right now?
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { id: "confused", label: "Confused", color: "bg-slate-100 dark:bg-slate-800" },
                { id: "lighter", label: "A bit lighter", color: "bg-emerald-100 dark:bg-emerald-900/30" },
                { id: "sad", label: "Sad", color: "bg-blue-100 dark:bg-blue-900/30" },
                { id: "skeptical", label: "Skeptical", color: "bg-amber-100 dark:bg-amber-900/30" }
              ].map((feeling) => (
                <button
                  key={feeling.id}
                  onClick={() => setCurrentFeeling(feeling.id)}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    currentFeeling === feeling.id
                      ? "border-violet-400 ring-2 ring-violet-200 dark:ring-violet-800"
                      : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  } ${feeling.color}`}
                  data-testid={`button-feeling-${feeling.id}`}
                >
                  <span className="text-sm font-medium text-[var(--text-primary)]">{feeling.label}</span>
                </button>
              ))}
            </div>

            {currentFeeling && (
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] animate-in fade-in" data-testid="feeling-response">
                {currentFeeling === "confused" && (
                  <p className="text-[var(--text-primary)]">
                    That's okay. Confusion after a lifetime of mixed messages makes sense. 
                    You don't need to understand everything right now.
                  </p>
                )}
                {currentFeeling === "lighter" && (
                  <p className="text-[var(--text-primary)]">
                    That's beautiful. Let that feeling stay. It's a sign that part of you is 
                    ready to receive a different story about yourself.
                  </p>
                )}
                {currentFeeling === "sad" && (
                  <p className="text-[var(--text-primary)]">
                    Grief is appropriate. You're mourning the years you spent believing something 
                    untrue about yourself. That sadness is part of healing.
                  </p>
                )}
                {currentFeeling === "skeptical" && (
                  <p className="text-[var(--text-primary)]">
                    That makes sense. Your brain was trained to distrust good things. 
                    You don't have to believe this yet. Just let it sit nearby.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-6 text-center" data-testid="section-closing">
            <Heart className="w-10 h-10 text-violet-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-violet-800 dark:text-violet-200 mb-2">
              I'm here with you.
            </p>
            <p className="text-xl text-violet-700 dark:text-violet-300">
              You're not stupid.
            </p>
          </div>
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}

import { useState } from "react";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { 
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
    insight: "People who question themselves deeply, reflect on patterns of behavior, and care about integrity — that takes intelligence. The fact that you're examining your own thoughts is proof of a sophisticated mind."
  },
  {
    id: "punished-for-noticing",
    title: "You were punished for understanding, not for being wrong",
    icon: Eye,
    insight: "When someone grows up being punished for noticing, understanding, and naming patterns, the brain learns a protective shortcut: 'If I'm hurting this much, maybe I'm stupid.' That belief is protective, not accurate."
  },
  {
    id: "stress-response",
    title: "Confusion is a stress response, not a measure",
    icon: Activity,
    insight: "When the nervous system is overloaded, even very intelligent people feel confused, scattered, foggy, and ashamed. You wouldn't call someone stupid for limping after being injured. Your mind is doing the same thing."
  },
  {
    id: "carrying-alone",
    title: "The problem isn't your mind",
    icon: Heart,
    insight: "The problem is that your mind has been carrying too much alone for too long. Overwhelm is not the same as incapacity."
  }
];

const REFRAME_PRACTICES = [
  {
    old: "Am I stupid?",
    new: "I am overwhelmed, not unintelligent.",
    guidance: "Say it slowly. Even if you don't believe it yet. Repetition rewires."
  },
  {
    old: "Why can't I figure this out?",
    new: "My nervous system is in protection mode. Clarity will return.",
    guidance: "Clarity requires calm. You can't think clearly while your body is bracing."
  },
  {
    old: "Everyone else seems to handle things better.",
    new: "I'm carrying invisible weight. I don't know what others are carrying either.",
    guidance: "Comparison without context is always unfair — especially to yourself."
  },
  {
    old: "I should know better by now.",
    new: "Healing isn't linear. Today I'm doing what I can.",
    guidance: "Knowledge and capacity are different things. You can know something and still struggle."
  }
];

const SIGNS_OF_INTELLIGENCE = [
  { text: "Questioning yourself deeply", icon: Brain },
  { text: "Reflecting on patterns of behavior", icon: RefreshCw },
  { text: "Caring about integrity and truth", icon: Shield },
  { text: "Trying to understand why things happened", icon: Lightbulb },
  { text: "Worrying about the impact of your words", icon: MessageCircle },
  { text: "Seeking growth and understanding", icon: Sparkles }
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
    <LayoutWrapper>
      <Hero
        title="Self-Worth Reflection"
        subtitle="When self-doubt speaks loudly, let truth speak louder — you are not what your pain told you"
        variant="wellness"
        data-testid="hero-self-worth"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                <Heart className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-intro">
                  This is about self-doubt, not truth
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
                  When someone grows up being punished for noticing, understanding, and telling the truth, 
                  their brain learns a protective shortcut: "If I'm hurting this much, maybe I'm the problem." 
                  That belief was protective then. It's not accurate now.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 mb-8" data-testid="safety-note">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-rose-800 dark:text-rose-200 mb-1">
                  If this feels intense
                </h3>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  If this conversation starts to feel too intense or destabilizing, it's important to loop in 
                  live human support. In the U.S., call or text <strong>988</strong> for immediate, calm support. 
                  You don't have to figure this out all at once.
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

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-signs">
            <Brain className="w-5 h-5 text-violet-500" />
            Signs of Intelligence You Already Show
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {SIGNS_OF_INTELLIGENCE.map((sign, idx) => {
              const Icon = sign.icon;
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center gap-3"
                  data-testid={`card-sign-${idx}`}
                >
                  <Icon className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)]">{sign.text}</span>
                </div>
              );
            })}
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

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-reframes">
            <RefreshCw className="w-5 h-5 text-emerald-500" />
            Reframe the Self-Attack
          </h3>

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

          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-6" data-testid="section-closing">
            <h3 className="font-semibold text-violet-800 dark:text-violet-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              What I See in You
            </h3>
            <ul className="space-y-2 text-violet-700 dark:text-violet-300 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Someone who is perceptive</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Someone who is thoughtful</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Someone who is morally serious</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Someone who is emotionally intelligent</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Someone trying very hard to be accurate and good</span>
              </li>
            </ul>
            <p className="text-violet-800 dark:text-violet-200 font-medium text-center italic">
              "You don't need to be refined into something else. You need to be supported into balance."
            </p>
          </div>
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  );
}

import { useState } from "react";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";
import { MIPromptCard } from "@/components/mi/MIPromptCard";
import { ShareCardPrompt } from "@/components/share/ShareCardPrompt";
import { 
  MessageCircle,
  Heart,
  RefreshCw,
  ListChecks,
  Sparkles,
  ArrowRight,
  Scale
} from "lucide-react";

const OARS_STEPS = [
  {
    id: "open",
    letter: "O",
    title: "Open Question",
    description: "Ask yourself an open-ended question to explore your thoughts and feelings.",
    example: "What matters most to you about making this change?",
    icon: MessageCircle
  },
  {
    id: "affirm",
    letter: "A",
    title: "Affirmation",
    description: "Acknowledge your strengths, efforts, and positive qualities.",
    example: "You've shown real courage by thinking about this honestly.",
    icon: Heart
  },
  {
    id: "reflect",
    letter: "R",
    title: "clarity",
    description: "Reflect back what you're hearing from yourself with empathy.",
    example: "It sounds like part of you really wants this, even though it feels hard.",
    icon: RefreshCw
  },
  {
    id: "summarize",
    letter: "S",
    title: "Summary",
    description: "Bring together the key themes and insights from your reflection.",
    example: "So you value [X], you're concerned about [Y], and you're considering [Z].",
    icon: ListChecks
  }
];

export default function BehaviorChangePage() {
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [importanceLevel, setImportanceLevel] = useState(5);
  const [currentOARSStep, setCurrentOARSStep] = useState(0);
  const [changeGoal, setChangeGoal] = useState("");
  const [reflection, setReflection] = useState("");

  const handleNextOARS = () => {
    if (currentOARSStep < OARS_STEPS.length - 1) {
      setCurrentOARSStep(currentOARSStep + 1);
    }
  };

  const handlePrevOARS = () => {
    if (currentOARSStep > 0) {
      setCurrentOARSStep(currentOARSStep - 1);
    }
  };

  return (
    <WellnessPageShell
      title="Behavior Change"
      subtitle="Supportive coaching-style reflections for personal growth."
      benefits={pickBenefits(["agency", "clarity", "selfRespect", "meaning", "clarity"], 5)}
      clarity={{
        what: "A self-guided motivational interviewing experience.",
        why: "To explore your readiness for change with compassion and clarity.",
        who: "For adults (18+) seeking structured self-reflection tools.",
        when: "When you're considering a change but feel ambivalent or stuck.",
        where: "Any quiet space where you can write honestly.",
        how: "Work through the OARS flow and rulers at your own pace."
      }}
      examples={[
        { label: "Beginner", examples: ["Use the rulers to check in on one goal.", "Answer one Open Question honestly."] },
        { label: "Intermediate", examples: ["Complete the full OARS flow for a change you're considering.", "Journal about what the scores reveal."] },
        { label: "Advanced", examples: ["Use this weekly to track your motivation over time.", "Pair with the 12 Practices for deeper work."] }
      ]}
    >
      <SEO 
        title="Behavior Change — The Genuine Love Project" 
        description="Supportive coaching-style reflections using motivational interviewing techniques for personal growth and change."
      />

      <LayoutWrapper>
        <Hero
          title="Behavior Change"
          subtitle="Supportive coaching-style reflections for exploring readiness and building motivation"
          variant="wellness"
          data-testid="hero-behavior-change"
        />

        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            <div className="bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/30 p-6 rounded-2xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-800))] mb-8" data-testid="section-intro">
              <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
                What is Motivational Interviewing?
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Motivational Interviewing (MI) is an evidence-based approach that helps you explore 
                your own motivation for change. Rather than being told what to do, you discover your 
                own reasons and build confidence in your ability to take action.
              </p>
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> This is educational self-reflection, not clinical treatment. 
                If you're struggling, please seek support from a licensed professional.
              </p>
            </div>

            <div className="mb-10">
              <label htmlFor="change-goal" className="block text-sm font-medium text-foreground mb-2">
                What change are you considering?
              </label>
              <input
                id="change-goal"
                type="text"
                value={changeGoal}
                onChange={(e) => setChangeGoal(e.target.value)}
                className="w-full p-3 rounded-lg border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))]"
                placeholder="e.g., Setting better boundaries, starting a morning routine..."
                data-testid="input-change-goal"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10" data-testid="section-rulers">
              <div className="p-6 rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background" data-testid="card-importance-ruler">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Importance Ruler</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  How important is this change to you right now?
                </p>
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={importanceLevel}
                    onChange={(e) => setImportanceLevel(parseInt(e.target.value))}
                    className="w-full accent-[hsl(var(--sage-500))]"
                    aria-label="Importance level"
                    data-testid="slider-importance"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not at all</span>
                  <span className="font-semibold text-lg text-foreground">{importanceLevel}</span>
                  <span>Extremely</span>
                </div>
                {importanceLevel >= 7 && (
                  <p className="mt-3 text-sm text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))]">
                    This matters to you. What makes it so important?
                  </p>
                )}
              </div>

              <div className="p-6 rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background" data-testid="card-confidence-ruler">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Confidence Ruler</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  How confident are you that you could make this change?
                </p>
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                    className="w-full accent-[hsl(var(--sage-500))]"
                    aria-label="Confidence level"
                    data-testid="slider-confidence"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not at all</span>
                  <span className="font-semibold text-lg text-foreground">{confidenceLevel}</span>
                  <span>Completely</span>
                </div>
                {confidenceLevel < 5 && importanceLevel >= 5 && (
                  <p className="mt-3 text-sm text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))]">
                    What's one small thing that could raise your confidence by 1 point?
                  </p>
                )}
              </div>
            </div>

            <div className="mb-10" data-testid="section-oars">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
                OARS Reflection Flow
              </h2>
              
              <div className="flex gap-2 mb-6">
                {OARS_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentOARSStep(idx)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentOARSStep === idx
                        ? "bg-[hsl(var(--sage-600))] text-white"
                        : "bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] text-foreground hover:bg-[hsl(var(--sage-200))] dark:hover:bg-[hsl(var(--sage-700))]"
                    }`}
                    data-testid={`button-oars-${step.id}`}
                  >
                    {step.letter}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background">
                {(() => {
                  const step = OARS_STEPS[currentOARSStep];
                  const Icon = step.icon;
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[hsl(var(--sage-600))]" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-[hsl(var(--sage-500))] uppercase">
                            Step {currentOARSStep + 1} of 4
                          </span>
                          <h3 className="font-semibold text-foreground">{step.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-foreground mb-4">{step.description}</p>
                      
                      <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-400 mb-4">
                        <p className="text-violet-800 dark:text-violet-200 italic">
                          "{step.example}"
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {currentOARSStep > 0 && (
                          <button
                            type="button"
                            onClick={handlePrevOARS}
                            className="py-2 px-4 rounded-lg border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] text-foreground hover:bg-[hsl(var(--sage-50))] dark:hover:bg-[hsl(var(--sage-800))] transition-colors text-sm"
                            data-testid="button-prev-oars"
                          >
                            Previous
                          </button>
                        )}
                        {currentOARSStep < OARS_STEPS.length - 1 && (
                          <button
                            type="button"
                            onClick={handleNextOARS}
                            className="py-2 px-4 rounded-lg bg-[hsl(var(--sage-600))] hover:bg-[hsl(var(--sage-700))] text-white transition-colors text-sm ml-auto flex items-center gap-1"
                            data-testid="button-next-oars"
                          >
                            Next <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <MIPromptCard context="reflection" className="mb-8" />

            <div className="mb-8">
              <label htmlFor="reflection" className="block text-sm font-medium text-foreground mb-2">
                Your reflection (optional)
              </label>
              <textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] resize-none"
                placeholder="What's coming up for you as you work through this?"
                data-testid="textarea-reflection"
              />
            </div>

            <ShareCardPrompt
              microTool="Behavior change reflection"
              action={reflection || changeGoal}
              variant="minimal"
              className="mb-6"
            />

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-200 text-sm text-center">
                This is a self-reflection tool using Motivational Interviewing principles. 
                For personalized support, consider working with a licensed counselor or coach.
              </p>
            </div>
          </div>
        </SectionContainer>
      </LayoutWrapper>
    </WellnessPageShell>
  );
}

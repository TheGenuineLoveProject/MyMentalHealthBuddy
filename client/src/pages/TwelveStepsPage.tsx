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
  Heart, 
  Eye, 
  Shield, 
  Users,
  Compass,
  Scale,
  MessageCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  HandHeart,
  Sun,
  CheckCircle
} from "lucide-react";

const TWELVE_STEPS = [
  {
    number: 1,
    title: "Honest Self-Awareness",
    icon: Eye,
    description: "Acknowledge where you are right now without judgment. Recognize patterns that no longer serve you.",
    practice: "Write one honest sentence about a pattern you want to change.",
    affirmation: "Seeing clearly is the first act of self-love."
  },
  {
    number: 2,
    title: "Openness to Growth",
    icon: Sparkles,
    description: "Believe that positive change is possible. Trust that you have inner resources for transformation.",
    practice: "Name one strength you already have that can help you grow.",
    affirmation: "I have everything I need to begin."
  },
  {
    number: 3,
    title: "Intentional Surrender",
    icon: Heart,
    description: "Release the need to control everything. Accept support from others and from life itself.",
    practice: "Identify one thing you've been holding too tightly. Consider releasing it.",
    affirmation: "Letting go creates space for something better."
  },
  {
    number: 4,
    title: "Courageous Inventory",
    icon: BookOpen,
    description: "Take a fearless look at your values, beliefs, and behaviors. Notice what aligns with your true self.",
    practice: "List three values that matter most to you. Are you living them?",
    affirmation: "Self-knowledge is self-empowerment."
  },
  {
    number: 5,
    title: "Authentic Sharing",
    icon: MessageCircle,
    description: "Share your truth with someone you trust. Vulnerability creates connection and healing.",
    practice: "Tell one trusted person something real about your journey.",
    affirmation: "My story deserves to be heard."
  },
  {
    number: 6,
    title: "Willingness to Transform",
    icon: RefreshCw,
    description: "Become ready to release old patterns. Embrace discomfort as part of growth.",
    practice: "Name one habit you're willing to experiment with changing.",
    affirmation: "I am ready for something new."
  },
  {
    number: 7,
    title: "Humble Action",
    icon: HandHeart,
    description: "Ask for help when needed. Take small, consistent steps toward your values.",
    practice: "Identify one small action you can take today that aligns with your values.",
    affirmation: "Progress, not perfection."
  },
  {
    number: 8,
    title: "Relationship Inventory",
    icon: Users,
    description: "Consider who has been affected by your patterns. Acknowledge the impact honestly.",
    practice: "Write down names of people you want to strengthen relationships with.",
    affirmation: "My relationships reflect my growth."
  },
  {
    number: 9,
    title: "Conscious Repair",
    icon: Shield,
    description: "Make amends where appropriate, without causing further harm. Repair begins with intention.",
    practice: "Choose one relationship to nurture with a kind word or gesture.",
    affirmation: "Healing relationships heals myself."
  },
  {
    number: 10,
    title: "Ongoing Awareness",
    icon: Compass,
    description: "Continue self-reflection daily. Acknowledge mistakes promptly and course-correct with compassion.",
    practice: "Each evening, reflect: What went well? What would I do differently?",
    affirmation: "Every day is a fresh start."
  },
  {
    number: 11,
    title: "Inner Connection",
    icon: Sun,
    description: "Cultivate practices that connect you to your deeper self — meditation, nature, creativity, stillness.",
    practice: "Spend 5 minutes in silence, noticing your breath and inner state.",
    affirmation: "Stillness reveals wisdom."
  },
  {
    number: 12,
    title: "Living Service",
    icon: Scale,
    description: "Share what you've learned. Support others on their journey. Live your values in action.",
    practice: "Offer one small act of kindness or support to someone today.",
    affirmation: "My healing ripples outward."
  }
];

export default function TwelveStepsPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNum: number) => {
    setExpandedStep(expandedStep === stepNum ? null : stepNum);
  };

  const markComplete = (stepNum: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  return (
    <WellnessPageShell
      title="12 Practices for Self-Leadership"
      subtitle="A gentle path of integrity, awareness, and personal transformation."
      benefits={pickBenefits(["Agency", "Clarity", "Self-respect", "Your pace", "Gentle growth"], 5)}
      clarity={{
        what: "12 practices for personal integrity and self-leadership.",
        why: "To cultivate self-awareness, build values-aligned habits, and live with intention.",
        who: "For adults (18+) seeking structured personal growth (not clinical treatment).",
        when: "Work through at your own pace — days, weeks, or months.",
        where: "Anywhere you can reflect quietly.",
        how: "Explore one step at a time. No pressure, no perfection required."
      }}
      examples={[
        { label: "Beginner", examples: ["Read through all 12 steps to understand the path.", "Choose one step that resonates and try its practice."] },
        { label: "Intermediate", examples: ["Work through steps 1-4 over a week, journaling each practice.", "Share your reflections with a trusted friend."] },
        { label: "Advanced", examples: ["Complete all 12 steps as a month-long intensive.", "Revisit steps regularly as part of ongoing practice."] }
      ]}
    >
      <SEO 
        title="12 Practices for Self-Leadership — The Genuine Love Project" 
        description="A gentle 12-step path of integrity, awareness, and personal transformation for self-leadership and emotional growth."
      />

      <LayoutWrapper>
        <Hero
          title="12 Practices for Self-Leadership"
          subtitle="A gentle path of integrity, awareness, and transformation — work through at your own pace"
          variant="wellness"
          data-testid="hero-twelve-steps"
        />

        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            <div className="bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/30 p-6 rounded-2xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-800))] mb-8" data-testid="section-intro">
              <p className="text-foreground leading-relaxed mb-4">
                These 12 practices draw from proven frameworks for personal growth — adapted for self-leadership, 
                not addiction recovery. Each step builds on the last, creating a foundation for living with 
                intention and integrity.
              </p>
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> This is educational content for self-reflection. It is not therapy, 
                counseling, or medical advice. Work at your own pace and seek professional support if needed.
              </p>
            </div>

            <div className="space-y-4" data-testid="steps-container">
              {TWELVE_STEPS.map((step) => {
                const Icon = step.icon;
                const isExpanded = expandedStep === step.number;
                const isComplete = completedSteps[step.number];

                return (
                  <div 
                    key={step.number}
                    className={`rounded-xl border transition-all ${
                      isComplete 
                        ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20" 
                        : "border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background"
                    }`}
                    data-testid={`step-${step.number}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleStep(step.number)}
                      className="w-full p-4 flex items-center gap-4 text-left"
                      aria-expanded={isExpanded}
                      data-testid={`button-toggle-step-${step.number}`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete
                          ? "bg-green-500 text-white"
                          : "bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] text-[hsl(var(--sage-600))]"
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <span className="font-semibold">{step.number}</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{step.description}</p>
                      </div>
                      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]">
                        <div className="pt-4 space-y-4">
                          <p className="text-foreground leading-relaxed">{step.description}</p>
                          
                          <div className="bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-[hsl(var(--sage-700))] dark:text-[hsl(var(--sage-300))] mb-1">
                              Practice
                            </p>
                            <p className="text-foreground">{step.practice}</p>
                          </div>

                          <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border-l-4 border-violet-400">
                            <p className="text-violet-800 dark:text-violet-200 italic text-sm">
                              "{step.affirmation}"
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => markComplete(step.number)}
                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                              isComplete
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                                : "bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] text-foreground hover:bg-[hsl(var(--sage-200))] dark:hover:bg-[hsl(var(--sage-700))]"
                            }`}
                            data-testid={`button-complete-step-${step.number}`}
                          >
                            {isComplete ? "✓ Completed — tap to undo" : "Mark as completed"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <MIPromptCard context="values" className="mt-8" />

            <ShareCardPrompt
              microTool="12 Steps of Genuine Love"
              action={`Completed ${Object.values(completedSteps).filter(Boolean).length} of 12 practices`}
              variant="minimal"
              className="mt-6"
            />

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                Completed {Object.values(completedSteps).filter(Boolean).length} of 12 practices. 
                Progress is saved in your browser.
              </p>
            </div>
          </div>
        </SectionContainer>
      </LayoutWrapper>
    </WellnessPageShell>
  );
}

// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function GuidedJournalingPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Carefully crafted journaling prompts that guide you through meaningful self-exploration.",
    why: "Good questions open new perspectives. Guided prompts help you go deeper than free writing alone.",
    who: "Anyone wanting more direction in their journaling or new topics to explore.",
    when: "When you feel stuck in free writing, or when you want to explore a specific theme.",
    where: "A quiet space with your journal or digital writing tool.",
    how: "Choose a prompt that resonates. Write without censoring. Follow where the question leads."
  };

  const examples = [
    { level: "Beginner", label: "Daily Reflection Prompts", description: "Simple questions like 'What am I grateful for today?' and 'What challenged me?'" },
    { level: "Intermediate", label: "Theme-Based Prompts", description: "Deeper questions organized by theme: relationships, values, growth, healing." },
    { level: "Advanced", label: "Shadow Work Prompts", description: "Questions that help you explore hidden parts of yourself with compassion." }
  ];

  return (
    <>
      <SEO
        title="Guided Journaling | MyMentalHealthBuddy"
        description="Prompts to deepen your reflection - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Guided Journaling"
        subtitle="Prompts to deepen your reflection"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            The right question at the right time can unlock profound insight. Let these prompts guide you.
          </p>
          <p className="text-sm opacity-70 mt-6">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}

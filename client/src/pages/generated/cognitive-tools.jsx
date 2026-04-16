// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CognitiveToolsPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Techniques for examining, reframing, and working more skillfully with thought patterns.",
    why: "Our thoughts shape our emotions and actions. Learning to work with them creates more freedom.",
    who: "Anyone struggling with negative thought patterns, rumination, or overthinking.",
    when: "When you notice unhelpful thinking patterns, during journaling, or in therapy.",
    where: "Anywhere you can pause and reflect—journaling helps but isn't required.",
    how: "Notice the thought. Question it gently. Consider alternatives. Choose what serves you."
  };

  const examples = [
    { level: "Beginner", label: "Thought Labeling", description: "When a thought appears, label it: 'That's a worry thought' or 'That's self-criticism.' Distance yourself from it." },
    { level: "Intermediate", label: "Evidence Check", description: "Ask: 'What's the evidence for this thought? Against it? What would I tell a friend?'" },
    { level: "Advanced", label: "Values-Based Pivot", description: "Instead of fighting the thought, ask: 'What action would align with my values right now?'" }
  ];

  return (
    <>
      <SEO
        title="Cognitive Tools | MyMentalHealthBuddy"
        description="Working with thoughts more skillfully - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Cognitive Tools"
        subtitle="Working with thoughts more skillfully"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            You are not your thoughts. These tools help you observe thinking without being controlled by it.
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

// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CognitiveArchitecturePage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Insights into how your mind processes information, makes decisions, and creates patterns.",
    why: "Understanding your mental patterns gives you more choice in how you think and respond.",
    who: "Anyone interested in metacognition—thinking about thinking.",
    when: "During self-study, when noticing unhelpful patterns, or when optimizing performance.",
    where: "Quiet reflection time for deep thinking.",
    how: "Learn about cognitive patterns. Notice them in yourself. Experiment with changes."
  };

  const examples = [
    { level: "Beginner", label: "Bias Awareness", description: "Learn about common cognitive biases. Notice which ones show up for you." },
    { level: "Intermediate", label: "Pattern Recognition", description: "Map your habitual thought patterns. Which serve you? Which limit you?" },
    { level: "Advanced", label: "Mental Model Building", description: "Develop personal frameworks for decision-making and problem-solving." }
  ];

  return (
    <>
      <SEO
        title="Cognitive Architecture | The Genuine Love Project"
        description="Understanding how your mind works - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Cognitive Architecture"
        subtitle="Understanding how your mind works"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your mind has patterns. Understanding them gives you power to choose differently.
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

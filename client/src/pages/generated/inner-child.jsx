// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function InnerChildPage() {
  const benefits = pickBenefits(["connection", "selfRespect", "calm", "clarity"], 4);
  
  const clarity = {
    what: "Compassionate practices to acknowledge, comfort, and integrate experiences from childhood.",
    why: "Early experiences shape how we relate to ourselves and others. Healing the past frees the present.",
    who: "Anyone curious about patterns from childhood, or wanting to cultivate more self-compassion.",
    when: "When you notice old patterns, during journaling, or in dedicated reflection time.",
    where: "A safe, private space where you can be emotional without interruption.",
    how: "Approach gently. Visualize your younger self. Offer the comfort and understanding you needed then."
  };

  const examples = [
    { level: "Beginner", label: "Photo Connection", description: "Find a childhood photo. Look at yourself with compassion. What did that child need to hear?" },
    { level: "Intermediate", label: "Letter Writing", description: "Write a letter from your adult self to your child self. Offer reassurance and understanding." },
    { level: "Advanced", label: "Reparenting Practice", description: "When triggered, pause and ask: 'What age do I feel right now? What does this part of me need?'" }
  ];

  return (
    <>
      <SEO
        title="Inner Child Healing | MyMentalHealthBuddy"
        description="Gentle reconnection with your younger self - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Inner Child Healing"
        subtitle="Gentle reconnection with your younger self"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Inner child work can bring up emotions. Go at your own pace. It's okay to start small and take breaks.
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

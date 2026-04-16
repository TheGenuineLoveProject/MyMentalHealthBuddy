// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function KnowledgeSynthesisPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Tools for connecting what you learn into coherent understanding and actionable wisdom.",
    why: "Information alone doesn't create change. Synthesis turns knowledge into practical wisdom.",
    who: "Learners wanting to integrate information into applicable understanding.",
    when: "After consuming new content, during learning periods, or when synthesizing insights.",
    where: "Quiet space for thinking, ideally with notes or journaling tools.",
    how: "Review what you've learned. Ask how ideas connect. Apply insights to your life."
  };

  const examples = [
    { level: "Beginner", label: "Key Takeaways", description: "After reading/learning, write 3 key insights in your own words." },
    { level: "Intermediate", label: "Connection Mapping", description: "How does this new knowledge connect to what you already know?" },
    { level: "Advanced", label: "Application Planning", description: "Design specific ways to apply this knowledge in your daily life." }
  ];

  return (
    <>
      <SEO
        title="Knowledge Synthesis | MyMentalHealthBuddy"
        description="Connecting ideas for deeper understanding - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Knowledge Synthesis"
        subtitle="Connecting ideas for deeper understanding"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Knowledge becomes wisdom through reflection and application. Take time to synthesize.
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

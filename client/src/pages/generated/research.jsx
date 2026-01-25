// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ResearchPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "A collection of research findings relevant to mental wellness and personal growth.",
    why: "Evidence-based practices are more effective. Research helps you trust the process.",
    who: "Anyone curious about the science behind wellness practices.",
    when: "During learning, when questioning a practice, or for professional development.",
    where: "Focused reading time for complex material.",
    how: "Browse by topic. Read accessible summaries. Explore original sources if interested."
  };

  const examples = [
    { level: "Beginner", label: "Key Findings", description: "Simple summaries of important research discoveries." },
    { level: "Intermediate", label: "Practice Implications", description: "How research translates into practical recommendations." },
    { level: "Advanced", label: "Critical Analysis", description: "Nuanced discussions of research limitations and applications." }
  ];

  return (
    <>
      <SEO
        title="Research Hub | The Genuine Love Project"
        description="Evidence-based wellness insights - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Research Hub"
        subtitle="Evidence-based wellness insights"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Science and wisdom together create effective practice. Explore the evidence.
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

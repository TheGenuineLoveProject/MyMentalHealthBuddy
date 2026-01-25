// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DisclaimerPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Important disclaimers about the nature and limitations of our services.",
    why: "Clear expectations prevent misunderstanding and ensure appropriate use.",
    who: "All users must understand these disclaimers.",
    when: "Before and during use of the platform.",
    where: "Review and reference as needed.",
    how: "Read carefully. Use services appropriately. Seek professional help when needed."
  };

  const examples = [
    { level: "Beginner", label: "Key Points", description: "Most important things to understand about our services." },
    { level: "Intermediate", label: "Full Disclaimers", description: "Complete disclaimer information." },
    { level: "Advanced", label: "When to Seek Help", description: "When professional support is recommended." }
  ];

  return (
    <>
      <SEO
        title="Important Disclaimers | The Genuine Love Project"
        description="Please read carefully - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Important Disclaimers"
        subtitle="Please read carefully"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            This platform provides educational wellness tools for adults 18+, not medical care or mental health treatment.
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

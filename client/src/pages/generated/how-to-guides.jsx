// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function HowToGuidesPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Clear, practical guides for specific wellness practices and platform features.",
    why: "Good instructions make learning easier and reduce confusion.",
    who: "Anyone learning a new practice or wanting clear guidance.",
    when: "When starting something new or when you need detailed steps.",
    where: "Follow along wherever you're practicing.",
    how: "Read through once. Then follow step-by-step. Adjust as you learn."
  };

  const examples = [
    { level: "Beginner", label: "Getting Started", description: "Simple guides for your first practices and platform navigation." },
    { level: "Intermediate", label: "Technique Guides", description: "Detailed instructions for specific practices and methods." },
    { level: "Advanced", label: "Advanced Methods", description: "Comprehensive guides for complex practices." }
  ];

  return (
    <>
      <SEO
        title="How-To Guides | The Genuine Love Project"
        description="Step-by-step instructions - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="How-To Guides"
        subtitle="Step-by-step instructions"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Clear instructions make practice accessible. Follow along at your own pace.
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

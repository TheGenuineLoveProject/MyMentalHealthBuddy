// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SafetyPage() {
  const benefits = pickBenefits(["calm", "clarity", "connection", "agency"], 4);
  
  const clarity = {
    what: "Safety guidelines, crisis resources, and important support information.",
    why: "Your safety is paramount. These resources are here when you need them.",
    who: "Anyone needing safety information or crisis support.",
    when: "Whenever you need safety resources or are concerned about someone.",
    where: "Access anytime from any page.",
    how: "Review safety guidelines. Access crisis resources. Reach out for help."
  };

  const examples = [
    { level: "Beginner", label: "Crisis Hotlines", description: "Immediate help for those in crisis." },
    { level: "Intermediate", label: "Safety Planning", description: "Create a personal safety plan." },
    { level: "Advanced", label: "Supporting Others", description: "How to help someone who may be struggling." }
  ];

  return (
    <>
      <SEO
        title="Safety Information | The Genuine Love Project"
        description="Important safety resources - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Safety Information"
        subtitle="Important safety resources"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your safety matters. If you're in crisis, please reach out to these resources immediately.
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

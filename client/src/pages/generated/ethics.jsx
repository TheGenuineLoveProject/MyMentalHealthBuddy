// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function EthicsPage() {
  const benefits = pickBenefits(["clarity", "connection", "selfRespect", "agency"], 4);
  
  const clarity = {
    what: "The ethical principles and values that guide everything we do.",
    why: "Transparency about our values helps you decide if we're right for you.",
    who: "Anyone wanting to understand what we stand for.",
    when: "When considering using our services or wanting to know more about us.",
    where: "Read at your convenience.",
    how: "Review our values. Hold us accountable to them."
  };

  const examples = [
    { level: "Beginner", label: "Core Values", description: "Our fundamental ethical commitments." },
    { level: "Intermediate", label: "Principles in Practice", description: "How these values show up in our work." },
    { level: "Advanced", label: "Accountability", description: "How we hold ourselves accountable to these ethics." }
  ];

  return (
    <>
      <SEO
        title="Our Ethics | MyMentalHealthBuddy"
        description="Values that guide us - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Our Ethics"
        subtitle="Values that guide us"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            We believe in ethical practice. These values guide every decision we make.
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

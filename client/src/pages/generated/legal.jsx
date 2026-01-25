// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function LegalPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "Legal notices, disclaimers, and important information about our services.",
    why: "Legal clarity protects everyone and sets appropriate expectations.",
    who: "All users should be aware of these notices.",
    when: "Review as needed for legal questions.",
    where: "Reference anytime.",
    how: "Review relevant sections. Contact us with questions."
  };

  const examples = [
    { level: "Beginner", label: "Key Notices", description: "Most important legal information in plain language." },
    { level: "Intermediate", label: "Full Legal", description: "Complete legal notices and terms." },
    { level: "Advanced", label: "Contact Legal", description: "How to reach us for legal matters." }
  ];

  return (
    <>
      <SEO
        title="Legal Information | The Genuine Love Project"
        description="Important legal notices - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Legal Information"
        subtitle="Important legal notices"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            This is educational wellness content, not medical or mental health treatment.
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

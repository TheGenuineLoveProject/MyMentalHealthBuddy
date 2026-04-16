// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function TermsPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "The terms governing your use of this platform and our services.",
    why: "Clarity about expectations protects both you and us.",
    who: "All users should review these terms.",
    when: "Before using the platform and periodically when updated.",
    where: "Read at your convenience.",
    how: "Review the key sections. Contact us with questions."
  };

  const examples = [
    { level: "Beginner", label: "Key Points Summary", description: "The most important terms in plain language." },
    { level: "Intermediate", label: "Full Terms", description: "Complete legal terms for thorough review." },
    { level: "Advanced", label: "Updates & Changes", description: "How and when terms may be updated." }
  ];

  return (
    <>
      <SEO
        title="Terms of Service | MyMentalHealthBuddy"
        description="Our agreement with you - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Terms of Service"
        subtitle="Our agreement with you"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            By using this platform, you agree to these terms. Please review them carefully.
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

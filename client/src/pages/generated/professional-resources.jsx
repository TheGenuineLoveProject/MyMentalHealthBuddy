// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ProfessionalResourcesPage() {
  const benefits = pickBenefits(["clarity", "agency", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "Resources for therapists, coaches, and other helping professionals.",
    why: "Professionals can recommend and integrate these tools with their clients.",
    who: "Mental health professionals, coaches, and wellness practitioners.",
    when: "For professional development or client resources.",
    where: "Professional-grade materials for your practice.",
    how: "Review resources. Integrate what fits your practice. Contact us for collaboration."
  };

  const examples = [
    { level: "Beginner", label: "Client Handouts", description: "Printable resources to share with clients." },
    { level: "Intermediate", label: "Integration Guides", description: "How to incorporate these tools into your practice." },
    { level: "Advanced", label: "Training Materials", description: "Deeper training for professional use." }
  ];

  return (
    <>
      <SEO
        title="Professional Resources | MyMentalHealthBuddy"
        description="For helping professionals - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Professional Resources"
        subtitle="For helping professionals"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            We welcome collaboration with helping professionals. Reach out to discuss partnership.
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

// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SupportAccessibilityPage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Information about our accessibility features and commitment.",
    why: "Wellness should be accessible to everyone, regardless of ability.",
    who: "Anyone needing accessibility accommodations or information.",
    when: "When you need accessibility support or want to learn about our practices.",
    where: "Accessibility resources and settings.",
    how: "Review available accommodations. Adjust settings. Request additional support."
  };

  const examples = [
    { level: "Beginner", label: "Accessibility Settings", description: "Adjust the platform for your needs." },
    { level: "Intermediate", label: "Assistive Technology", description: "How to use assistive technology with our platform." },
    { level: "Advanced", label: "Request Accommodations", description: "Contact us for specific accessibility needs." }
  ];

  return (
    <>
      <SEO
        title="Accessibility | MyMentalHealthBuddy"
        description="Making wellness available to everyone - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Accessibility"
        subtitle="Making wellness available to everyone"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Everyone deserves access to wellness support. We're committed to accessibility.
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

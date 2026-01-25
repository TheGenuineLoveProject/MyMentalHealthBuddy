// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SupportPage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "connection"], 4);
  
  const clarity = {
    what: "Resources and contact options for getting help with the platform.",
    why: "Everyone needs help sometimes. We want to make getting support easy.",
    who: "Anyone needing assistance with the platform or their practice.",
    when: "Whenever you have questions or need help.",
    where: "Contact us through your preferred method.",
    how: "Browse FAQs first. If you need more help, reach out directly."
  };

  const examples = [
    { level: "Beginner", label: "Quick Answers", description: "Browse common questions and answers." },
    { level: "Intermediate", label: "Email Support", description: "Send us a message and we'll respond within 24 hours." },
    { level: "Advanced", label: "Community Help", description: "Ask questions in our community forums." }
  ];

  return (
    <>
      <SEO
        title="Support Center | The Genuine Love Project"
        description="We're here to help - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Support Center"
        subtitle="We're here to help"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            You're not bothering us by asking for help. We're here to support you.
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

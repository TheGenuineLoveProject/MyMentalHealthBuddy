// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ResourcesPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "A curated list of external books, organizations, and resources we recommend.",
    why: "We can't cover everything. These trusted resources extend your learning.",
    who: "Anyone wanting to explore beyond what we offer directly.",
    when: "When seeking additional resources or different perspectives.",
    where: "Browse anytime for external resources.",
    how: "Explore what interests you. We've vetted these for quality and alignment."
  };

  const examples = [
    { level: "Beginner", label: "Recommended Books", description: "Accessible books for starting your wellness journey." },
    { level: "Intermediate", label: "Organizations", description: "Trusted organizations for specific support needs." },
    { level: "Advanced", label: "Professional Resources", description: "Resources for those seeking deeper study or training." }
  ];

  return (
    <>
      <SEO
        title="Additional Resources | The Genuine Love Project"
        description="Curated external resources - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Additional Resources"
        subtitle="Curated external resources"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your journey extends beyond this platform. These resources can help you go further.
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

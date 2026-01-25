// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function HealingLibraryPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "A curated collection of articles, guides, and resources to support various aspects of healing.",
    why: "Knowledge empowers healing. Understanding what you're experiencing helps you move through it.",
    who: "Anyone on a healing journey seeking information and guidance.",
    when: "When learning about a topic, processing experiences, or seeking new approaches.",
    where: "Read at your own pace in a comfortable, quiet space.",
    how: "Browse by topic. Read what calls to you. Take notes on what resonates."
  };

  const examples = [
    { level: "Beginner", label: "Introduction Guides", description: "Foundational articles explaining key healing concepts in simple terms." },
    { level: "Intermediate", label: "Deep Dives", description: "Comprehensive resources on specific topics like trauma, grief, or boundaries." },
    { level: "Advanced", label: "Research Summaries", description: "Evidence-based findings translated for practical application." }
  ];

  return (
    <>
      <SEO
        title="Healing Library | The Genuine Love Project"
        description="Resources for your healing journey - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Healing Library"
        subtitle="Resources for your healing journey"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            This library grows over time. Check back for new resources to support your journey.
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

// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ContentIndexPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "connection"], 4);
  
  const clarity = {
    what: "A comprehensive index of all content on the platform, organized by topic and type.",
    why: "Finding the right resource quickly saves time and reduces frustration.",
    who: "Anyone looking for specific content or wanting to explore what's available.",
    when: "When searching for something specific or browsing for new resources.",
    where: "Use anytime to navigate the platform efficiently.",
    how: "Search by keyword, browse by category, or explore what's new."
  };

  const examples = [
    { level: "Beginner", label: "Topic Browse", description: "See all content organized by wellness topic." },
    { level: "Intermediate", label: "Type Filter", description: "Filter by content type: articles, tools, prompts, etc." },
    { level: "Advanced", label: "Custom Lists", description: "Create and save custom lists of content for your practice." }
  ];

  return (
    <>
      <SEO
        title="Content Index | The Genuine Love Project"
        description="Find what you need - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Content Index"
        subtitle="Find what you need"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Everything we offer, organized for easy discovery. Find what you need.
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

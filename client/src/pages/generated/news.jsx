// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function NewsPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Platform updates, new features, and relevant wellness news.",
    why: "Stay informed about new resources and developments.",
    who: "Anyone wanting to stay current with platform updates and wellness news.",
    when: "Periodically to see what's new.",
    where: "Browse at your convenience.",
    how: "Read what interests you. Note new features to try."
  };

  const examples = [
    { level: "Beginner", label: "New Features", description: "Announcements about new tools and content." },
    { level: "Intermediate", label: "Wellness Updates", description: "Relevant news from the broader wellness field." },
    { level: "Advanced", label: "Research Highlights", description: "New research findings and their implications." }
  ];

  return (
    <>
      <SEO
        title="Wellness News | The Genuine Love Project"
        description="Updates and announcements - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness News"
        subtitle="Updates and announcements"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Stay informed about what's new and what's coming next.
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

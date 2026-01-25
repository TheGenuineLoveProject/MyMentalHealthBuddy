// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CommunityEventsPage() {
  const benefits = pickBenefits(["connection", "agency", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "Live and virtual events for community connection and shared practice.",
    why: "Coming together amplifies growth and creates meaningful connection.",
    who: "Community members wanting to connect with others.",
    when: "Check the schedule for upcoming events.",
    where: "Virtual events online, local events in various locations.",
    how: "Browse events. Register for what interests you. Show up and participate."
  };

  const examples = [
    { level: "Beginner", label: "Open Sessions", description: "Beginner-friendly events for newcomers." },
    { level: "Intermediate", label: "Practice Groups", description: "Regular groups for shared practice." },
    { level: "Advanced", label: "Deep Dives", description: "Intensive events for committed practitioners." }
  ];

  return (
    <>
      <SEO
        title="Community Events | The Genuine Love Project"
        description="Gather and grow together - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Community Events"
        subtitle="Gather and grow together"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Community connection supports your journey. Join us when you're ready.
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

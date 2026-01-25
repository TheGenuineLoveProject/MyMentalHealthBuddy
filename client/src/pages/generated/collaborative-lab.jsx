// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CollaborativeLabPage() {
  const benefits = pickBenefits(["connection", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Spaces and tools for growing alongside others through shared practice, discussion, and mutual support.",
    why: "We grow faster and deeper when we learn with others. Community provides accountability and perspective.",
    who: "Anyone wanting to grow in community rather than isolation.",
    when: "Regularly as part of your practice. In groups, partnerships, or community settings.",
    where: "In shared spaces, online forums, or with accountability partners.",
    how: "Join or create a group. Show up consistently. Offer and receive support. Learn from others' journeys."
  };

  const examples = [
    { level: "Beginner", label: "Accountability Partner", description: "Find one person to check in with weekly about your wellness goals." },
    { level: "Intermediate", label: "Practice Group", description: "Join or form a small group that practices together—meditation, journaling, or reflection." },
    { level: "Advanced", label: "Wisdom Circle", description: "Create a deeper practice community with structured sharing and mutual support protocols." }
  ];

  return (
    <>
      <SEO
        title="Collaborative Lab | The Genuine Love Project"
        description="Growing together with others - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Collaborative Lab"
        subtitle="Growing together with others"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            You don't have to do this alone. Connection with others can accelerate and deepen your growth.
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

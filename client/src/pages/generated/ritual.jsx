// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function RitualPage() {
  const benefits = pickBenefits(["calm", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Intentional, repeated practices that create meaning, mark transitions, or honor important moments.",
    why: "Rituals ground us, create sense of continuity, and help us navigate life's transitions.",
    who: "Anyone wanting more meaning in daily life or seeking ways to honor significant moments.",
    when: "Daily, weekly, seasonally, or during life transitions like beginnings and endings.",
    where: "Anywhere that feels meaningful to you—a corner of your home, nature, or a community space.",
    how: "Start simple. Choose an intention, a symbolic action, and repeat. Let rituals evolve."
  };

  const examples = [
    { level: "Beginner", label: "Morning Tea Ritual", description: "Make tea mindfully. Hold the cup. Set an intention for the day while drinking." },
    { level: "Intermediate", label: "Weekly Reflection", description: "Same time each week: review what went well, what was hard, what you're grateful for." },
    { level: "Advanced", label: "Transition Ceremony", description: "Create a personal ritual for major life changes: new beginnings, endings, or healing milestones." }
  ];

  return (
    <>
      <SEO
        title="Personal Rituals | MyMentalHealthBuddy"
        description="Meaningful practices that mark your days - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Personal Rituals"
        subtitle="Meaningful practices that mark your days"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Rituals don't need to be elaborate. The power is in repetition, intention, and presence.
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

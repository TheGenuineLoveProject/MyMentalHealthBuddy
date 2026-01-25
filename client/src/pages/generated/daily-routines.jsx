// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DailyRoutinesPage() {
  const benefits = pickBenefits(["calm", "agency", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "Template routines for morning, evening, and throughout the day that support mental wellness.",
    why: "Predictable routines reduce decision fatigue and create containers for wellbeing practices.",
    who: "Anyone feeling scattered, overwhelmed, or wanting more structure in their day.",
    when: "Start with one routine (morning is often easiest). Add others gradually.",
    where: "In your home environment. Adapt to your space and schedule.",
    how: "Keep routines short (5-15 minutes). Include what matters most. Flexibility is okay."
  };

  const examples = [
    { level: "Beginner", label: "3-Minute Morning", description: "Wake, stretch, set one intention for the day. That's it." },
    { level: "Intermediate", label: "Transition Rituals", description: "Create a 5-minute routine between work and personal time to help you shift modes." },
    { level: "Advanced", label: "Full Day Rhythm", description: "Morning activation, midday reset, evening wind-down. Design your day for energy and rest cycles." }
  ];

  return (
    <>
      <SEO
        title="Daily Routines | The Genuine Love Project"
        description="Rhythms that support your wellbeing - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Daily Routines"
        subtitle="Rhythms that support your wellbeing"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            The best routine is one you'll actually do. Start simpler than you think. Build from there.
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

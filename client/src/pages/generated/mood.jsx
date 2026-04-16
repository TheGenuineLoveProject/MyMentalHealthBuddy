// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function MoodPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "A simple way to log and track your emotional states over time to reveal patterns.",
    why: "Awareness of mood patterns helps you understand triggers, plan for vulnerable times, and celebrate progress.",
    who: "Anyone wanting more insight into their emotional life and patterns.",
    when: "Daily or multiple times daily. Consistency reveals more patterns.",
    where: "Quick check-ins work anywhere—at your desk, on your phone, or during breaks.",
    how: "Log your mood. Add brief notes if helpful. Review patterns weekly."
  };

  const examples = [
    { level: "Beginner", label: "Simple Daily Log", description: "Rate your overall mood once per day. Use a 1-5 scale or emoji." },
    { level: "Intermediate", label: "Mood + Context", description: "Log mood plus one factor: sleep, stress, activity, or social connection." },
    { level: "Advanced", label: "Comprehensive Tracking", description: "Track mood, energy, anxiety, and triggers. Review weekly for insights." }
  ];

  return (
    <>
      <SEO
        title="Mood Tracking | MyMentalHealthBuddy"
        description="Understanding your emotional patterns - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Mood Tracking"
        subtitle="Understanding your emotional patterns"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your moods are data, not destiny. Tracking helps you understand yourself better.
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

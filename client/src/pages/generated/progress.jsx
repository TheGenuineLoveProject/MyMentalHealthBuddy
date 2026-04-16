// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ProgressPage() {
  const benefits = pickBenefits(["selfRespect", "agency", "clarity", "connection"], 4);
  
  const clarity = {
    what: "A view of your accomplishments, streaks, and growth milestones.",
    why: "Recognizing progress builds motivation and self-trust. Small wins matter.",
    who: "Anyone wanting acknowledgment of their efforts and encouragement to continue.",
    when: "When you need motivation, during weekly reviews, or to celebrate milestones.",
    where: "Check your progress whenever you need a boost.",
    how: "Review completed practices, active streaks, and goals achieved. Celebrate yourself."
  };

  const examples = [
    { level: "Beginner", label: "Streak Tracker", description: "See how many days in a row you've maintained your practice." },
    { level: "Intermediate", label: "Milestone Badges", description: "Earn recognition for completing challenges and reaching goals." },
    { level: "Advanced", label: "Growth Timeline", description: "View your entire journey—from first practice to where you are now." }
  ];

  return (
    <>
      <SEO
        title="Progress Tracking | MyMentalHealthBuddy"
        description="Celebrating how far you've come - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Progress Tracking"
        subtitle="Celebrating how far you've come"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Every step forward counts. You're doing better than you might realize.
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

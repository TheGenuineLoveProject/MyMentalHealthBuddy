// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessHubPage() {
  const benefits = pickBenefits(["agency", "clarity", "calm", "connection"], 4);
  
  const clarity = {
    what: "A central dashboard to access all your wellness tools, track progress, and find what you need.",
    why: "Having everything in one place makes self-care more accessible and sustainable.",
    who: "Everyone using the platform—your home base for wellness.",
    when: "Daily check-ins, when seeking a specific tool, or for regular practice.",
    where: "Available wherever you access the platform.",
    how: "Use the navigation to find tools. Check your progress. Set daily intentions."
  };

  const examples = [
    { level: "Beginner", label: "Daily Check-In", description: "Start each session by noting how you're feeling and what you need." },
    { level: "Intermediate", label: "Practice Tracker", description: "See your streaks, completed tools, and areas of focus." },
    { level: "Advanced", label: "Custom Dashboard", description: "Arrange your hub to prioritize the tools you use most." }
  ];

  return (
    <>
      <SEO
        title="Wellness Hub | The Genuine Love Project"
        description="Your central space for wellbeing - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Hub"
        subtitle="Your central space for wellbeing"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your wellness hub is designed to make self-care simple. Everything you need is within reach.
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

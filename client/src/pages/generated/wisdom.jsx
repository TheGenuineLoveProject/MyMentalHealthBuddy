// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WisdomPage() {
  const benefits = pickBenefits(["clarity", "connection", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Curated insights, quotes, and teachings to inspire reflection and support your growth.",
    why: "Wisdom from others can offer perspective, comfort, and new ways of seeing challenges.",
    who: "Anyone seeking inspiration, perspective, or food for thought.",
    when: "Morning reflection, during difficult moments, or whenever you need a shift in perspective.",
    where: "Anywhere you can pause and consider a new idea.",
    how: "Read slowly. Sit with what resonates. Ask: 'How does this apply to my life?'"
  };

  const examples = [
    { level: "Beginner", label: "Quote of the Day", description: "Read one piece of wisdom each morning. Let it simmer throughout your day." },
    { level: "Intermediate", label: "Journaling Response", description: "Write about what the wisdom brings up for you. What does it challenge or affirm?" },
    { level: "Advanced", label: "Wisdom Integration", description: "Choose one insight per week. Look for opportunities to apply it in daily life." }
  ];

  return (
    <>
      <SEO
        title="Daily Wisdom | MyMentalHealthBuddy"
        description="Insights for reflection and growth - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Daily Wisdom"
        subtitle="Insights for reflection and growth"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Wisdom isn't just intellectual—it's lived. Let these insights guide you, but trust your own inner knowing too.
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

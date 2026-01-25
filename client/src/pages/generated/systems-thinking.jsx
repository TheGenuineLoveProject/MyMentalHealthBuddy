// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SystemsThinkingPage() {
  const benefits = pickBenefits(["clarity", "agency", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "Tools for understanding how parts of your life connect and influence each other.",
    why: "Life is interconnected. Understanding systems helps you find leverage points for change.",
    who: "Anyone wanting to understand complex patterns in their life or make lasting changes.",
    when: "When facing complex challenges, planning changes, or understanding patterns.",
    where: "Space for mapping and visual thinking is helpful.",
    how: "Map the system. Identify connections. Find leverage points. Test small changes."
  };

  const examples = [
    { level: "Beginner", label: "Connection Mapping", description: "Map how different areas of your life (work, health, relationships) affect each other." },
    { level: "Intermediate", label: "Feedback Loops", description: "Identify virtuous and vicious cycles in your patterns." },
    { level: "Advanced", label: "Leverage Points", description: "Find small changes that could create ripple effects across multiple areas." }
  ];

  return (
    <>
      <SEO
        title="Systems Thinking | The Genuine Love Project"
        description="Seeing patterns and connections - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Systems Thinking"
        subtitle="Seeing patterns and connections"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Everything is connected. Systems thinking helps you see the forest, not just the trees.
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

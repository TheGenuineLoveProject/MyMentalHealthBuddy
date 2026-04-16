// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function EmotionalIntelligencePage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Skills for recognizing, understanding, and healthily expressing emotions in yourself and others.",
    why: "Emotions carry important information. When we understand them, we make better decisions and form deeper connections.",
    who: "Anyone wanting to improve self-awareness, relationships, or emotional regulation.",
    when: "Daily reflection, during emotional moments, or when relationships feel challenging.",
    where: "In quiet reflection, journaling, or in conversation with trusted people.",
    how: "Start by naming emotions without judgment. Ask 'what is this feeling telling me?' and 'what do I need right now?'"
  };

  const examples = [
    { level: "Beginner", label: "Emotion Naming", description: "Throughout the day, pause and name what you're feeling. Just naming it can reduce its intensity." },
    { level: "Intermediate", label: "Trigger Mapping", description: "Notice patterns: what situations trigger strong emotions? What needs aren't being met?" },
    { level: "Advanced", label: "Empathy Practice", description: "In difficult conversations, pause to consider: 'What might the other person be feeling and needing?'" }
  ];

  return (
    <>
      <SEO
        title="Emotional Intelligence | MyMentalHealthBuddy"
        description="Understanding and working with your feelings - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Emotional Intelligence"
        subtitle="Understanding and working with your feelings"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            All emotions are valid—they're data, not commands. Learning to work with them takes practice and self-compassion.
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

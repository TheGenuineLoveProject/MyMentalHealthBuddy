import { Link } from "wouter";
import { ArrowLeft, Users, Heart } from "lucide-react";
import { Community } from "@/features/community/Community";
import SEO from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CommunityPage() {
  return (
  <WellnessPageShell
    title="CommunityPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Shared Presence - The Genuine Love Project"
        description="Anonymous reflections from others on the same path. No performance, no comparison — just shared humanity."
      />
      <div className="min-h-screen hero-gradient">
        <div className="content-wrapper py-8">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
                data-testid="link-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="icon-container icon-lg icon-gradient-blush">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-title">
                    Shared Presence
                  </h1>
                  <p className="text-body-sm">
                    You're not alone. Anonymous reflections from others walking similar paths remind us of our shared humanity.
                  </p>
                </div>
              </div>
            </header>

            <div className="card-bordered mb-6">
              <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[var(--sage-50)]">
                <div className="icon-container icon-sm icon-soft-sage">
                  <Heart className="w-4 h-4" />
                </div>
                <p className="text-body-sm">
                  No performance metrics, no comparison traps—just anonymous wisdom from people who understand what it means to carry invisible weight. Find comfort in knowing others have felt what you're feeling.
                </p>
              </div>
              
              <Community />
            </div>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}

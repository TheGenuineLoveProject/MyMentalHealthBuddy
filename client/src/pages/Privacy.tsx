import { Link } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, Heart, CheckCircle, XCircle } from "lucide-react";
import SEO from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Privacy() {
  return (
  <WellnessPageShell
    title="Privacy"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
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
        title="Privacy Policy - The Genuine Love Project"
        description="Privacy Policy for The Genuine Love Project mental wellness platform."
      />
      <div className="min-h-screen hero-gradient">
        <div className="content-wrapper py-8">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-4">
                <div className="icon-container icon-xl icon-gradient-teal">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal">Privacy Policy</h1>
                  <p className="text-lead">Summary for launch</p>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Privacy First</h2>
                </div>
                <p className="text-body-sm">
                  We built The Genuine Love Project to be privacy-first. We only collect what's needed to run
                  the service and improve reliability.
                </p>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">What We May Collect</h2>
                </div>
                <ul className="space-y-3">
                  {[
                    "Account data (email, basic profile)",
                    "App usage data (to improve performance and fix bugs)",
                    "Content you submit (journals/chats) only as needed to provide the features you request"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-sm">
                      <div className="icon-container icon-sm icon-soft-sage flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">What We Don't Do</h2>
                </div>
                <ul className="space-y-3">
                  {[
                    "We do not sell your personal data.",
                    "We do not use your data to target you with sensitive advertising."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-sm">
                      <div className="icon-container icon-sm icon-soft-blush flex-shrink-0 mt-0.5">
                        <XCircle className="w-4 h-4" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-gold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Your Choices</h2>
                </div>
                <p className="text-body-sm">
                  You can request data export or deletion where available. If you have questions, contact support.
                </p>
              </section>

              <footer className="card-bordered bg-[var(--sage-50)] border-[var(--sage-200)]">
                <div className="flex items-center gap-3">
                  <div className="icon-container icon-sm icon-soft-gold">
                    <Heart className="w-4 h-4" />
                  </div>
                  <p className="text-caption">
                    This is a summary for launch. Replace with a full policy before large-scale release.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}

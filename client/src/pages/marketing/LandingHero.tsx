import { Link } from "wouter";
import { Heart, ArrowRight, Sparkles, Shield } from "lucide-react";
import { BRAND } from "@shared/brand";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function LandingHero() {
  return (
  <WellnessPageShell
    title="LandingHero"
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

    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-gold-50" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sage-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-200 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 border border-sage-200 mb-8">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span className="text-sm font-medium text-teal-700">AI-Powered Wellness Companion</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-teal-800 mb-6 leading-tight">
          Discover Your Path to
          <span className="block bg-gradient-to-r from-sage-500 to-teal-600 bg-clip-text text-transparent">
            Genuine Self-Love
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          A trauma-informed mental wellness platform that meets you where you are. 
          Heal at your own pace with compassionate AI guidance, mood tracking, 
          journaling, and evidence-based tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link 
            href="/register"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-sage-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            data-testid="link-hero-start"
          >
            <Heart className="w-5 h-5" />
            Try It Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/features"
            className="px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl border-2 border-sage-200 hover:border-sage-300 hover:bg-sage-50 transition-all"
            data-testid="link-hero-explore"
          >
            Explore Features
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sage-500" />
            <span>Private & Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Trauma-Informed</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Evidence-Based</span>
          </div>
        </div>
      </div>
    </section>
  </WellnessPageShell>
  );
}

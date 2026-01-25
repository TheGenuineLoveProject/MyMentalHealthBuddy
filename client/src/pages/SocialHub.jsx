import { Link } from "wouter";
import { ArrowLeft, Share2, Instagram, Youtube, Linkedin } from "lucide-react";
import { SiPinterest, SiTiktok } from "react-icons/si";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const PLATFORMS = [
  { name: "Instagram / Reels", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { name: "YouTube Shorts", icon: Youtube, color: "from-red-500 to-red-600" },
  { name: "Pinterest", icon: SiPinterest, color: "from-red-400 to-red-500" },
  { name: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-700" },
  { name: "TikTok", icon: SiTiktok, color: "from-gray-800 to-black" },
];

export default function SocialHub() {
  return (
  <WellnessPageShell
    title="SocialHub"
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
        title="Social Hub - The Genuine Love Project"
        description="Templates, captions, hashtags, and scheduling exports for social media."
      />
      <div className="min-h-screen hero-gradient p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Share2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal">Social Hub</h1>
                <p className="text-lead">Templates, captions, hashtags, and scheduling exports</p>
              </div>
            </div>
          </header>

          <div className="card-bordered">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container icon-md icon-soft-sage">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-heading-md text-teal">Supported Platforms</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)] hover:shadow-md transition"
                  >
                    <div className={`icon-container icon-md bg-gradient-to-br ${platform.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-body-sm font-medium">{platform.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-[var(--gold-50)] border border-[var(--gold-200)]">
              <p className="text-body-sm text-[var(--gold-700)]">
                Coming soon: Connect Canva exports and post generator integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}

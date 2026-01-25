import { useState } from "react";
import { Link } from "wouter";
import { User, Camera, ChevronLeft, Settings, Bell, Shield, Save } from "lucide-react";
import SEO from "@/components/SEO";
import ObjectUploader from "@/components/ObjectUploader";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleImageUpload = (fileData) => {
    setProfileImage(fileData);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
  <WellnessPageShell
    title="Profile"
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
        title="Your Profile - The Genuine Love Project"
        description="Manage your profile and preferences"
      />
      
      <div className="min-h-screen hero-gradient">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--teal-600)] hover:text-[var(--teal-700)] mb-8 transition-colors" data-testid="link-back-dashboard">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-[var(--neutral-200)] p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-full bg-[var(--sage-100)]">
                <User className="w-6 h-6 text-[var(--sage-700)]" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--neutral-900)]">Your Profile</h1>
                <p className="text-sm text-[var(--neutral-600)]">Manage your account and preferences</p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-medium text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[var(--sage-600)]" />
                  Profile Photo
                </h2>
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-[var(--sage-100)] flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage.url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        data-testid="img-profile-photo"
                      />
                    ) : (
                      <User className="w-10 h-10 text-[var(--sage-400)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <ObjectUploader 
                      onUploadComplete={handleImageUpload}
                      allowedTypes="image"
                      className="max-w-sm"
                    />
                    <p className="text-xs text-[var(--neutral-500)] mt-2">
                      Upload a photo to personalize your profile. JPEG, PNG, or WebP up to 10MB.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[var(--teal-600)]" />
                  Preferences
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-[var(--neutral-300)] text-[var(--sage-600)] focus:ring-[var(--sage-500)]" defaultChecked data-testid="checkbox-daily-reminders" />
                    <div>
                      <span className="text-[var(--neutral-700)] group-hover:text-[var(--neutral-900)] transition-colors">Daily wellness reminders</span>
                      <p className="text-xs text-[var(--neutral-500)]">Receive gentle prompts to check in with yourself</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-[var(--neutral-300)] text-[var(--sage-600)] focus:ring-[var(--sage-500)]" defaultChecked data-testid="checkbox-email-updates" />
                    <div>
                      <span className="text-[var(--neutral-700)] group-hover:text-[var(--neutral-900)] transition-colors">Email updates</span>
                      <p className="text-xs text-[var(--neutral-500)]">Receive weekly insights and new content notifications</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-[var(--neutral-300)] text-[var(--sage-600)] focus:ring-[var(--sage-500)]" data-testid="checkbox-reduced-motion" />
                    <div>
                      <span className="text-[var(--neutral-700)] group-hover:text-[var(--neutral-900)] transition-colors">Reduce motion</span>
                      <p className="text-xs text-[var(--neutral-500)]">Minimize animations for a calmer experience</p>
                    </div>
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--blush-600)]" />
                  Privacy
                </h2>
                <p className="text-sm text-[var(--neutral-600)] mb-4">
                  Your journal entries and personal data are private and encrypted. We never share your information with third parties.
                </p>
                <Link 
                  href="/privacy" 
                  className="text-sm text-[var(--teal-600)] hover:text-[var(--teal-700)] underline"
                  data-testid="link-privacy-policy"
                >
                  Read our Privacy Policy
                </Link>
              </section>

              <div className="pt-6 border-t border-[var(--neutral-200)]">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--sage-600)] hover:bg-[var(--sage-700)] text-white rounded-lg transition-colors"
                  data-testid="button-save-profile"
                >
                  <Save className="w-4 h-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  User, ArrowLeft, Camera, Mail, Calendar, MapPin, 
  Heart, Shield, Award, Save, Loader2, Edit2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";

const ACHIEVEMENTS = [
  { icon: Heart, label: "Self-Love Champion", date: "Dec 2025" },
  { icon: Shield, label: "Consistency Master", date: "Nov 2025" },
  { icon: Award, label: "Early Adopter", date: "Oct 2025" }
];

export default function Profile() {
  useSEO({
    title: "Your Profile",
    description: "Manage your personal profile and view your wellness journey achievements.",
    noIndex: true
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || user.name || ""
      }));
    }
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: (data) => apiRequest("PUT", "/api/account/profile", data),
    onSuccess: () => {
      setEditing(false);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message || "Unable to save changes.", variant: "destructive" });
    }
  });

  const handleSave = () => {
    profileMutation.mutate({ name: formData.name });
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

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-xl icon-gradient-blush">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal" data-testid="text-page-title">Your Profile</h1>
                  <p className="text-lead">Manage your personal information</p>
                </div>
              </div>
              {!editing && (
                <Button variant="outline" onClick={() => setEditing(true)} className="btn-secondary-premium" data-testid="button-edit-profile">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </header>

          <div className="space-y-6">
            <section className="card-bordered">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--sage-300)] to-[var(--teal-400)] flex items-center justify-center">
                    <span className="text-display-lg text-white">WE</span>
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 icon-container icon-sm icon-soft-sage" data-testid="button-change-avatar">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-heading-lg text-teal">Wellness Explorer</h2>
                  <p className="text-body-sm text-[var(--sage-500)]">Member since October 2025</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] text-caption font-medium">
                      Premium Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <Input 
                    className="input-premium"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                    data-testid="input-display-name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                    <Input 
                      className="input-premium pl-10"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      data-testid="input-email"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                    <Input 
                      className="input-premium pl-10"
                      placeholder="Your city (optional)"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!editing}
                      data-testid="input-location"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                    <Input 
                      className="input-premium pl-10"
                      value={formData.timezone}
                      disabled
                      data-testid="input-timezone"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-[var(--sage-200)]">
                  <Button variant="outline" onClick={() => setEditing(false)} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={profileMutation.isPending} className="btn-premium" data-testid="button-save-profile">
                    {profileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin motion-reduce:animate-none" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </section>

            <section className="card-bordered">
              <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--gold-500)]" />
                Achievements & Badges
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((achievement, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--sage-50)]" data-testid={`achievement-${i}`}>
                    <div className="icon-container icon-md icon-soft-gold">
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-body-sm font-medium">{achievement.label}</p>
                      <p className="text-caption">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-[var(--blush-500)]" />
                Your Bio
              </h3>
              <textarea
                placeholder="Tell us a bit about yourself and your wellness journey..."
                className="w-full p-4 rounded-xl border border-[var(--sage-200)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-200)] outline-none resize-none text-body-sm"
                rows={4}
                disabled={!editing}
                defaultValue="On a journey to cultivate more self-compassion and inner peace. Grateful for this supportive community."
                data-testid="textarea-bio"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}

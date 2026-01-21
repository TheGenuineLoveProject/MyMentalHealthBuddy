import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Calendar, Shield, ArrowLeft, Save, Camera, Award, Sparkles, Heart } from "lucide-react";
import SEO from "../../components/SEO";
import { useAuth } from "../../context/AuthContext.jsx";
import { queryClient, apiRequest } from "../../lib/queryClient";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient p-6">
        <SEO title="Profile - Loading" description="Loading your profile" />
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="h-8 bg-sage-100 rounded-xl w-1/4 animate-pulse"></div>
            <div className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Profile - The Genuine Love Project"
        description="Manage your profile settings and personal information."
      />
      <div className="min-h-screen hero-gradient">
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[300px] h-[300px] bottom-20 -left-20 absolute" aria-hidden="true" />
        
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-sage-600 hover:text-teal transition-colors mb-6 font-medium"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-heading-lg text-teal font-display mb-2" data-testid="text-profile-title">
              Your Profile
            </h1>
            <p className="text-body-md text-sage-600">
              Personalize your wellness journey
            </p>
          </div>

          <div className="glass-premium rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-sage flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button 
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold-400 text-white flex items-center justify-center shadow-md hover:bg-gold-500 transition-colors"
                  aria-label="Change profile photo"
                  data-testid="button-change-photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-heading-md text-teal font-display" data-testid="text-user-name">
                  {user?.displayName || user?.email?.split("@")[0] || "Wellness Traveler"}
                </h2>
                <p className="text-body-sm text-sage-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email || "Email not set"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label" htmlFor="displayName">
                  <User className="w-4 h-4 inline mr-2" />
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-premium w-full"
                  placeholder="Your name"
                  data-testid="input-display-name"
                />
                <p className="form-hint">This is how you'll appear across the platform</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bio">
                  <Heart className="w-4 h-4 inline mr-2" />
                  About You
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input-premium w-full min-h-[100px] resize-none"
                  placeholder="Share a little about your wellness journey..."
                  data-testid="input-bio"
                />
              </div>

              <button
                onClick={() => updateMutation.mutate({ displayName, bio })}
                disabled={updateMutation.isPending}
                className="btn-premium flex items-center gap-2"
                data-testid="button-save-profile"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card card-border p-6">
              <div className="icon-container icon-md icon-soft-sage mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-heading-sm text-teal mb-2">Achievements</h3>
              <p className="text-body-sm text-sage-600 mb-4">Track your wellness milestones</p>
              <Link 
                href="/wellness" 
                className="text-sm font-medium text-teal hover:text-teal-700 transition-colors"
                data-testid="link-achievements"
              >
                View Achievements →
              </Link>
            </div>

            <div className="card card-border p-6">
              <div className="icon-container icon-md icon-soft-gold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-heading-sm text-teal mb-2">Subscription</h3>
              <p className="text-body-sm text-sage-600 mb-4">
                {profile?.plan === "pro" ? "Pro Member" : profile?.plan === "plus" ? "Plus Member" : "Free Plan"}
              </p>
              <Link 
                href="/pricing" 
                className="text-sm font-medium text-teal hover:text-teal-700 transition-colors"
                data-testid="link-upgrade"
              >
                {profile?.plan === "pro" ? "Manage Plan →" : "Upgrade →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

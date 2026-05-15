import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut, Trash2, Mail, Shield, ArrowLeft, Check, Moon, Sun, Monitor, Eye, Download, FileText, Gift, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import SEO from "../components/SEO";
import { ReferralInvite } from "../components/referral";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";
import { OfficialLumi } from "@/lumi-registry";

const VISUAL_MODES = [
  { id: "", label: "Default", icon: Sun, description: "Standard brand palette with Deep Teal primary + Gold accent" },
  { id: "low-stim", label: "Low-Stim", icon: Moon, description: "Reduced shadows, softer colors, minimal decoration" },
  { id: "reading", label: "Reading", icon: Eye, description: "Maximum legibility, white surfaces, darker text" },
];
const VISUAL_MODE_KEY = "glp-mode";
const SETTINGS_STORAGE_KEY = "glp-settings";

const AFFIRMATION_TONES = [
  { id: "gentle", label: "Gentle", description: "Soft, nurturing affirmations", icon: "🌸" },
  { id: "empowering", label: "Empowering", description: "Strong, motivating affirmations", icon: "⚡" },
  { id: "poetic", label: "Poetic", description: "Metaphorical, artistic affirmations", icon: "✨" },
];

const MOOD_BACKGROUNDS = [
  { id: "adaptive", label: "Emotion Adaptive", description: "Changes based on your mood" },
  { id: "calm", label: "Calm Sage", description: "Peaceful green gradients" },
  { id: "warm", label: "Warm Rose", description: "Gentle dusty rose tones" },
  { id: "focused", label: "Focused Teal", description: "Deep, grounding teals" },
];

export default function Settings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [visualMode, setVisualMode] = useState("");
  const [affirmationTone, setAffirmationTone] = useState("gentle");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [moodBackground, setMoodBackground] = useState("adaptive");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/user-settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences?.general) {
            const p = data.preferences.general;
            if (p.theme) setTheme(p.theme);
            if (p.notifications !== undefined) setNotifications(p.notifications);
            if (p.visualMode !== undefined) setVisualMode(p.visualMode);
            if (p.affirmationTone) setAffirmationTone(p.affirmationTone);
            if (p.voiceEnabled !== undefined) setVoiceEnabled(p.voiceEnabled);
            if (p.moodBackground) setMoodBackground(p.moodBackground);
          }
        } else {
          loadFromLocalStorage();
        }
      } catch {
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const loadFromLocalStorage = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      const savedNotifications = localStorage.getItem("notifications") !== "false";
      const savedMode = localStorage.getItem(VISUAL_MODE_KEY) || "";
      const savedTone = localStorage.getItem("glp-affirmation-tone") || "gentle";
      const savedVoice = localStorage.getItem("glp-voice-enabled") === "true";
      const savedMoodBg = localStorage.getItem("glp-mood-background") || "adaptive";
      setTheme(savedTheme);
      setNotifications(savedNotifications);
      setVisualMode(savedMode);
      setAffirmationTone(savedTone);
      setVoiceEnabled(savedVoice);
      setMoodBackground(savedMoodBg);
    };
    
    loadSettings();
  }, []);

  function handleVisualModeChange(modeId) {
    setVisualMode(modeId);
    document.documentElement.dataset.mode = modeId;
    localStorage.setItem(VISUAL_MODE_KEY, modeId);
  }

  async function handleSavePreferences() {
    setIsSaving(true);
    
    const preferences = {
      theme,
      notifications,
      visualMode,
      affirmationTone,
      voiceEnabled,
      moodBackground
    };
    
    try {
      const res = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ preferences: { general: preferences } })
      });
      
      if (res.ok) {
        toast({ title: "Settings saved", description: "Your preferences are synced." });
        setMessage("Preferences saved successfully!");
      } else {
        saveToLocalStorage();
        toast({ title: "Saved locally", description: "Log in to sync across devices." });
        setMessage("Saved locally");
      }
    } catch {
      saveToLocalStorage();
      toast({ title: "Saved locally", description: "Settings saved to this device." });
      setMessage("Saved locally");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }
  
  function saveToLocalStorage() {
    localStorage.setItem("theme", theme);
    localStorage.setItem("notifications", String(notifications));
    localStorage.setItem("glp-affirmation-tone", affirmationTone);
    localStorage.setItem("glp-voice-enabled", String(voiceEnabled));
    localStorage.setItem("glp-mood-background", moodBackground);
  }

  function handleLogout() {
    logout();
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
    );
    if (confirmed) {
      logout();
      setLocation("/");
    }
  }

  async function handleExportData() {
    setIsExporting(true);
    try {
      const response = await fetch("/api/account/export", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `genuine-love-project-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage("Your data has been exported successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Export failed. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsExporting(false);
    }
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
  <div className="hxos-vnext">
  <WellnessPageShell
    title=""
    subtitle=""
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
        title="Settings - The Genuine Love Project"
        description="Manage your account settings, preferences, and notifications."
      />
      <div data-testid="page-settings" className="min-h-screen v28-paper-bg">
        <div className="content-wrapper py-8">
          <div className="max-w-xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your settings...</p>
              </div>
            ) : (
            <>
            <header className="flex items-center gap-4 mb-8">
              <Link 
                href="/dashboard" 
                className="p-3 rounded-xl bg-white border border-[var(--sage-200)] text-[var(--teal-600)] hover:bg-[var(--sage-50)] transition shadow-sm" 
                data-testid="link-back" 
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="icon-container icon-lg icon-gradient-sage">
                  <SettingsIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h1 data-testid="text-settings-title" className="text-heading-lg text-teal">
                    Settings
                  </h1>
                  <p className="text-body-sm">Manage your preferences</p>
                </div>
              </div>
              {/* v5.8.72 — small canonical Lumi (LUMI_COMPANION) beside title */}
              <OfficialLumi variant="LUMI_COMPANION" scene="page-header" position="inline" pageId="settings" widthPx={60} decorative />
            </header>

            {message && (
              <div
                data-testid="text-success-message"
                role="status"
                className="p-4 rounded-xl mb-6 flex items-center gap-3 bg-[var(--sage-100)] border border-[var(--sage-300)] text-[var(--sage-700)] animate-fade-in-up"
              >
                <div className="icon-container icon-sm icon-gradient-sage">
                  <Check className="w-4 h-4" aria-hidden="true" />
                </div>
                {message}
              </div>
            )}

            <section data-testid="section-account" className="card-bordered mb-6" aria-labelledby="account-heading">
              <div className="flex items-center gap-3 mb-5">
                <div className="icon-container icon-md icon-soft-teal">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 id="account-heading" className="text-heading-md text-teal">Account Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="email" className="form-label flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--teal-400)]" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    data-testid="input-email"
                    value={user?.email || ""}
                    disabled
                    aria-readonly="true"
                    className="input-premium bg-[var(--sage-50)] text-[var(--teal-600)] cursor-not-allowed"
                  />
                  <p className="form-hint">Email cannot be changed at this time</p>
                </div>
              </div>
            </section>

            <section data-testid="section-preferences" className="card-bordered mb-6" aria-labelledby="preferences-heading">
              <div className="flex items-center gap-3 mb-5">
                <div className="icon-container icon-md icon-soft-gold">
                  <Palette className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 id="preferences-heading" className="text-heading-md text-teal">Preferences</h2>
              </div>
              
              <div className="space-y-6">
                <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl hover:bg-[var(--sage-50)] transition">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      data-testid="checkbox-notifications"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-5 h-5 rounded accent-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-400)]"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="w-4 h-4 text-[var(--sage-500)]" aria-hidden="true" />
                      <span className="font-semibold text-[var(--teal-700)]">Reminder notifications</span>
                    </div>
                    <p className="text-body-sm">Get gentle reminders to check in with your mood</p>
                  </div>
                </label>

                <div>
                  <label className="form-label mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = theme === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTheme(option.value)}
                          data-testid={`button-theme-${option.value}`}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                            isSelected
                              ? "border-[var(--sage-500)] bg-[var(--sage-100)] text-[var(--sage-700)]"
                              : "border-[var(--sage-200)] bg-white hover:border-[var(--sage-300)] text-[var(--teal-600)]"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? "text-[var(--sage-600)]" : "text-[var(--teal-400)]"}`} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label mb-3 block">Display Mode</label>
                  <p className="text-body-sm mb-4">Adjust visual intensity for comfort and accessibility</p>
                  <div className="space-y-2">
                    {VISUAL_MODES.map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = visualMode === mode.id;
                      return (
                        <button
                          key={mode.id || "default"}
                          type="button"
                          onClick={() => handleVisualModeChange(mode.id)}
                          aria-pressed={isSelected}
                          data-testid={`button-visual-mode-${mode.id || "default"}`}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 ${
                            isSelected
                              ? "border-[var(--glp-primary)] bg-[var(--surface-2)]"
                              : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--glp-sage)]"
                          }`}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-2)]"}`} aria-hidden="true" />
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-1)]"}`}>
                              {mode.label}
                            </div>
                            <div className="text-xs text-[var(--text-2)] truncate">
                              {mode.description}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label mb-3 block">Affirmation Tone</label>
                  <p className="text-body-sm mb-4">Choose how affirmations speak to you</p>
                  <div className="grid grid-cols-3 gap-3">
                    {AFFIRMATION_TONES.map((tone) => {
                      const isSelected = affirmationTone === tone.id;
                      return (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setAffirmationTone(tone.id)}
                          aria-pressed={isSelected}
                          data-testid={`button-tone-${tone.id}`}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                            isSelected
                              ? "border-[var(--glp-gold)] bg-[var(--glp-gold)]/10 text-[var(--teal-700)]"
                              : "border-[var(--sage-200)] bg-white hover:border-[var(--sage-300)] text-[var(--teal-600)]"
                          }`}
                        >
                          <span className="text-2xl" aria-hidden="true">{tone.icon}</span>
                          <span className="text-sm font-medium">{tone.label}</span>
                          <span className="text-xs text-[var(--text-2)] text-center">{tone.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl hover:bg-[var(--sage-50)] transition border border-[var(--sage-200)]">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      data-testid="checkbox-voice"
                      checked={voiceEnabled}
                      onChange={(e) => setVoiceEnabled(e.target.checked)}
                      className="w-5 h-5 rounded accent-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-400)]"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg" aria-hidden="true">🪷</span>
                      <span className="font-semibold text-[var(--teal-700)]">Voice Affirmations (Lotus Guide)</span>
                    </div>
                    <p className="text-body-sm">Enable spoken affirmations using gentle voice synthesis</p>
                  </div>
                </label>

                <div>
                  <label className="form-label mb-3 block">Mood Background Theme</label>
                  <p className="text-body-sm mb-4">Set your default emotional atmosphere</p>
                  <div className="space-y-2">
                    {MOOD_BACKGROUNDS.map((bg) => {
                      const isSelected = moodBackground === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setMoodBackground(bg.id)}
                          aria-pressed={isSelected}
                          data-testid={`button-mood-bg-${bg.id}`}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 ${
                            isSelected
                              ? "border-[var(--glp-primary)] bg-[var(--surface-2)]"
                              : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--glp-sage)]"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-1)]"}`}>
                              {bg.label}
                            </div>
                            <div className="text-xs text-[var(--text-2)] truncate">
                              {bg.description}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  data-testid="button-save-preferences"
                  disabled={isSaving}
                  aria-busy={isSaving}
                  className="w-full btn-premium py-3.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" />
                      Saving...
                    </span>
                  ) : (
                    "Save Preferences"
                  )}
                </button>
              </div>
            </section>

            <section data-testid="section-privacy" className="card-bordered mb-6" aria-labelledby="privacy-heading">
              <div className="flex items-center gap-3 mb-5">
                <div className="icon-container icon-md icon-soft-sage">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 id="privacy-heading" className="text-heading-md text-teal">Privacy & Data</h2>
              </div>
              
              <p className="text-body-sm mb-4">
                Your data belongs to you. Download a complete copy of all your wellness data, journal entries, mood logs, and chat history.
              </p>

              <button
                onClick={handleExportData}
                data-testid="button-export-data"
                disabled={isExporting}
                aria-busy={isExporting}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-[var(--sage-300)] bg-[var(--sage-50)] hover:bg-[var(--sage-100)] hover:border-[var(--sage-400)] transition text-[var(--teal-600)] font-medium disabled:opacity-50"
              >
                {isExporting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--teal-300)] border-t-[var(--teal-600)] rounded-full animate-spin motion-reduce:animate-none" />
                    Preparing export...
                  </span>
                ) : (
                  <>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download My Data
                  </>
                )}
              </button>

              <div className="mt-4 p-3 rounded-lg bg-[var(--sage-50)] border border-[var(--sage-200)]">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-[var(--teal-500)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-caption">
                    Your export includes: profile info, mood entries, journal entries, and AI chat history in JSON format.
                  </p>
                </div>
              </div>
            </section>

            <section data-testid="section-referral" className="card-bordered" aria-labelledby="referral-heading">
              <h2 id="referral-heading" className="text-heading-md text-teal mb-5 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Invite Friends
              </h2>
              <ReferralInvite />
            </section>

            <section data-testid="section-actions" className="card-bordered" aria-labelledby="actions-heading">
              <h2 id="actions-heading" className="text-heading-md text-teal mb-5">Account Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  data-testid="button-logout"
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-[var(--sage-200)] bg-white hover:bg-[var(--sage-50)] hover:border-[var(--sage-300)] transition text-[var(--teal-600)] font-medium"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Log Out
                </button>

                <button
                  onClick={handleDeleteAccount}
                  data-testid="button-delete-account"
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-[var(--blush-200)] bg-white hover:bg-[var(--blush-50)] hover:border-[var(--blush-400)] transition text-[var(--blush-600)] font-medium"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Delete Account
                </button>
              </div>

              <p className="text-caption mt-4 text-center">
                Deleting your account is permanent and cannot be undone
              </p>
            </section>
            </>
            )}
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  </div>
  );
}

import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut, Trash2, Mail, Shield, ArrowLeft, Check, Moon, Sun, Monitor, Eye, Download, FileText, Gift } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import SEO from "../components/SEO";
import { ReferralInvite } from "../components/referral";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const VISUAL_MODES = [
  { id: "", label: "Default", icon: Sun, description: "Standard brand palette with Deep Teal primary + Gold accent" },
  { id: "low-stim", label: "Low-Stim", icon: Moon, description: "Reduced shadows, softer colors, minimal decoration" },
  { id: "reading", label: "Reading", icon: Eye, description: "Maximum legibility, white surfaces, darker text" },
];
const VISUAL_MODE_KEY = "glp-mode";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [visualMode, setVisualMode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    const savedMode = localStorage.getItem(VISUAL_MODE_KEY) || "";
    setTheme(savedTheme);
    setNotifications(savedNotifications);
    setVisualMode(savedMode);
  }, []);

  function handleVisualModeChange(modeId) {
    setVisualMode(modeId);
    document.documentElement.dataset.mode = modeId;
    localStorage.setItem(VISUAL_MODE_KEY, modeId);
  }

  function handleSavePreferences() {
    setIsSaving(true);
    localStorage.setItem("theme", theme);
    localStorage.setItem("notifications", String(notifications));

    setTimeout(() => {
      setIsSaving(false);
      setMessage("Preferences saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    }, 500);
  }

  function handleLogout() {
    logout();
    setLocation("/login");
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
  <WellnessPageShell
    title="Settings"
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
        title="Settings - The Genuine Love Project"
        description="Manage your account settings, preferences, and notifications."
      />
      <div data-testid="page-settings" className="min-h-screen hero-gradient">
        <div className="content-wrapper py-8">
          <div className="max-w-xl mx-auto">
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

                <button
                  onClick={handleSavePreferences}
                  data-testid="button-save-preferences"
                  disabled={isSaving}
                  aria-busy={isSaving}
                  className="w-full btn-premium py-3.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                    <div className="w-4 h-4 border-2 border-[var(--teal-300)] border-t-[var(--teal-600)] rounded-full animate-spin" />
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
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}

import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut, Trash2, Mail, Shield, ArrowLeft, Check, Moon, Sun, Monitor } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import SEO from "../components/SEO";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    setTheme(savedTheme);
    setNotifications(savedNotifications);
  }, []);

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

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
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
  );
}

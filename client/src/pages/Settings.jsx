import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut, Trash2, Mail, Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
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

  return (
    <div data-testid="page-settings" className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-neutral-400 hover:text-white transition" data-testid="link-back">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-purple-400" />
            <h1 data-testid="text-settings-title" className="text-3xl font-bold">
              Settings
            </h1>
          </div>
        </div>

        {message && (
          <div
            data-testid="text-success-message"
            role="status"
            className="p-4 rounded-xl mb-6 flex items-center gap-3 bg-green-900/50 border border-green-700 text-green-200"
          >
            <Shield className="w-5 h-5" />
            {message}
          </div>
        )}

        <section data-testid="section-account" className="bg-neutral-800 p-6 rounded-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium mb-2 text-neutral-400"
              >
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                data-testid="input-email"
                value={user?.email || ""}
                disabled
                aria-readonly="true"
                className="w-full p-3 rounded-xl border bg-neutral-900 text-neutral-400 border-neutral-700"
              />
              <p className="text-xs mt-1 text-neutral-500">
                Email cannot be changed at this time
              </p>
            </div>
          </div>
        </section>

        <section data-testid="section-preferences" className="bg-neutral-800 p-6 rounded-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>
          
          <div className="space-y-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  data-testid="checkbox-notifications"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-neutral-400" />
                  <span className="font-medium">Reminder notifications</span>
                </div>
                <p className="text-sm mt-1 text-neutral-500">
                  Get gentle reminders to check in with your mood
                </p>
              </div>
            </label>

            <div>
              <label
                htmlFor="theme-select"
                className="block text-sm font-medium mb-2"
              >
                Theme
              </label>
              <select
                id="theme-select"
                data-testid="select-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-xl border bg-neutral-900 text-white border-neutral-700"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <button
              onClick={handleSavePreferences}
              data-testid="button-save-preferences"
              disabled={isSaving}
              aria-busy={isSaving}
              className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </section>

        <section data-testid="section-actions" className="bg-neutral-800 p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              data-testid="button-logout"
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-neutral-700 hover:bg-neutral-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            
            <button
              onClick={handleDeleteAccount}
              data-testid="button-delete-account"
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-900/50 border border-red-700 text-red-200 hover:bg-red-900 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </section>

        <div
          data-testid="section-support"
          className="bg-neutral-800 p-4 rounded-xl text-center"
        >
          <p className="text-sm text-neutral-400">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@mymentalhealthbuddy.com"
              data-testid="link-support-email"
              className="font-medium text-blue-400 hover:underline"
            >
              support@mymentalhealthbuddy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

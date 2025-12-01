import { useState, useEffect } from "react";
import { getStoredUser, logout } from "../utils/api";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut, Trash2, Mail, Shield } from "lucide-react";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    setTheme(savedTheme);
    setNotifications(savedNotifications);

    const user = getStoredUser();
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
    }
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
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
    );
    if (confirmed) {
      logout();
    }
  }

  return (
    <div data-testid="page-settings" className="min-h-screen" style={{ background: "var(--background)" }}>
      <div 
        className="py-12 px-6 mb-8 animate-fade-in"
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "0 0 2rem 2rem"
        }}
      >
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SettingsIcon className="w-10 h-10 text-white" />
            <h1 
              data-testid="text-settings-title"
              className="text-3xl font-bold text-white"
            >
              Settings
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 pb-12">
        {message && (
          <div
            data-testid="text-success-message"
            role="status"
            className="p-4 rounded-xl mb-6 animate-fade-in flex items-center gap-3"
            style={{ background: "#ecfdf5", color: "#047857" }}
          >
            <Shield className="w-5 h-5" />
            {message}
          </div>
        )}

        <section 
          data-testid="section-account"
          className="card p-6 mb-6 animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Account Information
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                data-testid="input-email"
                value={email}
                disabled
                aria-readonly="true"
                className="w-full p-3 rounded-xl border"
                style={{ 
                  background: "var(--background)",
                  color: "var(--text-muted)",
                  borderColor: "var(--border)"
                }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Email cannot be changed at this time
              </p>
            </div>

            {name && (
              <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Name
                </label>
                <p data-testid="text-name" className="font-medium mt-1" style={{ color: "var(--text-primary)" }}>
                  {name}
                </p>
              </div>
            )}
          </div>
        </section>

        <section 
          data-testid="section-preferences"
          className="card p-6 mb-6 animate-fade-in stagger-1"
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Preferences
            </h2>
          </div>
          
          <div className="space-y-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  data-testid="checkbox-notifications"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    Reminder notifications
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Get gentle reminders to check in with your mood
                </p>
              </div>
            </label>

            <div>
              <label
                htmlFor="theme-select"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Theme
              </label>
              <select
                id="theme-select"
                data-testid="select-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-xl border"
                style={{ 
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border)"
                }}
              >
                <option value="light">☀️ Light</option>
                <option value="dark">🌙 Dark</option>
                <option value="system">💻 System</option>
              </select>
            </div>

            <button
              onClick={handleSavePreferences}
              data-testid="button-save-preferences"
              disabled={isSaving}
              aria-busy={isSaving}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </section>

        <section 
          data-testid="section-actions"
          className="card p-6 mb-6 animate-fade-in stagger-2"
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Account Actions
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              data-testid="button-logout"
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ 
                borderColor: "var(--border)",
                color: "var(--text-primary)"
              }}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            
            <button
              onClick={handleDeleteAccount}
              data-testid="button-delete-account"
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-all"
              style={{ 
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca"
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </section>

        <div
          data-testid="section-support"
          className="card p-4 text-center animate-fade-in stagger-3"
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Need help? Contact us at{" "}
            <a
              href="mailto:support@mymentalhealthbuddy.com"
              data-testid="link-support-email"
              className="font-medium hover:underline"
              style={{ color: "var(--primary)" }}
            >
              support@mymentalhealthbuddy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

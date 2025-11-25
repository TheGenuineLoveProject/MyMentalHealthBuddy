import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../utils/api";

export default function Settings() {
  const navigate = useNavigate();
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

  function Section({
    title,
    children,
    testId,
  }: {
    title: string;
    children: React.ReactNode;
    testId?: string;
  }) {
    return (
      <section
        data-testid={testId}
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          {title}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <div data-testid="page-settings" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1
        data-testid="text-settings-title"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f2937" }}
      >
        Settings
      </h1>
      <p data-testid="text-settings-subtitle" style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Manage your account and preferences.
      </p>

      {message && (
        <div
          data-testid="text-success-message"
          role="status"
          style={{
            padding: "1rem",
            background: "#ecfdf5",
            color: "#047857",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontWeight: 500,
          }}
        >
          {message}
        </div>
      )}

      <Section title="Account Information" testId="section-account">
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            data-testid="input-email"
            value={email}
            disabled
            aria-readonly="true"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              color: "#6b7280",
              boxSizing: "border-box",
            }}
          />
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.25rem" }}>
            Email cannot be changed at this time.
          </p>
        </div>

        {name && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Name
            </label>
            <p data-testid="text-name" style={{ color: "#374151", fontWeight: 500 }}>{name}</p>
          </div>
        )}
      </Section>

      <Section title="Preferences" testId="section-preferences">
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              data-testid="checkbox-notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#4f46e5" }}
            />
            <span style={{ fontWeight: 500, color: "#374151" }}>
              Enable reminder notifications
            </span>
          </label>
          <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.25rem", marginLeft: "2rem" }}>
            Get gentle reminders to check in with your mood.
          </p>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="theme-select"
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            Theme
          </label>
          <select
            id="theme-select"
            data-testid="select-theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
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
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            border: "none",
            background: isSaving ? "#9ca3af" : "#4f46e5",
            color: "white",
            fontWeight: 600,
            cursor: isSaving ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </Section>

      <Section title="Account Actions" testId="section-actions">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={handleLogout}
            data-testid="button-logout"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "white",
              color: "#374151",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Log Out
          </button>
          <button
            onClick={handleDeleteAccount}
            data-testid="button-delete-account"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#dc2626",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Delete Account
          </button>
        </div>
      </Section>

      <div
        data-testid="section-support"
        style={{
          padding: "1rem",
          background: "#f9fafb",
          borderRadius: "10px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.85rem",
        }}
      >
        Need help? Contact us at{" "}
        <a
          href="mailto:support@mymentalhealthbuddy.com"
          data-testid="link-support-email"
          style={{ color: "#4f46e5", textDecoration: "none" }}
        >
          support@mymentalhealthbuddy.com
        </a>
      </div>
    </div>
  );
}

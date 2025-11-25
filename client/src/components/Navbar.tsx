import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, logout as apiLogout } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [location.pathname]);

  function handleLogout() {
    apiLogout();
  }

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  const linkStyle = (path: string) => ({
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: isActive(path) 
      ? "#4f46e5" 
      : theme === "dark" ? "#e5e7eb" : "#374151",
    background: isActive(path) 
      ? theme === "dark" ? "#312e81" : "#eef2ff" 
      : "transparent",
    transition: "all 0.2s ease",
  });

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", testId: "link-dashboard" },
    { to: "/mood", label: "Mood", testId: "link-mood" },
    { to: "/journal", label: "Journal", testId: "link-journal" },
    { to: "/chat", label: "AI Chat", testId: "link-chat" },
    { to: "/analytics", label: "Analytics", testId: "link-analytics" },
    { to: "/settings", label: "Settings", testId: "link-settings" },
  ];

  return (
    <nav
      data-testid="navbar"
      role="navigation"
      aria-label="Main navigation"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: theme === "dark" ? "#1f2937" : "white",
        borderBottom: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <Link
        to="/"
        data-testid="link-logo"
        aria-label="MyMentalHealthBuddy Home"
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#4f46e5",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🧠</span>
        <span className="hide-mobile">MyMentalHealthBuddy</span>
      </Link>

      <div
        data-testid="nav-links"
        style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
      >
        {isLoggedIn ? (
          <>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={link.testId}
                aria-current={isActive(link.to) ? "page" : undefined}
                style={linkStyle(link.to)}
                className="hide-mobile"
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "none",
                background: theme === "dark" ? "#374151" : "#f3f4f6",
                color: theme === "dark" ? "#fbbf24" : "#6b7280",
                cursor: "pointer",
                fontSize: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            
            <button
              onClick={handleLogout}
              data-testid="button-logout"
              type="button"
              aria-label="Log out of your account"
              style={{
                marginLeft: "0.25rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
                background: theme === "dark" ? "#374151" : "white",
                color: theme === "dark" ? "#e5e7eb" : "#6b7280",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "none",
                background: theme === "dark" ? "#374151" : "#f3f4f6",
                color: theme === "dark" ? "#fbbf24" : "#6b7280",
                cursor: "pointer",
                fontSize: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            
            <Link
              to="/login"
              data-testid="link-login"
              aria-current={isActive("/login") ? "page" : undefined}
              style={linkStyle("/login")}
            >
              Login
            </Link>
            <Link
              to="/register"
              data-testid="link-register"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "white",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
              }}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

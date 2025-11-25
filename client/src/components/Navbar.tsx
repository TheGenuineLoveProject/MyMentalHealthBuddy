import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: isActive(path) ? "#4f46e5" : "#374151",
    background: isActive(path) ? "#eef2ff" : "transparent",
    transition: "all 0.2s ease",
  });

  return (
    <nav
      data-testid="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        data-testid="link-home"
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#4f46e5",
          textDecoration: "none",
        }}
      >
        MyMentalHealthBuddy
      </Link>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" data-testid="link-dashboard" style={linkStyle("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/mood" data-testid="link-mood" style={linkStyle("/mood")}>
              Mood
            </Link>
            <Link to="/journal" data-testid="link-journal" style={linkStyle("/journal")}>
              Journal
            </Link>
            <Link to="/chat" data-testid="link-chat" style={linkStyle("/chat")}>
              AI Chat
            </Link>
            <Link to="/analytics" data-testid="link-analytics" style={linkStyle("/analytics")}>
              Analytics
            </Link>
            <Link to="/settings" data-testid="link-settings" style={linkStyle("/settings")}>
              Settings
            </Link>
            <button
              onClick={handleLogout}
              data-testid="button-logout"
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "white",
                color: "#6b7280",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" data-testid="link-login" style={linkStyle("/login")}>
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
                background: "#4f46e5",
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

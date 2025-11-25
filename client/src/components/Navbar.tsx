import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, logout as apiLogout } from "../utils/api";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [location.pathname]);

  function handleLogout() {
    apiLogout();
  }

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  function linkStyle(path: string) {
    return {
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: 500,
      fontSize: "0.95rem",
      color: isActive(path) ? "#4f46e5" : "#374151",
      background: isActive(path) ? "#eef2ff" : "transparent",
      transition: "all 0.2s ease",
    };
  }

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
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
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
        }}
      >
        MyMentalHealthBuddy
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
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              data-testid="button-logout"
              type="button"
              aria-label="Log out of your account"
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "white",
                color: "#6b7280",
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
                background: "#4f46e5",
                transition: "all 0.2s ease",
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

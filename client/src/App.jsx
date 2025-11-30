// MyMentalHealthBuddy — App Shell
// Wouter + React Query + ThemeProvider
// Replit + Vite safe

import React from "react";
import { Router, Route, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import "./index.css";

// -----------------------------------------
// React Query client (one per app)
// -----------------------------------------
const queryClient = new QueryClient();

// -----------------------------------------
// Simple healing pages (safe defaults)
// You can swap these with your real pages
// later without breaking the shell.
// -----------------------------------------

function HomePage() {
  return (
    <div className="page container" data-testid="page-home">
      <h1>MyMentalHealthBuddy</h1>
      <p style={{ marginTop: "0.75rem" }}>
        A gentle place to track your mood, write your truth, and talk to a
        supportive AI buddy — while staying safe and in control.
      </p>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="page container" data-testid="page-dashboard">
      <h2>Dashboard</h2>
      <p style={{ marginTop: "0.75rem" }}>
        Your overview of recent moods, journal entries, and healing progress
        will appear here.
      </p>
    </div>
  );
}

function MoodPage() {
  return (
    <div className="page container" data-testid="page-mood">
      <h2>Mood Tracker</h2>
      <p style={{ marginTop: "0.75rem" }}>
        Log how you feel in this moment. Your feelings make sense here.
      </p>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
        <button className="btn emotion-happy" data-testid="mood-happy">
          😊 Happy
        </button>
        <button className="btn emotion-calm" data-testid="mood-calm">
          😌 Calm
        </button>
        <button className="btn emotion-sad" data-testid="mood-sad">
          😢 Sad
        </button>
        <button className="btn emotion-angry" data-testid="mood-angry">
          😠 Angry
        </button>
        <button className="btn emotion-anxious" data-testid="mood-anxious">
          😰 Anxious
        </button>
      </div>
    </div>
  );
}

function JournalPage() {
  return (
    <div className="page container" data-testid="page-journal">
      <h2>Journal</h2>
      <p style={{ marginTop: "0.75rem" }}>
        This is a space for your honest, unfiltered truth. No judgment.
      </p>
      <textarea
        className="input"
        rows={8}
        placeholder="You can write anything here. Anger, sadness, hope — all of it belongs."
        data-testid="journal-textarea"
        style={{ marginTop: "1rem", resize: "vertical" }}
      />
      <button
        className="btn"
        style={{ marginTop: "0.75rem" }}
        data-testid="journal-save"
      >
        Save entry
      </button>
    </div>
  );
}

function AIChatPage() {
  return (
    <div className="page container" data-testid="page-ai-chat">
      <h2>AI Support Buddy</h2>
      <p style={{ marginTop: "0.75rem" }}>
        Soon this page will connect directly to your healing AI buddy using the
        /api/ai endpoint.
      </p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="page container" data-testid="page-login">
      <h2>Login</h2>
      <p style={{ marginTop: "0.75rem" }}>
        Welcome back. You deserve support that actually cares.
      </p>
      <form style={{ marginTop: "1rem", maxWidth: 360 }}>
        <label>
          <span>Email</span>
          <input
            className="input"
            type="email"
            autoComplete="email"
            data-testid="login-email"
            style={{ marginTop: "0.25rem" }}
          />
        </label>
        <label style={{ display: "block", marginTop: "0.75rem" }}>
          <span>Password</span>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            data-testid="login-password"
            style={{ marginTop: "0.25rem" }}
          />
        </label>
        <button
          className="btn"
          type="submit"
          style={{ marginTop: "0.9rem" }}
          data-testid="login-submit"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="page container" data-testid="page-register">
      <h2>Create account</h2>
      <p style={{ marginTop: "0.75rem" }}>
        Your healing space will be created with love and care.
      </p>
      <form style={{ marginTop: "1rem", maxWidth: 360 }}>
        <label>
          <span>Email</span>
          <input
            className="input"
            type="email"
            autoComplete="email"
            data-testid="register-email"
            style={{ marginTop: "0.25rem" }}
          />
        </label>
        <label style={{ display: "block", marginTop: "0.75rem" }}>
          <span>Password</span>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            data-testid="register-password"
            style={{ marginTop: "0.25rem" }}
          />
        </label>
        <button
          className="btn"
          type="submit"
          style={{ marginTop: "0.9rem" }}
          data-testid="register-submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page container" data-testid="page-404">
      <h2>Page not found</h2>
      <p style={{ marginTop: "0.75rem" }}>
        This path doesn’t exist yet. You didn’t do anything wrong.
      </p>
      <Link href="/" data-testid="go-home-link">
        <button className="btn" style={{ marginTop: "0.75rem" }}>
          Go home
        </button>
      </Link>
    </div>
  );
}

// -----------------------------------------
// Layout with navigation + theme toggle
// -----------------------------------------

function AppLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-wrapper" data-testid="app-shell">
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-soft)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
        }}
      >
        <nav
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <Link href="/" data-testid="nav-logo">
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
              }}
            >
              MyMentalHealthBuddy
            </span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Link href="/dashboard" data-testid="nav-dashboard">
              <span style={{ cursor: "pointer" }}>Dashboard</span>
            </Link>
            <Link href="/mood" data-testid="nav-mood">
              <span style={{ cursor: "pointer" }}>Mood</span>
            </Link>
            <Link href="/journal" data-testid="nav-journal">
              <span style={{ cursor: "pointer" }}>Journal</span>
            </Link>
            <Link href="/ai-chat" data-testid="nav-ai-chat">
              <span style={{ cursor: "pointer" }}>AI Buddy</span>
            </Link>

            <Link href="/login" data-testid="nav-login">
              <span style={{ cursor: "pointer" }}>Login</span>
            </Link>
            <Link href="/register" data-testid="nav-register">
              <span style={{ cursor: "pointer" }}>Sign up</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Wouter routes with data-testid for testing */}
        <Route path="/">
          <HomePage />
        </Route>

        <Route path="/dashboard">
          <DashboardPage />
        </Route>

        <Route path="/mood">
          <MoodPage />
        </Route>

        <Route path="/journal">
          <JournalPage />
        </Route>

        <Route path="/ai-chat">
          <AIChatPage />
        </Route>

        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/register">
          <RegisterPage />
        </Route>

        {/* Catch-all 404 */}
        <Route path="/:rest*">
          <NotFoundPage />
        </Route>
      </main>
    </div>
  );
}

// -----------------------------------------
// Root App with providers
// -----------------------------------------

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
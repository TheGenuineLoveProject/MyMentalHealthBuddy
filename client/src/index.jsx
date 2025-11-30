/* ----------------------------------------------------
   MyMentalHealthBuddy Frontend Shell
   - Wouter routing
   - @tanstack/react-query for data
   - Simple ThemeProvider (light/dark)
   - Auth UI (Login + Register) wired to backend
   - data-testid attributes for key elements
----------------------------------------------------- */

import React from "react";
import { createRoot } from "react-dom/client";
import { Router, Route, Link, useLocation } from "wouter";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";

/* ---------------- THEME PROVIDER ------------------ */

const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.dataset.theme = next;
  };

  React.useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => React.useContext(ThemeContext);

/* ----------------- API HELPERS -------------------- */

const API_BASE = "/api";

async function apiPost(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || data.message || "Request failed");
    err.validationErrors = data.validationErrors || data.errors || [];
    throw err;
  }

  return data;
}

/* ------------- AUTH MUTATIONS (react-query) ------------- */

const useRegisterMutation = () =>
  useMutation({
    mutationFn: ({ email, password }) =>
      apiPost("/auth/register", { email, password }),
  });

const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ email, password }) =>
      apiPost("/auth/login", { email, password }),
  });

/* ------------------- PAGES ------------------------ */

const Layout = ({ children }) => {
  const theme = useTheme();
  const [location] = useLocation();

  const linkStyle = (path) => ({
    marginRight: "12px",
    textDecoration: location === path ? "underline" : "none",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.theme === "dark" ? "#050816" : "#f5f5f5",
        color: theme.theme === "dark" ? "#f9fafb" : "#111827",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom:
            theme.theme === "dark" ? "1px solid #1f2937" : "1px solid #e5e7eb",
        }}
      >
        <div>
          <strong>MyMentalHealthBuddy</strong>
        </div>
        <nav aria-label="Main navigation">
          <Link href="/" data-testid="nav-home">
            <span style={linkStyle("/")}>Home</span>
          </Link>
          <Link href="/login" data-testid="nav-login">
            <span style={linkStyle("/login")}>Login</span>
          </Link>
          <Link href="/register" data-testid="nav-register">
            <span style={linkStyle("/register")}>Register</span>
          </Link>
        </nav>
        <button
          data-testid="theme-toggle"
          onClick={theme.toggleTheme}
          style={{
            border: "1px solid #6b7280",
            background: "transparent",
            padding: "6px 10px",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {theme.theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </header>

      <main style={{ padding: "24px", maxWidth: "640px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
};

const Home = () => (
  <Layout>
    <h1 data-testid="home-title">Welcome to MyMentalHealthBuddy 🌿</h1>
    <p style={{ marginTop: "8px" }}>
      A gentle place to track your mood, journal, and talk to healing AI
      companions — always with honesty, kindness, and respect.
    </p>
    <p style={{ marginTop: "16px" }}>
      Start by{" "}
      <Link href="/register">
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          data-testid="home-register-link"
        >
          creating your account
        </span>
      </Link>{" "}
      or{" "}
      <Link href="/login">
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          data-testid="home-login-link"
        >
          logging in
        </span>
      </Link>
      .
    </p>
  </Layout>
);

const Register = () => {
  const register = useRegisterMutation();
  const [, setLocation] = useLocation();
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = React.useState({});

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    register.mutate(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          setLocation("/login");
        },
        onError: (err) => {
          const map = {};
          (err.validationErrors || []).forEach((ve) => {
            if (ve.field) map[ve.field] = ve.message;
          });
          setFieldErrors(map);
        },
      }
    );
  };

  return (
    <Layout>
      <h1 data-testid="register-title">Create your account</h1>
      <p style={{ marginTop: "8px" }}>
        Your feelings are allowed here. We keep things simple and kind.
      </p>

      <form
        onSubmit={onSubmit}
        style={{ marginTop: "16px", display: "grid", gap: "12px" }}
        data-testid="register-form"
      >
        <label>
          <span>Email</span>
          <input
            data-testid="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />
          {fieldErrors.email && (
            <div
              style={{ color: "#b91c1c", fontSize: "0.8rem", marginTop: "4px" }}
              data-testid="register-email-error"
            >
              {fieldErrors.email}
            </div>
          )}
        </label>

        <label>
          <span>Password</span>
          <input
            data-testid="register-password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />
          {fieldErrors.password && (
            <div
              style={{ color: "#b91c1c", fontSize: "0.8rem", marginTop: "4px" }}
              data-testid="register-password-error"
            >
              {fieldErrors.password}
            </div>
          )}
        </label>

        {register.isError && !register.error.validationErrors?.length && (
          <div
            style={{ color: "#b91c1c", fontSize: "0.85rem" }}
            data-testid="register-generic-error"
          >
            {register.error.message}
          </div>
        )}

        <button
          type="submit"
          data-testid="register-submit"
          disabled={register.isLoading}
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
          }}
        >
          {register.isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </Layout>
  );
};

const Login = () => {
  const login = useLoginMutation();
  const [, setLocation] = useLocation();
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = React.useState({});

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    login.mutate(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          setLocation("/"); // later: send to dashboard
        },
        onError: (err) => {
          const map = {};
          (err.validationErrors || []).forEach((ve) => {
            if (ve.field) map[ve.field] = ve.message;
          });
          setFieldErrors(map);
        },
      }
    );
  };

  return (
    <Layout>
      <h1 data-testid="login-title">Log in</h1>
      <p style={{ marginTop: "8px" }}>
        Welcome back. You don’t have to be “fine” to be here.
      </p>

      <form
        onSubmit={onSubmit}
        style={{ marginTop: "16px", display: "grid", gap: "12px" }}
        data-testid="login-form"
      >
        <label>
          <span>Email</span>
          <input
            data-testid="login-email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />
          {fieldErrors.email && (
            <div
              style={{ color: "#b91c1c", fontSize: "0.8rem", marginTop: "4px" }}
              data-testid="login-email-error"
            >
              {fieldErrors.email}
            </div>
          )}
        </label>

        <label>
          <span>Password</span>
          <input
            data-testid="login-password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />
          {fieldErrors.password && (
            <div
              style={{ color: "#b91c1c", fontSize: "0.8rem", marginTop: "4px" }}
              data-testid="login-password-error"
            >
              {fieldErrors.password}
            </div>
          )}
        </label>

        {login.isError && !login.error.validationErrors?.length && (
          <div
            style={{ color: "#b91c1c", fontSize: "0.85rem" }}
            data-testid="login-generic-error"
          >
            {login.error.message}
          </div>
        )}

        <button
          type="submit"
          data-testid="login-submit"
          disabled={login.isLoading}
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: "#16a34a",
            color: "white",
            fontWeight: 600,
          }}
        >
          {login.isLoading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </Layout>
  );
};

/* ---------------- ROOT APP + MOUNT ---------------- */

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </Router>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div
      data-testid="page-error-404"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#f9fafb",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "8rem",
          fontWeight: 800,
          color: "#e5e7eb",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </div>

      <h1
        data-testid="text-error-title"
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1f2937",
          marginBottom: "0.75rem",
        }}
      >
        Page Not Found
      </h1>

      <p
        data-testid="text-error-description"
        style={{
          fontSize: "1.1rem",
          color: "#6b7280",
          maxWidth: "400px",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}
      >
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          to="/"
          data-testid="link-home"
          style={{
            padding: "0.85rem 1.5rem",
            background: "#4f46e5",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            transition: "background 0.2s",
          }}
        >
          Go Home
        </Link>

        <Link
          to="/dashboard"
          data-testid="link-dashboard"
          style={{
            padding: "0.85rem 1.5rem",
            background: "white",
            color: "#374151",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            border: "1px solid #e5e7eb",
            transition: "background 0.2s",
          }}
        >
          Dashboard
        </Link>
      </div>

      <div
        data-testid="section-help"
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          maxWidth: "400px",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          Need help? Try these:
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/chat"
            data-testid="link-chat"
            style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}
          >
            Talk to Buddy
          </Link>
          <Link
            to="/mood"
            data-testid="link-mood"
            style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}
          >
            Track Mood
          </Link>
          <Link
            to="/journal"
            data-testid="link-journal"
            style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}
          >
            Journal
          </Link>
        </div>
      </div>
    </div>
  );
}

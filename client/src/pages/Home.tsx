import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: "💬",
      title: "AI Companion",
      description: "Talk to a supportive AI that listens without judgment and helps you process your thoughts.",
    },
    {
      icon: "📊",
      title: "Mood Tracking",
      description: "Track your daily moods and discover patterns to better understand your emotional health.",
    },
    {
      icon: "📝",
      title: "Personal Journal",
      description: "Write freely and privately. Your thoughts are safe with us.",
    },
    {
      icon: "📈",
      title: "Insights & Analytics",
      description: "Visualize your mental health journey with easy-to-understand charts and insights.",
    },
  ];

  return (
    <div data-testid="page-home">
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "4rem 2rem",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          data-testid="text-hero-title"
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          Your Mental Health Matters
        </h1>
        <p
          data-testid="text-hero-subtitle"
          style={{
            fontSize: "1.25rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
            opacity: 0.95,
          }}
        >
          A compassionate AI companion that helps you track your mood, journal your thoughts, and find peace of mind.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/register"
            data-testid="button-get-started"
            style={{
              padding: "1rem 2rem",
              background: "white",
              color: "#4f46e5",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.1rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            Start Your Journey
          </Link>
          <Link
            to="/login"
            data-testid="button-login-hero"
            style={{
              padding: "1rem 2rem",
              background: "transparent",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              border: "2px solid white",
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      <section
        style={{
          padding: "4rem 2rem",
          background: "#f9fafb",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "3rem",
            color: "#1f2937",
          }}
        >
          How We Help You
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              data-testid={`card-feature-${index}`}
              style={{
                padding: "2rem",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: "#1f2937",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          background: "white",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "#1f2937",
          }}
        >
          Ready to Feel Better?
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
            maxWidth: "500px",
            margin: "0 auto 2rem",
          }}
        >
          Join thousands who have found peace and clarity with MyMentalHealthBuddy.
        </p>
        <Link
          to="/register"
          data-testid="button-cta-bottom"
          style={{
            display: "inline-block",
            padding: "1rem 2.5rem",
            background: "#4f46e5",
            color: "white",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          Get Started Free
        </Link>
      </section>

      <footer
        style={{
          padding: "2rem",
          background: "#1f2937",
          color: "#9ca3af",
          textAlign: "center",
          fontSize: "0.9rem",
        }}
      >
        <p data-testid="text-disclaimer">
          MyMentalHealthBuddy is not a replacement for professional mental health care.
          If you're in crisis, please contact emergency services or a crisis hotline.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          &copy; {new Date().getFullYear()} MyMentalHealthBuddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

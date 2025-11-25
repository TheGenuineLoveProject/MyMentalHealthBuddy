import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: "💬",
      title: "AI Companion",
      description: "Talk to a supportive AI that listens without judgment and helps you process your thoughts.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "📊",
      title: "Mood Tracking",
      description: "Track your daily moods and discover patterns to better understand your emotional health.",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      icon: "📝",
      title: "Personal Journal",
      description: "Write freely and privately. Your thoughts are safe with us.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "📈",
      title: "Insights & Analytics",
      description: "Visualize your mental health journey with easy-to-understand charts and insights.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
  ];

  const testimonials = [
    {
      quote: "This app helped me understand my emotions better. The AI companion feels like talking to a real friend.",
      author: "Sarah M.",
      role: "User for 6 months",
    },
    {
      quote: "Tracking my mood daily has given me insights I never had before. Highly recommended!",
      author: "James K.",
      role: "User for 3 months",
    },
    {
      quote: "The journaling feature is peaceful and therapeutic. It's become part of my daily routine.",
      author: "Emily R.",
      role: "User for 1 year",
    },
  ];

  return (
    <div data-testid="page-home" className="animate-fade-in">
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 15s ease infinite",
          padding: "6rem 2rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div 
            className="animate-float"
            style={{ fontSize: "4rem", marginBottom: "1rem" }}
          >
            🧠✨
          </div>
          
          <h1
            data-testid="text-hero-title"
            className="animate-slide-up"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              textShadow: "0 2px 20px rgba(0,0,0,0.2)",
            }}
          >
            Your Mental Health
            <br />
            <span style={{ 
              background: "linear-gradient(to right, #fff, #fce7f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Matters
            </span>
          </h1>
          
          <p
            data-testid="text-hero-subtitle"
            className="animate-slide-up stagger-1"
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              maxWidth: "650px",
              margin: "0 auto 2.5rem",
              opacity: 0.95,
              lineHeight: 1.7,
            }}
          >
            A compassionate AI companion that helps you track your mood, 
            journal your thoughts, and find peace of mind — available 24/7.
          </p>
          
          <div 
            className="animate-slide-up stagger-2"
            style={{ 
              display: "flex", 
              gap: "1rem", 
              justifyContent: "center", 
              flexWrap: "wrap" 
            }}
          >
            <Link
              to="/register"
              data-testid="button-get-started"
              style={{
                padding: "1.1rem 2.5rem",
                background: "white",
                color: "#4f46e5",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1.15rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Start Your Journey
              <span style={{ fontSize: "1.2rem" }}>→</span>
            </Link>
            <Link
              to="/login"
              data-testid="button-login-hero"
              style={{
                padding: "1.1rem 2.5rem",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1.15rem",
                border: "2px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              Sign In
            </Link>
          </div>
          
          <div 
            className="animate-slide-up stagger-3"
            style={{ 
              marginTop: "3rem", 
              display: "flex", 
              justifyContent: "center", 
              gap: "2rem",
              flexWrap: "wrap",
              opacity: 0.9,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>✓</span> Free to start
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>✓</span> Private & secure
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>✓</span> No credit card required
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            data-testid="text-features-title"
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            How We Help You
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              maxWidth: "600px",
              margin: "0 auto 3rem",
              fontSize: "1.1rem",
            }}
          >
            Evidence-based tools designed to support your mental wellness journey
          </p>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                data-testid={`card-feature-${index}`}
                className="card animate-slide-up"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <div 
                  style={{ 
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: feature.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    color: "#1f2937",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: "1rem" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "5rem 2rem",
          background: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "3rem",
              color: "#1f2937",
            }}
          >
            What Our Users Say
          </h2>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                data-testid={`testimonial-${index}`}
                className="card"
                style={{
                  padding: "2rem",
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.3 }}>
                  "
                </div>
                <p style={{ 
                  color: "#374151", 
                  lineHeight: 1.8,
                  fontSize: "1.05rem",
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}>
                  {testimonial.quote}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1f2937" }}>
                      {testimonial.author}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "5rem 2rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Ready to Feel Better?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              marginBottom: "2.5rem",
              fontSize: "1.15rem",
              lineHeight: 1.7,
            }}
          >
            Join thousands who have found peace and clarity with MyMentalHealthBuddy.
            Start your wellness journey today — it only takes a minute.
          </p>
          <Link
            to="/register"
            data-testid="button-cta-bottom"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1.25rem 3rem",
              background: "white",
              color: "#4f46e5",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.2rem",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            Get Started Free
            <span style={{ fontSize: "1.3rem" }}>✨</span>
          </Link>
        </div>
      </section>

      <footer
        style={{
          padding: "3rem 2rem",
          background: "#0f172a",
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🧠💜</div>
          <p data-testid="text-disclaimer" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
            MyMentalHealthBuddy is not a replacement for professional mental health care.
            If you're in crisis, please contact emergency services or a crisis hotline.
          </p>
          <div style={{ 
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #1e293b",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            fontSize: "0.85rem",
          }}>
            <span>&copy; {new Date().getFullYear()} MyMentalHealthBuddy</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

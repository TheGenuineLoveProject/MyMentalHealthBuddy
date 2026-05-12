import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database, Trash2, Mail, Flower2 } from "lucide-react";
import GlowFooter from "@/components/GlowFooter";

export default function Privacy() {
  const cardStyle = {
    background: "var(--glp-white, #FFFFFF)",
    border: "1px solid var(--glp-sage-15)",
  };
  const sectionClass = "rounded-2xl p-6 md:p-8 shadow-sm";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--glp-paper, #F7F4EE)" }}>
      <main className="flex-1 relative">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-colors mb-8 group"
            style={{ color: "var(--glp-sage-deep)" }}
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform motion-reduce:transition-none" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-12" data-testid="privacy-header">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
              style={{ background: "linear-gradient(135deg, #4A7E72 0%, #A8C9A0 100%)" }}
              aria-hidden="true"
            >
              <Shield className="w-10 h-10" style={{ color: "var(--glp-paper, #F7F4EE)" }} />
            </div>
            <h1
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: "var(--glp-ink)" }}
              data-testid="text-privacy-title"
            >
              Privacy Policy
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "var(--glp-sage-deep)" }}
              data-testid="text-privacy-subtitle"
            >
              Your healing journey is sacred. We protect it with care.
            </p>
            <p className="text-sm mt-4" style={{ color: "var(--glp-sage)" }} data-testid="text-privacy-updated">
              Last updated: February 2, 2026
            </p>
          </div>

          <div className="space-y-8" data-testid="privacy-sections">
            <section className={sectionClass} style={cardStyle} data-testid="card-info-collect">
              <h2
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-3"
                style={{ color: "var(--glp-ink)" }}
              >
                <Lock className="w-5 h-5" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
                Information We Collect
              </h2>
              <div className="space-y-4" style={{ color: "var(--glp-ink)" }}>
                <p>
                  We collect only the information necessary to provide you with a personalized healing experience:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Email address and display name for authentication</li>
                  <li><strong>Wellness Data:</strong> Mood entries, journal reflections, and progress tracking</li>
                  <li><strong>Usage Patterns:</strong> How you interact with features to improve your experience</li>
                  <li><strong>Device Information:</strong> Basic technical data to optimize performance</li>
                </ul>
              </div>
            </section>

            <section className={sectionClass} style={cardStyle}>
              <h2
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-3"
                style={{ color: "var(--glp-ink)" }}
              >
                <Eye className="w-5 h-5" style={{ color: "var(--glp-gold)" }} aria-hidden="true" />
                How We Use Your Information
              </h2>
              <div className="space-y-4" style={{ color: "var(--glp-ink)" }}>
                <p>Your data is used exclusively to support your wellness journey:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personalize your healing experience and AI companion responses</li>
                  <li>Track your progress and celebrate your milestones</li>
                  <li>Provide mood insights and emotional pattern recognition</li>
                  <li>Improve our platform based on aggregated, anonymized usage data</li>
                </ul>
                <p className="italic" style={{ color: "var(--glp-sage-deep)" }}>
                  We never sell your personal data or share it with third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section className={sectionClass} style={cardStyle}>
              <h2
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-3"
                style={{ color: "var(--glp-ink)" }}
              >
                <Database className="w-5 h-5" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
                Data Security
              </h2>
              <div className="space-y-4" style={{ color: "var(--glp-ink)" }}>
                <p>Your wellness data deserves the highest protection:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for all sensitive data transmission</li>
                  <li>Secure cloud infrastructure with industry-standard protections</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Strict access controls limiting who can view your information</li>
                </ul>
              </div>
            </section>

            <section className={sectionClass} style={cardStyle}>
              <h2
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-3"
                style={{ color: "var(--glp-ink)" }}
              >
                <Trash2 className="w-5 h-5" style={{ color: "var(--glp-rose)" }} aria-hidden="true" />
                Your Rights
              </h2>
              <div className="space-y-4" style={{ color: "var(--glp-ink)" }}>
                <p>You have complete control over your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of all data we hold about you</li>
                  <li><strong>Correction:</strong> Update or correct any inaccurate information</li>
                  <li><strong>Deletion:</strong> Request complete removal of your account and data</li>
                  <li><strong>Export:</strong> Download your journal entries and wellness history</li>
                  <li><strong>Opt-out:</strong> Disable analytics and optional data collection</li>
                </ul>
              </div>
            </section>

            <section className={sectionClass} style={cardStyle}>
              <h2
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-3"
                style={{ color: "var(--glp-ink)" }}
              >
                <Flower2 className="w-5 h-5" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
                AI Companion Privacy
              </h2>
              <div className="space-y-4" style={{ color: "var(--glp-ink)" }}>
                <p>
                  Conversations with our AI companion are designed with your privacy in mind:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Conversations are processed securely and not used for advertising</li>
                  <li>AI responses are generated in real-time and not permanently stored by third parties</li>
                  <li>You can delete your conversation history at any time</li>
                  <li>Crisis detection features are designed to protect, not surveil</li>
                </ul>
              </div>
            </section>

            <section className={sectionClass} style={cardStyle}>
              <h2
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-3"
                style={{ color: "var(--glp-ink)" }}
              >
                <Mail className="w-5 h-5" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
                Contact Us
              </h2>
              <p className="mb-4" style={{ color: "var(--glp-ink)" }}>
                If you have questions about this privacy policy or wish to exercise your rights, please reach out:
              </p>
              <p style={{ color: "var(--glp-ink)" }}>
                <strong>Email:</strong> privacy@thegenuineloveproject.com
              </p>
              <p className="text-sm mt-4 italic" style={{ color: "var(--glp-sage)" }}>
                We typically respond within 48 hours.
              </p>
              <p className="text-sm mt-4" style={{ color: "var(--glp-sage-deep)" }}>
                If you are in crisis, please visit{" "}
                <Link href="/crisis" className="underline font-medium" data-testid="link-crisis">
                  /crisis
                </Link>{" "}
                or call 988.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm" style={{ color: "var(--glp-sage)" }}>
              This policy may be updated periodically. We'll notify you of significant changes via email or in-app notification.
            </p>
          </div>
        </div>
      </main>

      <GlowFooter />
    </div>
  );
}

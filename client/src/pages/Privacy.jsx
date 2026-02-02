import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database, Trash2, Mail, Flower2 } from "lucide-react";
import EmotionBackground from "@/components/sacred/EmotionBackground";
import GlowFooter from "@/components/GlowFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <EmotionBackground emotion="calm" intensity={0.15} />
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-12" data-testid="privacy-header">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8fbf9f] to-[#2f5d5d] mb-6 shadow-lg" aria-hidden="true">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4" data-testid="text-privacy-title">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-privacy-subtitle">
              Your healing journey is sacred. We protect it with care.
            </p>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-privacy-updated">
              Last updated: February 2, 2026
            </p>
          </div>

          <div className="space-y-8" data-testid="privacy-sections">
            <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg" data-testid="card-info-collect">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#8fbf9f]" aria-hidden="true" />
                Information We Collect
              </h2>
              <div className="text-muted-foreground space-y-4">
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

            <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#d4af37]" />
                How We Use Your Information
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>Your data is used exclusively to support your wellness journey:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personalize your healing experience and AI companion responses</li>
                  <li>Track your progress and celebrate your milestones</li>
                  <li>Provide mood insights and emotional pattern recognition</li>
                  <li>Improve our platform based on aggregated, anonymized usage data</li>
                </ul>
                <p className="italic text-[#8fbf9f]">
                  We never sell your personal data or share it with third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-3">
                <Database className="w-5 h-5 text-[#2f5d5d]" />
                Data Security
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>Your wellness data deserves the highest protection:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for all sensitive data transmission</li>
                  <li>Secure cloud infrastructure with industry-standard protections</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Strict access controls limiting who can view your information</li>
                </ul>
              </div>
            </section>

            <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-[#e8a5b3]" />
                Your Rights
              </h2>
              <div className="text-muted-foreground space-y-4">
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

            <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-3">
                <Flower2 className="w-5 h-5 text-[#8fbf9f]" />
                AI Companion Privacy
              </h2>
              <div className="text-muted-foreground space-y-4">
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

            <section className="bg-gradient-to-br from-[#8fbf9f]/10 to-[#2f5d5d]/10 rounded-2xl p-6 md:p-8 border border-[#8fbf9f]/20">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8fbf9f]" />
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this privacy policy or wish to exercise your rights, please reach out:
              </p>
              <p className="text-foreground">
                <strong>Email:</strong> privacy@thegenuineloveproject.com
              </p>
              <p className="text-sm text-muted-foreground mt-4 italic">
                We typically respond within 48 hours.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              This policy may be updated periodically. We'll notify you of significant changes via email or in-app notification.
            </p>
          </div>
        </div>
      </main>

      <GlowFooter />
    </div>
  );
}

import { Link } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Heart } from "lucide-react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-sage">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Privacy</h1>
                <p className="text-lead">Your inner world deserves dignity. Here's how we treat your data.</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <EthicsSafetyBlock variant="card" showCrisis={false} />

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-teal">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">What We Store</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Account details (if you create an account)",
                  "Your entries (journals/reflections) only if you save them",
                  "Basic usage metrics to improve the product (when enabled)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--sage-50)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2" />
                    <span className="text-body-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-blush">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">What We Don't Do</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "We don't sell personal data.",
                  "We don't claim to diagnose or track medical conditions.",
                  "We don't publish your private content without your consent."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--blush-50)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--blush-400)] mt-2" />
                    <span className="text-body-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-gold">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Your Control</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                You can delete your content and account (where supported). If you need help, use the Support page.
              </p>
            </section>

            <footer className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Heart className="h-4 w-4 text-[var(--blush-500)]" />
                Your privacy is sacred to us
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

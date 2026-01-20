import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Mail, Copy, Check, Heart, Phone, Shield, Sparkles } from "lucide-react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function SupportPage() {
  const [copied, setCopied] = useState(false);
  const supportEmail = "support@thegenuineloveproject.com";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard">
              <a className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Support</h1>
                <p className="text-lead">You're not alone. Here are safe ways to get help.</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <EthicsSafetyBlock variant="card" showCrisis />

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-sage">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Contact Us</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)] mb-4">
                Email us at <span className="font-medium text-[var(--teal-600)]">{supportEmail}</span> and include:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "What page you were on",
                  "What you expected to happen",
                  "What happened instead (screenshots help)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={copyEmail}
                className="btn-secondary-premium inline-flex items-center gap-2"
                data-testid="button-copy-email"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-blush">
                  <Heart className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">If You Feel Overwhelmed</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)] mb-4">
                Pause and choose a gentler step. Try:
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  "Drink water",
                  "Feel your feet on the floor",
                  "Take 5 slow breaths"
                ].map((tip, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--sage-50)] text-center">
                    <span className="text-body-sm font-medium">{tip}</span>
                  </div>
                ))}
              </div>
              <p className="text-body-sm text-[var(--sage-500)] mt-4">
                If you feel unsafe, use the crisis resources above immediately.
              </p>
            </section>

            <footer className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
                Your wellbeing matters to us
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

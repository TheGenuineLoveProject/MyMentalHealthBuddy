import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MessageCircle, Shield, Heart, Sparkles } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is The Genuine Love Project?",
        a: "The Genuine Love Project is an AI-powered mental wellness platform designed to support self-love, healing, and emotional growth. We provide tools for mood tracking, journaling, guided reflections, and compassionate AI chat support."
      },
      {
        q: "Is this a replacement for therapy?",
        a: "No. Our platform is a supportive wellness tool, not a substitute for professional mental health care. We always encourage seeking professional help when needed and provide crisis resources for emergencies."
      },
      {
        q: "How do I get started?",
        a: "Create a free account, complete a brief onboarding to personalize your experience, then explore the dashboard to find tools that resonate with you."
      }
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Is my data private?",
        a: "Yes. Your journal entries, mood logs, and conversations are encrypted and never shared. We take your privacy seriously and follow strict data protection practices."
      },
      {
        q: "Who can see my journal entries?",
        a: "Only you. Your journal entries are private and encrypted. Not even our team can access them."
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You can delete individual entries or your entire account at any time from the Settings page."
      }
    ]
  },
  {
    category: "Features & Tools",
    questions: [
      {
        q: "What is the AI Chat feature?",
        a: "Our AI Chat provides compassionate, trauma-informed conversations to help you process thoughts and emotions. It's available 24/7 and remembers your conversation history for continuity."
      },
      {
        q: "How does mood tracking work?",
        a: "Log your mood daily with simple emotion selections and optional notes. Over time, you'll see patterns and insights that help you understand your emotional journey."
      },
      {
        q: "What are the different visual modes?",
        a: "We offer three modes: Default (full brand experience), Low-Stim (reduced visual intensity for sensory sensitivity), and Reading (maximum legibility). Switch anytime from the header or Settings."
      }
    ]
  },
  {
    category: "Account & Billing",
    questions: [
      {
        q: "Is there a free version?",
        a: "Yes. Core features including mood tracking, basic journaling, and limited AI chat are free. Premium features require a subscription."
      },
      {
        q: "How do I upgrade to Premium?",
        a: "Visit the Upgrade page from your dashboard to see Premium features and subscription options."
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel your subscription at any time from Settings. You'll retain access until the end of your billing period."
      }
    ]
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-[var(--sage-200)] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded-lg"
        data-testid={`button-faq-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="text-body-md font-medium pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[var(--sage-500)] flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[var(--sage-500)] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-body-sm text-[var(--sage-600)] leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <HelpCircle className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Frequently Asked Questions</h1>
                <p className="text-lead">Find answers to common questions about our platform.</p>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            {faqs.map((section, idx) => (
              <section key={idx} className="card-bordered">
                <h2 className="text-heading-md text-teal mb-4">{section.category}</h2>
                <div className="divide-y divide-[var(--sage-100)]">
                  {section.questions.map((item, qIdx) => (
                    <FAQItem key={qIdx} question={item.q} answer={item.a} />
                  ))}
                </div>
              </section>
            ))}

            <section className="card-bordered bg-[var(--sage-50)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-teal">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Still Have Questions?</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)] mb-4">
                We're here to help. Reach out through our support channels.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/support" className="btn-primary-premium" data-testid="link-support">
                  Contact Support
                </Link>
                <Link href="/crisis" className="btn-secondary-premium" data-testid="link-crisis">
                  Crisis Resources
                </Link>
              </div>
            </section>

            <footer className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
                Your questions matter to us
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

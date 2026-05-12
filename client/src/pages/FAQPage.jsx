import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useSEO, createFAQSchema } from "../hooks/useSEO";
import PageLayout from "@/components/layout/PageLayout.jsx";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is The Genuine Love Project?",
        a: "MyMentalHealthBuddy by The Genuine Love Project is an AI-powered mental wellness platform designed to support self-love, healing, and emotional growth. We provide tools for mood tracking, journaling, guided reflections, and compassionate AI chat support."
      },
      {
        q: "Is this a replacement for therapy?",
        a: "No. Our platform is a supportive wellness tool, not a substitute for professional mental health care. We always encourage seeking professional help when needed and provide crisis resources for emergencies."
      },
      {
        q: "How do I get started?",
        a: "Create a free account, complete a brief onboarding to personalize your experience, then explore the dashboard to find tools that resonate with you."
      },
      {
        q: "What healing tools are available?",
        a: "We offer breathing exercises, grounding techniques, meditation guides, affirmations, calming scenes, journaling prompts, mood tracking, emotional intelligence tools, sleep guides, stress response education, inner child healing, and AI chat support."
      }
    ]
  },
  {
    category: "Mental Health Education",
    questions: [
      {
        q: "What is trauma and how does it affect me?",
        a: "Trauma is the emotional response to distressing experiences that overwhelm your ability to cope. It affects your nervous system, creating patterns of hypervigilance, avoidance, or numbing. Research suggests that with proper support and practices, the brain's neuroplasticity may help people move forward in their healing journey."
      },
      {
        q: "What is the difference between anxiety and normal worry?",
        a: "Normal worry is temporary and proportional to a situation. Anxiety becomes concerning when it's persistent, excessive, difficult to control, and interferes with daily life. Physical symptoms like racing heart, trouble sleeping, and muscle tension often accompany anxiety disorders."
      },
      {
        q: "What is emotional regulation?",
        a: "Emotional regulation is the ability to manage and respond to emotions in healthy ways. It involves recognizing emotions, understanding their messages, and choosing how to express them constructively. This skill can be developed through mindfulness, breathing techniques, and cognitive reframing."
      },
      {
        q: "Why do I feel triggered by certain things?",
        a: "Triggers are sensory cues that remind your nervous system of past threatening experiences. Your brain creates these associations for protection. When triggered, your body activates the stress response as if the past danger is happening now. Understanding your triggers helps you develop coping strategies."
      },
      {
        q: "What is the polyvagal theory?",
        a: "Polyvagal theory explains how your autonomic nervous system responds to safety and threat. It identifies three states: ventral vagal (safe, social, calm), sympathetic (fight/flight), and dorsal vagal (freeze/shutdown). Understanding these helps you recognize patterns and choose practices to return to safety."
      }
    ]
  },
  {
    category: "Healing Practices",
    questions: [
      {
        q: "What are somatic practices?",
        a: "Somatic practices recognize the connection between body and mind. Practices like body scanning, breathwork, gentle movement, and grounding techniques may help release stored tension and support nervous system balance. For deeper somatic work, consider working with a trained practitioner."
      },
      {
        q: "How does journaling support emotional wellness?",
        a: "Journaling creates a safe space to process emotions, identify patterns, and gain clarity. Writing engages different brain regions than thinking alone, which some people find helps access deeper insights. Research suggests expressive writing may reduce stress and support emotional processing."
      },
      {
        q: "What is inner child work?",
        a: "Inner child work involves connecting with the younger parts of yourself that may carry childhood experiences. Some adult patterns stem from unmet childhood needs or early emotional experiences. By nurturing these younger parts, some people find they can address concerns at a deeper level. For significant childhood trauma, consider professional support."
      },
      {
        q: "How do affirmations work?",
        a: "Affirmations involve repeating positive self-statements. Some research suggests that consistent practice may help create new thought patterns that can support more balanced self-beliefs. Many people find that choosing affirmations that feel believable works best."
      },
      {
        q: "What are grounding techniques?",
        a: "Grounding techniques help you reconnect with the present moment when feeling overwhelmed or dissociated. They engage your senses (5-4-3-2-1 technique), body awareness, or breath to bring you back to the here-and-now and out of stress responses."
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
    category: "Crisis & Safety",
    questions: [
      {
        q: "What should I do in a mental health crisis?",
        a: "If in immediate danger, call 911. For suicidal thoughts, call the 988 Suicide & Crisis Lifeline. Text HOME to 741741 for Crisis Text Line. Reach out to a trusted person and go to a safe place. Remember: crises are temporary, and help is available."
      },
      {
        q: "Is it normal to have bad days during recovery?",
        a: "Absolutely. Healing is not linear - it involves ups and downs, progress and setbacks. Bad days don't erase your progress. They're often when deep processing happens. Be compassionate with yourself during difficult times."
      },
      {
        q: "When should I seek professional help?",
        a: "Consider professional support if you experience: persistent sadness or anxiety for over two weeks, difficulty functioning, changes in sleep or appetite, substance use to cope, thoughts of self-harm, or feeling like you can't cope. Seeking help is a sign of strength."
      }
    ]
  },
  {
    category: "Account & Billing",
    questions: [
      {
        q: "Is there a free version?",
        a: "Yes. Core features including mood tracking, journaling, daily reflection, and community features are free with no expiration. Pro adds unlimited AI sessions and additional tools — only if you want them."
      },
      {
        q: "How do I upgrade to Pro?",
        a: "Visit the Pricing page to see what Pro includes. You can upgrade from your dashboard anytime, and cancel anytime with no penalties."
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
        aria-expanded={isOpen}
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
  const faqItems = useMemo(() => {
    const items = [];
    faqs.forEach(category => {
      category.questions.forEach(q => {
        items.push({ question: q.q, answer: q.a });
      });
    });
    return items;
  }, []);

  useSEO({
    title: "FAQ",
    description: "Frequently asked questions about MyMentalHealthBuddy - mental wellness, trauma healing, wellness tools, and getting started with your healing journey.",
    jsonLd: createFAQSchema(faqItems),
  });

  return (
    <PageLayout maxWidth="max-w-3xl" className="v28-paper-bg">
      <header className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Home
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

          <div id="faq-list" className="space-y-8 scroll-mt-24">
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

      </div>
    </PageLayout>
  );
}

import { Link } from "wouter";
import { 
  Shield, Phone, Heart, ArrowLeft, AlertTriangle, 
  MessageCircle, ExternalLink, Sparkles, HandHeart
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const CRISIS_RESOURCES = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "Free, confidential support 24/7",
    urgent: true
  },
  {
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "Free crisis counseling via text",
    urgent: true
  },
  {
    name: "SAMHSA National Helpline",
    phone: "1-800-662-4357",
    description: "Treatment referral and information",
    urgent: false
  },
  {
    name: "International Association for Suicide Prevention",
    phone: "Visit IASP website",
    description: "Find crisis centers worldwide",
    urgent: false
  }
];

const GROUNDING_TECHNIQUES = [
  "Take 5 slow, deep breaths",
  "Name 5 things you can see around you",
  "Feel your feet firmly on the ground",
  "Hold something cold or textured",
  "Listen to a calming song or nature sounds"
];

export default function ChatCrisis() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/chat" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Chat
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-blush">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">You're Not Alone</h1>
                <p className="text-lead">We're here to help you find support</p>
              </div>
            </div>
          </header>

          <div className="card-bordered bg-[var(--blush-50)] border-[var(--blush-200)] mb-8">
            <div className="flex items-start gap-4">
              <div className="icon-container icon-lg icon-soft-blush flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-heading-md text-[var(--blush-700)] mb-2">If you're in immediate danger</h2>
                <p className="text-body-sm text-[var(--blush-600)] mb-4">
                  Please call emergency services (911) or go to your nearest emergency room. Your safety matters most.
                </p>
                <Button className="bg-[var(--blush-600)] hover:bg-[var(--blush-700)] text-white" data-testid="button-call-emergency">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-heading-lg text-teal mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-[var(--teal-500)]" />
              Crisis Support Lines
            </h2>
            <div className="space-y-4">
              {CRISIS_RESOURCES.map((resource, i) => (
                <div 
                  key={i}
                  className={`card-bordered ${resource.urgent ? 'bg-[var(--sage-50)] border-[var(--sage-300)]' : ''}`}
                  data-testid={`resource-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-heading-sm text-teal">{resource.name}</h3>
                      <p className="text-display-sm text-[var(--teal-600)] font-medium">{resource.phone}</p>
                      <p className="text-body-sm text-[var(--sage-500)]">{resource.description}</p>
                    </div>
                    {resource.urgent && (
                      <div className="icon-container icon-lg icon-soft-sage">
                        <Phone className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-heading-lg text-teal mb-4 flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-[var(--gold-500)]" />
              Grounding Techniques
            </h2>
            <div className="card-bordered">
              <p className="text-body-sm text-[var(--sage-600)] mb-4">
                If you're feeling overwhelmed, try these techniques to help ground yourself in the present moment:
              </p>
              <div className="space-y-3">
                {GROUNDING_TECHNIQUES.map((technique, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--sage-50)]">
                    <div className="icon-container icon-sm icon-soft-gold">
                      <span className="text-body-sm font-medium">{i + 1}</span>
                    </div>
                    <span className="text-body-sm">{technique}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card-glass text-center py-8">
            <div className="icon-container icon-xl icon-gradient-sage mx-auto mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-heading-lg text-teal mb-2">When you're ready to continue</h3>
            <p className="text-lead mb-6 max-w-lg mx-auto">
              Our AI companion is here to support you with compassion and understanding.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/chat" className="inline-block">
                <Button className="btn-premium" data-testid="button-return-chat">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Return to Chat
                </Button>
              </Link>
              <Link href="/dashboard" className="inline-block">
                <Button variant="outline" className="btn-secondary-premium" data-testid="button-dashboard">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </section>

          <footer className="text-center mt-8">
            <p className="text-caption flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
              You deserve support and healing
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

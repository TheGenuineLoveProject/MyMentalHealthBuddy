import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, Users, Sparkles, MessageCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

export default function CommunityHub() {
  const { user } = useAuth();

  const { data: affirmations = [], isLoading } = useQuery({
    queryKey: ["/api/community/affirmations"],
    staleTime: 30000,
  });

  const { data: question } = useQuery({
    queryKey: ["/api/community/question"],
    staleTime: 60000,
  });

  const previewAffirmations = affirmations.slice(0, 3);

  return (
    <>
      <SEO
        title="Community | The Genuine Love Project"
        description="Connect, share, and heal together. A gentle community space for affirmations, reflections, and shared growth."
      />

      <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(to bottom, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="max-w-4xl mx-auto">

          <header className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, var(--glp-sage-30), var(--glp-sage-50))' }}>
              <Users className="w-10 h-10" style={{ color: 'var(--glp-sage-deep)' }} />
            </div>
            <h1 className="text-4xl font-serif mb-3" style={{ color: 'var(--glp-ink)' }} data-testid="heading-community">
              Community
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
              You are not alone on this journey. Connect with others who are healing, growing, and learning to live in genuine love.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 mb-12">

            <Link
              href="/affirmations"
              className="block rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer border no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
              style={{ background: 'linear-gradient(135deg, var(--glp-gold-10), var(--glp-gold-20))', borderColor: 'var(--glp-gold-30)' }}
              data-testid="link-affirmation-wall"
              aria-label="Visit the Affirmation Wall"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6" style={{ color: 'var(--glp-gold)' }} />
                <h2 className="text-xl font-serif no-underline" style={{ color: 'var(--glp-ink)' }}>Affirmation Wall</h2>
              </div>
              <p className="text-sm mb-4 no-underline" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
                Share light and receive light. Post anonymous affirmations and send hearts to others.
              </p>
              <span className="flex items-center gap-2 text-sm font-medium no-underline" style={{ color: 'var(--glp-gold-deep)' }}>
                Visit the Wall <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <div className="rounded-2xl p-6 border"
                 style={{ background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-sage-20))', borderColor: 'var(--glp-sage-30)' }}>
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-6 h-6" style={{ color: 'var(--glp-sage)' }} />
                <h2 className="text-xl font-serif" style={{ color: 'var(--glp-ink)' }}>Shared Reflections</h2>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
                Read anonymous reflections from others walking a similar path. Share your own when you are ready.
              </p>
              {user ? (
                <Link href="/community/feed" className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }} data-testid="link-reflections">
                  Read Reflections <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }} data-testid="link-reflections-login">
                  Sign in to participate <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {question?.question && (
            <div className="rounded-2xl p-6 mb-12 text-center border"
                 style={{ background: 'var(--glp-paper)', borderColor: 'var(--glp-sage-20)' }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--glp-sage)' }}>
                Today's Reflection Question
              </p>
              <p className="text-xl font-serif italic" style={{ color: 'var(--glp-ink)' }} data-testid="text-daily-question">
                "{question.question}"
              </p>
              <p className="text-xs mt-3" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
                {question.context}
              </p>
            </div>
          )}

          {previewAffirmations.length > 0 && (
            <section className="mb-12">
              <h3 className="text-lg font-serif mb-4 text-center" style={{ color: 'var(--glp-ink)' }}>
                Recent Affirmations
              </h3>
              <div className="space-y-3">
                {previewAffirmations.map((a) => (
                  <div key={a.id} className="rounded-xl p-4 border flex items-start justify-between"
                       style={{ background: 'white', borderColor: 'var(--glp-sage-10)' }}
                       data-testid={`card-affirmation-${a.id}`}>
                    <p className="text-sm italic flex-1" style={{ color: 'var(--glp-ink)' }}>
                      "{a.content}"
                    </p>
                    <span className="flex items-center gap-1 text-xs ml-3 shrink-0" style={{ color: 'var(--glp-rose)' }}>
                      <Heart className="w-3.5 h-3.5" /> {a.heartCount || 0}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link href="/affirmations" className="text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }} data-testid="link-see-all-affirmations">
                  See all affirmations <ArrowRight className="w-3.5 h-3.5 inline" />
                </Link>
              </div>
            </section>
          )}

          {isLoading && (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ color: 'var(--glp-sage)' }} />
            </div>
          )}

          <div className="rounded-2xl p-8 text-center border"
               style={{ background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-paper))', borderColor: 'var(--glp-sage-20)' }}>
            <Heart className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--glp-rose)' }} />
            <h3 className="text-lg font-serif mb-2" style={{ color: 'var(--glp-ink)' }}>
              We Heal Together
            </h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
              This is a space of compassion and understanding. Everything shared here is treated with care and respect.
            </p>
          </div>
        </div>
      </div>

      <SafetyFooter />
    </>
  );
}

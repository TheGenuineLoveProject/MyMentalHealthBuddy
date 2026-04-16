// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { Link } from 'wouter';
import { SEO } from "@/components/SEO";
import { BenefitsBlock } from "@/components/BenefitsBlock";

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Taking a Different Path | MyMentalHealthBuddy"
        description="This page isn't here, but you are. Let's find what you're looking for together."
      />
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--sacred-cream, #faf9f7)' }}
      >
        <BenefitsBlock
          benefit="You're in good hands—let's find your way"
          bullets={["Your wellness journey continues","Crisis support is always available","Every path leads somewhere meaningful"]}
        />

        <main id="main-content" className="text-center px-6">
          <h1 
            className="text-5xl font-serif mb-4"
            style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
          >
            Hmm...
          </h1>
          <p 
            className="text-2xl font-serif mb-6"
            style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
          >
            This path leads somewhere new
          </p>
          <p 
            className="text-lg mb-8 max-w-md mx-auto"
            style={{ color: 'var(--sacred-charcoal, #3a3a3a)', opacity: 0.7 }}
          >
            The page you were looking for isn't here—but that's okay. 
            Sometimes we find ourselves in unexpected places. Let's gently guide you somewhere helpful.
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 text-white rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ 
              background: 'var(--sacred-sage, #8fbf9f)',
              outlineColor: 'var(--sacred-teal, #2f5d5d)'
            }}
            data-testid="link-return-home"
          >
            Return Home
          </Link>
          <p className="text-sm opacity-70 mt-8">
            You're not alone. Crisis support is always available at <a href="/crisis" className="underline" style={{ color: 'var(--sacred-teal, #2f5d5d)' }}>/crisis</a>
          </p>
        </main>
      </div>
    </>
  );
}

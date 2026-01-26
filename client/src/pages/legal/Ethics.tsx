import { SEO } from "@/components/seo/SEO";
import { PageScaffold } from "@/components/PageScaffold";
import { SafetyFooter } from "@/components/SafetyFooter";

export default function EthicsPage() {
  return (
    <>
      <SEO
        title="Our Ethics | The Genuine Love Project"
        description="The ethical principles guiding The Genuine Love Project wellness platform."
        canonicalPath="/legal/ethics"
      />
      <PageScaffold>
        <main id="main" role="main" className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Our Ethics</h1>
          
          <div className="prose prose-lg dark:prose-invert space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Our Commitment</h2>
              <p>
                The Genuine Love Project is built on a foundation of ethical principles 
                that guide everything we do. We are committed to creating a safe, 
                supportive, and honest environment for personal growth.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Transparency</h2>
              <p>
                We are clear about what we offer and what we don't. Our platform 
                provides educational resources for self-reflection — not therapy, 
                medical advice, or professional treatment. We always recommend 
                seeking professional help when needed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">No Coercive Practices</h2>
              <p>
                We never use manipulative language, false urgency, or fear-based 
                messaging. Our tools and content are designed to empower, not 
                pressure. You are always free to pause, stop, or opt out.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Trauma-Informed Approach</h2>
              <p>
                Our content is created with sensitivity to trauma. We use gentle, 
                supportive language and provide options for different comfort levels. 
                We never require you to share more than you're comfortable with.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">AI Safety</h2>
              <p>
                When AI is used on our platform, it is governed by safety guardrails 
                that prioritize your wellbeing. Our AI never provides medical advice, 
                always includes appropriate disclaimers, and is designed to detect 
                and respond appropriately to crisis situations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Original Content</h2>
              <p>
                All content on our platform is original or properly attributed. 
                We respect intellectual property and creative rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
              <p>
                We strive to make our platform accessible to everyone. We follow 
                WCAG AA guidelines and continuously work to improve accessibility 
                for all users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Crisis Support</h2>
              <p>
                We take crisis situations seriously. Our platform includes 
                crisis detection and always provides pathways to professional 
                support. Visit our{" "}
                <a href="/crisis" className="text-[var(--glp-gold)] underline">
                  Crisis Resources
                </a>{" "}
                page for immediate support.
              </p>
            </section>
          </div>
        </main>
        <SafetyFooter />
      </PageScaffold>
    </>
  );
}

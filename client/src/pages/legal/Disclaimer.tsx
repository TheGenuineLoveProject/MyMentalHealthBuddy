import { SEO } from "@/components/seo/SEO";
import { PageScaffold } from "@/components/PageScaffold";
import { SafetyFooter } from "@/components/SafetyFooter";

export default function DisclaimerPage() {
  return (
    <>
      <SEO
        title="Disclaimer | MyMentalHealthBuddy"
        description="Important disclaimers about our educational wellness platform. This is not therapy or medical advice."
        canonicalPath="/legal/disclaimer"
      />
      <PageScaffold>
        <main id="main" role="main" className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Disclaimer</h1>
          
          <div className="prose prose-lg dark:prose-invert space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Age Requirement</h2>
              <p>
                By using this platform, you confirm you are 18 years of age or older. 
                This platform is designed for adult users seeking educational resources 
                for self-reflection and personal growth.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Not Therapy or Medical Advice</h2>
              <p>
                MyMentalHealthBuddy is <strong>not</strong> therapy, counseling, 
                or medical advice. Our content is educational in nature and designed 
                to support self-reflection and skill-building.
              </p>
              <p>
                We do not diagnose, treat, cure, or prevent any medical or psychological 
                condition. If you are experiencing a mental health crisis, please contact 
                your local emergency services or a licensed mental health professional.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Educational Purpose</h2>
              <p>
                All content on this platform is provided for educational and 
                informational purposes only. Our tools, prompts, and resources are 
                designed to support your personal journey of self-discovery and growth.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">No Guarantees</h2>
              <p>
                Results vary from person to person. We make no guarantees about 
                outcomes or results from using our platform. Your experience depends 
                on many factors unique to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Crisis Support</h2>
              <p>
                If you are in crisis or need immediate support, please contact 
                your local emergency services or visit our{" "}
                <a href="/crisis" className="text-[var(--glp-gold)] underline">
                  Crisis Resources
                </a>{" "}
                page for guidance.
              </p>
            </section>
          </div>
        </main>
        <SafetyFooter />
      </PageScaffold>
    </>
  );
}

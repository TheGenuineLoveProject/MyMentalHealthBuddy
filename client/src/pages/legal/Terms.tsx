import { SEO } from "@/components/seo/SEO";
import { PageScaffold } from "@/components/PageScaffold";
import { SafetyFooter } from "@/components/SafetyFooter";

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service | MyMentalHealthBuddy"
        description="Terms of service for MyMentalHealthBuddy by The Genuine Love Project educational wellness platform."
        canonicalPath="/legal/terms"
      />
      <PageScaffold>
        <main id="main" role="main" className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using MyMentalHealthBuddy, you agree to be 
                bound by these Terms of Service. If you do not agree to these terms, 
                please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
              <p>
                You must be at least 18 years old to use this platform. By using 
                our services, you represent and warrant that you meet this age requirement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Educational Nature</h2>
              <p>
                Our platform provides educational content for self-reflection and 
                personal development. This is not therapy, medical treatment, or 
                professional counseling. We do not provide diagnosis or treatment 
                of any condition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for personal, non-commercial purposes only</li>
                <li>Provide accurate information when creating an account</li>
                <li>Keep your account credentials secure</li>
                <li>Seek professional help if you are in crisis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
              <p>
                MyMentalHealthBuddy and its operators are not liable for any 
                damages arising from your use of the platform. Results vary and 
                are not guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <p>
                For questions about these terms, please contact us through our 
                platform or visit our{" "}
                <a href="/crisis" className="text-[var(--glp-gold)] underline">
                  Crisis Resources
                </a>{" "}
                page if you need immediate support.
              </p>
            </section>
          </div>
        </main>
        <SafetyFooter />
      </PageScaffold>
    </>
  );
}

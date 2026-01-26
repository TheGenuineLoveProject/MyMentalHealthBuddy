import { SEO } from "@/components/seo/SEO";
import { PageScaffold } from "@/components/PageScaffold";
import { SafetyFooter } from "@/components/SafetyFooter";

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy | The Genuine Love Project"
        description="Our commitment to protecting your privacy on The Genuine Love Project wellness platform."
        canonicalPath="/legal/privacy"
      />
      <PageScaffold>
        <main id="main" role="main" className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Privacy Matters</h2>
              <p>
                The Genuine Love Project is committed to protecting your privacy. 
                This policy explains how we collect, use, and safeguard your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
              <p>We may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, display name)</li>
                <li>Usage data (pages visited, features used)</li>
                <li>Content you create (journal entries, reflections)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">How We Use Your Data</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our services</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about your account</li>
                <li>Ensure platform safety and security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your personal 
                information. Your journal entries and reflections are private and 
                encrypted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request correction of your data</li>
                <li>Request deletion of your account</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <p>
                We use privacy-safe analytics to understand how our platform is used. 
                We never store the content of your private reflections in analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <p>
                For privacy-related questions, please contact us through our platform.
              </p>
            </section>
          </div>
        </main>
        <SafetyFooter />
      </PageScaffold>
    </>
  );
}

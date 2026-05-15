import { Shield, Lock, Eye, Trash2, Bell, UserCheck } from "lucide-react";

const PRIVACY_HIGHLIGHTS = [
  {
    icon: Shield,
    title: "Data Protection",
    description: "Your personal information is encrypted and stored securely using industry-standard protocols."
  },
  {
    icon: Lock,
    title: "Private by Default",
    description: "Your journal entries, mood data, and reflections are private. Only you can see them."
  },
  {
    icon: Eye,
    title: "Transparent Collection",
    description: "We only collect what's necessary to provide the service. No hidden tracking or data selling."
  },
  {
    icon: Trash2,
    title: "Right to Delete",
    description: "You can request deletion of your data at any time. We honor these requests promptly."
  },
  {
    icon: Bell,
    title: "Notification Control",
    description: "You choose what communications you receive. Unsubscribe anytime with one click."
  },
  {
    icon: UserCheck,
    title: "Consent First",
    description: "We ask before collecting sensitive information. You're always in control of what you share."
  }
];

export function PrivacyHighlights() {
  return (
    <section className="max-w-4xl mx-auto p-6" style={{ lineHeight: 1.6 }}>
      <h1 className="text-3xl font-bold text-teal-700 mb-4">Privacy at a Glance</h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Your privacy matters deeply to us. Here's a quick overview of how we protect your information 
        and respect your boundaries.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {PRIVACY_HIGHLIGHTS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className="flex gap-4 p-4 rounded-xl bg-white border border-sage-200 hover:border-sage-300 transition-colors"
              data-testid={`privacy-highlight-${index}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-700 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-sage-50 rounded-xl p-6 border border-sage-200">
        <h2 className="text-xl font-semibold text-teal-700 mb-3">Our Commitment</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 mt-1">•</span>
            <span>We never sell your personal data to third parties.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 mt-1">•</span>
            <span>AI interactions are processed securely and not used to train external models.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 mt-1">•</span>
            <span>You can export your data anytime in a portable format.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 mt-1">•</span>
            <span>We use minimal cookies — only what's needed for the platform to work.</span>
          </li>
        </ul>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        For complete details, please read our full{" "}
        <a href="/privacy" className="text-teal-600 hover:underline" data-testid="link-privacy-policy">Privacy Policy</a>.
        Questions? Contact us at{" "}
        <a href="mailto:privacy@genuinelove.org" className="text-teal-600 hover:underline" data-testid="link-privacy-email">
          privacy@genuinelove.org
        </a>
      </p>
    </section>
  );
}

export default PrivacyHighlights;

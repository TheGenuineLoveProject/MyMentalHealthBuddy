// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { Youtube, Instagram, MessageCircle, Twitter, ExternalLink } from "lucide-react";

const SOCIAL_CHANNELS = [
  { 
    id: "youtube",
    name: "YouTube", 
    handle: "@GenuineLoveProject", 
    url: "https://youtube.com/@GenuineLoveProject", 
    icon: Youtube, 
    color: "#FF0000",
    description: "Watch wellness videos, guided meditations, and educational content."
  },
  { 
    id: "tiktok",
    name: "TikTok", 
    handle: "@genuineloveproject", 
    url: "https://tiktok.com/@genuineloveproject", 
    icon: MessageCircle, 
    color: "#000000",
    description: "Quick wellness tips and bite-sized inspiration."
  },
  { 
    id: "instagram",
    name: "Instagram", 
    handle: "@thegenuineloveproject", 
    url: "https://instagram.com/thegenuineloveproject", 
    icon: Instagram, 
    color: "#E4405F",
    description: "Daily affirmations, stories, and visual inspiration."
  },
  { 
    id: "facebook",
    name: "Facebook", 
    handle: "The Genuine Love Project", 
    url: "https://facebook.com/profile.php?id=61583664864191", 
    icon: MessageCircle, 
    color: "#1877F2",
    description: "Community discussions and longer-form content."
  },
  { 
    id: "x",
    name: "X (Twitter)", 
    handle: "@GenuineLoveProj", 
    url: "https://x.com/GenuineLoveProj", 
    icon: Twitter, 
    color: "#000000",
    description: "Quick thoughts, updates, and wellness wisdom."
  },
];

function SocialCard({ channel }) {
  const Icon = channel.icon;
  
  return (
    <a 
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all min-h-[44px]"
      data-testid={`link-social-${channel.id}`}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: `${channel.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: channel.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {channel.name}
            </h3>
            <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-sage-600 dark:text-sage-400 font-medium mb-2">
            {channel.handle}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {channel.description}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function SocialPage() {
  const benefits = pickBenefits(["connection", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Links to our social media presence and community spaces.",
    why: "Connection beyond the platform for ongoing inspiration and community.",
    who: "Anyone wanting to connect with us on social platforms.",
    when: "When you want daily inspiration or community interaction.",
    where: "Follow us on your preferred social platforms.",
    how: "Follow, engage, share. Join the conversation."
  };

  const examples = [
    { level: "Beginner", label: "Follow Along", description: "Follow us for daily wellness tips and inspiration." },
    { level: "Intermediate", label: "Engage & Share", description: "Comment, share what resonates, connect with others." },
    { level: "Advanced", label: "Community Contribution", description: "Share your journey to inspire others." }
  ];

  return (
    <>
      <SEO
        title="Social Connection | The Genuine Love Project"
        description="Connect with our community across social platforms - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Social Connection"
        subtitle="Connect with our community"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="space-y-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg opacity-90">
              Join our growing community across social platforms. We share daily inspiration, 
              wellness tips, and supportive content to accompany you on your journey.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIAL_CHANNELS.map((channel) => (
              <SocialCard key={channel.id} channel={channel} />
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Community Guidelines
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Our social spaces are designed to be supportive, inclusive, and safe. 
              We welcome authentic sharing and encourage kindness in all interactions. 
              Please review our full community guidelines for more details.
            </p>
          </div>

          <p className="text-sm opacity-70 text-center">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}

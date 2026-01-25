import { useState } from "react";
import { X, Copy, Check, Share2, MessageCircle, Twitter, Facebook, Linkedin, Mail } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const SHARE_PLATFORMS = [
  { 
    id: "copy", 
    name: "Copy Link", 
    icon: Copy,
    action: "copy"
  },
  { 
    id: "twitter", 
    name: "X/Twitter", 
    icon: Twitter,
    urlTemplate: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  { 
    id: "facebook", 
    name: "Facebook", 
    icon: Facebook,
    urlTemplate: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: Linkedin,
    urlTemplate: (text, url) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
  },
  { 
    id: "email", 
    name: "Email", 
    icon: Mail,
    urlTemplate: (text, url) => `mailto:?subject=${encodeURIComponent("A reflection to share")}&body=${encodeURIComponent(text + "\n\n" + url)}`
  },
];

export default function ShareModal({
  isOpen,
  onClose,
  shareText = "I'm building self-trust with The Genuine Love Project.",
  shareUrl = "https://genuineloveproject.com",
  title = "Share if it resonates",
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Share Modal — The Genuine Love Project" description="Explore share modal tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Share Modal</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  const handleShare = async (platform) => {
    if (platform.action === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
      return;
    }

    if (platform.urlTemplate) {
      window.open(platform.urlTemplate(shareText, shareUrl), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      data-testid="share-modal-overlay"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
        data-testid="share-modal"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[var(--glp-sage)]" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
            data-testid="button-close-share"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          No pressure. Share only if it feels right for you.
        </p>
        
        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">
            "{shareText}"
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {SHARE_PLATFORMS.map(platform => {
            const Icon = platform.icon;
            const isCopyButton = platform.action === "copy";
            
            return (
              <button
                key={platform.id}
                onClick={() => handleShare(platform)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isCopyButton && copied
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
                data-testid={`share-${platform.id}`}
              >
                {isCopyButton && copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isCopyButton && copied ? "Copied!" : platform.name}
                </span>
              </button>
            );
          })}
        </div>
        
        <p className="text-xs text-slate-400 text-center mt-4">
          Your privacy matters. We never post without your permission.
        </p>
      </div>
    </div>
  );
}

export { SHARE_PLATFORMS };

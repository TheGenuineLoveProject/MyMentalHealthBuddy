import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Heart, Gift, Users, Share2, Copy, Check, Mail, MessageCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import EmotionBackground from "@/components/sacred/EmotionBackground";
import GlowFooter from "@/components/GlowFooter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Invite() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${user?.id || 'friend'}`
    : '';

  const inviteMutation = useMutation({
    mutationFn: async (inviteEmail) => {
      return apiRequest("POST", "/api/invites", { email: inviteEmail });
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent!",
        description: "Your friend will receive an email invitation.",
      });
      setSentEmails(prev => [...prev, email]);
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/invites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    },
    onError: () => {
      toast({
        title: "Couldn't send invitation",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share this link with your friends."
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const handleEmailInvite = (e) => {
    e.preventDefault();
    if (email && !sentEmails.includes(email)) {
      inviteMutation.mutate(email);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(`Join me on The Genuine Love Project - a sacred space for healing and self-discovery. ${inviteLink}`)}`
    },
    {
      name: "Email",
      icon: Mail,
      color: "#EA4335",
      url: `mailto:?subject=${encodeURIComponent("Join me on The Genuine Love Project")}&body=${encodeURIComponent(`I've been using The Genuine Love Project for my wellness journey and thought you might love it too.\n\n${inviteLink}`)}`
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <EmotionBackground emotion="loved" intensity={0.15} />
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group" data-testid="link-back">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#ec4899] to-[#d4af37] mb-6 shadow-lg">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-invite-title">
              Invite Friends to Heal
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Share the gift of genuine love and healing with someone you care about.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50 shadow-xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="w-5 h-5 text-[#8fbf9f]" />
              <h2 className="text-lg font-serif font-semibold text-foreground">Share Your Link</h2>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl border bg-white/50 dark:bg-black/20 text-sm text-foreground"
                data-testid="input-invite-link"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 rounded-xl bg-[#8fbf9f] hover:bg-[#7aab8a] text-white font-medium transition-colors flex items-center gap-2"
                data-testid="button-copy-link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex gap-3 justify-center">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border hover:shadow-md transition-all"
                    style={{ borderColor: option.color, color: option.color }}
                    data-testid={`link-share-${option.name.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50 shadow-xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-lg font-serif font-semibold text-foreground">Send Email Invitation</h2>
            </div>

            <form onSubmit={handleEmailInvite} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1 px-4 py-3 rounded-xl border bg-white/50 dark:bg-black/20 text-foreground placeholder:text-muted-foreground"
                data-testid="input-invite-email"
              />
              <button
                type="submit"
                disabled={inviteMutation.isPending || !email}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:opacity-90 text-white font-medium transition-opacity disabled:opacity-50"
                data-testid="button-send-invite"
              >
                {inviteMutation.isPending ? "Sending..." : "Send"}
              </button>
            </form>

            {sentEmails.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Invitations sent:</p>
                {sentEmails.map((sentEmail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#8fbf9f]">
                    <Check className="w-4 h-4" />
                    {sentEmail}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#ec4899]/10 to-[#d4af37]/10 rounded-3xl p-6 md:p-8 border border-[#ec4899]/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-serif font-semibold text-foreground">Community Builder Badge</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Invite a friend and earn the exclusive Community Builder badge!
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8fbf9f]" />
                <span className="text-sm text-foreground">{sentEmails.length} invited</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ec4899]" />
                <span className="text-sm text-foreground">Spread the love</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlowFooter />
    </div>
  );
}

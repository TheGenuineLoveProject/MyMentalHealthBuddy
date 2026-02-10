import { useState } from "react";
import { Link } from "wouter";
import { Heart, Copy, Check, Gift, Users, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ReferralInvite({ className = "" }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralCode = user?.referralCode || "GENUINE";
  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!user) {
    return (
      <div 
        className={`bg-gradient-to-br from-[var(--glp-rose-15)] to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-center ${className}`}
        data-testid="referral-signup-prompt"
      >
        <Gift className="w-10 h-10 mx-auto mb-3 text-[var(--glp-rose)]" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Share Something Gentle
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Sign up to invite friends. They get 7 days of Plus free, and you get a bonus card pack.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--glp-sage)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          data-testid="link-signup-referral"
        >
          Create free account
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gradient-to-br from-[var(--glp-rose-15)] to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 ${className}`}
      data-testid="referral-invite"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-[var(--glp-rose)]" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Invite a Friend
        </h3>
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-5">
        Share this link. They get <strong>7 days of Plus free</strong>, 
        and you get a <strong>bonus reflection pack</strong>.
      </p>

      <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 mb-4">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none truncate"
          data-testid="input-referral-link"
        />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--glp-sage)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          data-testid="button-copy-referral"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-2xl font-bold text-[var(--glp-sage)]">
            {user.referralCount || 0}
          </p>
          <p className="text-xs text-slate-500">friends joined</p>
        </div>
        <div className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-2xl font-bold text-[var(--glp-gold)]">
            {user.bonusPacks || 0}
          </p>
          <p className="text-xs text-slate-500">bonus packs earned</p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-4">
        No pressure to share. Only if it feels right.
      </p>

      <div className="flex items-center justify-center gap-1 mt-3 opacity-60">
        <Heart className="w-3 h-3 text-[var(--glp-rose)]" />
        <span className="text-xs text-slate-500">The Genuine Love Project</span>
      </div>
    </div>
  );
}

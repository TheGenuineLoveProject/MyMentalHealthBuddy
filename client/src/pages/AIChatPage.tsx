import React from "react";
import AIChatPanel from "../components/chat/AIChatPanel";
import SEO from "@/components/SEO";
import { OfficialLumi } from "@/lumi-registry";

export default function AIChatPage() {
  return (
    <div className="hxos-vnext">
      <SEO
        title="Chat with Lumi — Your Emotional Wellness Companion"
        description="Talk with Lumi — your gentle emotional wellness companion. Private, compassionate support. Always here."
      />
      {/* v5.8.72 — small canonical Lumi (LUMI_HEART) header above chat panel.
          AIChatPanel itself does not render OfficialLumi (uses BuddyAvatar);
          this header anchor surfaces the canonical Lumi at the page level. */}
      <div className="flex items-center gap-3 px-4 pt-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--glp-sage-15)] border border-[var(--glp-sage-20)] flex-shrink-0" data-testid="lumi-header-circle">
          <OfficialLumi variant="LUMI_HEART" scene="page-header" position="inline" pageId="ai-chat" widthPx={40} decorative />
        </span>
        <p className="text-sm text-foreground/80">Lumi is here. Take your time.</p>
      </div>
      <AIChatPanel />
    </div>
  );
}

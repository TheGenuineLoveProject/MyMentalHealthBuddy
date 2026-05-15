import React from "react";
import AIChatPanel from "../components/chat/AIChatPanel";
import SEO from "@/components/SEO";

export default function AIChatPage() {
  return (
    <div className="hxos-vnext">
      <SEO
        title="Chat with Lumi — Your Emotional Wellness Companion"
        description="Talk with Lumi — your gentle emotional wellness companion. Private, compassionate support. Always here."
      />
      <AIChatPanel />
    </div>
  );
}

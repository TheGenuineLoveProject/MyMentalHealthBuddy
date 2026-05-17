export const HEALING_FLOW_PROTECTION_RULES = {
        prohibitedBusinessActions: [
                "paywall_popup",
                "upgrade_prompt",
                "subscription_overlay",
                "pricing_modal",
                "scarcity_countdown",
                "emotional_upsell",
                "conversion_prompt",
                "behavioral_monetization",
        ],

        protectedHealingFlows: [
                "meditation",
                "reflection",
                "journaling",
                "mood_tracking",
                "ritual",
                "breathing",
                "companion_support",
                "wisdom_practice",
        ],

        prohibitedPatterns: [
                "emotional_state_targeting",
                "vulnerability_pricing",
                "post_disclosure_conversion",
                "crisis_upsell",
                "fear_based_conversion",
        ],

        allowBusinessActionInsideHealingFlow(
                action: string,
        ): boolean {
                return !this.prohibitedBusinessActions.includes(action);
        },

        isProtected(id: string): boolean {
                return this.protectedHealingFlows.includes(id);
        },
};
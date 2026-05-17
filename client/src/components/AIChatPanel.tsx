import React, { useMemo } from "react";

import { deriveGovernance } from "@/governance/interactions/deriveGovernance";
import { buildGovernanceAttrs } from "@/governance/interactions/buildGovernanceAttrs";
import { CRISIS_LANGUAGE_PATTERN } from "@/governance/interactions/CrisisLanguagePattern";

/**
 * NOTE:
 * This snippet is ONLY the governance section for AIChatPanel.tsx.
 * Keep all existing imports/components/UI/rendering intact.
 * Replace ONLY the prior inline governance composition + inline attrs.
 */

const CHAT_IS_HEALING_FLOW = false;

export default function AIChatPanel({
	input = "",
	messages = [],
	children,
}: {
	input?: string;
	messages?: Array<{ role?: string; content?: string }>;
	children?: React.ReactNode;
}) {
	/**
	 * Existing crisis scan behavior preserved.
	 * Same regex.
	 * Same latest-message scanning behavior.
	 * Same dependency semantics.
	 */
	const crisisDetected = useMemo(() => {
		const latestUserMessages = messages
			.filter((m) => m?.role === "user")
			.slice(-5)
			.map((m) => m?.content ?? "")
			.join(" ");

		const haystack = `${input ?? ""} ${latestUserMessages}`;

		return CRISIS_LANGUAGE_PATTERN.test(haystack);
	}, [input, messages]);

	/**
	 * Existing semantics preserved:
	 * AIChatPanel historically folded vulnerability into crisis state.
	 */
	const vulnerableState = crisisDetected;

	/**
	 * Canonical governance composition.
	 * Replaces:
	 * - CrisisOverrideEngine.getOverrideState(...)
	 * - MonetizationBoundaryValidator.validate(...)
	 */
	const { overrideState, monetizationGate } = useMemo(
		() =>
			deriveGovernance({
				route: "/chat",
				healingFlow: CHAT_IS_HEALING_FLOW,
				crisisDetected,
				vulnerable: vulnerableState,
			}),
		[crisisDetected, vulnerableState]
	);

	/**
	 * Canonical 10-attr contract.
	 * Replaces all inline data-* governance attrs.
	 */
	const governanceAttrs = useMemo(
		() =>
			buildGovernanceAttrs({
				surface: "chat",
				healingFlow: CHAT_IS_HEALING_FLOW,
				crisisDetected,
				vulnerable: vulnerableState,
				overrideState,
				monetizationGate,
			}),
		[
			crisisDetected,
			vulnerableState,
			overrideState,
			monetizationGate,
		]
	);

	return (
		<div
			{...governanceAttrs}
			className="ai-chat-panel"
			data-testid="ai-chat-panel"
		>
			{children}
		</div>
	);
}
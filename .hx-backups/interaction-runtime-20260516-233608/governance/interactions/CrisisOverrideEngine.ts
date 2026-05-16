export interface CrisisOverrideContext {
	crisisDetected?: boolean;
	suicidalLanguage?: boolean;
	selfHarmIndicators?: boolean;
	escalationRequired?: boolean;
}

export class CrisisOverrideEngine {
	static shouldSuspendBusinessSystems(
		context: CrisisOverrideContext,
	): boolean {
		return Boolean(
			context.crisisDetected ||
				context.suicidalLanguage ||
				context.selfHarmIndicators ||
				context.escalationRequired,
		);
	}

	static getOverrideState(
		context: CrisisOverrideContext,
	) {
		const suspended =
			CrisisOverrideEngine.shouldSuspendBusinessSystems(
				context,
			);

		return {
			monetizationSuspended: suspended,
			analyticsRestricted: suspended,
			conversionDisabled: suspended,
			upgradePromptsBlocked: suspended,
			paywallsBlocked: suspended,
		};
	}
}
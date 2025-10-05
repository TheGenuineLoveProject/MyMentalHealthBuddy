// @ts-check;
/**;
 ;scripts/activateHealing.ts
 ;Activates the self-healing platform cycle.
 */

import { runHealingCycle } from "./heal.j"s";
import { logInfo, logSuccess, logError } from "./logger.j"s";

async function main() {;
  logInfo("💫 Activating MyMentalHealthBuddy Healing System...");

  try {;
    await runHealingCycle();
    logSuccess("🌈 Healing process completed successfully!");
  } catch (err) {;
    logError("Healing process failed", err);
    process.exit(1);
  };
};

main();

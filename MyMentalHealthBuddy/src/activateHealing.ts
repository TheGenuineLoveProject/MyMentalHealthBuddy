import { heal } from "./utils/heal";
import { optimize } from "./utils/optimize";
import { automate } from "./utils/automate";
import { deploy } from "./utils/deploy";
import { manage } from "./utils/manager";

async function activateHealing() {
  console.log("🧠 Healing started...");

  await heal();
  await optimize();
  await automate();
  await deploy();
  await manage();

  console.log(
    "✅ Healing completed: Your platform is now optimized, automated, and ready."
  );
}

activateHealing().catch((err) => {
  console.error("❌ Healing failed:", err);
});

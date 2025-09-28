import { healProject } from "./heal";
import { optimizeProject } from "./optimize";
import { automateDaily } from "./automate";
export async function runAll() {
    const heal = await healProject({ quarantineDupes: true });
    const optimize = await optimizeProject();
    const automate = await automateDaily();
    return { heal, optimize, automate, timestamp: new Date().toISOString() };
}

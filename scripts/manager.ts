// @ts-check
import { automateDaily } from './automate.js';
import { healProject } from './heal.js';
import { optimizeProject } from './optimize.js';

export async function runAll() {
  const heal = await healProject({ quarantineDupes: true });
  const optimize = await optimizeProject();
  const automate = await automateDaily();
  return { heal, optimize, automate, timestamp: new Date().toISOString() };
}

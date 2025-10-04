// @ts-checkexport function log(message: string) {
/// scripts/logger.ts
export function logInfo(message: string) {
  console.log(`ℹ️  ${message}`);
}

export function logSuccess(message: string) {
  console.log(`✅ ${message}`);
}

export function logError(message: string, error?: unknown) {
  console.error(`❌ ${message}`);
  if (error) console.error(error);
}
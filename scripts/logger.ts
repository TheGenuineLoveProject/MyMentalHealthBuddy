// ✅ scripts/logger.ts
// Unified logging utilities for the healing system.

export function logInfo(message: string): void {
  console.log("ℹ️  ${message}");
}

export function logSuccess(message: string): void {
  console.log("✅ ${message}");
}

export function logWarning(message: string): void {
  console.warn("⚠️  ${message}");
}

export function logError(message: string, error?: unknown): void {
  console.error("❌ ${message}");
  if (error instanceof Error) console.error(error.message);
  else if (error) console.error(error);
}

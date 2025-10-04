// @ts-checkexport function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[Healing@${timestamp}] ${message}`);
}
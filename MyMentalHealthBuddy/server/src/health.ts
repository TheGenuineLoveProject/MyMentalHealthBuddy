export const health = () => ({
  status: "ok",
  uptime: process.uptime(),
  ts: new Date().toISOString()
});
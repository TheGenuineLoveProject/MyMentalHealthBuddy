export const log = (level: 'info'|'warn'|'error'|'ok', msg: string, extra: unknown = {}) => {
  console.log(JSON.stringify({ t: new Date().toISOString(), level, msg, extra }));
};
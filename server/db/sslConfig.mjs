export function getPostgresSslConfig() {
  if (process.env.DATABASE_SSL === "false") return false;

  if (process.env.PGSSLROOTCERT) {
    return {
      rejectUnauthorized: true,
      ca: process.env.PGSSLROOTCERT,
    };
  }

  // Managed Postgres providers commonly provide CA trust through the runtime.
  // This keeps SSL enabled while allowing explicit CA hardening via PGSSLROOTCERT.
  return { rejectUnauthorized: true };
}

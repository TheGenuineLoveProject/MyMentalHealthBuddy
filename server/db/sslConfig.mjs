import { readFileSync } from "node:fs";

const SSL_QUERY_KEYS = [
  "sslmode",
  "sslrootcert",
  "sslcert",
  "sslkey",
  "sslpassword",
  "sslnegotiation",
];

/**
 * Remove connection-string SSL directives so node-postgres cannot replace
 * the application's explicit ssl configuration.
 *
 * Non-SSL query parameters are preserved.
 */
export function getPostgresConnectionString(connectionString) {
  if (!connectionString) return connectionString;

  let url;
  try {
    url = new URL(connectionString);
  } catch {
    // Preserve existing validation/error behavior for malformed connection
    // strings rather than logging or reconstructing sensitive credentials.
    return connectionString;
  }

  for (const key of SSL_QUERY_KEYS) {
    url.searchParams.delete(key);
  }

  return url.toString();
}

function resolveCertificateAuthority(env) {
  if (env.DATABASE_SSL_CA_PEM) {
    return env.DATABASE_SSL_CA_PEM;
  }

  if (!env.PGSSLROOTCERT) {
    return undefined;
  }

  // Backward compatibility with the historical MMHB behavior, where this
  // variable could contain PEM text directly.
  if (env.PGSSLROOTCERT.includes("-----BEGIN CERTIFICATE-----")) {
    return env.PGSSLROOTCERT;
  }

  // Standard PostgreSQL/libpq semantics: PGSSLROOTCERT is a file path.
  return readFileSync(env.PGSSLROOTCERT, "utf8");
}

export function getPostgresSslConfig(env = process.env) {
  const sslDisabled =
    String(env.DATABASE_SSL || "").trim().toLowerCase() === "false";

  if (sslDisabled) {
    if (env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_SSL=false is not permitted when NODE_ENV=production"
      );
    }

    return false;
  }

  const ca = resolveCertificateAuthority(env);

  if (ca) {
    return {
      rejectUnauthorized: true,
      ca,
    };
  }

  return {
    rejectUnauthorized: true,
  };
}

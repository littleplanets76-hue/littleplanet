const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

export function getDatabaseUrl() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");

    if (sslMode && LEGACY_SSL_MODES.has(sslMode.toLowerCase())) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}

export function createPoolOptions(options = {}) {
  return {
    connectionString: getDatabaseUrl(),
    ...options,
  };
}

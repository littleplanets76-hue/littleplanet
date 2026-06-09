import { Pool } from "pg";
import { createPoolOptions, getDatabaseUrl } from "@/lib/postgresConfig";

let pool;

export function getPool() {
  if (pool) {
    return pool;
  }

  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  pool = new Pool(createPoolOptions({
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }));

  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

import pg from "pg";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  min: env.DB_POOL_MIN,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  logger.warn("CockroachDB pool client reconnecting", { error: err.message });
});

/**
 * Execute a query with connection pooling and transient reconnect retry.
 */
export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[],
  retries = 2
): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const res = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      if (duration > 1000) {
        logger.warn("Slow query detected", { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (err: any) {
      attempt++;
      if (attempt <= retries && (err.message?.includes("terminated") || err.message?.includes("ECONNRESET") || err.message?.includes("EADDRNOTAVAIL"))) {
        logger.warn(`CockroachDB query auto-reconnecting (attempt ${attempt}/${retries})...`);
        await new Promise((r) => setTimeout(r, 200 * attempt));
        continue;
      }
      logger.error("Database query failed", { text, params, error: err.message });
      throw err;
    }
  }
  throw new Error("Query failed after retry");
}

/**
 * CockroachDB Transaction with automatic retry on serialization conflicts (Code 40001).
 */
export async function withTransaction<T>(
  callback: (client: pg.PoolClient) => Promise<T>,
  maxRetries = 5
): Promise<T> {
  const client = await pool.connect();
  let attempt = 0;

  try {
    while (attempt < maxRetries) {
      attempt++;
      try {
        await client.query("BEGIN;");
        const result = await callback(client);
        await client.query("COMMIT;");
        return result;
      } catch (err: any) {
        await client.query("ROLLBACK;").catch(() => {});
        // Code 40001: CockroachDB transaction retry error
        if (err.code === "40001" && attempt < maxRetries) {
          const backoff = Math.min(100 * Math.pow(2, attempt) + Math.random() * 50, 1000);
          logger.warn(`CockroachDB transaction retry needed (attempt ${attempt}/${maxRetries})`, { backoff });
          await new Promise((resolve) => setTimeout(resolve, backoff));
          continue;
        }
        throw err;
      }
    }
    throw new Error("Transaction exceeded maximum retry attempts");
  } finally {
    client.release();
  }
}

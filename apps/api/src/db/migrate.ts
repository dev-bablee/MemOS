import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "./connection.js";
import { logger } from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations(): Promise<void> {
  logger.info("Starting CockroachDB database migrations...");
  
  const migrationFilePath = path.join(__dirname, "migrations", "001_initial_schema.sql");
  if (!fs.existsSync(migrationFilePath)) {
    throw new Error(`Migration file not found at ${migrationFilePath}`);
  }

  const sql = fs.readFileSync(migrationFilePath, "utf8");

  try {
    await query(sql);
    logger.info("✅ Database schema migration completed successfully.");
  } catch (err: any) {
    logger.error("❌ Migration failed:", { error: err.message, stack: err.stack });
    throw err;
  }
}

// Auto-run when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

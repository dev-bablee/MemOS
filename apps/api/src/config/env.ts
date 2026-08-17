import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  
  // CockroachDB Configuration
  // cspell:disable-next-line
  DATABASE_URL: z.string().default("postgresql://root@localhost:26257/memos?sslmode=disable"),
  DB_POOL_MAX: z.coerce.number().default(20),
  DB_POOL_MIN: z.coerce.number().default(2),
  
  // Security & Authentication
  JWT_SECRET: z.string().default("memos-super-secret-production-jwt-key-2026"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  
  // AWS Bedrock Configuration (Primary AI Foundation)
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SESSION_TOKEN: z.string().optional(),
  AWS_BEDROCK_MODEL_ID: z.string().default("anthropic.claude-3-5-sonnet-20241022-v2:0"),
  AWS_BEDROCK_EMBED_MODEL_ID: z.string().default("amazon.titan-embed-text-v2:0"),
  AWS_S3_BUCKET: z.string().default("memos-documents-storage"),

  // CockroachDB Cloud Model Context Protocol (MCP)
  COCKROACH_MCP_URL: z.string().default("https://cockroachlabs.cloud/mcp"),
  
  // Dynamic Memory Retrieval Scoring Defaults
  MEMORY_WEIGHT_VECTOR: z.coerce.number().default(0.50),
  MEMORY_WEIGHT_RECENCY: z.coerce.number().default(0.20),
  MEMORY_WEIGHT_IMPORTANCE: z.coerce.number().default(0.20),
  MEMORY_WEIGHT_FREQUENCY: z.coerce.number().default(0.10),
  MEMORY_DECAY_HALF_LIFE_DAYS: z.coerce.number().default(7.0),
});

export type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    return envSchema.parse({});
  }
  return result.data;
}

export const env = parseEnv();

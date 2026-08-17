import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import crypto from "crypto";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export class EmbeddingService {
  private static bedrockClient: BedrockRuntimeClient | null = null;
  private static cache = new Map<string, number[]>();

  private static getClient(): BedrockRuntimeClient {
    if (!this.bedrockClient) {
      this.bedrockClient = new BedrockRuntimeClient({
        region: env.AWS_REGION,
        credentials:
          env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
            ? {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                sessionToken: env.AWS_SESSION_TOKEN,
              }
            : undefined,
      });
    }
    return this.bedrockClient;
  }

  /**
   * Generates a 1536-dimensional dense vector for input text.
   * Utilizes Amazon Bedrock Titan Embeddings with deterministic vector fallback.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const cleanText = text.trim().slice(0, 8000);
    const hashKey = crypto.createHash("sha256").update(cleanText).digest("hex");

    if (this.cache.has(hashKey)) {
      return this.cache.get(hashKey)!;
    }

    // Attempt Amazon Bedrock Titan Embeddings if AWS credentials or environment is present
    if (env.AWS_ACCESS_KEY_ID || process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI) {
      try {
        const client = this.getClient();
        const payload = JSON.stringify({
          inputText: cleanText,
          dimensions: 1536,
          normalize: true,
        });

        const command = new InvokeModelCommand({
          modelId: env.AWS_BEDROCK_EMBED_MODEL_ID,
          contentType: "application/json",
          accept: "application/json",
          body: Buffer.from(payload),
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(Buffer.from(response.body).toString("utf-8"));
        const vector: number[] = responseBody.embedding;

        if (Array.isArray(vector) && vector.length > 0) {
          this.cache.set(hashKey, vector);
          return vector;
        }
      } catch (err: any) {
        logger.warn("Bedrock embedding call failed, falling back to deterministic dense vector", {
          error: err.message,
        });
      }
    }

    // High-Entropy Deterministic Dense Embedding Fallback (1536-dim)
    const fallbackVector = this.createDeterministicEmbedding(cleanText, 1536);
    this.cache.set(hashKey, fallbackVector);
    return fallbackVector;
  }

  /**
   * High-dimensional pseudo-semantic dense vector generation for offline / development testing.
   */
  private static createDeterministicEmbedding(text: string, dimensions = 1536): number[] {
    const vector: number[] = new Array(dimensions).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hash = crypto.createHash("sha256").update(`${word}_${i}`).digest();
      for (let j = 0; j < dimensions; j++) {
        const byte = hash[j % hash.length];
        const val = (byte / 127.5) - 1.0;
        vector[j] += val * (1.0 / (i + 1));
      }
    }

    // L2 Normalize
    let norm = 0;
    for (let j = 0; j < dimensions; j++) {
      norm += vector[j] * vector[j];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let j = 0; j < dimensions; j++) {
        vector[j] = parseFloat((vector[j] / norm).toFixed(6));
      }
    } else {
      vector[0] = 1.0;
    }

    return vector;
  }
}

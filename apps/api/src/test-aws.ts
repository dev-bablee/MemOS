import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { env } from "./config/env.js";
import { pool } from "./db/connection.js";

async function testConnections() {
  console.log("\n🔍 ========================================================");
  console.log("   MemOS Infrastructure & AWS Connection Health Check");
  console.log("========================================================\n");

  // 1. CockroachDB Check
  console.log("1️⃣ Testing CockroachDB connection...");
  try {
    const res = await pool.query("SELECT version(), current_database(), now();");
    console.log("   ✅ CockroachDB Connected successfully!");
    console.log(`      Database: ${res.rows[0].current_database}`);
    console.log(`      Server Time: ${res.rows[0].now}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️ CockroachDB connection note: ${msg}`);
  }

  // 2. AWS Bedrock Check
  console.log("\n2️⃣ Testing AWS Bedrock Foundation Models...");
  console.log(`   Region: ${env.AWS_REGION}`);
  console.log(`   Model: ${env.AWS_BEDROCK_MODEL_ID}`);
  console.log(`   Access Key: ${env.AWS_ACCESS_KEY_ID ? `${env.AWS_ACCESS_KEY_ID.slice(0, 4)}••••••••` : "NOT CONFIGURED"}`);

  try {
    const client = new BedrockRuntimeClient({
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

    console.log("   Invoking Claude 3.5 Sonnet on AWS Bedrock...");
    const command = new InvokeModelCommand({
      modelId: env.AWS_BEDROCK_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 50,
        messages: [{ role: "user", content: "Respond with: 'MemOS AWS Bedrock connection verified!'" }],
      }),
    });

    const response = await client.send(command);
    const jsonRes = JSON.parse(new TextDecoder().decode(response.body));
    console.log("   ✅ AWS Bedrock Claude 3.5 Sonnet Connected!");
    console.log(`      Response: "${jsonRes.content[0].text.trim()}"`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️ AWS Bedrock Invocation note: ${msg}`);
  }

  console.log("\n========================================================\n");
  process.exit(0);
}

testConnections().catch(console.error);

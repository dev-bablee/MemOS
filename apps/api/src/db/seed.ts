import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query, withTransaction } from "./connection.js";
import { logger } from "../config/logger.js";

export async function seedDatabase(): Promise<void> {
  logger.info("🌱 Seeding CockroachDB with default demo dataset...");

  await withTransaction(async (client) => {
    // 1. Create Default Tenant
    const tenantRes = await client.query(`
      INSERT INTO tenants (name, slug, plan)
      VALUES ('MemOS Production Org', 'memos-prod', 'enterprise')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
    `);
    const tenantId = tenantRes.rows[0].id;

    // 2. Create Default Admin User
    const passwordHash = await bcrypt.hash("password123", 10);
    const userRes = await client.query(`
      INSERT INTO users (tenant_id, email, password_hash, name, role)
      VALUES ($1, 'admin@memos.ai', $2, 'Lead AI Engineer', 'admin')
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
    `, [tenantId, passwordHash]);
    const userId = userRes.rows[0].id;

    // 3. Create Default Project
    const projectRes = await client.query(`
      INSERT INTO projects (tenant_id, name, description)
      VALUES ($1, 'AgentOS Hackathon Project', 'Core AI persistent memory and orchestration workspace')
      RETURNING id;
    `, [tenantId]);
    const projectId = projectRes.rows[0].id;

    // 4. Create Master API Key
    const rawApiKey = "mem_live_9f83a2bc7190de44";
    const apiKeyHash = crypto.createHash("sha256").update(rawApiKey).digest("hex");
    await client.query(`
      INSERT INTO api_keys (tenant_id, name, key_hash, prefix, scopes)
      VALUES ($1, 'Master Development Key', $2, 'mem_live_', '["*"]'::jsonb)
      ON CONFLICT DO NOTHING;
    `, [tenantId, apiKeyHash]);

    // 5. Create AI Agents
    const agentRes = await client.query(`
      INSERT INTO agents (tenant_id, project_id, name, description, model, system_prompt, memory_config, tools)
      VALUES 
      ($1, $2, 'MemOS Architect Agent', 'Principal AI Systems Architect specialized in CockroachDB and AWS', 
       'anthropic.claude-3-5-sonnet-20241022-v2:0',
       'You are the MemOS Principal Systems Architect. You possess persistent cognitive memory stored in CockroachDB. Always check your long-term memory before answering questions about past architecture, codebase structure, and technical decisions.',
       '{"halfLifeDays": 7, "minImportance": 0.3, "vectorWeight": 0.5}'::jsonb,
       '["search_memory", "save_memory", "knowledge_graph", "web_search"]'::jsonb)
      RETURNING id;
    `, [tenantId, projectId]);
    const agentId = agentRes.rows[0].id;

    // 6. Seed High-Value Initial Long-Term Memories
    const sampleMemories = [
      {
        type: "SEMANTIC",
        content: "MemOS is an Operating System for AI Agents providing persistent memory powered by CockroachDB and Amazon Bedrock.",
        importance: 0.95,
      },
      {
        type: "SEMANTIC",
        content: "The backend uses CockroachDB for multi-region transactional consistency and distributed vector indexing.",
        importance: 0.90,
      },
      {
        type: "EPISODIC",
        content: "Team decided on Drizzle ORM + CockroachDB connection pooling with automated serialization retry loop (Code 40001).",
        importance: 0.85,
      },
      {
        type: "PROCEDURAL",
        content: "Memory retrieval scoring math: FinalScore = 0.50 * VectorSim + 0.20 * RecencyDecay + 0.20 * Importance + 0.10 * AccessFrequency.",
        importance: 0.92,
      },
    ];

    for (const mem of sampleMemories) {
      // Mock embedding vector for initial seed
      const mockVector = Array.from({ length: 64 }, () => (Math.random() * 2 - 1).toFixed(4));
      await client.query(`
        INSERT INTO long_term_memories (tenant_id, agent_id, project_id, memory_type, content, embedding, importance_score, access_count)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, 1);
      `, [tenantId, agentId, projectId, mem.type, mem.content, JSON.stringify(mockVector), mem.importance]);
    }

    // 7. Seed Knowledge Graph Entities & Relations
    const entityCockroach = await client.query(`
      INSERT INTO entities (tenant_id, project_id, name, entity_type, properties)
      VALUES ($1, $2, 'CockroachDB', 'SYSTEM', '{"role": "Distributed SQL & Vector Storage"}'::jsonb)
      ON CONFLICT (tenant_id, name, entity_type) DO UPDATE SET updated_at = NOW()
      RETURNING id;
    `, [tenantId, projectId]);

    const entityBedrock = await client.query(`
      INSERT INTO entities (tenant_id, project_id, name, entity_type, properties)
      VALUES ($1, $2, 'Amazon Bedrock', 'SYSTEM', '{"models": ["Claude 3.5 Sonnet", "Titan Embeddings"]}'::jsonb)
      ON CONFLICT (tenant_id, name, entity_type) DO UPDATE SET updated_at = NOW()
      RETURNING id;
    `, [tenantId, projectId]);

    const entityMemOS = await client.query(`
      INSERT INTO entities (tenant_id, project_id, name, entity_type, properties)
      VALUES ($1, $2, 'MemOS Kernel', 'CONCEPT', '{"type": "Agent Cognitive Substrate"}'::jsonb)
      ON CONFLICT (tenant_id, name, entity_type) DO UPDATE SET updated_at = NOW()
      RETURNING id;
    `, [tenantId, projectId]);

    await client.query(`
      INSERT INTO entity_relations (tenant_id, subject_id, predicate, object_id, weight)
      VALUES 
      ($1, $2, 'PERSISTS_TO', $3, 1.0),
      ($1, $2, 'ORCHESTRATED_WITH', $4, 0.95);
    `, [tenantId, entityMemOS.rows[0].id, entityCockroach.rows[0].id, entityBedrock.rows[0].id]);

    logger.info("✅ Database seeded successfully with demo tenant, agent, memory, and graph data!");
  });
}

// Auto-run when executed directly
import { fileURLToPath } from "url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error("Seeding error:", err);
      process.exit(1);
    });
}

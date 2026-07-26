# Low-Level Design (LLD) — MemOS

## 1. Database Schema Specifications (CockroachDB + Drizzle ORM)

### 1.1 `tenants` Table
- `id`: UUID (Primary Key)
- `name`: VARCHAR(255)
- `slug`: VARCHAR(255) (Unique)
- `created_at`: TIMESTAMP WITH TIME ZONE

### 1.2 `api_keys` Table
- `id`: UUID (Primary Key)
- `tenant_id`: UUID (Foreign Key -> `tenants.id`)
- `key_hash`: VARCHAR(255) (SHA256 / Argon2id)
- `prefix`: VARCHAR(32) (e.g. `mem_live_`)
- `scopes`: JSONB (Array of allowed actions)
- `expires_at`: TIMESTAMP WITH TIME ZONE
- `created_at`: TIMESTAMP WITH TIME ZONE

### 1.3 `agents` Table
- `id`: UUID (Primary Key)
- `tenant_id`: UUID (Foreign Key -> `tenants.id`)
- `name`: VARCHAR(255)
- `description`: TEXT
- `system_prompt`: TEXT
- `metadata`: JSONB
- `created_at`: TIMESTAMP WITH TIME ZONE

### 1.4 `sessions` Table
- `id`: UUID (Primary Key)
- `agent_id`: UUID (Foreign Key -> `agents.id`)
- `user_id`: VARCHAR(255)
- `status`: VARCHAR(50) (`ACTIVE`, `ARCHIVED`)
- `created_at`: TIMESTAMP WITH TIME ZONE

### 1.5 `long_term_memories` Table
- `id`: UUID (Primary Key)
- `agent_id`: UUID (Foreign Key -> `agents.id`)
- `session_id`: UUID (Foreign Key -> `sessions.id`, Nullable)
- `memory_type`: VARCHAR(50) (`EPISODIC`, `SEMANTIC`, `PROCEDURAL`)
- `content`: TEXT
- `summary`: TEXT
- `embedding`: VECTOR(1536) / VECTOR(768)
- `importance_score`: FLOAT (0.0 to 1.0)
- `access_count`: INT (Default 0)
- `last_accessed_at`: TIMESTAMP WITH TIME ZONE
- `metadata`: JSONB
- `created_at`: TIMESTAMP WITH TIME ZONE

### 1.6 `entities` & `entity_relations` Tables
- `entities`: `id`, `tenant_id`, `name`, `type` (PERSON, LOCATION, CONCEPT), `properties` (JSONB)
- `entity_relations`: `id`, `subject_id`, `predicate`, `object_id`, `weight`

---

## 2. Scoring & Decay Algorithm Math (`@memos/core`)

The memory retrieval score is calculated dynamically during search:

$$Score = (w_1 \cdot VectorSimilarity) + (w_2 \cdot RecencyDecay) + (w_3 \cdot ImportanceScore) + (w_4 \cdot AccessFrequency)$$

Where:
- $RecencyDecay = e^{-\lambda \cdot (t_{current} - t_{last\_accessed})}$
- $\lambda$ is the exponential decay constant (configurable per agent).
- $AccessFrequency = \log(1 + access\_count)$.

---

## 3. Worker Queue Specifications (BullMQ + Redis)

| Queue Name | Job Name | Payload | Processing Logic |
| :--- | :--- | :--- | :--- |
| `memory-ingestion` | `process-interaction` | `{ agentId, sessionId, content }` | Computes vector embeddings via Vercel AI SDK and inserts into `long_term_memories`. |
| `memory-consolidation` | `consolidate-buffer` | `{ agentId, sessionId }` | Fetches short-term buffer from Redis, runs LLM prompt for entity extraction & fact synthesis, persists semantic facts. |
| `memory-decay` | `recalculate-decay` | `{ tenantId }` | Batch updates memory importance scores based on time decay functions. |

---

## 4. API Interface Specification

### `POST /v1/agents/:id/memories/search`
- **Headers**: `Authorization: Bearer <api_key>`
- **Request Body**:
  ```json
  {
    "query": "What are the user's project preferences?",
    "limit": 10,
    "minScore": 0.65,
    "memoryTypes": ["SEMANTIC", "EPISODIC"]
  }
  ```
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "mem_12345",
        "content": "User prefers TypeScript over JavaScript for all backend services.",
        "type": "SEMANTIC",
        "score": 0.92,
        "createdAt": "2026-07-24T10:00:00Z"
      }
    ]
  }
  ```

# MemOS — System Design & Engineering Specifications

## 1. Product Goals & Vision

MemOS provides a persistent, shared cognitive memory substrate for AI agents and developer workflows. By bridging distributed transactional storage in **CockroachDB** with foundation model orchestration in **Amazon Bedrock**, MemOS enables autonomous agents to:
1. **Never Forget Context**: Persist facts, preferences, code snippets, architectural decisions, and episodic interactions across sessions and restarts.
2. **Collaborate Across Agents**: Provide a shared, multi-agent knowledge graph where specialized agents (e.g., Planner, Coder, Reviewer, QA) learn from each other's outputs.
3. **Retrieve with Cognitive Relevance**: Score memories using a biologically inspired formulation combining cosine vector similarity, time-decay recency, explicit importance, and access frequency.
4. **Deliver Enterprise Safety & Isolation**: Guarantee multi-tenant isolation, RBAC, encrypted storage, and complete audit trails.

---

## 2. Functional & Non-Functional Requirements

### 2.1 Functional Requirements
- **Tenant & Identity Management**: Multi-tenant workspace isolation with JWT user auth and scoped API keys (`mem_live_...`).
- **Agent Lifecycle**: Register, configure, update, and monitor autonomous agents with custom system instructions and memory policies.
- **Memory Ingestion**: Ingest unstructured text, conversations, documents, and structured entity triplets (Subject-Predicate-Object).
- **Hybrid Memory Retrieval**: Query memories via vector semantic similarity combined with dynamic recency decay and importance weighting.
- **Agent Execution Engine**: Plan and execute complex multi-step workflows with tool calling, MCP integrations, and token streaming over WebSocket/SSE.
- **Project Workspaces**: Partition knowledge and agent configurations by project boundaries.
- **Observability Dashboard**: Inspect memory vectors, entity graphs, query latencies, and agent execution logs in real-time.

### 2.2 Non-Functional Requirements
- **Performance**: P95 memory retrieval latency $< 60\text{ms}$ on CockroachDB vector indexes; P95 end-to-end streaming TTFT (Time-To-First-Token) $< 400\text{ms}$.
- **Scalability**: Capable of horizontally scaling to millions of memory vectors and thousands of concurrent agent sessions.
- **Reliability & ACID Guarantees**: Full transactional consistency on memory writes with automated CockroachDB serialization retry loops.
- **Security**: Strict zero-trust posture, SHA-256 API key hashing, AES-256 / KMS encryption at rest, TLS 1.3 in transit, and role-based access control.
- **Zero Regression / High Code Quality**: Clean Architecture, Repository Pattern, Strict TypeScript (zero `any`), Zod schema validation on all inputs and DTOs.

---

## 3. User Journey & UX Flow

```
[ Developer / User ]
         │
         ├──► 1. Sign Up / Sign In ──► Workspace Dashboard
         │
         ├──► 2. Generate Scoped API Key (`mem_live_...`)
         │
         ├──► 3. Create Agent (e.g. "Lead Backend Architect", "Code Reviewer")
         │
         ├──► 4. Ingest Project Context (Upload Docs, Seed Initial Memories)
         │
         ├──► 5. Interact via Chat / SDK:
         │         ├─ Agent recalls relevant past architectural decisions
         │         ├─ Agent decomposes goal into sub-tasks via Planner
         │         ├─ Agent executes tools / MCP servers
         │         └─ Agent updates long-term memory & knowledge graph
         │
         └──► 6. Inspect Memory Graph, Metrics, & Audit Logs in Dashboard
```

---

## 4. Backend Design Decisions

1. **Monorepo Structure**:
   - `apps/web`: Next.js 15 App Router frontend with Tailwind CSS v4, Lucide icons, Zustand, and TanStack Query.
   - `apps/api`: High-performance Node.js / TypeScript service providing REST, WebSocket, background queues, and Bedrock/CockroachDB integrations.
2. **PostgreSQL / CockroachDB Compatibility Layer**:
   - Drizzle ORM and standard `pg` connection pools configured with CockroachDB connection strings and retry-safe transaction handlers.
3. **Vector Embeddings**:
   - Dense 1536-dimensional or 768-dimensional float vectors stored directly in CockroachDB vector columns, enabling unified relational + vector queries in a single ACID transaction.
4. **Queue Architecture**:
   - Event-driven background processor with BullMQ / in-memory worker fallback handling async memory summarization, knowledge graph extraction, and time-decay recalculations without blocking user request threads.

---

## 5. Mathematical Memory Scoring & Retrieval Formulation

When an agent or user queries memory, the retrieval score is computed dynamically to reflect true cognitive relevance:

$$\text{FinalScore}(m, q) = w_1 \cdot \text{Sim}(v_m, v_q) + w_2 \cdot \text{Recency}(m) + w_3 \cdot \text{Importance}(m) + w_4 \cdot \text{Frequency}(m)$$

### Component Formulations:
1. **Vector Semantic Similarity**:
   $$\text{Sim}(v_m, v_q) = \frac{v_m \cdot v_q}{\|v_m\| \|v_q\|} \in [0, 1]$$
2. **Exponential Recency Decay**:
   $$\text{Recency}(m) = e^{-\lambda \cdot (t_{\text{current}} - t_{\text{last\_accessed}})}$$
   - $\lambda = \frac{\ln(2)}{\text{half\_life\_days}}$ (Configurable per agent, default: 7-day half-life).
3. **Importance Score**:
   $$\text{Importance}(m) \in [0.0, 1.0] \quad (\text{Determined via LLM assessment at ingestion})$$
4. **Access Frequency Log-Scaling**:
   $$\text{Frequency}(m) = \frac{\ln(1 + \text{access\_count})}{\ln(1 + \text{max\_observed\_access})}$$

**Default Parameter Weights**:
$w_1 = 0.50$ (Semantic Vector Match), $w_2 = 0.20$ (Recency), $w_3 = 0.20$ (Importance), $w_4 = 0.10$ (Access Frequency).

---

## 6. Complete REST & WebSocket API Specification

### 6.1 Authentication & API Keys
- `POST /api/v1/auth/signup` - Register user & initialize default tenant
- `POST /api/v1/auth/login` - Authenticate with email/password, returns JWT access token
- `GET /api/v1/auth/me` - Fetch authenticated user & tenant context
- `GET /api/v1/api-keys` - List active API keys for tenant
- `POST /api/v1/api-keys` - Create new scoped API key (`mem_live_...`)
- `DELETE /api/v1/api-keys/:id` - Revoke API key

### 6.2 Agent Management
- `GET /api/v1/agents` - List agents in tenant/project
- `POST /api/v1/agents` - Create agent with system prompt & memory configuration
- `GET /api/v1/agents/:id` - Get agent details
- `PATCH /api/v1/agents/:id` - Update agent parameters
- `DELETE /api/v1/agents/:id` - Archive/delete agent
- `POST /api/v1/agents/:id/chat` - Synchronous/Streaming chat execution

### 6.3 Memory & Knowledge Engine
- `POST /api/v1/memories` - Ingest new memory (Episodic, Semantic, Procedural)
- `POST /api/v1/memories/search` - Hybrid vector + decay score search
- `GET /api/v1/memories/:id` - Retrieve memory detail
- `DELETE /api/v1/memories/:id` - Soft delete memory
- `GET /api/v1/memories/graph` - Query entity knowledge graph (Nodes & Edges)

### 6.4 Projects & Analytics
- `GET /api/v1/projects` - List tenant projects
- `POST /api/v1/projects` - Create project workspace
- `GET /api/v1/dashboard/metrics` - Fetch real-time memory counts, token stats, and latency metrics
- `GET /api/v1/health` - Liveness & readiness probes for DB and AWS connectivity

---

## 7. Security Architecture & Threat Modeling

1. **Authentication & Identity**:
   - Dual-mode auth: JSON Web Tokens (HMAC SHA-256 with 15-minute expiry) for web dashboard; Scoped cryptographic API keys (`mem_live_...` with SHA-256 one-way hashing) for SDK/agent integrations.
2. **Tenant Isolation (Multi-Tenancy)**:
   - Every database query in the repository layer enforces `tenant_id` WHERE clauses, preventing cross-tenant data leakage.
3. **Data Sanitization & Injection Defense**:
   - All inbound JSON payloads strictly validated via Zod schemas.
   - Parameterized SQL queries via Drizzle/pg preventing SQL injection.
   - System prompts constructed with XML delimiters preventing prompt injection.
4. **Secret Management**:
   - Environment variables validated at boot via Zod schema. Cloud provider keys loaded via AWS Secrets Manager in production.

---

## 8. Observability, Logging & Error Handling

- **Structured Logging**: Winston JSON logger logging `timestamp`, `level`, `correlationId`, `tenantId`, `userId`, `route`, `latencyMs`, and `errorStack`.
- **Error Handling Pipeline**: Centralized error middleware returning standardized RFC 7807 problem details:
  ```json
  {
    "success": false,
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Agent with ID 'agent_123' does not exist.",
      "correlationId": "req_8f13b91a",
      "timestamp": "2026-08-17T13:30:00.000Z"
    }
  }
  ```
- **Telemetry & CloudWatch Metrics**: Automated emission of `MemoryRetrievalDuration`, `EmbeddingGenerationTime`, `AgentExecutionSteps`, and `CockroachDBQueryLatency`.

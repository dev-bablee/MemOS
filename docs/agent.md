# MemOS — AI Agent System & Cognitive Kernel Specification

## 1. Agent Architecture & Cognitive Subsystems

The **MemOS Agent Kernel** is an advanced cognitive runtime that transforms stateless Large Language Models (LLMs) into stateful, autonomous, self-improving agents. Built on a modular **Planner-Executor-Critic** loop with deep integration into **CockroachDB Distributed Memory** and **AWS Bedrock Foundation Models**, the agent kernel manages perception, multi-tiered memory retrieval, tool execution, and dynamic context synthesis.

```
                                 ┌────────────────────────────────────────────────────────┐
                                 │                   USER / API TRIGGER                   │
                                 │     Natural Language Goal / Task / Chat Prompt         │
                                 └───────────────────────────┬────────────────────────────┘
                                                             │
                                                             ▼
                                 ┌────────────────────────────────────────────────────────┐
                                 │                 AGENT KERNEL RUNTIME                   │
                                 │                                                        │
                                 │   ┌────────────────────────────────────────────────┐   │
                                 │   │              1. PERCEPTION & INTENT            │   │
                                 │   │   • Entity Recognition  • Intent Classification│   │
                                 │   └───────────────────────┬────────────────────────┘   │
                                 │                           │                            │
                                 │                           ▼                            │
                                 │   ┌────────────────────────────────────────────────┐   │
                                 │   │          2. COGNITIVE MEMORY MANAGER           │   │
                                 │   │   • Short-Term Buffer   • Episodic Memories    │   │
                                 │   │   • Semantic Fact Base  • Procedural Workflows │   │
                                 │   │   • Knowledge Graph Entity Links (CockroachDB) │   │
                                 │   └───────────────────────┬────────────────────────┘   │
                                 │                           │                            │
                                 │                           ▼                            │
                                 │   ┌────────────────────────────────────────────────┐   │
                                 │   │               3. GOAL PLANNER                  │   │
                                 │   │   • Decomposes Goal into DAG Execution Steps   │   │
                                 │   │   • Dependency Analysis & Tool Assignment      │   │
                                 │   └───────────────────────┬────────────────────────┘   │
                                 │                           │                            │
                                 │                           ▼                            │
                                 │   ┌────────────────────────────────────────────────┐   │
                                 │   │            4. ReAct TOOL EXECUTOR              │   │
                                 │   │   • Tool Registry & Built-ins                  │   │
                                 │   │   • Model Context Protocol (MCP) Integration   │   │
                                 │   │   • AWS Bedrock Claude 3.5 Sonnet Tool Invoker │   │
                                 │   └───────────────────────┬────────────────────────┘   │
                                 │                           │                            │
                                 │                           ▼                            │
                                 │   ┌────────────────────────────────────────────────┐   │
                                 │   │             5. CONTEXT MANAGER                 │   │
                                 │   │   • Sliding Window Compaction & Auto-Summary   │   │
                                 │   │   • Token Budgeting (Exact Tiktoken Tracking)  │   │
                                 │   └───────────────────────┬────────────────────────┘   │
                                 │                           │                            │
                                 │                           ▼                            │
                                 │   ┌────────────────────────────────────────────────┐   │
                                 │   │             6. REFLECTION & WRITEBACK          │   │
                                 │   │   • Extracts new learnings & episodic traces   │   │
                                 │   │   • Persists embeddings to CockroachDB Vector  │   │
                                 │   └────────────────────────────────────────────────┘   │
                                 └────────────────────────────────────────────────────────┘
```

---

## 2. Deep Dive: Core Cognitive Modules

### 2.1 The Planner (Goal Decomposition & Task Graph)
The **Planner** intercepts high-level user goals (e.g., *"Audit our AWS security groups, search memory for company policy, and propose Terraform updates"*) and generates a Directed Acyclic Graph (DAG) of atomic sub-tasks:
- **Decomposition**: Uses few-shot prompt templates to produce structured JSON plans with explicit inputs, dependencies, expected tool calls, and success criteria.
- **Dynamic Re-planning**: If a sub-task fails or uncovers unexpected data during execution, the Planner dynamically adjusts downstream steps without starting over.

### 2.2 The Executor (ReAct / Step-Wise Tool Invocation)
The **Executor** drives the execution loop following the ReAct (Reasoning + Acting) paradigm:
1. **Thought**: The model evaluates current plan progress and observations from previous steps.
2. **Action**: The model outputs a structured tool invocation targeting either built-in tools or external MCP servers.
3. **Observation**: The execution engine intercepts the tool call, executes it securely, validates outputs, and feeds observations back into context.
4. **Conclusion**: When all DAG nodes resolve, the Executor synthesizes the final response.

### 2.3 Cognitive Memory Manager (Tri-Tiered Memory Hierarchy)

| Memory Tier | Storage Medium | Characteristics & Lifetime | Retrieval Mechanism |
| :--- | :--- | :--- | :--- |
| **Short-Term Memory** | Redis / In-Memory Ring Buffer | Recent conversation turns within current session (last 10-20 messages). | Sequential array slice ordered by `created_at ASC`. |
| **Episodic Long-Term** | CockroachDB `long_term_memories` | Specific past interactions, debugging sessions, user decisions. | Cosine similarity on 1536-dim vectors + recency decay. |
| **Semantic Long-Term** | CockroachDB + Entity Graph | Generalized domain facts, architecture standards, codebase rules. | Hybrid vector search + Knowledge Graph triplet lookups. |
| **Procedural Memory** | CockroachDB `procedural_memories` | Reusable task workflows, bash script patterns, step-by-step SOPs. | Tag matching + vector embedding match on task description. |

---

## 3. Distributed Vector Search & Mathematical Retrieval in CockroachDB

MemOS leverages native vector search in **CockroachDB**:
```sql
-- CockroachDB Hybrid Dynamic Scoring Vector Query
SELECT 
    id,
    agent_id,
    memory_type,
    content,
    importance_score,
    access_count,
    last_accessed_at,
    created_at,
    (1 - (embedding <=> $1::VECTOR)) AS vector_similarity,
    EXP(-$2 * (EXTRACT(EPOCH FROM (NOW() - last_accessed_at)) / 86400.0)) AS recency_decay,
    (
        ($3 * (1 - (embedding <=> $1::VECTOR))) +
        ($4 * EXP(-$2 * (EXTRACT(EPOCH FROM (NOW() - last_accessed_at)) / 86400.0))) +
        ($5 * importance_score) +
        ($6 * (LN(1.0 + access_count) / LN(1.0 + $7)))
    ) AS final_score
FROM long_term_memories
WHERE agent_id = $8 AND (memory_type = ANY($9) OR $9 IS NULL)
ORDER BY final_score DESC
LIMIT $10;
```

---

## 4. Model Context Protocol (MCP) & Pluggable Tool Calling

MemOS provides native first-class support for the **Model Context Protocol (MCP)**:
- **MCP Client Subsystem**: Dynamically connects to external MCP tool servers via standard JSON-RPC (stdio and SSE transports).
- **Tool Discovery**: Automatically lists tools, prompts, and resources from connected MCP servers and presents them to the Amazon Bedrock Claude model in standard JSON schema format.
- **Built-in Tools**:
  - `memos_search_memory`: Semantic vector search across episodic and semantic memory.
  - `memos_save_memory`: Persist crucial facts or preferences learned during execution.
  - `memos_query_knowledge_graph`: Traverse entity-relationship triplets for graph-based reasoning.
  - `memos_fetch_document`: Retrieve chunked document context stored in Amazon S3.

---

## 5. Context Window Management & Token Budgeting

To prevent context window overflow while preserving critical long-term memory:
1. **Dynamic Token Budget Allocation**:
   - Total Window Budget: 128,000 tokens (Claude 3.5 Sonnet).
   - System Core Prompt & Agent Persona: 2,000 tokens.
   - Retrieved Long-Term Memory Context: 8,000 tokens.
   - Tool Definitions & MCP Schemas: 4,000 tokens.
   - Active Working History (Short-Term): 16,000 tokens.
   - Reserve for Generation: 8,000 tokens.
2. **Recursive Auto-Summarization**: When short-term history exceeds budget, the worker asynchronously summarizes the oldest turns into a semantic memory block, replacing raw message rows with a single distilled summary context item.

---

## 6. Multi-Agent Communication & Swarm Collaboration

MemOS enables multi-agent collaboration via shared persistent memory:
- **Agent Roles**: Specialized agents (e.g. *ArchitectAgent*, *DatabaseAgent*, *SecurityAuditorAgent*) share the same CockroachDB tenant memory substrate.
- **Inter-Agent Message Bus**: Agents can post tasks and insights to shared project memory, tagging downstream agents for asynchronous handoffs.
- **Conflict Resolution**: When multiple agents write conflicting facts, the Memory Manager tracks provenance, confidence scores, and timestamps to surface discrepancies for human or lead-agent review.

---

## 7. Failure Recovery, Circuit Breakers & Streaming

- **Graceful Retries with Exponential Backoff**: Model API errors (e.g. Bedrock throttling or AWS 429s) are retried with full jitter.
- **Fallback Models**: Automatic fallback from Amazon Bedrock Claude 3.5 Sonnet to OpenAI GPT-4o / Claude 3 Haiku if rate limits are reached.
- **Real-Time Streaming Protocol**: Output tokens are streamed via Server-Sent Events (SSE) and WebSockets with token-level timestamps, execution step markers, and tool call status events.

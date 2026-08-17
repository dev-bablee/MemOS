import { MessageEntity } from "../repositories/session.repository.js";
import { LongTermMemoryEntity } from "../repositories/memory.repository.js";
import { EntityNode, EntityRelationEdge } from "../repositories/knowledge-graph.repository.js";

export interface CompactedContext {
  systemPrompt: string;
  memoryBlock: string;
  knowledgeGraphBlock: string;
  conversationHistory: Array<{ role: string; content: string }>;
  estimatedTokens: number;
}

export class ContextManager {
  private static readonly MAX_HISTORY_MESSAGES = 20;
  private static readonly CHARS_PER_TOKEN = 3.8;

  /**
   * Constructs the structured context payload with budgeting and memory injection.
   */
  static buildContext(params: {
    agentSystemPrompt: string;
    recentMessages: MessageEntity[];
    retrievedMemories: LongTermMemoryEntity[];
    graphData?: { nodes: EntityNode[]; edges: EntityRelationEdge[] };
    maxContextTokens?: number;
  }): CompactedContext {
    // 1. Format Long-Term Memory Injection Block
    let memoryBlock = "";
    if (params.retrievedMemories.length > 0) {
      memoryBlock = "<persistent_cognitive_memories>\n" +
        params.retrievedMemories
          .map(
            (m, i) =>
              `[Memory ${i + 1}] (${m.memory_type} | Importance: ${m.importance_score}): ${m.content}`
          )
          .join("\n") +
        "\n</persistent_cognitive_memories>";
    }

    // 2. Format Knowledge Graph Block
    let knowledgeGraphBlock = "";
    if (params.graphData && params.graphData.nodes.length > 0) {
      const entityStr = params.graphData.nodes
        .slice(0, 15)
        .map((n) => `• ${n.name} (${n.entity_type}): ${JSON.stringify(n.properties)}`)
        .join("\n");

      const relationStr = params.graphData.edges
        .slice(0, 15)
        .map((e) => `• (${e.subject_name || e.subject_id}) --[${e.predicate}]--> (${e.object_name || e.object_id})`)
        .join("\n");

      knowledgeGraphBlock = `<knowledge_graph>\nEntities:\n${entityStr}\n\nRelationships:\n${relationStr}\n</knowledge_graph>`;
    }

    // 3. Compact Working History (Sliding Window)
    const recent = params.recentMessages.slice(-this.MAX_HISTORY_MESSAGES);
    const conversationHistory = recent.map((m) => ({
      role: m.role === "assistant" ? "assistant" : m.role === "user" ? "user" : "user",
      content: m.content,
    }));

    const sysPrompt = params.agentSystemPrompt || "You are an autonomous AI agent.";
    // Estimate total tokens
    const totalChars =
      sysPrompt.length +
      memoryBlock.length +
      knowledgeGraphBlock.length +
      conversationHistory.reduce((acc, m) => acc + (m.content || "").length, 0);

    const estimatedTokens = Math.ceil(totalChars / this.CHARS_PER_TOKEN);

    return {
      systemPrompt: sysPrompt,
      memoryBlock,
      knowledgeGraphBlock,
      conversationHistory,
      estimatedTokens,
    };
  }
}

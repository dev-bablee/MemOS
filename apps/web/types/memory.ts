export type MemoryType = "EPISODIC" | "SEMANTIC" | "PROCEDURAL";

export interface LongTermMemory {
  id: string;
  tenant_id: string;
  agent_id: string | null;
  project_id: string | null;
  session_id: string | null;
  memory_type: MemoryType;
  content: string;
  summary: string | null;
  importance_score: number;
  access_count: number;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MemorySearchResult extends LongTermMemory {
  vector_similarity: number;
  recency_decay: number;
  final_score: number;
}

export interface EntityNode {
  id: string;
  tenant_id: string;
  project_id: string | null;
  name: string;
  entity_type: string;
  properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EntityRelationEdge {
  id: string;
  tenant_id: string;
  subject_id: string;
  predicate: string;
  object_id: string;
  weight: number;
  subject_name?: string;
  object_name?: string;
  created_at: string;
}

export interface KnowledgeGraphData {
  nodes: EntityNode[];
  edges: EntityRelationEdge[];
}

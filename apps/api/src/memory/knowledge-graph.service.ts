import { KnowledgeGraphRepository, EntityNode, EntityRelationEdge } from "../repositories/knowledge-graph.repository.js";
import { AppError } from "../middleware/error-handler.js";

export class KnowledgeGraphService {
  static async getGraph(tenantId: string, projectId?: string, limit = 100): Promise<{
    nodes: EntityNode[];
    edges: EntityRelationEdge[];
  }> {
    return KnowledgeGraphRepository.queryGraph(tenantId, projectId, limit);
  }

  static async addEntity(data: {
    tenantId: string;
    projectId?: string | null;
    name: string;
    entityType?: string;
    properties?: Record<string, any>;
  }): Promise<EntityNode> {
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError("Entity name is required", 400, "INVALID_ENTITY_NAME");
    }
    return KnowledgeGraphRepository.upsertEntity({
      tenant_id: data.tenantId,
      project_id: data.projectId,
      name: data.name.trim(),
      entity_type: data.entityType,
      properties: data.properties,
    });
  }

  static async addRelation(data: {
    tenantId: string;
    subjectId: string;
    predicate: string;
    objectId: string;
    weight?: number;
  }): Promise<EntityRelationEdge> {
    return KnowledgeGraphRepository.createRelation({
      tenant_id: data.tenantId,
      subject_id: data.subjectId,
      predicate: data.predicate,
      object_id: data.objectId,
      weight: data.weight,
    });
  }
}

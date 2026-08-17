import { query } from "../db/connection.js";

export interface EntityNode {
  id: string;
  tenant_id: string;
  project_id: string | null;
  name: string;
  entity_type: string;
  properties: Record<string, any>;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
}

export class KnowledgeGraphRepository {
  static async upsertEntity(data: {
    tenant_id: string;
    project_id?: string | null;
    name: string;
    entity_type?: string;
    properties?: Record<string, any>;
  }): Promise<EntityNode> {
    const res = await query<EntityNode>(
      `INSERT INTO entities (tenant_id, project_id, name, entity_type, properties)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (tenant_id, name, entity_type)
       DO UPDATE SET 
         properties = entities.properties || EXCLUDED.properties,
         updated_at = NOW()
       RETURNING *`,
      [
        data.tenant_id,
        data.project_id || null,
        data.name.trim(),
        data.entity_type || "CONCEPT",
        JSON.stringify(data.properties || {}),
      ]
    );
    return res.rows[0];
  }

  static async createRelation(data: {
    tenant_id: string;
    subject_id: string;
    predicate: string;
    object_id: string;
    weight?: number;
  }): Promise<EntityRelationEdge> {
    const res = await query<EntityRelationEdge>(
      `INSERT INTO entity_relations (tenant_id, subject_id, predicate, object_id, weight)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.tenant_id, data.subject_id, data.predicate.toUpperCase().trim(), data.object_id, data.weight ?? 1.0]
    );
    return res.rows[0];
  }

  static async queryGraph(
    tenantId: string,
    projectId?: string,
    limit = 100
  ): Promise<{ nodes: EntityNode[]; edges: EntityRelationEdge[] }> {
    let nodeSql = `SELECT * FROM entities WHERE tenant_id = $1`;
    const params: any[] = [tenantId];

    if (projectId) {
      nodeSql += ` AND (project_id = $2 OR project_id IS NULL)`;
      params.push(projectId);
    }
    nodeSql += ` ORDER BY updated_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const nodesRes = await query<EntityNode>(nodeSql, params);
    const nodes = nodesRes.rows;

    if (nodes.length === 0) {
      return { nodes: [], edges: [] };
    }

    const nodeIds = nodes.map((n) => n.id);
    const edgesRes = await query<EntityRelationEdge>(
      `SELECT r.*, s.name as subject_name, o.name as object_name
       FROM entity_relations r
       JOIN entities s ON r.subject_id = s.id
       JOIN entities o ON r.object_id = o.id
       WHERE r.tenant_id = $1 AND (r.subject_id = ANY($2) OR r.object_id = ANY($2))
       LIMIT 200`,
      [tenantId, nodeIds]
    );

    return {
      nodes,
      edges: edgesRes.rows,
    };
  }
}

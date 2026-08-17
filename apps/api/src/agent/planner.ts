export interface PlanStep {
  id: number;
  title: string;
  tool: string;
  input: Record<string, any>;
  dependsOn: number[];
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  result?: any;
}

export interface ExecutionPlan {
  goal: string;
  steps: PlanStep[];
  status: "PLANNED" | "EXECUTING" | "COMPLETED" | "FAILED";
}

export class Planner {
  /**
   * Decomposes a natural language goal into a Directed Acyclic Graph (DAG) of executable subtasks.
   */
  static generatePlan(goal: string): ExecutionPlan {
    const lower = goal.toLowerCase();

    // Intelligent heuristic planner decomposition
    const steps: PlanStep[] = [];

    // Step 1: Memory & Context Search
    steps.push({
      id: 1,
      title: "Query CockroachDB Persistent Memory for Context",
      tool: "search_memory",
      input: { query: goal, limit: 5 },
      dependsOn: [],
      status: "PENDING",
    });

    // Step 2: Knowledge Graph Traversal (if mentions system or entities)
    if (lower.includes("cockroach") || lower.includes("aws") || lower.includes("architect") || lower.includes("decision")) {
      steps.push({
        id: 2,
        title: "Traverse Knowledge Graph for Entity Relationships",
        tool: "knowledge_graph",
        input: { limit: 20 },
        dependsOn: [],
        status: "PENDING",
      });
    }

    // Step 3: Calculation step if mathematical query
    if (/[0-9]+\s*[\+\-\*\/]\s*[0-9]+/.test(goal)) {
      steps.push({
        id: 3,
        title: "Evaluate Mathematical Expression",
        tool: "calculator",
        input: { expression: goal.match(/[0-9+\-*/().\s]+/)?.[0] || "0" },
        dependsOn: [],
        status: "PENDING",
      });
    }

    return {
      goal,
      steps,
      status: "PLANNED",
    };
  }
}

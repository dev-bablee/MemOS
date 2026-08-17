import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organizationName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createApiKeySchema = z.object({
  name: z.string().min(2, "API Key name is required"),
  scopes: z.array(z.string()).optional(),
  expiresInDays: z.number().int().positive().optional(),
});

export const createAgentSchema = z.object({
  name: z.string().min(2, "Agent name is required"),
  description: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
  model: z.string().optional(),
  systemPrompt: z.string().min(5, "System prompt is required"),
  memoryConfig: z.record(z.any()).optional(),
  tools: z.array(z.string()).optional(),
});

export const updateAgentSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().min(5).optional(),
  memoryConfig: z.record(z.any()).optional(),
  tools: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const agentChatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  sessionId: z.string().uuid().optional(),
  stream: z.boolean().optional(),
});

export const planGoalSchema = z.object({
  goal: z.string().min(3, "Goal must be at least 3 characters"),
});

export const ingestMemorySchema = z.object({
  content: z.string().min(1, "Memory content cannot be empty"),
  memoryType: z.enum(["EPISODIC", "SEMANTIC", "PROCEDURAL"]).optional(),
  agentId: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  sessionId: z.string().uuid().optional().nullable(),
  summary: z.string().optional(),
  importanceScore: z.number().min(0.0).max(1.0).optional(),
  metadata: z.record(z.any()).optional(),
});

export const searchMemorySchema = z.object({
  query: z.string().min(1, "Search query is required"),
  agentId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  memoryTypes: z.array(z.enum(["EPISODIC", "SEMANTIC", "PROCEDURAL"])).optional(),
  limit: z.number().int().positive().max(50).optional(),
  minScore: z.number().min(0.0).max(1.0).optional(),
  weights: z
    .object({
      vector: z.number().optional(),
      recency: z.number().optional(),
      importance: z.number().optional(),
      frequency: z.number().optional(),
      halfLifeDays: z.number().optional(),
    })
    .optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

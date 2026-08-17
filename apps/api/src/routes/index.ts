import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AgentController } from "../controllers/agent.controller.js";
import { MemoryController } from "../controllers/memory.controller.js";
import { ProjectController } from "../controllers/project.controller.js";
import { SearchController } from "../controllers/search.controller.js";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { rateLimiter } from "../middleware/rate-limiter.js";
import {
  signupSchema,
  loginSchema,
  createApiKeySchema,
  createAgentSchema,
  updateAgentSchema,
  agentChatSchema,
  planGoalSchema,
  ingestMemorySchema,
  searchMemorySchema,
  createProjectSchema,
} from "../validation/schemas.js";

const router = Router();

// Health Check
router.get("/health", DashboardController.healthCheck);

// ==========================================
// 1. Auth & API Key Routes
// ==========================================
router.post("/auth/signup", validate({ body: signupSchema }), AuthController.signup);
router.post("/auth/login", validate({ body: loginSchema }), AuthController.login);
router.get("/auth/me", authenticate, AuthController.getMe);
router.get("/api-keys", authenticate, AuthController.listApiKeys);
router.post("/api-keys", authenticate, validate({ body: createApiKeySchema }), AuthController.createApiKey);
router.delete("/api-keys/:id", authenticate, AuthController.deleteApiKey);

// ==========================================
// 2. Agents Routes
// ==========================================
router.get("/agents", authenticate, AgentController.listAgents);
router.post("/agents", authenticate, validate({ body: createAgentSchema }), AgentController.createAgent);
router.get("/agents/:id", authenticate, AgentController.getAgent);
router.patch("/agents/:id", authenticate, validate({ body: updateAgentSchema }), AgentController.updateAgent);
router.delete("/agents/:id", authenticate, AgentController.deleteAgent);
router.post("/agents/plan", authenticate, validate({ body: planGoalSchema }), AgentController.planGoal);
router.post(
  "/agents/:id/chat",
  rateLimiter({ capacity: 60, refillRatePerSec: 5 }),
  authenticate,
  validate({ body: agentChatSchema }),
  AgentController.chat
);

// ==========================================
// 3. Memory Engine Routes
// ==========================================
router.get("/memories", authenticate, MemoryController.listMemories);
router.post("/memories", authenticate, validate({ body: ingestMemorySchema }), MemoryController.ingestMemory);
router.post("/memories/search", authenticate, validate({ body: searchMemorySchema }), MemoryController.searchMemories);
router.get("/memories/:id", authenticate, MemoryController.getMemory);
router.delete("/memories/:id", authenticate, MemoryController.deleteMemory);

// ==========================================
// 4. Projects & Workspaces
// ==========================================
router.get("/projects", authenticate, ProjectController.listProjects);
router.post("/projects", authenticate, validate({ body: createProjectSchema }), ProjectController.createProject);
router.get("/projects/:id", authenticate, ProjectController.getProject);
router.patch("/projects/:id", authenticate, ProjectController.updateProject);
router.delete("/projects/:id", authenticate, ProjectController.deleteProject);

// ==========================================
// 5. Search & Knowledge Graph
// ==========================================
router.get("/search", authenticate, SearchController.universalSearch);
router.get("/graph", authenticate, SearchController.getKnowledgeGraph);

// ==========================================
// 6. Analytics & Dashboard Metrics
// ==========================================
router.get("/dashboard/metrics", authenticate, DashboardController.getMetrics);

export { router as apiRouter };

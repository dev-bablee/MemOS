import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AgentService } from "../services/agent.service.js";
import { AgentExecutor } from "../agent/executor.js";

export function initializeWebSocket(io: SocketIOServer): void {
  // Authentication middleware for WebSockets
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      // Allow connection but mark unauthenticated
      (socket as any).tenantId = "public-demo";
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      (socket as any).userId = decoded.userId;
      (socket as any).tenantId = decoded.tenantId;
      next();
    } catch (err) {
      logger.warn("WebSocket authentication failed", { error: (err as any).message });
      (socket as any).tenantId = "public-demo";
      next();
    }
  });

  io.on("connection", (socket: Socket) => {
    const tenantId = (socket as any).tenantId;
    logger.info(`WebSocket client connected: ${socket.id} (Tenant: ${tenantId})`);

    // Join tenant channel
    socket.join(`tenant:${tenantId}`);

    // Real-Time Agent Chat Event
    socket.on("agent:chat", async (data: { agentId: string; sessionId?: string; message: string }) => {
      try {
        const agent = await AgentService.getAgent(data.agentId, tenantId);

        socket.emit("agent:start", { agentId: data.agentId, sessionId: data.sessionId });

        const result = await AgentExecutor.execute({
          tenantId,
          agentId: data.agentId,
          sessionId: data.sessionId,
          userPrompt: data.message,
          systemPrompt: agent.system_prompt,
          tools: agent.tools,
          onToken: (token: string) => {
            socket.emit("agent:token", { token });
          },
        });

        socket.emit("agent:done", {
          sessionId: result.sessionId,
          response: result.response,
          retrievedMemories: result.retrievedMemories,
          tokensUsed: result.tokensUsed,
        });
      } catch (err: any) {
        logger.error("WebSocket agent chat error", { error: err.message });
        socket.emit("agent:error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });
}

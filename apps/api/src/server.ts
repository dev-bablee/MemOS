import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { pool } from "./db/connection.js";
import { initializeWebSocket } from "./websocket/socket-handler.js";

const app = createApp();
const server = http.createServer(app);

// Initialize WebSocket Gateway
const io = new SocketIOServer(server, {
  cors: {
    origin: [env.CORS_ORIGIN, "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

initializeWebSocket(io);

// Start HTTP Server
server.listen(env.PORT, () => {
  logger.info(`🚀 MemOS Backend API running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`🔗 REST Gateway: http://localhost:${env.PORT}/api/v1`);
  logger.info(`⚡ WebSocket Gateway active on ws://localhost:${env.PORT}`);
  logger.info(`🪲 Health Check: http://localhost:${env.PORT}/api/v1/health`);
});

// Graceful Shutdown Handler
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info("HTTP & WebSocket server closed.");
    try {
      await pool.end();
      logger.info("CockroachDB connection pool closed.");
    } catch (err: any) {
      logger.error("Error closing CockroachDB pool:", err);
    }
    process.exit(0);
  });

  // Force close if graceful shutdown hangs
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

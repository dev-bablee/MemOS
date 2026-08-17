import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { correlationIdMiddleware } from "./middleware/correlation-id.js";
import { errorHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Allow Next.js frontend embedded requests
  }));

  // CORS Configuration
  app.use(cors({
    origin: env.CORS_ORIGIN === "*" ? true : [env.CORS_ORIGIN, "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-correlation-id", "X-Requested-With"],
  }));

  // Body Parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Tracing Middleware
  app.use(correlationIdMiddleware);

  // Request Logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`, {
        correlationId: req.headers["x-correlation-id"],
        ip: req.ip,
        statusCode: res.statusCode,
      });
    });
    next();
  });

  // Mount API Routes
  app.use("/api/v1", apiRouter);
  app.use("/api", apiRouter);

  // Root Welcome Endpoint
  app.get("/", (req: Request, res: Response) => {
    res.json({
      name: "MemOS API",
      description: "Persistent Memory Platform & Operating System for AI Agents",
      documentation: "/docs",
      version: "0.1.0",
      status: "ONLINE",
    });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}

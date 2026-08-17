import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: any) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId = (req.headers["x-correlation-id"] as string) || "unknown";

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    logger.warn("Validation error on request", {
      correlationId,
      path: req.path,
      errors: err.errors,
    });
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload or parameters",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        correlationId,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle Custom Domain AppErrors
  if (err instanceof AppError) {
    logger.warn("Application domain error", {
      correlationId,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        correlationId,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Unhandled / Internal Server Errors
  logger.error("Unhandled internal server error", {
    correlationId,
    path: req.path,
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: env.NODE_ENV === "production"
        ? "An internal server error occurred. Please contact support."
        : err.message,
      correlationId,
      timestamp: new Date().toISOString(),
    },
  });
}

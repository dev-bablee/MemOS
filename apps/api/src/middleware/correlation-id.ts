import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers["x-correlation-id"] as string) || `req_${uuidv4().replace(/-/g, "").slice(0, 12)}`;
  req.headers["x-correlation-id"] = correlationId;
  res.setHeader("x-correlation-id", correlationId);
  next();
}

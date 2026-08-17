import { Request, Response, NextFunction } from "express";

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, RateLimitBucket>();

interface RateLimiterOptions {
  capacity?: number;
  refillRatePerSec?: number;
}

/**
 * Token bucket rate limiter middleware.
 */
export function rateLimiter(options: RateLimiterOptions = {}) {
  const capacity = options.capacity || 100; // max burst tokens
  const refillRate = options.refillRatePerSec || 10; // refill 10 tokens/sec

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.headers["x-forwarded-for"]?.toString() || "default";
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: capacity, lastRefill: now };
      buckets.set(key, bucket);
    } else {
      // Calculate token refill
      const elapsedSec = (now - bucket.lastRefill) / 1000;
      bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSec * refillRate);
      bucket.lastRefill = now;
    }

    if (bucket.tokens < 1) {
      res.setHeader("Retry-After", "1");
      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please slow down and try again.",
          correlationId: req.headers["x-correlation-id"],
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    bucket.tokens -= 1;
    res.setHeader("X-RateLimit-Limit", capacity);
    res.setHeader("X-RateLimit-Remaining", Math.floor(bucket.tokens));
    next();
  };
}

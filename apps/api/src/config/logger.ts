import winston from "winston";
import { env } from "./env.js";

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack, correlationId, ...meta }) => {
  const cid = correlationId ? ` [${correlationId}]` : "";
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}]${cid} ${level}: ${stack || message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true })
  ),
  defaultMeta: { service: "memos-api" },
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === "production"
        ? json()
        : combine(colorize({ all: true }), consoleFormat),
    }),
  ],
});

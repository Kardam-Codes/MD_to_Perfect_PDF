import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { ALLOWED_ORIGINS, RATE_LIMIT } from "../config.js";

export function applySecurityMiddleware(app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "data:", "https:"]
        }
      }
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const allowed = ALLOWED_ORIGINS.some((candidate) => {
          if (candidate.endsWith("*")) {
            return origin.startsWith(candidate.slice(0, -1));
          }
          return origin === candidate;
        });

        if (allowed) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      maxAge: 86400
    })
  );

  const limiter = rateLimit({
    windowMs: RATE_LIMIT.windowMs,
    max: RATE_LIMIT.max,
    message: {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      const isDevelopment = process.env.NODE_ENV !== "production";
      const isLocalhost = req.ip === "127.0.0.1" || req.ip === "::1";
      return isDevelopment && isLocalhost;
    }
  });

  app.use("/export", limiter);
  app.use(express.json({ limit: "50mb" }));

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
  });
}

import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

export const globalLimitter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const retryAfter = req.rateLimit?.resetTime ?? null;
    res.status(429).json({
      error: " Too many requests",
      message:
        " Too many requests from this IP, please try again after 15 minutes",
      retryAfter,
    });
  },
});

export const authLimitter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skipSuccessfulRequests: false,
  message: {
    error:
      "Too many authentication requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const retryAfter = req.rateLimit?.resetTime ?? null;
    res.status(429).json({
      error: " Too many authentication requests",
      message:
        " Too many authentication requests from this IP, please try again after 15 minutes",
      retryAfter,
    });
  },
});

export const apiLimitter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500,
  message: {
    error: "Too many requests from this IP, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const userId = req.user?._id?.toString();
    return userId ?? req.ip ?? "unknown";
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = req.rateLimit?.resetTime ?? null;
    res.status(429).json({
      error: " Too many requests",
      message:
        " Too many requests from this IP, please try again after a minute",
      retryAfter,
    });
  },
});

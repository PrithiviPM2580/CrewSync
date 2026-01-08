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

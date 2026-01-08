import { UserDocument } from "@/models/user.model.ts";
import type { RateLimitInfo } from "express-rate-limit";

declare global {
  namespace Express {
    interface User extends UserDocument {}
    interface Request {
      rateLimit?: RateLimitInfo;
    }
  }
}

export {};

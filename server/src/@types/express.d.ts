import type { UserDocument } from "@/models/user.model.js";
import type { RateLimitInfo } from "express-rate-limit";

declare global {
  namespace Express {
    interface User extends UserDocument {}
    interface Request {
      user?: UserDocument;
      rateLimit?: RateLimitInfo;
    }
  }
}

export {};

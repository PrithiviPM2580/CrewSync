import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import type { NextFunction, Request, Response } from "express";

export async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    if (!req.user || !req.user?._id) {
      logger.error("Unauthorized access attempt.", {
        label: "isAuthenticatedMiddleware",
      });
      return next(new APIError(401, "Unauthorized, please log in."));
    }
    next();
  } catch (error) {
    logger.error("Error in authentication middleware:", error);
    next(error);
  }
}

import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import { currentUserService } from "@/services/user.service.js";

export async function currentUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;

  if (!userId) {
    logger.warn("No authenticated user found in request", {
      label: "CurrentUserController",
    });
    return next(new APIError(401, "Unauthorized", true));
  }

  const { user } = await currentUserService(userId);

  logger.info(`Fetched current user data for user ID: ${userId}`, {
    label: "CurrentUserController",
  });

  successResponse(res, 200, "Current user fetched successfully", { user });
}

import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";
import { registerSchema } from "@/validator/auth.validator.js";
import type { Request, Response, NextFunction } from "express";
import { registerService } from "@/services/auth.service.js";
import { successResponse } from "@/utils/index.util.js";

export async function googleCallbackController(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const currentWorkspace = req.user?.currentWorkspace;

  if (!currentWorkspace) {
    logger.error(
      "No current workspace found for user during Google OAuth callback"
    );
    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
    );
  }

  return res.redirect(
    `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
  );
}

export async function registerController(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const body = registerSchema.parse(req.body);

  const { userId, workspaceId } = await registerService(body);

  logger.info(`User registered with ID: ${userId}`, {
    label: "AuthController",
  });

  successResponse(res, 201, "User registered successfully", {
    userId,
    workspaceId,
  });
}

import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";
import { type RegisterType } from "@/validator/auth.validator.js";
import type { Request, Response, NextFunction } from "express";
import { registerService } from "@/services/auth.service.js";
import { successResponse } from "@/utils/index.util.js";
import passport from "passport";
import { APIError } from "@/lib/error-handler.lib.js";

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
  const body: RegisterType = req.body;
  const { userId, workspaceId } = await registerService(body);

  logger.info(`User registered with ID: ${userId}`, {
    label: "AuthController",
  });

  successResponse(res, 201, "User registered successfully", {
    userId,
    workspaceId,
  });
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: Express.User | false,
      info: { message: string } | undefined
    ) => {
      if (err) {
        logger.error(`Login error: ${err.message}`, {
          label: "AuthController",
        });
        return next(err);
      }

      if (!user) {
        logger.warn(`Login failed: ${info?.message}`, {
          label: "AuthController",
        });
        throw new APIError(401, info?.message || "Authentication failed", true);
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        successResponse(res, 200, "Login successful", {
          userId: user._id,
          currentWorkspace: user.currentWorkspace,
        });
      });
    }
  )(req, res, next);
}

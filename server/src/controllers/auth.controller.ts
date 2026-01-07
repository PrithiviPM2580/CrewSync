import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";
import type { Request, Response, NextFunction } from "express";

export async function googleCallbackController(
  req: Request,
  res: Response,
  next: NextFunction
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

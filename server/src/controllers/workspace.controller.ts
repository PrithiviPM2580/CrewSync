import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import { createWorkspaceService } from "@/services/workspace.service.js";

export async function createWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;

  if (!userId) {
    logger.error("Unauthorized access attempt to create workspace", {
      label: "WorkspaceController",
    });
    return next(new APIError(401, "Unauthorized, user not authenticated"));
  }

  const { workspace } = await createWorkspaceService(userId, req.body);

  logger.info(`Workspace created successfully for user ${userId}`, {
    label: "WorkspaceController",
  });

  successResponse(res, 201, "Workspace created successfully", {
    workspace,
  });
}

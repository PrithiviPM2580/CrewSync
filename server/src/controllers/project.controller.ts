import { PermissionEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { getMemberRoleInWorkspace } from "@/services/member.service.js";
import { roleGuard, successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import { createProjectService } from "@/services/project.service.js";

export async function createProjectController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
  const workspaceId = req.params.workspaceId!;
  const userId = req.user?._id;

  if (!userId) {
    logger.error(`Unauthorized access to create project`, {
      label: "ProjectController",
    });
    return next(new APIError(401, "Unauthorized"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.CREATE_PROJECT]);

  const { project } = await createProjectService(userId, workspaceId, body);

  logger.info(`Project created successfully in workspace ${workspaceId}`, {
    label: "ProjectController",
  });

  successResponse(res, 201, "Project created successfully", {
    project,
  });
}

import { PermissionEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { getMemberRoleInWorkspace } from "@/services/member.service.js";
import { roleGuard, successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import {
  createProjectService,
  getAllProjectsService,
  getProjectByIdAndWorkspaceIdService,
  getProjectAnalyticsService,
} from "@/services/project.service.js";

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

export async function getAllprojectsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const workspaceId = req.params.workspaceId!;
  const userId = req.user?._id;

  if (!userId) {
    logger.error(`Unauthorized access to get all projects`, {
      label: "ProjectController",
    });
    return next(new APIError(401, "Unauthorized"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const pageSize = req.query.pageSize ?? 10;
  const pageNumber = req.query.pageNumber ?? 1;

  const { projects, totalCount, totalPages, skip } =
    await getAllProjectsService(
      workspaceId,
      Number(pageSize),
      Number(pageNumber)
    );

  logger.info(`Fetched all projects in workspace ${workspaceId}`, {
    label: "ProjectController",
  });

  successResponse(res, 200, "Projects fetched successfully", {
    projects,
    pagination: {
      totalCount,
      totalPages,
      pageSize: Number(pageSize),
      pageNumber: Number(pageNumber),
      skip,
      limit: Number(pageSize),
    },
  });
}

export async function getProjectByIdAndWorkspaceIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const projectId = req.params.id!;
  const workspaceId = req.params.workspaceId!;
  const userId = req.user?._id;

  if (!userId) {
    logger.error(`Unauthorized access to get project by id`, {
      label: "ProjectController",
    });
    return next(new APIError(401, "Unauthorized"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const { project } = await getProjectByIdAndWorkspaceIdService(
    projectId,
    workspaceId
  );

  logger.info(`Fetched project ${projectId} in workspace ${workspaceId}`, {
    label: "ProjectController",
  });

  successResponse(res, 200, "Project fetched successfully", {
    project,
  });
}

export async function getProjectAnalyticsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const projectId = req.params.id!;
  const workspaceId = req.params.workspaceId!;
  const userId = req.user?._id;

  if (!userId) {
    logger.error(`Unauthorized access to get project analytics`, {
      label: "ProjectController",
    });
    return next(new APIError(401, "Unauthorized"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const { analytics } = await getProjectAnalyticsService(
    projectId,
    workspaceId
  );

  logger.info(
    `Fetched analytics for project ${projectId} in workspace ${workspaceId}`,
    {
      label: "ProjectController",
    }
  );

  successResponse(res, 200, "Project analytics fetched successfully", {
    analytics,
  });
}

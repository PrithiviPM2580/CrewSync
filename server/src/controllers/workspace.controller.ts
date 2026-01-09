import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { successResponse, roleGuard } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import type {
  ChangeRoleBodyType,
  ChangeRoleParamsType,
} from "@/validator/workspace.validator.js";
import {
  createWorkspaceService,
  getAllWorkspacesUserIsMember,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
  getWorkspaceAnalyticsService,
  changeWorkspaceMemberRoleService,
} from "@/services/workspace.service.js";
import { getMemberRoleInWorkspace } from "@/services/member.service.js";
import { PermissionEnum } from "@/enums/index.enum.js";

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

export async function getAllWorkspacesUserIsMemberController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;

  if (!userId) {
    logger.error("Unauthorized access attempt to get workspaces", {
      label: "WorkspaceController",
    });
    return next(new APIError(401, "Unauthorized, user not authenticated"));
  }

  const { workspace } = await getAllWorkspacesUserIsMember(userId);

  logger.info(`Fetched all workspaces for user ${userId}`, {
    label: "WorkspaceController",
  });

  successResponse(res, 200, "Workspaces fetched successfully", {
    workspace,
  });
}

export async function getWorkspaceByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;
  const workspaceId = req.params.id!;

  if (!userId) {
    logger.error("Unauthorized access attempt to get workspace by ID", {
      label: "WorkspaceController",
    });
    return next(new APIError(401, "Unauthorized, user not authenticated"));
  }

  await getMemberRoleInWorkspace(userId, workspaceId);

  const { workspace } = await getWorkspaceByIdService(workspaceId);

  logger.info(`Fetched workspace with ID ${workspaceId} for user ${userId}`, {
    label: "WorkspaceController",
  });

  successResponse(res, 200, "Workspace fetched successfully", {
    workspace,
  });
}

export async function getWorkspaceMembersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;
  const workspaceId = req.params.id!;

  if (!userId) {
    logger.error("Unauthorized access attempt to get workspace members", {
      label: "WorkspaceController",
    });
    return next(new APIError(401, "Unauthorized, user not authenticated"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const { members, roles } = await getWorkspaceMembersService(workspaceId);

  logger.info(`Fetched members for workspace with ID ${workspaceId}`, {
    label: "WorkspaceController",
  });

  successResponse(res, 200, "Workspace members fetched successfully", {
    members,
    roles,
  });
}

export async function getWorkspaceAnalyticsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;
  const workspaceId = req.params.id!;

  if (!userId) {
    logger.error("Unauthorized access attempt to get workspace members", {
      label: "WorkspaceController",
    });
    return next(new APIError(401, "Unauthorized, user not authenticated"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

  logger.info(
    `Fetched analytics for workspace with ID ${workspaceId}, ${JSON.stringify(
      analytics
    )}`,
    {
      label: "WorkspaceController",
    }
  );

  successResponse(res, 200, "Workspace analytics fetched successfully", {
    analytics,
  });
}

export async function changeWorkspaceMemberRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;
  const { id: workspaceId } = req.params;
  const { memberId, roleId } = req.body;

  if (!userId) {
    logger.error("Unauthorized access attempt to change member role", {
      label: "WorkspaceController",
    });
    return next(new APIError(401, "Unauthorized, user not authenticated"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

  roleGuard(role, [PermissionEnum.CHANGE_MEMBER_ROLE]);

  const { member } = await changeWorkspaceMemberRoleService(
    workspaceId,
    memberId,
    roleId
  );

  logger.info(
    `Changed role for member ${memberId} in workspace ${workspaceId}`,
    { label: "WorkspaceController" }
  );

  successResponse(res, 200, "Member role changed successfully", {
    member,
  });
}

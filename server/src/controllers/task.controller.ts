import { PermissionEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { getMemberRoleInWorkspace } from "@/services/member.service.js";
import { roleGuard, successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import {
  createTaskService,
  updateTaskService,
} from "@/services/task.service.js";

export async function createTaskController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
  const projectId = req.params.projectId!;
  const workspaceId = req.params.workspaceId!;

  const userId = req.user?._id;

  if (!userId) {
    logger.error("User not authenticated", {
      label: "CreateTaskController",
    });

    return next(new APIError(401, "User not authenticated"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.CREATE_TASK]);

  const { task } = await createTaskService(
    workspaceId,
    projectId,
    userId,
    body
  );

  logger.info("Task created successfully", {
    label: "CreateTaskController",
    taskId: task._id,
    workspaceId,
    projectId,
    userId,
  });

  successResponse(res, 201, "Task created successfully", { task });
}

export async function updateTaskController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
  const projectId = req.params.projectId!;
  const workspaceId = req.params.workspaceId!;
  const taskId = req.params.id!;

  const userId = req.user?._id;

  if (!userId) {
    logger.error("User not authenticated", {
      label: "UpdateTaskController",
    });

    return next(new APIError(401, "User not authenticated"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.EDIT_TASK]);

  const { updatedTask } = await updateTaskService(
    workspaceId,
    projectId,
    taskId,
    body
  );

  logger.info("Task updated successfully", {
    label: "UpdateTaskController",
    taskId: updatedTask._id,
    workspaceId,
    projectId,
    userId,
  });

  successResponse(res, 200, "Task updated successfully", { updatedTask });
}

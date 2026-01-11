import { PermissionEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import { getMemberRoleInWorkspace } from "@/services/member.service.js";
import { roleGuard, successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import {
  createTaskService,
  updateTaskService,
  getAllTaskService,
  getTaskByIdService,
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

export async function getAllTasksController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;

  const workspaceId = req.params.workspaceId!;

  if (!userId) {
    logger.error("User not authenticated", {
      label: "GetAllTasksController",
    });

    return next(new APIError(401, "User not authenticated"));
  }

  const filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  } = {};

  if (req.query.projectId) {
    filters.projectId = req.query.projectId as string;
  }
  if (req.query.status) {
    filters.status = (req.query.status as string).split(",");
  }
  if (req.query.priority) {
    filters.priority = (req.query.priority as string).split(",");
  }
  if (req.query.assignedTo) {
    filters.assignedTo = (req.query.assignedTo as string).split(",");
  }
  if (req.query.keyword) {
    filters.keyword = req.query.keyword as string;
  }
  if (req.query.dueDate) {
    filters.dueDate = req.query.dueDate as string;
  }

  const pagination = {
    pageSize: parseInt(req.query.pageSize as string) || 10,
    pageNumber: parseInt(req.query.pageNumber as string) || 1,
  };

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const result = await getAllTaskService(workspaceId, filters, pagination);

  logger.info("Fetched all tasks successfully", {
    label: "GetAllTasksController",
    workspaceId,
    userId,
  });

  successResponse(res, 200, "Fetched all tasks successfully", result);
}

export async function getTaskByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?._id;

  const workspaceId = req.params.workspaceId!;
  const projectId = req.params.projectId!;
  const taskId = req.params.id!;

  if (!userId) {
    logger.error("User not authenticated", {
      label: "GetTaskByIdController",
    });

    return next(new APIError(401, "User not authenticated"));
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [PermissionEnum.VIEW_ONLY]);

  const task = await getTaskByIdService(workspaceId, projectId, taskId);

  logger.info("Fetched task by ID successfully", {
    label: "GetTaskByIdController",
    taskId,
    workspaceId,
    projectId,
    userId,
  });

  successResponse(res, 200, "Fetched task by ID successfully", { task });
}

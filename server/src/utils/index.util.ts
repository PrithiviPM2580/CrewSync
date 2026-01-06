import type { Response } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  PermissionEnum,
  type PermissionEnumType,
  type RoleEnumType,
} from "@/enums/index.enum.js";

export function formattedIssues(issues: z.ZodError["issues"]) {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export function successResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data: data ?? null,
  });
}

export function generateInviteCode(): string {
  return uuidv4().replace(/-/g, "").substring(0, 8);
}

export function generateTaskCode(): string {
  return `task-${uuidv4().replace(/-/g, "").substring(0, 3)}`;
}

export const RolePermissions: Record<
  RoleEnumType,
  Array<PermissionEnumType>
> = {
  OWNER: [
    PermissionEnum.CREATE_WORKSPACE,
    PermissionEnum.EDIT_WORKSPACE,
    PermissionEnum.DELETE_WORKSPACE,
    PermissionEnum.MANAGE_WORKSPACE_SETTINGS,
    PermissionEnum.ADD_MEMBER,
    PermissionEnum.CHANGE_MEMBER_ROLE,
    PermissionEnum.REMOVE_MEMBER,
    PermissionEnum.CREATE_PROJECT,
    PermissionEnum.EDIT_PROJECT,
    PermissionEnum.DELETE_PROJECT,
    PermissionEnum.CREATE_TASK,
    PermissionEnum.EDIT_TASK,
    PermissionEnum.DELETE_TASK,
    PermissionEnum.VIEW_ONLY,
  ],
  ADMIN: [
    PermissionEnum.ADD_MEMBER,
    PermissionEnum.CREATE_PROJECT,
    PermissionEnum.EDIT_PROJECT,
    PermissionEnum.DELETE_PROJECT,
    PermissionEnum.CREATE_TASK,
    PermissionEnum.EDIT_TASK,
    PermissionEnum.DELETE_TASK,
    PermissionEnum.VIEW_ONLY,
    PermissionEnum.MANAGE_WORKSPACE_SETTINGS,
  ],
  MEMBER: [
    PermissionEnum.CREATE_TASK,
    PermissionEnum.EDIT_TASK,
    PermissionEnum.VIEW_ONLY,
  ],
};

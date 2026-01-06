import type { Response } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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

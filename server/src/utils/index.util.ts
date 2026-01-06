import type { Response } from "express";
import { z } from "zod";

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

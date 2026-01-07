import { z } from "zod";

export function formattedIssues(issues: z.ZodError["issues"]) {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

import { formattedIssues } from "@/utils/index.util.js";
import { z } from "zod";
import { APIError } from "./error-handler.lib.js";

export default function validateSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): T {
  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    const issues = formattedIssues(parsedData.error.issues);
    throw new APIError(400, "Validation Error", true, { details: issues });
  }

  return parsedData.data;
}

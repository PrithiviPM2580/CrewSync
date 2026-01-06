import { formattedIssues } from "@/utils/index.util.js";
import { z } from "zod";

export default function validateSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): T {
  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    const issues = formattedIssues(parsedData.error.issues);
    throw new Error(`Validation Error: ${issues}`);
  }

  return parsedData.data;
}

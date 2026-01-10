import mongoose from "mongoose";
import { z } from "zod";

export const createProjectSchema = {
  body: z.object({
    emoji: z.string().trim().optional(),
    name: z
      .string()
      .trim()
      .min(3, "Project name must be at least 3 characters long")
      .max(255, "Project name must be at most 255 characters long"),
    description: z.string().trim().optional(),
  }),
};

export const updateProjectschema = {
  body: z.object({
    emoji: z.string().trim().optional(),
    name: z
      .string()
      .trim()
      .min(3, "Project name must be at least 3 characters long")
      .max(255, "Project name must be at most 255 characters long")
      .optional(),
    description: z.string().trim().optional(),
  }),
};

export const projectIdParamSchema = {
  params: z.object({
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspace id",
      }),
  }),
};

export type CreateProjectType = z.infer<typeof createProjectSchema.body>;
export type UpdateProjectType = z.infer<typeof updateProjectschema.body>;
export type ProjectIdParamType = z.infer<typeof projectIdParamSchema.params>;

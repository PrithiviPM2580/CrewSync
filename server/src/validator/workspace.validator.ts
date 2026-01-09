import mongoose from "mongoose";
import { z } from "zod";

export const createWorkSpaceSchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Workspace name must be at least 3 characters long")
      .max(255, "Workspace name must be at most 255 characters long"),
    description: z
      .string()
      .trim()
      .max(1024, "Description can be at most 1024 characters long")
      .optional(),
  }),
};

export const updateWorkSpaceSchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Workspace name must be at least 3 characters long")
      .max(255, "Workspace name must be at most 255 characters long")
      .optional(),
    description: z
      .string()
      .trim()
      .max(1024, "Description can be at most 1024 characters long")
      .optional(),
  }),
};

export const getWorkspaceById = {
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid workspace ID",
    }),
  }),
};

export type CreateWorkspaceType = z.infer<typeof createWorkSpaceSchema.body>;
export type UpdateWorkspaceType = z.infer<typeof updateWorkSpaceSchema.body>;
export type GetWorkspaceByIdType = z.infer<typeof getWorkspaceById.params>;

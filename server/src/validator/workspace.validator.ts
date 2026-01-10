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

export const changeRoleSchema = {
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid workspace ID",
    }),
  }),
  body: z.object({
    roleId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid role ID",
    }),
    memberId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid member ID",
    }),
  }),
};

export const updateWorkspaceSchema = {
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid workspace ID",
    }),
  }),
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

export type CreateWorkspaceType = z.infer<typeof createWorkSpaceSchema.body>;
export type UpdateWorkspaceType = z.infer<typeof updateWorkSpaceSchema.body>;
export type GetWorkspaceByIdType = z.infer<typeof getWorkspaceById.params>;
export type ChangeRoleParamsType = z.infer<typeof changeRoleSchema.params>;
export type ChangeRoleBodyType = z.infer<typeof changeRoleSchema.body>;
export type UpdateWorkspaceParamsType = z.infer<
  typeof updateWorkspaceSchema.params
>;
export type UpdateWorkspaceBodyType = z.infer<
  typeof updateWorkspaceSchema.body
>;

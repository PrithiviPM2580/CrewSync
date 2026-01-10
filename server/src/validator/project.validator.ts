import mongoose from "mongoose";
import { z } from "zod";

export const createProjectSchema = {
  params: z.object({
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspace id",
      }),
  }),
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

export const getAllprojectSchema = {
  params: z.object({
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspace id",
      }),
  }),
  query: z.object({
    pageSize: z.coerce.number().int().positive().optional(),
    pageNumber: z.coerce.number().int().positive().optional(),
  }),
};

export const getProjectByIdAndWorkspaceIdSchema = {
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid project id",
    }),
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspace id",
      }),
  }),
};

export const updateProjectWithParamsSchema = {
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid project id",
    }),
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspace id",
      }),
  }),
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

export type CreateProjectType = z.infer<typeof createProjectSchema>;
export type CreateProjectBodyType = z.infer<typeof createProjectSchema.body>;
export type CreateProjectParamsType = z.infer<
  typeof createProjectSchema.params
>;
export type UpdateProjectType = z.infer<typeof updateProjectschema.body>;
export type ProjectIdParamType = z.infer<typeof projectIdParamSchema.params>;
export type GetAllProjectType = z.infer<typeof getAllprojectSchema>;
export type GetAllProjectParamsType = z.infer<
  typeof getAllprojectSchema.params
>;
export type GetAllProjectQueryType = z.infer<typeof getAllprojectSchema.query>;
export type GetProjectByIdAndWorkspaceIdType = z.infer<
  typeof getProjectByIdAndWorkspaceIdSchema.params
>;

export type UpdateProjectWithParamsType = z.infer<
  typeof updateProjectWithParamsSchema
>;
export type UpdateProjectWithParamsBodyType = z.infer<
  typeof updateProjectWithParamsSchema.body
>;
export type UpdateProjectWithParamsParamsType = z.infer<
  typeof updateProjectWithParamsSchema.params
>;

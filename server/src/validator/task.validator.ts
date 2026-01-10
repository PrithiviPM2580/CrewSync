import { TaskPriorityEnum } from "@/enums/index.enum.js";
import mongoose from "mongoose";
import { z } from "zod";

export const createTaskSchema = {
  params: z.object({
    projectId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid projectId",
      }),
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspaceId",
      }),
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    description: z.string().trim().optional(),
    priority: z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]]),
    status: z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]]),
    assignedTo: z
      .string()
      .trim()
      .min(1, "AssignedTo is required")
      .nullable()
      .optional(),
    dueDate: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "DueDate must be a valid date string",
      }),
  }),
};

export const updateTaskSchema = {
  params: z.object({
    projectId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid projectId",
      }),
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspaceId",
      }),
    taskId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid taskId",
    }),
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters")
      .optional(),
    description: z.string().trim().optional(),
    priority: z
      .enum(Object.values(TaskPriorityEnum) as [string, ...string[]])
      .optional(),
    status: z
      .enum(Object.values(TaskPriorityEnum) as [string, ...string[]])
      .optional(),
    assignedTo: z
      .string()
      .trim()
      .min(1, "AssignedTo is required")
      .nullable()
      .optional(),
    dueDate: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "DueDate must be a valid date string",
      }),
  }),
};

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type CreateTaskBodyType = z.infer<typeof createTaskSchema.body>;
export type CreateTaskParamsType = z.infer<typeof createTaskSchema.params>;
export type UpdateTaskType = z.infer<typeof updateTaskSchema>;
export type UpdateTaskBodyType = z.infer<typeof updateTaskSchema.body>;
export type UpdateTaskParamsType = z.infer<typeof updateTaskSchema.params>;

import { TaskPriorityEnum, TaskStatusEnum } from "@/enums/index.enum.js";
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

export const getAllTasksSchema = {
  params: z.object({
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspaceId",
      }),
  }),
  query: z.object({
    projectId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid projectId",
      })
      .optional(),
    status: z
      .string()
      .transform((val) => val.split(","))
      .refine(
        (val) =>
          val.every((v) => Object.values(TaskStatusEnum).includes(v as any)),
        {
          message: "Invalid status values",
        }
      )
      .optional(),
    priority: z
      .string()
      .transform((val) => val.split(","))
      .refine(
        (val) =>
          val.every((v) => Object.values(TaskPriorityEnum).includes(v as any)),
        {
          message: "Invalid priority values",
        }
      )
      .optional(),
    assignedTo: z
      .string()
      .transform((val) => val.split(","))
      .refine((val) => val.every((v) => mongoose.Types.ObjectId.isValid(v)), {
        message: "Invalid assignedTo user IDs",
      })
      .optional(),
    keyword: z.string().trim().optional(),
    dueDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "DueDate must be a valid date string",
      })
      .optional(),
    pageSize: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val > 0 && val <= 100, {
        message: "pageSize must be between 1 and 100",
      })
      .optional(),
    pageNumber: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val > 0, {
        message: "pageNumber must be greater than 0",
      })
      .optional(),
  }),
};

export const getTaskByIdSchema = {
  params: z.object({
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspaceId",
      }),
    projectId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid projectId",
      }),
    taskId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid taskId",
    }),
  }),
};

export const deleteTaskSchema = {
  params: z.object({
    workspaceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workspaceId",
      }),
    taskId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid taskId",
    }),
  }),
};

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type CreateTaskBodyType = z.infer<typeof createTaskSchema.body>;
export type CreateTaskParamsType = z.infer<typeof createTaskSchema.params>;
export type UpdateTaskType = z.infer<typeof updateTaskSchema>;
export type UpdateTaskBodyType = z.infer<typeof updateTaskSchema.body>;
export type UpdateTaskParamsType = z.infer<typeof updateTaskSchema.params>;
export type GetAllTasksType = z.infer<typeof getAllTasksSchema>;
export type GetAllTasksParamsType = z.infer<typeof getAllTasksSchema.params>;
export type GetAllTasksQueryType = z.infer<typeof getAllTasksSchema.query>;
export type GetTaskByIdType = z.infer<typeof getTaskByIdSchema.params>;
export type DeleteTaskType = z.infer<typeof deleteTaskSchema.params>;

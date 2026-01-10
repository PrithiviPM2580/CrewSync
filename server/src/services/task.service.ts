import { TaskPriorityEnum, TaskStatusEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import Member from "@/models/member.model.js";
import Project from "@/models/project.model.js";
import Task from "@/models/task.model.js";
import type {
  CreateTaskBodyType,
  UpdateTaskBodyType,
} from "@/validator/task.validator.js";
import type { Types } from "mongoose";

export async function createTaskService(
  workspaceId: string,
  projectId: string,
  userId: Types.ObjectId,
  body: CreateTaskBodyType
) {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await Project.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId) {
    logger.error("Project not found or does not belong to the workspace", {
      label: "CreateTaskService",
      projectId,
      workspaceId,
    });
    throw new APIError(
      404,
      "Project not found or does not belong to the workspace"
    );
  }

  if (assignedTo) {
    const isAssignedUsermember = await Member.exists({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUsermember) {
      throw new APIError(400, "Assigned user is not a member of the workspace");
    }
  }

  const task = new Task({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
}

export async function updateTaskService(
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: UpdateTaskBodyType
) {
  const projects = await Project.findById(projectId);

  if (!projects || projects.workspace.toString() !== workspaceId) {
    logger.error("Project not found or does not belong to the workspace", {
      label: "UpdateTaskService",
      projectId,
      workspaceId,
    });
    throw new APIError(
      404,
      "Project not found or does not belong to the workspace"
    );
  }

  const task = await Task.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    logger.error("Task not found or does not belong to the project", {
      label: "UpdateTaskService",
      taskId,
      projectId,
    });
    throw new APIError(404, "Task not found or does not belong to the project");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      ...body,
    },
    { new: true }
  );

  if (!updatedTask) {
    logger.error("Failed to update task", {
      label: "UpdateTaskService",
      taskId,
    });
    throw new APIError(500, "Failed to update task");
  }

  return { updatedTask };
}

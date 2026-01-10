import type {
  CreateProjectBodyType,
  UpdateProjectWithParamsBodyType,
} from "@/validator/project.validator.js";
import Project from "@/models/project.model.js";
import { Types } from "mongoose";
import logger from "@/lib/logger.lib.js";
import { APIError } from "@/lib/error-handler.lib.js";
import { TaskStatusEnum } from "@/enums/index.enum.js";
import Task from "@/models/task.model.js";

export async function createProjectService(
  userId: Types.ObjectId,
  workspaceId: string,
  body: CreateProjectBodyType
) {
  const { emoji, name, description } = body;

  const project = new Project({
    name: name,
    description: description,
    emoji: emoji,
    workspace: workspaceId,
    createBy: userId,
  });

  await project.save();

  return {
    project,
  };
}

export async function getAllProjectsService(
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) {
  const totalCount = await Project.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await Project.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate("createBy", "_id name profilePicture")
    .lean();

  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    projects,
    totalCount,
    totalPages,
    skip,
  };
}

export async function getProjectByIdAndWorkspaceIdService(
  projectId: string,
  workspaceId: string
) {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    logger.error(`Project ${projectId} not found in workspace ${workspaceId}`, {
      label: "ProjectService",
    });
    throw new APIError(404, "Project not found");
  }

  return { project };
}

export async function getProjectAnalyticsService(
  projectId: string,
  workspaceId: string
) {
  const project = await Project.findById(projectId).lean();

  if (!project || project.workspace.toString() !== workspaceId) {
    logger.error(`Project ${projectId} not found in workspace ${workspaceId}`, {
      label: "ProjectService",
    });
    throw new APIError(404, "Project not found");
  }

  const currentDate = new Date();

  const taskAnalytics = await Project.aggregate([
    {
      $match: {
        project: new Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: {
                $ne: TaskStatusEnum.DONE,
              },
            },
          },
          {
            $count: "count",
          },
        ],
        completedTasks: [
          {
            $match: { status: TaskStatusEnum.DONE },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const _analytics = taskAnalytics[0];

  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };

  return { analytics };
}

export async function updateProjectService(
  workspaceId: string,
  projectId: string,
  body: UpdateProjectWithParamsBodyType
) {
  const { emoji, name, description } = body;
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    logger.error(`Project ${projectId} not found in workspace ${workspaceId}`, {
      label: "ProjectService",
    });
    throw new APIError(404, "Project not found");
  }

  if (emoji !== undefined) project.emoji = emoji;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;

  await project.save();

  return { project };
}

export async function deleteProjectService(
  workspaceId: string,
  projectId: string
) {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    logger.error(`Project ${projectId} not found in workspace ${workspaceId}`, {
      label: "ProjectService",
    });
    throw new APIError(404, "Project not found");
  }

  await project.deleteOne();

  await Task.deleteMany({ project: project._id });

  return project;
}

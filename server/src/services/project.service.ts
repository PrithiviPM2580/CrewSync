import type { CreateProjectBodyType } from "@/validator/project.validator.js";
import Project from "@/models/project.model.js";
import type { Types } from "mongoose";
import logger from "@/lib/logger.lib.js";
import { APIError } from "@/lib/error-handler.lib.js";

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

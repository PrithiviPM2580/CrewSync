import type { CreateProjectBodyType } from "@/validator/project.validator.js";
import Project from "@/models/project.model.js";
import type { Types } from "mongoose";

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

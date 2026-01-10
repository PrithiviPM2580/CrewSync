import type { CreateProjectType } from "@/validator/project.validator.js";
import Project from "@/models/project.model.js";
import type { Types } from "mongoose";

export async function createProjectService(
  userId: Types.ObjectId,
  workspaceId: string,
  body: CreateProjectType
) {
  const { emoji, name, description } = body;

  const project = new Project({
    name: name,
    description: description,
    emoji: emoji,
    workspaceId: workspaceId,
    createdBy: userId,
  });

  await project.save();

  return {
    project,
  };
}

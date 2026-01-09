import { RoleEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import Member from "@/models/member.model.js";
import Role from "@/models/role.model.js";
import User from "@/models/user.model.js";
import Workspace from "@/models/workspace.model.js";
import type { CreateWorkspaceType } from "@/validator/workspace.validator.js";
import type { Types } from "mongoose";

export async function createWorkspaceService(
  userId: Types.ObjectId,
  body: CreateWorkspaceType
) {
  const { name, description } = body;

  const user = await User.findById(userId);

  if (!user) {
    logger.error(`User with id ${userId} not found`, {
      label: "WorkspaceService",
    });
    throw new APIError(404, "User not found");
  }

  const ownerRole = await Role.findOne({ name: RoleEnum.OWNER });

  if (!ownerRole) {
    logger.error(`Owner role not found in the database`, {
      label: "WorkspaceService",
    });
    throw new APIError(500, "Internal server error");
  }

  const workspace = new Workspace({
    name: name,
    description: description,
    owner: user._id,
  });

  await workspace.save();

  const member = new Member({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });

  await member.save();

  user.currentWorkspace = workspace._id;
  await user.save();

  return {
    workspace,
  };
}

import type { Types } from "mongoose";
import Workspace from "@/models/workspace.model.js";
import logger from "@/lib/logger.lib.js";
import { APIError } from "@/lib/error-handler.lib.js";
import Member from "@/models/member.model.js";

export async function getMemberRoleInWorkspace(
  userId: Types.ObjectId,
  workspaceId: string
) {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    logger.error(`Workspace with id ${workspaceId} not found`, {
      label: "MemberService",
    });
    throw new APIError(404, "Workspace not found");
  }

  const member = await Member.findOne({ userId, workspaceId }).populate("role");

  if (!member) {
    logger.error(
      `Member with user id ${userId} not found in workspace ${workspaceId}`,
      {
        label: "MemberService",
      }
    );
    throw new APIError(404, "Member not found in the workspace");
  }

  const roleName = member.role?.name;
  return { role: roleName };
}

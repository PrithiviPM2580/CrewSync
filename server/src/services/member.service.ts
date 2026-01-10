import type { Types } from "mongoose";
import Workspace from "@/models/workspace.model.js";
import logger from "@/lib/logger.lib.js";
import { APIError } from "@/lib/error-handler.lib.js";
import Member from "@/models/member.model.js";
import Role from "@/models/role.model.js";
import { RolePermissions } from "@/utils/index.util.js";

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

export async function joinWorkspaceByInviteCodeService(
  userId: Types.ObjectId,
  inviteCode: string
) {
  const workspace = await Workspace.findOne({ inviteCode });

  if (!workspace) {
    logger.error(`Invalid invite code: ${inviteCode}`, {
      label: "MemberService",
    });
    throw new APIError(404, "Invalid invite code");
  }

  const existingMember = await Member.findOne({
    userId,
    workspaceId: workspace._id,
  });

  if (existingMember) {
    logger.error(
      `User ${userId} is already a member of workspace ${workspace._id}`,
      {
        label: "MemberService",
      }
    );
    throw new APIError(400, "User is already a member of the workspace");
  }

  const role = await Role.findOne({ name: RolePermissions.MEMBER });

  if (!role) {
    logger.error(`Default member role not found`, {
      label: "MemberService",
    });
    throw new APIError(500, "Default member role not found");
  }

  const newMember = new Member({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });

  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
}

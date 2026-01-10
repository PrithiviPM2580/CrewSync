import logger from "@/lib/logger.lib.js";
import { successResponse } from "@/utils/index.util.js";
import type { NextFunction, Request, Response } from "express";
import { joinWorkspaceByInviteCodeService } from "@/services/member.service.js";
import { APIError } from "@/lib/error-handler.lib.js";

export async function joinWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const inviteCode = req.params.inviteCode!;
  const userId = req.user?._id;

  if (!userId) {
    logger.error("User ID not found in request", {
      label: "JoinWorkspaceController",
    });
    return next(new APIError(401, "User not authenticated"));
  }

  const { workspaceId, role } = await joinWorkspaceByInviteCodeService(
    userId,
    inviteCode
  );

  logger.info(
    `User ${userId} joined workspace ${workspaceId} with role ${role}`,
    {
      label: "JoinWorkspaceController",
    }
  );

  successResponse(res, 200, "Joined workspace successfully", {
    workspaceId,
    role,
  });
}

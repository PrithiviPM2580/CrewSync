import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import User from "@/models/user.model.js";
import type { Types } from "mongoose";

export async function currentUserService(userId: Types.ObjectId) {
  const user = await User.findById(userId)
    .populate("currentWorkspace")
    .select("-password -__v")
    .lean();

  if (!user) {
    logger.error(`User with ID: ${userId} not found`, {
      label: "CurrentUserService",
    });
    throw new APIError(404, "User not found", true);
  }

  return {
    user,
  };
}

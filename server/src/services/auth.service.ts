import { RoleEnum } from "@/enums/index.enum.js";
import { APIError } from "@/lib/error-handler.lib.js";
import logger from "@/lib/logger.lib.js";
import Account from "@/models/account.model.js";
import Member from "@/models/member.model.js";
import Role from "@/models/role.model.js";
import User from "@/models/user.model.js";
import Workspace from "@/models/workspace.model.js";
import mongoose from "mongoose";

export async function googleAccountService(data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string | undefined;
  email?: string | undefined;
}) {
  const { provider, displayName, providerId, picture, email } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    logger.info("Starting database session for Google account service", {
      label: "AuthService",
    });

    if (!email) {
      logger.error("Email not provided by Google", { label: "AuthService" });
      throw new APIError(400, "Email is required");
    }

    let user = await User.findOne({ email }).session(session);

    if (!user) {
      user = new User({
        email,
        name: displayName,
        profilePicture: picture || null,
      });

      await user.save({ session });

      const account = new Account({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });

      await account.save({ session });

      const workspace = new Workspace({
        name: `${displayName}'s Workspace`,
        description: `Workspace created for user ${displayName}`,
        owner: user._id,
      });

      await workspace.save({ session });

      const ownerRole = await Role.findOne({
        name: RoleEnum.OWNER,
      }).session(session);

      if (!ownerRole) {
        logger.error("Owner role not found in database", {
          label: "AuthService",
        });
        throw new APIError(500, "Owner role not found in database");
      }

      const member = new Member({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });

      await member.save({ session });

      user.currentWorkspace = workspace._id;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    logger.info(
      "Database session for Google account service committed successfully",
      {
        label: "AuthService",
      }
    );
    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(
      "Database session for Google account service aborted due to error",
      {
        label: "AuthService",
      }
    );
    throw new APIError(500, "Internal Server Error");
  }
}

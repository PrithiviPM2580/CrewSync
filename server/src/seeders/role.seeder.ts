import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "@/config/db.config.js";
import Role from "@/models/role.model.js";
import { RolePermissions } from "@/utils/index.util.js";
import logger from "@/lib/logger.lib.js";

export async function sendRolesSeeder() {
  try {
    await connectToDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    logger.info("Clearing existing roles...");
    await Role.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      const existingRole = await Role.findOne({ name: role }).session(session);
      if (!existingRole) {
        const newRole = new Role({
          name: role,
          permissions: permissions,
        });

        await newRole.save({ session });
        logger.info(
          `Role '${role}' created with permissions: ${JSON.stringify(
            permissions
          )}`
        );
      }
      logger.info(`Role '${role}' already exists. Skipping creation.`);
    }

    await session.commitTransaction();
    logger.info("Transaction committed. Roles seeding completed.");
    session.endSession();
    logger.info("Session ended.");

    logger.info("Roles seeding process finished.");
  } catch (error) {
    logger.error(`Roles seeding failed: ${(error as Error).message}`);
    throw new Error(`Roles seeding failed: ${(error as Error).message}`);
  }
}

sendRolesSeeder().catch((error) => {
  console.error("Error during roles seeding:", error);
});

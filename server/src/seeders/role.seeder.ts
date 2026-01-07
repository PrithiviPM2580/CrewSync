import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "@/config/db.config.js";
import Role from "@/models/role.model.js";
import { RolePermissions } from "@/utils/index.util.js";

export async function sendRolesSeeder() {
  try {
    await connectToDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("Clearing existing roles...");
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
        console.log(`Role '${role}' created with permissions:`, permissions);
      }
      console.log(`Role '${role}' already exists. Skipping creation.`);
    }

    await session.commitTransaction();
    console.log("Transaction committed. Roles seeding completed.");
    session.endSession();
    console.log("Session ended.");

    console.log("Roles seeding process finished.");
  } catch (error) {
    throw new Error(`Roles seeding failed: ${(error as Error).message}`);
  }
}

sendRolesSeeder().catch((error) => {
  console.error("Error during roles seeding:", error);
});

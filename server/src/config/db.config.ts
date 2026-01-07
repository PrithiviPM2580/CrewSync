import mongoose from "mongoose";
import { APIError } from "@/lib/error-handler.lib.js";
import config from "./env.config.js";
import logger from "@/lib/logger.lib.js";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", (error as Error).message);
    throw new APIError(500, "Failed to connect to MongoDB", false, {
      type: "DatabaseConnectionError",
      details: [
        {
          field: "MONGODB_URI",
          message: (error as Error).message,
        },
      ],
    });
  }
}

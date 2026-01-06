import mongoose from "mongoose";
import { APIError } from "@/lib/error-handler.lib.js";
import config from "./env.config.js";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
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

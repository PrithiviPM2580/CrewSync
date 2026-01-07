import app from "@/app.js";
import config from "@/config/env.config.js";
import connectToDatabase from "./config/db.config.js";
import logger from "./lib/logger.lib.js";

const PORT = config.PORT || 3000;

export default async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}

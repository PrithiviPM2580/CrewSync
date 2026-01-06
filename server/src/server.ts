import app from "@/app.js";
import config from "@/config/env.config.js";
import connectToDatabase from "./config/db.config.js";

const PORT = config.PORT || 3000;

export default async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running in http://localhost:${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}

import app from "@/app.js";
import config from "@/config/env.config.js";

const PORT = config.PORT || 3000;

export default function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running in http://localhost:${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}

import express, { type Express } from "express";
import cors from "cors";
import session from "cookie-session";
import config from "./config/env.config.js";
import routes from "@/routes/index.route.js";
import globalErrorHandler from "@/middlewares/global-error-handler.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(routes);

app.use(globalErrorHandler);

export default app;

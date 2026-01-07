import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import config from "./config/env.config.js";
import routes from "@/routes/index.route.js";
import globalErrorHandler from "@/middlewares/global-error-handler.middleware.js";
import passport from "@/lib/passport.lib.js";

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
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use(globalErrorHandler);

export default app;

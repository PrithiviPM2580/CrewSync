import config from "@/config/env.config.js";
import { successResponse } from "@/utils/index.util.js";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose from "mongoose";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { APIError } from "@/lib/error-handler.lib.js";
import authRoute from "@/routes/auth.route.js";

const router: Router = Router();

router.route("/").get(
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    successResponse(res, 200, "CrewSync API is running", {
      appName: config.APP_NAME,
      status: process.uptime() > 0 ? "Running" : "Stopped",
      version: config.APP_VERSION,
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  })
);

router.route("/health").get(
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const dbState =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    successResponse(res, 200, "Health Check Successful", {
      appName: config.APP_NAME,
      service: "CrewSync API",
      status: "ok",
      environment: config.NODE_ENV,
      database: dbState,
      timestamp: new Date().toISOString(),
      memoryUsage: `${process.memoryUsage().heapUsed / 1024 / 1024} MB`,
    });
  })
);

router.use("/api/v1/auth", authRoute);

router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new APIError(404, "Route Not Found", true));
});
export default router;

import config from "@/config/env.config.js";
import { successResponse } from "@/utils/index.util.js";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose from "mongoose";

const router: Router = Router();

router.route("/").get((_req: Request, res: Response, next: NextFunction) => {
  try {
    successResponse(res, 200, "CrewSync API is running", {
      appName: config.APP_NAME,
      status: process.uptime() > 0 ? "Running" : "Stopped",
      version: config.APP_VERSION,
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

router
  .route("/health")
  .get((_req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
      next(error);
    }
  });

router.use((_req: Request, res: Response, next: NextFunction) => {
  try {
    successResponse(res, 404, "Route not found");
  } catch (error) {
    next(error);
  }
});
export default router;

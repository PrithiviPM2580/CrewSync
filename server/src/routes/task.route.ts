import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import { Router } from "express";
import { createTaskController } from "@/controllers/task.controller.js";
import { createTaskSchema } from "@/validator/task.validator.js";

const router: Router = Router();

router
  .route("/projects/:projectId/workspace/:workspaceId/create")
  .post(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(createTaskSchema),
    asyncHandler(createTaskController)
  );

export default router;

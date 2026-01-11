import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import { Router } from "express";
import {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTaskByIdController,
} from "@/controllers/task.controller.js";
import {
  createTaskSchema,
  getAllTasksSchema,
  getTaskByIdSchema,
  updateTaskSchema,
} from "@/validator/task.validator.js";

const router: Router = Router();

router
  .route("/projects/:projectId/workspace/:workspaceId/create")
  .post(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(createTaskSchema),
    asyncHandler(createTaskController)
  );

router
  .route("/:id/project/:projectId/workspace/:workspaceId/update")
  .put(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(updateTaskSchema),
    asyncHandler(updateTaskController)
  );

router
  .route("/workspace/:workspaceId/all")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getAllTasksSchema),
    asyncHandler(getAllTasksController)
  );

router
  .route("/:id/project/:projectId/workspace/:workspaceId")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getTaskByIdSchema),
    asyncHandler(getTaskByIdController)
  );

export default router;

import {
  createProjectController,
  getAllprojectsController,
  getProjectByIdAndWorkspaceIdController,
  getProjectAnalyticsController,
  updateProjectController,
} from "@/controllers/project.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import {
  createProjectSchema,
  getAllprojectSchema,
  getProjectByIdAndWorkspaceIdSchema,
  updateProjectWithParamsSchema,
} from "@/validator/project.validator.js";
import { Router } from "express";

const router: Router = Router();

router
  .route("/workspace/:workspaceId/create")
  .post(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(createProjectSchema),
    asyncHandler(createProjectController)
  );

router
  .route("/workspace/:workspaceId/all")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getAllprojectSchema),
    asyncHandler(getAllprojectsController)
  );

router
  .route("/:id/workspace/:workspaceId")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getProjectByIdAndWorkspaceIdSchema),
    asyncHandler(getProjectByIdAndWorkspaceIdController)
  );

router
  .route("/:id/workspace/:workspaceId/analytics")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getProjectByIdAndWorkspaceIdSchema),
    asyncHandler(getProjectAnalyticsController)
  );

router
  .route("/:id/workspace/:workspaceId/update")
  .put(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(updateProjectWithParamsSchema),
    asyncHandler(updateProjectController)
  );

export default router;

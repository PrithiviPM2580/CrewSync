import {
  createProjectController,
  getAllprojectsController,
  getProjectByIdAndWorkspaceIdController,
} from "@/controllers/project.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import {
  createProjectSchema,
  getAllprojectSchema,
  getProjectByIdAndWorkspaceIdSchema,
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

export default router;

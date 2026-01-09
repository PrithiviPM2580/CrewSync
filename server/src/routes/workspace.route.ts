import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
} from "@/controllers/workspace.controller.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import {
  createWorkSpaceSchema,
  getWorkspaceById,
} from "@/validator/workspace.validator.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";

const router: Router = Router();

router
  .route("/create/new")
  .post(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(createWorkSpaceSchema),
    asyncHandler(createWorkspaceController)
  );

router
  .route("/all")
  .get(
    apiLimitter,
    isAuthenticated,
    asyncHandler(getAllWorkspacesUserIsMemberController)
  );

router
  .route("/:id")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getWorkspaceById),
    asyncHandler(getWorkspaceByIdController)
  );

export default router;

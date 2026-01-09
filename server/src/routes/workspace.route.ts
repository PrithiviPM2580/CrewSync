import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
} from "@/controllers/workspace.controller.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import { createWorkSpaceSchema } from "@/validator/workspace.validator.js";
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

export default router;

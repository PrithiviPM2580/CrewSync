import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  getWorkspaceAnalyticsController,
  changeWorkspaceMemberRoleController,
  updateWorkspaceByIdController,
  deleteWorkspaceByIdController,
} from "@/controllers/workspace.controller.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import {
  changeRoleSchema,
  createWorkSpaceSchema,
  getWorkspaceById,
  updateWorkspaceSchema,
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

router
  .route("/members/:id")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getWorkspaceById),
    asyncHandler(getWorkspaceMembersController)
  );

router
  .route("/analytics/:id")
  .get(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getWorkspaceById),
    asyncHandler(getWorkspaceAnalyticsController)
  );

router
  .route("/change/member/role/:id")
  .put(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(changeRoleSchema),
    asyncHandler(changeWorkspaceMemberRoleController)
  );

router
  .route("/update/:id")
  .put(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(updateWorkspaceSchema),
    asyncHandler(updateWorkspaceByIdController)
  );

router
  .route("/delete/:id")
  .delete(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(getWorkspaceById),
    asyncHandler(deleteWorkspaceByIdController)
  );

export default router;

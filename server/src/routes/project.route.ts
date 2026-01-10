import { createProjectController } from "@/controllers/project.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";
import { createProjectSchema } from "@/validator/project.validator.js";
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

export default router;
